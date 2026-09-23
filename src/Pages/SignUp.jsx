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

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const update = (key) => (e) => {
    setForm({
      ...form,
      [key]: e.target.value,
    });
  };

  const submit = async (e) => {
    e.preventDefault();

    // Indian mobile number validation
    const phoneRegex = /^[6-9]\d{9}$/;

    if (!phoneRegex.test(form.phone)) {
      setError(
        "Please enter a valid 10-digit Indian mobile number."
      );

      toast.error("Invalid phone number");

      return;
    }

    // Password validation
    if (form.password.length < 6) {
      setError("Password must be at least 6 characters.");

      toast.error("Password must be at least 6 characters");

      return;
    }

    setLoading(true);
    setError("");

    try {
      // IMPORTANT:
      // AuthContext expects:
      // register(name, number, email, password)

      const user = await register(
        form.name,
        form.phone,
        form.email,
        form.password
      );

      toast.success(
        `Welcome to the board, ${
          user.name.split(" ")[0]
        }! Your User ID is ${user.userId}`
      );

      navigate("/");

    } catch (err) {
      const msg =
        formatApiErrorDetail(
          err.response?.data?.message
        ) || "Signup failed.";

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
          <Link
            to="/login"
            className="text-amber-glow hover:underline"
            data-testid="go-to-login"
          >
            Log in
          </Link>
        </>
      }
    >
      <form
        onSubmit={submit}
        className="space-y-5"
        data-testid="signup-form"
      >

        {/* Full Name */}
        <div className="space-y-2">
          <Label className="font-mono text-xs uppercase tracking-wider text-zinc-400">
            Full Name
          </Label>

          <Input
            required
            data-testid="signup-name"
            value={form.name}
            onChange={update("name")}
            placeholder="Your name"
            className="bg-ink-base/60 border-white/15 font-mono focus-visible:ring-amber-glow"
          />
        </div>


        {/* Email */}
        <div className="space-y-2">
          <Label className="font-mono text-xs uppercase tracking-wider text-zinc-400">
            Email
          </Label>

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


        {/* Phone */}
        <div className="space-y-2">
          <Label className="font-mono text-xs uppercase tracking-wider text-zinc-400">
            Phone Number
          </Label>

          <Input
            required
            type="tel"
            data-testid="signup-phone"
            value={form.phone}
            onChange={update("phone")}
            placeholder="9876543210"
            maxLength={10}
            pattern="[6-9][0-9]{9}"
            inputMode="numeric"
            className="bg-ink-base/60 border-white/15 font-mono focus-visible:ring-amber-glow"
          />

          <p className="text-xs text-zinc-500 font-mono">
            Enter a valid 10-digit Indian mobile number
          </p>
        </div>


        {/* Password */}
        <div className="space-y-2">
          <Label className="font-mono text-xs uppercase tracking-wider text-zinc-400">
            Password
          </Label>

          <Input
            required
            type="password"
            data-testid="signup-password"
            value={form.password}
            onChange={update("password")}
            placeholder="Min. 6 characters"
            minLength={6}
            className="bg-ink-base/60 border-white/15 font-mono focus-visible:ring-amber-glow"
          />
        </div>


        {/* Error */}
        {error && (
          <p
            className="font-mono text-xs text-red-400"
            data-testid="signup-error"
          >
            {error}
          </p>
        )}


        {/* Submit */}
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