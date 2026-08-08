import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import AuthShell from "@/pages/AuthShell";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function Signup() {
  const { register, formatApiErrorDetail } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const update = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const user = await register(form.name, form.email, form.password);
      toast.success(`Welcome to the board, ${user.name.split(" ")[0]}!`);
      navigate("/");
    } catch (err) {
      const msg = formatApiErrorDetail(err.response?.data?.detail) || "Signup failed.";
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthShell
      testid="signup-page"
      title="Enter the Board"
      subtitle="Create your Infotrek '26 account and claim your seat."
      footer={
        <>
          Already registered?{" "}
          <Link to="/login" className="text-amber-glow hover:underline" data-testid="go-to-login">
            Log in
          </Link>
        </>
      }
    >
      <form onSubmit={submit} className="space-y-5" data-testid="signup-form">
        <div className="space-y-2">
          <Label className="font-mono text-xs uppercase tracking-wider text-zinc-400">Full Name</Label>
          <Input
            required
            data-testid="signup-name"
            value={form.name}
            onChange={update("name")}
            placeholder="Your name"
            className="bg-ink-base/60 border-white/15 font-mono focus-visible:ring-amber-glow"
          />
        </div>
        <div className="space-y-2">
          <Label className="font-mono text-xs uppercase tracking-wider text-zinc-400">Email</Label>
          <Input
            required
            type="email"
            data-testid="signup-email"
            value={form.email}
            onChange={update("email")}
            placeholder="you@college.edu"
            className="bg-ink-base/60 border-white/15 font-mono focus-visible:ring-amber-glow"
          />
        </div>
        <div className="space-y-2">
          <Label className="font-mono text-xs uppercase tracking-wider text-zinc-400">Password</Label>
          <Input
            required
            type="password"
            data-testid="signup-password"
            value={form.password}
            onChange={update("password")}
            placeholder="Min. 6 characters"
            className="bg-ink-base/60 border-white/15 font-mono focus-visible:ring-amber-glow"
          />
        </div>
        {error && (
          <p className="font-mono text-xs text-red-400" data-testid="signup-error">
            {error}
          </p>
        )}
        <Button
          type="submit"
          disabled={loading}
          data-testid="signup-submit-button"
          className="w-full rounded-full bg-amber-glow text-ink-base font-mono text-xs font-bold uppercase tracking-wider py-6 hover:bg-amber-hover"
        >
          {loading ? "Creating..." : "Create Account"}
        </Button>
      </form>
    </AuthShell>
  );
}