'use client';

import { KofiButton } from '@/components/donations/KofiButton';

export default function SupportPage() {
  return (
    <div className="max-w-3xl mx-auto py-8 space-y-8">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-3">Support findUtabs</h1>
        <p className="text-muted-foreground text-lg">Help us keep this platform free for everyone</p>
      </div>

      <div className="border rounded-lg p-6 space-y-4">
        <h2 className="text-xl font-semibold">About the Project</h2>
        <p className="text-muted-foreground">findUtabs is a passion project built by guitar enthusiasts for guitar enthusiasts. We provide a free platform for sharing and discovering guitar tablatures, powered by community contributions.</p>
        <p className="text-muted-foreground">Running this platform has real costs: server hosting, storage, bandwidth, and development time. Your support helps us keep the lights on and invest in new features.</p>
      </div>

      <div className="border rounded-lg p-6 space-y-4 text-center">
        <h2 className="text-xl font-semibold">Buy Me a Coffee</h2>
        <p className="text-muted-foreground">If you enjoy findUtabs, consider supporting us with a small donation via Ko-fi. Every coffee counts!</p>
        <div className="flex justify-center">
          <KofiButton label="Buy me a coffee ☕" />
        </div>
      </div>

      <div className="border rounded-lg p-6 space-y-4">
        <h2 className="text-xl font-semibold">Other Ways to Help</h2>
        <ul className="space-y-3 text-muted-foreground">
          <li className="flex items-start gap-2">
            <span className="text-primary mt-0.5">•</span>
            <span><strong className="text-foreground">Share the platform</strong> — Tell your guitar-playing friends about findUtabs</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-primary mt-0.5">•</span>
            <span><strong className="text-foreground">Upload tabs</strong> — Contribute your transcriptions to the community</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-primary mt-0.5">•</span>
            <span><strong className="text-foreground">Rate and review</strong> — Help others find quality tabs with your ratings</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-primary mt-0.5">•</span>
            <span><strong className="text-foreground">Report bugs</strong> — Help us improve by reporting issues you find</span>
          </li>
        </ul>
      </div>
    </div>
  );
}
