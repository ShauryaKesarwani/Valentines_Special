import { motion } from "framer-motion";
import { ExternalLink, Camera } from "lucide-react";
import { wantedPoster } from "../data";
import { useState, useRef, useEffect } from "react";

export default function WantedPhase() {
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [isCapturing, setIsCapturing] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const startCamera = async () => {
    try {
      setIsCapturing(true);
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user", width: 640, height: 640 },
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }
    } catch (err) {
      console.error("Error accessing camera:", err);
      alert("Could not access camera. Please allow camera permissions.");
      setIsCapturing(false);
    }
  };

  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  const capturePhoto = () => {
    if (videoRef.current) {
      const canvas = document.createElement("canvas");
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.drawImage(videoRef.current, 0, 0);
        const dataUrl = canvas.toDataURL("image/png");
        setCapturedImage(dataUrl);
        stopCamera();
      }
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    setIsCapturing(false);
  };

  const resetPhoto = () => {
    setCapturedImage(null);
  };

  const displayImage = capturedImage || wantedPoster.image;

  return (
    <div className="min-h-screen manga-dots flex flex-col items-center justify-center p-4">
      <motion.div
        initial={{ scale: 0, rotate: -5 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: "spring", stiffness: 200, damping: 15 }}
        className="wanted-poster w-full max-w-sm p-6 md:p-8 text-center"
      >
        {/* WANTED header */}
        <h1 className="wanted-title text-5xl md:text-6xl tracking-wider mb-1">
          WANTED
        </h1>
        <p className="text-sm font-bold tracking-widest mb-4 text-gray-600">
          DEAD OR ALIVE
        </p>

        {/* Divider */}
        <div className="w-full h-1 bg-black mb-4" />

        {/* Photo / Camera */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="w-full aspect-square border-4 border-black mb-4 overflow-hidden bg-gradient-to-br from-amber-100 to-orange-200 relative"
        >
          {isCapturing ? (
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="w-full h-full object-cover scale-x-[-1]"
            />
          ) : (
            <img
              src={displayImage}
              alt={wantedPoster.name}
              className="w-full h-full object-cover"
            />
          )}
        </motion.div>

        {/* Name */}
        <motion.h2
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="wanted-title text-3xl md:text-4xl mb-2"
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
          <p className="wanted-title text-4xl md:text-5xl text-rose-600">
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
        <p className="wanted-title text-xl tracking-widest text-gray-500">
          — MYRINE —
        </p>
      </motion.div>

      {/* Action buttons */}
      <motion.div
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="flex flex-wrap items-center justify-center gap-3 mt-8"
      >
        {/* Camera Controls */}
        {!isCapturing && !capturedImage && (
          <button
            onClick={startCamera}
            className="neo-btn neo-btn-gold text-sm py-2 px-4"
          >
            <Camera className="w-4 h-4" />
            Take Photo
          </button>
        )}
        {isCapturing && (
          <>
            <button
              onClick={capturePhoto}
              className="neo-btn neo-btn-rose text-sm py-2 px-4"
            >
              📸 Capture
            </button>
            <button
              onClick={stopCamera}
              className="neo-btn neo-btn-white text-sm py-2 px-4"
            >
              ✕ Cancel
            </button>
          </>
        )}
        {capturedImage && (
          <button
            onClick={resetPhoto}
            className="neo-btn neo-btn-pink text-sm py-2 px-4"
          >
            🔄 Retake
          </button>
        )}

        {/* Turn Yourself In button */}
        <a
          href={wantedPoster.linkUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="neo-btn neo-btn-rose text-xl no-underline"
        >
          Turn Yourself In
          <ExternalLink className="w-5 h-5" />
        </a>
      </motion.div>

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
