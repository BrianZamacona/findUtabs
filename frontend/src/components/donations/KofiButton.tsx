'use client';

import { useEffect } from 'react';

interface KofiButtonProps {
  username?: string;
  label?: string;
  color?: string;
  variant?: 'floating' | 'inline';
}

export function KofiButton({
  username,
  label = 'Support Me',
  color = '#FF5E5B',
  variant = 'inline',
}: KofiButtonProps) {
  const kofiUsername = username ?? process.env.NEXT_PUBLIC_KOFI_USERNAME ?? '';

  useEffect(() => {
    if (!kofiUsername) return;

    const existingScript = document.querySelector('script[src*="ko-fi.com"]');
    if (!existingScript) {
      const script = document.createElement('script');
      script.src = 'https://storage.ko-fi.com/cdn/scripts/overlay-widget.js';
      script.async = true;
      document.head.appendChild(script);
    }
  }, [kofiUsername]);

  if (!kofiUsername) return null;

  if (variant === 'floating') {
    return (
      <div className="fixed bottom-6 right-6 z-50">
        <a
          href={`https://ko-fi.com/${kofiUsername}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 px-4 py-3 rounded-full shadow-lg text-white font-medium text-sm transition-transform hover:scale-105"
          style={{ backgroundColor: color }}
          aria-label={label}
        >
          <span aria-hidden="true">☕</span> {label}
        </a>
      </div>
    );
  }

  return (
    <a
      href={`https://ko-fi.com/${kofiUsername}`}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-2 px-4 py-2 rounded-md text-white font-medium text-sm transition-opacity hover:opacity-90"
      style={{ backgroundColor: color }}
      aria-label={label}
    >
      <span aria-hidden="true">☕</span> {label}
    </a>
  );
}
