import { useEffect, useRef } from "react";

const GLYPHS = [
  "\u265F", // pawn
  "\u265E", // knight
  "\u265C", // rook
  "\u265D", // bishop
  "\u265B", // queen
  "\u265A", // king
];

export default function ChessBackground() {
  const canvasRef = useRef(null);
  const rafRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    let w = 0;
    let h = 0;
    let dpr = 1;

    const reduce = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    // =========================================================
    // RESIZE
    // =========================================================

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);

      w = window.innerWidth * dpr;
      h = window.innerHeight * dpr;

      canvas.width = w;
      canvas.height = h;

      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;

      ctx.setTransform(1, 0, 0, 1, 0, 0);
    };

    resize();

    // =========================================================
    // MOUSE
    // =========================================================

    const mouse = {
      x: 0,
      y: 0,
      targetX: 0,
      targetY: 0,
    };

    const onMouseMove = (e) => {
      mouse.targetX =
        (e.clientX / window.innerWidth - 0.5) * 2;

      mouse.targetY =
        (e.clientY / window.innerHeight - 0.5) * 2;
    };

    window.addEventListener("mousemove", onMouseMove, {
      passive: true,
    });

    // =========================================================
    // SCROLL PHYSICS
    // =========================================================

    let scrollY = window.scrollY;
    let previousScrollY = scrollY;

    let scrollVelocity = 0;
    let scrollBoost = 0;

    const onScroll = () => {
      const current = window.scrollY;

      const delta = current - previousScrollY;

      scrollVelocity += delta * 0.08;

      // Prevent extreme values
      scrollVelocity = Math.max(
        -30,
        Math.min(30, scrollVelocity)
      );

      previousScrollY = current;
      scrollY = current;
    };

    window.addEventListener("scroll", onScroll, {
      passive: true,
    });

    // =========================================================
    // CHESS PIECES
    // =========================================================

    const pieceCount =
      window.innerWidth < 768 ? 30 : 80;

    const pieces = Array.from({
      length: pieceCount,
    }).map(() => ({
      x: Math.random() * w,
      y: Math.random() * h,

      // REAL DEPTH
      z: Math.random() * 1200,

      size:
        (20 + Math.random() * 55) * dpr,

      glyph:
        GLYPHS[
          Math.floor(
            Math.random() * GLYPHS.length
          )
        ],

      vx:
        (Math.random() - 0.5) *
        0.35 *
        dpr,

      vy:
        (Math.random() - 0.5) *
        0.35 *
        dpr,

      rot: Math.random() * Math.PI * 2,

      vr:
        (Math.random() - 0.5) *
        0.004,

      alpha:
        0.08 +
        Math.random() * 0.22,

      amber:
        Math.random() > 0.72,

      // individual depth movement
      depthSpeed:
        0.15 +
        Math.random() * 0.35,
    }));

    // =========================================================
    // DUST
    // =========================================================

    const dustCount =
      window.innerWidth < 768
        ? 700
        : 1300;

    const dust = Array.from({
      length: dustCount,
    }).map(() => ({
      x: Math.random() * w,
      y: Math.random() * h,

      z: Math.random() * 1400,

      r:
        0.4 +
        Math.random() * 1.5 * dpr,

      vy:
        (0.08 +
          Math.random() * 0.3) *
        dpr,

      a:
        0.15 +
        Math.random() * 0.35,

      cyan:
        Math.random() > 0.72,
    }));

    // =========================================================
    // 3D PROJECTION
    // =========================================================

    const project3D = (x, y, z) => {
      const rotateY =
        mouse.x * 0.32;

      const rotateX =
        -mouse.y * 0.32;

      const cx = w / 2;
      const cy = h / 2;

      let px = x - cx;
      let py = y - cy;

      // -------------------------
      // Y ROTATION
      // -------------------------

      const cosY = Math.cos(rotateY);
      const sinY = Math.sin(rotateY);

      const rotatedX =
        px * cosY -
        z * sinY;

      const rotatedZ =
        px * sinY +
        z * cosY;

      // -------------------------
      // X ROTATION
      // -------------------------

      const cosX = Math.cos(rotateX);
      const sinX = Math.sin(rotateX);

      const rotatedY =
        py * cosX -
        rotatedZ * sinX;

      const finalZ =
        py * sinX +
        rotatedZ * cosX;

      // -------------------------
      // PERSPECTIVE
      // -------------------------

      const perspective = 1100;

      const scale =
        perspective /
        (perspective + finalZ);

      return {
        x: cx + rotatedX * scale,
        y: cy + rotatedY * scale,
        scale,
        depth: finalZ,
      };
    };

    // =========================================================
    // DRAW 3D GRID
    // =========================================================

    const drawGrid = () => {
      const centerX = w / 2;
      const horizonY = h * 0.46;

      ctx.save();

      ctx.lineWidth = 1 * dpr;

      // Horizontal perspective lines
      for (let i = 0; i < 14; i++) {
        const progress = i / 14;

        const y =
          horizonY +
          Math.pow(progress, 2) *
            h *
            0.7;

        ctx.strokeStyle = `rgba(255,255,255,${
          0.025 * (1 - progress)
        })`;

        ctx.beginPath();

        ctx.moveTo(0, y);
        ctx.lineTo(w, y);

        ctx.stroke();
      }

      // Vertical perspective lines
      const lines = 18;

      for (let i = -lines; i <= lines; i++) {
        const bottomX =
          centerX +
          i *
            (w / 10);

        ctx.strokeStyle =
          "rgba(255,255,255,0.025)";

        ctx.beginPath();

        ctx.moveTo(centerX, horizonY);
        ctx.lineTo(bottomX, h);

        ctx.stroke();
      }

      ctx.restore();
    };

    // =========================================================
    // DRAW
    // =========================================================

    const draw = () => {
      ctx.clearRect(
        0,
        0,
        w,
        h
      );

      // -----------------------------------------
      // SMOOTH MOUSE
      // -----------------------------------------

      if (!reduce) {
        mouse.x +=
          (mouse.targetX - mouse.x) *
          0.06;

        mouse.y +=
          (mouse.targetY - mouse.y) *
          0.06;
      }

      // -----------------------------------------
      // SCROLL MOMENTUM
      // -----------------------------------------

      if (!reduce) {
        scrollVelocity *= 0.91;

        scrollBoost +=
          (Math.abs(scrollVelocity) -
            scrollBoost) *
          0.12;
      } else {
        scrollVelocity = 0;
        scrollBoost = 0;
      }

      // -----------------------------------------
      // BACKGROUND GRID
      // -----------------------------------------

      drawGrid();

      // -----------------------------------------
      // DUST
      // -----------------------------------------

      dust.forEach((d) => {
        if (!reduce) {
          d.y +=
            d.vy +
            scrollVelocity * 0.35;
        }

        if (d.y > h + 20) {
          d.y = -20;
        }

        if (d.y < -20) {
          d.y = h + 20;
        }

        const drawY =
          ((d.y -
            scrollY * 0.15 +
            h) %
            h);

        const projected =
          project3D(
            d.x,
            drawY,
            d.z
          );

        const radius =
          Math.max(
            0.25,
            d.r *
              projected.scale
          );

        ctx.beginPath();

        ctx.arc(
          projected.x,
          projected.y,
          radius,
          0,
          Math.PI * 2
        );

        ctx.fillStyle = d.cyan
          ? `rgba(47,252,254,${
              d.a *
              projected.scale *
              0.6
            })`
          : `rgba(255,255,255,${
              d.a *
              projected.scale *
              0.35
            })`;

        ctx.fill();
      });

      // -----------------------------------------
      // CHESS PIECES
      // -----------------------------------------

      pieces.forEach((p) => {
        if (!reduce) {
          const speedMultiplier =
            1 +
            scrollBoost *
              0.025;

          p.x +=
            p.vx *
            speedMultiplier;

          p.y +=
            p.vy *
            speedMultiplier;

          p.rot +=
            p.vr *
            speedMultiplier;

          // Slight movement through Z
          p.z +=
            Math.sin(
              performance.now() *
                0.0005 *
                p.depthSpeed
            ) *
            0.08;
        }

        // -----------------------------------------
        // WRAP
        // -----------------------------------------

        if (p.x < -p.size) {
          p.x = w + p.size;
        }

        if (p.x > w + p.size) {
          p.x = -p.size;
        }

        if (p.y < -p.size) {
          p.y = h + p.size;
        }

        if (p.y > h + p.size) {
          p.y = -p.size;
        }

        // -----------------------------------------
        // SCROLL PARALLAX
        // -----------------------------------------

        const scrollDepth =
          0.25 +
          (1200 - p.z) /
            1200 *
            0.75;

        const drawY =
          (((p.y -
            scrollY *
              0.18 *
              scrollDepth +
            h) %
            h) +
            h) %
          h;

        // -----------------------------------------
        // PROJECT
        // -----------------------------------------

        const projected =
          project3D(
            p.x,
            drawY,
            p.z
          );

        // -----------------------------------------
        // DEPTH
        // -----------------------------------------

        const depthFactor =
          Math.max(
            0.15,
            Math.min(
              1.25,
              projected.scale
            )
          );

        const size =
          p.size *
          depthFactor;

        // Don't draw extremely distant objects
        if (
          size < 5 ||
          projected.scale < 0.12
        ) {
          return;
        }

        ctx.save();

        ctx.translate(
          projected.x,
          projected.y
        );

        ctx.scale(
          depthFactor,
          depthFactor
        );

        ctx.rotate(p.rot);

        // -----------------------------------------
        // GLOW
        // -----------------------------------------

        if (
          p.amber &&
          depthFactor > 0.45
        ) {
          ctx.shadowBlur =
            18 *
            depthFactor;

          ctx.shadowColor =
            "rgba(47,252,254,0.5)";
        }

        // -----------------------------------------
        // PIECE
        // -----------------------------------------

        ctx.font = `${size}px serif`;

        ctx.textAlign = "center";
        ctx.textBaseline = "middle";

        const alpha =
          p.alpha *
          depthFactor;

        ctx.fillStyle = p.amber
          ? `rgba(47,252,254,${
              alpha * 1.4
            })`
          : `rgba(255,255,255,${
              alpha
            })`;

        ctx.fillText(
          p.glyph,
          0,
          0
        );

        ctx.restore();
      });

      // -----------------------------------------
      // NEXT FRAME
      // -----------------------------------------

      rafRef.current =
        requestAnimationFrame(
          draw
        );
    };

    draw();

    // =========================================================
    // CLEANUP
    // =========================================================

    return () => {
      cancelAnimationFrame(
        rafRef.current
      );

      window.removeEventListener(
        "mousemove",
        onMouseMove
      );

      window.removeEventListener(
        "scroll",
        onScroll
      );

      window.removeEventListener(
        "resize",
        resize
      );
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 -z-10 pointer-events-none"
      style={{
        transform:
          "translateZ(0)",
        willChange:
          "transform",
      }}
    />
  );
}
























/*
import { useEffect, useRef } from "react";

// Chess pieces used in the background
const GLYPHS = [
  "\u265F", // pawn
  "\u265E", // knight
  "\u265C", // rook
  "\u265D", // bishop
  "\u265B", // queen
  "\u265A", // king
  "\u265F",
];

export default function ChessBackground() {
  const canvasRef = useRef(null);
  const rafRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    let w;
    let h;
    let dpr;

    const reduce = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    // ------------------------------------------
    // RESIZE
    // ------------------------------------------

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);

      w = window.innerWidth * dpr;
      h = window.innerHeight * dpr;

      canvas.width = w;
      canvas.height = h;

      canvas.style.width = window.innerWidth + "px";
      canvas.style.height = window.innerHeight + "px";
    };

    resize();

    // ------------------------------------------
    // MOUSE
    // ------------------------------------------

    const mouse = {
      // Current smoothed mouse position
      x: 0,
      y: 0,

      // Target mouse position
      targetX: 0,
      targetY: 0,
    };

    const onMouseMove = (e) => {
      // Convert mouse position to -1 ... 1
      mouse.targetX =
        (e.clientX / window.innerWidth - 0.5) * 2;

      mouse.targetY =
        (e.clientY / window.innerHeight - 0.5) * 2;
    };

    window.addEventListener("mousemove", onMouseMove, {
      passive: true,
    });

    // ------------------------------------------
    // CHESS PIECES
    // ------------------------------------------

    const pieceCount =
      window.innerWidth < 768 ? 20 : 35;

    const pieces = Array.from({
      length: pieceCount,
    }).map(() => ({
      x: Math.random() * w,
      y: Math.random() * h,

      // Depth
      z: Math.random() * 900,

      size:
        (18 + Math.random() * 46) * dpr,

      glyph:
        GLYPHS[
          (Math.random() * GLYPHS.length) | 0
        ],

      // Random floating movement
      vx:
        (Math.random() - 0.5) *
        0.4 *
        dpr,

      vy:
        (Math.random() - 0.5) *
        0.4 *
        dpr,

      rot: Math.random() * Math.PI,

      vr:
        (Math.random() - 0.5) *
        0.003,

      // Increased opacity
      alpha:
        0.09 +
        Math.random() * 0.3,

      amber:
        Math.random() > 0.72,
    }));

    // ------------------------------------------
    // DUST
    // ------------------------------------------

    const dustCount =
      window.innerWidth < 768
        ? 2000
        : 3000;

    const dust = Array.from({
      length: dustCount,
    }).map(() => ({
      x: Math.random() * w,
      y: Math.random() * h,

      // Depth
      z: Math.random() * 1000,

      r:
        Math.random() *
          1.4 *
          dpr +
        0.5,

      vy:
        (0.1 +
          Math.random() * 0.4) *
        dpr,

      a:
        Math.random() * 0.5 +
        0.3,

      cyan:
        Math.random() > 0.6,
    }));

    // ------------------------------------------
    // SCROLL
    // ------------------------------------------

    let scrollY = window.scrollY;

    const onScroll = () => {
      scrollY = window.scrollY;
    };

    window.addEventListener(
      "scroll",
      onScroll,
      { passive: true }
    );

    window.addEventListener(
      "resize",
      resize
    );

    // ------------------------------------------
    // 3D PROJECTION
    // ------------------------------------------

    const project3D = (x, y, z) => {
      // Maximum rotation of about 0.12 radians
      // which is roughly 7 degrees.
      const rotateY =
        mouse.x * 0.22;

      const rotateX =
        -mouse.y * 0.22;

      const cx = w / 2;
      const cy = h / 2;

      // Move origin to center
      let px = x - cx;
      let py = y - cy;

      // ----------------------------------------
      // ROTATE AROUND Y AXIS
      // ----------------------------------------

      const cosY =
        Math.cos(rotateY);

      const sinY =
        Math.sin(rotateY);

      const rotatedX =
        px * cosY -
        z * sinY;

      const rotatedZ =
        px * sinY +
        z * cosY;

      // ----------------------------------------
      // ROTATE AROUND X AXIS
      // ----------------------------------------

      const cosX =
        Math.cos(rotateX);

      const sinX =
        Math.sin(rotateX);

      const rotatedY =
        py * cosX -
        rotatedZ * sinX;

      const finalZ =
        py * sinX +
        rotatedZ * cosX;

      // ----------------------------------------
      // PERSPECTIVE
      // ----------------------------------------

      const perspective = 1400;

      const scale =
        perspective /
        (perspective + finalZ);

      return {
        x:
          cx +
          rotatedX * scale,

        y:
          cy +
          rotatedY * scale,

        scale,
      };
    };

    // ------------------------------------------
    // DRAW
    // ------------------------------------------

    const draw = () => {
      ctx.clearRect(
        0,
        0,
        w,
        h
      );

      // ----------------------------------------
      // SMOOTH MOUSE MOVEMENT
      // ----------------------------------------

      if (!reduce) {
        mouse.x += (mouse.targetX - mouse.x) * 0.08;
mouse.y += (mouse.targetY - mouse.y) * 0.08;
      }

      // ----------------------------------------
      // SCROLL PARALLAX
      // ----------------------------------------

      const parallax =
        (scrollY *
          dpr *
          0.12) %
        (h + 200);

      // ========================================
      // DUST
      // ========================================

      dust.forEach((d) => {
        if (!reduce) {
          d.y += d.vy;
        }

        if (d.y > h) {
          d.y = 0;
        }

        // --------------------------------------
        // PARALLAX POSITION
        // --------------------------------------

        const drawY =
          (d.y -
            parallax * 0.4 +
            h) %
          h;

        // --------------------------------------
        // 3D PROJECTION
        // --------------------------------------

        const projected =
          project3D(
            d.x,
            drawY,
            d.z
          );

        // --------------------------------------
        // DRAW DOT
        // --------------------------------------

        ctx.beginPath();

        ctx.arc(
          projected.x,
          projected.y,
          Math.max(
            0.3,
            d.r *
              projected.scale
          ),
          0,
          Math.PI * 2
        );

        ctx.fillStyle =
          d.cyan
            ? `rgba(47, 252, 254, ${
                d.a * 0.5
              })`
            : `rgba(255,255,255,${
                d.a * 0.4
              })`;

        ctx.fill();
      });

      // ========================================
      // CHESS PIECES
      // ========================================

      pieces.forEach((p) => {
        if (!reduce) {
          // Normal floating movement
          p.y += p.vy;
          p.x += p.vx;

          // Rotation
          p.rot += p.vr;
        }

        // --------------------------------------
        // WRAP VERTICALLY
        // --------------------------------------

        if (
          p.y - p.size >
          h
        ) {
          p.y = -p.size;
        }

        if (
          p.y + p.size <
          0
        ) {
          p.y =
            h + p.size;
        }

        // --------------------------------------
        // WRAP HORIZONTALLY
        // --------------------------------------

        if (
          p.x < -p.size
        ) {
          p.x =
            w + p.size;
        }

        if (
          p.x >
          w + p.size
        ) {
          p.x =
            -p.size;
        }

        // --------------------------------------
        // PARALLAX
        // --------------------------------------

        const drawY =
          (((p.y -
            parallax * 0.6) %
            (h +
              p.size * 2)) +
            h +
            p.size * 2) %
          (h +
            p.size * 2);

        // --------------------------------------
        // 3D PROJECTION
        // --------------------------------------

        const projected =
          project3D(
            p.x,
            drawY,
            p.z
          );

        // --------------------------------------
        // DRAW PIECE
        // --------------------------------------

        ctx.save();

        ctx.translate(
          projected.x,
          projected.y
        );

        // Perspective scaling
        ctx.scale(
          projected.scale,
          projected.scale
        );

        ctx.rotate(
          p.rot
        );

        ctx.font = `${p.size}px serif`;

        ctx.textAlign =
          "center";

        ctx.textBaseline =
          "middle";

        ctx.fillStyle =
          p.amber
            ? `rgba(47, 252, 254, ${
                p.alpha * 1.4
              })`
            : `rgba(255,255,255,${
                p.alpha
              })`;

        ctx.fillText(
          p.glyph,
          0,
          0
        );

        ctx.restore();
      });

      // ----------------------------------------
      // NEXT FRAME
      // ----------------------------------------

      rafRef.current =
        requestAnimationFrame(
          draw
        );
    };

    draw();

    // ------------------------------------------
    // CLEANUP
    // ------------------------------------------

    return () => {
      cancelAnimationFrame(
        rafRef.current
      );

      window.removeEventListener(
        "mousemove",
        onMouseMove
      );

      window.removeEventListener(
        "scroll",
        onScroll
      );

      window.removeEventListener(
        "resize",
        resize
      );
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 -z-10 pointer-events-none"
    />
  );
}

*/