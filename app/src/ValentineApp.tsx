import { useEffect, useState, useRef } from "react";
import { Suspense } from "react";
import ProposalScreen from "@/components/proposal/ProposalScreen";
import Visual3DCanvas from "@/components/canvas/Visual3D";
import TimedReveals from "@/components/reveals/TimedReveals";
import { APPLICATION_MODE } from "@/lib/applicationModes";
import { useValentineState, useAppStateActions, useAudio } from "@/lib/appState";
import AudioAnalyzer from "@/components/analyzers/audioAnalyzer";
import { useValentineAudioContext } from "@/context/valentineAudio";

export const ValentineApp = ({
  harryStylesAudioPath = "/r3f-audio-visualizer/audio/hs.mp3",
}) => {
  const { currentPhase } = useValentineState();
  const { setValentinePhase, setMode, initValentineMode, updateAudioTime } =
    useAppStateActions();
  const { setAudioUrl } = useValentineAudioContext();
  const audioRefContainer = useRef<{ audio: HTMLAudioElement | null }>({
    audio: null,
  });
  const [, setAudioRef] = useState<HTMLAudioElement | null>(null);
  const { source: audioSource } = useAudio();

  // Initialize Valentine mode
  useEffect(() => {
    initValentineMode();
    setMode(APPLICATION_MODE.AUDIO);
  }, [initValentineMode, setMode]);

  // Track audio time for reveals - use the audio element from the analyzer
  useEffect(() => {
    // Find the audio element created by AudioAnalyzer
    const audioElement =
      audioRefContainer.current.audio ||
      document.querySelector("audio") as HTMLAudioElement;

    if (!audioElement) return;

    const checkAudioTime = () => {
      updateAudioTime(audioElement.currentTime);
      if (audioElement.ended && currentPhase === "visual-journey") {
        setValentinePhase("complete");
      }
    };

    const interval = setInterval(checkAudioTime, 100);
    return () => clearInterval(interval);
  }, [currentPhase, updateAudioTime, setValentinePhase]);

  const handleProposalComplete = () => {
    console.log("[Valentine] Proposal complete, playing audio");
    // Set audio URL in context - ValentineAudioPlayer will handle playback
    setAudioUrl(harryStylesAudioPath);
  };

  const handleAudioRef = (audio: HTMLAudioElement) => {
    audioRefContainer.current.audio = audio;
    setAudioRef(audio);
  };

  return (
    <main className="relative h-[100dvh] w-[100dvw] bg-black overflow-hidden">
      {/* Phase 1: Proposal Screen */}
      {currentPhase === "proposal" && (
        <ProposalScreen onComplete={handleProposalComplete} />
      )}

      {/* Phase 2 & 3: Visual Journey with Audio and Reveals */}
      {(currentPhase === "visual-journey" || currentPhase === "complete") && (
        <>
          {/* Audio Analyzer - capture its audio element */}
          <AudioAnalyzerWrapper
            mode={APPLICATION_MODE.AUDIO}
            onAudioRef={handleAudioRef}
          />

          {/* 3D Visualization Canvas */}
          <div className="absolute inset-0 z-0">
            <Suspense fallback={<div className="w-full h-full bg-black" />}>
              <Visual3DCanvas />
            </Suspense>
          </div>

          {/* Timed Text Reveals */}
          <TimedReveals imageUrl="/r3f-audio-visualizer/images/harry-styles-together.png" />

          {/* Phase Complete Message */}
          {currentPhase === "complete" && (
            <div className="absolute inset-0 flex items-center justify-center z-50 pointer-events-none">
              <div className="text-center">
                <h2 className="text-5xl font-black text-pink-400 mb-4">
                  💕 Thank you, Cecilia! 💕
                </h2>
                <p className="text-2xl text-purple-300">
                  See you in October at Madison Square Garden
                </p>
              </div>
            </div>
          )}
        </>
      )}
    </main>
  );
};

// Wrapper to capture the audio element from AudioAnalyzer
const AudioAnalyzerWrapper = ({
  mode,
  onAudioRef,
}: {
  mode: typeof APPLICATION_MODE.AUDIO;
  onAudioRef: (audio: HTMLAudioElement) => void;
}) => {
  useEffect(() => {
    // Find the audio element created by AudioAnalyzer and notify parent
    const findAudio = () => {
      const audio = document.querySelector("audio") as HTMLAudioElement;
      if (audio) {
        onAudioRef(audio);
      } else {
        // Retry if not found yet
        setTimeout(findAudio, 100);
      }
    };
    findAudio();
  }, [onAudioRef]);

  return <AudioAnalyzer mode={mode} />;
};

export default ValentineApp;
