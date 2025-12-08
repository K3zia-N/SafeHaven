import { mockPosts } from '@/lib/mock-data';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MessageCircle, PlusCircle, UserCircle } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose
} from "@/components/ui/dialog"
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

// A placeholder for a form to create a new post. It won't actually submit data.
function NewPostDialog() {
    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button>
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
                <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="title" className="text-right">
                            Title
                        </Label>
                        <Input id="title" placeholder="A short, descriptive title" className="col-span-3" />
                    </div>
                    <div className="grid grid-cols-4 items-start gap-4">
                        <Label htmlFor="content" className="text-right pt-2">
                            Content
                        </Label>
                        <Textarea id="content" placeholder="Share your story or question..." className="col-span-3 min-h-[120px]" />
                    </div>
                </div>
                <DialogFooter>
                    <DialogClose asChild>
                        <Button type="submit">Post Anonymously</Button>
                    </DialogClose>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

export default function CommunityPage() {
    return (
        <div className="space-y-6 animate-in fade-in-50">
            <div className="flex flex-wrap gap-4 justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold">Anonymous Community Board</h1>
                    <p className="text-muted-foreground">A safe place to share and connect. All posts are anonymous.</p>
                </div>
                <NewPostDialog />
            </div>

            <div className="space-y-4">
                {mockPosts.map((post) => (
                    <Card key={post.id} className="transition-shadow hover:shadow-md">
                        <CardHeader>
                            <CardTitle>{post.title}</CardTitle>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <UserCircle className="size-4" />
                                <span>{post.author}</span>
                                <span>&bull;</span>
                                <span>{post.timestamp}</span>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <p className="line-clamp-3 text-muted-foreground">{post.content}</p>
                        </CardContent>
                        <CardFooter className="flex justify-between items-center">
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <MessageCircle className="size-4" />
                                <span>{post.replies} replies</span>
                            </div>
                            <Button variant="ghost">Read More &rarr;</Button>
                        </CardFooter>
                    </Card>
                ))}
            </div>
        </div>
    );
}
