import { useEffect, useState } from "react";
import { type AudioSourceControlsProps } from "@/components/audio/sourceControls/common";
import { useValentineAudioContext } from "@/context/valentineAudio";

/**
 * ValentineAudioPlayer - Handles Valentine audio playback coordination
 * Similar to FileAudioPlayer but watches ValentineAudioContext for URLs instead of files
 */
const ValentineAudioPlayer = ({ audio }: AudioSourceControlsProps) => {
  try {
    const { config: { audioUrl } } = useValentineAudioContext();
    const [isPlaying, setIsPlaying] = useState(false);

    console.log("[ValentineAudioPlayer] Rendering with audio:", !!audio, "url:", audioUrl?.substring(0, 50) || "none");

    // Handle URL changes - set src and play
    useEffect(() => {
      if (!audioUrl) {
        if (audio.src) {
          audio.pause();
          setIsPlaying(false);
        }
        console.log("[ValentineAudioPlayer] No URL set");
        return;
      }

      console.log("[ValentineAudioPlayer] URL changed:", audioUrl.substring(0, 50));
      console.log("[ValentineAudioPlayer] Audio element:", !!audio);
      
      // Set the source directly (no need to createObjectURL)
      audio.src = audioUrl;
      console.log("[ValentineAudioPlayer] Set audio.src to:", audioUrl);

      // Try to auto-play
      const playPromise = audio.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            setIsPlaying(true);
            console.log("[ValentineAudioPlayer] ✅ Now playing");
          })
          .catch((err) => {
            console.warn("[ValentineAudioPlayer] ⚠️ Auto-play prevented:", err.message);
            setIsPlaying(false);
          });
      }
    }, [audioUrl, audio]);

    // Track playback state
    useEffect(() => {
      const handlePlay = () => {
        setIsPlaying(true);
        console.log("[ValentineAudioPlayer] Playing");
      };

      const handlePause = () => {
        setIsPlaying(false);
        console.log("[ValentineAudioPlayer] Paused");
      };

      const handleEnded = () => {
        setIsPlaying(false);
        console.log("[ValentineAudioPlayer] Ended");
      };

      audio.addEventListener("play", handlePlay);
      audio.addEventListener("pause", handlePause);
      audio.addEventListener("ended", handleEnded);

      return () => {
        audio.removeEventListener("play", handlePlay);
        audio.removeEventListener("pause", handlePause);
        audio.removeEventListener("ended", handleEnded);
      };
    }, [audio]);

    return <></>;
  } catch (error) {
    console.error("[ValentineAudioPlayer] Error:", error);
    return null;
  }
};

export default ValentineAudioPlayer;
