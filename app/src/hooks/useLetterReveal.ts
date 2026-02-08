import { useState, useEffect, useRef } from 'react';

const useLetterReveal = (triggerTime: number, text: string, revealDuration: number) => {
  const [revealedLength, setRevealedLength] = useState(0);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const isMountedRef = useRef(true);

  useEffect(() => {
    isMountedRef.current = true;
    
    return () => {
      isMountedRef.current = false;
      if (timerRef.current) clearTimeout(timerRef.current);
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  useEffect(() => {
    // Clear any existing timers
    if (timerRef.current) clearTimeout(timerRef.current);
    if (intervalRef.current) clearInterval(intervalRef.current);
    
    // Reset revealed length
    setRevealedLength(0);

    // Start revealing after triggerTime
    timerRef.current = setTimeout(() => {
      if (!isMountedRef.current) return;
      
      const lettersPerInterval = Math.max(1, Math.floor(text.length / (revealDuration * 10)));
      let currentLength = 0;
      
      intervalRef.current = setInterval(() => {
        if (!isMountedRef.current) return;
        
        currentLength += lettersPerInterval;
        if (currentLength >= text.length) {
          currentLength = text.length;
          if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
          }
        }
        
        setRevealedLength(currentLength);
      }, 100); // Update every 100ms for smooth reveal
    }, triggerTime * 1000);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [triggerTime, text, revealDuration]);

  return text.substring(0, revealedLength);
};

export default useLetterReveal;