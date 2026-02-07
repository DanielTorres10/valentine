import { useState, useRef, useEffect } from "react";
import { useAppStateActions } from "@/lib/appState";

interface Position {
  x: number;
  y: number;
}

export const NoButton = () => {
  const [position, setPosition] = useState<Position>({ x: 0, y: 0 });
  const [isMobile, setIsMobile] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const { incrementNoAttempts } = useAppStateActions();

  const MIN_BUFFER = 250; // Minimum distance from YesButton

  // Get YesButton position (approximate center)
  const getYesButtonBounds = () => {
    const yesButton = document.querySelector("[data-testid='yes-button']");
    if (yesButton) {
      const rect = yesButton.getBoundingClientRect();
      return {
        left: rect.left,
        top: rect.top,
        right: rect.right,
        bottom: rect.bottom,
        centerX: rect.left + rect.width / 2,
        centerY: rect.top + rect.height / 2,
      };
    }
    return null;
  };

  const isPointTooClose = (x: number, y: number, bounds: ReturnType<typeof getYesButtonBounds>) => {
    if (!bounds) return false;

    const dx = x - bounds.centerX;
    const dy = y - bounds.centerY;
    const distance = Math.sqrt(dx * dx + dy * dy);

    return distance < MIN_BUFFER;
  };

  const getRandomPosition = () => {
    const padding = 60;
    const buttonWidth = 100;
    const buttonHeight = 50;

    let newX: number, newY: number;
    let attempts = 0;
    const maxAttempts = 20;

    do {
      newX = Math.random() * (window.innerWidth - buttonWidth - padding * 2) + padding;
      newY = Math.random() * (window.innerHeight - buttonHeight - padding * 2) + padding;
      attempts++;
    } while (
      isPointTooClose(newX + buttonWidth / 2, newY + buttonHeight / 2, getYesButtonBounds()) &&
      attempts < maxAttempts
    );

    return { x: newX, y: newY };
  };

  const handleMouseEnter = () => {
    if (isMobile) return;
    
    const newPos = getRandomPosition();
    setPosition(newPos);
    incrementNoAttempts();
  };

  const handleTouchStart = (e: React.TouchEvent<HTMLButtonElement>) => {
    if (!isMobile) {
      setIsMobile(true);
    }

    // For touch, move button on direct touch attempt
    const newPos = getRandomPosition();
    setPosition(newPos);
    incrementNoAttempts();

    // Prevent default to avoid triggering click
    e.preventDefault();
  };

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    
    if (!isMobile) {
      const newPos = getRandomPosition();
      setPosition(newPos);
      incrementNoAttempts();
    }
  };

  // Initialize position
  useEffect(() => {
    setPosition(getRandomPosition());
  }, []);

  // Recalculate if window resizes
  useEffect(() => {
    const handleResize = () => {
      setPosition(getRandomPosition());
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <button
      ref={buttonRef}
      data-testid="no-button"
      onMouseEnter={handleMouseEnter}
      onClick={handleClick}
      onTouchStart={handleTouchStart}
      className="fixed px-6 py-3 bg-gradient-to-r from-pink-500 to-pink-600 text-white font-bold rounded-lg
        transition-all duration-300 ease-out hover:shadow-lg active:scale-95
        border-2 border-pink-400 text-lg pointer-events-auto select-none"
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
        transform: "translate(0, 0)",
        zIndex: 9999,
      }}
    >
      No
    </button>
  );
};

export default NoButton;
