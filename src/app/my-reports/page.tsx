'use client';

import { useCollection, useFirebase, useMemoFirebase } from '@/firebase';
import { collection, orderBy, query } from 'firebase/firestore';
import { IncidentReport } from '@/lib/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Loader2, FileText, ShieldQuestion } from 'lucide-react';
import { format } from 'date-fns';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function MyReportsPage() {
  const { firestore, user, isUserLoading } = useFirebase();

  const reportsQuery = useMemoFirebase(() => {
    if (!firestore || !user) return null;
    const reportsCollection = collection(firestore, 'users', user.uid, 'incident_reports');
    return query(reportsCollection, orderBy('createdAt', 'desc'));
  }, [firestore, user]);

  const { data: reports, isLoading: areReportsLoading } = useCollection<IncidentReport>(reportsQuery);

  const isLoading = isUserLoading || areReportsLoading;

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="size-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    return (
      <Alert>
        <ShieldQuestion className="h-4 w-4" />
        <AlertTitle>Please Sign In</AlertTitle>
        <AlertDescription>
          You need to be signed in to view your submitted reports. If you submitted reports anonymously, they are tied to your anonymous session.
          <div className="mt-4">
             <p className="text-sm text-muted-foreground">You can create a new anonymous report to start a session.</p>
             <Button asChild className="mt-2">
                <Link href="/report-incident">Report an Incident</Link>
             </Button>
          </div>
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in-50">
      <div className="flex flex-wrap gap-4 justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">My Submitted Reports</h1>
          <p className="text-muted-foreground">
            This is a list of the anonymous reports you have submitted.
          </p>
        </div>
      </div>

      {reports && reports.length > 0 ? (
        <div className="space-y-4">
          {reports.map(report => (
            <Card key={report.id}>
              <CardHeader>
                <CardTitle className="capitalize">{report.incidentType.replace('-', ' ')}</CardTitle>
                <CardDescription>
                  Reported on {report.createdAt ? format(report.createdAt.toDate(), 'PPP') : 'N/A'}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                    <h4 className="font-semibold">Date of Incident:</h4>
                    <p className="text-muted-foreground">{report.incidentDate ? format(report.incidentDate.toDate(), 'PPP') : 'N/A'}</p>
                </div>
                {report.location && (
                    <div>
                        <h4 className="font-semibold">Location:</h4>
                        <p className="text-muted-foreground">{report.location}</p>
                    </div>
                )}
                <div>
                    <h4 className="font-semibold">Description:</h4>
                    <p className="text-muted-foreground whitespace-pre-wrap">{report.description}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="text-center p-8">
            <CardContent className="flex flex-col items-center gap-4">
                <FileText className="size-12 text-muted-foreground/50" />
                <p className="text-muted-foreground">You have not submitted any reports yet.</p>
                <Button asChild>
                    <Link href="/report-incident">Submit Your First Report</Link>
                </Button>
            </CardContent>
        </Card>
      )}
    </div>
  );
}
