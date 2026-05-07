import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { api, categoryLabel } from "../lib/api";
import { useAuth } from "../contexts/AuthContext";
import { Button } from "../components/ui/button";
import { Bookmark, BookmarkCheck, Clock, User as UserIcon, ArrowLeft, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";

export default function WorkoutDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const [workout, setWorkout] = useState(null);
  const [bookmarked, setBookmarked] = useState(false);
  const [logging, setLogging] = useState(false);

  useEffect(() => {
    api.get(`/workouts/${id}`).then((r) => setWorkout(r.data));
    if (user) {
      api.get("/users/me/bookmarks").then((r) => {
        setBookmarked(r.data.some((w) => w.id === id));
      });
    }
  }, [id, user]);

  async function toggleBookmark() {
    if (!user) {
      toast.error("Sign in to bookmark workouts");
      return;
    }
    try {
      if (bookmarked) {
        await api.delete(`/users/me/bookmarks/${id}`);
        setBookmarked(false);
        toast.success("Bookmark removed");
      } else {
        await api.post("/users/me/bookmarks", { workout_id: id });
        setBookmarked(true);
        toast.success("Bookmarked");
      }
    } catch {
      toast.error("Something went wrong");
    }
  }

  async function completeWorkout() {
    if (!user) {
      toast.error("Sign in to track progress");
      return;
    }
    setLogging(true);
    try {
      await api.post("/users/me/progress", { workout_id: id, duration: workout.duration });
      toast.success(`Nice! +${workout.duration} min logged ðŸ”¥`);
    } catch {
      toast.error("Could not log session");
    } finally {
      setLogging(false);
    }
  }

  if (!workout) {
    return (
      <div className="min-h-[60vh] grid place-items-center text-muted-foreground">
        <span className="label-uppercase">Loading...</span>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-6 py-10" data-testid="workout-detail-page">
      <Link to="/workouts" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6 label-uppercase text-xs">
        <ArrowLeft className="h-3 w-3" /> Back to workouts
      </Link>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="aspect-video w-full overflow-hidden tact-card bg-black">
            <iframe
              src={workout.video_url}
              title={workout.title}
              className="h-full w-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              data-testid="workout-video"
            />
          </div>
          <div className="mt-6">
            <span className="label-uppercase text-primary">{categoryLabel(workout.category)}</span>
            <h1 className="font-display text-4xl md:text-5xl leading-none mt-2">{workout.title}</h1>
            <div className="flex flex-wrap items-center gap-4 mt-4 text-muted-foreground text-sm">
              <span className="flex items-center gap-1"><Clock className="h-4 w-4" /> {workout.duration} min</span>
              <span className="flex items-center gap-1"><UserIcon className="h-4 w-4" /> {workout.trainer}</span>
              <span className="label-uppercase text-primary">{workout.difficulty}</span>
            </div>
            <p className="mt-6 leading-relaxed text-muted-foreground">{workout.description}</p>
          </div>
        </div>

        <aside className="space-y-3">
          <div className="p-6 tact-card space-y-3">
            <h3 className="font-display text-xl leading-none">SESSION ACTIONS</h3>
            <Button
              onClick={completeWorkout}
              className="w-full h-11"
              disabled={logging}
              data-testid="complete-workout-btn"
            >
              <CheckCircle2 className="h-4 w-4 mr-2" />
              {logging ? "Logging..." : "Mark as Completed"}
            </Button>
            <Button
              onClick={toggleBookmark}
              variant="outline"
              className="w-full h-11"
              data-testid="bookmark-btn"
            >
              {bookmarked ? <BookmarkCheck className="h-4 w-4 mr-2 text-primary" /> : <Bookmark className="h-4 w-4 mr-2" />}
              {bookmarked ? "Bookmarked" : "Bookmark"}
            </Button>
          </div>
          <div className="p-6 tact-card space-y-2">
            <h3 className="font-display text-xl leading-none">DETAILS</h3>
            <Row k="Duration" v={`${workout.duration} minutes`} />
            <Row k="Difficulty" v={workout.difficulty} />
            <Row k="Trainer" v={workout.trainer} />
            <Row k="Category" v={categoryLabel(workout.category)} />
            <Row k="Views" v={workout.views || 0} />
          </div>
        </aside>
      </div>
    </div>
  );
}

function Row({ k, v }) {
  return (
    <div className="flex items-center justify-between text-sm py-1 border-b border-border last:border-0">
      <span className="text-muted-foreground label-uppercase text-xs">{k}</span>
      <span className="capitalize">{v}</span>
    </div>
  );
}
