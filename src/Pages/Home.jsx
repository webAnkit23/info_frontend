import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import KineticHero from "@/components/KineticHero";
import { Marquee, Reveal } from "@/components/Motion";
import { Button } from "@/components/ui/button";
import { EVENTS, STATS, MANIFESTO, EVENT_INFO } from "@/lib/data";

export default function Home() {
  const preview = EVENTS.slice(0, 4);
  return (
    <div data-testid="home-page">
      <KineticHero />

      <Marquee items={["INFOTREK 26", "NIT TRICHY", "DEPT OF COMPUTER APPLICATIONS", "CHECKMATE THE ORDINARY"]} />

      {/* Stats */}
      <section className="mx-auto max-w-7xl px-5 md:px-8 py-24 grid grid-cols-2 md:grid-cols-4 gap-6">
        {STATS.map((s, i) => (
          <Reveal key={s.label} delay={i * 0.08}>
            <div className="border border-white/10 bg-ink-surface p-8 card-hover">
              <div className="font-display font-black text-4xl md:text-5xl text-amber-glow">{s.value}</div>
              <div className="mt-2 font-mono text-xs uppercase tracking-[0.2em] text-zinc-400">{s.label}</div>
            </div>
          </Reveal>
        ))}
      </section>

      {/* Events bento preview */}
      <section className="mx-auto max-w-7xl px-5 md:px-8 py-12">
        <Reveal className="mb-12 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.3em] text-amber-glow mb-3">The Opening</p>
            <h2 className="font-display font-black text-4xl md:text-6xl tracking-tighter">Featured Gambits</h2>
          </div>
          <Button asChild variant="outline" className="rounded-full border-white/20 bg-white/5 font-mono text-xs uppercase tracking-wider hover:border-amber-glow/60">
            <Link to="/events" data-testid="home-all-events">All Events {"\u2192"}</Link>
          </Button>
        </Reveal>

        <div className="grid md:grid-cols-2 gap-5">
          {preview.map((e, i) => (
            <Reveal key={e.id} delay={i * 0.08}>
              <Link to="/events" className="group block h-full border border-white/10 bg-ink-surface p-8 card-hover">
                <div className="flex items-start justify-between">
                  <span className="text-5xl text-amber-glow group-hover:scale-110 group-hover:rotate-6 transition-transform duration-500">{e.icon}</span>
                  <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-cyan-glow">{e.type}</span>
                </div>
                <h3 className="mt-6 font-display font-bold text-2xl md:text-3xl">{e.name}</h3>
                <p className="mt-3 font-mono text-sm text-zinc-400 leading-relaxed">{e.blurb}</p>
                <div className="mt-6 flex items-center gap-4 font-mono text-xs text-zinc-500">
                  <span>{e.duration}</span>
                  <span className="text-amber-glow">{e.prize}</span>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Manifesto teaser */}
      <section className="mx-auto max-w-7xl px-5 md:px-8 py-24">
        <div className="grid md:grid-cols-3 gap-6">
          {MANIFESTO.map((m, i) => (
            <Reveal key={m.no} delay={i * 0.1}>
              <div className="h-full border-l-2 border-amber-glow/40 pl-6 py-2">
                <div className="font-display font-black text-6xl text-white/10">{m.no}</div>
                <h3 className="mt-4 font-display font-bold text-xl">{m.title}</h3>
                <p className="mt-3 font-mono text-sm text-zinc-400 leading-relaxed">{m.body}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-7xl px-5 md:px-8 pb-24">
        <Reveal>
          <div className="relative overflow-hidden border border-white/10 bg-ink-surface p-12 md:p-20 text-center">
            <motion.span
              initial={{ rotate: 0 }}
              whileInView={{ rotate: 360 }}
              transition={{ duration: 2, ease: "easeInOut" }}
              viewport={{ once: true }}
              className="inline-block text-6xl text-amber-glow mb-6"
            >
              {"\u265E"}
            </motion.span>
            <h2 className="font-display font-black text-4xl md:text-6xl tracking-tighter">Your move.</h2>
            <p className="mt-4 font-mono text-sm text-zinc-400 max-w-lg mx-auto">
              Registration for {EVENT_INFO.name} is open. Claim your seat at the board before the timer runs out.
            </p>
            <Button asChild className="mt-8 rounded-full bg-amber-glow text-ink-base font-mono text-xs font-bold uppercase tracking-wider px-10 py-6 hover:bg-amber-hover hover:scale-105 transition-transform">
              <Link to="/signup" data-testid="home-cta-signup">Register Now</Link>
            </Button>
          </div>
        </Reveal>
      </section>
    </div>
  );
}