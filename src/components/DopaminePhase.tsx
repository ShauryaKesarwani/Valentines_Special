import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Zap, ArrowRight } from "lucide-react";
import { dopaminePool } from "../data";

interface Polaroid {
  id: number;
  text: string;
  image: string;
  rotation: number;
  x: number;
  y: number;
}

const resolveImageSrc = (src: string) => {
  if (!src) return "";
  if (src.startsWith("./") || src.startsWith("../")) {
    return new URL(src, import.meta.url).href;
  }
  return src;
};

export default function DopaminePhase({ onComplete }: { onComplete: () => void }) {
  const [polaroids, setPolaroids] = useState<Polaroid[]>([]);
  const [clickCount, setClickCount] = useState(0);
  const [showLevelUp, setShowLevelUp] = useState(false);

  const maxClicks = 10;

  const spawnPolaroid = useCallback(() => {
    if (clickCount >= maxClicks) return;

    const pool = dopaminePool;
    const item = pool[clickCount % pool.length];
    const rotation = Math.random() * 20 - 10; // -10 to 10 deg
    const x = Math.random() * 60 - 30; // scatter horizontally
    const y = Math.random() * 40 - 20; // scatter vertically

    const newPolaroid: Polaroid = {
      id: Date.now(),
      text: item.text,
      image: item.image,
      rotation,
      x,
      y,
    };

    setPolaroids((prev) => [...prev, newPolaroid]);
    setClickCount((c) => {
      const next = c + 1;
      if (next >= maxClicks) {
        setTimeout(() => setShowLevelUp(true), 600);
      }
      return next;
    });
  }, [clickCount]);

  return (
    <div className="min-h-screen manga-dots flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Header */}
      <motion.h1
        initial={{ y: -30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="manga-title text-3xl md:text-4xl text-rose-600 mb-2 z-20 relative"
      >
        Emergency Dopamine Station 🧠⚡
      </motion.h1>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="text-gray-600 font-semibold mb-6 z-20 relative"
      >
        {clickCount}/{maxClicks} hits dispensed
      </motion.p>

      {/* Progress */}
      <div className="w-full max-w-xs h-4 border-4 border-black bg-white mb-8 z-20 relative">
        <motion.div
          className="h-full bg-rose-500"
          animate={{ width: `${(clickCount / maxClicks) * 100}%` }}
          transition={{ type: "spring", stiffness: 200 }}
        />
      </div>

      {/* Polaroid Pile */}
      <div className="relative w-full max-w-2xl h-[350px] md:h-[450px] flex items-center justify-center mb-8">
        <AnimatePresence>
          {polaroids.map((p) => (
            <motion.div
              key={p.id}
              initial={{ scale: 0, y: 100, opacity: 0 }}
              animate={{
                scale: 1,
                y: p.y,
                x: p.x,
                opacity: 1,
                rotate: p.rotation,
              }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              className="polaroid absolute w-72 md:w-80 lg:w-96 cursor-default"
              style={{ zIndex: p.id }}
            >
              {/* Image placeholder */}
              <div className="w-full h-44 md:h-56 lg:h-64 bg-gradient-to-br from-pink-200 to-rose-300 border-2 border-black mb-2 flex items-center justify-center">
                {p.image ? (
                  <img
                    src={resolveImageSrc(p.image)}
                    alt=""
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-4xl">💕</span>
                )}
              </div>
              {/* Caption */}
              <p className="text-sm font-bold text-center text-gray-800 leading-tight px-1">
                {p.text}
              </p>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* The Button */}
      {!showLevelUp ? (
        <motion.button
          onClick={spawnPolaroid}
          whileTap={{ scale: 0.9 }}
          whileHover={{ scale: 1.05 }}
          disabled={clickCount >= maxClicks}
          className="neo-btn neo-btn-rose text-2xl px-10 py-4 glow-btn z-20 relative disabled:opacity-50"
        >
          <Zap className="w-6 h-6" fill="white" />
          Emergency Dopamine Hit
        </motion.button>
      ) : (
        <motion.div
          initial={{ scale: 0, rotate: -5 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: "spring", stiffness: 300 }}
          className="z-20 relative text-center"
        >
          <div className="neo-card p-6 mb-4">
            <p className="manga-title text-3xl text-rose-600 mb-2">
              🎊 LEVEL UP! 🎊
            </p>
            <p className="font-bold text-lg">
              Dopamine levels maxed out! Ready for the next challenge?
            </p>
          </div>
          <button
            onClick={onComplete}
            className="neo-btn neo-btn-gold text-xl"
          >
            Let's Go!
            <ArrowRight className="w-5 h-5" />
          </button>
        </motion.div>
      )}
    </div>
  );
}
