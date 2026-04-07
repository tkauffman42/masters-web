import { sampleGolfers } from "../data";
import "./LiveScores.css";

function formatScore(score: number): string {
  if (score === 0) return "E";
  return score > 0 ? `+${score}` : `${score}`;
}

export default function LiveScores() {
  const sorted = [...sampleGolfers].sort((a, b) => a.score - b.score);

  return (
    <div className="live-scores">
      <div className="page-header">
        <h1>Live Scores</h1>
        <p className="live-indicator">
          <span className="live-dot"></span> Tournament in progress
        </p>
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
            {sorted.map((golfer) => (
              <tr key={golfer.id}>
                <td className="pos">{golfer.position}</td>
                <td className="player">
                  <span className="player-name">{golfer.name}</span>
                  <span className="player-country">{golfer.country}</span>
                </td>
                <td className={`score ${golfer.score < 0 ? "under" : golfer.score > 0 ? "over" : ""}`}>
                  {formatScore(golfer.score)}
                </td>
                <td className={`today ${golfer.today < 0 ? "under" : golfer.today > 0 ? "over" : ""}`}>
                  {formatScore(golfer.today)}
                </td>
                <td className="thru">{golfer.thru}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
