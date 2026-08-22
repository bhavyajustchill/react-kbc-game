import { useEffect, useState } from "react";
import useSound from "use-sound";
import countdown from "../assets/sounds/src_sounds_countdown.mp3";

export default function Timer({ setStop, questionNumber }) {
  const [timer, setTimer] = useState(30);
  const [playCountdown, { stop: stopCountdown }] = useSound(countdown);

  useEffect(() => {
    if (timer === 0) {
      stopCountdown();
      return setStop(true);
    }

    const interval = setInterval(() => {
      setTimer((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [setStop, timer, stopCountdown]);

  useEffect(() => {
    setTimer(30);
    stopCountdown();
    playCountdown();

    return () => {
      stopCountdown();
    };
  }, [questionNumber, playCountdown, stopCountdown]);

  return timer;
}
