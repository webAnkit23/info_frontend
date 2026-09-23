import React, { useEffect, useMemo, useState } from "react";

/**
 * InfotrekChessLoader
 * A 3D chess-themed loading animation for the Infotrek event site.
 *
 * Signature element: an extruded, spinning neon knight hovering above
 * a tilted 8x8 board whose squares sweep with light on a diagonal wave.
 * Progress is narrated the way a chess broadcast narrates a game —
 * via an algebraic move ticker keyed to load percentage.
 *
 * Usage:
 *   <InfotrekChessLoader />                        // self-animating demo loop
 *   <InfotrekChessLoader progress={62} />           // controlled, e.g. asset loader
 *   <InfotrekChessLoader progress={p} onComplete={() => setLoading(false)} />
 */

const CYAN = "rgb(47,252,254)";

const OPENING = [
  "e4", "e5", "Nf3", "Nc6", "Bb5", "a6",
  "Ba4", "Nf6", "O-O", "Be7", "Re1", "b5",
  "Bb3", "d6", "c3", "O-O",
];

const FILES = ["a", "b", "c", "d", "e", "f", "g", "h"];

export default function Loader3D({
  progress,
  label = "PRELOADING ARENA",
  eventName = "INFOTREK",
  onComplete,
}) {
  const isControlled = typeof progress === "number";
  const [auto, setAuto] = useState(0);

  // Self-driving demo progress when no `progress` prop is supplied.
  useEffect(() => {
    if (isControlled) return;
    let raf;
    const start = performance.now();
    const DURATION = 3200;
    const tick = (now) => {
      const elapsed = (now - start) % DURATION;
      setAuto(Math.min(100, (elapsed / DURATION) * 100));
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [isControlled]);

  const pct = isControlled ? Math.max(0, Math.min(100, progress)) : auto;

  useEffect(() => {
    if (isControlled && pct >= 100 && onComplete) onComplete();
  }, [pct, isControlled, onComplete]);

  const moveIndex = Math.min(
    OPENING.length - 1,
    Math.floor((pct / 100) * OPENING.length)
  );
  const currentMove = OPENING[moveIndex];

  const squares = useMemo(() => {
    const arr = [];
    for (let r = 0; r < 8; r++) {
      for (let c = 0; c < 8; c++) {
        arr.push({ key: `${r}-${c}`, dark: (r + c) % 2 === 1, delay: (r + c) * 0.09 });
      }
    }
    return arr;
  }, []);

  const knightLayers = useMemo(() => Array.from({ length: 12 }, (_, i) => i), []);

  return (
    <div className="itk-root" role="status" aria-live="polite" aria-label={`${label}, ${Math.round(pct)} percent`}>
      <style>{`
        @import url("https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;0,900;1,700;1,900&family=Manrope:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500;700&display=swap");
        @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;500;600;700;800;900&display=swap');

        .itk-root {
          position: fixed;
          inset: 0;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: clamp(1.25rem, 3vw, 2.25rem);
          background:
            radial-gradient(ellipse at 50% 38%, rgba(47,252,254,0.06) 0%, rgba(5,8,12,0) 55%),
            radial-gradient(ellipse at 50% 50%, #0b1622 0%, #05080c 65%, #020304 100%);
          color: ${CYAN};
          overflow: hidden;
          font-family: "Manrope", sans-serif;
          z-index: 9999;
        }

        /* ---------- 3D stage ---------- */
        .itk-stage {
          position: relative;
          width: min(58vw, 340px);
          height: min(58vw, 340px);
          perspective: 1400px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .itk-board {
          position: relative;
          width: 100%;
          height: 100%;
          display: grid;
          grid-template-columns: repeat(8, 1fr);
          grid-template-rows: repeat(8, 1fr);
          transform-style: preserve-3d;
          transform: rotateX(62deg) rotateZ(0deg);
          border: 1px solid rgba(47,252,254,0.28);
          box-shadow: 0 0 60px rgba(47,252,254,0.08);
        }

        .itk-sq {
          position: relative;
          border: 1px solid rgba(47,252,254,0.08);
        }
        .itk-sq--dark { background: rgba(8,16,24,0.92); }
        .itk-sq--light { background: rgba(18,32,42,0.92); }

        .itk-sq::after {
          content: "";
          position: absolute;
          inset: 0;
          background: ${CYAN};
          opacity: 0;
          animation: itk-sweep 2.6s ease-in-out infinite;
          animation-delay: var(--sq-delay, 0s);
        }

        @keyframes itk-sweep {
          0%, 82%, 100% { opacity: 0; }
          88% { opacity: 0.55; box-shadow: 0 0 14px 2px rgba(47,252,254,0.6); }
        }

        /* grounding shadow for the knight */
        .itk-shadow {
          position: absolute;
          left: 50%;
          top: 50%;
          width: 34%;
          height: 14%;
          transform: translate(-50%, -50%) rotateX(62deg);
          background: radial-gradient(ellipse, rgba(47,252,254,0.35) 0%, rgba(47,252,254,0) 72%);
          filter: blur(2px);
          animation: itk-shadow-pulse 3s ease-in-out infinite;
        }
        @keyframes itk-shadow-pulse {
          0%, 100% { opacity: 0.55; }
          50% { opacity: 0.9; }
        }

        /* ---------- extruded spinning knight ---------- */
        .itk-knight-wrap {
          position: absolute;
          left: 50%;
          top: 42%;
          transform: translate(-50%, -50%);
          transform-style: preserve-3d;
          animation: itk-spin 5.5s linear infinite;
        }
        @keyframes itk-spin {
          from { transform: translate(-50%, -50%) rotateY(0deg); }
          to   { transform: translate(-50%, -50%) rotateY(360deg); }
        }

        .itk-knight-layer {
          position: absolute;
          left: 50%;
          top: 50%;
          font-size: clamp(3.4rem, 11vw, 5.4rem);
          line-height: 1;
          transform-origin: center;
          user-select: none;
          font-family: Georgia, "Times New Roman", serif;
        }

        /* ---------- text stack ---------- */
        .itk-name {
          font-family: "Orbitron", sans-serif;
          font-weight: 800;
          letter-spacing: 0.28em;
          font-size: clamp(1.4rem, 4vw, 2.1rem);
          color: ${CYAN};
          text-shadow: 0 0 18px rgba(47,252,254,0.55), 0 0 42px rgba(47,252,254,0.25);
        }

        .itk-label {
          font-family: "Manrope", sans-serif;
          font-weight: 600;
          letter-spacing: 0.35em;
          font-size: clamp(0.6rem, 1.4vw, 0.72rem);
          color: rgba(200, 245, 246, 0.55);
          text-transform: uppercase;
          margin-top: 0.35rem;
        }

        .itk-meta-row {
          display: flex;
          align-items: baseline;
          gap: 1rem;
          font-family: "JetBrains Mono", monospace;
        }

        .itk-move {
          font-size: clamp(0.85rem, 2vw, 1rem);
          color: rgba(47,252,254,0.85);
        }
        .itk-move::before {
          content: "▸ ";
          color: rgba(47,252,254,0.5);
        }
        .itk-move-cursor {
          display: inline-block;
          width: 0.5em;
          margin-left: 2px;
          border-right: 2px solid ${CYAN};
          animation: itk-blink 1s step-end infinite;
        }
        @keyframes itk-blink {
          50% { border-color: transparent; }
        }

        .itk-pct {
          font-size: clamp(0.85rem, 2vw, 1rem);
          color: rgba(230, 245, 246, 0.85);
          font-variant-numeric: tabular-nums;
        }

        /* ---------- progress bar ---------- */
        .itk-bar-track {
          position: relative;
          width: min(78vw, 320px);
          height: 3px;
          background: rgba(47,252,254,0.12);
          border-radius: 2px;
          overflow: hidden;
        }
        .itk-bar-fill {
          position: absolute;
          inset: 0 auto 0 0;
          background: ${CYAN};
          box-shadow: 0 0 10px rgba(47,252,254,0.85), 0 0 22px rgba(47,252,254,0.4);
          border-radius: 2px;
        }
        .itk-bar-glint {
          position: absolute;
          top: 0;
          bottom: 0;
          width: 40px;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.65), transparent);
          mix-blend-mode: screen;
          animation: itk-glint 1.6s linear infinite;
        }
        @keyframes itk-glint {
          from { transform: translateX(-60px); }
          to   { transform: translateX(340px); }
        }

        .itk-files {
          display: flex;
          gap: clamp(0.5rem, 2vw, 0.9rem);
          font-family: "JetBrains Mono", monospace;
          font-size: 0.62rem;
          letter-spacing: 0.3em;
          color: rgba(47,252,254,0.35);
          text-transform: uppercase;
        }

        @media (prefers-reduced-motion: reduce) {
          .itk-sq::after,
          .itk-shadow,
          .itk-knight-wrap,
          .itk-bar-glint,
          .itk-move-cursor {
            animation: none !important;
          }
          .itk-sq::after { opacity: 0; }
        }
      `}</style>

      <div className="itk-stage">
        <div className="itk-board">
          {squares.map((sq) => (
            <div
              key={sq.key}
              className={`itk-sq ${sq.dark ? "itk-sq--dark" : "itk-sq--light"}`}
              style={{ "--sq-delay": `${sq.delay}s` }}
            />
          ))}
          <div className="itk-shadow" />
        </div>

        <div className="itk-knight-wrap">
          {knightLayers.map((i) => {
            const depth = i - Math.floor(knightLayers.length / 2);
            const brightness = 0.35 + (i / (knightLayers.length - 1)) * 0.65;
            const isFront = i === knightLayers.length - 1;
            return (
              <div
                key={i}
                className="itk-knight-layer"
                style={{
                  transform: `translate(-50%, -50%) translateZ(${depth * 2}px)`,
                  color: isFront ? CYAN : "#0c2f31",
                  opacity: brightness,
                  filter: isFront
                    ? "drop-shadow(0 0 14px rgba(47,252,254,0.85)) drop-shadow(0 0 28px rgba(47,252,254,0.4))"
                    : "none",
                }}
              >
                ♞
              </div>
            );
          })}
        </div>
      </div>

      <div className="itk-files">
        {FILES.map((f) => (
          <span key={f}>{f}</span>
        ))}
      </div>

      <div style={{ textAlign: "center" }}>
        <div className="itk-name">{eventName}</div>
        <div className="itk-label">{label}</div>
      </div>

      <div className="itk-meta-row">
        <span className="itk-move">
          {currentMove}
          <span className="itk-move-cursor" />
        </span>
        <span className="itk-pct">{String(Math.round(pct)).padStart(2, "0")}%</span>
      </div>

      <div className="itk-bar-track">
        <div className="itk-bar-fill" style={{ width: `${pct}%` }} />
        <div className="itk-bar-glint" />
      </div>
    </div>
  );
}