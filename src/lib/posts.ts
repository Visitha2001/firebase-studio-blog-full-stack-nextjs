import type { BlogPost } from './types';

// In-memory store for blog posts
let posts: BlogPost[] = [
  {
    id: '1',
    title: 'My First Journey into Echo Blog',
    content: 'This is the beginning of a beautiful story. Echo Blog allows us to share thoughts, ideas, and narratives with the world. The clean interface and intuitive design make it a pleasure to write and read. I am excited to see how this platform evolves and what amazing content will be created here. The Literata font gives a classic touch, while Space Grotesk for headlines keeps it modern.',
    author: 'Alex Writer',
    tags: ['introduction', 'blogging', 'nexjst'],
    createdAt: new Date('2024-07-15T10:00:00Z'),
    updatedAt: new Date('2024-07-15T10:00:00Z'),
  },
  {
    id: '2',
    title: 'The Art of Minimalist Design',
    content: 'Minimalism in web design is not just about less, it\'s about conveying more with precision. Echo Blog embodies this philosophy with its soft sage background and forest green accents, creating a calm and focused reading experience. Ample whitespace is key, allowing content to breathe and readers to engage without distraction. We will explore how these principles enhance user experience.',
    author: 'Jamie Designer',
    tags: ['design', 'minimalism', 'ux'],
    createdAt: new Date('2024-07-18T14:30:00Z'),
    updatedAt: new Date('2024-07-19T09:15:00Z'),
  },
  {
    id: '3',
    title: 'AI-Powered Tagging: A New Era for Content Organization',
    content: 'Integrating GenAI for tag suggestions is a game-changer. This feature helps authors quickly categorize their posts, improving discoverability and SEO. In this post, we dive into how Echo Blog leverages AI to analyze content and propose relevant tags, making content management more efficient and effective. The muted gold accent for such features subtly highlights their importance.',
    author: 'Casey Coder',
    tags: ['ai', 'genai', 'content strategy', 'seo'],
    createdAt: new Date('2024-07-22T11:20:00Z'),
    updatedAt: new Date('2024-07-22T11:20:00Z'),
  },
];

export async function getPosts(): Promise<BlogPost[]> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 50));
  return posts.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
}

export async function getPostById(id: string): Promise<BlogPost | undefined> {
  await new Promise(resolve => setTimeout(resolve, 50));
  return posts.find(post => post.id === id);
}

export async function createPost(data: Omit<BlogPost, 'id' | 'createdAt' | 'updatedAt'>): Promise<BlogPost> {
  await new Promise(resolve => setTimeout(resolve, 100));
  const newPost: BlogPost = {
    ...data,
    id: String(Date.now()), // Simple ID generation
    createdAt: new Date(),
    updatedAt: new Date(),
  };
  posts.push(newPost);
  return newPost;
}

export async function updatePost(id: string, data: Partial<Omit<BlogPost, 'id' | 'createdAt' | 'updatedAt'>>): Promise<BlogPost | undefined> {
  await new Promise(resolve => setTimeout(resolve, 100));
  const postIndex = posts.findIndex(post => post.id === id);
  if (postIndex === -1) {
    return undefined;
  }
  posts[postIndex] = {
    ...posts[postIndex],
    ...data,
    updatedAt: new Date(),
  };
  return posts[postIndex];
}

export async function deletePost(id: string): Promise<boolean> {
  await new Promise(resolve => setTimeout(resolve, 100));
  const initialLength = posts.length;
  posts = posts.filter(post => post.id !== id);
  return posts.length < initialLength;
}
