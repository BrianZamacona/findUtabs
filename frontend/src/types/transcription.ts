export type TrackType =
  | 'GUITAR_LEAD'
  | 'GUITAR_RHYTHM'
  | 'BASS'
  | 'PIANO'
  | 'VIOLIN'
  | 'WINDS'
  | 'VOCALS'
  | 'DRUMS'
  | 'OTHER';

export type TranscriptionType =
  | 'AI_GENERATED'
  | 'USER_UPLOADED'
  | 'USER_WRITTEN'
  | 'USER_CORRECTED';

export type TranscriptionStatus = 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED';

export type SourceType = 'YOUTUBE' | 'SPOTIFY' | 'TIDAL' | 'SOUNDCLOUD' | 'FILE_UPLOAD' | 'URL';

export type FileType =
  | 'GUITAR_PRO'
  | 'PDF'
  | 'MIDI'
  | 'MUSICXML'
  | 'AUDIO_MP3'
  | 'AUDIO_WAV'
  | 'IMAGE';

export interface TrackSummary {
  id: number;
  trackType: TrackType;
  instrumentDetail: string | null;
  hasTabs: boolean;
  hasStaff: boolean;
  hasChords: boolean;
  hasLyrics: boolean;
  hasGroove: boolean;
  isDmcaRemoved: boolean;
}

export interface TranscriptionResponse {
  id: number;
  songId: number;
  songTitle: string | null;
  songArtist: string | null;
  status: TranscriptionStatus;
  transcriptionType: TranscriptionType;
  bpm: number | null;
  timeSignature: string | null;
  musicalKey: string | null;
  durationMs: number | null;
  aiProvider: string | null;
  errorMessage: string | null;
  tracks: TrackSummary[];
  createdAt: string;
  processingCompletedAt: string | null;
}

export interface LibrarySong {
  id: number;
  title: string | null;
  artist: string | null;
  sourceType: SourceType;
  sourceUrl: string | null;
  playCount: number;
  isPublic: boolean;
  transcriptionCount: number;
  createdAt: string;
}

export interface CreateTranscriptionRequest {
  sourceUrl?: string;
  uploadedFileId?: number;
  sourceType: SourceType;
  title?: string;
  artist?: string;
  rightsConfirmed: boolean;
  isPublic?: boolean;
  requestedInstruments?: string[];
}

export interface DmcaReportRequest {
  reporterName: string;
  reporterEmail: string;
  reporterCompany?: string;
  contentUrl: string;
  originalWorkDescription: string;
  ownershipStatement: string;
  goodFaithStatement: boolean;
  accuracyStatement: boolean;
}
