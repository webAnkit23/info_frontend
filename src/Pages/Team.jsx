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
                        <Reveal
                          key={m.name}
                          delay={i * 0.06}
                        >
                          <div
                            className="
                              group
                              relative
                              aspect-[3/4]
                              overflow-hidden
                              border
                              border-white/10
                              bg-ink-surface
                              card-hover
                            "
                          >


                            <img src={m.image} alt={m.name} className="absolute inset-0  w-full  h-full object-cover grayscale-0 
                            group-hover:grayscale group-hover:brightness-75 group-hover:contrast-110 group-hover:scale-105
                                      transition-all
                                      duration-700
                                    "
                                  />

                            {/* =====================================================
                                IMAGE DARK OVERLAY
                            ===================================================== */}

                            <div
                              className="
                                absolute
                                inset-0
                                bg-gradient-to-t
                                from-black
                                via-black/30
                                to-transparent
                                opacity-90
                              "
                            />

                            {/* =====================================================
                                HOVER CYAN/AMBER GLOW
                            ===================================================== */}

                            <div
                              className="
                                absolute
                                inset-0
                                bg-cyan-glow/0
                                group-hover:bg-cyan-glow/5
                                transition-colors
                                duration-500
                              "
                            />

                            {/* =====================================================
                                INFORMATION
                            ===================================================== */}

                            <div
                              className="
                                absolute
                                inset-x-0
                                bottom-0
                                p-5
                              "
                            >

                              {/* Chess knight */}

                              <div
                                className="
                                  text-6xl
                                  text-amber-glow/80
                                  absolute
                                  right-3
                                  top-[-2.5rem]
                                  group-hover:scale-110
                                  transition-all
                                  duration-500
                                "
                              >
                                {"\u265E"}
                              </div>

                              <h3
                                className="
                                  font-display
                                  font-bold
                                  text-lg
                                "
                              >
                                {m.name}
                              </h3>

                              <p
                                className="font-mono text-[11px] uppercase tracking-[0.15em] text-cyan-glow mt-1"
                              >
                                {m.role}
                              </p>

                            </div>

                          </div>
                        </Reveal>
        ))}
      </div>
    </div>
  );
}