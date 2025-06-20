'use client';

import { useFormState, useFormStatus } from 'react-dom';
import type { BlogPost } from '@/lib/types';
import type { FormState } from '@/lib/actions';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { TagInput } from '@/components/TagInput';
import { useEffect, useRef, useState }sfrom 'react';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Save } from 'lucide-react';

interface PostFormProps {
  action: (prevState: FormState, formData: FormData) => Promise<FormState>;
  initialData?: BlogPost;
  formTitle: string;
  submitButtonText: string;
}

function SubmitButton({ text }: { text: string }) {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="w-full sm:w-auto">
      {pending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
      {pending ? 'Saving...' : text}
    </Button>
  );
}

export function PostForm({ action, initialData, formTitle, submitButtonText }: PostFormProps) {
  const [formState, formAction] = useFormState(action, undefined);
  const [currentTags, setCurrentTags] = useState<string[]>(initialData?.tags || []);
  const contentRef = useRef<HTMLTextAreaElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (formState?.message && !formState.errors) {
      toast({
        title: formState.message.includes("failed") ? "Error" : "Success",
        description: formState.message,
        variant: formState.message.includes("failed") ? "destructive" : "default",
      });
    } else if (formState?.message && formState.errors) {
       toast({
        title: "Validation Error",
        description: formState.message,
        variant: "destructive",
      });
    }
  }, [formState, toast]);

  const getBlogContentForAI = () => {
    return contentRef.current?.value || '';
  };
  
  const handleTagsChange = (newTags: string[]) => {
    setCurrentTags(newTags);
  };

  return (
    <Card className="max-w-2xl mx-auto shadow-xl">
      <CardHeader>
        <CardTitle className="text-3xl font-headline text-primary">{formTitle}</CardTitle>
      </CardHeader>
      <form action={formAction}>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="title" className="text-lg">Title</Label>
            <Input
              id="title"
              name="title"
              defaultValue={formState?.fieldValues?.title ?? initialData?.title}
              required
              aria-describedby="title-error"
              className="text-base"
            />
            {formState?.errors?.title && (
              <p id="title-error" className="text-sm text-destructive">{formState.errors.title.join(', ')}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="content" className="text-lg">Content</Label>
            <Textarea
              id="content"
              name="content"
              ref={contentRef}
              defaultValue={formState?.fieldValues?.content ?? initialData?.content}
              required
              rows={10}
              aria-describedby="content-error"
              className="text-base leading-relaxed"
            />
            {formState?.errors?.content && (
              <p id="content-error" className="text-sm text-destructive">{formState.errors.content.join(', ')}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="author" className="text-lg">Author</Label>
            <Input
              id="author"
              name="author"
              defaultValue={formState?.fieldValues?.author ?? initialData?.author}
              required
              aria-describedby="author-error"
              className="text-base"
            />
            {formState?.errors?.author && (
              <p id="author-error" className="text-sm text-destructive">{formState.errors.author.join(', ')}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="tags" className="text-lg">Tags</Label>
            <TagInput
              id="tags"
              name="tags"
              initialTags={formState?.fieldValues?.tags ?? initialData?.tags}
              getBlogContent={getBlogContentForAI}
              onTagsChange={handleTagsChange}
            />
             {formState?.errors?.tags && (
              <p id="tags-error" className="text-sm text-destructive">{formState.errors.tags.join(', ')}</p>
            )}
          </div>
        </CardContent>
        <CardFooter className="flex justify-end">
          <SubmitButton text={submitButtonText} />
        </CardFooter>
      </form>
    </Card>
  );
}
