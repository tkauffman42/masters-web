import { Link, useLocation } from "react-router-dom";
import "./Layout.css";

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const location = useLocation();

  const navLinks = [
    { to: "/", label: "Home" },
    { to: "/team", label: "My Team" },
    { to: "/scores", label: "Live Scores" },
    { to: "/leaderboard", label: "Leaderboard" },
  ];

  return (
    <div className="layout">
      <header className="header">
        <div className="header-inner">
          <Link to="/" className="logo">
            <span className="logo-icon">⛳</span>
            <span className="logo-text">Masters Pool</span>
          </Link>
          <nav className="nav">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`nav-link ${location.pathname === link.to ? "active" : ""}`}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
      </header>
      <main className="main">{children}</main>
      <footer className="footer">
        <p>Masters Pool {new Date().getFullYear()} &mdash; Augusta National Golf Club</p>
      </footer>
    </div>
  );
}
