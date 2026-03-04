'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { detectSource, getTranscriptionWarning, DetectedSource } from '@/lib/sourceDetector';
import type { CreateTranscriptionRequest, TranscriptionResponse } from '@/types/transcription';
import Link from 'next/link';

export default function TranscribePage() {
  const [url, setUrl] = useState('');
  const [detectedSource, setDetectedSource] = useState<DetectedSource | null>(null);
  const [isPublic, setIsPublic] = useState(true);
  const [rightsConfirmed, setRightsConfirmed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<TranscriptionResponse | null>(null);

  useEffect(() => {
    if (url.trim().length > 0) {
      setDetectedSource(detectSource(url));
    } else {
      setDetectedSource(null);
    }
  }, [url]);

  const warning = detectedSource ? getTranscriptionWarning(detectedSource) : null;

  const isSubmitDisabled =
    !detectedSource ||
    detectedSource.platform === 'UNKNOWN' ||
    !rightsConfirmed ||
    isLoading;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (isSubmitDisabled || !detectedSource) return;

    setIsLoading(true);
    setError(null);

    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

    const body: CreateTranscriptionRequest = {
      sourceUrl: url.trim(),
      sourceType: (detectedSource.platform === 'UNKNOWN' ? 'URL' : detectedSource.platform) as import('@/types/transcription').SourceType,
      rightsConfirmed,
      isPublic,
    };

    try {
      const response = await fetch('/api/transcriptions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data?.detail || data?.message || `Request failed with status ${response.status}`);
      }

      const data: TranscriptionResponse = await response.json();
      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred.');
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="max-w-2xl mx-auto space-y-8 py-8">
      <div>
        <h1 className="text-3xl font-bold">Transcribe a Song</h1>
        <p className="text-muted-foreground mt-2">
          Paste a YouTube or SoundCloud link to generate a free music transcription.
        </p>
      </div>

      {result ? (
        <div className="rounded-lg border p-6 space-y-4">
          <h2 className="text-xl font-semibold text-green-600">Transcription Requested!</h2>
          <p className="text-muted-foreground">
            Your transcription (ID: <strong>{result.id}</strong>) has been queued with status{' '}
            <strong>{result.status}</strong>.
          </p>
          <Button
            variant="outline"
            onClick={() => {
              setResult(null);
              setUrl('');
              setRightsConfirmed(false);
              setDetectedSource(null);
            }}
          >
            Transcribe Another Song
          </Button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="url">Music URL</Label>
            <Input
              id="url"
              type="url"
              placeholder="https://www.youtube.com/watch?v=..."
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              disabled={isLoading}
            />
            {detectedSource && (
              <div className="flex items-center gap-2 mt-1">
                <span
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    detectedSource.canAutoTranscribe
                      ? 'bg-green-100 text-green-800'
                      : detectedSource.platform === 'UNKNOWN'
                      ? 'bg-red-100 text-red-800'
                      : 'bg-yellow-100 text-yellow-800'
                  }`}
                >
                  {detectedSource.platformLabel}
                </span>
                {detectedSource.canAutoTranscribe && (
                  <span className="text-xs text-green-600">Auto-transcription available</span>
                )}
              </div>
            )}
          </div>

          {warning && (
            <div className="rounded-md bg-yellow-50 border border-yellow-200 p-4 text-sm text-yellow-800">
              {warning}
            </div>
          )}

          {detectedSource?.embedUrl && (
            <div className="rounded-lg overflow-hidden border">
              {detectedSource.platform === 'YOUTUBE' && (
                <iframe
                  src={detectedSource.embedUrl}
                  title="YouTube preview"
                  width="100%"
                  height="200"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              )}
              {detectedSource.platform === 'SPOTIFY' && (
                <iframe
                  src={detectedSource.embedUrl}
                  title="Spotify preview"
                  width="100%"
                  height="152"
                  allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                  loading="lazy"
                />
              )}
              {detectedSource.platform === 'SOUNDCLOUD' && (
                <iframe
                  src={detectedSource.embedUrl}
                  title="SoundCloud preview"
                  width="100%"
                  height="120"
                  allow="autoplay"
                />
              )}
            </div>
          )}

          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="isPublic"
              checked={isPublic}
              onChange={(e) => setIsPublic(e.target.checked)}
              className="h-4 w-4 rounded border-gray-300"
              disabled={isLoading}
            />
            <Label htmlFor="isPublic" className="cursor-pointer">
              Add to public library
            </Label>
          </div>

          <div className="rounded-md border border-orange-200 bg-orange-50 p-4 space-y-3">
            <div className="flex items-start gap-3">
              <input
                type="checkbox"
                id="rightsConfirmed"
                required
                checked={rightsConfirmed}
                onChange={(e) => setRightsConfirmed(e.target.checked)}
                className="mt-0.5 h-4 w-4 rounded border-gray-300"
                disabled={isLoading}
              />
              <Label htmlFor="rightsConfirmed" className="cursor-pointer text-sm leading-relaxed">
                I confirm that I have the right to transcribe this content, or this content is
                available for transcription under fair use / educational purposes. I understand that
                submitting copyrighted content without permission may result in a{' '}
                <Link href="/dmca" className="underline text-orange-700 hover:text-orange-900">
                  DMCA takedown
                </Link>
                .
              </Label>
            </div>
          </div>

          {error && (
            <div className="rounded-md bg-red-50 border border-red-200 p-4 text-sm text-red-800">
              {error}
            </div>
          )}

          <Button
            type="submit"
            disabled={isSubmitDisabled}
            className="w-full"
          >
            {isLoading ? 'Submitting...' : 'Request Transcription'}
          </Button>
        </form>
      )}
    </div>
  );
}
