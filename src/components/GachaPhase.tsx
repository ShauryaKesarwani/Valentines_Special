import { useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { gsap } from "gsap";
import { Gem, Star, ArrowRight, Sparkles } from "lucide-react";
import { gachaTrash, gachaUR } from "../data";

interface PullResult {
  name: string;
  stars: number;
  emoji: string;
  isUR: boolean;
}

export default function GachaPhase({ onComplete }: { onComplete: () => void }) {
  const [gems, setGems] = useState(100);
  const [pullCount, setPullCount] = useState(0);
  const [currentPull, setCurrentPull] = useState<PullResult | null>(null);
  const [isFlipping, setIsFlipping] = useState(false);
  const [showUR, setShowUR] = useState(false);
  const [history, setHistory] = useState<PullResult[]>([]);
  const cardRef = useRef<HTMLDivElement>(null);

  const costPerPull = 10;
  const pityThreshold = 10;

  const doFlipAnimation = useCallback(
    (pull: PullResult) => {
      const card = cardRef.current;
      if (!card) return;

      setIsFlipping(true);

      // GSAP 3D card flip
      const tl = gsap.timeline({
        onComplete: () => {
          setIsFlipping(false);
          if (pull.isUR) {
            setTimeout(() => setShowUR(true), 300);
          }
        },
      });

      tl.set(card, { rotateY: 0, scale: 0.8, opacity: 0 })
        .to(card, {
          opacity: 1,
          scale: 1,
          duration: 0.3,
          ease: "back.out(1.7)",
        })
        .to(card, {
          rotateY: 180,
          duration: 0.6,
          ease: "power2.inOut",
        })
        .to(card, {
          rotateY: 360,
          duration: 0.4,
          ease: "power2.out",
        })
        .to(card, {
          scale: pull.isUR ? 1.15 : 1,
          duration: 0.2,
          ease: "power2.out",
        });
    },
    []
  );

  const summon = useCallback(() => {
    if (gems < costPerPull || isFlipping) return;

    setGems((g) => g - costPerPull);
    const nextCount = pullCount + 1;
    setPullCount(nextCount);

    let pull: PullResult;

    if (nextCount >= pityThreshold) {
      // PITY: UR card!
      pull = {
        name: gachaUR.name,
        stars: gachaUR.stars,
        emoji: gachaUR.emoji,
        isUR: true,
      };
    } else {
      // Random trash
      const trash = gachaTrash[Math.floor(Math.random() * gachaTrash.length)];
      pull = { ...trash, isUR: false };
    }

    setCurrentPull(pull);
    setHistory((h) => [...h, pull]);

    // Trigger GSAP animation after state update
    requestAnimationFrame(() => {
      doFlipAnimation(pull);
    });
  }, [gems, pullCount, isFlipping, doFlipAnimation]);

  return (
    <div className="min-h-screen manga-dots flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Header */}
      <motion.h1
        initial={{ y: -30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="manga-title text-3xl md:text-4xl text-rose-600 mb-2"
      >
        Valentine Banner ✨
      </motion.h1>

      {/* Gems counter */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex items-center gap-2 mb-4 neo-card-sm px-4 py-2"
      >
        <Gem className="w-5 h-5 text-blue-500" />
        <span className="font-bold text-lg">{gems} Love Gems</span>
        <span className="text-gray-500 text-sm ml-2">
          Pull {pullCount}/{pityThreshold}
        </span>
      </motion.div>

      {/* Pity meter */}
      <div className="w-full max-w-xs h-3 border-3 border-black bg-white mb-6">
        <motion.div
          className={`h-full ${pullCount >= pityThreshold ? "bg-yellow-400" : "bg-rose-500"}`}
          animate={{ width: `${Math.min((pullCount / pityThreshold) * 100, 100)}%` }}
          transition={{ type: "spring", stiffness: 200 }}
        />
      </div>

      {/* Card display area */}
      <div className="relative w-72 h-96 md:w-80 md:h-[420px] flex items-center justify-center mb-6">
        {currentPull ? (
          <div
            ref={cardRef}
            className="gacha-card w-full h-full"
            style={{ transformStyle: "preserve-3d" }}
          >
            <div
              className={`w-full h-full flex flex-col items-center justify-center p-6 ${
                currentPull.isUR
                  ? "bg-gradient-to-br from-yellow-300 via-rose-400 to-purple-500 border-4 border-black"
                  : "neo-card"
              }`}
              style={{ backfaceVisibility: "hidden" }}
            >
              {/* Stars */}
              <div className="flex gap-1 mb-3">
                {Array.from({ length: currentPull.stars }).map((_, i) => (
                  <Star
                    key={i}
                    className={`w-6 h-6 ${currentPull.isUR ? "text-yellow-200" : "text-yellow-500"}`}
                    fill="currentColor"
                  />
                ))}
              </div>

              {/* Emoji */}
              <span className="text-7xl mb-4">{currentPull.emoji}</span>

              {/* Name */}
              <h3
                className={`manga-title text-2xl text-center mb-2 ${
                  currentPull.isUR ? "text-white" : "text-gray-800"
                }`}
              >
                {currentPull.name}
              </h3>

              {currentPull.isUR && (
                <span className="neo-btn-gold px-3 py-1 text-sm font-bold border-2 border-black">
                  {gachaUR.title}
                </span>
              )}
            </div>
          </div>
        ) : (
          <motion.div
            animate={{ rotate: [0, 2, -2, 0] }}
            transition={{ repeat: Infinity, duration: 3 }}
            className="neo-card w-full h-full flex flex-col items-center justify-center p-6"
          >
            <Sparkles className="w-16 h-16 text-rose-400 mb-4" />
            <p className="manga-title text-2xl text-gray-500 text-center">
              Summon to reveal your fate!
            </p>
            <p className="text-sm text-gray-400 mt-2">Pity at pull #{pityThreshold}</p>
          </motion.div>
        )}
      </div>

      {/* Pull history */}
      {history.length > 0 && (
        <div className="flex gap-2 mb-6 flex-wrap justify-center max-w-md">
          {history.map((h, i) => (
            <motion.div
              key={i}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className={`w-10 h-10 flex items-center justify-center text-lg border-2 border-black ${
                h.isUR ? "bg-yellow-300" : "bg-white"
              }`}
              title={h.name}
            >
              {h.emoji}
            </motion.div>
          ))}
        </div>
      )}

      {/* Action buttons */}
      <AnimatePresence mode="wait">
        {showUR ? (
          <motion.div
            key="ur-reveal"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="text-center"
          >
            {/* UR Stats Card */}
            <div className="neo-card p-6 mb-4 max-w-sm">
              <div className="w-full h-48 border-4 border-black mb-4 overflow-hidden bg-gradient-to-br from-pink-200 to-rose-300">
                <img
                  src={gachaUR.image}
                  alt={gachaUR.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="manga-title text-2xl text-rose-600 mb-3">
                {gachaUR.name} Stats
              </h3>
              <div className="text-left space-y-2 text-sm font-bold">
                <p>⚔️ ATK: {gachaUR.stats.attack}</p>
                <p>🛡️ DEF: {gachaUR.stats.defense}</p>
                <p>✨ SPL: {gachaUR.stats.special}</p>
                <p>💤 PSV: {gachaUR.stats.passive}</p>
              </div>
            </div>
            <button onClick={onComplete} className="neo-btn neo-btn-rose text-xl">
              Final Phase
              <ArrowRight className="w-5 h-5" />
            </button>
          </motion.div>
        ) : (
          <motion.button
            key="summon-btn"
            onClick={summon}
            whileTap={{ scale: 0.9 }}
            disabled={gems < costPerPull || isFlipping || pullCount >= pityThreshold}
            className="neo-btn neo-btn-gold text-2xl px-10 py-4 disabled:opacity-50"
          >
            <Gem className="w-6 h-6" />
            Summon ({costPerPull} 💎)
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}
