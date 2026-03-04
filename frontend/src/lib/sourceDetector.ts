export type Platform =
  | 'YOUTUBE'
  | 'SPOTIFY'
  | 'TIDAL'
  | 'SOUNDCLOUD'
  | 'FILE_UPLOAD'
  | 'UNKNOWN';

export interface DetectedSource {
  platform: Platform;
  trackId: string | null;
  embedUrl: string | null;
  originalUrl: string;
  canAutoTranscribe: boolean;
  platformLabel: string;
}

const PLATFORM_LABELS: Record<Platform, string> = {
  YOUTUBE: 'YouTube',
  SPOTIFY: 'Spotify',
  TIDAL: 'Tidal',
  SOUNDCLOUD: 'SoundCloud',
  FILE_UPLOAD: 'File Upload',
  UNKNOWN: 'Unknown',
};

export function detectSource(url: string): DetectedSource {
  const trimmed = url.trim();

  // YouTube: youtube.com/watch?v=ID or youtu.be/ID (handles extra query params)
  const youtubeMatch =
    trimmed.match(/youtube\.com\/watch\?.*v=([a-zA-Z0-9_-]{11})/) ||
    trimmed.match(/youtu\.be\/([a-zA-Z0-9_-]{11})/);
  if (youtubeMatch) {
    const trackId = youtubeMatch[1];
    return {
      platform: 'YOUTUBE',
      trackId,
      embedUrl: `https://www.youtube.com/embed/${trackId}`,
      originalUrl: trimmed,
      canAutoTranscribe: true,
      platformLabel: PLATFORM_LABELS.YOUTUBE,
    };
  }

  // Spotify: open.spotify.com/track/ID
  const spotifyMatch = trimmed.match(/open\.spotify\.com\/track\/([a-zA-Z0-9]+)/);
  if (spotifyMatch) {
    const trackId = spotifyMatch[1];
    return {
      platform: 'SPOTIFY',
      trackId,
      embedUrl: `https://open.spotify.com/embed/track/${trackId}`,
      originalUrl: trimmed,
      canAutoTranscribe: false,
      platformLabel: PLATFORM_LABELS.SPOTIFY,
    };
  }

  // Tidal: tidal.com/browse/track/ID
  const tidalMatch = trimmed.match(/tidal\.com\/browse\/track\/(\d+)/);
  if (tidalMatch) {
    const trackId = tidalMatch[1];
    return {
      platform: 'TIDAL',
      trackId,
      embedUrl: `https://embed.tidal.com/tidal-player/track/${trackId}`,
      originalUrl: trimmed,
      canAutoTranscribe: false,
      platformLabel: PLATFORM_LABELS.TIDAL,
    };
  }

  // SoundCloud: soundcloud.com/artist/song
  const soundcloudMatch = trimmed.match(/soundcloud\.com\/([^/?#]+\/[^/?#]+)/);
  if (soundcloudMatch) {
    const trackPath = soundcloudMatch[1];
    return {
      platform: 'SOUNDCLOUD',
      trackId: trackPath,
      embedUrl: `https://w.soundcloud.com/player/?url=${encodeURIComponent(trimmed)}&color=%23ff5500&auto_play=false`,
      originalUrl: trimmed,
      canAutoTranscribe: true,
      platformLabel: PLATFORM_LABELS.SOUNDCLOUD,
    };
  }

  return {
    platform: 'UNKNOWN',
    trackId: null,
    embedUrl: null,
    originalUrl: trimmed,
    canAutoTranscribe: false,
    platformLabel: PLATFORM_LABELS.UNKNOWN,
  };
}

export function isSupportedUrl(url: string): boolean {
  const source = detectSource(url);
  return source.platform !== 'UNKNOWN' && source.platform !== 'FILE_UPLOAD';
}

export function getTranscriptionWarning(source: DetectedSource): string | null {
  switch (source.platform) {
    case 'SPOTIFY':
      return 'Spotify restricts audio access. Automatic transcription is not available for Spotify tracks. You can still save this song to your library for manual transcription.';
    case 'TIDAL':
      return 'Tidal restricts audio access. Automatic transcription is not available for Tidal tracks. You can still save this song to your library for manual transcription.';
    case 'UNKNOWN':
      return 'This URL format is not recognized. Please use a YouTube, Spotify, Tidal, or SoundCloud link.';
    default:
      return null;
  }
}
