import { useState } from "react";
import { tiers } from "../data";
import type { SelectionPlayer } from "../types";
import "./TeamSelection.css";

const TOTAL_PICKS = tiers.reduce((sum, t) => sum + t.picks, 0);

export default function TeamSelection() {
  // selections keyed by tier number
  const [selected, setSelected] = useState<Record<number, SelectionPlayer[]>>({});

  const tierSelections = (tier: number) => selected[tier] ?? [];

  const togglePlayer = (tier: number, maxPicks: number, player: SelectionPlayer) => {
    setSelected((prev) => {
      const current = prev[tier] ?? [];
      const isSelected = current.some((p) => p.id === player.id);
      if (isSelected) {
        return { ...prev, [tier]: current.filter((p) => p.id !== player.id) };
      }
      if (current.length >= maxPicks) return prev;
      return { ...prev, [tier]: [...current, player] };
    });
  };

  const isPlayerSelected = (tier: number, player: SelectionPlayer) =>
    tierSelections(tier).some((p) => p.id === player.id);

  const allPicks = tiers.flatMap((t) => tierSelections(t.tier));
  const allTiersFull = tiers.every((t) => tierSelections(t.tier).length === t.picks);

  return (
    <div className="team-selection">
      <div className="page-header">
        <h1>Select Your Team</h1>
        <p>
          Choose {TOTAL_PICKS} golfers across {tiers.length} tiers for your Masters pool roster.{" "}
          <strong>
            {allPicks.length}/{TOTAL_PICKS} selected
          </strong>
        </p>
      </div>

      {allPicks.length > 0 && (
        <div className="selected-banner">
          <h3>Your Picks</h3>
          <div className="selected-chips">
            {tiers.map((t) =>
              tierSelections(t.tier).map((p) => (
                <button
                  key={p.id}
                  className="chip"
                  onClick={() => togglePlayer(t.tier, t.picks, p)}
                >
                  {p.name} ✕
                </button>
              ))
            )}
          </div>
        </div>
      )}

      {tiers.map((t) => {
        const picks = tierSelections(t.tier);
        const isFull = picks.length >= t.picks;
        return (
          <div key={t.tier} className="tier-section">
            <div className="tier-header">
              <h2>
                {t.name}{" "}
                <span className="tier-pick-info">
                  (pick {t.picks}) — {picks.length}/{t.picks}
                </span>
              </h2>
              {isFull && <span className="tier-complete">✓ Complete</span>}
            </div>
            <div className="golfer-grid">
              {t.players.map((player) => {
                const sel = isPlayerSelected(t.tier, player);
                const disabled = !sel && isFull;
                return (
                  <button
                    key={player.id}
                    className={`golfer-card ${sel ? "selected" : ""} ${disabled ? "disabled" : ""}`}
                    onClick={() => togglePlayer(t.tier, t.picks, player)}
                    disabled={disabled}
                  >
                    <div className="golfer-name">{player.name}</div>
                    <div className="golfer-country">{player.country}</div>
                    {sel && <div className="golfer-check">✓</div>}
                  </button>
                );
              })}
            </div>
          </div>
        );
      })}

      {allTiersFull && (
        <div className="submit-section">
          <button className="btn btn-primary submit-btn">
            Lock In My Picks
          </button>
        </div>
      )}
    </div>
  );
}
