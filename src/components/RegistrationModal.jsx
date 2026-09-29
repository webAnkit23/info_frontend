
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


  // =====================================================
  // INITIALIZE TEAM
  // =====================================================

  useEffect(() => {
    if (!event) return;

    // Logged-in user is always Player 1 / Team Leader
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


  // =====================================================
  // ADD PLAYER
  // =====================================================

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


  // =====================================================
  // REMOVE PLAYER
  // =====================================================

  const removePlayer = (index) => {
    // Player 1 / leader cannot be removed
    if (index === 0) {
      return;
    }

    // Cannot go below minimum team size
    if (players.length <= event.minPlayer) {
      return;
    }

    setPlayers((prev) =>
      prev.filter((_, i) => i !== index)
    );
  };


  // =====================================================
  // ROLL NUMBER LOOKUP
  // =====================================================

  const handleUserIdChange = async (index, value) => {

    // Only allow numbers
    const rollNumber = value.replace(/\D/g, "");

    // Roll numbers can be longer than 3 digits
    const trimmedRollNumber = rollNumber.slice(0, 20);


    // Update input and clear old data
    setPlayers((prev) =>
      prev.map((player, i) =>
        i === index
          ? {
              ...player,
              userId: trimmedRollNumber,
              name: "",
              email: "",
              lookupError: "",
            }
          : player
      )
    );


    // Don't search until at least 5 digits
    if (!/^\d{5,20}$/.test(trimmedRollNumber)) {
      return;
    }


    // =====================================================
    // PREVENT LEADER FROM ADDING THEMSELVES
    // =====================================================

    if (
      user?.userId &&
      trimmedRollNumber === user.userId.toString()
    ) {
      setPlayers((prev) =>
        prev.map((player, i) =>
          i === index
            ? {
                ...player,
                name: "",
                email: "",
                lookupError:
                  "You are already the team leader.",
              }
            : player
        )
      );

      return;
    }


    // =====================================================
    // CHECK DUPLICATE PLAYER
    // =====================================================

    const alreadyAdded = players.some(
      (player, i) =>
        i !== index &&
        player.userId === trimmedRollNumber
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
                  "This player is already added.",
              }
            : player
        )
      );

      return;
    }


    // =====================================================
    // FIND USER
    // =====================================================

    try {
      setLookupLoading((prev) => ({
        ...prev,
        [index]: true,
      }));

      const foundUser = await findUserByUserId(
        trimmedRollNumber
      );


      // Fill user details automatically
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
                  "Roll number not found.",
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


  // =====================================================
  // SUBMIT REGISTRATION
  // =====================================================

  const handleSubmit = async (e) => {
    e.preventDefault();


    // =====================================================
    // TEAM SIZE
    // =====================================================

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


    // =====================================================
    // ADDITIONAL PLAYERS
    // =====================================================

    const additionalPlayers = players.slice(1);


    // Every additional player must have
    // a valid roll number and name
    const invalidPlayer = additionalPlayers.find(
      (player) =>
        !player.userId ||
        !/^\d{5,20}$/.test(player.userId) ||
        !player.name
    );


    if (invalidPlayer) {
      alert(
        "Please enter a valid roll number for every player."
      );
      return;
    }


    // =====================================================
    // CHECK DUPLICATES
    // =====================================================

    const userIds = [
      user?.userId,
      ...additionalPlayers.map(
        (player) => player.userId
      ),
    ].filter(Boolean);


    const uniqueUserIds = new Set(userIds);

    if (
      uniqueUserIds.size !==
      userIds.length
    ) {
      alert(
        "The same player cannot be added more than once."
      );
      return;
    }


    // =====================================================
    // SUBMIT REGISTRATION
    // =====================================================

    try {
      setSubmitting(true);


      /*
        Player 1 is NOT sent.

        Backend gets Player 1 from:

            req.user.id

        Example:

        Leader:
        205125015

        Additional players:
        205125016
        205125017

        Request:

        {
          eventId: "...",
          players: [
            "205125016",
            "205125017"
          ]
        }
      */

      const data = {
        eventId: event._id,

        players: additionalPlayers.map(
          (player) => player.userId
        ),
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


      alert("Registration successful!");


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


  // =====================================================
  // UI
  // =====================================================

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
                {event.minPlayer === event.maxPlayer
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
              PLAYERS
          ================================== */}

          <form onSubmit={handleSubmit}>

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

                      {/* ROLL NUMBER */}

                      <div>

                        <label className="block mb-2 font-mono text-[10px] uppercase text-zinc-500">
                          Roll Number
                        </label>


                        <input
                          type="text"
                          inputMode="numeric"
                          required={index !== 0}
                          disabled={index === 0}
                          value={player.userId}

                          onChange={(e) =>
                            handleUserIdChange(
                              index,
                              e.target.value
                            )
                          }

                          maxLength={20}

                          placeholder={
                            index === 0
                              ? "Your Roll Number"
                              : "e.g. 205125015"
                          }

                          className="w-full border border-white/10 bg-black/30 px-3 py-3 font-mono text-sm outline-none focus:border-cyan-glow/50 disabled:opacity-50"
                        />


                        {index === 0 && (
                          <p className="mt-2 font-mono text-[10px] text-amber-glow">
                            Automatically filled from your account
                          </p>
                        )}


                        {index !== 0 &&
                          lookupLoading[index] && (
                            <p className="mt-2 font-mono text-[10px] text-cyan-glow">
                              Finding player...
                            </p>
                          )}


                        {player.lookupError && (
                          <p className="mt-2 font-mono text-[10px] text-red-400">
                            {player.lookupError}
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
                              ? "Your Name"
                              : "Enter Roll Number first"
                          }

                          className="w-full border border-white/10 bg-black/30 px-3 py-3 font-mono text-sm outline-none focus:border-cyan-glow/50 disabled:opacity-70"
                        />


                        {index === 0 && (
                          <p className="mt-2 font-mono text-[10px] text-zinc-500">
                            Your name cannot be changed here
                          </p>
                        )}

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
                TEAM SIZE
            ================================== */}

            <div className="mt-5 flex justify-between font-mono text-xs text-zinc-500">

              <span>
                Team size
              </span>

              <span>
                {players.length} / {event.maxPlayer}
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


