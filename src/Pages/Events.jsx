import { useEffect, useState } from "react";
import { motion } from "framer-motion";

import {
  Reveal,
  MaskedLines,
} from "@/components/Motion";

import { Badge } from "@/components/ui/badge";

import { EVENTS } from "@/lib/data";

import RegistrationModal from "@/components/RegistrationModal";

import {
  getEvents,
  getMyRegistrations,
} from "@/lib/eventApi";

import { getToken } from "@/lib/api";


// =========================================
// EVENT IMAGES
// public/images/events/
// =========================================

const EVENT_IMAGES = {

  Algorithmia:
    "algorithmia.jpg",

  "Rook's Last Stand":
    "rooks-last-stand.jpg",

  "Knight's Logic":
    "knights-logic.jpg",

  "The Meme Gambit":
    "meme-gambit.jpg",

  "Bishop's Reflex":
    "bishops-reflex.jpg",

  "The Royal Pursuit : Treasure Hunt":
    "royal-pursuit.jpg",

  "The King's Expedition":
    "kings-expedition.jpg",

  "Terminal Zero":
    "terminal-zero.jpg",

  Destinite:
    "destinite.jpg",

};


// =========================================
// MAIN EVENTS COMPONENT
// =========================================

export default function Events() {

  const [filter, setFilter] =
    useState("All");

  const [events, setEvents] =
    useState([]);

  const [
    registeredEventIds,
    setRegisteredEventIds,
  ] = useState(new Set());

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState(null);

  const [selectedEvent, setSelectedEvent] =
    useState(null);


  // =========================================
  // FETCH EVENTS
  // =========================================

  useEffect(() => {

    const fetchData = async () => {

      try {

        setLoading(true);

        setError(null);


        // =====================================
        // STEP 1
        // GET PUBLIC EVENTS
        //
        // THIS MUST ALWAYS RUN
        // EVEN IF USER IS LOGGED OUT
        // =====================================

        const eventsData =
          await getEvents();


        console.log(
          "Events from backend:",
          eventsData
        );


        // =====================================
        // STEP 2
        // MERGE BACKEND + LOCAL DATA
        // =====================================

        const mergedEvents =
          eventsData.map(
            (backendEvent) => {

              const localEvent =
                EVENTS.find(
                  (event) =>
                    event.id ===
                    backendEvent.name
                );


              return {

                ...localEvent,

                ...backendEvent,

                blurb:
                  localEvent?.blurb ||
                  backendEvent.description,

                image:
                  EVENT_IMAGES[
                    backendEvent.name
                  ],

              };

            }
          );


        console.log(
          "Merged events:",
          mergedEvents
        );


        // =====================================
        // STEP 3
        // SHOW EVENTS
        // =====================================

        setEvents(
          mergedEvents
        );


        // =====================================
        // STEP 4
        // CHECK LOGIN
        // =====================================

        const token =
          getToken();


        console.log(
          "User logged in:",
          Boolean(token)
        );


        // =====================================
        // USER IS LOGGED OUT
        // =====================================

        if (!token) {

          console.log(
            "No token found. Skipping registrations."
          );


          setRegisteredEventIds(
            new Set()
          );


          return;

        }


        // =====================================
        // USER IS LOGGED IN
        // GET REGISTRATIONS
        // =====================================

        try {

          const registrationsData =
            await getMyRegistrations();


          console.log(
            "My registrations:",
            registrationsData
          );


          // ===================================
          // CREATE REGISTERED EVENT ID SET
          // ===================================

          const registeredIds =
            new Set(

              registrationsData.map(
                (registration) => {

                  if (
                    registration.eventId
                  ) {

                    return registration
                      .eventId
                      .toString();

                  }

                  return null;

                }
              )

            );


          // Remove null values

          registeredIds.delete(
            null
          );


          setRegisteredEventIds(
            registeredIds
          );


        } catch (
          registrationError
        ) {

          // ===================================
          // IMPORTANT
          //
          // If registration request fails,
          // DO NOT REMOVE EVENTS.
          // ===================================

          console.error(
            "Registration request failed:",
            registrationError
          );


          setRegisteredEventIds(
            new Set()
          );

        }

      } catch (err) {

        // =====================================
        // ONLY EVENT API FAILURE
        // SHOULD SHOW ERROR PAGE
        // =====================================

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


  // =========================================
  // FILTER EVENTS
  // =========================================

  const list =
    filter === "All"
      ? events
      : events.filter(
          (event) =>
            event.type === filter
        );


  // =========================================
  // FORMAT DATE
  // =========================================

  const formatDate = (date) => {

    if (!date) {

      return "DATE TBA";

    }


    const eventDate =
      new Date(date);


    if (
      Number.isNaN(
        eventDate.getTime()
      )
    ) {

      return "DATE TBA";

    }


    return eventDate
      .toLocaleDateString(
        "en-IN",
        {
          day: "2-digit",
          month: "short",
          year: "numeric",
        }
      )
      .toUpperCase();

  };


  // =========================================
  // REGISTRATION SUCCESS
  // =========================================

  const handleRegistrationSuccess =
    (eventId) => {

      setRegisteredEventIds(
        (prev) => {

          const updated =
            new Set(prev);


          updated.add(
            eventId.toString()
          );


          return updated;

        }
      );


      setSelectedEvent(
        null
      );

    };


  // =========================================
  // LOADING
  // =========================================

  if (loading) {

    return (

      <div
        className="
          min-h-screen
          flex
          items-center
          justify-center
        "
      >

        <p
          className="
            font-mono
            text-sm
            text-zinc-500
          "
        >

          Loading events...

        </p>

      </div>

    );

  }


  // =========================================
  // ERROR
  // =========================================

  if (error) {

    return (

      <div
        className="
          min-h-screen
          flex
          items-center
          justify-center
        "
      >

        <p
          className="
            font-mono
            text-sm
            text-red-400
          "
        >

          {error}

        </p>

      </div>

    );

  }


  // =========================================
  // PAGE
  // =========================================

  return (

    <div
      data-testid="events-page"
      className="
        mx-auto
        max-w-7xl
        px-5
        md:px-8
        pt-32
        md:pt-40
        pb-24
      "
    >


      {/* =====================================
          HEADER
      ===================================== */}

      <p
        className="
          font-mono
          text-xs
          uppercase
          tracking-[0.3em]
          font-orbitron
          mb-4
        "
      >

        The Full Board

      </p>


      <MaskedLines
        lines={[
          "Events"
        ]}
        className="
          font-display
          font-black
          font-orbitron
          text-6xl
          md:text-8xl
          tracking-tighter
        "
      />


      <p
        className="
          mt-6
          font-mono
          text-sm
          md:text-base
          text-zinc-400
          max-w-2xl
          leading-relaxed
        "
      >

        Nine squares of competition across
        code, design, security and strategy.
        Pick your opening.

      </p>


      {/* =====================================
          FILTERS
      ===================================== */}

      <div
        className="
          mt-10
          flex
          flex-col
          gap-4
          md:flex-row
          md:items-center
          md:justify-between
        "
      >

        <div
          className="
            flex
            flex-wrap
            gap-3
          "
        >

          {[
            "All",
            "Technical",
            "Non-Technical",
          ].map(
            (option) => {

              const active =
                filter === option;


              return (

                <button
                  key={option}
                  onClick={() =>
                    setFilter(option)
                  }
                  className={`
                    relative
                    overflow-hidden
                    px-5
                    py-2.5
                    border
                    font-mono
                    text-[11px]
                    uppercase
                    tracking-[0.18em]
                    transition-all
                    duration-300

                    ${
                      active
                        ? `
                          border-cyan-glow
                          bg-cyan-glow/10
                          text-cyan-glow
                        `
                        : `
                          border-white/10
                          bg-ink-surface
                          text-zinc-500
                          hover:border-cyan-glow/40
                          hover:text-zinc-200
                        `
                    }
                  `}
                >

                  {option}


                  {active && (

                    <motion.div
                      layoutId="
                        active-event-filter
                      "
                      className="
                        absolute
                        bottom-0
                        left-0
                        right-0
                        h-[2px]
                        bg-cyan-glow
                      "
                    />

                  )}

                </button>

              );

            }
          )}

        </div>


        <span
          className="
            font-mono
            text-[10px]
            uppercase
            tracking-[0.2em]
            text-zinc-600
          "
        >

          {list.length}{" "}

          {list.length === 1
            ? "Event"
            : "Events"}

        </span>

      </div>


      {/* =====================================
          EVENT GRID
      ===================================== */}

      <div
        className="
          mt-10
          grid
          grid-cols-1
          md:grid-cols-6
          gap-5
        "
      >

        {list.map(
          (event, index) => {

            // =================================
            // DESTINITE CHECK
            // =================================

            const isDestinite =
              event.name
                ?.trim()
                .toLowerCase() ===
              "destinite";


            // =================================
            // REGISTERED CHECK
            // =================================

            const isRegistered =
              registeredEventIds.has(
                event._id?.toString()
              );


            // =================================
            // IMAGE
            // =================================

            const imageUrl =
              event.image
                ? `/images/events/${event.image}`
                : null;


            // =================================
            // DESTINITE CARD
            // =================================

            if (isDestinite) {

              return (

                <motion.div
                  key={
                    event._id ||
                    event.id ||
                    "destinite"
                  }

                  layout

                  initial={{
                    opacity: 0,
                    y: 30,
                  }}

                  animate={{
                    opacity: 1,
                    y: 0,
                  }}

                  transition={{
                    duration: 0.6,
                    delay:
                      index * 0.05,
                  }}

                  className="
                    md:col-span-6
                  "
                >

                  <div
                    className="
                      group
                      relative
                      overflow-hidden
                      border
                      border-amber-glow/40
                      bg-gradient-to-br
                      from-amber-glow/10
                      via-ink-surface
                      to-black
                      shadow-[0_0_40px_rgba(255,180,0,0.08)]
                    "
                  >

                    {/* TOP LINE */}

                    <div
                      className="
                        absolute
                        top-0
                        left-0
                        right-0
                        h-[3px]
                        bg-amber-glow
                      "
                    />


                    <div
                      className="
                        grid
                        grid-cols-1
                        md:grid-cols-2
                      "
                    >

                      {/* IMAGE */}

                      <div
                        className="
                          relative
                          min-h-[280px]
                          overflow-hidden
                          bg-zinc-950
                        "
                      >

                        {imageUrl ? (

                          <img
                            src={imageUrl}
                            alt="
                              Destinite Final Championship
                            "
                            className="
                              absolute
                              inset-0
                              h-full
                              w-full
                              object-cover
                              transition-transform
                              duration-700
                              group-hover:scale-105
                            "
                          />

                        ) : (

                          <div
                            className="
                              absolute
                              inset-0
                              flex
                              items-center
                              justify-center
                              bg-zinc-950
                            "
                          >

                            <span
                              className="
                                font-mono
                                text-xs
                                uppercase
                                tracking-[0.3em]
                                text-zinc-600
                              "
                            >

                              Final Event

                            </span>

                          </div>

                        )}


                        {/* IMAGE OVERLAY */}

                        <div
                          className="
                            absolute
                            inset-0
                            bg-gradient-to-r
                            from-black/30
                            via-transparent
                            to-black/80
                          "
                        />


                        {/* BADGE */}

                        <div
                          className="
                            absolute
                            top-5
                            left-5
                            border
                            border-amber-glow/60
                            bg-black/70
                            px-4
                            py-2
                            backdrop-blur-sm
                            font-mono
                            text-[10px]
                            uppercase
                            tracking-[0.25em]
                            text-amber-glow
                          "
                        >

                          FINAL CHAMPIONSHIP

                        </div>

                      </div>


                      {/* CONTENT */}

                      <div
                        className="
                          flex
                          flex-col
                          justify-center
                          p-8
                          md:p-12
                        "
                      >

                        {/* LABEL */}

                        <div
                          className="
                            flex
                            items-center
                            gap-3
                          "
                        >

                          <span
                            className="
                              h-2
                              w-2
                              rounded-full
                              bg-amber-glow
                              shadow-[0_0_12px_rgba(255,180,0,0.8)]
                            "
                          />

                          <span
                            className="
                              font-mono
                              text-[10px]
                              uppercase
                              tracking-[0.3em]
                              text-amber-glow
                            "
                          >

                            The Final Stage

                          </span>

                        </div>


                        {/* TITLE */}

                        <h2
                          className="
                            mt-5
                            font-orbitron
                            font-black
                            text-4xl
                            md:text-6xl
                            tracking-tight
                            text-white
                          "
                        >

                          DESTINITE

                        </h2>


                        {/* SUBTITLE */}

                        <p
                          className="
                            mt-3
                            font-mono
                            text-sm
                            uppercase
                            tracking-[0.18em]
                            text-amber-glow
                          "
                        >

                          Where the Champion is Crowned

                        </p>


                        {/* DESCRIPTION */}

                        <p
                          className="
                            mt-6
                            max-w-xl
                            font-mono
                            text-sm
                            leading-relaxed
                            text-zinc-400
                          "
                        >

                          The ultimate stage of
                          InfoTrek. Destinite is
                          the final championship
                          where the top-ranked
                          participants from the
                          other events come together
                          for the final selection
                          of the InfoTrek champion.

                        </p>


                        {/* QUALIFICATION */}

                        <div
                          className="
                            mt-7
                            grid
                            grid-cols-1
                            sm:grid-cols-2
                            gap-4
                          "
                        >

                          <div
                            className="
                              border
                              border-white/10
                              bg-black/20
                              p-4
                            "
                          >

                            <p
                              className="
                                font-mono
                                text-[9px]
                                uppercase
                                tracking-[0.2em]
                                text-zinc-600
                              "
                            >

                              Qualification

                            </p>


                            <p
                              className="
                                mt-2
                                font-mono
                                text-xs
                                uppercase
                                text-zinc-300
                              "
                            >

                              Top Ranked Participants

                            </p>

                          </div>


                          <div
                            className="
                              border
                              border-white/10
                              bg-black/20
                              p-4
                            "
                          >

                            <p
                              className="
                                font-mono
                                text-[9px]
                                uppercase
                                tracking-[0.2em]
                                text-zinc-600
                              "
                            >

                              Registration

                            </p>


                            <p
                              className="
                                mt-2
                                font-mono
                                text-xs
                                uppercase
                                text-amber-glow
                              "
                            >

                              By Qualification

                            </p>

                          </div>

                        </div>


                        {/* NO REGISTRATION */}

                        <div
                          className="
                            mt-8
                            flex
                            items-center
                            gap-3
                            border-t
                            border-amber-glow/20
                            pt-6
                          "
                        >

                          <span
                            className="
                              text-amber-glow
                              text-lg
                            "
                          >
                            ★
                          </span>


                          <span
                            className="
                              font-mono
                              text-xs
                              uppercase
                              tracking-wider
                              text-zinc-500
                            "
                          >

                            No direct registration.
                            Qualification is earned
                            through event rankings.

                          </span>

                        </div>

                      </div>

                    </div>

                  </div>

                </motion.div>

              );

            }


            // =================================
            // NORMAL EVENT CARD
            // =================================

            return (

              <motion.div
                key={
                  event._id ||
                  event.id
                }

                layout

                initial={{
                  opacity: 0,
                  y: 30,
                }}

                animate={{
                  opacity: 1,
                  y: 0,
                }}

                transition={{
                  duration: 0.5,
                  delay:
                    index * 0.05,
                }}

                className={
                  event.span === "lg"
                    ? "md:col-span-4"
                    : "md:col-span-2"
                }

                data-testid={
                  `event-card-${
                    event._id ||
                    event.id
                  }`
                }
              >

                <div
                  className="
                    group
                    relative
                    h-full
                    overflow-hidden
                    border
                    border-white/10
                    bg-ink-surface
                    card-hover
                  "
                >

                  {/* IMAGE */}

                  <div
                    className="
                      relative
                      h-[200px]
                      w-full
                      overflow-hidden
                      bg-zinc-950
                    "
                  >

                    {imageUrl ? (

                      <img
                        src={imageUrl}
                        alt={event.name}
                        className="
                          absolute
                          inset-0
                          h-72
                          w-full
                          object-cover
                          transition-transform
                          duration-700
                          group-hover:scale-105
                        "

                        onError={(e) => {

                          console.error(
                            "EVENT IMAGE FAILED:",
                            imageUrl
                          );

                          e.currentTarget.style.display =
                            "none";

                        }}
                      />

                    ) : (

                      <div
                        className="
                          absolute
                          inset-0
                          flex
                          items-center
                          justify-center
                          bg-zinc-950
                        "
                      >

                        <span
                          className="
                            font-mono
                            text-[10px]
                            uppercase
                            tracking-[0.2em]
                            text-zinc-600
                          "
                        >

                          Image TBA

                        </span>

                      </div>

                    )}


                    {/* GRADIENT */}

                    <div
                      className="
                        pointer-events-none
                        absolute
                        inset-0
                        bg-gradient-to-t
                        from-ink-surface
                        via-transparent
                        to-black/20
                      "
                    />


                    {/* HOVER GLOW */}

                    <div
                      className="
                        pointer-events-none
                        absolute
                        inset-0
                        bg-cyan-glow/10
                        opacity-0
                        group-hover:opacity-100
                        transition-opacity
                        duration-500
                      "
                    />

                  </div>


                  {/* CONTENT */}

                  <div className="p-8">

                    {/* ICON + TYPE */}

                    <div
                      className="
                        relative
                        flex
                        items-start
                        justify-between
                      "
                    >

                      <span
                        className="
                          text-5xl
                          text-amber-glow
                          group-hover:scale-110
                          group-hover:-rotate-6
                          transition-transform
                          duration-500
                        "
                      >

                        {event.icon}

                      </span>


                      <Badge
                        className={`
                          border
                          font-mono
                          text-[10px]
                          uppercase
                          tracking-wider

                          ${
                            event.type ===
                            "Technical"

                              ? `
                                bg-cyan-glow/10
                                text-cyan-glow
                                border-cyan-glow/30
                              `

                              : `
                                bg-amber-glow/10
                                text-amber-glow
                                border-amber-glow/30
                              `
                          }
                        `}
                      >

                        {event.type ||
                          "Event"}

                      </Badge>

                    </div>


                    {/* NAME */}

                    <h3
                      className="
                        relative
                        mt-6
                        font-display
                        font-bold
                        text-2xl
                        md:text-3xl
                      "
                    >

                      {event.name}

                    </h3>


                    {/* DESCRIPTION */}

                    <p
                      className="
                        relative
                        mt-3
                        font-mono
                        text-sm
                        text-zinc-400
                        leading-relaxed
                      "
                    >

                      {event.blurb}

                    </p>


                    {/* DETAILS */}

                    <div
                      className="
                        relative
                        mt-7
                        border-t
                        border-white/10
                        pt-5
                        space-y-3
                      "
                    >

                      {/* DATE */}

                      <div
                        className="
                          flex
                          items-center
                          gap-3
                        "
                      >

                        <span
                          className="
                            text-cyan-glow
                            text-sm
                          "
                        >

                          {"\u{1F4C5}"}

                        </span>


                        <span
                          className="
                            font-mono
                            text-xs
                            text-zinc-400
                            uppercase
                            tracking-wide
                          "
                        >

                          {formatDate(
                            event.date
                          )}

                        </span>

                      </div>


                      {/* TIME */}

                      <div
                        className="
                          flex
                          items-center
                          gap-3
                        "
                      >

                        <span
                          className="
                            text-cyan-glow
                            text-sm
                          "
                        >

                          {"\u23F1"}

                        </span>


                        <span
                          className="
                            font-mono
                            text-xs
                            text-zinc-400
                          "
                        >

                          {event.startTime &&
                          event.endTime

                            ? `${event.startTime} — ${event.endTime}`

                            : event.duration ||
                              "Time TBA"}

                        </span>

                      </div>


                      {/* VENUE */}

                      <div
                        className="
                          flex
                          items-center
                          gap-3
                        "
                      >

                        <span
                          className="
                            text-cyan-glow
                            text-sm
                          "
                        >

                          {"\u{1F4CD}"}

                        </span>


                        <span
                          className="
                            font-mono
                            text-xs
                            text-zinc-400
                            uppercase
                            tracking-wide
                          "
                        >

                          {event.venue ||
                            "Venue TBA"}

                        </span>

                      </div>

                    </div>


                    {/* REGISTER */}

                    <div
                      className="
                        relative
                        mt-7
                        flex
                        items-center
                        justify-between
                      "
                    >

                      {/* PLAYER COUNT */}

                      <span
                        className="
                          font-mono
                          text-[10px]
                          uppercase
                          tracking-wider
                          text-zinc-600
                        "
                      >

                        {event.minPlayer ===
                        event.maxPlayer

                          ? `${event.minPlayer} Player`

                          : `${event.minPlayer}–${event.maxPlayer} Players`}

                      </span>


                      {/* REGISTER BUTTON */}

                      <button
                        disabled={
                          !event.registrationOpen ||
                          isRegistered
                        }

                        onClick={() =>
                          setSelectedEvent(
                            event
                          )
                        }

                        className="
                          font-mono
                          text-xs
                          uppercase
                          tracking-wider
                          text-amber-glow
                          hover:text-white
                          transition-colors
                          disabled:text-zinc-600
                          disabled:cursor-not-allowed
                        "
                      >

                        {"\u2691"}{" "}

                        {isRegistered

                          ? "Registered"

                          : event.registrationOpen

                            ? "Register"

                            : "Registration Closed"}

                      </button>

                    </div>

                  </div>

                </div>

              </motion.div>

            );

          }
        )}

      </div>


      {/* =====================================
          NO EVENTS
      ===================================== */}

      {list.length === 0 && (

        <Reveal
          className="
            mt-16
            text-center
            font-mono
            text-sm
            text-zinc-500
          "
        >

          No events found
          for this category.

        </Reveal>

      )}


      {/* =====================================
          REGISTRATION MODAL
      ===================================== */}

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