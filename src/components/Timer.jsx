import React, { useEffect, useState, useRef } from "react";
import { Howl, Howler } from "howler";
import countdown30 from "../assets/sounds/src_sounds_countdown_30s.mp3";
import countdown60 from "../assets/sounds/src_sounds_countdown_60s.mp3";
import suspense from "../assets/sounds/src_sounds_suspense.mp3";

export default function Timer({ setStop, questionNumber, timerPaused }) {
  const isTier1 = questionNumber >= 1 && questionNumber <= 5;
  const isTier2 = questionNumber >= 6 && questionNumber <= 10;
  const isTier3 = questionNumber > 10;

  const [timer, setTimer] = useState(isTier1 ? 30 : isTier2 ? 60 : null);
  const currentSoundRef = useRef(null);

  // Initialize and play audio track for the current question tier
  useEffect(() => {
    // Stop and cleanup any previously playing sound
    if (currentSoundRef.current) {
      currentSoundRef.current.stop();
      currentSoundRef.current.unload();
      currentSoundRef.current = null;
    }

    let soundSrc = null;
    let shouldLoop = false;

    if (isTier1) {
      soundSrc = countdown30;
    } else if (isTier2) {
      soundSrc = countdown60;
    } else if (isTier3) {
      soundSrc = suspense;
      shouldLoop = true;
    }

    if (soundSrc) {
      const sound = new Howl({
        src: [soundSrc],
        loop: shouldLoop,
        volume: 1.0, // Full 100% volume (scaled globally by Howler master volume)
        preload: true,
      });

      // For countdown audio (Tiers 1 & 2), when the track finishes playing naturally, end the game
      if (!shouldLoop) {
        sound.on("end", () => {
          setStop(true);
        });
      }

      currentSoundRef.current = sound;

      if (!timerPaused) {
        sound.play();
      }
    }

    return () => {
      if (currentSoundRef.current) {
        currentSoundRef.current.stop();
        currentSoundRef.current.unload();
        currentSoundRef.current = null;
      }
    };
  }, [questionNumber]);

  // Handle pause and resume when timerPaused changes (e.g. answer locked or quit)
  useEffect(() => {
    if (!currentSoundRef.current) return;

    if (timerPaused) {
      currentSoundRef.current.pause();
    } else if (!currentSoundRef.current.playing()) {
      currentSoundRef.current.play();
    }
  }, [timerPaused]);

  // Reset timer duration whenever question number changes
  useEffect(() => {
    if (isTier1) {
      setTimer(30);
    } else if (isTier2) {
      setTimer(60);
    } else {
      setTimer(null);
    }
  }, [questionNumber, isTier1, isTier2]);

  // Countdown timer logic for Tiers 1 and 2
  useEffect(() => {
    if (isTier3) return;

    if (timer === 0) {
      // Do NOT stop the audio; let the countdown sound finish its ending chime/buzzer naturally
      // Fallback safeguard in case sound was blocked or already finished
      if (!currentSoundRef.current || !currentSoundRef.current.playing()) {
        const timeout = setTimeout(() => {
          setStop(true);
        }, 1000);
        return () => clearTimeout(timeout);
      }
      return;
    }

    if (timerPaused) {
      return;
    }

    const interval = setInterval(() => {
      setTimer((prev) => (prev !== null && prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(interval);
  }, [timer, timerPaused, isTier3, setStop]);

  if (isTier3) {
    return <span style={{ fontSize: "36px", lineHeight: "1", fontWeight: "bold" }}>&#8734;</span>;
  }

  return timer;
}

