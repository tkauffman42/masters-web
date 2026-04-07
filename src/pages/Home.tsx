import { Link } from "react-router-dom";
import "./Home.css";

export default function Home() {
  return (
    <div className="home">
      <section className="hero">
        <h1 className="hero-title">The Masters Pool</h1>
        <p className="hero-subtitle">
          Pick your golfers. Track live scores. Compete for glory at Augusta.
        </p>
        <div className="hero-actions">
          <Link to="/team" className="btn btn-primary">
            Select Your Team
          </Link>
          <Link to="/leaderboard" className="btn btn-secondary">
            View Leaderboard
          </Link>
        </div>
      </section>

      <section className="features">
        <div className="feature-card">
          <div className="feature-icon">🏌️</div>
          <h3>Pick Your Team</h3>
          <p>Select your golfers from the Masters field and build your dream roster.</p>
        </div>
        <div className="feature-card">
          <div className="feature-icon">📊</div>
          <h3>Live Scores</h3>
          <p>Follow real-time tournament scores as the action unfolds at Augusta National.</p>
        </div>
        <div className="feature-card">
          <div className="feature-icon">🏆</div>
          <h3>Leaderboard</h3>
          <p>See how you stack up against the competition in the pool standings.</p>
        </div>
      </section>
    </div>
  );
}
