'use client';

import { useEffect } from 'react';

interface AdSenseProps {
  adSlot: string;
  adFormat?: string;
  fullWidthResponsive?: boolean;
}

export function AdSense({ adSlot, adFormat = 'auto', fullWidthResponsive = true }: AdSenseProps) {
  const clientId = process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID;
  const isEnabled = process.env.NEXT_PUBLIC_ADSENSE_ENABLED === 'true';
  const isProd = process.env.NODE_ENV === 'production';

  useEffect(() => {
    if (!isProd || !isEnabled || !clientId) return;

    const existingScript = document.querySelector('script[data-ad-client]');
    if (!existingScript) {
      const script = document.createElement('script');
      script.async = true;
      script.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${clientId}`;
      script.crossOrigin = 'anonymous';
      script.setAttribute('data-ad-client', clientId);
      document.head.appendChild(script);
    }

    try {
      ((window as unknown as { adsbygoogle: unknown[] }).adsbygoogle = (window as unknown as { adsbygoogle: unknown[] }).adsbygoogle || []).push({});
    } catch (e) {
      console.error('AdSense error:', e);
    }
  }, [isProd, isEnabled, clientId]);

  if (!isProd || !isEnabled) {
    return (
      <div className="border-2 border-dashed border-gray-300 bg-gray-50 flex items-center justify-center text-gray-400 text-sm font-medium rounded"
        style={{ minHeight: '90px' }}>
        Ad Space
      </div>
    );
  }

  if (!clientId) return null;

  return (
    <ins
      className="adsbygoogle"
      style={{ display: 'block' }}
      data-ad-client={clientId}
      data-ad-slot={adSlot}
      data-ad-format={adFormat}
      data-full-width-responsive={fullWidthResponsive ? 'true' : 'false'}
    />
  );
}
