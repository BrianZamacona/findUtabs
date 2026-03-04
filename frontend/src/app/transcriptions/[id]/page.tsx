'use client';

import { useParams } from 'next/navigation';
import { useTranscription } from '@/hooks/useTranscriptions';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const STATUS_COLORS: Record<string, string> = {
  PENDING: 'bg-yellow-100 text-yellow-800',
  PROCESSING: 'bg-blue-100 text-blue-800',
  COMPLETED: 'bg-green-100 text-green-800',
  FAILED: 'bg-red-100 text-red-800',
};

export default function TranscriptionDetailPage() {
  const params = useParams();
  const id = Number(params.id);
  const { data: transcription, isLoading } = useTranscription(id);

  if (isLoading) {
    return <div className="text-center py-12">Loading transcription...</div>;
  }

  if (!transcription) {
    return <div className="text-center py-12">Transcription not found</div>;
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="text-2xl">
                {transcription.songTitle ?? 'Unknown Title'}
              </CardTitle>
              <CardDescription className="text-base">
                {transcription.songArtist ?? 'Unknown Artist'}
              </CardDescription>
            </div>
            <span
              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                STATUS_COLORS[transcription.status] ?? 'bg-gray-100 text-gray-800'
              }`}
            >
              {transcription.status}
            </span>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {transcription.bpm && (
              <div>
                <span className="text-sm font-medium">BPM</span>
                <p className="text-muted-foreground mt-1">{transcription.bpm}</p>
              </div>
            )}
            {transcription.musicalKey && (
              <div>
                <span className="text-sm font-medium">Key</span>
                <p className="text-muted-foreground mt-1">{transcription.musicalKey}</p>
              </div>
            )}
            {transcription.timeSignature && (
              <div>
                <span className="text-sm font-medium">Time Signature</span>
                <p className="text-muted-foreground mt-1">{transcription.timeSignature}</p>
              </div>
            )}
            {transcription.durationMs && (
              <div>
                <span className="text-sm font-medium">Duration</span>
                <p className="text-muted-foreground mt-1">
                  {Math.floor(transcription.durationMs / 60000)}:
                  {String(Math.floor((transcription.durationMs % 60000) / 1000)).padStart(2, '0')}
                </p>
              </div>
            )}
          </div>

          <div>
            <span className="text-sm font-medium">Created</span>
            <p className="text-muted-foreground mt-1">
              {new Date(transcription.createdAt).toLocaleString()}
            </p>
          </div>

          {transcription.processingCompletedAt && (
            <div>
              <span className="text-sm font-medium">Completed</span>
              <p className="text-muted-foreground mt-1">
                {new Date(transcription.processingCompletedAt).toLocaleString()}
              </p>
            </div>
          )}

          {transcription.errorMessage && (
            <div className="rounded-md bg-red-50 border border-red-200 p-4 text-sm text-red-800">
              <strong>Error:</strong> {transcription.errorMessage}
            </div>
          )}

          {transcription.tracks.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold mb-3">Tracks</h3>
              <div className="space-y-3">
                {transcription.tracks.map((track) => (
                  <div key={track.id} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium">{track.trackType}</span>
                      {track.instrumentDetail && (
                        <span className="text-sm text-muted-foreground">
                          {track.instrumentDetail}
                        </span>
                      )}
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {track.hasTabs && (
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs bg-secondary">
                          Tabs
                        </span>
                      )}
                      {track.hasStaff && (
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs bg-secondary">
                          Staff
                        </span>
                      )}
                      {track.hasChords && (
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs bg-secondary">
                          Chords
                        </span>
                      )}
                      {track.hasLyrics && (
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs bg-secondary">
                          Lyrics
                        </span>
                      )}
                      {track.hasGroove && (
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs bg-secondary">
                          Groove
                        </span>
                      )}
                      {track.isDmcaRemoved && (
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs bg-red-100 text-red-800">
                          DMCA Removed
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
