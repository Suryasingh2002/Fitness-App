import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { api } from "../lib/api";
import { useAuth } from "../contexts/AuthContext";
import { Button } from "../components/ui/button";
import { Progress } from "../components/ui/progress";
import { Check, Trophy, ArrowLeft } from "lucide-react";
import { toast } from "sonner";

export default function ChallengeDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const [challenge, setChallenge] = useState(null);
  const [entry, setEntry] = useState(null);

  useEffect(() => {
    api.get(`/challenges/${id}`).then((r) => setChallenge(r.data));
    if (user) {
      api.get("/users/me/challenges").then((r) => {
        const e = r.data.find((x) => x.challenge_id === id);
        if (e) setEntry(e);
      });
    }
  }, [id, user]);

  async function joinChallenge() {
    if (!user) return toast.error("Sign in to join this challenge");
    try {
      const { data } = await api.post(`/challenges/${id}/join`);
      setEntry(data);
      toast.success("You're in! Let's go.");
    } catch {
      toast.error("Could not join");
    }
  }

  async function markDay(day) {
    try {
      const { data } = await api.post(`/challenges/${id}/progress`, { day });
      setEntry(data);
      if (data.completed) toast.success("ðŸ† Challenge complete! Badge unlocked.");
      else toast.success(`Day ${day} checked`);
    } catch {
      toast.error("Could not update");
    }
  }

  if (!challenge) {
    return (
      <div className="min-h-[60vh] grid place-items-center text-muted-foreground">
        <span className="label-uppercase">Loading...</span>
      </div>
    );
  }

  const completed = new Set(entry?.days_completed || []);
  const pct = entry ? Math.round((completed.size / challenge.days) * 100) : 0;

  return (
    <div className="mx-auto max-w-5xl px-6 py-10" data-testid="challenge-detail-page">
      <Link to="/challenges" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6 label-uppercase text-xs">
        <ArrowLeft className="h-3 w-3" /> Back
      </Link>

      <div className="relative aspect-[21/9] overflow-hidden tact-card mb-8">
        <img src={challenge.cover_image} alt="" className="h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
          <div className="bg-primary text-primary-foreground inline-block px-3 py-1 rounded-sm">
            <span className="font-display text-lg leading-none">{challenge.days} DAYS</span>
          </div>
          <h1 className="font-display text-5xl md:text-6xl leading-none mt-4">{challenge.title.toUpperCase()}</h1>
          <p className="mt-3 text-white/80 max-w-2xl">{challenge.description}</p>
        </div>
      </div>

      {!entry ? (
        <div className="p-8 tact-card text-center">
          <h2 className="font-display text-3xl leading-none">READY TO COMMIT?</h2>
          <p className="text-muted-foreground mt-3 mb-6">Join this challenge to unlock daily tracking and earn the badge.</p>
          <Button size="lg" className="h-12 px-8" onClick={joinChallenge} data-testid="join-challenge-btn">
            Join Challenge
          </Button>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="p-6 tact-card">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-display text-xl leading-none">YOUR PROGRESS</h3>
              <span className="label-uppercase text-primary">{pct}%</span>
            </div>
            <Progress value={pct} className="h-2" />
            <p className="text-sm text-muted-foreground mt-3">
              {completed.size} of {challenge.days} days completed
            </p>
          </div>

          {entry.completed && (
            <div className="p-8 tact-card border-primary text-center bg-primary/5">
              <Trophy className="h-12 w-12 text-primary mx-auto" />
              <h3 className="font-display text-3xl leading-none mt-4">BADGE UNLOCKED</h3>
              {challenge.badge_image && (
                <img src={challenge.badge_image} alt="Badge" className="h-32 mx-auto my-4" />
              )}
              <p className="text-muted-foreground">You crushed the {challenge.title}. Proud of you.</p>
            </div>
          )}

          <div className="p-6 tact-card">
            <h3 className="font-display text-xl leading-none mb-4">DAILY TRACKER</h3>
            <div className="grid grid-cols-7 md:grid-cols-10 gap-2">
              {Array.from({ length: challenge.days }, (_, i) => i + 1).map((day) => {
                const done = completed.has(day);
                return (
                  <button
                    key={day}
                    onClick={() => !done && markDay(day)}
                    disabled={done}
                    data-testid={`day-${day}-btn`}
                    className={`aspect-square flex flex-col items-center justify-center rounded-md border text-sm font-semibold transition-colors duration-200 ${
                      done
                        ? "bg-primary text-primary-foreground border-primary"
                        : "border-border hover:border-primary hover:bg-secondary"
                    }`}
                  >
                    {done ? <Check className="h-4 w-4" /> : <span>{day}</span>}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
