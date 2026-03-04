export enum Difficulty {
  BEGINNER = 'BEGINNER',
  INTERMEDIATE = 'INTERMEDIATE',
  ADVANCED = 'ADVANCED',
  EXPERT = 'EXPERT',
}

export interface Tab {
  id: number;
  title: string;
  artist: string;
  difficulty: Difficulty;
  tuning: string;
  userId: number;
  username: string;
  fileUrl?: string;
  views: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateTabRequest {
  title: string;
  artist: string;
  difficulty?: Difficulty;
  tuning?: string;
  fileUrl?: string;
}

export type SourceType = 'YOUTUBE' | 'SPOTIFY' | 'TIDAL' | 'FILE_UPLOAD' | 'URL';
export type TranscriptionStatus = 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED';

export interface Song {
  id: number;
  title?: string;
  artist?: string;
  sourceUrl?: string;
  sourceType: SourceType;
  durationSeconds?: number;
  userId: number;
  createdAt: string;
  transcriptions?: Transcription[];
}

export interface Transcription {
  id: number;
  songId: number;
  status: TranscriptionStatus;
  tabsData?: Record<string, unknown>;
  staffData?: Record<string, unknown>;
  chordsData?: Record<string, unknown>;
  aiProvider?: string;
  errorMessage?: string;
  createdAt: string;
  processingCompletedAt?: string;
}

export interface CreateSongRequest {
  sourceUrl?: string;
  sourceType: SourceType;
  title?: string;
  artist?: string;
}
