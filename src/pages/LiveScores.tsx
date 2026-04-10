import { useLeaderboard } from "../hooks/useLeaderboard";
import "./LiveScores.css";

function formatScore(score: number): string {
  if (score === 0) return "E";
  return score > 0 ? `+${score}` : `${score}`;
}

export default function LiveScores() {
  const { golfers, currentRound, roundStatus, loading, error, lastUpdated } = useLeaderboard();

  return (
    <div className="live-scores">
      <div className="page-header">
        <h1>Live Scores</h1>
        <p className="live-indicator">
          <span className="live-dot"></span>
          {loading ? "Loading live data…" : `${roundStatus || `Round ${currentRound}`} – updates every 30s`}
        </p>
        {error && <p className="error-text">⚠ {error}</p>}
        {lastUpdated && (
          <p className="last-updated">Last updated: {lastUpdated.toLocaleTimeString()}</p>
        )}
      </div>

      <div className="scores-table-wrapper">
        <table className="scores-table">
          <thead>
            <tr>
              <th>Pos</th>
              <th>Player</th>
              <th>Score</th>
              <th>Today</th>
              <th>Thru</th>
            </tr>
          </thead>
          <tbody>
            {golfers.map((golfer) => {
              const notStarted = golfer.position === "-";
              return (
                <tr key={golfer.id}>
                  <td className="pos">{golfer.position}</td>
                  <td className="player">
                    <span className="player-name">{golfer.name}</span>
                    <span className="player-country">{golfer.country}</span>
                  </td>
                  <td className={`score ${!notStarted && golfer.score < 0 ? "under" : !notStarted && golfer.score > 0 ? "over" : ""}`}>
                    {notStarted ? "-" : golfer.scoreDisplay ?? formatScore(golfer.score)}
                  </td>
                  <td className={`today ${!notStarted && golfer.today < 0 ? "under" : !notStarted && golfer.today > 0 ? "over" : ""}`}>
                    {notStarted ? "-" : golfer.todayDisplay ?? formatScore(golfer.today)}
                  </td>
                  <td className="thru">{golfer.thru}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
