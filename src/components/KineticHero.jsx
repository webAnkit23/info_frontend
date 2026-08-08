import { useRef } from "react";
import { Link } from "react-router-dom";
import { motion, useScroll, useTransform, useMotionTemplate } from "framer-motion";
import { ArrowDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MaskedLines } from "@/components/Motion";
import { EVENT_INFO } from "@/lib/data";

// Chess shards that fly in to assemble the King, then scatter on scroll-past.
const SHARDS = [
  { glyph: "\u265F", from: { x: -320, y: -180 }, rot: -120 },
  { glyph: "\u265E", from: { x: 340, y: -160 }, rot: 140 },
  { glyph: "\u265C", from: { x: -360, y: 120 }, rot: 90 },
  { glyph: "\u265D", from: { x: 360, y: 160 }, rot: -100 },
  { glyph: "\u265B", from: { x: -220, y: 260 }, rot: 60 },
  { glyph: "\u265F", from: { x: 240, y: 280 }, rot: -70 },
  { glyph: "\u265E", from: { x: 0, y: -320 }, rot: 180 },
  { glyph: "\u265C", from: { x: 0, y: 320 }, rot: -180 },
];

function Shard({ glyph, from, rot, progress, radius }) {
  // assemble (0 -> 0.5) from far to a tight ring, then scatter (0.5 -> 1)
  const x = useTransform(progress, [0, 0.5, 1], [from.x, radius.x, from.x * 1.4]);
  const y = useTransform(progress, [0, 0.5, 1], [from.y, radius.y, from.y * 1.4]);
  const rotate = useTransform(progress, [0, 0.5, 1], [rot, 0, -rot]);
  const opacity = useTransform(progress, [0, 0.15, 0.5, 0.8, 1], [0, 0.5, 0.85, 0.4, 0]);
  return (
    <motion.span
      style={{ x, y, rotate, opacity }}
      className="absolute text-4xl md:text-6xl text-amber-glow/70 select-none"
    >
      {glyph}
    </motion.span>
  );
}

export default function KineticHero() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  const kingScale = useTransform(scrollYProgress, [0, 0.5, 1], [0.35, 1, 2.6]);
  const kingOpacity = useTransform(scrollYProgress, [0, 0.28, 0.55, 0.85, 1], [0, 1, 1, 1, 0]);
  const kingRotate = useTransform(scrollYProgress, [0, 0.5], [-80, 0]);
  const blurPx = useTransform(scrollYProgress, [0, 0.4, 0.55, 1], [10, 0, 0, 24]);
  const kingFilter = useMotionTemplate`blur(${blurPx}px) drop-shadow(0 0 60px rgba(255,184,0,0.45))`;
  const ringGlow = useTransform(scrollYProgress, [0, 0.5, 1], [0.1, 0.6, 0.1]);

  return (
    <section ref={ref} className="relative h-[220vh]" data-testid="kinetic-hero">
      <div className="sticky top-0 h-screen flex flex-col items-center justify-center overflow-hidden">
        {/* radial glow */}
        <motion.div
          style={{ opacity: ringGlow }}
          className="absolute w-[600px] h-[600px] rounded-full bg-amber-glow/20 blur-[120px]"
        />

        {/* Assembling chess piece */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="relative flex items-center justify-center">
            {SHARDS.map((s, i) => (
              <Shard
                key={i}
                {...s}
                progress={scrollYProgress}
                radius={{ x: Math.cos((i / SHARDS.length) * Math.PI * 2) * 90, y: Math.sin((i / SHARDS.length) * Math.PI * 2) * 90 }}
              />
            ))}
            <motion.span
              style={{ scale: kingScale, opacity: kingOpacity, rotate: kingRotate, filter: kingFilter }}
              className="text-[9rem] md:text-[14rem] leading-none text-amber-glow select-none"
            >
              {"\u265A"}
            </motion.span>
          </div>
        </div>

        {/* Hero copy */}
        <div className="relative z-10 text-center px-6 max-w-4xl">
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            className="font-mono text-xs md:text-sm uppercase tracking-[0.35em] text-amber-glow mb-6"
            data-testid="hero-overline"
          >
            {EVENT_INFO.host} {"\u00B7"} {EVENT_INFO.college}
          </motion.p>

          <MaskedLines
            className="font-display font-black text-6xl md:text-8xl lg:text-9xl tracking-tighter leading-[0.85]"
            lines={["INFOTREK", <span key="26" className="text-amber-glow text-glow-amber">{"'26"}</span>]}
          />

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.1, duration: 0.8 }}
            className="mt-8 font-mono text-sm md:text-base text-zinc-300 max-w-xl mx-auto"
          >
            {EVENT_INFO.tagline}. {EVENT_INFO.dates}.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.35, duration: 0.8 }}
            className="mt-10 flex flex-wrap items-center justify-center gap-4"
          >
            <Button
              asChild
              data-testid="hero-register-button"
              className="rounded-full bg-amber-glow text-ink-base font-mono text-xs font-bold uppercase tracking-wider px-8 py-6 hover:bg-amber-hover hover:scale-105 transition-transform"
            >
              <Link to="/signup">Enter the Board</Link>
            </Button>
            <Button
              asChild
              variant="outline"
              data-testid="hero-events-button"
              className="rounded-full border-white/20 bg-white/5 font-mono text-xs uppercase tracking-wider px-8 py-6 hover:border-cyan-glow/60 hover:bg-white/5"
            >
              <Link to="/events">View Events</Link>
            </Button>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.6 }}
          className="absolute bottom-10 flex flex-col items-center gap-2 text-zinc-500"
        >
          <span className="font-mono text-[10px] uppercase tracking-[0.3em]">Scroll to assemble</span>
          <ArrowDown className="w-4 h-4 animate-bounce" />
        </motion.div>
      </div>
    </section>
  );
}