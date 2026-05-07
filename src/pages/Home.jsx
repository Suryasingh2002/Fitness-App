import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api, CATEGORIES } from "../lib/api";
import WorkoutCard from "../components/WorkoutCard";
import ChallengeCard from "../components/ChallengeCard";
import { Button } from "../components/ui/button";
import { ArrowRight, Play, Trophy, Zap } from "lucide-react";

const HERO_IMG = "https://images.pexels.com/photos/29392546/pexels-photo-29392546.jpeg";

export default function Home() {
  const [workouts, setWorkouts] = useState([]);
  const [challenges, setChallenges] = useState([]);

  useEffect(() => {
    api.get("/workouts?limit=8").then((r) => setWorkouts(r.data));
    api.get("/challenges").then((r) => setChallenges(r.data));
  }, []);

  return (
    <div data-testid="home-page">
      {/* HERO */}
      <section className="relative overflow-hidden border-b border-border">
        <div className="absolute inset-0">
          <img src={HERO_IMG} alt="Gym" className="h-full w-full object-cover opacity-60" />
          <div className="absolute inset-0 bg-gradient-to-br from-background/85 via-background/60 to-background/85" />
        </div>
        <div className="relative mx-auto max-w-7xl px-6 py-24 md:py-36">
          <span className="label-uppercase text-primary">Performance Fitness Platform</span>
          <h1 className="font-display text-5xl md:text-7xl lg:text-8xl leading-[0.9] mt-4 max-w-4xl">
            TRAIN LIKE <br />
            YOU <span className="text-primary">MEAN IT.</span>
          </h1>
          <p className="mt-6 max-w-xl text-base md:text-lg text-muted-foreground leading-relaxed">
            Guided video workouts, daily challenges, and progress tracking - built for people who don't skip Mondays.
          </p>
          <div className="mt-10 flex flex-wrap gap-3">
            <Link to="/register">
              <Button size="lg" className="h-12 px-6" data-testid="hero-start-btn">
                Start Training <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Link to="/workouts">
              <Button size="lg" variant="outline" className="h-12 px-6" data-testid="hero-explore-btn">
                <Play className="mr-2 h-4 w-4" /> Explore Workouts
              </Button>
            </Link>
          </div>

          <div className="mt-16 grid grid-cols-3 gap-6 max-w-xl">
            <Stat k="12+" label="Workouts" />
            <Stat k="3" label="Challenges" />
            <Stat k="4" label="Categories" />
          </div>
        </div>
      </section>

      {/* CATEGORIES */}
      <section className="mx-auto max-w-7xl px-6 py-20">
        <SectionHead kicker="Pick your path" title="TRAIN BY GOAL" />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-10">
          {CATEGORIES.map((c) => (
            <Link
              key={c.key}
              to={`/workouts?category=${c.key}`}
              className="group relative aspect-[3/4] overflow-hidden tact-card"
              data-testid={`category-${c.key}`}
            >
              <img
                src={c.image}
                alt={c.label}
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-5 text-white">
                <h3 className="font-display text-2xl leading-none">{c.label.toUpperCase()}</h3>
                <p className="text-xs text-white/80 mt-1">{c.description}</p>
                <div className="mt-3 inline-flex items-center gap-1 text-primary label-uppercase">
                  Explore <ArrowRight className="h-3 w-3" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* TRENDING */}
      <section className="mx-auto max-w-7xl px-6 py-20 border-t border-border">
        <div className="flex items-end justify-between">
          <SectionHead kicker="Hot right now" title="TRENDING WORKOUTS" />
          <Link to="/workouts" className="label-uppercase text-primary hover:underline hidden sm:inline">
            View all
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mt-10">
          {workouts.slice(0, 8).map((w) => (
            <WorkoutCard key={w.id} workout={w} />
          ))}
        </div>
      </section>

      {/* CHALLENGES */}
      <section className="mx-auto max-w-7xl px-6 py-20 border-t border-border">
        <SectionHead kicker="Commit to it" title="ACTIVE CHALLENGES" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mt-10">
          {challenges.map((c) => (
            <ChallengeCard key={c.id} challenge={c} />
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-border">
        <div className="mx-auto max-w-7xl px-6 py-24 text-center">
          <Zap className="h-10 w-10 text-primary mx-auto" />
          <h2 className="font-display text-4xl md:text-6xl mt-6 leading-none">
            READY TO <span className="text-primary">SWEAT?</span>
          </h2>
          <p className="text-muted-foreground mt-4 max-w-lg mx-auto">
            Join FitPulse today. Free forever. No credit card. No gimmicks.
          </p>
          <Link to="/register">
            <Button size="lg" className="h-12 px-8 mt-8" data-testid="cta-join-btn">
              Create Free Account
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}

function SectionHead({ kicker, title }) {
  return (
    <div>
      <span className="label-uppercase text-primary">{kicker}</span>
      <h2 className="font-display text-4xl md:text-5xl mt-2 leading-none">{title}</h2>
    </div>
  );
}

function Stat({ k, label }) {
  return (
    <div className="border-l-2 border-primary pl-4">
      <div className="font-display text-3xl md:text-4xl leading-none">{k}</div>
      <div className="label-uppercase text-muted-foreground mt-1">{label}</div>
    </div>
  );
}
