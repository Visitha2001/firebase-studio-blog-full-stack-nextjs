import { getPostById } from '@/lib/posts';
import { notFound } from 'next/navigation';
import { PostForm } from '@/components/PostForm';
import { updatePostAction } from '@/lib/actions';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

export async function generateMetadata({ params }: { params: { id: string } }) {
  const post = await getPostById(params.id);
  if (!post) {
    return { title: 'Post Not Found' };
  }
  return {
    title: `Edit: ${post.title} | Echo Blog`,
  };
}

export default async function EditPostPage({ params }: { params: { id: string } }) {
  const post = await getPostById(params.id);

  if (!post) {
    notFound();
  }

  const updatePostWithId = updatePostAction.bind(null, post.id);

  return (
    <div>
       <Button variant="outline" asChild className="mb-6 group">
        <Link href={`/posts/${post.id}`}>
          <ArrowLeft className="mr-2 h-4 w-4 group-hover:-translate-x-1 transition-transform" />
          Back to Post
        </Link>
      </Button>
      <PostForm
        action={updatePostWithId}
        initialData={post}
        formTitle="Refine Your Story"
        submitButtonText="Save Changes"
      />
    </div>
  );
}
