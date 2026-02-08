import { useEffect, useRef } from 'react';
import { useAppStateActions } from '@/lib/appState';

type VisualizerId = 
  | "scope" 
  | "grid" 
  | "cube" 
  | "sphere" 
  | "diffusedRing" 
  | "dna" 
  | "movingBoxes" 
  | "ribbons" 
  | "treadmill";

const useVisualizerCycle = (isActive: boolean) => {
  const { setVisual } = useAppStateActions();
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const lastVisualizerRef = useRef<VisualizerId | null>(null);
  
  // Hardcoded visualizer schedule (seconds -> visualizer name)
  const schedule: { time: number; visualizer: VisualizerId }[] = [
    { time: 0, visualizer: 'diffusedRing' },
    { time: 31, visualizer: 'cube' },
    { time: 46, visualizer: 'sphere' },
    { time: 60, visualizer: 'cube' },
    { time: 75, visualizer: 'diffusedRing' },
    { time: 77, visualizer: 'grid' },
    { time: 91, visualizer: 'ribbons' },
    { time: 120, visualizer: 'treadmill' },
  ];

  useEffect(() => {
    if (!isActive) {
      // Clean up interval
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      lastVisualizerRef.current = null;
      return;
    }

    intervalRef.current = setInterval(() => {
      // Get audio element from window (as stored in ValentineAnalyzer)
      const audioElement = (window as any).__valentineAudio as HTMLAudioElement;
      if (!audioElement || !audioElement.currentTime) {
        return;
      }

      const currentTime = audioElement.currentTime;
      
      // Find the appropriate visualizer for current audio time
      let activeVisualizer: VisualizerId | null = null;
      
      // Sort schedule by time to ensure proper order
      const sortedSchedule = [...schedule].sort((a, b) => a.time - b.time);
      
      // Find the appropriate visualizer (last one that's <= currentTime)
      for (let i = sortedSchedule.length - 1; i >= 0; i--) {
        if (currentTime >= sortedSchedule[i].time) {
          activeVisualizer = sortedSchedule[i].visualizer;
          break;
        }
      }
      
      // If no schedule item found (shouldn't happen with time=0), use first
      if (!activeVisualizer && sortedSchedule.length > 0) {
        activeVisualizer = sortedSchedule[0].visualizer;
      }

      // Only update if visualizer has changed
      if (activeVisualizer && activeVisualizer !== lastVisualizerRef.current) {
        lastVisualizerRef.current = activeVisualizer;
        setVisual(activeVisualizer);
        console.log(`[Visualizer] Changed to ${activeVisualizer} at ${currentTime.toFixed(2)}s`);
      }
    }, 100); // Check every 100ms for smooth transitions

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      lastVisualizerRef.current = null;
    };
  }, [isActive, setVisual]);

  return null;
};

export default useVisualizerCycle;