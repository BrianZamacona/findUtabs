'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { KofiButton } from '@/components/donations/KofiButton';
import { GoogleAnalytics } from '@/components/analytics/GoogleAnalytics';
import './globals.css';
import { useState } from 'react';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60 * 1000,
      },
    },
  }));

  return (
    <html lang="en">
      <head>
        <title>findUtabs — Guitar Tablatures</title>
        <meta name="description" content="Discover and share guitar tablatures. Browse thousands of tabs, create your own, and connect with the guitar community." />
        <meta property="og:title" content="findUtabs — Guitar Tablatures" />
        <meta property="og:description" content="Discover and share guitar tablatures." />
        <meta property="og:type" content="website" />
      </head>
      <body>
        <GoogleAnalytics />
        <QueryClientProvider client={queryClient}>
          <div className="flex flex-col min-h-screen">
            <Header />
            <main className="flex-1 container mx-auto px-4 py-8">
              {children}
            </main>
            <Footer />
          </div>
          <KofiButton variant="floating" />
        </QueryClientProvider>
      </body>
    </html>
  );
}
