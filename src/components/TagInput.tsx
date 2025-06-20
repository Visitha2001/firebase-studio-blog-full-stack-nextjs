'use client';

import { useState, useEffect, ChangeEvent, KeyboardEvent } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { X, Wand2, Loader2 } from 'lucide-react';
import { suggestTagsAction } from '@/lib/actions';
import { useToast } from '@/hooks/use-toast';

interface TagInputProps {
  id: string;
  name: string;
  initialTags?: string[];
  getBlogContent: () => string; // Function to get current blog content for AI suggestions
  onTagsChange: (tags: string[]) => void;
}

export function TagInput({ id, name, initialTags = [], getBlogContent, onTagsChange }: TagInputProps) {
  const [tags, setTags] = useState<string[]>(initialTags);
  const [inputValue, setInputValue] = useState('');
  const [suggestedTags, setSuggestedTags] = useState<string[]>([]);
  const [isSuggesting, setIsSuggesting] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    onTagsChange(tags);
  }, [tags, onTagsChange]);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleInputKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      addTag(inputValue.trim());
      setInputValue('');
    }
  };

  const addTag = (tag: string) => {
    if (tag && !tags.includes(tag)) {
      setTags([...tags, tag]);
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const handleSuggestTags = async () => {
    const content = getBlogContent();
    if (!content.trim()) {
      toast({
        title: "Cannot Suggest Tags",
        description: "Please write some content for your blog post first.",
        variant: "destructive",
      });
      return;
    }
    setIsSuggesting(true);
    setSuggestedTags([]);
    const result = await suggestTagsAction(content);
    setIsSuggesting(false);
    if (result.tags) {
      setSuggestedTags(result.tags.filter(st => !tags.includes(st))); // Filter out already added tags
      if (result.tags.length === 0) {
        toast({ title: "No new tags suggested." });
      }
    } else if (result.error) {
      toast({
        title: "Error Suggesting Tags",
        description: result.error,
        variant: "destructive",
      });
    }
  };

  const addSuggestedTag = (tag: string) => {
    addTag(tag);
    setSuggestedTags(suggestedTags.filter(st => st !== tag));
  };

  return (
    <div className="space-y-3">
      {/* Hidden inputs for form submission */}
      {tags.map((tag, index) => (
        <input type="hidden" key={`${name}-${index}`} name={name} value={tag} />
      ))}
      
      <div className="flex items-center gap-2">
        <Input
          type="text"
          id={`${id}-input`}
          value={inputValue}
          onChange={handleInputChange}
          onKeyDown={handleInputKeyDown}
          placeholder="Add a tag and press Enter"
          className="flex-grow"
          aria-label="Add new tag"
        />
        <Button type="button" variant="outline" onClick={handleSuggestTags} disabled={isSuggesting} className="shrink-0">
          {isSuggesting ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Wand2 className="mr-2 h-4 w-4" />
          )}
          Suggest Tags
        </Button>
      </div>

      {tags.length > 0 && (
        <div className="flex flex-wrap gap-2" aria-live="polite">
          <span className="sr-only">Current tags:</span>
          {tags.map((tag) => (
            <Badge key={tag} variant="secondary" className="py-1 px-2 text-sm bg-primary/10 text-primary">
              {tag}
              <button
                type="button"
                onClick={() => removeTag(tag)}
                className="ml-1.5 rounded-full p-0.5 hover:bg-primary/20 focus:outline-none focus:ring-1 focus:ring-primary"
                aria-label={`Remove tag ${tag}`}
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))}
        </div>
      )}

      {isSuggesting && <p className="text-sm text-muted-foreground">Generating tag suggestions...</p>}

      {suggestedTags.length > 0 && (
        <div className="space-y-2 pt-2">
          <p className="text-sm font-medium text-muted-foreground">Suggested Tags (click to add):</p>
          <div className="flex flex-wrap gap-2">
            {suggestedTags.map((tag) => (
              <Badge
                key={tag}
                variant="outline"
                onClick={() => addSuggestedTag(tag)}
                className="cursor-pointer py-1 px-2 text-sm hover:bg-accent/20 hover:border-accent"
                role="button"
                tabIndex={0}
                onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && addSuggestedTag(tag)}
              >
                {tag}
              </Badge>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
