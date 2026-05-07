import React, { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { api, CATEGORIES } from "../lib/api";
import WorkoutCard from "../components/WorkoutCard";
import { Input } from "../components/ui/input";
import {
  Select, SelectTrigger, SelectValue, SelectContent, SelectItem,
} from "../components/ui/select";
import { Search } from "lucide-react";

const DIFFICULTIES = ["beginner", "intermediate", "advanced"];

export default function Workouts() {
  const [params, setParams] = useSearchParams();
  const [workouts, setWorkouts] = useState([]);
  const [search, setSearch] = useState("");

  const category = params.get("category") || "all";
  const difficulty = params.get("difficulty") || "all";
  const duration = params.get("duration") || "all";

  useEffect(() => {
    const q = {};
    if (category !== "all") q.category = category;
    if (difficulty !== "all") q.difficulty = difficulty;
    if (duration !== "all") q.max_duration = Number(duration);
    if (search) q.search = search;
    const qs = new URLSearchParams(q).toString();
    api.get(`/workouts${qs ? `?${qs}` : ""}`).then((r) => setWorkouts(r.data));
  }, [category, difficulty, duration, search]);

  function setParam(k, v) {
    const p = new URLSearchParams(params);
    if (v === "all" || !v) p.delete(k);
    else p.set(k, v);
    setParams(p);
  }

  return (
    <div className="mx-auto max-w-7xl px-6 py-10" data-testid="workouts-page">
      <div className="flex items-end justify-between mb-8">
        <div>
          <span className="label-uppercase text-primary">Library</span>
          <h1 className="font-display text-4xl md:text-5xl leading-none mt-2">ALL WORKOUTS</h1>
        </div>
        <span className="text-sm text-muted-foreground">{workouts.length} results</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mb-10 p-4 tact-card">
        <div className="relative md:col-span-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search..."
            className="pl-9"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            data-testid="workouts-search-input"
          />
        </div>
        <Select value={category} onValueChange={(v) => setParam("category", v)}>
          <SelectTrigger data-testid="filter-category"><SelectValue placeholder="Category" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {CATEGORIES.map((c) => (
              <SelectItem key={c.key} value={c.key}>{c.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={difficulty} onValueChange={(v) => setParam("difficulty", v)}>
          <SelectTrigger data-testid="filter-difficulty"><SelectValue placeholder="Difficulty" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Levels</SelectItem>
            {DIFFICULTIES.map((d) => (
              <SelectItem key={d} value={d}>{d[0].toUpperCase() + d.slice(1)}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={duration} onValueChange={(v) => setParam("duration", v)}>
          <SelectTrigger data-testid="filter-duration"><SelectValue placeholder="Duration" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Any Duration</SelectItem>
            <SelectItem value="15">15 min or less</SelectItem>
            <SelectItem value="30">30 min or less</SelectItem>
            <SelectItem value="60">60 min or less</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {workouts.length === 0 ? (
        <div className="text-center py-20 text-muted-foreground" data-testid="no-results">
          No workouts match your filters.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {workouts.map((w) => (
            <WorkoutCard key={w.id} workout={w} />
          ))}
        </div>
      )}
    </div>
  );
}
