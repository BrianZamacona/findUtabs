import { AdSense } from './AdSense';

export function InFeedAd() {
  const adSlot = process.env.NEXT_PUBLIC_ADSENSE_INFEED_SLOT ?? 'infeed';
  return (
    <div style={{ minHeight: '60px' }}>
      <AdSense adSlot={adSlot} adFormat="fluid" />
    </div>
  );
}
