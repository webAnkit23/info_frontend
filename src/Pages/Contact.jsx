import { useState } from "react";
import { toast } from "sonner";
import { Mail, MapPin, Send } from "lucide-react";
import { MaskedLines, Reveal } from "@/components/Motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import api, { formatApiErrorDetail } from "@/lib/api";

export default function Contact() {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [loading, setLoading] = useState(false);

  const update = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await api.post("/contact", form);
      toast.success(data.message || "Message sent!");
      setForm({ name: "", email: "", subject: "", message: "" });
    } catch (err) {
      toast.error(formatApiErrorDetail(err.response?.data?.detail) || "Failed to send message.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div data-testid="contact-page" className="mx-auto max-w-7xl px-5 md:px-8 pt-32 md:pt-40 pb-24">
      <p className="font-mono text-xs uppercase tracking-[0.3em] text-amber-glow mb-4">Open a line</p>
      <MaskedLines lines={["Contact"]} className="font-display font-black text-6xl md:text-8xl tracking-tighter" />

      <div className="mt-14 grid md:grid-cols-[1fr_1.4fr] gap-12">
        <Reveal>
          <div className="space-y-8">
            <p className="font-mono text-sm text-zinc-400 leading-relaxed">
              Questions about events, sponsorship, or partnerships? Send your move — the Infotrek core team responds
              within a day.
            </p>
            <div className="space-y-5">
              <div className="flex items-start gap-4">
                <span className="mt-1 flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-ink-surface text-amber-glow">
                  <Mail className="w-4 h-4" />
                </span>
                <div>
                  <div className="font-mono text-[11px] uppercase tracking-[0.2em] text-zinc-500">Email</div>
                  <div className="font-mono text-sm text-white">info@infotrek.nitt.edu</div>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <span className="mt-1 flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-ink-surface text-amber-glow">
                  <MapPin className="w-4 h-4" />
                </span>
                <div>
                  <div className="font-mono text-[11px] uppercase tracking-[0.2em] text-zinc-500">Venue</div>
                  <div className="font-mono text-sm text-white">NIT Tiruchirappalli, Tamil Nadu</div>
                </div>
              </div>
            </div>
            <div className="text-8xl text-amber-glow/20">{"\u265B"}</div>
          </div>
        </Reveal>

        <Reveal delay={0.1}>
          <form
            onSubmit={submit}
            data-testid="contact-form"
            className="border border-white/10 bg-ink-surface p-8 md:p-10 space-y-6"
          >
            <div className="grid sm:grid-cols-2 gap-5">
              <div className="space-y-2">
                <Label className="font-mono text-xs uppercase tracking-wider text-zinc-400">Name</Label>
                <Input
                  required
                  data-testid="contact-name"
                  value={form.name}
                  onChange={update("name")}
                  placeholder="Magnus C."
                  className="bg-ink-base border-white/15 font-mono focus-visible:ring-amber-glow"
                />
              </div>
              <div className="space-y-2">
                <Label className="font-mono text-xs uppercase tracking-wider text-zinc-400">Email</Label>
                <Input
                  required
                  type="email"
                  data-testid="contact-email"
                  value={form.email}
                  onChange={update("email")}
                  placeholder="you@college.edu"
                  className="bg-ink-base border-white/15 font-mono focus-visible:ring-amber-glow"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label className="font-mono text-xs uppercase tracking-wider text-zinc-400">Subject</Label>
              <Input
                required
                data-testid="contact-subject"
                value={form.subject}
                onChange={update("subject")}
                placeholder="Sponsorship enquiry"
                className="bg-ink-base border-white/15 font-mono focus-visible:ring-amber-glow"
              />
            </div>
            <div className="space-y-2">
              <Label className="font-mono text-xs uppercase tracking-wider text-zinc-400">Message</Label>
              <Textarea
                required
                data-testid="contact-message"
                value={form.message}
                onChange={update("message")}
                rows={5}
                placeholder="Make your move..."
                className="bg-ink-base border-white/15 font-mono focus-visible:ring-amber-glow resize-none"
              />
            </div>
            <Button
              type="submit"
              disabled={loading}
              data-testid="contact-submit"
              className="w-full rounded-full bg-amber-glow text-ink-base font-mono text-xs font-bold uppercase tracking-wider py-6 hover:bg-amber-hover"
            >
              {loading ? "Sending..." : (<><Send className="w-4 h-4 mr-2" /> Send Message</>)}
            </Button>
          </form>
        </Reveal>
      </div>
    </div>
  );
}