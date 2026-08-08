import { motion } from "framer-motion";

// Endless scrolling chess ribbon.
export const Marquee = ({ items, className = "" }) => {
  const list = [...items, ...items];
  return (
    <div className={`relative overflow-hidden border-y border-white/10 bg-ink-surface/60 py-5 ${className}`} data-testid="marquee">
      <div className="marquee-track">
        {list.map((item, i) => (
          <div key={i} className="flex items-center whitespace-nowrap px-6">
            <span className="font-display italic text-2xl md:text-3xl text-white/80">{item}</span>
            <span className="mx-6 text-amber-glow text-xl">{"\u265E"}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

// Scroll-triggered fade-up reveal wrapper.
export const Reveal = ({ children, delay = 0, className = "", y = 40 }) => (
  <motion.div
    initial={{ opacity: 0, y }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-80px" }}
    transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
    className={className}
  >
    {children}
  </motion.div>
);

// Line-by-line masked text reveal (on load / in view).
export const MaskedLines = ({ lines, className = "", inView = false }) => {
  const parent = inView
    ? { initial: "hidden", whileInView: "show", viewport: { once: true } }
    : { initial: "hidden", animate: "show" };
  return (
    <motion.div
      {...parent}
      variants={{ show: { transition: { staggerChildren: 0.12, delayChildren: 0.15 } } }}
      className={className}
    >
      {lines.map((line, i) => (
        <span key={i} className="block overflow-hidden">
          <motion.span
            variants={{
              hidden: { y: "110%" },
              show: { y: 0, transition: { duration: 0.9, ease: [0.22, 1, 0.36, 1] } },
            }}
            className="block"
          >
            {line}
          </motion.span>
        </span>
      ))}
    </motion.div>
  );
};
