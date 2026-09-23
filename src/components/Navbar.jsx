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

  // ==========================================
  // HANDLE SCROLL
  // ==========================================

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", onScroll, {
      passive: true,
    });

    return () => {
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  // ==========================================
  // LOGOUT
  // ==========================================

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <header
      data-testid="main-navbar"
      className={`fixed top-0 left-0 right-0 z-50 transition-[background-color,border-color] duration-500 ${
        scrolled
          ? "glass border-b border-white/10"
          : "bg-transparent border-b border-transparent"
      }`}
    >
      <nav
        className="
          mx-auto
          max-w-7xl
          px-5
          md:px-8
          h-16
          md:h-20
          flex
          items-center
          justify-between
          bg-black/40
          backdrop-blur-md
          border-b
          border-white/10
        "
      >
        {/* ==================================
            LOGO
        ================================== */}

        <Link
          to="/"
          data-testid="nav-logo"
          className="flex items-center gap-2 group"
        >
          <span
            className="
              text-2xl
              md:text-3xl
              text-amber-glow
              font-color
              group-hover:rotate-12
              transition-transform
              duration-500
            "
          >
            {"\u265E"}
          </span>

          <span
            className="
              font-display
              font-orbitron
              text-lg
              md:text-xl
              tracking-tight
            "
          >
            Infotrek
            <span>{" '26"}</span>
          </span>
        </Link>

        {/* ==================================
            DESKTOP NAVIGATION
        ================================== */}

        <div className="hidden md:flex items-center gap-1">
          {LINKS.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              data-testid={`nav-link-${l.label.toLowerCase()}`}
              className={({ isActive }) =>
                `
                px-4
                py-2
                font-mono
                text-xs
                uppercase
                tracking-[0.15em]
                transition-colors
                duration-300
                ${
                  isActive
                    ? "font-color"
                    : "text-zinc-400 hover:text-white"
                }
                `
              }
            >
              {l.label}
            </NavLink>
          ))}
        </div>

        {/* ==================================
            RIGHT SIDE
        ================================== */}

        <div className="flex items-center gap-2">

          {/* ==================================
              LOGGED-IN USER
          ================================== */}

          {user ? (
            <DropdownMenu>

              {/* USER BUTTON */}

              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  data-testid="user-menu-trigger"
                  className="
                    rounded-full
                    border-white/15
                    bg-white/5
                    font-mono
                    text-xs
                    uppercase
                    tracking-wider
                    hover:border-amber-glow/60
                    hover:bg-white/5
                  "
                >
                  <User className="w-4 h-4 mr-1" />

                  {/* SHOW 3-DIGIT USER ID */}
                  {user.userId || "Player"}
                </Button>
              </DropdownMenuTrigger>

              {/* USER DROPDOWN */}

              <DropdownMenuContent
                align="end"
                className="
                  glass
                  border-white/10
                  text-white
                  w-56
                "
              >

                {/* USER NAME */}

                <DropdownMenuItem
                  disabled
                  className="
                    font-mono
                    text-[11px]
                    text-zinc-400
                  "
                >
                  {user.name || "Player"}
                </DropdownMenuItem>

                {/* USER ID */}

                <DropdownMenuItem
                  disabled
                  className="
                    font-mono
                    text-[11px]
                    text-amber-glow
                  "
                >
                  User ID: {user.userId || "N/A"}
                </DropdownMenuItem>

                {/* EMAIL */}

                <DropdownMenuItem
                  disabled
                  className="
                    font-mono
                    text-[11px]
                    text-zinc-400
                  "
                >
                  {user.email || "No email"}
                </DropdownMenuItem>

                <DropdownMenuSeparator className="bg-white/10" />

                {/* LOGOUT */}

                <DropdownMenuItem
                  data-testid="logout-button"
                  onClick={handleLogout}
                  className="
                    cursor-pointer
                    font-mono
                    text-xs
                    uppercase
                    tracking-wider
                    focus:bg-white/10
                  "
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Logout
                </DropdownMenuItem>

              </DropdownMenuContent>
            </DropdownMenu>
          ) : (

            /* ==================================
               NOT LOGGED IN
            ================================== */

            <div className="hidden sm:flex items-center gap-2">

              {/* LOGIN */}

              <Button
                asChild
                variant="ghost"
                data-testid="nav-login-button"
                className="
                  rounded-full
                  font-mono
                  text-xs
                  uppercase
                  tracking-wider
                  text-zinc-300
                  hover:text-white
                  hover:bg-white/5
                "
              >
                <Link to="/login">
                  Login
                </Link>
              </Button>

              {/* SIGN UP */}

              <Button
                asChild
                data-testid="nav-signup-button"
                className="
                  rounded-full
                  text-ink-base
                  font-mono
                  text-xs
                  font-bold
                  uppercase
                  tracking-wider
                  hover:bg-amber-hover
                "
              >
                <Link
                  to="/signup"
                  className="bg-color"
                >
                  Sign Up
                </Link>
              </Button>

            </div>
          )}

          {/* ==================================
              MOBILE MENU
          ================================== */}

          <div className="md:hidden">

            <DropdownMenu>

              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  data-testid="mobile-menu-trigger"
                  className="
                    rounded-full
                    border-white/15
                    bg-white/5
                  "
                >
                  <Menu className="w-5 h-5" />
                </Button>
              </DropdownMenuTrigger>

              <DropdownMenuContent
                align="end"
                className="
                  glass
                  border-white/10
                  text-white
                  w-48
                "
              >

                {/* MOBILE NAV LINKS */}

                {LINKS.map((l) => (
                  <DropdownMenuItem
                    key={l.to}
                    asChild
                    className="focus:bg-white/10"
                  >
                    <Link
                      to={l.to}
                      data-testid={`mobile-nav-link-${l.label.toLowerCase()}`}
                      className="
                        font-mono
                        text-xs
                        uppercase
                        tracking-wider
                        cursor-pointer
                      "
                    >
                      {l.label}
                    </Link>
                  </DropdownMenuItem>
                ))}

                {/* ==================================
                    LOGGED-IN MOBILE USER
                ================================== */}

                {user && (
                  <>
                    <DropdownMenuSeparator className="bg-white/10" />

                    <DropdownMenuItem
                      disabled
                      className="
                        font-mono
                        text-[11px]
                        text-amber-glow
                      "
                    >
                      User ID: {user.userId || "N/A"}
                    </DropdownMenuItem>

                    <DropdownMenuItem
                      disabled
                      className="
                        font-mono
                        text-[11px]
                        text-zinc-400
                      "
                    >
                      {user.name || "Player"}
                    </DropdownMenuItem>

                    <DropdownMenuItem
                      onClick={handleLogout}
                      className="
                        cursor-pointer
                        font-mono
                        text-xs
                        uppercase
                        tracking-wider
                        focus:bg-white/10
                      "
                    >
                      <LogOut className="w-4 h-4 mr-2" />
                      Logout
                    </DropdownMenuItem>
                  </>
                )}

                {/* ==================================
                    NOT LOGGED-IN MOBILE USER
                ================================== */}

                {!user && (
                  <>
                    <DropdownMenuSeparator className="bg-white/10" />

                    <DropdownMenuItem
                      asChild
                      className="focus:bg-white/10"
                    >
                      <Link
                        to="/login"
                        className="
                          font-mono
                          text-xs
                          uppercase
                          tracking-wider
                          cursor-pointer
                        "
                      >
                        Login
                      </Link>
                    </DropdownMenuItem>

                    <DropdownMenuItem
                      asChild
                      className="focus:bg-white/10"
                    >
                      <Link
                        to="/signup"
                        className="
                          font-mono
                          text-xs
                          uppercase
                          tracking-wider
                          cursor-pointer
                          text-amber-glow
                        "
                      >
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