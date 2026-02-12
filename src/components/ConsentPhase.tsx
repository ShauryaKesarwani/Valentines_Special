import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";
import { Heart } from "lucide-react";
import { celebrationGif } from "../data";

export default function ConsentPhase({ onComplete }: { onComplete: () => void }) {
  const [accepted, setAccepted] = useState(false);
  const [noPos, setNoPos] = useState<{ x: number; y: number } | null>(null);

  const teleportNo = useCallback(() => {
    const padding = 100;
    const x = Math.random() * (window.innerWidth - padding * 2) + padding;
    const y = Math.random() * (window.innerHeight - padding * 2) + padding;
    setNoPos({ x, y });
  }, []);

  const handleYes = () => {
    setAccepted(true);

    // 🎉 Full-screen confetti burst
    const duration = 2500;
    const end = Date.now() + duration;

    const frame = () => {
      confetti({
        particleCount: 4,
        angle: 60,
        spread: 80,
        origin: { x: 0, y: 0.7 },
        colors: ["#FB7185", "#E11D48", "#FDA4AF", "#FACC15", "#FFF1F2"],
      });
      confetti({
        particleCount: 4,
        angle: 120,
        spread: 80,
        origin: { x: 1, y: 0.7 },
        colors: ["#FB7185", "#E11D48", "#FDA4AF", "#FACC15", "#FFF1F2"],
      });
      if (Date.now() < end) requestAnimationFrame(frame);
    };
    frame();

    // Auto-transition after 3 seconds
    setTimeout(onComplete, 3000);
  };

  return (
    <div className="min-h-screen manga-dots flex items-center justify-center p-4 relative overflow-hidden">
      <AnimatePresence mode="wait">
        {!accepted ? (
          <motion.div
            key="question"
            initial={{ scale: 0, rotate: -10 }}
            animate={{ scale: 1, rotate: 0 }}
            exit={{ scale: 0, rotate: 10, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className="neo-card p-8 md:p-12 max-w-md w-full text-center relative z-10"
          >
            {/* Decorative hearts */}
            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{ repeat: Infinity, duration: 2 }}
              className="text-5xl mb-4"
            >
              💘
            </motion.div>

            <h1 className="manga-title text-3xl md:text-4xl text-rose-600 mb-6">
              Will you be my Valentine?
            </h1>

            <p className="text-lg mb-8 font-medium text-gray-700">
              Choose wisely... or don't. One option doesn't work anyway 😏
            </p>

            <div className="flex gap-4 justify-center">
              <button
                onClick={handleYes}
                className="neo-btn neo-btn-rose text-xl px-8 py-3 hover:scale-105 transition-transform"
              >
                <Heart className="w-5 h-5" fill="white" />
                Yes!
              </button>

              <button
                onMouseEnter={teleportNo}
                onClick={teleportNo}
                className="neo-btn neo-btn-white text-xl px-8 py-3"
                style={
                  noPos
                    ? {
                        position: "fixed",
                        left: noPos.x,
                        top: noPos.y,
                        zIndex: 50,
                        transition: "none",
                      }
                    : {}
                }
              >
                No
              </button>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="celebration"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 15 }}
            className="neo-card p-8 max-w-sm w-full text-center"
          >
            <h2 className="manga-title text-4xl text-rose-600 mb-4">
              I knew it!! 🎉
            </h2>
            <img
              src={celebrationGif}
              alt="Celebration"
              className="w-full rounded border-4 border-black"
            />
            <p className="mt-4 text-lg font-bold">
              Get ready for the best Valentine's experience ever...
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
