'use client';

import { useEffect, useRef } from 'react';

interface StaffData {
  notes?: string[];
  clef?: string;
  timeSignature?: string;
}

interface VexFlowViewerProps {
  staffData: StaffData | null;
  instrumentType?: string;
}

export function VexFlowViewer({ staffData, instrumentType = 'guitar' }: VexFlowViewerProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!staffData || !containerRef.current) return;

    const renderStaff = async () => {
      try {
        const VF = await import('vexflow');
        const container = containerRef.current;
        if (!container) return;

        container.innerHTML = '';

        const renderer = new VF.Renderer(container, VF.Renderer.Backends.SVG);
        renderer.resize(500, 150);
        const context = renderer.getContext();

        const stave = new VF.Stave(10, 40, 460);
        stave.addClef(staffData.clef || 'treble').addTimeSignature(staffData.timeSignature || '4/4');
        stave.setContext(context).draw();

        if (staffData.notes && staffData.notes.length > 0) {
          const notes = staffData.notes.slice(0, 8).map(
            (n) => new VF.StaveNote({ keys: [n], duration: 'q' }),
          );
          VF.Formatter.FormatAndDraw(context, stave, notes);
        }
      } catch (err) {
        console.error('VexFlow render error:', err);
      }
    };

    renderStaff();
  }, [staffData]);

  if (!staffData) {
    return (
      <div className="border rounded-lg p-4 text-center text-muted-foreground text-sm">
        No staff data available
      </div>
    );
  }

  return (
    <div className="border rounded-lg p-2 overflow-x-auto">
      <div className="text-xs text-muted-foreground mb-1 px-2">
        {instrumentType} — Sheet Music
      </div>
      <div ref={containerRef} />
    </div>
  );
}
