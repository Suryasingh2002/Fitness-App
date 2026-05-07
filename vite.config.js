import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import path from "node:path";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  const backendUrl = env.REACT_APP_BACKEND_URL || env.VITE_BACKEND_URL || "";

  return {
    plugins: [react()],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "src"),
      },
    },
    define: {
      "process.env.REACT_APP_BACKEND_URL": JSON.stringify(backendUrl),
    },
  };
});
