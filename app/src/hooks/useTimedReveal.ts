import { useEffect, useState } from "react";

export const useTimedReveal = (triggerTime: number, audioElementId?: string) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const getAudioElement = (): HTMLAudioElement | null => {
      if (audioElementId) {
        return document.getElementById(audioElementId) as HTMLAudioElement;
      }
      // Fallback: try to find audio element
      const audio = document.querySelector("audio");
      return audio || null;
    };

    const checkTime = () => {
      const audio = getAudioElement();
      if (!audio) return;

      const currentTime = audio.currentTime ?? 0;
      if (currentTime >= triggerTime && !isVisible) {
        setIsVisible(true);
      }
      // Don't fade out; once revealed, it stays visible
    };

    const interval = setInterval(checkTime, 100);
    return () => clearInterval(interval);
  }, [triggerTime, isVisible, audioElementId]);

  return isVisible;
};

export default useTimedReveal;
