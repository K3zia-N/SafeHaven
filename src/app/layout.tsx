import type {Metadata} from 'next';
import './globals.css';
import {SidebarProvider, SidebarInset} from '@/components/ui/sidebar';
import {AppSidebar} from '@/components/layout/app-sidebar';
import {Header} from '@/components/layout/header';
import {Toaster} from '@/components/ui/toaster';
import { cn } from '@/lib/utils';
import { ZindukaBot } from '@/components/chatbot/ZindukaBot';
import { LoadingProvider } from '@/components/layout/loading-provider';
import { PageSpinner } from '@/components/layout/page-spinner';
import { NavigationEvents } from '@/components/layout/navigation-events';
import { Suspense } from 'react';

export const metadata: Metadata = {
  title: 'SafeHaven',
  description: 'A safe space for support and resources against GBV.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body className={cn("font-body antialiased")}>
        <LoadingProvider>
          <SidebarProvider>
            <AppSidebar />
            <SidebarInset>
              <Header />
              <main className="p-4 sm:p-6 lg:p-8">
                {children}
              </main>
            </SidebarInset>
          </SidebarProvider>
          <Toaster />
          <ZindukaBot />
          <PageSpinner />
          <Suspense fallback={null}>
            <NavigationEvents />
          </Suspense>
        </LoadingProvider>
      </body>
    </html>
  );
}
