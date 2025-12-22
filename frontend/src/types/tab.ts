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
