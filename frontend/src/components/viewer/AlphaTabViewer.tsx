'use client';

import { useEffect, useRef, useState } from 'react';
import { Play, Pause, Square } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface AlphaTabViewerProps {
  scoreData: string;
  title?: string;
}

export function AlphaTabViewer({ scoreData, title }: AlphaTabViewerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const apiRef = useRef<unknown>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!scoreData || !containerRef.current) return;

    let api: unknown = null;

    const initAlphaTab = async () => {
      try {
        const alphaTab = await import('@coderline/alphatab');
        const element = containerRef.current;
        if (!element) return;

        // Clear previous instance
        if (apiRef.current) {
          (apiRef.current as { destroy?: () => void }).destroy?.();
        }

        element.innerHTML = '';

        api = new (alphaTab as unknown as { AlphaTabApi: new (el: HTMLElement, settings: unknown) => unknown }).AlphaTabApi(element, {
          tex: true,
          display: {
            layoutMode: 0,
            scale: 1.0,
          },
        });

        const typedApi = api as {
          scoreLoaded: { on: (cb: () => void) => void };
          renderFinished: { on: (cb: () => void) => void };
          playbackState: number;
          playPause: () => void;
          stop: () => void;
          tex: (data: string) => void;
        };

        typedApi.scoreLoaded.on(() => {
          setIsLoading(false);
        });

        typedApi.tex(scoreData);
        apiRef.current = api;
      } catch (err) {
        console.error('Failed to initialize AlphaTab:', err);
        setIsLoading(false);
      }
    };

    initAlphaTab();

    return () => {
      if (apiRef.current) {
        (apiRef.current as { destroy?: () => void }).destroy?.();
        apiRef.current = null;
      }
    };
  }, [scoreData]);

  const handlePlayPause = () => {
    if (apiRef.current) {
      (apiRef.current as { playPause: () => void }).playPause();
      setIsPlaying((prev) => !prev);
    }
  };

  const handleStop = () => {
    if (apiRef.current) {
      (apiRef.current as { stop: () => void }).stop();
      setIsPlaying(false);
    }
  };

  if (!scoreData) {
    return (
      <div className="border rounded-lg p-8 bg-muted/50 text-center text-muted-foreground">
        No tablature available
      </div>
    );
  }

  return (
    <div className="border rounded-lg overflow-hidden">
      {title && (
        <div className="bg-muted px-4 py-2 font-medium text-sm border-b">{title}</div>
      )}
      <div className="flex items-center gap-2 p-3 border-b bg-background">
        <Button variant="outline" size="sm" onClick={handlePlayPause}>
          {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
          {isPlaying ? 'Pause' : 'Play'}
        </Button>
        <Button variant="outline" size="sm" onClick={handleStop}>
          <Square className="h-4 w-4" />
          Stop
        </Button>
      </div>
      {isLoading && (
        <div className="p-4 text-center text-muted-foreground text-sm">Loading score...</div>
      )}
      <div ref={containerRef} className="min-h-[200px] overflow-x-auto" />
    </div>
  );
}
