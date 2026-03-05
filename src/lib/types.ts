export interface Match {
  year: number;
  matchNumber: number;
  player1: string;
  player2: string;
  p1Game1: number | null;
  p2Game1: number | null;
  p1Game2: number | null;
  p2Game2: number | null;
  p1Tiebreaker: number | null;
  p2Tiebreaker: number | null;
}

export interface MatchResult {
  match: Match;
  winner: string;
  loser: string;
  winnerPoints: number;
  loserPoints: number;
  scoreline: string; // e.g. "2-0" or "2-1 (TB)"
  games: GameResult[];
  tiebreaker: GameResult | null;
}

export interface GameResult {
  player1Score: number;
  player2Score: number;
  winner: string;
}

export interface Standing {
  player: string;
  played: number;
  won: number;
  lost: number;
  points: number;
  gamesWon: number;
  gamesLost: number;
}

export interface PlayerStats {
  player: string;
  totalMatches: number;
  totalWins: number;
  totalLosses: number;
  winPercentage: number;
  tiebreakersPlayed: number;
  tiebreakersWon: number;
  bestYear: { year: number; points: number } | null;
  worstYear: { year: number; points: number } | null;
  longestWinStreak: number;
  yearsPlayed: number[];
}

export interface HeadToHeadRecord {
  player1: string;
  player2: string;
  player1Wins: number;
  player2Wins: number;
  matches: MatchResult[];
  byYear: { year: number; p1Wins: number; p2Wins: number }[];
  handicap: number;
  handicapFavour: string;
}

export const PLAYERS = ["Phill", "Sean", "Brendan", "Leon"] as const;
export type Player = (typeof PLAYERS)[number];

export const PLAYER_COLORS: Record<string, string> = {
  Phill: "#f97316",    // orange
  Sean: "#22c55e",     // green
  Brendan: "#ef4444",  // red
  Leon: "#3b82f6",     // blue
};
