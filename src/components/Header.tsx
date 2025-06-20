import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { PlusCircle, Edit } from 'lucide-react';

export function Header() {
  return (
    <header className="bg-card border-b border-border shadow-sm sticky top-0 z-40">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link href="/" className="text-2xl font-headline font-bold text-primary hover:text-primary/80 transition-colors" aria-label="Echo Blog Home">
          Echo Blog
        </Link>
        <Button asChild variant="outline" className="text-primary border-primary hover:bg-primary/10">
          <Link href="/posts/new">
            <Edit className="mr-2 h-4 w-4" />
            New Post
          </Link>
        </Button>
      </div>
    </header>
  );
}
