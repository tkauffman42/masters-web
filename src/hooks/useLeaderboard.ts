import { useState, useEffect, useCallback } from "react";
import type { Golfer, RoundScore, HoleScore } from "../types";

const API_URL = "https://masters-api.vercel.app/api/leaderboard";
const POLL_INTERVAL = 30_000; // 30 seconds

function parseScore(displayValue: string): number {
  if (!displayValue || displayValue === "E" || displayValue === "-") return 0;
  return parseInt(displayValue, 10) || 0;
}

interface APIHoleScore {
  value: number;
  displayValue: string;
  period: number;
  scoreType?: { displayValue: string };
}

interface APIRoundScore {
  value?: number;
  displayValue?: string;
  period: number;
  linescores?: APIHoleScore[];
}

interface APICompetitor {
  id: string;
  order: number;
  athlete: {
    fullName?: string;
    displayName: string;
    shortName?: string;
    flag?: { alt: string };
  };
  score: string;
  linescores: APIRoundScore[];
}

function mapRound(r: APIRoundScore): RoundScore {
  const holes: HoleScore[] = (r.linescores ?? []).map((h) => ({
    hole: h.period,
    strokes: h.value,
    toPar: h.scoreType?.displayValue ?? "E",
  }));

  return {
    round: r.period,
    strokes: r.value ?? null,
    toPar: r.displayValue ?? null,
    holes,
  };
}

function computePosition(competitors: APICompetitor[]): Map<number, string> {
  const positions = new Map<number, string>();
  let i = 0;
  while (i < competitors.length) {
    const score = competitors[i].score;
    let j = i;
    while (j < competitors.length && competitors[j].score === score) j++;
    const count = j - i;
    const pos = i + 1;
    for (let k = i; k < j; k++) {
      positions.set(
        competitors[k].order,
        count > 1 ? `T${pos}` : `${pos}`
      );
    }
    i = j;
  }
  return positions;
}

function mapCompetitor(
  c: APICompetitor,
  currentRound: number,
  position: string
): Golfer {
  const rounds = c.linescores.map(mapRound);
  const currentRoundData = rounds.find((r) => r.round === currentRound);
  const holesPlayed = currentRoundData?.holes.length ?? 0;

  let thru: string;
  if (holesPlayed === 18) {
    thru = "F";
  } else if (holesPlayed > 0) {
    thru = String(holesPlayed);
  } else {
    thru = "-";
  }

  const todayRound = currentRoundData;
  const todayDisplay = todayRound?.toPar ?? "-";

  return {
    id: Number(c.id),
    name: c.athlete?.displayName || "Unknown",
    country: c.athlete?.flag?.alt || "",
    worldRanking: 0,
    score: parseScore(c.score),
    scoreDisplay: c.score,
    today: todayDisplay ? parseScore(todayDisplay) : 0,
    todayDisplay,
    thru,
    position,
    sortOrder: c.order,
    rounds,
  };
}

export interface LeaderboardState {
  golfers: Golfer[];
  currentRound: number;
  roundStatus: string;
  loading: boolean;
  error: string | null;
  lastUpdated: Date | null;
  refetch: () => Promise<void>;
}

export function useLeaderboard(): LeaderboardState {
  const [golfers, setGolfers] = useState<Golfer[]>([]);
  const [currentRound, setCurrentRound] = useState(1);
  const [roundStatus, setRoundStatus] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const fetchData = useCallback(async () => {
    try {
      const res = await fetch(API_URL);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();

      const competition = data?.events?.[0]?.competitions?.[0];
      if (!competition) throw new Error("No competition data found");

      const competitors: APICompetitor[] = competition.competitors ?? [];
      if (!competitors.length) throw new Error("No competitor data found");

      const round = competition.status?.period ?? 1;
      const status = competition.status?.type?.shortDetail ?? "";

      setCurrentRound(round);
      setRoundStatus(status);

      // Competitors are already sorted by order from the API
      const sorted = [...competitors].sort((a, b) => a.order - b.order);
      const positions = computePosition(sorted);

      const mapped = sorted.map((c) =>
        mapCompetitor(c, round, positions.get(c.order) ?? String(c.order))
      );

      setGolfers(mapped);
      setError(null);
      setLastUpdated(new Date());
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, POLL_INTERVAL);
    return () => clearInterval(interval);
  }, [fetchData]);

  return { golfers, currentRound, roundStatus, loading, error, lastUpdated, refetch: fetchData };
}
