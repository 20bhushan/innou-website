export const EVENT_VISUALS = {
  hackathon: {
    classKey: "hackathon",
    category: "MAIN EVENTS",
    prize: "Rs 30,000",
    fee: "₹300 / team",
    image: "/images/hackathon.png",
    description:
      "Innovate for a smarter campus. Build impactful solutions using web and Python development.",
  },
  business: {
    classKey: "business",
    category: "MAIN EVENTS",
    prize: "Rs 30,000",
    fee: "₹300 / team",
    image: "/images/bussinessplan.png",
    description: "Pitch your startup idea.",
  },
  debugging: {
    classKey: "debug",
    category: "TECHNICAL EVENTS",
    prize: "Rs 10,000",
    fee: "₹150 / Participant",
    image: "/images/codeDebug.png",
    description:
      "Test your logic and syntax knowledge under time pressure across multiple languages.",
  },
  typing: {
    classKey: "typing",
    category: "TECHNICAL EVENTS",
    prize: "Rs 10,000",
    fee: "₹150 / Participant",
    image: "/images/typingMaster.png",
    description:
      "Compete to prove your speed and accuracy and claim the typing title.",
  },
  mlbb: {
    classKey: "mlbb",
    category: "E-SPORTS",
    prize: "Rs 30,000",
    fee: "₹500 / team",
    image: "/images/mlbb.jpg",
    description: "Teamwork defines victory.",
  },
  cosplay: {
    classKey: "cosplay",
    category: "CREATIVE ARENA",
    prize: "Rs 15,000",
    fee: "₹200 / Participant",
    image: "/images/cosplays.png",

    description: "Bring characters to life.",
  },
  dance: {
    classKey: "dance",
    category: "CREATIVE ARENA",
    prize: "Rs 22,000",
    fee: "₹300 / team",
    image: "/images/k-pop.jpg",

    description: "",
  },
  reels: {
    classKey: "reels",
    category: "CREATIVE ARENA",
    prize: "Rs 6,000",
    fee: "Free",
    image: "/images/reels.png",

    description: "Create engaging content.",
  },
 run: {
  classKey: "run",
  category: "SPORTS",
  prize: "Rs 40,000",

  fee: `
    <div class="fee-top">
      <span class="new-price">₹300</span>
    </div>
    <div class="fee-ended">Offer Ended</div>
  `,

  offerCountdown: {
    enabled: false,
    endTime: "2026-04-01T23:59:59+05:30",
    activeLabel: "⏳",
    expiredLabel: "Offer Ended",
  },

  image: "/images/run.jpg",
  description: "Push your limits.",
},

stall: {
  classKey: "stall",
  category: "OTHER",
  prize: "LIMITED SLOTS",
  fee: `
    <div class="fee-content stall-fee">
      <div class="stall-fee-line">
        <span class="stall-fee-label">Food Stall</span>
        <span class="stall-fee-price">₹2000</span>
      </div>
      <div class="stall-fee-line">
        <span class="stall-fee-label">Other Stall</span>
        <span class="stall-fee-price">₹1500</span>
      </div>
    </div>
  `,
  image: "/images/stall.png",
  description:
    "Book your stall at INNOU 1.0 to showcase, sell, and connect with visitors throughout the event day.",
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
