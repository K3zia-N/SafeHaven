'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { getResourceReferral, ResourceReferralOutput } from '@/ai/flows/resource-referral';

import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Loader2, Sparkles, MapPin, Search, Navigation } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

const formSchema = z.object({
  location: z.string().min(3, 'Please enter a valid location (e.g., city, zip code).'),
  needs: z.string().min(5, 'Please describe your needs (e.g., "emergency shelter", "legal advice").'),
});

export function FindSupportTool() {
  const [result, setResult] = useState<ResourceReferralOutput | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

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

  const handleNavigate = (address: string) => {
    const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;
    window.open(googleMapsUrl, '_blank');
  };

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

      {result && result.resourceRecommendations && result.resourceRecommendations.length > 0 && (
        <div className='space-y-4'>
            <div className='flex items-center gap-2'>
                <Sparkles className="text-primary" />
                <h2 className='text-xl font-semibold'>AI-Powered Recommendations</h2>
            </div>
            <p className="text-muted-foreground">Here are some resources we found based on your request. Click navigate to get directions.</p>
            <div className="grid gap-4 md:grid-cols-2">
                {result.resourceRecommendations.map((rec, index) => (
                <Card key={index}>
                    <CardHeader>
                        <CardTitle>{rec.name}</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-sm text-muted-foreground">{rec.address}</p>
                    </CardContent>
                    <CardFooter>
                        <Button onClick={() => handleNavigate(rec.address)} className='w-full'>
                            <Navigation className="mr-2 h-4 w-4" />
                            Navigate on Google Maps
                        </Button>
                    </CardFooter>
                </Card>
                ))}
            </div>
        </div>
      )}
       {result && (!result.resourceRecommendations || result.resourceRecommendations.length === 0) && (
        <Alert>
            <AlertTitle>No Resources Found</AlertTitle>
            <AlertDescription>We couldn't find any resources based on your search. Please try a different location or check your spelling.</AlertDescription>
        </Alert>
       )}
    </div>
  );
}
