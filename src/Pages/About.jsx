import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Reveal, MaskedLines } from "@/components/Motion";
import { MANIFESTO, EVENT_INFO, STATS } from "@/lib/data";

export default function About() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [80, -80]);
  const rotate = useTransform(scrollYProgress, [0, 1], [-20, 20]);

  return (
    <div data-testid="about-page" className="pt-32 md:pt-40 pb-24">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <p className="font-mono text-xs uppercase tracking-[0.3em] text-amber-glow mb-4">Since the first move</p>
        <MaskedLines
          lines={["Strategy is", <span key="2" className="text-amber-glow text-glow-amber">everything.</span>]}
          className="font-display font-black text-5xl md:text-8xl tracking-tighter leading-[0.9]"
        />
      </div>

      {/* Parallax editorial split */}
      <div ref={ref} className="mx-auto max-w-7xl px-5 md:px-8 mt-20 grid md:grid-cols-2 gap-12 items-center">
        <div className="relative flex items-center justify-center h-[380px] border border-white/10 bg-ink-surface overflow-hidden grid-bg">
          <motion.span style={{ y, rotate }} className="text-[16rem] text-amber-glow/80 leading-none drop-shadow-[0_0_60px_rgba(255,184,0,0.4)]">
            {"\u265E"}
          </motion.span>
        </div>
        <div>
          <Reveal>
            <h2 className="font-display font-bold text-3xl md:text-4xl">What is Infotrek?</h2>
            <p className="mt-5 font-mono text-sm md:text-base text-zinc-400 leading-relaxed">
              {EVENT_INFO.name} is the annual inter-department technical meet of the {EVENT_INFO.host} at{" "}
              {EVENT_INFO.college}. It brings together students, hackers and industry grandmasters for three days of
              seminars, guest lectures and high-stakes competitions.
            </p>
            <p className="mt-4 font-mono text-sm md:text-base text-zinc-400 leading-relaxed">
              This year we frame it all through the lens of chess — the ultimate game of computation, foresight and
              nerve. Every event is a gambit. Every participant, a piece with the power to change the game.
            </p>
          </Reveal>
        </div>
      </div>

      {/* Manifesto chapters */}
      <div className="mx-auto max-w-7xl px-5 md:px-8 mt-28">
        <Reveal className="mb-12">
          <p className="font-mono text-xs uppercase tracking-[0.3em] text-amber-glow mb-3">The Manifesto</p>
          <h2 className="font-display font-black text-4xl md:text-6xl tracking-tighter">Three rules of play</h2>
        </Reveal>
        <div className="space-y-px">
          {MANIFESTO.map((m, i) => (
            <Reveal key={m.no} delay={i * 0.08}>
              <div className="group grid md:grid-cols-[120px_1fr] gap-6 border-t border-white/10 py-10 hover:bg-ink-surface transition-colors duration-300">
                <div className="font-display font-black text-6xl text-amber-glow/40 group-hover:text-amber-glow transition-colors">{m.no}</div>
                <div>
                  <h3 className="font-display font-bold text-2xl md:text-3xl">{m.title}</h3>
                  <p className="mt-3 font-mono text-sm text-zinc-400 max-w-2xl leading-relaxed">{m.body}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>

      {/* Stats strip */}
      <div className="mx-auto max-w-7xl px-5 md:px-8 mt-24 grid grid-cols-2 md:grid-cols-4 gap-6">
        {STATS.map((s, i) => (
          <Reveal key={s.label} delay={i * 0.06}>
            <div className="text-center border border-white/10 bg-ink-surface p-8">
              <div className="font-display font-black text-4xl md:text-5xl text-amber-glow">{s.value}</div>
              <div className="mt-2 font-mono text-xs uppercase tracking-[0.2em] text-zinc-400">{s.label}</div>
            </div>
          </Reveal>
        ))}
      </div>
    </div>
  );
}