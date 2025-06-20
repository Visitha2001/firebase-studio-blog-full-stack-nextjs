import { getPosts } from '@/lib/posts';
import { BlogPostCard } from '@/components/BlogPostCard';

export default async function HomePage() {
  const posts = await getPosts();

  return (
    <div className="space-y-8">
      <h1 className="text-4xl font-bold text-center font-headline text-primary">Welcome to Echo Blog</h1>
      <p className="text-center text-lg text-muted-foreground mb-12">
        Discover inspiring stories, insightful articles, and creative expressions.
      </p>
      {posts.length === 0 ? (
        <p className="text-center text-muted-foreground">No posts yet. Be the first to write one!</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.map((post) => (
            <BlogPostCard key={post.id} post={post} />
          ))}
        </div>
      )}
    </div>
  );
}

export const revalidate = 60; // Revalidate every 60 seconds
