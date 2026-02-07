import useTimedReveal from "@/hooks/useTimedReveal";

export const DateReveal = () => {
  const isVisible = useTimedReveal(60); // 1 minute

  return (
    <div
      className={`transition-all duration-500 ${
        isVisible ? "opacity-100" : "opacity-0 pointer-events-none"
      }`}
    >
      <div
        className="text-4xl md:text-6xl font-black text-center text-pink-400"
        style={{
          animation: isVisible
            ? "glowPulse 1.5s ease-in-out infinite"
            : "none",
          textShadow: `
            0 0 10px rgba(255, 105, 180, 0.6),
            0 0 20px rgba(255, 105, 180, 0.4),
            0 0 30px rgba(138, 43, 226, 0.3)
          `,
          letterSpacing: "0.02em",
        }}
      >
        October 21, 2026
      </div>
    </div>
  );
};

export const LocationReveal = () => {
  const isVisible = useTimedReveal(90); // 1.5 minutes

  return (
    <div
      className={`transition-all duration-500 ${
        isVisible ? "opacity-100" : "opacity-0 pointer-events-none"
      }`}
    >
      <div
        className="text-3xl md:text-5xl font-bold text-center text-purple-300 mt-4"
        style={{
          animation: isVisible
            ? "glowPulse 1.5s ease-in-out 0.3s infinite"
            : "none",
          textShadow: `
            0 0 10px rgba(186, 85, 211, 0.6),
            0 0 20px rgba(186, 85, 211, 0.4),
            0 0 30px rgba(255, 105, 180, 0.2)
          `,
          letterSpacing: "0.02em",
        }}
      >
        New York: Madison Square Garden
      </div>
    </div>
  );
};

export const EventReveal = ({ imageUrl }: { imageUrl?: string }) => {
  const isVisible = useTimedReveal(120); // 2 minutes

  return (
    <div
      className={`transition-all duration-700 transform ${
        isVisible
          ? "opacity-100 scale-100"
          : "opacity-0 scale-95 pointer-events-none"
      }`}
      style={{
        transitionTimingFunction: "cubic-bezier(0.34, 1.56, 0.64, 1)",
      }}
    >
      <div className="mt-6 text-center">
        {/* Event title */}
        <div
          className="text-3xl md:text-5xl font-black text-transparent bg-clip-text
          bg-gradient-to-r from-yellow-300 via-pink-400 to-purple-500 mb-4"
          style={{
            textShadow: `
              0 0 15px rgba(255, 215, 0, 0.6),
              0 0 30px rgba(255, 105, 180, 0.4),
              0 0 45px rgba(138, 43, 226, 0.3)
            `,
            letterSpacing: "0.03em",
            animation: isVisible ? "dramaticPulse 2s ease-in-out infinite" : "none",
          }}
        >
          Harry Styles: TOGETHER, TOGETHER
        </div>

        {/* Concert image (if provided) */}
        {imageUrl && (
          <div className="mt-6 flex justify-center">
            <img
              src={imageUrl}
              alt="Harry Styles Concert"
              className="max-w-sm md:max-w-lg rounded-lg shadow-2xl"
              style={{
                boxShadow: `
                  0 0 30px rgba(255, 215, 0, 0.4),
                  0 0 60px rgba(255, 105, 180, 0.3),
                  0 0 90px rgba(138, 43, 226, 0.2)
                `,
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export const TimedReveals = ({ imageUrl }: { imageUrl?: string }) => {
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center z-20 pointer-events-none">
      <style>{`
        @keyframes glowPulse {
          0%, 100% {
            text-shadow: 0 0 10px rgba(255, 105, 180, 0.6),
                         0 0 20px rgba(138, 43, 226, 0.3);
          }
          50% {
            text-shadow: 0 0 20px rgba(255, 105, 180, 1),
                         0 0 40px rgba(138, 43, 226, 0.6);
          }
        }

        @keyframes dramaticPulse {
          0%, 100% {
            filter: brightness(1);
            text-shadow: 0 0 15px rgba(255, 215, 0, 0.6),
                         0 0 30px rgba(255, 105, 180, 0.4);
          }
          50% {
            filter: brightness(1.2);
            text-shadow: 0 0 30px rgba(255, 215, 0, 1),
                         0 0 60px rgba(255, 105, 180, 0.8);
          }
        }
      `}</style>

      <DateReveal />
      <LocationReveal />
      <EventReveal imageUrl={imageUrl} />
    </div>
  );
};

export default TimedReveals;
