export const EVENT_VISUALS = {
  hackathon: {
    classKey: "hackathon",
    category: "MAIN EVENTS",
    prize: "Rs 40,000",
    image: "/images/hackathon.png",
    description:
      "Innovate for a smarter campus. Build impactful solutions using web and Python development.",
  },
  business: {
    classKey: "business",
    category: "MAIN EVENTS",
    prize: "Rs 40,000",
    image: "/images/bussinessPlan.jpg",
    description: "Pitch your startup idea.",
  },
  debugging: {
    classKey: "debug",
    category: "TECHNICAL EVENTS",
    prize: "Rs 10,000",
    image: "/images/codeDebug.png",
    description:
      "Test your logic and syntax knowledge under time pressure across multiple languages.",
  },
  typing: {
    classKey: "typing",
    category: "TECHNICAL EVENTS",
    prize: "Rs 10,000",
    image: "/images/typingMaster.png",
    description:
      "Compete to prove your speed and accuracy and claim the typing title.",
  },
  bgmi: {
    classKey: "bgmi",
    category: "E-SPORTS",
    prize: "Rs 15,000",
    image: "/images/bgmi.jpg",
    description: "Squad up and dominate the battleground.",
  },
  mlbb: {
    classKey: "mlbb",
    category: "E-SPORTS",
    prize: "Rs 15,000",
    image: "/images/mlbb.jpg",
    description: "Teamwork defines victory.",
  },
  cosplay: {
    classKey: "cosplay",
    category: "CULTURAL AND CREATIVE",
    prize: "Rs 8,000",
    description: "Bring characters to life.",
  },
  dance: {
    classKey: "dance",
    category: "CULTURAL AND CREATIVE",
    prize: "Rs 10,000",
    description: "Celebrate culture through performance.",
  },
  reels: {
    classKey: "reels",
    category: "CULTURAL AND CREATIVE",
    prize: "Rs 5,000",
    description: "Create engaging content.",
  },
  treasure: {
    classKey: "treasure",
    category: "CULTURAL AND CREATIVE",
    prize: "Rs 6,000",
    description: "Decode clues to win.",
  },
  run: {
    classKey: "run",
    category: "SPORTS",
    prize: "TBA",
    description: "Push your limits.",
  },
};

const FALLBACK_CARD_BG =
  "linear-gradient(160deg, rgba(2, 6, 23, 0.9), rgba(15, 23, 42, 0.75))";

const FALLBACK_HERO_BG =
  "linear-gradient(120deg, rgba(2, 6, 23, 0.95), rgba(15, 23, 42, 0.75))";

export function getEventVisual(eventKey) {
  return (
    EVENT_VISUALS[eventKey] || {
      classKey: eventKey,
      category: "OTHER",
      prize: "TBA",
      description: "",
    }
  );
}

export function getEventCardBackground(eventKey) {
  const visual = getEventVisual(eventKey);
  if (!visual.image) return FALLBACK_CARD_BG;

  return `linear-gradient(rgba(2, 6, 23, 0.35), rgba(2, 6, 23, 0.8)), url(${visual.image})`;
}

export function getEventHeroBackground(eventKey) {
  const visual = getEventVisual(eventKey);
  if (!visual.image) return FALLBACK_HERO_BG;

  return `linear-gradient(100deg, rgba(2, 6, 23, 0.75), rgba(2, 6, 23, 0.2)), url(${visual.image})`;
}
