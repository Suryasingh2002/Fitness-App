import React, { useEffect, useState } from "react";
import { api } from "../lib/api";
import ChallengeCard from "../components/ChallengeCard";

export default function Challenges() {
  const [challenges, setChallenges] = useState([]);
  const [joined, setJoined] = useState({});

  useEffect(() => {
    api.get("/challenges").then((r) => setChallenges(r.data));
    api
      .get("/users/me/challenges")
      .then((r) => {
        const map = {};
        r.data.forEach((e) => (map[e.challenge_id] = e));
        setJoined(map);
      })
      .catch(() => {});
  }, []);

  return (
    <div className="mx-auto max-w-7xl px-6 py-10" data-testid="challenges-page">
      <div>
        <span className="label-uppercase text-primary">Commit</span>
        <h1 className="font-display text-4xl md:text-5xl mt-2 leading-none">FITNESS CHALLENGES</h1>
        <p className="text-muted-foreground mt-3 max-w-xl">
          Choose a challenge. Train daily. Earn your badge.
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mt-10">
        {challenges.map((c) => (
          <ChallengeCard key={c.id} challenge={c} progress={joined[c.id]} />
        ))}
      </div>
    </div>
  );
}
