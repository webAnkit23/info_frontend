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

    const mouse = {
      x: width / 2,
      y: height / 2,
      prevX: width / 2,
      prevY: height / 2,
      vx: 0,
      vy: 0,
      active: false,
    };

    const PARTICLE_COUNT = window.innerWidth < 768 ? 55 : 110;

    // --------------------------------
    // Canvas
    // --------------------------------

    const resize = () => {
      width = window.innerWidth;
      height = window.innerHeight;

      const dpr = Math.min(window.devicePixelRatio || 1, 2);

      canvas.width = width * dpr;
      canvas.height = height * dpr;

      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    resize();

    window.addEventListener("resize", resize);

    // --------------------------------
    // Particle
    // --------------------------------

    const createParticle = () => {
      return {
        x: Math.random() * width,
        y: Math.random() * height,

        vx: (Math.random() - 0.5) * 0.25,
        vy: (Math.random() - 0.5) * 0.25,

        size: Math.random() * 1.5 + 0.4,

        alpha: Math.random() * 0.5 + 0.15,

        // Cyan / blue / purple
        hue: Math.random() > 0.8 ? 270 : 190,

        life: 1,
      };
    };

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      particles.push(createParticle());
    }

    // --------------------------------
    // Mouse movement
    // --------------------------------

    const handleMouseMove = (e) => {
      mouse.prevX = mouse.x;
      mouse.prevY = mouse.y;

      mouse.x = e.clientX;
      mouse.y = e.clientY;

      mouse.vx = mouse.x - mouse.prevX;
      mouse.vy = mouse.y - mouse.prevY;

      mouse.active = true;
    };

    window.addEventListener("mousemove", handleMouseMove, {
      passive: true,
    });

    // --------------------------------
    // CLICK
    // --------------------------------

    const handleClick = (e) => {
      const count = 45;

      for (let i = 0; i < count; i++) {
        const angle = Math.random() * Math.PI * 2;

        const speed = Math.random() * 4 + 1.5;

        sparks.push({
          x: e.clientX,
          y: e.clientY,

          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,

          size: Math.random() * 2 + 0.5,

          life: 1,

          decay: Math.random() * 0.025 + 0.015,

          hue: Math.random() > 0.75 ? 270 : 190,
        });
      }

      // Push nearby particles outward
      particles.forEach((particle) => {
        const dx = particle.x - e.clientX;
        const dy = particle.y - e.clientY;

        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < 180 && distance > 0) {
          const force = (1 - distance / 180) * 2;

          particle.vx += (dx / distance) * force;
          particle.vy += (dy / distance) * force;
        }
      });
    };

    window.addEventListener("click", handleClick);

    // --------------------------------
    // Draw particle
    // --------------------------------

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

    // --------------------------------
    // Update particles
    // --------------------------------

    const updateParticles = () => {
      particles.forEach((particle) => {
        // Natural movement
        particle.x += particle.vx;
        particle.y += particle.vy;

        // --------------------------------
        // Cursor magnetic flow
        // --------------------------------

        if (mouse.active) {
          const dx = mouse.x - particle.x;
          const dy = mouse.y - particle.y;

          const distance = Math.sqrt(dx * dx + dy * dy);

          const influence = 260;

          if (distance < influence && distance > 1) {
            const strength =
              Math.pow(1 - distance / influence, 2) * 0.12;

            particle.vx +=
              (dx / distance) * strength;

            particle.vy +=
              (dy / distance) * strength;

            // Cursor movement creates a directional flow
            particle.vx += mouse.vx * 0.002;
            particle.vy += mouse.vy * 0.002;
          }
        }

        // Friction
        particle.vx *= 0.985;
        particle.vy *= 0.985;

        // --------------------------------
        // Screen wrapping
        // --------------------------------

        if (particle.x < -10) particle.x = width + 10;
        if (particle.x > width + 10) particle.x = -10;

        if (particle.y < -10) particle.y = height + 10;
        if (particle.y > height + 10) particle.y = -10;

        drawParticle(particle);
      });
    };

    // --------------------------------
    // Particle connections
    // --------------------------------

    const drawConnections = () => {
      const maxDistance = 100;

      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const p1 = particles[i];
          const p2 = particles[j];

          const dx = p1.x - p2.x;
          const dy = p1.y - p2.y;

          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < maxDistance) {
            const alpha =
              (1 - distance / maxDistance) * 0.12;

            ctx.beginPath();

            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);

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

    // --------------------------------
    // Cursor trail
    // --------------------------------

    const drawCursorTrail = () => {
      if (!mouse.active) return;

      const speed = Math.sqrt(
        mouse.vx * mouse.vx +
        mouse.vy * mouse.vy
      );

      if (speed < 1) return;

      const trailCount = Math.min(
        Math.floor(speed * 1.5),
        8
      );

      for (let i = 0; i < trailCount; i++) {
        const offset = Math.random() * 20;

        const x =
          mouse.x -
          mouse.vx * offset * 0.1;

        const y =
          mouse.y -
          mouse.vy * offset * 0.1;

        ctx.beginPath();

        ctx.arc(
          x,
          y,
          Math.random() * 1.8 + 0.5,
          0,
          Math.PI * 2
        );

        ctx.fillStyle = `rgba(
          34,
          211,
          238,
          ${Math.random() * 0.5 + 0.15}
        )`;

        ctx.shadowBlur = 12;
        ctx.shadowColor = "rgba(34,211,238,0.8)";

        ctx.fill();

        ctx.shadowBlur = 0;
      }
    };

    // --------------------------------
    // Click sparks
    // --------------------------------

    const updateSparks = () => {
      for (let i = sparks.length - 1; i >= 0; i--) {
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

    // --------------------------------
    // Animation
    // --------------------------------

    const animate = () => {
      ctx.clearRect(0, 0, width, height);

      drawConnections();

      updateParticles();

      drawCursorTrail();

      updateSparks();

      // Slowly reduce cursor velocity
      mouse.vx *= 0.85;
      mouse.vy *= 0.85;

      animationFrame =
        requestAnimationFrame(animate);
    };

    animate();

    // --------------------------------
    // Cleanup
    // --------------------------------

    return () => {
      window.removeEventListener("resize", resize);
      window.removeEventListener(
        "mousemove",
        handleMouseMove
      );
      window.removeEventListener(
        "click",
        handleClick
      );

      cancelAnimationFrame(animationFrame);
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