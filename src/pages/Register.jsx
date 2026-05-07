import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { toast } from "sonner";
import { formatError } from "../lib/api";
import { Flame } from "lucide-react";

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [busy, setBusy] = useState(false);

  async function onSubmit(e) {
    e.preventDefault();
    setBusy(true);
    try {
      const u = await register(form.name, form.email, form.password);
      toast.success(`Welcome, ${u.name}! Let's get moving.`);
      navigate("/dashboard");
    } catch (err) {
      toast.error(formatError(err.response?.data?.detail) || err.message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] grid md:grid-cols-2" data-testid="register-page">
      <div className="hidden md:block relative overflow-hidden order-last">
        <img
          src="https://images.pexels.com/photos/35439074/pexels-photo-35439074.jpeg"
          alt=""
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-black/55" />
        <div className="absolute bottom-10 left-10 right-10 text-white">
          <Flame className="h-10 w-10 text-primary" />
          <h2 className="font-display text-5xl mt-4 leading-none">
            START THE <br /> STREAK.
          </h2>
          <p className="mt-4 text-white/80 max-w-sm">
            Join thousands tracking daily wins with FitPulse.
          </p>
        </div>
      </div>

      <div className="grid place-items-center p-6">
        <form onSubmit={onSubmit} className="w-full max-w-md space-y-5">
          <div>
            <span className="label-uppercase text-primary">Create account</span>
            <h1 className="font-display text-4xl mt-1 leading-none">JOIN FITPULSE.</h1>
          </div>
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              required
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              data-testid="register-name-input"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              required
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              data-testid="register-email-input"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password (min 6 characters)</Label>
            <Input
              id="password"
              type="password"
              required
              minLength={6}
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              data-testid="register-password-input"
            />
          </div>
          <Button type="submit" className="w-full h-11" disabled={busy} data-testid="register-submit-btn">
            {busy ? "Creating..." : "Create Account"}
          </Button>
          <div className="text-sm text-muted-foreground text-center">
            Already registered?{" "}
            <Link to="/login" className="text-primary hover:underline" data-testid="goto-login-link">
              Sign in
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
