import { motion } from "framer-motion";
import { ExternalLink } from "lucide-react";
import { wantedPoster } from "../data";

export default function WantedPhase() {
  return (
    <div className="min-h-screen manga-dots flex flex-col items-center justify-center p-4">
      <motion.div
        initial={{ scale: 0, rotate: -5 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: "spring", stiffness: 200, damping: 15 }}
        className="wanted-poster w-full max-w-sm p-6 md:p-8 text-center"
      >
        {/* WANTED header */}
        <h1
          className="manga-title text-5xl md:text-6xl tracking-wider mb-1"
          style={{ fontFamily: "'Bangers', system-ui" }}
        >
          WANTED
        </h1>
        <p className="text-sm font-bold tracking-widest mb-4 text-gray-600">
          REALLY BAD OR ALIVE
        </p>

        {/* Divider */}
        <div className="w-full h-1 bg-black mb-4" />

        {/* Photo */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="w-full aspect-square border-4 border-black mb-4 overflow-hidden bg-gradient-to-br from-amber-100 to-orange-200"
        >
          <img
            src={wantedPoster.image}
            alt={wantedPoster.name}
            className="w-full h-full object-cover"
          />
        </motion.div>

        {/* Name */}
        <motion.h2
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="manga-title text-3xl md:text-4xl mb-2"
        >
          {wantedPoster.name}
        </motion.h2>

        {/* Divider */}
        <div className="w-3/4 h-0.5 bg-black/30 mx-auto mb-3" />

        {/* Bounty */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 1, type: "spring" }}
          className="mb-4"
        >
          <p className="text-sm font-bold tracking-wider text-gray-600 mb-1">
            BOUNTY
          </p>
          <p className="manga-title text-4xl md:text-5xl text-rose-600">
            {wantedPoster.bounty}
          </p>
        </motion.div>

        {/* Crimes */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 1.3 }}
          className="mb-6"
        >
          <p className="text-xs font-bold tracking-wider text-gray-500 mb-2">
            CRIMES
          </p>
          <ul className="space-y-1">
            {wantedPoster.crimes.map((crime, i) => (
              <li key={i} className="text-sm font-bold text-gray-800">
                • {crime}
              </li>
            ))}
          </ul>
        </motion.div>

        {/* Marine Footer */}
        <div className="w-full h-0.5 bg-black/30 mb-3" />
        <p className="manga-title text-xl tracking-widest text-gray-500">
          — MARINE —
        </p>
      </motion.div>

      {/* Turn Yourself In button */}
      <motion.a
        href={wantedPoster.linkUrl}
        target="_blank"
        rel="noopener noreferrer"
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 1.5 }}
        whileTap={{ scale: 0.95 }}
        className="neo-btn neo-btn-rose text-xl mt-8 no-underline"
      >
        Turn Yourself In
        <ExternalLink className="w-5 h-5" />
      </motion.a>

      {/* Footer message */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2 }}
        className="mt-6 text-gray-500 font-semibold text-center text-sm"
      >
        Happy Valentine's Day 💘 You're my greatest adventure.
      </motion.p>
    </div>
  );
}
