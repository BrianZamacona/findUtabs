'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import Script from 'next/script';

interface GoogleAnalyticsProps {
  measurementId?: string;
}

export function GoogleAnalytics({ measurementId }: GoogleAnalyticsProps) {
  const pathname = usePathname();
  const gaId = measurementId ?? process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;
  const isEnabled = process.env.NEXT_PUBLIC_GA_ENABLED === 'true';
  const isProd = process.env.NODE_ENV === 'production';

  useEffect(() => {
    if (!isProd || !isEnabled || !gaId) return;
    if (typeof window !== 'undefined' && typeof (window as unknown as { gtag?: (...args: unknown[]) => void }).gtag === 'function') {
      (window as unknown as { gtag: (...args: unknown[]) => void }).gtag('config', gaId, {
        page_path: pathname,
      });
    }
  }, [pathname, gaId, isProd, isEnabled]);

  if (!isProd || !isEnabled || !gaId) return null;

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
        strategy="afterInteractive"
      />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${gaId}');
        `}
      </Script>
    </>
  );
}
