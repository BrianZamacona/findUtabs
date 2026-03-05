'use client';

import { useState, useEffect } from 'react';
import { KofiButton } from './KofiButton';
import { X } from 'lucide-react';

export function DonationBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const dismissed = localStorage.getItem('donation-banner-dismissed');
    if (dismissed) return;
    const count = parseInt(sessionStorage.getItem('visit-count') ?? '0', 10) + 1;
    sessionStorage.setItem('visit-count', String(count));
    if (count % 3 === 1) {
      setVisible(true);
    }
  }, []);

  const dismiss = () => {
    setVisible(false);
    localStorage.setItem('donation-banner-dismissed', 'true');
  };

  if (!visible) return null;

  return (
    <div className="bg-gradient-to-r from-orange-50 to-yellow-50 border border-orange-200 rounded-lg p-4 flex items-center justify-between gap-4">
      <div className="flex-1">
        <p className="font-medium text-sm">Enjoying findUtabs?</p>
        <p className="text-xs text-muted-foreground">Help us keep the lights on and improve the platform!</p>
      </div>
      <KofiButton label="Buy me a coffee" />
      <button onClick={dismiss} className="text-muted-foreground hover:text-foreground">
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}
