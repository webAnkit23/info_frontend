import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

import {
  registerForEvent,
  findUserByUserId,
} from "@/lib/registrationApi";

import { formatApiErrorDetail } from "@/lib/api";

export default function RegistrationModal({
  event,
  user,
  onClose,
  onRegistrationSuccess,
}) {
  const [players, setPlayers] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [lookupLoading, setLookupLoading] = useState({});

  // ==========================================
  // INITIALIZE TEAM
  // ==========================================

  useEffect(() => {
    if (!event) return;

    // Logged-in user is automatically the leader.
    // We don't require the frontend to know the
    // leader's public 3-digit userId.
    const initialPlayers = [
      {
        userId: user?.userId || "",
        name: user?.name || "",
        email: user?.email || "",
        isLeader: true,
        lookupError: "",
      },
    ];

    setPlayers(initialPlayers);
  }, [event, user]);

  if (!event) return null;

  // ==========================================
  // ADD PLAYER
  // ==========================================

  const addPlayer = () => {
    if (players.length >= event.maxPlayer) {
      return;
    }

    setPlayers((prev) => [
      ...prev,
      {
        userId: "",
        name: "",
        email: "",
        isLeader: false,
        lookupError: "",
      },
    ]);
  };

  // ==========================================
  // REMOVE PLAYER
  // ==========================================

  const removePlayer = (index) => {
    // Leader cannot be removed
    if (index === 0) return;

    // Cannot go below minimum team size
    if (players.length <= event.minPlayer) {
      return;
    }

    setPlayers((prev) =>
      prev.filter((_, i) => i !== index)
    );
  };

  // ==========================================
  // USER ID LOOKUP
  // ==========================================

  const handleUserIdChange = async (index, value) => {
    // Only allow numbers
    const userId = value.replace(/\D/g, "");

    // Maximum 3 digits
    const trimmedUserId = userId.slice(0, 3);

    // Clear old user information whenever ID changes
    setPlayers((prev) =>
      prev.map((player, i) =>
        i === index
          ? {
              ...player,
              userId: trimmedUserId,
              name: "",
              email: "",
              lookupError: "",
            }
          : player
      )
    );

    // Don't make API request until exactly 3 digits
    if (!/^\d{3}$/.test(trimmedUserId)) {
      return;
    }

    // ==========================================
    // CHECK IF USER IS ADDING THEMSELVES
    // ==========================================

    // Only perform this check if the frontend
    // actually has the leader's public userId.
    if (
      user?.userId &&
      trimmedUserId === user.userId.toString()
    ) {
      setPlayers((prev) =>
        prev.map((player, i) =>
          i === index
            ? {
                ...player,
                name: "",
                email: "",
                lookupError:
                  "You cannot add yourself as a player.",
              }
            : player
        )
      );

      return;
    }

    // ==========================================
    // CHECK DUPLICATE PLAYER
    // ==========================================

    const alreadyAdded = players.some(
      (player, i) =>
        i !== index &&
        player.userId === trimmedUserId
    );

    if (alreadyAdded) {
      setPlayers((prev) =>
        prev.map((player, i) =>
          i === index
            ? {
                ...player,
                name: "",
                email: "",
                lookupError:
                  "This user is already added.",
              }
            : player
        )
      );

      return;
    }

    // ==========================================
    // FIND USER
    // ==========================================

    try {
      setLookupLoading((prev) => ({
        ...prev,
        [index]: true,
      }));

      const foundUser = await findUserByUserId(
        trimmedUserId
      );

      setPlayers((prev) =>
        prev.map((player, i) =>
          i === index
            ? {
                ...player,
                userId: foundUser.userId,
                name: foundUser.name,
                email: foundUser.email,
                lookupError: "",
              }
            : player
        )
      );
    } catch (error) {
      console.error(
        "User lookup failed:",
        error
      );

      setPlayers((prev) =>
        prev.map((player, i) =>
          i === index
            ? {
                ...player,
                name: "",
                email: "",
                lookupError:
                  error.response?.data?.message ||
                  "User not found.",
              }
            : player
        )
      );
    } finally {
      setLookupLoading((prev) => ({
        ...prev,
        [index]: false,
      }));
    }
  };

  // ==========================================
  // SUBMIT REGISTRATION
  // ==========================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    // ==========================================
    // TEAM SIZE VALIDATION
    // ==========================================

    if (players.length < event.minPlayer) {
      alert(
        `Minimum ${event.minPlayer} players required.`
      );
      return;
    }

    if (players.length > event.maxPlayer) {
      alert(
        `Maximum ${event.maxPlayer} players allowed.`
      );
      return;
    }

    // ==========================================
    // CHECK ADDITIONAL PLAYERS ONLY
    // ==========================================

    /*
      IMPORTANT:

      Player 1 = logged-in user / team leader.

      The backend gets the leader from:

          req.user.id

      Therefore we should NOT require the
      frontend to have the leader's public
      3-digit User ID.

      Only players after index 0 need validation.
    */

    const additionalPlayers = players.slice(1);

    const invalidPlayer = additionalPlayers.find(
      (player) =>
        !player.userId ||
        !/^\d{3}$/.test(player.userId) ||
        !player.name
    );

    if (invalidPlayer) {
      alert(
        "Please enter a valid User ID for every player."
      );
      return;
    }

    // ==========================================
    // CHECK FOR DUPLICATES
    // ==========================================

    const userIds = additionalPlayers.map(
      (player) => player.userId
    );

    const uniqueUserIds = new Set(userIds);

    if (
      uniqueUserIds.size !==
      userIds.length
    ) {
      alert(
        "The same user cannot be added more than once."
      );
      return;
    }

    // ==========================================
    // SUBMIT
    // ==========================================

    try {
      setSubmitting(true);

      /*
        The logged-in user is NOT included here.

        Backend already knows the leader from:

            req.user.id

        Example:

        Logged-in user = leader
        Additional players = 531, 724

        Request:

        {
          eventId: "...",
          players: ["531", "724"]
        }

        For a single-player event:

        {
          eventId: "...",
          players: []
        }
      */

      const data = {
        eventId: event._id,

        players: players
          .slice(1)
          .map((player) => player.userId),
      };

      console.log(
        "Sending registration:",
        data
      );

      const response =
        await registerForEvent(data);

      console.log(
        "Registration successful:",
        response
      );

      alert(
        "Registration successful!"
      );

      // ==========================================
      // UPDATE EVENTS PAGE
      // ==========================================

      if (onRegistrationSuccess) {
        onRegistrationSuccess(event._id);
      } else {
        onClose();
      }
    } catch (error) {
      console.error(
        "Registration failed:",
        error
      );

      const message =
        formatApiErrorDetail(
          error.response?.data?.detail ||
            error.response?.data?.message ||
            error.message
        );

      alert(message);
    } finally {
      setSubmitting(false);
    }
  };

  // ==========================================
  // UI
  // ==========================================

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-md p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div
          onClick={(e) =>
            e.stopPropagation()
          }
          initial={{
            opacity: 0,
            scale: 0.95,
            y: 30,
          }}
          animate={{
            opacity: 1,
            scale: 1,
            y: 0,
          }}
          exit={{
            opacity: 0,
            scale: 0.95,
            y: 30,
          }}
          className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto border border-white/10 bg-ink-surface p-6 md:p-8"
        >

          {/* ==================================
              HEADER
          ================================== */}

          <div className="flex justify-between items-start mb-8">
            <div>
              <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-cyan-glow">
                Event Registration
              </p>

              <h2 className="mt-2 font-orbitron font-black text-3xl">
                {event.name}
              </h2>

              <p className="mt-2 font-mono text-xs text-zinc-500">
                {event.minPlayer ===
                event.maxPlayer
                  ? `${event.minPlayer} players required`
                  : `${event.minPlayer}–${event.maxPlayer} players allowed`}
              </p>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="text-2xl text-zinc-500 hover:text-white"
            >
              ×
            </button>
          </div>

          {/* ==================================
              FORM
          ================================== */}

          <form onSubmit={handleSubmit}>

            {/* ==================================
                PLAYERS
            ================================== */}

            <div className="space-y-5">

              {players.map(
                (player, index) => (
                  <div
                    key={index}
                    className="border border-white/10 bg-black/20 p-5"
                  >

                    {/* PLAYER HEADER */}

                    <div className="flex justify-between items-center mb-5">
                      <div>
                        <h3 className="font-orbitron font-bold">
                          Player {index + 1}
                        </h3>

                        {index === 0 && (
                          <span className="font-mono text-[10px] uppercase tracking-wider text-amber-glow">
                            Team Leader
                          </span>
                        )}
                      </div>

                      {index !== 0 &&
                        players.length >
                          event.minPlayer && (
                          <button
                            type="button"
                            onClick={() =>
                              removePlayer(index)
                            }
                            className="font-mono text-xs text-red-400 hover:text-red-300"
                          >
                            Remove
                          </button>
                        )}
                    </div>

                    {/* PLAYER DETAILS */}

                    <div className="grid md:grid-cols-2 gap-4">

                      {/* USER ID */}

                      <div>
                        <label className="block mb-2 font-mono text-[10px] uppercase text-zinc-500">
                          User ID
                        </label>

                        <input
                          type="text"
                          required={index !== 0}
                          disabled={index === 0}
                          value={player.userId}
                          onChange={(e) =>
                            handleUserIdChange(
                              index,
                              e.target.value
                            )
                          }
                          maxLength={3}
                          placeholder={
                            index === 0
                              ? "Logged-in user"
                              : "e.g. 247"
                          }
                          className="w-full border border-white/10 bg-black/30 px-3 py-3 font-mono text-sm outline-none focus:border-cyan-glow/50 disabled:opacity-50"
                        />

                        {index !== 0 &&
                          lookupLoading[
                            index
                          ] && (
                            <p className="mt-2 font-mono text-[10px] text-cyan-glow">
                              Finding user...
                            </p>
                          )}

                        {player.lookupError && (
                          <p className="mt-2 font-mono text-[10px] text-red-400">
                            {
                              player.lookupError
                            }
                          </p>
                        )}
                      </div>

                      {/* NAME */}

                      <div>
                        <label className="block mb-2 font-mono text-[10px] uppercase text-zinc-500">
                          Name
                        </label>

                        <input
                          type="text"
                          disabled
                          value={player.name}
                          placeholder={
                            index === 0
                              ? "Logged-in user"
                              : "Enter User ID first"
                          }
                          className="w-full border border-white/10 bg-black/30 px-3 py-3 font-mono text-sm outline-none focus:border-cyan-glow/50 disabled:opacity-70"
                        />
                      </div>

                    </div>
                  </div>
                )
              )}

            </div>

            {/* ==================================
                ADD PLAYER
            ================================== */}

            {players.length <
              event.maxPlayer && (
              <button
                type="button"
                onClick={addPlayer}
                className="mt-5 w-full border border-dashed border-white/20 py-3 font-mono text-xs text-zinc-400 hover:border-cyan-glow/50 hover:text-cyan-glow transition"
              >
                + ADD PLAYER
              </button>
            )}

            {/* ==================================
                PLAYER COUNT
            ================================== */}

            <div className="mt-5 flex justify-between font-mono text-xs text-zinc-500">
              <span>
                Team size
              </span>

              <span>
                {players.length} /{" "}
                {event.maxPlayer}
              </span>
            </div>

            {/* ==================================
                SUBMIT
            ================================== */}

            <button
              type="submit"
              disabled={submitting}
              className="mt-8 w-full bg-amber-glow py-4 font-orbitron font-bold text-black hover:brightness-110 transition disabled:opacity-50"
            >
              {submitting
                ? "REGISTERING..."
                : "CONFIRM REGISTRATION"}
            </button>

          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}