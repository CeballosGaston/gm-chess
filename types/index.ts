

export type UserRole = 'student' | 'gm'
export type ChessTitle = 'GM' | 'IM' | 'FM' | 'WGM' | 'WIM' | 'NM' | null;

export interface Profile {
  id: string;
  name: string | null;
  avatar_url: string | null;
  role: UserRole;
  title: ChessTitle;
  elo: number;
  bio: string | null;
  rating_avg: number;
  languages: string[];
  is_available: boolean;
  created_at: string;
  coins?: number; 
}


export interface Game {
  id: string;
  white_id: string;
  black_id: string;
  fen: string;
  status: 'waiting' | 'active' | 'finished';
}