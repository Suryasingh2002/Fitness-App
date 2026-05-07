import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { toast } from "sonner";
import { formatError } from "../lib/api";
import { Flame } from "lucide-react";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);

  async function onSubmit(e) {
    e.preventDefault();
    setBusy(true);
    try {
      const u = await login(email, password);
      toast.success(`Welcome back, ${u.name}`);
      navigate(u.role === "admin" ? "/admin" : "/dashboard");
    } catch (err) {
      toast.error(formatError(err.response?.data?.detail) || err.message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] grid md:grid-cols-2" data-testid="login-page">
      <div className="hidden md:block relative overflow-hidden">
        <img
          src="https://images.pexels.com/photos/29392546/pexels-photo-29392546.jpeg"
          alt=""
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-black/60" />
        <div className="absolute bottom-10 left-10 right-10 text-white">
          <Flame className="h-10 w-10 text-primary" />
          <h2 className="font-display text-5xl mt-4 leading-none">
            WELCOME <br /> BACK.
          </h2>
          <p className="mt-4 text-white/80 max-w-sm">
            Pick up where you left off. Your streak is waiting.
          </p>
        </div>
      </div>

      <div className="grid place-items-center p-6">
        <form onSubmit={onSubmit} className="w-full max-w-md space-y-5">
          <div>
            <span className="label-uppercase text-primary">Sign In</span>
            <h1 className="font-display text-4xl mt-1 leading-none">GET BACK TO IT.</h1>
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              data-testid="login-email-input"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="********"
              data-testid="login-password-input"
            />
          </div>
          <Button type="submit" className="w-full h-11" disabled={busy} data-testid="login-submit-btn">
            {busy ? "Signing in..." : "Sign In"}
          </Button>
          <div className="text-sm text-muted-foreground text-center">
            New here?{" "}
            <Link to="/register" className="text-primary hover:underline" data-testid="goto-register-link">
              Create an account
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
