import React from "react";
import { Link } from "react-router-dom";
import { Clock, Flame, User as UserIcon } from "lucide-react";

const difficultyColor = {
  beginner: "text-emerald-400",
  intermediate: "text-amber-400",
  advanced: "text-primary",
};

export default function WorkoutCard({ workout }) {
  return (
    <Link
      to={`/workouts/${workout.id}`}
      data-testid={`workout-card-${workout.id}`}
      className="group block tact-card overflow-hidden hover:border-primary/40 transition-colors duration-200"
    >
      <div className="relative aspect-[16/10] overflow-hidden bg-secondary">
        <img
          src={workout.thumbnail}
          alt={workout.title}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 gradient-fade-bottom" />
        <div className="absolute top-3 left-3 bg-background/80 backdrop-blur px-2 py-1 rounded-sm">
          <span className={`label-uppercase ${difficultyColor[workout.difficulty] || "text-muted-foreground"}`}>
            {workout.difficulty}
          </span>
        </div>
        <div className="absolute bottom-3 left-3 right-3 flex items-center gap-3 text-white">
          <div className="flex items-center gap-1 text-xs">
            <Clock className="h-3 w-3" />
            <span>{workout.duration} MIN</span>
          </div>
          <div className="flex items-center gap-1 text-xs">
            <Flame className="h-3 w-3 text-primary" />
            <span className="label-uppercase">{workout.category.replace("_", " ")}</span>
          </div>
        </div>
      </div>
      <div className="p-5">
        <h3 className="font-display text-xl leading-none mb-2 group-hover:text-primary transition-colors duration-200">
          {workout.title}
        </h3>
        <div className="flex items-center gap-2 text-muted-foreground text-xs">
          <UserIcon className="h-3 w-3" />
          <span>{workout.trainer}</span>
        </div>
      </div>
    </Link>
  );
}
