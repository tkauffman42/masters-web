export interface HoleScore {
  hole: number;
  strokes: number;
  toPar: string;
}

export interface RoundScore {
  round: number;
  strokes: number | null;
  toPar: string | null;
  holes: HoleScore[];
}

export interface Golfer {
  id: number;
  name: string;
  country: string;
  worldRanking: number;
  score: number;
  scoreDisplay: string;
  today: number;
  todayDisplay: string;
  thru: string;
  position: string;
  sortOrder?: number;
  rounds: RoundScore[];
}

export interface PoolEntry {
  id: number;
  name: string;
  golfers: Golfer[];
  totalPoints: number;
}

export interface SelectionPlayer {
  id: number;
  name: string;
  country: string;
}

export interface TierConfig {
  tier: number;
  name: string;
  picks: number;
  players: SelectionPlayer[];
}

export interface TeamPick {
  tier: number;
  playerId: number;
  playerName: string;
  scores: PlayerRoundScore[];
}

export interface PlayerRoundScore {
  round: number;
  roundScore: string;
  roundRawScore: number;
  holesPlayed: number;
  roundState: string;
  totalScore: string;
  position: number;
  currentRound: number;
  playerName: string;
  country: string;
}

export interface TeamSubmission {
  teamName: string;
  picks: TeamPick[];
}
