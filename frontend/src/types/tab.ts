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
  alphaTexData?: string;
  averageRating?: number;
  ratingCount?: number;
}

export interface CreateTabRequest {
  title: string;
  artist: string;
  difficulty?: Difficulty;
  tuning?: string;
  fileUrl?: string;
  alphaTexData?: string;
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

export interface UpdateTabRequest {
  title: string;
  artist: string;
  difficulty?: Difficulty;
  tuning?: string;
  alphaTexData?: string;
  changeNotes?: string;
}

export interface TabRatingRequest {
  rating: number;
  comment?: string;
}

export interface TabRating {
  id: number;
  tabId: number;
  userId: number;
  username: string;
  rating: number;
  comment?: string;
  createdAt: string;
}

export interface TabVersion {
  id: number;
  tabId: number;
  versionNumber: number;
  alphaTexData?: string;
  changeNotes?: string;
  createdById: number;
  createdByUsername: string;
  createdAt: string;
}
