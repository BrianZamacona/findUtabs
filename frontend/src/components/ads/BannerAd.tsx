import { AdSense } from './AdSense';

export function BannerAd() {
  const adSlot = process.env.NEXT_PUBLIC_ADSENSE_BANNER_SLOT ?? 'banner';
  return (
    <div className="w-full max-w-4xl mx-auto" style={{ minHeight: '90px' }}>
      <AdSense adSlot={adSlot} adFormat="horizontal" />
    </div>
  );
}
