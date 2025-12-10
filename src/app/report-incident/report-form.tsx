'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { CalendarIcon, Check, Loader2 } from 'lucide-react';
import { useState, useEffect } from 'react';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { Calendar } from '@/components/ui/calendar';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useFirebase } from '@/firebase';
import { addDoc } from 'firebase/firestore';
import { collection, serverTimestamp } from 'firebase/firestore';
import { initiateAnonymousSignIn } from '@/firebase/non-blocking-login';
import { useToast } from '@/hooks/use-toast';

const formSchema = z.object({
  incidentDate: z.date({
    required_error: 'A date of incident is required.',
  }),
  location: z.string().optional(),
  incidentType: z.string().min(1, 'Please select an incident type.'),
  description: z
    .string()
    .min(10, 'Please provide a detailed description of at least 10 characters.')
    .max(5000, 'Description is too long.'),
});

export function ReportIncidentForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { firestore, auth, user, isUserLoading } = useFirebase();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      incidentType: '',
      description: '',
      location: '',
    },
  });

  // Effect to handle anonymous user sign-in and resubmission
  useEffect(() => {
    // If we have a user now, and we were trying to submit, try submitting again.
    if (user && isSubmitting && form.formState.isSubmitting) {
      form.handleSubmit(onSubmit)();
    }
  }, [user, isSubmitting]);


  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (!firestore || !auth) {
      toast({ variant: 'destructive', title: 'Error', description: 'Could not connect to services. Please try again.' });
      return;
    }

    setIsSubmitting(true);

    // If there's no user and auth is not loading, initiate sign-in
    if (!user && !isUserLoading) {
      initiateAnonymousSignIn(auth);
      // Let the useEffect handle the resubmission once the user is available.
      toast({ title: "First-time Report", description: "Creating a secure anonymous session for you. Please wait..."});
      // We keep isSubmitting true, so the useEffect knows to re-trigger.
      return;
    }
    
    // If there is a user, proceed to submit the document
    if (user) {
        try {
            const reportData = {
                ...values,
                userId: user.uid,
                anonymous: user.isAnonymous,
                createdAt: serverTimestamp(),
                updatedAt: serverTimestamp(),
            };
            const reportsCollectionRef = collection(firestore, 'users', user.uid, 'incident_reports');
            await addDoc(reportsCollectionRef, reportData);
            
            setIsSubmitted(true);
            form.reset();
        } catch (error) {
            console.error("Error submitting report:", error);
            toast({ variant: 'destructive', title: 'Submission Failed', description: 'There was an error submitting your report. Please try again.' });
        } finally {
            setIsSubmitting(false);
        }
    }
  }
  
  if (isSubmitted) {
    return (
      <Alert>
        <Check className="h-4 w-4" />
        <AlertTitle>Report Submitted Successfully</AlertTitle>
        <AlertDescription>
          Thank you for your courage. Your report has been submitted anonymously. We encourage you to explore the support resources available on this platform.
          <div className="mt-4">
            <Button onClick={() => setIsSubmitted(false)} variant="outline">Submit another report</Button>
          </div>
        </Aler
tDescription>
      </Alert>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Anonymous Incident Report</CardTitle>
        <CardDescription>
          This form is completely anonymous. The information you provide helps us understand the scope of GBV and advocate for change.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <FormField
                control={form.control}
                name="incidentDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Date of Incident</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={'outline'}
                            className={cn(
                              'w-full pl-3 text-left font-normal',
                              !field.value && 'text-muted-foreground'
                            )}
                          >
                            {field.value ? (
                              format(field.value, 'PPP')
                            ) : (
                              <span>Pick a date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) =>
                            date > new Date() || date < new Date('1900-01-01')
                          }
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="location"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Location (Optional)</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., City, Neighborhood" {...field} />
                    </FormControl>
                    <FormDescription>
                      Provide a general location if you feel safe doing so.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="incidentType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Type of Incident</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a type of violence" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="physical">Physical Violence</SelectItem>
                      <SelectItem value="emotional">Emotional/Psychological Abuse</SelectItem>
                      <SelectItem value="sexual">Sexual Violence</SelectItem>
                      <SelectItem value="economic">Economic Abuse</SelectItem>
                      <SelectItem value="stalking">Stalking/Harassment</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description of Incident</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Describe what happened. Please do not include names or other identifying details."
                      className="min-h-[150px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" disabled={isSubmitting || isUserLoading}>
              {isSubmitting || isUserLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Submitting...
                </>
              ) : (
                'Submit Anonymously'
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
