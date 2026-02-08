// Updated useTimedReveal.tsx
import { useState, useEffect, useRef } from 'react';

const useTimedReveal = (triggerTime: number, dependencies: any[] = []) => {
  const [isVisible, setIsVisible] = useState(false);
  const isMountedRef = useRef(true);

  useEffect(() => {
    isMountedRef.current = true;
    
    const checkAudioTime = () => {
      // Get audio element from window or app state
      const audioElement = (window as any).__valentineAudio as HTMLAudioElement;
      if (!audioElement || !audioElement.currentTime) {
        return 0;
      }
      return audioElement.currentTime;
    };

    const checkVisibility = () => {
      if (!isMountedRef.current) return;
      
      const currentTime = checkAudioTime();
      setIsVisible(currentTime >= triggerTime);
    };

    // Check initially
    checkVisibility();
    
    // Set up interval to check (more frequent for better accuracy)
    const intervalId = setInterval(checkVisibility, 100);
    
    return () => {
      isMountedRef.current = false;
      clearInterval(intervalId);
    };
  }, [triggerTime, ...dependencies]);

  return isVisible;
};

export default useTimedReveal;