'use server';

import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { createPost, updatePost as updatePostData, deletePost as deletePostData, getPostById } from './posts';
import { suggestTags as suggestTagsAI } from '@/ai/flows/suggest-tags';
import type { BlogPost } from './types';

const PostSchema = z.object({
  title: z.string().min(3, { message: "Title must be at least 3 characters long." }),
  content: z.string().min(10, { message: "Content must be at least 10 characters long." }),
  author: z.string().min(2, { message: "Author name must be at least 2 characters long." }),
  tags: z.array(z.string()).optional(),
});

export type FormState = {
  message: string;
  errors?: {
    title?: string[];
    content?: string[];
    author?: string[];
    tags?: string[];
  };
  fieldValues?: {
    title: string;
    content: string;
    author: string;
    tags: string[];
  }
} | undefined;


export async function createPostAction(prevState: FormState, formData: FormData): Promise<FormState> {
  const validatedFields = PostSchema.safeParse({
    title: formData.get('title'),
    content: formData.get('content'),
    author: formData.get('author'),
    tags: formData.getAll('tags').filter(tag => typeof tag === 'string' && tag.trim() !== '') as string[],
  });

  if (!validatedFields.success) {
    return {
      message: "Validation failed. Please check your input.",
      errors: validatedFields.error.flatten().fieldErrors,
      fieldValues: {
        title: formData.get('title') as string || '',
        content: formData.get('content') as string || '',
        author: formData.get('author') as string || '',
        tags: formData.getAll('tags').filter(tag => typeof tag === 'string' && tag.trim() !== '') as string[],
      }
    };
  }

  try {
    const newPost = await createPost({
      ...validatedFields.data,
      tags: validatedFields.data.tags || []
    });
    revalidatePath('/');
    revalidatePath(`/posts/${newPost.id}`);
  } catch (error) {
    return { message: "Failed to create post. Please try again." };
  }
  redirect(`/posts/${(await getPosts())[0].id}`); // Redirect to the newest post, assuming ID generation is sequential or timestamp based
}

export async function updatePostAction(id: string, prevState: FormState, formData: FormData): Promise<FormState> {
  const validatedFields = PostSchema.safeParse({
    title: formData.get('title'),
    content: formData.get('content'),
    author: formData.get('author'),
    tags: formData.getAll('tags').filter(tag => typeof tag === 'string' && tag.trim() !== '') as string[],
  });

  if (!validatedFields.success) {
     return {
      message: "Validation failed. Please check your input.",
      errors: validatedFields.error.flatten().fieldErrors,
      fieldValues: {
        title: formData.get('title') as string || '',
        content: formData.get('content') as string || '',
        author: formData.get('author') as string || '',
        tags: formData.getAll('tags').filter(tag => typeof tag === 'string' && tag.trim() !== '') as string[],
      }
    };
  }
  
  try {
    const updatedPost = await updatePostData(id, {
      ...validatedFields.data,
      tags: validatedFields.data.tags || []
    });
    if (!updatedPost) {
      return { message: "Post not found or failed to update." };
    }
    revalidatePath('/');
    revalidatePath(`/posts/${id}`);
  } catch (error) {
     return { message: "Failed to update post. Please try again." };
  }
  redirect(`/posts/${id}`);
}

export async function deletePostAction(id: string): Promise<{message: string} | void> {
  try {
    const success = await deletePostData(id);
    if (!success) {
      return { message: "Post not found or failed to delete." };
    }
    revalidatePath('/');
  } catch (error) {
    return { message: "Failed to delete post. Please try again." };
  }
  redirect('/');
}

export async function suggestTagsAction(blogPostContent: string): Promise<{ tags?: string[]; error?: string }> {
  if (!blogPostContent.trim()) {
    return { error: "Blog content cannot be empty." };
  }
  try {
    const result = await suggestTagsAI({ blogPostContent });
    return { tags: result.tags };
  } catch (error) {
    console.error("AI Tag suggestion failed:", error);
    return { error: "Failed to suggest tags. Please try again." };
  }
}
