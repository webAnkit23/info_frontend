import { Link } from "react-router-dom";
import { EVENT_INFO } from "@/lib/data";

export const Footer = () => {
  return (
    <footer data-testid="main-footer" className="relative border-t border-white/10 mt-24">
      <div className="mx-auto max-w-7xl px-5 md:px-8 py-16 grid gap-12 md:grid-cols-4">
        <div className="md:col-span-2">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-3xl text-amber-glow">{"\u265E"}</span>
            <span className="font-display italic font-black text-2xl">
              Infotrek<span className="text-amber-glow">{"'26"}</span>
            </span>
          </div>
          <p className="font-mono text-sm text-zinc-400 max-w-sm leading-relaxed">
            The annual inter-department technical meet of the {EVENT_INFO.host},{" "}
            {EVENT_INFO.college}. Where strategy meets code.
          </p>
        </div>
        <div>
          <h4 className="font-mono text-xs uppercase tracking-[0.2em] text-amber-glow mb-4">Navigate</h4>
          <ul className="space-y-2 font-mono text-sm text-zinc-400">
            {["Events", "Team", "About", "Contact"].map((l) => (
              <li key={l}>
                <Link to={`/${l.toLowerCase()}`} className="hover:text-white transition-colors">
                  {l}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h4 className="font-mono text-xs uppercase tracking-[0.2em] text-amber-glow mb-4">Reach us</h4>
          <ul className="space-y-2 font-mono text-sm text-zinc-400">
            <li>info@infotrek.nitt.edu</li>
            <li>NIT Tiruchirappalli, TN</li>
            <li>{EVENT_INFO.dates}</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="mx-auto max-w-7xl px-5 md:px-8 py-6 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="font-mono text-xs text-zinc-500">
            {"\u00A9"} 2026 Infotrek. Checkmate the ordinary.
          </p>
          <p className="font-mono text-xs text-zinc-500">Designed on 64 squares.</p>
        </div>
      </div>
    </footer>
  );
};