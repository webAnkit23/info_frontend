import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import KineticHero2 from "@/components/KineticHero2";
import { Marquee, Reveal } from "@/components/Motion";
import { Button } from "@/components/ui/button";
import { STATS, MANIFESTO, EVENT_INFO } from "@/lib/data";
import { useAuth } from "@/context/AuthContext";

export default function Home() {
  const { user, ready } = useAuth();

  const isLoggedIn = ready && user && user !== false;

  return (
    <div data-testid="home-page">

      {/* =========================================================
          HERO
      ========================================================= */}
      <KineticHero2 />

      {/* =========================================================
          MARQUEE
      ========================================================= */}
      <Marquee
        items={[
          "INFOTREK 26",
          "NIT TRICHY",
          "DEPT OF COMPUTER APPLICATIONS",
          "CHECKMATE THE ORDINARY",
        ]}
      />

      {/* =========================================================
          STATS
      ========================================================= */}
      <section className="mx-auto max-w-7xl px-5 md:px-8 py-24">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">

          {STATS.map((s, i) => (
            <Reveal key={s.label} delay={i * 0.08}>
              <div className="group border border-white/10 bg-ink-surface p-8 card-hover relative overflow-hidden">

                {/* subtle glow */}
                <div className="absolute -right-10 -top-10 w-24 h-24 rounded-full bg-cyan-glow/5 blur-2xl group-hover:bg-cyan-glow/10 transition-all duration-500" />

                <div className="relative">
                  <div className="font-display font-black text-4xl md:text-5xl text-amber-glow">
                    {s.value}
                  </div>

                  <div className="mt-2 font-mono text-xs uppercase tracking-[0.2em] text-zinc-400">
                    {s.label}
                  </div>
                </div>
              </div>
            </Reveal>
          ))}

        </div>
      </section>

      {/* =========================================================
          PATH TO THE CROWN
      ========================================================= */}
      <section className="mx-auto max-w-7xl px-5 md:px-8 py-24">

        <Reveal>
          <div className="mb-16">
            <p className="font-mono text-xs uppercase tracking-[0.3em] text-amber-glow mb-3">
              The Journey
            </p>

            <h2 className="font-display font-black text-4xl md:text-6xl tracking-tighter">
              Path to the Crown
            </h2>

            <p className="mt-5 max-w-2xl font-mono text-sm md:text-base text-zinc-400 leading-relaxed">
              Every move matters. Enter the board, face the challenges,
              and fight your way toward the final crown.
            </p>
          </div>
        </Reveal>

        {/* Journey */}
        <div className="relative">

          {/* Connecting line */}
          <div className="hidden md:block absolute top-[48px] left-[8%] right-[8%] h-px bg-gradient-to-r from-transparent via-cyan-glow/40 to-transparent" />

          <div className="grid md:grid-cols-5 gap-8 md:gap-4">

            {/* STEP 01 */}
            <Reveal delay={0.05}>
              <div className="group relative text-center">

                <div className="mx-auto relative z-10 w-24 h-24 rounded-full border border-cyan-glow/30 bg-ink-base flex items-center justify-center group-hover:border-cyan-glow transition-all duration-500">

                  <span className="font-display font-black text-2xl text-cyan-glow">
                    01
                  </span>

                </div>

                <h3 className="mt-7 font-display font-bold text-xl">
                  ENTER
                </h3>

                <p className="mt-3 font-mono text-xs text-zinc-500 leading-relaxed">
                  Step onto the board.
                  <br />
                  Choose your challenge.
                </p>

              </div>
            </Reveal>

            {/* STEP 02 */}
            <Reveal delay={0.12}>
              <div className="group relative text-center">

                <div className="mx-auto relative z-10 w-24 h-24 rounded-full border border-cyan-glow/30 bg-ink-base flex items-center justify-center group-hover:border-cyan-glow transition-all duration-500">

                  <span className="font-display font-black text-2xl text-cyan-glow">
                    02
                  </span>

                </div>

                <h3 className="mt-7 font-display font-bold text-xl">
                  CHALLENGE
                </h3>

                <p className="mt-3 font-mono text-xs text-zinc-500 leading-relaxed">
                  Test your skill.
                  <br />
                  Outsmart the competition.
                </p>

              </div>
            </Reveal>

            {/* STEP 03 */}
            <Reveal delay={0.19}>
              <div className="group relative text-center">

                <div className="mx-auto relative z-10 w-24 h-24 rounded-full border border-cyan-glow/30 bg-ink-base flex items-center justify-center group-hover:border-cyan-glow transition-all duration-500">

                  <span className="font-display font-black text-2xl text-cyan-glow">
                    03
                  </span>

                </div>

                <h3 className="mt-7 font-display font-bold text-xl">
                  CONQUER
                </h3>

                <p className="mt-3 font-mono text-xs text-zinc-500 leading-relaxed">
                  Push beyond limits.
                  <br />
                  Leave your mark.
                </p>

              </div>
            </Reveal>

            {/* STEP 04 */}
            <Reveal delay={0.26}>
              <div className="group relative text-center">

                <div className="mx-auto relative z-10 w-24 h-24 rounded-full border border-amber-glow/40 bg-ink-base flex items-center justify-center group-hover:border-amber-glow transition-all duration-500">

                  <span className="font-display font-black text-2xl text-amber-glow">
                    04
                  </span>

                </div>

                <h3 className="mt-7 font-display font-bold text-xl">
                  DESTINITE
                </h3>

                <p className="mt-3 font-mono text-xs text-zinc-500 leading-relaxed">
                  The final battle.
                  <br />
                  One champion remains.
                </p>

              </div>
            </Reveal>

            {/* STEP 05 */}
            <Reveal delay={0.33}>
              <div className="group relative text-center">

                <div className="mx-auto relative z-10 w-24 h-24 rounded-full border border-amber-glow/50 bg-amber-glow/5 flex items-center justify-center group-hover:bg-amber-glow/10 transition-all duration-500">

                  <span className="text-3xl text-amber-glow">
                    ♛
                  </span>

                </div>

                <h3 className="mt-7 font-display font-bold text-xl text-amber-glow">
                  CHAMPION
                </h3>

                <p className="mt-3 font-mono text-xs text-zinc-500 leading-relaxed">
                  The board falls silent.
                  <br />
                  The crown is yours.
                </p>

              </div>
            </Reveal>

          </div>
        </div>

      </section>

      {/* =========================================================
          ARENA CTA
      ========================================================= */}
      <section className="mx-auto max-w-7xl px-5 md:px-8 py-12">

        <Reveal>

          <div className="relative overflow-hidden border border-cyan-glow/10 bg-ink-surface p-10 md:p-16">

            {/* background effects */}
            <div className="absolute -right-32 -top-32 w-96 h-96 rounded-full bg-cyan-glow/5 blur-3xl" />

            <div className="absolute -left-32 -bottom-32 w-96 h-96 rounded-full bg-amber-glow/5 blur-3xl" />

            <div className="relative flex flex-col md:flex-row items-center justify-between gap-10">

              <div>

                <p className="font-mono text-xs uppercase tracking-[0.3em] text-cyan-glow mb-4">
                  The Board Awaits
                </p>

                <h2 className="font-display font-black text-4xl md:text-6xl tracking-tighter">
                  Ready to make
                  <br />
                  <span className="text-amber-glow">
                    your move?
                  </span>
                </h2>

                <p className="mt-5 max-w-xl font-mono text-sm text-zinc-400 leading-relaxed">
                  Enter the arena. Choose your battlefield.
                  Challenge yourself and fight your way to the crown.
                </p>

              </div>

              <div className="shrink-0">

                <Button
                  asChild
                  className="rounded-full bg-amber-glow text-ink-base font-mono text-xs font-bold uppercase tracking-wider px-10 py-6 hover:bg-amber-hover hover:scale-105 transition-all"
                >
                  <Link to="/events">
                    Enter the Arena →
                  </Link>
                </Button>

              </div>

            </div>

          </div>

        </Reveal>

      </section>

      {/* =========================================================
          MANIFESTO
      ========================================================= */}
      <section className="mx-auto max-w-7xl px-5 md:px-8 py-24">

        <Reveal className="mb-12">

          <p className="font-mono text-xs uppercase tracking-[0.3em] text-amber-glow mb-3">
            The Code
          </p>

          <h2 className="font-display font-black text-4xl md:text-6xl tracking-tighter">
            Every Move Matters.
          </h2>

        </Reveal>

        <div className="grid md:grid-cols-3 gap-6">

          {MANIFESTO.map((m, i) => (
            <Reveal key={m.no} delay={i * 0.1}>

              <div className="group h-full border-l-2 border-amber-glow/40 pl-6 py-2 hover:border-cyan-glow transition-colors duration-500">

                <div className="font-display font-black text-6xl text-white/10 group-hover:text-cyan-glow/10 transition-colors">
                  {m.no}
                </div>

                <h3 className="mt-4 font-display font-bold text-xl">
                  {m.title}
                </h3>

                <p className="mt-3 font-mono text-sm text-zinc-400 leading-relaxed">
                  {m.body}
                </p>

              </div>

            </Reveal>
          ))}

        </div>

      </section>

      {/* =========================================================
          FINAL CTA
      ========================================================= */}
      <section className="mx-auto max-w-7xl px-5 md:px-8 pb-24">

        <Reveal>

          <div className="relative overflow-hidden border border-white/10 bg-ink-surface p-12 md:p-20 text-center">

            {/* Decorative chess knight */}
            <motion.span
              initial={{ rotate: 0, scale: 0.8 }}
              whileInView={{
                rotate: 360,
                scale: 1,
              }}
              transition={{
                duration: 2,
                ease: "easeInOut",
              }}
              viewport={{ once: true }}
              className="inline-block text-6xl text-amber-glow mb-6"
            >
              {"\u265E"}
            </motion.span>

            <p className="font-mono text-xs uppercase tracking-[0.3em] text-cyan-glow mb-4">
              {EVENT_INFO.name}
            </p>

            <h2 className="font-display font-black text-4xl md:text-6xl tracking-tighter">
              Your move.
            </h2>

            <p className="mt-4 font-mono text-sm text-zinc-400 max-w-lg mx-auto">
              Registration for {EVENT_INFO.name} is open.
              Claim your place on the board before the timer runs out.
            </p>

            <Button
              asChild
              className="mt-8 rounded-full bg-amber-glow text-ink-base font-mono text-xs font-bold uppercase tracking-wider px-10 py-6 hover:bg-amber-hover hover:scale-105 transition-transform"
            >
              <Link to="/signup" data-testid="home-cta-signup">
                Register Now
              </Link>
            </Button>

          </div>

        </Reveal>

      </section>

    </div>
  );
}