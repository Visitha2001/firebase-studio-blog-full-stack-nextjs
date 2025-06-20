import Link from 'next/link';
import type { BlogPost } from '@/lib/types';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { User, CalendarDays, Tag } from 'lucide-react';

interface BlogPostCardProps {
  post: BlogPost;
}

export function BlogPostCard({ post }: BlogPostCardProps) {
  const snippet = post.content.length > 150 ? post.content.substring(0, 150) + '...' : post.content;

  return (
    <Card className="w-full shadow-lg hover:shadow-xl transition-shadow duration-300 ease-in-out">
      <CardHeader>
        <Link href={`/posts/${post.id}`} className="hover:underline">
          <CardTitle className="text-2xl font-headline text-primary">{post.title}</CardTitle>
        </Link>
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-muted-foreground mt-2">
          <div className="flex items-center">
            <User className="mr-1.5 h-4 w-4" />
            <span>{post.author}</span>
          </div>
          <div className="flex items-center">
            <CalendarDays className="mr-1.5 h-4 w-4" />
            <time dateTime={post.createdAt.toISOString()}>
              {new Date(post.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
            </time>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <CardDescription className="text-foreground/80 leading-relaxed">{snippet}</CardDescription>
         {post.tags && post.tags.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2">
            {post.tags.map((tag) => (
              <Badge key={tag} variant="secondary" className="bg-accent/20 text-accent-foreground hover:bg-accent/30">
                <Tag className="mr-1 h-3 w-3" />
                {tag}
              </Badge>
            ))}
          </div>
        )}
      </CardContent>
      <CardFooter>
        <Button asChild variant="link" className="text-primary p-0 hover:text-accent">
          <Link href={`/posts/${post.id}`}>Read More &rarr;</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
