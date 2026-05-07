import React from "react";
import { Link } from "react-router-dom";
import { Trophy } from "lucide-react";

export default function ChallengeCard({ challenge, progress }) {
  const pct = progress ? Math.round((progress.days_completed.length / progress.total_days) * 100) : 0;
  return (
    <Link
      to={`/challenges/${challenge.id}`}
      data-testid={`challenge-card-${challenge.id}`}
      className="group block tact-card overflow-hidden hover:border-primary/40 transition-colors duration-200"
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-secondary">
        <img
          src={challenge.cover_image}
          alt={challenge.title}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-black/40" />
        <div className="absolute top-4 left-4 bg-primary text-primary-foreground px-3 py-1 rounded-sm">
          <span className="font-display text-lg leading-none">{challenge.days} DAYS</span>
        </div>
        {progress && (
          <div className="absolute top-4 right-4 bg-background/90 backdrop-blur px-2 py-1 rounded-sm flex items-center gap-1">
            <Trophy className="h-3 w-3 text-primary" />
            <span className="label-uppercase">{pct}%</span>
          </div>
        )}
        <div className="absolute bottom-0 left-0 right-0 p-5 text-white">
          <h3 className="font-display text-2xl leading-none mb-1">{challenge.title}</h3>
          <p className="text-sm text-white/80 line-clamp-2">{challenge.description}</p>
        </div>
      </div>
    </Link>
  );
}
