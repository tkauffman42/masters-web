export interface Golfer {
  id: number;
  name: string;
  country: string;
  worldRanking: number;
  score: number;
  today: number;
  thru: string;
  position: string;
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
