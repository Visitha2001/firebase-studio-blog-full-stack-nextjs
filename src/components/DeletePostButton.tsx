'use client';

import { useState } from 'react';
import { deletePostAction } from '@/lib/actions';
import { Button } from '@/components/ui/button';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Trash2, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useFormStatus } from 'react-dom'; // Import useFormStatus

interface DeletePostButtonProps {
  postId: string;
  postTitle: string;
}

function DeleteFormContent({ postId, postTitle, onActionComplete }: { postId: string, postTitle: string, onActionComplete: () => void }) {
  const { pending } = useFormStatus();
  const { toast } = useToast();

  const handleDelete = async () => {
    const result = await deletePostAction(postId);
    if (result?.message) {
      toast({
        title: "Error Deleting Post",
        description: result.message,
        variant: "destructive",
      });
    } else {
       toast({
        title: "Post Deleted",
        description: `"${postTitle}" has been successfully deleted.`,
      });
    }
    onActionComplete(); // Close dialog or handle UI updates
  };

  return (
    <>
      <AlertDialogHeader>
        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
        <AlertDialogDescription>
          This action cannot be undone. This will permanently delete the post titled "{postTitle}".
        </AlertDialogDescription>
      </AlertDialogHeader>
      <AlertDialogFooter>
        <AlertDialogCancel disabled={pending}>Cancel</AlertDialogCancel>
        <AlertDialogAction onClick={handleDelete} disabled={pending} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
          {pending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Trash2 className="mr-2 h-4 w-4" />}
          {pending ? 'Deleting...' : 'Yes, delete it'}
        </AlertDialogAction>
      </AlertDialogFooter>
    </>
  );
}


export function DeletePostButton({ postId, postTitle }: DeletePostButtonProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleActionComplete = () => {
    setIsOpen(false);
  }

  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogTrigger asChild>
        <Button variant="destructive" size="sm">
          <Trash2 className="mr-2 h-4 w-4" />
          Delete
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        {/* The form wrapper is needed if deletePostAction is to be called directly via form action */}
        {/* However, since we are calling it programmatically with await, a form wrapper for the whole dialog content is not strictly necessary, but it doesn't hurt for useFormStatus */}
        <form action={() => { /* This action is effectively handled by handleDelete in DeleteFormContent */ }}>
            <DeleteFormContent postId={postId} postTitle={postTitle} onActionComplete={handleActionComplete} />
        </form>
      </AlertDialogContent>
    </AlertDialog>
  );
}
