import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import ConsentPhase from "./components/ConsentPhase";
import WrappedPhase from "./components/WrappedPhase";
import DopaminePhase from "./components/DopaminePhase";
import GachaPhase from "./components/GachaPhase";
import WantedPhase from "./components/WantedPhase";

// ── State Machine: 5 phases in order ──
type Phase = "consent" | "wrapped" | "dopamine" | "gacha" | "wanted";

const PHASE_ORDER: Phase[] = [
  "consent",
  "wrapped",
  "dopamine",
  "gacha",
  "wanted",
];

function App() {
  const [phase, setPhase] = useState<Phase>("consent");

  const advancePhase = () => {
    const currentIndex = PHASE_ORDER.indexOf(phase);
    if (currentIndex < PHASE_ORDER.length - 1) {
      setPhase(PHASE_ORDER[currentIndex + 1]);
    }
  };

  return (
    <div className="min-h-screen w-full">
      <AnimatePresence mode="wait">
        <motion.div
          key={phase}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
        >
          {phase === "consent" && <ConsentPhase onComplete={advancePhase} />}
          {phase === "wrapped" && <WrappedPhase onComplete={advancePhase} />}
          {phase === "dopamine" && <DopaminePhase onComplete={advancePhase} />}
          {phase === "gacha" && <GachaPhase onComplete={advancePhase} />}
          {phase === "wanted" && <WantedPhase />}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

export default App;
