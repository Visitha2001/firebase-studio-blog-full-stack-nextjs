import { PostForm } from '@/components/PostForm';
import { createPostAction } from '@/lib/actions';

export const metadata = {
  title: 'Create New Post | Echo Blog',
};

export default function NewPostPage() {
  return (
    <div>
      <PostForm
        action={createPostAction}
        formTitle="Create a New Masterpiece"
        submitButtonText="Publish Post"
      />
    </div>
  );
}
