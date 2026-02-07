import { useEffect, useState } from "react";
import { useAppState } from "@/lib/appState";

export const useTimedReveal = (triggerTime: number) => {
  const [isVisible, setIsVisible] = useState(false);
  const audioTime = useAppState((state) => state.valentine.audioTime);

  useEffect(() => {
    if (audioTime >= triggerTime && !isVisible) {
      setIsVisible(true);
    }
  }, [audioTime, triggerTime, isVisible]);

  return isVisible;
};

export default useTimedReveal;

