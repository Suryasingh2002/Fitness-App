import React, { useEffect, useState } from "react";
import { api } from "../lib/api";
import { useAuth } from "../contexts/AuthContext";
import WorkoutCard from "../components/WorkoutCard";
import ChallengeCard from "../components/ChallengeCard";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
} from "recharts";
import { Flame, Trophy, Clock, Dumbbell } from "lucide-react";

export default function Dashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [bookmarks, setBookmarks] = useState([]);
  const [challenges, setChallenges] = useState([]);

  useEffect(() => {
    api.get("/users/me/stats").then((r) => setStats(r.data));
    api.get("/users/me/bookmarks").then((r) => setBookmarks(r.data));
    api.get("/users/me/challenges").then((r) => setChallenges(r.data));
  }, []);

  return (
    <div className="mx-auto max-w-7xl px-6 py-10 space-y-10" data-testid="dashboard-page">
      <div>
        <span className="label-uppercase text-primary">Control Room</span>
        <h1 className="font-display text-4xl md:text-5xl leading-none mt-2">
          WELCOME, {user?.name?.toUpperCase() || "ATHLETE"}.
        </h1>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard icon={Flame} label="Current Streak" value={stats?.streak ?? 0} suffix="days" accent />
        <StatCard icon={Dumbbell} label="Workouts" value={stats?.total_workouts ?? 0} />
        <StatCard icon={Clock} label="Total Minutes" value={stats?.total_minutes ?? 0} />
        <StatCard icon={Trophy} label="Challenges" value={stats?.joined_challenges ?? 0} />
      </div>

      {/* CHART */}
      <div className="p-6 tact-card">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-display text-xl leading-none">LAST 7 DAYS</h3>
          <span className="label-uppercase text-muted-foreground">Minutes Trained</span>
        </div>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={stats?.last7 || []}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis
                dataKey="date"
                tickFormatter={(d) => new Date(d).toLocaleDateString(undefined, { weekday: "short" })}
                stroke="hsl(var(--muted-foreground))"
                fontSize={12}
              />
              <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
              <Tooltip
                contentStyle={{
                  background: "hsl(var(--popover))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: 6,
                }}
              />
              <Bar dataKey="minutes" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* ACTIVE CHALLENGES */}
      {challenges.length > 0 && (
        <div>
          <h2 className="font-display text-2xl leading-none mb-5">YOUR CHALLENGES</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {challenges.filter((e) => e.challenge).map((e) => (
              <ChallengeCard key={e.id} challenge={e.challenge} progress={e} />
            ))}
          </div>
        </div>
      )}

      {/* BOOKMARKS */}
      <div>
        <h2 className="font-display text-2xl leading-none mb-5">SAVED WORKOUTS</h2>
        {bookmarks.length === 0 ? (
          <div className="p-10 tact-card text-center text-muted-foreground" data-testid="no-bookmarks">
            No bookmarks yet. Save workouts to return to them later.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {bookmarks.map((w) => (
              <WorkoutCard key={w.id} workout={w} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function StatCard({ icon: Icon, label, value, suffix, accent }) {
  return (
    <div
      className={`p-5 tact-card ${accent ? "border-primary/40" : ""}`}
      data-testid={`stat-${label.toLowerCase().replace(/\s+/g, "-")}`}
    >
      <div className="flex items-center justify-between">
        <span className="label-uppercase text-muted-foreground">{label}</span>
        <Icon className={`h-4 w-4 ${accent ? "text-primary" : "text-muted-foreground"}`} />
      </div>
      <div className="mt-3 font-display text-4xl leading-none">
        {value}
        {suffix && <span className="text-muted-foreground text-base ml-1">{suffix}</span>}
      </div>
    </div>
  );
}
