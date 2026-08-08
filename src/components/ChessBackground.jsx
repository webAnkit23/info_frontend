
import { useEffect, useRef } from "react";

// Canvas background: drifting chess glyphs + dust, gently parallaxing with scroll.
const GLYPHS = ["\u265F", "\u265E", "\u265C", "\u265D", "\u265B", "\u265A"]; // pawn knight rook bishop queen king

export default function ChessBackground() {
  const canvasRef = useRef(null);
  const rafRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    let w, h, dpr;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = canvas.width = window.innerWidth * dpr;
      h = canvas.height = window.innerHeight * dpr;
      canvas.style.width = window.innerWidth + "px";
      canvas.style.height = window.innerHeight + "px";
    };
    resize();

    const pieceCount = window.innerWidth < 768 ? 14 : 26;
    const pieces = Array.from({ length: pieceCount }).map(() => ({
      x: Math.random() * w,
      y: Math.random() * h,
      size: (18 + Math.random() * 46) * dpr,
      glyph: GLYPHS[(Math.random() * GLYPHS.length) | 0],
      vy: (0.05 + Math.random() * 0.25) * dpr,
      vx: (Math.random() - 0.5) * 0.15 * dpr,
      rot: Math.random() * Math.PI,
      vr: (Math.random() - 0.5) * 0.003,
      alpha: 0.04 + Math.random() * 0.09,
      amber: Math.random() > 0.72,
    }));

    const dustCount = window.innerWidth < 768 ? 40 : 90;
    const dust = Array.from({ length: dustCount }).map(() => ({
      x: Math.random() * w,
      y: Math.random() * h,
      r: Math.random() * 1.4 * dpr + 0.3,
      vy: (0.1 + Math.random() * 0.4) * dpr,
      a: Math.random() * 0.5 + 0.1,
      cyan: Math.random() > 0.6,
    }));

    let scrollY = window.scrollY;
    const onScroll = () => (scrollY = window.scrollY);
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", resize);

    const draw = () => {
      ctx.clearRect(0, 0, w, h);
      const parallax = (scrollY * dpr * 0.12) % (h + 200);

      // dust
      dust.forEach((d) => {
        d.y += d.vy;
        if (d.y > h) d.y = 0;
        ctx.beginPath();
        ctx.arc(d.x, (d.y - parallax * 0.4 + h) % h, d.r, 0, Math.PI * 2);
        ctx.fillStyle = d.cyan
          ? `rgba(0,240,255,${d.a * 0.5})`
          : `rgba(255,255,255,${d.a * 0.4})`;
        ctx.fill();
      });

      // chess glyphs
      pieces.forEach((p) => {
        if (!reduce) {
          p.y += p.vy;
          p.x += p.vx;
          p.rot += p.vr;
        }
        if (p.y - p.size > h) p.y = -p.size;
        if (p.x < -p.size) p.x = w + p.size;
        if (p.x > w + p.size) p.x = -p.size;

        const drawY = (((p.y - parallax * 0.6) % (h + p.size * 2)) + h + p.size * 2) % (h + p.size * 2);
        ctx.save();
        ctx.translate(p.x, drawY);
        ctx.rotate(p.rot);
        ctx.font = `${p.size}px serif`;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillStyle = p.amber
          ? `rgba(255,184,0,${p.alpha * 1.4})`
          : `rgba(255,255,255,${p.alpha})`;
        ctx.fillText(p.glyph, 0, 0);
        ctx.restore();
      });

      rafRef.current = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      data-testid="chess-background-canvas"
      className="fixed inset-0 -z-10 pointer-events-none"
      aria-hidden="true"
    />
  );
}
