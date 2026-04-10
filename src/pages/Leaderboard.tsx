import { useState, useEffect } from "react";
import type { TeamSubmission, TeamPick } from "../types";
import "./Leaderboard.css";

function parseScore(display: string): number {
  if (!display || display === "E") return 0;
  return parseInt(display, 10) || 0;
}

function getTeamTotal(picks: TeamPick[]): number {
  const scores = picks
    .map((p) => {
      const latest = p.scores?.[p.scores.length - 1];
      return latest ? parseScore(latest.totalScore) : null;
    })
    .filter((s): s is number => s !== null)
    .sort((a, b) => a - b);
  // Best 4 scores count
  return scores.slice(0, 4).reduce((sum, s) => sum + s, 0);
}

function formatTotal(n: number): string {
  if (n === 0) return "E";
  return n > 0 ? `+${n}` : `${n}`;
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
          return (
            <div key={team.teamName} className={`lb-card ${index === 0 ? "leader" : ""}`}>
              <div className="lb-rank">
                {index === 0 ? "🏆" : index + 1}
              </div>
              <div className="lb-info">
                <div className="lb-name">{team.teamName}</div>
                <div className="lb-picks">
                  {team.picks.map((p) => {
                    const latest = p.scores?.[p.scores.length - 1];
                    return (
                      <div key={p.playerId} className="lb-pick-row">
                        <span className="pick-player">{p.playerName}</span>
                        {latest && (
                          <>
                            <span className="pick-score">{latest.totalScore}</span>
                            <span className="pick-round">R{latest.currentRound}</span>
                            <span className="pick-thru">
                              {latest.holesPlayed === 18 ? "F" : `${latest.holesPlayed}H`}
                            </span>
                          </>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
              <div className="lb-points">
                <span className={`points-value ${total < 0 ? "under-par" : total > 0 ? "over-par" : ""}`}>
                  {formatTotal(total)}
                </span>
                <span className="points-label">total</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
