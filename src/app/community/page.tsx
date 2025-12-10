'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MessageCircle, PlusCircle, UserCircle, Loader2 } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  useCollection,
  useFirebase,
  useMemoFirebase,
} from '@/firebase';
import { collection, serverTimestamp, addDoc } from 'firebase/firestore';
import { CommunityPost } from '@/lib/types';
import { initiateAnonymousSignIn } from '@/firebase/non-blocking-login';
import { useState } from 'react';
import { formatDistanceToNow } from 'date-fns';
import Image from 'next/image';

const newPostSchema = z.object({
  title: z.string().min(5, 'Title must be at least 5 characters long.'),
  content: z.string().min(10, 'Content must be at least 10 characters long.'),
});

function NewPostDialog() {
  const [isOpen, setIsOpen] = useState(false);
  const { firestore, user, auth } = useFirebase();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<z.infer<typeof newPostSchema>>({
    resolver: zodResolver(newPostSchema),
    defaultValues: { title: '', content: '' },
  });

  const handlePost = async (values: z.infer<typeof newPostSchema>) => {
    if (!firestore) return;
    if (!user && auth) {
      // If user is not logged in, sign them in anonymously
      initiateAnonymousSignIn(auth);
      // We can't post immediately as auth state change is not instant.
      // A better UX would be to wait for the user object, but for now we alert.
      alert("You've been signed in anonymously. Please try posting again.");
      return;
    }
    if (!user) {
        alert("You need to be logged in to post.");
        return;
    }

    setIsSubmitting(true);
    try {
      const postsCollection = collection(firestore, 'community_posts');
      await addDoc(postsCollection, {
        ...values,
        userId: user.uid,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        author: 'Anonymous',
        replies: 0,
      });
      form.reset();
      setIsOpen(false);
    } catch (error) {
      console.error('Error creating post:', error);
      alert('There was an error creating your post. Please try again.');
    } finally {
        setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button size="lg">
          <PlusCircle className="mr-2" />
          Create New Post
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create an Anonymous Post</DialogTitle>
          <DialogDescription>
            Share your thoughts or ask for advice. Your post is anonymous.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={form.handleSubmit(handlePost)} className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="title" className="text-right">
              Title
            </Label>
            <Input
              id="title"
              placeholder="A short, descriptive title"
              className="col-span-3"
              {...form.register('title')}
            />
             {form.formState.errors.title && <p className="col-span-4 text-xs text-destructive text-right">{form.formState.errors.title.message}</p>}
          </div>
          <div className="grid grid-cols-4 items-start gap-4">
            <Label htmlFor="content" className="text-right pt-2">
              Content
            </Label>
            <Textarea
              id="content"
              placeholder="Share your story or question..."
              className="col-span-3 min-h-[120px]"
              {...form.register('content')}
            />
            {form.formState.errors.content && <p className="col-span-4 text-xs text-destructive text-right">{form.formState.errors.content.message}</p>}
          </div>
          <DialogFooter>
             <DialogClose asChild>
                <Button variant="ghost">Cancel</Button>
            </DialogClose>
            <Button type="submit" disabled={isSubmitting}>
                {isSubmitting && <Loader2 className="mr-2 animate-spin" />}
                Post Anonymously
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default function CommunityPage() {
  const { firestore } = useFirebase();

  const postsQuery = useMemoFirebase(
    () => (firestore ? collection(firestore, 'community_posts') : null),
    [firestore]
  );
  const { data: posts, isLoading } = useCollection<CommunityPost>(postsQuery);

  const formatTimestamp = (timestamp: any) => {
    if (timestamp?.toDate) {
      return `${formatDistanceToNow(timestamp.toDate())} ago`;
    }
    return 'Just now';
  };

  return (
    <div className="space-y-6 animate-in fade-in-50">
        <section className="relative w-full h-80 overflow-hidden">
            <Image
                src="https://raw.githubusercontent.com/K3zia-N/Zinduka/zinduka_final/ZINDUKA/images/de3ccf05-0e75-429b-b6c5-a4ea2b5577aa.jpg"
                alt="Supportive community"
                fill
                className="object-cover"
            />
            <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center text-center p-4">
                <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-white">Anonymous Community Board</h1>
                <p className="mt-2 max-w-2xl text-lg text-primary-foreground/90">
                    A safe place to share and connect. All posts are anonymous.
                </p>
            </div>
        </section>

      <div className="flex justify-center my-8">
        <NewPostDialog />
      </div>

        {isLoading && (
            <div className="flex justify-center items-center h-64">
                <Loader2 className="size-8 animate-spin text-primary" />
            </div>
        )}

      <div className="space-y-4 mx-auto max-w-4xl px-[30px]">
        {!isLoading && posts && posts.map(post => (
          <Card key={post.id} className="transition-shadow hover:shadow-lg bg-gradient-to-r from-background to-accent/20">
            <CardHeader>
              <CardTitle>{post.title}</CardTitle>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <UserCircle className="size-4" />
                <span>{post.author}</span>
                <span>&bull;</span>
                <span>{formatTimestamp(post.createdAt)}</span>
              </div>
            </CardHeader>
            <CardContent>
              <p className="line-clamp-3 text-muted-foreground">
                {post.content}
              </p>
            </CardContent>
            <CardFooter className="flex justify-between items-center">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <MessageCircle className="size-4" />
                <span>{post.replies || 0} replies</span>
              </div>
              <Button variant="ghost">Read More &rarr;</Button>
            </CardFooter>
          </Card>
        ))}
        {!isLoading && posts?.length === 0 && (
            <Card className="text-center p-8 bg-gradient-to-br from-card to-accent/10">
                <CardContent>
                    <p className="text-muted-foreground">No posts yet. Be the first to share your story.</p>
                </CardContent>
            </Card>
        )}
      </div>
    </div>
  );
}
