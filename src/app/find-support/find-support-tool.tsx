'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { getResourceReferral, ResourceReferralOutput } from '@/ai/flows/resource-referral';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Loader2, Sparkles, MapPin, Search, Bookmark } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';

const formSchema = z.object({
  location: z.string().min(3, 'Please enter a valid location (e.g., city, zip code).'),
  needs: z.string().min(5, 'Please describe your needs (e.g., "emergency shelter", "legal advice").'),
});

export function FindSupportTool() {
  const [result, setResult] = useState<ResourceReferralOutput | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { location: '', needs: '' },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setError(null);
    setResult(null);
    try {
      const response = await getResourceReferral(values);
      setResult(response);
    } catch (e) {
      setError('Sorry, we encountered an error finding resources. Please try again.');
      console.error(e);
    }
    setIsLoading(false);
  }

  const handleSaveResource = (resource: string) => {
    // This is a placeholder for the actual save functionality
    toast({
        title: "Feature Coming Soon!",
        description: "You will soon be able to save resources to your dashboard.",
    });
    console.log("Saving resource:", resource);
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Resource Referral Tool</CardTitle>
          <CardDescription>Enter your general location and what you need help with. Our AI assistant will find relevant support resources for you.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="location"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Your Location</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input placeholder="e.g., City, State, or Zip Code" {...field} className="pl-10" />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="needs"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>What do you need?</FormLabel>
                    <FormControl>
                      <Textarea placeholder="e.g., emergency housing, legal aid, counseling" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Searching...
                  </>
                ) : (
                  <>
                    <Search className="mr-2 h-4 w-4" />
                    Find Resources
                  </>
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      {error && <Alert variant="destructive"><AlertTitle>Error</AlertTitle><AlertDescription>{error}</AlertDescription></Alert>}

      {isLoading && (
        <div className="flex items-center justify-center rounded-lg border p-8">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      )}

      {result && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Sparkles className="text-primary" /> AI-Powered Recommendations</CardTitle>
            <CardDescription>Here are some resources we found based on your request. You can save them for later.</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {result.resourceRecommendations.map((rec, index) => (
                <li key={index} className="flex justify-between items-center p-2 rounded-md hover:bg-muted">
                  <span className="text-foreground flex-1">{rec}</span>
                  <Button variant="ghost" size="icon" onClick={() => handleSaveResource(rec)}>
                    <Bookmark className="size-4" />
                  </Button>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
