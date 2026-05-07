import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "@/App.css";
import { Toaster } from "sonner";
import { AuthProvider } from "./contexts/AuthContext";
import { ThemeProvider } from "./contexts/ThemeContext";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Workouts from "./pages/Workouts";
import WorkoutDetail from "./pages/WorkoutDetail";
import Challenges from "./pages/Challenges";
import ChallengeDetail from "./pages/ChallengeDetail";
import Dashboard from "./pages/Dashboard";
import Admin from "./pages/Admin";

function Layout({ children }) {
  return (
    <>
      <Navbar />
      <main>{children}</main>
      <footer className="border-t border-border mt-20">
        <div className="mx-auto max-w-7xl px-6 py-10 flex items-center justify-between">
          <span className="font-display text-xl">FITPULSE</span>
          <span className="text-xs text-muted-foreground label-uppercase">Train daily. Win forever.</span>
        </div>
      </footer>
    </>
  );
}

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <BrowserRouter>
          <Layout>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/workouts" element={<Workouts />} />
              <Route path="/workouts/:id" element={<WorkoutDetail />} />
              <Route path="/challenges" element={<Challenges />} />
              <Route path="/challenges/:id" element={<ChallengeDetail />} />
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin"
                element={
                  <ProtectedRoute roles={["admin"]}>
                    <Admin />
                  </ProtectedRoute>
                }
              />
            </Routes>
          </Layout>
          <Toaster position="top-right" richColors theme="dark" />
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
