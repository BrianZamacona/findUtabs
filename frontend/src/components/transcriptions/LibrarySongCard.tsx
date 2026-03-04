import { LibrarySong } from '@/types/transcription';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Play, Music } from 'lucide-react';
import Link from 'next/link';

interface LibrarySongCardProps {
  song: LibrarySong;
}

const SOURCE_LABELS: Record<string, string> = {
  YOUTUBE: 'YouTube',
  SPOTIFY: 'Spotify',
  TIDAL: 'Tidal',
  SOUNDCLOUD: 'SoundCloud',
  FILE_UPLOAD: 'Upload',
  URL: 'URL',
};

export function LibrarySongCard({ song }: LibrarySongCardProps) {
  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <CardTitle className="text-lg">{song.title ?? 'Unknown Title'}</CardTitle>
        <CardDescription>{song.artist ?? 'Unknown Artist'}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-secondary text-secondary-foreground">
              {SOURCE_LABELS[song.sourceType] ?? song.sourceType}
            </span>
            <span className="text-muted-foreground flex items-center gap-1">
              <Music className="h-3.5 w-3.5" />
              {song.transcriptionCount} transcription{song.transcriptionCount !== 1 ? 's' : ''}
            </span>
          </div>
          <span className="text-muted-foreground flex items-center gap-1">
            <Play className="h-3.5 w-3.5" />
            {song.playCount}
          </span>
        </div>
        {song.sourceUrl && (
          <a
            href={song.sourceUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-2 text-xs text-primary hover:underline block truncate"
          >
            {song.sourceUrl}
          </a>
        )}
        <p className="mt-2 text-xs text-muted-foreground">
          Added {new Date(song.createdAt).toLocaleDateString()}
        </p>
      </CardContent>
    </Card>
  );
}
