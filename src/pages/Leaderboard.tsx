import { useState, useEffect } from "react";
import type { TeamSubmission, TeamPick, PlayerRoundScore } from "../types";
import "./Leaderboard.css";

function parseScore(display: string): number {
  if (!display || display === "E" || display === "-") return 0;
  return parseInt(display, 10) || 0;
}

function getRounds(picks: TeamPick[]): number[] {
  const roundNumbers = new Set<number>();
  for (const p of picks) {
    for (const s of p.scores ?? []) {
      roundNumbers.add(s.round);
    }
  }
  return Array.from(roundNumbers).sort((a, b) => a - b);
}

function getRoundSubtotal(picks: TeamPick[], round: number): { total: number; droppedIndex: number } {
  const scores: { idx: number; val: number }[] = [];
  for (let i = 0; i < picks.length; i++) {
    const entry = picks[i].scores?.find((s) => s.round === round);
    if (entry) {
      scores.push({ idx: i, val: parseScore(entry.roundScore) });
    }
  }
  scores.sort((a, b) => a.val - b.val);
  const counting = scores.slice(0, 4);
  const dropped = scores.length > 4 ? scores[scores.length - 1].idx : -1;
  const total = counting.reduce((sum, s) => sum + s.val, 0);
  return { total, droppedIndex: dropped };
}

function getTeamTotal(picks: TeamPick[]): number {
  const rounds = getRounds(picks);
  let total = 0;
  for (const round of rounds) {
    total += getRoundSubtotal(picks, round).total;
  }
  return total;
}

function formatScore(n: number): string {
  if (n === 0) return "E";
  return n > 0 ? `+${n}` : `${n}`;
}

function getPlayerStatus(scores: PlayerRoundScore[] | undefined): string {
  if (!scores || scores.length === 0) return "";
  const latest = scores[scores.length - 1];
  if (latest.roundState === "Complete" && latest.holesPlayed === 18) return "F";
  if (latest.holesPlayed === 0) return "";
  return `Thru ${latest.holesPlayed}`;
}

export default function Leaderboard() {
  const [teams, setTeams] = useState<TeamSubmission[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("https://masters-api.vercel.app/api/teams")
      .then((res) => {
        if (!res.ok) throw new Error(`Failed to load teams (${res.status})`);
        return res.json();
      })
      .then((data: TeamSubmission[]) => setTeams(data))
      .catch((err) => setError(err instanceof Error ? err.message : "Something went wrong"))
      .finally(() => setLoading(false));
  }, []);

  const sorted = [...teams].sort((a, b) => getTeamTotal(a.picks) - getTeamTotal(b.picks));

  // Determine all rounds across all teams
  const allRounds = getRounds(sorted.flatMap((t) => t.picks));

  return (
    <div className="leaderboard">
      <div className="page-header">
        <h1>Pool Leaderboard</h1>
        <p>See who's leading the Masters pool standings.</p>
      </div>

      {loading && <p>Loading teams…</p>}
      {error && <p className="lb-error">{error}</p>}

      <div className="leaderboard-list">
        {sorted.map((team, index) => {
          const total = getTeamTotal(team.picks);
          const teamRounds = getRounds(team.picks);

          return (
            <div key={team.teamName} className={`lb-card ${index === 0 ? "leader" : ""}`}>
              <div className="lb-rank">
                {index === 0 ? "🏆" : index + 1}
              </div>
              <div className="lb-info">
                <div className="lb-header-row">
                  <div className="lb-name">{team.teamName}</div>
                  <div className={`lb-total ${total < 0 ? "under-par" : total > 0 ? "over-par" : ""}`}>
                    {formatScore(total)}
                  </div>
                </div>

                <div className="lb-round-table">
                  {/* Column headers */}
                  <div className="lb-table-header">
                    <span className="lb-col-player">Player</span>
                    {allRounds.map((r) => (
                      <span key={r} className="lb-col-round">R{r}</span>
                    ))}
                    <span className="lb-col-total">Tot</span>
                    <span className="lb-col-status">Status</span>
                  </div>

                  {/* Player rows */}
                  {team.picks.map((p, pickIdx) => {
                    const latest = p.scores?.[p.scores.length - 1];
                    const status = getPlayerStatus(p.scores);
                    const droppedRounds = new Set<number>();
                    for (const r of teamRounds) {
                      const { droppedIndex } = getRoundSubtotal(team.picks, r);
                      if (droppedIndex === pickIdx) droppedRounds.add(r);
                    }

                    return (
                      <div key={p.playerId} className="lb-table-row">
                        <span className="lb-col-player">{p.playerName}</span>
                        {allRounds.map((r) => {
                          const entry = p.scores?.find((s) => s.round === r);
                          const isDropped = droppedRounds.has(r);
                          const scoreVal = entry ? entry.roundScore : "";
                          const display = scoreVal === "-" ? "-" : scoreVal || "-";
                          return (
                            <span
                              key={r}
                              className={`lb-col-round ${isDropped ? "dropped" : ""}`}
                            >
                              {display}
                            </span>
                          );
                        })}
                        <span className={`lb-col-total ${latest ? (parseScore(latest.totalScore) < 0 ? "under-par" : parseScore(latest.totalScore) > 0 ? "over-par" : "") : ""}`}>
                          {latest?.totalScore ?? "-"}
                        </span>
                        <span className="lb-col-status">{status}</span>
                      </div>
                    );
                  })}

                  {/* Round subtotals row */}
                  <div className="lb-table-row lb-subtotal-row">
                    <span className="lb-col-player">Best 4</span>
                    {allRounds.map((r) => {
                      const { total: rTotal } = getRoundSubtotal(team.picks, r);
                      return (
                        <span key={r} className="lb-col-round subtotal">
                          {formatScore(rTotal)}
                        </span>
                      );
                    })}
                    <span className={`lb-col-total subtotal ${total < 0 ? "under-par" : total > 0 ? "over-par" : ""}`}>
                      {formatScore(total)}
                    </span>
                    <span className="lb-col-status"></span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
