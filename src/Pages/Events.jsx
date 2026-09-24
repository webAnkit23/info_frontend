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

// =========================================
// EVENT IMAGES
// Actual location:
// public/images/events/
// =========================================

const EVENT_IMAGES = {
  Algorithmia: "algorithmia.jpg",

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
};


export default function Events() {

  const [filter, setFilter] = useState("All");

  const [events, setEvents] = useState([]);

  const [registeredEventIds, setRegisteredEventIds] =
    useState(new Set());

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState(null);

  const [selectedEvent, setSelectedEvent] =
    useState(null);


  // =========================================
  // FETCH EVENTS
  // =========================================

  useEffect(() => {

    const fetchData = async () => {

      try {

        setLoading(true);

        const [
          eventsData,
          registrationsData,
        ] = await Promise.all([
          getEvents(),
          getMyRegistrations(),
        ]);


        console.log(
          "Events from backend:",
          eventsData
        );

        console.log(
          "My registrations:",
          registrationsData
        );


        // =========================================
        // MERGE BACKEND + LOCAL DATA
        // =========================================

        const mergedEvents =
          eventsData.map((backendEvent) => {

            const localEvent =
              EVENTS.find(
                (event) =>
                  event.id === backendEvent.name
              );


            return {

              ...localEvent,

              ...backendEvent,

              blurb:
                localEvent?.blurb ||
                backendEvent.description,

              // Attach image filename
              image:
                EVENT_IMAGES[
                  backendEvent.name
                ],

            };

          });


        console.log(
          "Merged events:",
          mergedEvents
        );


        setEvents(mergedEvents);


        // =========================================
        // REGISTERED EVENT IDS
        // =========================================

        const registeredIds =
          new Set(

            registrationsData.map(
              (registration) =>
                registration.eventId.toString()
            )

          );


        setRegisteredEventIds(
          registeredIds
        );


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


      setSelectedEvent(null);

    };


  // =========================================
  // LOADING
  // =========================================

  if (loading) {

    return (

      <div className="
        min-h-screen
        flex
        items-center
        justify-center
      ">

        <p className="
          font-mono
          text-sm
          text-zinc-500
        ">

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

      <div className="
        min-h-screen
        flex
        items-center
        justify-center
      ">

        <p className="
          font-mono
          text-sm
          text-red-400
        ">

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


      {/* =========================================
          HEADER
      ========================================= */}

      <p className="
        font-mono
        text-xs
        uppercase
        tracking-[0.3em]
        font-orbitron
        mb-4
      ">

        The Full Board

      </p>


      <MaskedLines
        lines={["Events"]}
        className="
          font-display
          font-black
          font-orbitron
          text-6xl
          md:text-8xl
          tracking-tighter
        "
      />


      <p className="
        mt-6
        font-mono
        text-sm
        md:text-base
        text-zinc-400
        max-w-2xl
        leading-relaxed
      ">

        Nine squares of competition across
        code, design, security and strategy.
        Pick your opening.

      </p>


      {/* =========================================
          FILTERS
      ========================================= */}

      <div className="
        mt-10
        flex
        flex-col
        gap-4
        md:flex-row
        md:items-center
        md:justify-between
      ">


        {/* FILTER BUTTONS */}

        <div className="
          flex
          flex-wrap
          gap-3
        ">

          {[
            "All",
            "Technical",
            "Non-Technical",
          ].map((option) => {

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
                    layoutId="active-event-filter"
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

          })}

        </div>


        {/* EVENT COUNT */}

        <span className="
          font-mono
          text-[10px]
          uppercase
          tracking-[0.2em]
          text-zinc-600
        ">

          {list.length}{" "}

          {list.length === 1
            ? "Event"
            : "Events"}

        </span>

      </div>


      {/* =========================================
          EVENT GRID
      ========================================= */}

      <div className="
        mt-10
        grid
        grid-cols-1
        md:grid-cols-6
        gap-5
      ">


        {list.map((event, index) => {

          const isRegistered =
            registeredEventIds.has(
              event._id?.toString()
            );


          // =========================================
          // IMAGE URL
          // =========================================

          const imageUrl =
            event.image
              ? `/images/events/${event.image}`
              : null;


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


              {/* =================================
                  EVENT CARD
              ================================= */}

              <div className="
                group
                relative
                h-full
                overflow-hidden
                border
                border-white/10
                bg-ink-surface
                card-hover
              ">


                {/* =================================
                    EVENT IMAGE
                ================================= */}

                <div className="
                  relative
                  h-[200px]
                  w-full
                  overflow-hidden
                  bg-zinc-950
                ">

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

                    <div className="
                      absolute
                      inset-0
                      flex
                      items-center
                      justify-center
                      bg-zinc-950
                    ">

                      <span className="
                        font-mono
                        text-[10px]
                        uppercase
                        tracking-[0.2em]
                        text-zinc-600
                      ">

                        Image TBA

                      </span>

                    </div>

                  )}


                  {/* IMAGE GRADIENT */}

                  <div className="
                    pointer-events-none
                    absolute
                    inset-0
                    bg-gradient-to-t
                    from-ink-surface
                    via-transparent
                    to-black/20
                  " />


                  {/* HOVER GLOW */}

                  <div className="
                    pointer-events-none
                    absolute
                    inset-0
                    bg-cyan-glow/10
                    opacity-0
                    group-hover:opacity-100
                    transition-opacity
                    duration-500
                  " />

                </div>


                {/* =================================
                    CARD CONTENT
                ================================= */}

                <div className="p-8">


                  {/* =================================
                      ICON + TYPE
                  ================================= */}

                  <div className="
                    relative
                    flex
                    items-start
                    justify-between
                  ">


                    {/* EVENT ICON */}

                    <span className="
                      text-5xl
                      text-amber-glow
                      group-hover:scale-110
                      group-hover:-rotate-6
                      transition-transform
                      duration-500
                    ">

                      {event.icon}

                    </span>


                    {/* EVENT TYPE */}

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


                  {/* =================================
                      EVENT NAME
                  ================================= */}

                  <h3 className="
                    relative
                    mt-6
                    font-display
                    font-bold
                    text-2xl
                    md:text-3xl
                  ">

                    {event.name}

                  </h3>


                  {/* =================================
                      DESCRIPTION
                  ================================= */}

                  <p className="
                    relative
                    mt-3
                    font-mono
                    text-sm
                    text-zinc-400
                    leading-relaxed
                  ">

                    {event.blurb}

                  </p>


                  {/* =================================
                      EVENT DETAILS
                  ================================= */}

                  <div className="
                    relative
                    mt-7
                    border-t
                    border-white/10
                    pt-5
                    space-y-3
                  ">


                    {/* DATE */}

                    <div className="
                      flex
                      items-center
                      gap-3
                    ">

                      <span className="
                        text-cyan-glow
                        text-sm
                      ">

                        {"\u{1F4C5}"}

                      </span>

                      <span className="
                        font-mono
                        text-xs
                        text-zinc-400
                        uppercase
                        tracking-wide
                      ">

                        {formatDate(
                          event.date
                        )}

                      </span>

                    </div>


                    {/* TIME */}

                    <div className="
                      flex
                      items-center
                      gap-3
                    ">

                      <span className="
                        text-cyan-glow
                        text-sm
                      ">

                        {"\u23F1"}

                      </span>

                      <span className="
                        font-mono
                        text-xs
                        text-zinc-400
                      ">

                        {event.startTime &&
                        event.endTime

                          ? `${event.startTime} — ${event.endTime}`

                          : event.duration ||
                            "Time TBA"}

                      </span>

                    </div>


                    {/* VENUE */}

                    <div className="
                      flex
                      items-center
                      gap-3
                    ">

                      <span className="
                        text-cyan-glow
                        text-sm
                      ">

                        {"\u{1F4CD}"}

                      </span>

                      <span className="
                        font-mono
                        text-xs
                        text-zinc-400
                        uppercase
                        tracking-wide
                      ">

                        {event.venue ||
                          "Venue TBA"}

                      </span>

                    </div>

                  </div>


                  {/* =================================
                      REGISTER
                  ================================= */}

                  <div className="
                    relative
                    mt-7
                    flex
                    items-center
                    justify-between
                  ">


                    {/* PLAYER COUNT */}

                    <span className="
                      font-mono
                      text-[10px]
                      uppercase
                      tracking-wider
                      text-zinc-600
                    ">

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

        })}

      </div>


      {/* =========================================
          NO EVENTS
      ========================================= */}

      {list.length === 0 && (

        <Reveal className="
          mt-16
          text-center
          font-mono
          text-sm
          text-zinc-500
        ">

          No events found
          for this category.

        </Reveal>

      )}


      {/* =========================================
          REGISTRATION MODAL
      ========================================= */}

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