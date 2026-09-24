import { useEffect, useRef } from "react";

const MouseEffect = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");

    let width = window.innerWidth;
    let height = window.innerHeight;
    let animationFrame;

    const particles = [];
    const sparks = [];
    const trail = [];

    const mouse = {
      x: width / 2,
      y: height / 2,

      targetX: width / 2,
      targetY: height / 2,

      prevX: width / 2,
      prevY: height / 2,

      vx: 0,
      vy: 0,

      speed: 0,
      active: false,
    };

    const PARTICLE_COUNT =
      window.innerWidth < 768 ? 55 : 110;

    // ==========================================
    // CANVAS
    // ==========================================

    const resize = () => {
      width = window.innerWidth;
      height = window.innerHeight;

      const dpr = Math.min(
        window.devicePixelRatio || 1,
        2
      );

      canvas.width = width * dpr;
      canvas.height = height * dpr;

      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    resize();

    window.addEventListener("resize", resize);

    // ==========================================
    // PARTICLES
    // ==========================================

    const createParticle = () => {
      return {
        x: Math.random() * width,
        y: Math.random() * height,

        vx: (Math.random() - 0.5) * 0.2,
        vy: (Math.random() - 0.5) * 0.2,

        size: Math.random() * 1.7 + 0.5,

        alpha: Math.random() * 0.5 + 0.15,

        hue: Math.random() > 0.82 ? 270 : 190,

        orbit: Math.random() > 0.7,
      };
    };

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      particles.push(createParticle());
    }

    // ==========================================
    // MOUSE
    // ==========================================

    const handleMouseMove = (e) => {
      mouse.prevX = mouse.targetX;
      mouse.prevY = mouse.targetY;

      mouse.targetX = e.clientX;
      mouse.targetY = e.clientY;

      mouse.active = true;

      // Store trail positions
      trail.push({
        x: e.clientX,
        y: e.clientY,
        life: 1,
      });

      if (trail.length > 25) {
        trail.shift();
      }
    };

    window.addEventListener(
      "mousemove",
      handleMouseMove,
      {
        passive: true,
      }
    );

    // ==========================================
    // CLICK
    // ==========================================

    const handleClick = (e) => {
      const count = 45;

      for (let i = 0; i < count; i++) {
        const angle =
          Math.random() * Math.PI * 2;

        const speed =
          Math.random() * 4 + 1.5;

        sparks.push({
          x: e.clientX,
          y: e.clientY,

          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,

          size: Math.random() * 2 + 0.5,

          life: 1,

          decay:
            Math.random() * 0.025 + 0.015,

          hue:
            Math.random() > 0.75
              ? 270
              : 190,
        });
      }

      // Push particles away from click
      particles.forEach((particle) => {
        const dx = particle.x - e.clientX;
        const dy = particle.y - e.clientY;

        const distance = Math.sqrt(
          dx * dx + dy * dy
        );

        if (
          distance < 180 &&
          distance > 0
        ) {
          const force =
            (1 - distance / 180) * 2;

          particle.vx +=
            (dx / distance) * force;

          particle.vy +=
            (dy / distance) * force;
        }
      });
    };

    window.addEventListener(
      "click",
      handleClick
    );

    // ==========================================
    // PARTICLE DRAW
    // ==========================================

    const drawParticle = (particle) => {
      const color = `hsl(${particle.hue}, 100%, 65%)`;

      ctx.beginPath();

      ctx.arc(
        particle.x,
        particle.y,
        particle.size,
        0,
        Math.PI * 2
      );

      ctx.fillStyle = `hsla(
        ${particle.hue},
        100%,
        65%,
        ${particle.alpha}
      )`;

      ctx.shadowBlur = 10;
      ctx.shadowColor = color;

      ctx.fill();

      ctx.shadowBlur = 0;
    };

    // ==========================================
    // UPDATE PARTICLES
    // ==========================================

    const updateParticles = () => {
      particles.forEach((particle) => {
        particle.x += particle.vx;
        particle.y += particle.vy;

        // --------------------------------------
        // CURSOR FORCE FIELD
        // --------------------------------------

        if (mouse.active) {
          const dx =
            mouse.x - particle.x;

          const dy =
            mouse.y - particle.y;

          const distance = Math.sqrt(
            dx * dx + dy * dy
          );

          const influence = 280;

          if (
            distance < influence &&
            distance > 1
          ) {
            const normalizedX =
              dx / distance;

            const normalizedY =
              dy / distance;

            const force =
              Math.pow(
                1 - distance / influence,
                2
              );

            // ----------------------------------
            // PUSH PARTICLES AWAY
            // ----------------------------------

            const pushStrength =
              force * 0.65;

            particle.vx -=
              normalizedX *
              pushStrength;

            particle.vy -=
              normalizedY *
              pushStrength;

            // ----------------------------------
            // SIDEWAYS / CURL FORCE
            // ----------------------------------

            const swirlStrength =
              force * 0.75;

            particle.vx +=
              -normalizedY *
              swirlStrength;

            particle.vy +=
              normalizedX *
              swirlStrength;

            // ----------------------------------
            // MOUSE VELOCITY
            // ----------------------------------

            particle.vx +=
              mouse.vx * 0.003;

            particle.vy +=
              mouse.vy * 0.003;
          }
        }

        // --------------------------------------
        // FRICTION
        // --------------------------------------

        particle.vx *= 0.96;
        particle.vy *= 0.96;

        // --------------------------------------
        // LIMIT SPEED
        // --------------------------------------

        const maxSpeed = 2.5;

        const speed = Math.sqrt(
          particle.vx * particle.vx +
          particle.vy * particle.vy
        );

        if (speed > maxSpeed) {
          particle.vx =
            (particle.vx / speed) *
            maxSpeed;

          particle.vy =
            (particle.vy / speed) *
            maxSpeed;
        }

        // --------------------------------------
        // SCREEN WRAP
        // --------------------------------------

        if (particle.x < -10)
          particle.x = width + 10;

        if (particle.x > width + 10)
          particle.x = -10;

        if (particle.y < -10)
          particle.y = height + 10;

        if (particle.y > height + 10)
          particle.y = -10;

        drawParticle(particle);
      });
    };

    // ==========================================
    // PARTICLE CONNECTIONS
    // ==========================================

    const drawConnections = () => {
      const maxDistance = 100;

      for (
        let i = 0;
        i < particles.length;
        i++
      ) {
        for (
          let j = i + 1;
          j < particles.length;
          j++
        ) {
          const p1 = particles[i];
          const p2 = particles[j];

          const dx = p1.x - p2.x;
          const dy = p1.y - p2.y;

          const distance = Math.sqrt(
            dx * dx + dy * dy
          );

          if (distance < maxDistance) {
            const alpha =
              (1 - distance / maxDistance) *
              0.1;

            ctx.beginPath();

            ctx.moveTo(
              p1.x,
              p1.y
            );

            ctx.lineTo(
              p2.x,
              p2.y
            );

            ctx.strokeStyle = `rgba(
              34,
              211,
              238,
              ${alpha}
            )`;

            ctx.lineWidth = 0.5;

            ctx.stroke();
          }
        }
      }
    };

    // ==========================================
    // CURSOR TRAIL
    // ==========================================

    const drawCursorTrail = () => {
      if (!mouse.active) return;

      for (
        let i = trail.length - 1;
        i >= 0;
        i--
      ) {
        const point = trail[i];

        point.life *= 0.88;

        if (point.life < 0.03) {
          trail.splice(i, 1);
          continue;
        }

        const radius =
          1.5 + point.life * 3;

        ctx.beginPath();

        ctx.arc(
          point.x,
          point.y,
          radius,
          0,
          Math.PI * 2
        );

        ctx.fillStyle = `rgba(
          34,
          211,
          238,
          ${point.life * 0.35}
        )`;

        ctx.shadowBlur = 15;

        ctx.shadowColor =
          "rgba(34,211,238,0.8)";

        ctx.fill();

        ctx.shadowBlur = 0;
      }
    };

    // ==========================================
    // CURSOR ENERGY RING
    // ==========================================

    const drawCursor = () => {
      if (!mouse.active) return;

      const speed = mouse.speed;

      // ----------------------------------------
      // Outer glow
      // ----------------------------------------

      const glowRadius =
        22 + Math.min(speed * 2, 15);

      const gradient =
        ctx.createRadialGradient(
          mouse.x,
          mouse.y,
          0,
          mouse.x,
          mouse.y,
          glowRadius
        );

      gradient.addColorStop(
        0,
        "rgba(34,211,238,0.20)"
      );

      gradient.addColorStop(
        0.45,
        "rgba(34,211,238,0.08)"
      );

      gradient.addColorStop(
        1,
        "rgba(34,211,238,0)"
      );

      ctx.beginPath();

      ctx.arc(
        mouse.x,
        mouse.y,
        glowRadius,
        0,
        Math.PI * 2
      );

      ctx.fillStyle = gradient;

      ctx.fill();

      // ----------------------------------------
      // Main energy ring
      // ----------------------------------------

      ctx.beginPath();

      ctx.arc(
        mouse.x,
        mouse.y,
        12 + Math.min(speed, 5),
        0,
        Math.PI * 2
      );

      ctx.strokeStyle =
        "rgba(34,211,238,0.8)";

      ctx.lineWidth = 1;

      ctx.shadowBlur = 15;

      ctx.shadowColor =
        "rgba(34,211,238,0.9)";

      ctx.stroke();

      ctx.shadowBlur = 0;

      // ----------------------------------------
      // Inner ring
      // ----------------------------------------

      ctx.beginPath();

      ctx.arc(
        mouse.x,
        mouse.y,
        4,
        0,
        Math.PI * 2
      );

      ctx.fillStyle =
        "rgba(255,255,255,0.95)";

      ctx.shadowBlur = 15;

      ctx.shadowColor =
        "rgba(34,211,238,1)";

      ctx.fill();

      ctx.shadowBlur = 0;

      // ----------------------------------------
      // Crosshair
      // ----------------------------------------

      const crossSize = 18;

      ctx.beginPath();

      // Top
      ctx.moveTo(
        mouse.x,
        mouse.y - crossSize
      );

      ctx.lineTo(
        mouse.x,
        mouse.y - 9
      );

      // Bottom
      ctx.moveTo(
        mouse.x,
        mouse.y + 9
      );

      ctx.lineTo(
        mouse.x,
        mouse.y + crossSize
      );

      // Left
      ctx.moveTo(
        mouse.x - crossSize,
        mouse.y
      );

      ctx.lineTo(
        mouse.x - 9,
        mouse.y
      );

      // Right
      ctx.moveTo(
        mouse.x + 9,
        mouse.y
      );

      ctx.lineTo(
        mouse.x + crossSize,
        mouse.y
      );

      ctx.strokeStyle =
        "rgba(34,211,238,0.55)";

      ctx.lineWidth = 1;

      ctx.stroke();
    };

    // ==========================================
    // CLICK SPARKS
    // ==========================================

    const updateSparks = () => {
      for (
        let i = sparks.length - 1;
        i >= 0;
        i--
      ) {
        const spark = sparks[i];

        spark.x += spark.vx;
        spark.y += spark.vy;

        spark.vx *= 0.94;
        spark.vy *= 0.94;

        spark.life -= spark.decay;

        if (spark.life <= 0) {
          sparks.splice(i, 1);
          continue;
        }

        ctx.beginPath();

        ctx.arc(
          spark.x,
          spark.y,
          spark.size,
          0,
          Math.PI * 2
        );

        ctx.fillStyle = `hsla(
          ${spark.hue},
          100%,
          65%,
          ${spark.life}
        )`;

        ctx.shadowBlur = 15;

        ctx.shadowColor = `hsla(
          ${spark.hue},
          100%,
          65%,
          ${spark.life}
        )`;

        ctx.fill();

        ctx.shadowBlur = 0;
      }
    };

    // ==========================================
    // ANIMATION
    // ==========================================

    const animate = () => {
      ctx.clearRect(
        0,
        0,
        width,
        height
      );

      // Smooth cursor movement
      mouse.x +=
        (mouse.targetX - mouse.x) *
        0.18;

      mouse.y +=
        (mouse.targetY - mouse.y) *
        0.18;

      // Cursor velocity
      mouse.vx =
        mouse.x - mouse.prevX;

      mouse.vy =
        mouse.y - mouse.prevY;

      mouse.speed = Math.sqrt(
        mouse.vx * mouse.vx +
        mouse.vy * mouse.vy
      );

      mouse.prevX = mouse.x;
      mouse.prevY = mouse.y;

      drawConnections();

      updateParticles();

      drawCursorTrail();

      updateSparks();

      drawCursor();

      // Slowly reduce velocity
      mouse.vx *= 0.85;
      mouse.vy *= 0.85;

      animationFrame =
        requestAnimationFrame(
          animate
        );
    };

    animate();

    // ==========================================
    // CLEANUP
    // ==========================================

    return () => {
      window.removeEventListener(
        "resize",
        resize
      );

      window.removeEventListener(
        "mousemove",
        handleMouseMove
      );

      window.removeEventListener(
        "click",
        handleClick
      );

      cancelAnimationFrame(
        animationFrame
      );
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-[40]"
    />
  );
};

export default MouseEffect;