'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { findSafeLocations, FindSafeLocationsOutput } from '@/ai/flows/safe-location-finder';

import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Loader2, Sparkles, MapPin, Search, Navigation } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

const formSchema = z.object({
  userLocation: z.string().min(3, 'Please enter a valid location (e.g., address, city, zip code).'),
});

export function SafeLocationsFinder() {
  const [result, setResult] = useState<FindSafeLocationsOutput | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { userLocation: '' },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setError(null);
    setResult(null);
    try {
      const response = await findSafeLocations(values);
      setResult(response);
    } catch (e) {
      setError('Sorry, we encountered an error finding locations. Please try again.');
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
          <CardTitle>Safe Location Finder</CardTitle>
          <CardDescription>Enter your location to find nearby safe places like police stations, fire stations, and hospitals.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="userLocation"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Your Location</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input placeholder="e.g., 123 Main St, Anytown, USA" {...field} className="pl-10" />
                      </div>
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
                    Find Safe Locations
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

      {result && result.safeLocations && result.safeLocations.length > 0 && (
        <div className='space-y-4'>
            <div className='flex items-center gap-2'>
                <Sparkles className="text-primary" />
                <h2 className='text-xl font-semibold'>Safe Locations Found</h2>
            </div>
            <p className="text-muted-foreground">Here are some nearby safe locations. We recommend verifying hours and services directly.</p>
            <div className="grid gap-4 md:grid-cols-2">
                {result.safeLocations.map((location, index) => (
                <Card key={index}>
                    <CardHeader>
                        <CardTitle>{location.name}</CardTitle>
                        <CardDescription>{location.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <p className="text-sm text-muted-foreground">{location.address}</p>
                    </CardContent>
                    <CardFooter>
                        <Button onClick={() => handleNavigate(location.address)} className='w-full'>
                            <Navigation className="mr-2 h-4 w-4" />
                            Navigate on Google Maps
                        </Button>
                    </CardFooter>
                </Card>
                ))}
            </div>
        </div>
      )}
       {result && (!result.safeLocations || result.safeLocations.length === 0) && (
        <Alert>
            <AlertTitle>No Locations Found</AlertTitle>
            <AlertDescription>We couldn't find any safe locations based on your search. Please try a different location or check your spelling.</AlertDescription>
        </Alert>
       )}
    </div>
  );
}
