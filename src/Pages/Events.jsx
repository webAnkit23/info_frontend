import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Reveal, MaskedLines } from "@/components/Motion";
import { Badge } from "@/components/ui/badge";
import { EVENTS } from "@/lib/data";
import RegistrationModal from "@/components/RegistrationModal";
import {
  getEvents,
  getMyRegistrations,
} from "@/lib/eventApi";

export default function Events() {
  const [filter, setFilter] = useState("All");
  const [events, setEvents] = useState([]);
  const [registeredEventIds, setRegisteredEventIds] = useState(
    new Set()
  );

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedEvent, setSelectedEvent] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Fetch events and user's registrations
        const [eventsData, registrationsData] =
          await Promise.all([
            getEvents(),
            getMyRegistrations(),
          ]);

        console.log("Events from backend:", eventsData);
        console.log(
          "My registrations:",
          registrationsData
        );

        // -----------------------------------
        // Merge backend events with local data
        // -----------------------------------

        const mergedEvents = eventsData.map(
          (backendEvent) => {
            const localEvent = EVENTS.find(
              (event) =>
                event.id === backendEvent.name
            );

            return {
              ...localEvent,
              ...backendEvent,

              blurb:
                localEvent?.blurb ||
                backendEvent.description,
            };
          }
        );

        setEvents(mergedEvents);

        // -----------------------------------
        // Create Set of registered event IDs
        // -----------------------------------

        const registeredIds = new Set(
          registrationsData.map(
            (registration) =>
              registration.eventId.toString()
          )
        );

        setRegisteredEventIds(registeredIds);

      } catch (err) {
        console.error(
          "Failed to fetch events:",
          err
        );

        setError(
          err.response?.data?.message ||
          "Failed to load events."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const list =
    filter === "All"
      ? events
      : events.filter(
          (e) => e.type === filter
        );

  // -----------------------------------
  // Mark event as registered
  // -----------------------------------

  const handleRegistrationSuccess = (eventId) => {
    setRegisteredEventIds((prev) => {
      const updated = new Set(prev);

      updated.add(eventId.toString());

      return updated;
    });

    setSelectedEvent(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="font-mono text-sm text-zinc-500">
          Loading events...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="font-mono text-sm text-red-400">
          {error}
        </p>
      </div>
    );
  }

  return (
    <div
      data-testid="events-page"
      className="mx-auto max-w-7xl px-5 md:px-8 pt-32 md:pt-40 pb-24"
    >
      <p className="font-mono text-xs uppercase tracking-[0.3em] font-orbitron mb-4">
        The Full Board
      </p>

      <MaskedLines
        lines={["Events"]}
        className="font-display font-black font-orbitron text-6xl md:text-8xl tracking-tighter"
      />

      <p className="mt-6 font-mono text-sm md:text-base text-zinc-400 max-w-2xl leading-relaxed">
        Nine squares of competition across code, design, security and strategy.
        Pick your opening.
      </p>

      {/* Bento grid */}

      <div className="mt-10 grid grid-cols-1 md:grid-cols-6 gap-5">
        {list.map((e, i) => {
          const isRegistered = registeredEventIds.has(
            e._id?.toString()
          );

          return (
            <motion.div
              key={e._id || e.id}
              layout
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.5,
                delay: i * 0.05,
              }}
              className={
                e.span === "lg"
                  ? "md:col-span-4"
                  : "md:col-span-2"
              }
              data-testid={`event-card-${
                e._id || e.id
              }`}
            >
              <div className="group relative h-full overflow-hidden border border-white/10 bg-ink-surface p-8 card-hover">

                <div className="flex items-start justify-between">
                  <span className="text-6xl text-amber-glow group-hover:scale-110 group-hover:-rotate-6 transition-transform duration-500">
                    {e.icon}
                  </span>

                  <Badge className="bg-cyan-glow/10 text-cyan-glow border border-cyan-glow/30 font-mono text-[10px] uppercase tracking-wider hover:bg-cyan-glow/10">
                    {e.type}
                  </Badge>
                </div>

                <h3 className="mt-6 font-display font-bold text-2xl md:text-3xl">
                  {e.name}
                </h3>

                <p className="mt-3 font-mono text-sm text-zinc-400 leading-relaxed">
                  {e.blurb}
                </p>

                <div className="mt-6 flex items-center gap-6 font-mono text-xs">

                  <span className="text-zinc-500">
                    {"\u23F1"} {e.duration}
                  </span>

                  <button
                    disabled={
                      !e.registrationOpen ||
                      isRegistered
                    }
                    onClick={() =>
                      setSelectedEvent(e)
                    }
                    className="text-amber-glow hover:text-white transition-colors disabled:text-zinc-600 disabled:cursor-not-allowed"
                  >
                    {"\u2691"}{" "}

                    {isRegistered
                      ? "Registered"
                      : e.registrationOpen
                      ? "Register"
                      : "Registration Closed"}
                  </button>

                </div>

              </div>
            </motion.div>
          );
        })}
      </div>

      {list.length === 0 && (
        <Reveal className="mt-16 text-center font-mono text-sm text-zinc-500">
          No events on this file yet.
        </Reveal>
      )}

      {selectedEvent && (
        <RegistrationModal
          event={selectedEvent}
          onClose={() =>
            setSelectedEvent(null)
          }
          onRegistrationSuccess={
            handleRegistrationSuccess
          }
        />
      )}
    </div>
  );
}