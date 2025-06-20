import { getPostById } from '@/lib/posts';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ArrowLeft, Edit3, User, CalendarDays, Tag } from 'lucide-react';
import { DeletePostButton } from '@/components/DeletePostButton'; // Import the client component

export async function generateMetadata({ params }: { params: { id: string } }) {
  const post = await getPostById(params.id);
  if (!post) {
    return { title: 'Post Not Found' };
  }
  return {
    title: `${post.title} | Echo Blog`,
    description: post.content.substring(0, 160),
  };
}

export default async function PostPage({ params }: { params: { id: string } }) {
  const post = await getPostById(params.id);

  if (!post) {
    notFound();
  }

  return (
    <div className="max-w-3xl mx-auto">
      <Button variant="outline" asChild className="mb-6 group">
        <Link href="/">
          <ArrowLeft className="mr-2 h-4 w-4 group-hover:-translate-x-1 transition-transform" />
          Back to Posts
        </Link>
      </Button>

      <Card className="shadow-xl overflow-hidden">
        <CardHeader className="bg-primary/5 p-8">
          <CardTitle className="text-4xl font-headline text-primary mb-3">{post.title}</CardTitle>
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-muted-foreground">
            <div className="flex items-center">
              <User className="mr-1.5 h-5 w-5 text-primary" />
              <span>{post.author}</span>
            </div>
            <div className="flex items-center">
              <CalendarDays className="mr-1.5 h-5 w-5 text-primary" />
              <time dateTime={post.createdAt.toISOString()}>
                {new Date(post.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
              </time>
            </div>
          </div>
        </CardHeader>

        <Separator />

        <CardContent className="p-8 prose prose-lg max-w-none dark:prose-invert prose-headings:font-headline prose-headings:text-primary prose-p:font-body prose-p:text-foreground/90 prose-p:leading-relaxed prose-a:text-primary hover:prose-a:text-accent">
          {/* Using a div for content ensures Tailwind typography (prose) applies correctly */}
          <div dangerouslySetInnerHTML={{ __html: post.content.replace(/\n/g, '<br />') }} />
        </CardContent>
        
        {post.tags && post.tags.length > 0 && (
          <>
            <Separator />
            <div className="p-8">
              <h3 className="text-lg font-semibold mb-3 font-headline text-primary">Tags</h3>
              <div className="flex flex-wrap gap-2">
                {post.tags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="text-sm bg-accent/20 text-accent-foreground hover:bg-accent/30">
                     <Tag className="mr-1 h-3 w-3" />
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          </>
        )}

        <Separator />
        <CardFooter className="bg-primary/5 p-6 flex flex-col sm:flex-row justify-end items-center gap-3">
          <Button variant="outline" asChild size="sm">
            <Link href={`/posts/${post.id}/edit`}>
              <Edit3 className="mr-2 h-4 w-4" />
              Edit
            </Link>
          </Button>
          <DeletePostButton postId={post.id} postTitle={post.title} />
        </CardFooter>
      </Card>
    </div>
  );
}

export const revalidate = 60; // Revalidate post page every 60 seconds
