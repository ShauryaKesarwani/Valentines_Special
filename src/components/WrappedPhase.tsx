import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight } from "lucide-react";
import { wrappedSlides } from "../data";

const slideVariants = {
  enter: { x: 300, opacity: 0, scale: 0.9 },
  center: { x: 0, opacity: 1, scale: 1 },
  exit: { x: -300, opacity: 0, scale: 0.9 },
};

export default function WrappedPhase({ onComplete }: { onComplete: () => void }) {
  const [current, setCurrent] = useState(0);

  const next = () => {
    if (current < wrappedSlides.length - 1) {
      setCurrent((c) => c + 1);
    } else {
      onComplete();
    }
  };

  const slide = wrappedSlides[current];
  const isLast = current === wrappedSlides.length - 1;

  return (
    <div className="min-h-screen manga-dots flex flex-col items-center justify-center p-4 relative">
      {/* Progress bar */}
      <div className="absolute top-6 left-1/2 -translate-x-1/2 flex gap-2">
        {wrappedSlides.map((_, i) => (
          <div
            key={i}
            className={`h-2 w-12 rounded-full border-2 border-black transition-all duration-300 ${
              i <= current ? "bg-rose-500" : "bg-white"
            }`}
          />
        ))}
      </div>

      {/* Header */}
      <motion.h1
        initial={{ y: -30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="manga-title text-3xl md:text-4xl text-rose-600 mb-8 mt-12"
      >
        Your 2025 Wrapped 💝
      </motion.h1>

      {/* Slide */}
      <div className="relative w-full max-w-sm h-[420px] flex items-center justify-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={current}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="absolute inset-0 flex items-center justify-center"
          >
            <div className="neo-card w-full p-8 text-center flex flex-col items-center justify-center min-h-[350px]">
              {/* Emoji */}
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 400 }}
                className="text-6xl mb-4 block"
              >
                {slide.emoji}
              </motion.span>

              {/* Stat */}
              <motion.h2
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="manga-title text-5xl md:text-6xl text-rose-600 mb-1"
              >
                {slide.stat}
              </motion.h2>

              {slide.unit && (
                <motion.span
                  initial={{ y: 10, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  className="text-lg font-bold text-gray-500 mb-4 block"
                >
                  {slide.unit}
                </motion.span>
              )}

              {/* Description */}
              <motion.p
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="text-lg md:text-xl font-semibold text-gray-800 whitespace-pre-line leading-relaxed mt-2"
              >
                {slide.text}
              </motion.p>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Next Button */}
      <motion.button
        onClick={next}
        whileTap={{ scale: 0.95 }}
        className="neo-btn neo-btn-rose mt-8 text-xl"
      >
        {isLast ? "Continue the journey" : "Next"}
        <ChevronRight className="w-5 h-5" />
      </motion.button>
    </div>
  );
}
