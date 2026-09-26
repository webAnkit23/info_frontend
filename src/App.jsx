import { useEffect, useState } from "react";
import "@/App.css";

import {
  BrowserRouter,
  Routes,
  Route,
  useLocation,
  Outlet,
} from "react-router-dom";

import { AuthProvider } from "@/context/AuthContext";
import MouseEffect from "@/components/MouseEffect";
import SmoothScroll from "@/components/SmoothScroll";
import ChessBackground from "@/components/ChessBackground";
import Loader3D from "@/components/Loader3D";

import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

import { Toaster } from "@/components/ui/sonner";

import Home from "@/pages/Home";
import Events from "@/pages/Events";
import Team from "@/pages/Team";
import About from "@/pages/About";
import Contact from "@/pages/Contact";
import Login from "@/pages/Login";
import Signup from "@/pages/Signup";

import KineticHero from "./components/KineticHero";



/* ================================================================
   SCROLL TO TOP
================================================================ */

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    if (window.__lenis) {
      window.__lenis.scrollTo(0, {
        immediate: true,
      });
    } else {
      window.scrollTo(0, 0);
    }
  }, [pathname]);

  return null;
}


/* ================================================================
   MAIN SITE LAYOUT
================================================================ */

function SiteLayout() {
  return (
    <>

    <MouseEffect />
      <Navbar />

      <main>
        <Outlet />
      </main>

      <Footer />
    </>
  );
}


/* ================================================================
   AUTH LAYOUT
================================================================ */

function AuthLayout() {
  return (
    <>
      <Navbar />

      <Outlet />
    </>
  );
}


/* ================================================================
   APP
================================================================ */

function App() {
  const [loading, setLoading] =
    useState(true);

  /*
   * Safety timeout.
   *
   * Even if something goes wrong with
   * Three.js, the site will appear.
   */
  useEffect(() => {
    const safetyTimer =
      setTimeout(() => {
        setLoading(false);
      }, 5200);

    return () => {
      clearTimeout(safetyTimer);
    };
  }, []);


  return (
    <div
      className="
        App
        relative
        min-h-screen
      "
    >

      <AuthProvider>

        <BrowserRouter>

          {/* ==================================================
              3D INTRO LOADER

              It is outside SmoothScroll so Lenis doesn't
              interfere with the fixed canvas.
          ================================================== */}

          {loading && (
            <Loader3D
              onComplete={() => {
                setLoading(false);
              }}
            />
          )}


          {/* ==================================================
              ACTUAL WEBSITE
          ================================================== */}

          <SmoothScroll>

            {/* ==================================================
                EXISTING CHESS BACKGROUND
            ================================================== */}

            <ChessBackground />
            <KineticHero/>


            {/* ==================================================
                NOISE
            ================================================== */}

            <div
              className="noise-overlay"
            />


            {/* ==================================================
                ROUTE SCROLL RESET
            ================================================== */}

            <ScrollToTop />


            {/* ==================================================
                ROUTES
            ================================================== */}

            <Routes>

              {/* =================================================
                  MAIN SITE
              ================================================= */}

              <Route
                element={
                  <SiteLayout />
                }
              >

                <Route
                  path="/"
                  element={
                    <Home />
                  }
                />

                <Route
                  path="/events"
                  element={
                    <Events />
                  }
                />

                <Route
                  path="/team"
                  element={
                    <Team />
                  }
                />

                <Route
                  path="/about"
                  element={
                    <About />
                  }
                />

                <Route
                  path="/contact"
                  element={
                    <Contact />
                  }
                />

              </Route>


              {/* =================================================
                  AUTH PAGES
              ================================================= */}

              <Route
                element={
                  <AuthLayout />
                }
              >

                <Route
                  path="/login"
                  element={
                    <Login />
                  }
                />

                <Route
                  path="/signup"
                  element={
                    <Signup />
                  }
                />

              </Route>

            </Routes>


            {/* ==================================================
                TOASTER
            ================================================== */}

            <Toaster
              position="top-center"
              theme="dark"
              richColors
            />

          </SmoothScroll>

        </BrowserRouter>

      </AuthProvider>

    </div>
  );
}

export default App;