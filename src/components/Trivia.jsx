import React, { useState, useEffect } from "react";
import useSound from "use-sound";
import play from "../assets/sounds/src_sounds_play.mp3";
import correct from "../assets/sounds/src_sounds_correct.mp3";
import wrong from "../assets/sounds/src_sounds_wrong.mp3";
import lockIn from "../assets/sounds/src-sounds-lock-in.mp3";
import "./Trivia.css";

const OPTION_LETTERS = ["A", "B", "C", "D"];

export default function Trivia({
  data,
  setStop,
  questionNumber,
  setQuestionNumber,
  setTimerPaused,
  earned,
}) {
  const [question, setQuestion] = useState({});
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [answerState, setAnswerState] = useState(""); // 'active', 'correct', 'wrong'

  const [letsPlay] = useSound(play);
  const [correctAnswer] = useSound(correct);
  const [wrongAnswer] = useSound(wrong);
  const [lockInAnswer] = useSound(lockIn);

  const handleQuit = () => {
    if (selectedAnswer !== null) return;
    if (setTimerPaused) {
      setTimerPaused(true);
    }
    setStop(true);
  };

  useEffect(() => {
    letsPlay();
  }, [letsPlay]);

  useEffect(() => {
    if (data && data[questionNumber - 1]) {
      setQuestion(data[questionNumber - 1]);
    }
  }, [data, questionNumber]);

  const delay = (duration, callback) => {
    setTimeout(() => {
      callback();
    }, duration);
  };

  const handleClick = (answer) => {
    if (selectedAnswer !== null) return; // Prevent multiple clicks

    // Immediately stop the countdown timer and countdown audio
    if (setTimerPaused) {
      setTimerPaused(true);
    }

    // Play lock in suspense sound
    lockInAnswer();

    setSelectedAnswer(answer);
    setAnswerState("active");

    delay(3000, () => {
      setAnswerState(answer.correct ? "correct" : "wrong");
    });

    delay(5000, () => {
      if (answer.correct) {
        correctAnswer();
        delay(5000, () => {
          if (setTimerPaused) {
            setTimerPaused(false);
          }
          if (questionNumber >= data.length) {
            setStop(true);
          } else {
            setQuestionNumber((prev) => prev + 1);
            setSelectedAnswer(null);
            setAnswerState("");
          }
        });
      } else {
        wrongAnswer();
        delay(5000, () => {
          setStop(true);
        });
      }
    });
  };

  const answers = question.answers || [];
  const row1 = answers.slice(0, 2);
  const row2 = answers.slice(2, 4);

  return (
    <div className="trivia-container">
      {/* Question Rail & Box */}
      <div className="kbc-rail question-rail">
        <div className="kbc-box question-box">
          <div className="kbc-inner question-inner">
            <span className="question-text">{question.question}</span>
          </div>
        </div>
      </div>

      {/* Answers Grid with Rails */}
      <div className="answers-container">
        {/* Row 1: A and B */}
        <div className="kbc-rail answers-rail">
          {row1.map((item, idx) => {
            const isSelected = selectedAnswer === item;
            const stateClass = isSelected ? answerState : "";
            return (
              <div
                key={idx}
                className={`kbc-box answer-box ${stateClass}`}
                onClick={() => handleClick(item)}>
                <div className="kbc-inner answer-inner">
                  <span className="option-prefix">&#9670; {OPTION_LETTERS[idx]}:</span>
                  <span className="option-text">{item.text}</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Row 2: C and D */}
        <div className="kbc-rail answers-rail">
          {row2.map((item, idx) => {
            const actualIndex = idx + 2;
            const isSelected = selectedAnswer === item;
            const stateClass = isSelected ? answerState : "";
            return (
              <div
                key={actualIndex}
                className={`kbc-box answer-box ${stateClass}`}
                onClick={() => handleClick(item)}>
                <div className="kbc-inner answer-inner">
                  <span className="option-prefix">&#9670; {OPTION_LETTERS[actualIndex]}:</span>
                  <span className="option-text">{item.text}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* End Game / Walk Away Button */}
      <div className="quit-container">
        <button
          className="quit-btn"
          onClick={handleQuit}
          disabled={selectedAnswer !== null}
          title="Quit and walk away with your current winnings">
          Quit Game {earned && earned !== "₹ 0" ? `(Take ${earned})` : ""}
        </button>
      </div>
    </div>
  );
}
