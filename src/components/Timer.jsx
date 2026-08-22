import { useEffect, useState } from "react";
import useSound from "use-sound";
import countdown from "../assets/sounds/src_sounds_countdown.mp3";

export default function Timer({ setStop, questionNumber, timerPaused }) {
  const [timer, setTimer] = useState(30);
  const [playCountdown, { stop: stopCountdown }] = useSound(countdown);

  useEffect(() => {
    if (timer === 0) {
      const timeout = setTimeout(() => {
        setStop(true);
      }, 2500);
      return () => clearTimeout(timeout);
    }

    if (timerPaused) {
      stopCountdown();
      return;
    }

    const interval = setInterval(() => {
      setTimer((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [setStop, timer, timerPaused, stopCountdown]);

  useEffect(() => {
    setTimer(30);
    stopCountdown();
    if (!timerPaused) {
      playCountdown();
    }

    return () => {
      stopCountdown();
    };
  }, [questionNumber, playCountdown, stopCountdown]);

  return timer;
}

