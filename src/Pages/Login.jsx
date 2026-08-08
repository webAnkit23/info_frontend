import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import AuthShell from "@/pages/AuthShell";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function Login() {
  const { login, formatApiErrorDetail } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const user = await login(email, password);
      toast.success(`Welcome back, ${user.name.split(" ")[0]}!`);
      navigate("/");
    } catch (err) {
      const msg = formatApiErrorDetail(err.response?.data?.detail) || "Login failed.";
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthShell
      testid="login-page"
      title="Resume Game"
      subtitle="Log in to your Infotrek '26 account."
      footer={
        <>
          No account yet?{" "}
          <Link to="/signup" className="text-amber-glow hover:underline" data-testid="go-to-signup">
            Create one
          </Link>
        </>
      }
    >
      <form onSubmit={submit} className="space-y-5" data-testid="login-form">
        <div className="space-y-2">
          <Label className="font-mono text-xs uppercase tracking-wider text-zinc-400">Email</Label>
          <Input
            required
            type="email"
            data-testid="login-email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@college.edu"
            className="bg-ink-base/60 border-white/15 font-mono focus-visible:ring-amber-glow"
          />
        </div>
        <div className="space-y-2">
          <Label className="font-mono text-xs uppercase tracking-wider text-zinc-400">Password</Label>
          <Input
            required
            type="password"
            data-testid="login-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            className="bg-ink-base/60 border-white/15 font-mono focus-visible:ring-amber-glow"
          />
        </div>
        {error && (
          <p className="font-mono text-xs text-red-400" data-testid="login-error">
            {error}
          </p>
        )}
        <Button
          type="submit"
          disabled={loading}
          data-testid="login-submit-button"
          className="w-full rounded-full bg-amber-glow text-ink-base font-mono text-xs font-bold uppercase tracking-wider py-6 hover:bg-amber-hover"
        >
          {loading ? "Checking..." : "Log In"}
        </Button>
      </form>
    </AuthShell>
  );
}