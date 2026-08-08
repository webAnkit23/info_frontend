import { Link } from "react-router-dom";
import { motion } from "framer-motion";

// Shared immersive auth shell with glowing chess board backdrop.
export default function AuthShell({ title, subtitle, children, footer, testid }) {
  return (
    <div data-testid={testid} className="relative min-h-screen flex items-center justify-center px-5 py-28 overflow-hidden">
      {/* Backdrop image */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1638209354307-ea437d712fad?auto=format&fit=crop&w=1600&q=80')",
        }}
        aria-hidden="true"
      />
      <div className="absolute inset-0 bg-ink-base/80 backdrop-blur-sm" aria-hidden="true" />
      <div className="absolute inset-0 grid-bg opacity-40" aria-hidden="true" />

      <motion.div
        initial={{ opacity: 0, y: 40, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className="relative z-10 w-full max-w-md glass border border-white/10 p-8 md:p-10 rounded-2xl shadow-[0_0_60px_rgba(0,0,0,0.6)]"
      >
        <Link to="/" className="flex items-center gap-2 mb-8">
          <span className="text-3xl text-amber-glow">{"\u265E"}</span>
          <span className="font-display italic font-black text-xl">
            Infotrek<span className="text-amber-glow">{"'26"}</span>
          </span>
        </Link>
        <h1 className="font-display font-black text-3xl md:text-4xl tracking-tight">{title}</h1>
        <p className="mt-2 font-mono text-sm text-zinc-400">{subtitle}</p>
        <div className="mt-8">{children}</div>
        <div className="mt-6 text-center font-mono text-xs text-zinc-400">{footer}</div>
      </motion.div>
    </div>
  );
}