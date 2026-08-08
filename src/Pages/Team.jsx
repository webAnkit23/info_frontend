import { Reveal, MaskedLines } from "@/components/Motion";
import { TEAM } from "@/lib/data";

export default function Team() {
  return (
    <div data-testid="team-page" className="mx-auto max-w-7xl px-5 md:px-8 pt-32 md:pt-40 pb-24">
      <p className="font-mono text-xs uppercase tracking-[0.3em] text-amber-glow mb-4">The Players Behind the Board</p>
      <MaskedLines lines={["The Team"]} className="font-display font-black text-6xl md:text-8xl tracking-tighter" />
      <p className="mt-6 font-mono text-sm md:text-base text-zinc-400 max-w-2xl leading-relaxed">
        A closed circle of strategists orchestrating every move of Infotrek {"'26"}. Hover to reveal the player.
      </p>

      <div className="mt-14 grid grid-cols-2 md:grid-cols-4 gap-5" data-testid="team-grid">
        {TEAM.map((m, i) => (
          <Reveal key={m.name} delay={i * 0.06}>
            <div className="group relative aspect-[3/4] overflow-hidden border border-white/10 bg-ink-surface card-hover">
              {/* Monochrome initials 'portrait' revealing color on hover */}
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="font-display font-black text-7xl text-white/10 grayscale group-hover:text-amber-glow/80 transition-colors duration-500">
                  {m.init}
                </span>
              </div>
              <div className="absolute inset-x-0 bottom-0 p-5 bg-gradient-to-t from-black/80 to-transparent">
                <div className="text-6xl text-amber-glow/30 absolute right-3 top-[-2.5rem] group-hover:text-amber-glow/70 transition-colors duration-500">
                  {"\u265E"}
                </div>
                <h3 className="font-display font-bold text-lg">{m.name}</h3>
                <p className="font-mono text-[11px] uppercase tracking-[0.15em] text-cyan-glow">{m.role}</p>
              </div>
            </div>
          </Reveal>
        ))}
      </div>
    </div>
  );
}