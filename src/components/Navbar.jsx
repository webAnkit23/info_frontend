import { Link, NavLink, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { Menu, LogOut, User } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

const LINKS = [
  { to: "/", label: "Home" },
  { to: "/events", label: "Events" },
  { to: "/team", label: "Team" },
  { to: "/about", label: "About" },
  { to: "/contact", label: "Contact" },
];

export const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      data-testid="main-navbar"
      className={`fixed top-0 left-0 right-0 z-50 transition-[background-color,border-color] duration-500 ${
        scrolled ? "glass border-b border-white/10" : "bg-transparent border-b border-transparent"
      }`}
    >
      <nav className="mx-auto max-w-7xl px-5 md:px-8 h-16 md:h-20 flex items-center justify-between">
        <Link to="/" data-testid="nav-logo" className="flex items-center gap-2 group">
          <span className="text-2xl md:text-3xl text-amber-glow group-hover:rotate-12 transition-transform duration-500">
            {"\u265E"}
          </span>
          <span className="font-display italic font-black text-lg md:text-xl tracking-tight">
            Infotrek<span className="text-amber-glow">{"'26"}</span>
          </span>
        </Link>

        <div className="hidden md:flex items-center gap-1">
          {LINKS.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              data-testid={`nav-link-${l.label.toLowerCase()}`}
              className={({ isActive }) =>
                `px-4 py-2 font-mono text-xs uppercase tracking-[0.15em] transition-colors duration-300 ${
                  isActive ? "text-amber-glow" : "text-zinc-400 hover:text-white"
                }`
              }
            >
              {l.label}
            </NavLink>
          ))}
        </div>

        <div className="flex items-center gap-2">
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  data-testid="user-menu-trigger"
                  className="rounded-full border-white/15 bg-white/5 font-mono text-xs uppercase tracking-wider hover:border-amber-glow/60 hover:bg-white/5"
                >
                  <User className="w-4 h-4 mr-1" />
                  {user.name?.split(" ")[0] || "Player"}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="glass border-white/10 text-white">
                <DropdownMenuItem disabled className="font-mono text-[11px] text-zinc-400">
                  {user.email}
                </DropdownMenuItem>
                <DropdownMenuSeparator className="bg-white/10" />
                <DropdownMenuItem
                  data-testid="logout-button"
                  onClick={() => {
                    logout();
                    navigate("/");
                  }}
                  className="cursor-pointer font-mono text-xs uppercase tracking-wider focus:bg-white/10"
                >
                  <LogOut className="w-4 h-4 mr-2" /> Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="hidden sm:flex items-center gap-2">
              <Button
                asChild
                variant="ghost"
                data-testid="nav-login-button"
                className="rounded-full font-mono text-xs uppercase tracking-wider text-zinc-300 hover:text-white hover:bg-white/5"
              >
                <Link to="/login">Login</Link>
              </Button>
              <Button
                asChild
                data-testid="nav-signup-button"
                className="rounded-full bg-amber-glow text-ink-base font-mono text-xs font-bold uppercase tracking-wider hover:bg-amber-hover"
              >
                <Link to="/signup">Sign Up</Link>
              </Button>
            </div>
          )}

          {/* Mobile menu */}
          <div className="md:hidden">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  data-testid="mobile-menu-trigger"
                  className="rounded-full border-white/15 bg-white/5"
                >
                  <Menu className="w-5 h-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="glass border-white/10 text-white w-48">
                {LINKS.map((l) => (
                  <DropdownMenuItem key={l.to} asChild className="focus:bg-white/10">
                    <Link
                      to={l.to}
                      data-testid={`mobile-nav-link-${l.label.toLowerCase()}`}
                      className="font-mono text-xs uppercase tracking-wider cursor-pointer"
                    >
                      {l.label}
                    </Link>
                  </DropdownMenuItem>
                ))}
                {!user && (
                  <>
                    <DropdownMenuSeparator className="bg-white/10" />
                    <DropdownMenuItem asChild className="focus:bg-white/10">
                      <Link to="/login" className="font-mono text-xs uppercase tracking-wider cursor-pointer">
                        Login
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild className="focus:bg-white/10">
                      <Link to="/signup" className="font-mono text-xs uppercase tracking-wider cursor-pointer text-amber-glow">
                        Sign Up
                      </Link>
                    </DropdownMenuItem>
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </nav>
    </header>
  );
};
