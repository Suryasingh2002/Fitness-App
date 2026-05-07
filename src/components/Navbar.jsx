import React from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useTheme } from "../contexts/ThemeContext";
import { Button } from "./ui/button";
import { Flame, Sun, Moon, LogOut, LayoutDashboard, ShieldCheck } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "./ui/dropdown-menu";

export default function Navbar() {
  const { user, logout } = useAuth();
  const { theme, toggle } = useTheme();
  const navigate = useNavigate();

  const navLinkCls = ({ isActive }) =>
    `label-uppercase transition-colors duration-200 ${
      isActive ? "text-primary" : "text-muted-foreground hover:text-foreground"
    }`;

  return (
    <header
      className="sticky top-0 z-40 w-full backdrop-blur-xl bg-background/75 border-b border-border"
      data-testid="site-navbar"
    >
      <div className="mx-auto max-w-7xl flex items-center justify-between px-6 h-16">
        <Link to="/" className="flex items-center gap-2" data-testid="logo-link">
          <div className="h-9 w-9 bg-primary grid place-items-center rounded-md">
            <Flame className="h-5 w-5 text-primary-foreground" strokeWidth={2.5} />
          </div>
          <span className="font-display text-2xl tracking-tight">FITPULSE</span>
        </Link>

        <nav className="hidden md:flex items-center gap-8">
          <NavLink to="/" end className={navLinkCls} data-testid="nav-home">Home</NavLink>
          <NavLink to="/workouts" className={navLinkCls} data-testid="nav-workouts">Workouts</NavLink>
          <NavLink to="/challenges" className={navLinkCls} data-testid="nav-challenges">Challenges</NavLink>
          {user && user.role && (
            <NavLink to="/dashboard" className={navLinkCls} data-testid="nav-dashboard">Dashboard</NavLink>
          )}
        </nav>

        <div className="flex items-center gap-2">
          <button
            onClick={toggle}
            className="h-9 w-9 grid place-items-center rounded-md border border-border hover:bg-secondary transition-colors duration-200"
            aria-label="Toggle theme"
            data-testid="theme-toggle"
          >
            {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </button>

          {user && user.role ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  className="h-9 px-3 border border-border rounded-md hover:bg-secondary transition-colors duration-200 flex items-center gap-2"
                  data-testid="user-menu-trigger"
                >
                  <div className="h-6 w-6 rounded-full bg-primary grid place-items-center text-primary-foreground text-xs font-bold">
                    {user.name?.[0]?.toUpperCase() || "U"}
                  </div>
                  <span className="text-sm hidden sm:inline">{user.name}</span>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>{user.email}</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => navigate("/dashboard")} data-testid="menu-dashboard">
                  <LayoutDashboard className="h-4 w-4 mr-2" /> Dashboard
                </DropdownMenuItem>
                {user.role === "admin" && (
                  <DropdownMenuItem onClick={() => navigate("/admin")} data-testid="menu-admin">
                    <ShieldCheck className="h-4 w-4 mr-2" /> Admin Console
                  </DropdownMenuItem>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => {
                    logout();
                    navigate("/");
                  }}
                  data-testid="menu-logout"
                >
                  <LogOut className="h-4 w-4 mr-2" /> Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <>
              <Button
                variant="ghost"
                onClick={() => navigate("/login")}
                data-testid="navbar-login-btn"
              >
                Sign In
              </Button>
              <Button onClick={() => navigate("/register")} data-testid="navbar-register-btn">
                Get Started
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
