import { useState } from "react";
import { sampleGolfers } from "../data";
import type { Golfer } from "../types";
import "./TeamSelection.css";

const MAX_PICKS = 4;

export default function TeamSelection() {
  const [selected, setSelected] = useState<Golfer[]>([]);

  const toggleGolfer = (golfer: Golfer) => {
    setSelected((prev) => {
      const isSelected = prev.some((g) => g.id === golfer.id);
      if (isSelected) return prev.filter((g) => g.id !== golfer.id);
      if (prev.length >= MAX_PICKS) return prev;
      return [...prev, golfer];
    });
  };

  const isSelected = (golfer: Golfer) => selected.some((g) => g.id === golfer.id);

  return (
    <div className="team-selection">
      <div className="page-header">
        <h1>Select Your Team</h1>
        <p>
          Choose {MAX_PICKS} golfers for your Masters pool roster.{" "}
          <strong>
            {selected.length}/{MAX_PICKS} selected
          </strong>
        </p>
      </div>

      {selected.length > 0 && (
        <div className="selected-banner">
          <h3>Your Picks</h3>
          <div className="selected-chips">
            {selected.map((g) => (
              <button
                key={g.id}
                className="chip"
                onClick={() => toggleGolfer(g)}
              >
                {g.name} ✕
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="golfer-grid">
        {sampleGolfers.map((golfer) => (
          <button
            key={golfer.id}
            className={`golfer-card ${isSelected(golfer) ? "selected" : ""} ${
              !isSelected(golfer) && selected.length >= MAX_PICKS ? "disabled" : ""
            }`}
            onClick={() => toggleGolfer(golfer)}
            disabled={!isSelected(golfer) && selected.length >= MAX_PICKS}
          >
            <div className="golfer-rank">#{golfer.worldRanking}</div>
            <div className="golfer-name">{golfer.name}</div>
            <div className="golfer-country">{golfer.country}</div>
            {isSelected(golfer) && <div className="golfer-check">✓</div>}
          </button>
        ))}
      </div>

      {selected.length === MAX_PICKS && (
        <div className="submit-section">
          <button className="btn btn-primary submit-btn">
            Lock In My Picks
          </button>
        </div>
      )}
    </div>
  );
}
