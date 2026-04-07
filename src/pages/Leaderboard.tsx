import { samplePoolEntries } from "../data";
import "./Leaderboard.css";

export default function Leaderboard() {
  const sorted = [...samplePoolEntries].sort((a, b) => b.totalPoints - a.totalPoints);

  return (
    <div className="leaderboard">
      <div className="page-header">
        <h1>Pool Leaderboard</h1>
        <p>See who's leading the Masters pool standings.</p>
      </div>

      <div className="leaderboard-list">
        {sorted.map((entry, index) => (
          <div key={entry.id} className={`lb-card ${index === 0 ? "leader" : ""}`}>
            <div className="lb-rank">
              {index === 0 ? "🏆" : index + 1}
            </div>
            <div className="lb-info">
              <div className="lb-name">{entry.name}</div>
              <div className="lb-golfers">
                {entry.golfers.map((g) => g.name).join(" · ")}
              </div>
            </div>
            <div className="lb-points">
              <span className="points-value">{entry.totalPoints}</span>
              <span className="points-label">pts</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
