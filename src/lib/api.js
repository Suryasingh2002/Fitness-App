import axios from "axios";

export const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

export const api = axios.create({
  baseURL: API,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("fp_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export function formatError(detail) {
  if (detail == null) return "Something went wrong. Please try again.";
  if (typeof detail === "string") return detail;
  if (Array.isArray(detail)) {
    return detail
      .map((e) => (e && typeof e.msg === "string" ? e.msg : JSON.stringify(e)))
      .join(" ");
  }
  if (detail && typeof detail.msg === "string") return detail.msg;
  return String(detail);
}

export const CATEGORIES = [
  {
    key: "weight_loss",
    label: "Weight Loss",
    image: "https://images.pexels.com/photos/35439074/pexels-photo-35439074.jpeg",
    description: "Burn calories. Reveal definition.",
  },
  {
    key: "muscle_gain",
    label: "Muscle Gain",
    image: "https://images.unsplash.com/photo-1734189605012-f03d97a4d98f",
    description: "Build strength. Forge power.",
  },
  {
    key: "home_workout",
    label: "Home Workout",
    image: "https://images.unsplash.com/photo-1758599878908-596c2042f563",
    description: "No gym. No excuses.",
  },
  {
    key: "yoga",
    label: "Yoga & Flex",
    image: "https://images.unsplash.com/photo-1758599879024-7379d769f664",
    description: "Flow. Stretch. Restore.",
  },
];

export function categoryLabel(key) {
  return CATEGORIES.find((c) => c.key === key)?.label || key;
}
