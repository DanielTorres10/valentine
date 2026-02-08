import { useEffect, useState, useRef, useCallback, useMemo } from "react";
import { Suspense } from "react";
import ProposalScreen from "@/components/proposal/ProposalScreen";
import Visual3DCanvas from "@/components/canvas/Visual3D";
import TimedReveals from "@/components/reveals/TimedReveals";
import { APPLICATION_MODE } from "@/lib/applicationModes";
import { useValentineState, useAppStateActions, useAppearance, useAudio } from "@/lib/appState";
import AudioAnalyzer from "@/components/analyzers/audioAnalyzer";
import { useValentineAudioContext } from "@/context/valentineAudio";
import ValentineControls from "@/components/audio/ValentineControls";
import useVisualizerCycle from "@/hooks/useVisualizerCycle";
import usePaletteCycle from "@/hooks/usePaletteCycle";
import { Label } from "./components/ui/label";
import { Switch } from "./components/ui/switch";
import { ControlsPanel } from "./components/controls/main";

export const ValentineApp = ({
  harryStylesAudioPath = "/r3f-audio-visualizer/audio/hs.mp3",
}) => {
  const { currentPhase } = useValentineState();
  const { setValentinePhase, setMode, initValentineMode, updateAudioTime } =
    useAppStateActions();
  const { setAudioUrl } = useValentineAudioContext();
  const audioStartTimeRef = useRef<number | null>(null);
  const { colorBackground, paletteTrackEnergy } = useAppearance();
  const { setAppearance } = useAppStateActions();
  const { currentTime } = useAudio();
  
  // Track interval for cleanup
  const elapsedIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const lastPhaseRef = useRef<string | null>(null);
  const canvasMountTimeRef = useRef<number | null>(null);

  // Initialize Valentine mode
  useEffect(() => {
    initValentineMode();
    setMode(APPLICATION_MODE.AUDIO);
    
    return () => {
      // Cleanup on unmount
      if (elapsedIntervalRef.current) {
        clearInterval(elapsedIntervalRef.current);
      }
      // Clean up any global audio references
      if ((window as any).__valentineAudio) {
        try {
          const audio = (window as any).__valentineAudio;
          audio.pause();
          audio.src = '';
          audio.load();
        } catch (e) {
          // Ignore cleanup errors
        }
        delete (window as any).__valentineAudio;
      }
    };
  }, [initValentineMode, setMode]);

  // Track elapsed time for reveals
  useEffect(() => {
    if (currentPhase !== "visual-journey" && currentPhase !== "complete") {
      // Clean up interval if not in these phases
      if (elapsedIntervalRef.current) {
        clearInterval(elapsedIntervalRef.current);
        elapsedIntervalRef.current = null;
      }
      return;
    }

    elapsedIntervalRef.current = setInterval(() => {
      if (audioStartTimeRef.current === null) {
        return;
      }

      const elapsedSeconds =
        (Date.now() - audioStartTimeRef.current) / 1000;
      updateAudioTime(elapsedSeconds);
    }, 100);

    return () => {
      if (elapsedIntervalRef.current) {
        clearInterval(elapsedIntervalRef.current);
        elapsedIntervalRef.current = null;
      }
    };
  }, [currentPhase, updateAudioTime]);

  const handleProposalComplete = useCallback(() => {
    // Record when audio will start playing
    audioStartTimeRef.current = Date.now();
    // Set audio URL in context - ValentineAudioPlayer will handle playback
    setAudioUrl(harryStylesAudioPath);
    
    // Force garbage collection if available (Chrome only)
    if (typeof window !== 'undefined' && (window as any).gc) {
      (window as any).gc();
    }
  }, [setAudioUrl, harryStylesAudioPath]);

  // Cycle through visualizers based on audio timing
  const isVisualJourney = currentPhase === "visual-journey" || currentPhase === "complete";
  useVisualizerCycle(isVisualJourney);

  // Debug: Log state changes to help diagnose
  useEffect(() => {
    if (lastPhaseRef.current !== currentPhase) {
      console.log(`[App] Phase changed: ${lastPhaseRef.current} -> ${currentPhase}`);
      lastPhaseRef.current = currentPhase;
      
      if (isVisualJourney && !canvasMountTimeRef.current) {
        canvasMountTimeRef.current = Date.now();
        console.log(`[WebGL] Canvas mounted at ${canvasMountTimeRef.current}`);
      } else if (!isVisualJourney && canvasMountTimeRef.current) {
        const mountDuration = Date.now() - canvasMountTimeRef.current;
        console.log(`[WebGL] Canvas was mounted for ${mountDuration}ms`);
        canvasMountTimeRef.current = null;
      }
    }
  }, [currentPhase, isVisualJourney]);

  // Monitor memory usage
  useEffect(() => {
    if (!isVisualJourney) return;

    const monitorInterval = setInterval(() => {
      if ((performance as any).memory) {
        const mem = (performance as any).memory;
        const used = mem.usedJSHeapSize / 1048576;
        const total = mem.jsHeapSizeLimit / 1048576;
        const percent = (used / total) * 100;
        
        if (percent > 70) {
          console.warn(`[Memory] High usage: ${used.toFixed(1)}MB / ${total.toFixed(1)}MB (${percent.toFixed(1)}%)`);
        }
      }
      
      // Check for too many WebGL contexts
      if ((window as any).__webglDebug) {
        console.log(`[WebGL] Debug:`, (window as any).__webglDebug);
      }
    }, 10000); // Every 10 seconds

    return () => clearInterval(monitorInterval);
  }, [isVisualJourney]);

  // Cycle through color palettes
  usePaletteCycle(isVisualJourney, 15);

  // Memoize the visualizer container to prevent unnecessary re-renders
  const visualizerContainer = useMemo(() => (
    <div className="absolute inset-0 z-0">
      <Suspense fallback={
        <div className="w-full h-full bg-black flex items-center justify-center">
          <div className="text-white">Loading 3D visualization...</div>
        </div>
      }>
        <Visual3DCanvas />
      </Suspense>
    </div>
  ), []); // Empty deps - this should never re-render

  return (
    <main className="relative h-[100dvh] w-[100dvw] bg-black overflow-hidden">
      {/* Phase 1: Proposal Screen */}
      {currentPhase === "proposal" && (
        <ProposalScreen onComplete={handleProposalComplete} />
      )}

      {/* Always render the visualizer but control opacity instead of display */}
      <div className={`absolute inset-0 z-0 transition-opacity duration-500 ${
        isVisualJourney ? 'opacity-100' : 'opacity-0 pointer-events-none'
      }`}>
        {visualizerContainer}
      </div>

      {/* Phase 2 & 3: Visual Journey with Audio and Reveals */}
      {isVisualJourney && (
        <>
          {/* Audio Analyzer */}
          <AudioAnalyzer mode={APPLICATION_MODE.AUDIO} />

          {/* Timed Text Reveals */}
          <TimedReveals imageUrl="/r3f-audio-visualizer/images/harry-styles-together.png" />

          {/* Audio Controls (Valentine) */}
          <ValentineControls />

          <ControlsPanel />
        </>
      )}
    </main>
  );
};

export default ValentineApp;