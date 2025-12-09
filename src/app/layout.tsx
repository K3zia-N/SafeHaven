import type {Metadata} from 'next';
import './globals.css';
import {Header} from '@/components/layout/header';
import {Toaster} from '@/components/ui/toaster';
import { cn } from '@/lib/utils';
import { ZindukaBot } from '@/components/chatbot/ZindukaBot';
import { LoadingProvider } from '@/components/layout/loading-provider';
import { PageSpinner } from '@/components/layout/page-spinner';
import { NavigationEvents } from '@/components/layout/navigation-events';
import { Suspense } from 'react';
import { LanguageProvider } from '@/components/layout/language-provider';
import { Footer } from '@/components/layout/footer';
import { TooltipProvider } from '@/components/ui/tooltip';

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
        <LanguageProvider>
          <LoadingProvider>
            <TooltipProvider>
              <div className="flex flex-col min-h-screen">
                <Header />
                <main className="flex-1 p-4 sm:p-6 lg:p-8">
                  {children}
                </main>
                <Footer />
              </div>
            </TooltipProvider>
            <Toaster />
            <ZindukaBot />
            <PageSpinner />
            <Suspense fallback={null}>
              <NavigationEvents />
            </Suspense>
          </LoadingProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
