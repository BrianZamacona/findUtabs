import { AdSense } from './AdSense';

export function SidebarAd() {
  const adSlot = process.env.NEXT_PUBLIC_ADSENSE_SIDEBAR_SLOT ?? 'sidebar';
  return (
    <div style={{ minHeight: '250px', width: '300px' }}>
      <AdSense adSlot={adSlot} adFormat="rectangle" />
    </div>
  );
}
