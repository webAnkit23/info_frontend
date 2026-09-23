export const EVENT_INFO = {
  name: "INFOTREK '26",
  host: "Dept. of Computer Applications",
  college: "NIT Tiruchirappalli",
  tagline: "The Grandmaster's Gambit of Technology",
  dates: "MARCH 06 – 08, 2026",
};

export const EVENTS = [
  {
    id: "Algorithmia",
    name: "The Algorithmic Gambit",
    type: "Hackathon",
    icon: "\u265F",
    span: "lg",
    duration: "1 Hours",
    prize: "\u20B91,00,000",
    blurb:
      "A high-intensity battle where algorithms become your moves and every problem is a strategic challenge. Participants must think several steps ahead, design efficient solutions, and outmaneuver the competition under time constraints. Only those who combine speed, precision, and strategy will reach the final checkmate.",

    minPlayer: 1,
    maxPlayer: 1,
    registrationOpen: true,

    fields: [
      {
        name: "college",
        label: "College / Institution",
        type: "text",
        placeholder: "Enter your college name",
        required: true,
      },
    ],
  },

  {
    id: "Complete-the-meme",
    name: "Meme Royale",
    type: "Fun Challenge",
    icon: "\u265E",
    span: "sm",
    duration: "30 min",
    prize: "\u20B940,000",
    blurb:
      "Complete iconic memes, recognize legendary moments, and outsmart your opponents to claim the meme throne.",

    minPlayer: 1,
    maxPlayer: 2,
    registrationOpen: true,

    fields: [],
  },

  {
    id: "rook-endgame",
    name: "Rook Endgame",
    type: "CTF / Security",
    icon: "\u265C",
    span: "sm",
    duration: "6 Hours",
    prize: "\u20B935,000",
    blurb:
      "Capture the flag. Defend your castle, breach theirs.",

    minPlayer: 1,
    maxPlayer: 2,
    registrationOpen: true,

    fields: [
      {
        name: "github",
        label: "GitHub Profile",
        type: "url",
        placeholder: "https://github.com/username",
        required: true,
      },
    ],
  },

  {
    id: "Crazy-Website",
    name: "The Hidden Gambit",
    type: "Mystery Challenge",
    icon: "\u265D",
    span: "sm",
    duration: "30 min",
    prize: "\u20B940,000",
    blurb:
      "A mysterious puzzle hidden within the web. Uncover anomalies, follow cryptic clues, and think beyond the visible to find the winning move.",

    minPlayer: 1,
    maxPlayer: 1,
    registrationOpen: true,

    fields: [],
  },

  {
    id: "queens-strategy",
    name: "Queen's Strategy",
    type: "Case Study & AI",
    icon: "\u265B",
    span: "lg",
    duration: "5 Hours",
    prize: "\u20B950,000",
    blurb:
      "The most powerful event on the board. Solve open-ended AI/ML problem statements with real-world datasets and defend your play before the grandmaster jury.",

    minPlayer: 2,
    maxPlayer: 4,
    registrationOpen: true,

    fields: [
      {
        name: "college",
        label: "College / Institution",
        type: "text",
        placeholder: "Enter your college name",
        required: true,
      },
      {
        name: "github",
        label: "GitHub Repository",
        type: "url",
        placeholder: "https://github.com/...",
        required: true,
      },
    ],
  },

  {
    id: "kings-keynote",
    name: "King's Keynote",
    type: "Guest Lecture",
    icon: "\u265A",
    span: "sm",
    duration: "2 Hours",
    prize: "Open Entry",
    blurb:
      "Industry grandmasters share the moves that shaped their careers.",

    minPlayer: 1,
    maxPlayer: 1,
    registrationOpen: true,

    fields: [],
  },
];

export const TEAM = [
  { name: "Aditya ", role: "Convenor", init: "AM", image : "/images/aditya.jpeg" },
  { name: "Saumya Gangwar", role: "Technical Lead", init: "SG" , image : "/images/saumya.jpeg"},
  { name: "Anshuman ", role: "Design Head", init: "RI", image : "/images/anshu.jpeg" },
  { name: "Sneha Raghavan", role: "Events Coordinator", init: "SR", image : "/images/satyam.jpeg" },
  { name: "Karthik Subramanian", role: "Sponsorship Lead", init: "KS" , image : "/images/aditya.jpeg"},
  { name: "Ananya Pillai", role: "Outreach & PR", init: "AP", image : "/images/.jpeg" },
  { name: "Vikram Nair", role: "Logistics Head", init: "VN" ,image : "/images/pussy.jpeg"},
  { name: "Meera Balaji", role: "Content Lead", init: "MB",image : "/images/laksya.jpeg" },
];

export const MANIFESTO = [
  {
    no: "01",
    title: "Every move is computation",
    body: "Infotrek treats technology the way a grandmaster treats the 64 squares — a space of infinite possibility governed by elegant rules.",
  },
  {
    no: "02",
    title: "Strategy over speed",
    body: "We reward players who think three moves ahead. The best solution is rarely the fastest — it is the most deliberate.",
  },
  {
    no: "03",
    title: "The board belongs to everyone",
    body: "From first-year pawns to final-year queens, every participant has a decisive role in the game of Infotrek '26.",
  },
];

export const STATS = [
  { value: "8+", label: "Battles" },
  { value: "500+", label: "Players" },
  { value: "₹1L+", label: "Prize Pool" },
  { value: "1", label: "Ultimate Champion" },
];