import React, { useState, useEffect, useMemo } from "react";
import styled from "styled-components";
import useSound from "use-sound";
import { Howler } from "howler";
import img from "../assets/images/bg.jpg";
import gameOverSound from "../assets/sounds/src_sounds_gameover.mp3";

// Components
import Trivia from "../components/Trivia";
import localQuizData from "../assets/data/quizData.json";
import { fetchQuizQuestions } from "../services/api";
import Timer from "../components/Timer";

const HomeStyled = styled.div`
  height: 100vh;
  display: flex;
  color: white;
  position: relative;
  overflow: hidden;

  /* Hamburger Menu Button (Mobile only) */
  .menuToggle {
    display: none;
    position: fixed;
    top: 16px;
    right: 16px;
    z-index: 10002;
    width: 44px;
    height: 44px;
    background: rgba(3, 2, 47, 0.85);
    border: 2px solid #f8c146;
    border-radius: 12px;
    cursor: pointer;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 5px;
    padding: 0;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.5), 0 0 10px rgba(248, 193, 70, 0.4);
    backdrop-filter: blur(8px);
    transition: all 0.3s ease;

    .bar {
      width: 22px;
      height: 2.5px;
      background-color: #f8c146;
      border-radius: 2px;
      transition: all 0.3s ease;
    }

    &.open .bar:nth-child(1) {
      transform: translateY(7.5px) rotate(45deg);
    }
    &.open .bar:nth-child(2) {
      opacity: 0;
    }
    &.open .bar:nth-child(3) {
      transform: translateY(-7.5px) rotate(-45deg);
    }
  }

  /* Backdrop Overlay for Mobile Drawer */
  .drawerBackdrop {
    display: none;
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.65);
    backdrop-filter: blur(4px);
    z-index: 9998;
    animation: fadeIn 0.25s ease;
  }

  .main {
    width: 75%;
    background:
      linear-gradient(to bottom, rgba(0, 0, 0, 0), var(--deep-dark)),
      url(${img}) center;
    background-size: cover;
    display: flex;
    flex-direction: column;
    position: relative;
    height: 100vh;

    .finished {
      position: relative;
      margin: auto;
      background: #ffffff;
      padding: 45px 65px;
      border-radius: 28px;
      border: 4px solid #f8c146;
      box-shadow:
        0 15px 40px rgba(0, 0, 0, 0.6),
        0 0 35px rgba(255, 255, 255, 0.8);
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      text-align: center;
      animation:
        popIn 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards,
        cardFlash 2s infinite ease-in-out;
      z-index: 10;
      max-width: 90%;
    }

    .endTitle {
      font-size: 22px;
      font-weight: 800;
      color: #3b3b6d;
      letter-spacing: 2px;
      text-transform: uppercase;
      margin-bottom: 10px;
    }

    .endText {
      font-size: 52px;
      font-weight: 900;
      color: #10062b;
      margin: 8px 0;
      line-height: 1.2;
    }

    .earnedAmount {
      display: block;
      font-size: 64px;
      font-weight: 900;
      background: linear-gradient(135deg, #d35400 0%, #f39c12 40%, #e67e22 70%, #b7950b 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      margin-top: 6px;
      animation: textShine 1.5s infinite alternate;
    }

    .restartBtn {
      margin-top: 25px;
      padding: 14px 40px;
      background: linear-gradient(135deg, #12093c, #22074d);
      color: #ffffff;
      font-size: 18px;
      font-weight: 800;
      letter-spacing: 1px;
      border: 2px solid #f8c146;
      border-radius: 30px;
      cursor: pointer;
      box-shadow: 0 6px 20px rgba(0, 0, 0, 0.4);
      transition: all 0.25s ease;
    }

    .restartBtn:hover {
      transform: scale(1.06);
      background: linear-gradient(135deg, #f8c146, #e67e22);
      color: #10062b;
      box-shadow: 0 0 25px rgba(248, 193, 70, 0.8);
    }
  }

  .top {
    height: 45%;
    position: relative;
    display: flex;
    align-items: flex-end;
    justify-content: flex-start;
  }

  .timer {
    width: 70px;
    height: 70px;
    border-radius: 50%;
    border: 5px solid white;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 30px;
    font-weight: 700;
    position: absolute;
    bottom: 10px;
    left: 80px;
    box-shadow: 0 0 15px rgba(255, 255, 255, 0.4);
    background: rgba(0, 0, 0, 0.4);
  }

  .bottom {
    height: 55%;
    padding-bottom: 45px; /* space for sticky footer */
    box-sizing: border-box;
  }

  .pyramid {
    width: 25%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-between;
    background-color: #03022f;
    border-left: 2px solid rgba(255, 255, 255, 0.1);
    z-index: 100;
    height: 100vh;
    padding-bottom: 46px; /* ensures volume bar is fully visible above fixed footer */
    box-sizing: border-box;
  }

  .pyramidHeader {
    display: none;
    width: 100%;
    padding: 16px 20px;
    border-bottom: 1px solid rgba(255, 255, 255, 0.15);
    align-items: center;
    justify-content: space-between;
    box-sizing: border-box;

    h3 {
      font-size: 18px;
      font-weight: 800;
      color: #f8c146;
      letter-spacing: 1px;
      text-transform: uppercase;
    }

    .closeBtn {
      background: none;
      border: none;
      color: #ffffff;
      font-size: 22px;
      cursor: pointer;
      padding: 4px;
    }
  }

  .moneyList {
    list-style: none;
    width: 100%;
    padding: 10px 20px;
    overflow-y: auto;
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: center;
    box-sizing: border-box;
  }

  .moneyListItem {
    display: flex;
    align-items: center;
    padding: 4px 8px;
    border-radius: 6px;
    transition: all 0.2s ease;
  }

  .moneyListItem.active {
    background: linear-gradient(90deg, #008080, #00a8a8);
    box-shadow: 0 0 12px rgba(0, 168, 168, 0.7);
  }

  .moneyListItemNumber {
    font-size: 15px;
    font-weight: 400;
    width: 35%;
    color: #ffd700;
  }

  .moneyListItemAmount {
    font-size: 17px;
    font-weight: 600;
  }

  /* Volume Controller at bottom of pyramid */
  .volumeControl {
    width: 100%;
    padding: 12px 18px;
    background: rgba(2, 1, 28, 0.95);
    border-top: 1px solid rgba(255, 255, 255, 0.15);
    display: flex;
    align-items: center;
    gap: 12px;
    box-sizing: border-box;

    .volumeBtn {
      background: none;
      border: none;
      color: #f8c146;
      font-size: 20px;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 0;
      transition: transform 0.15s ease;

      &:hover {
        transform: scale(1.15);
      }
    }

    .volumeSlider {
      flex: 1;
      height: 6px;
      border-radius: 3px;
      background: #1c1a4d;
      accent-color: #f8c146;
      cursor: pointer;
      outline: none;
    }

    .volumeText {
      font-size: 13px;
      font-weight: 700;
      color: #cbd5e1;
      min-width: 36px;
      text-align: right;
    }
  }

  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }

  @keyframes popIn {
    0% {
      transform: scale(0.3);
      opacity: 0;
    }
    70% {
      transform: scale(1.05);
    }
    100% {
      transform: scale(1);
      opacity: 1;
    }
  }

  @keyframes cardFlash {
    0%,
    100% {
      box-shadow:
        0 15px 40px rgba(0, 0, 0, 0.6),
        0 0 20px rgba(255, 215, 0, 0.4),
        0 0 35px rgba(255, 255, 255, 0.7);
      border-color: #f8c146;
      transform: scale(1);
    }
    50% {
      box-shadow:
        0 20px 50px rgba(0, 0, 0, 0.7),
        0 0 45px rgba(255, 215, 0, 0.95),
        0 0 70px rgba(255, 255, 255, 1);
      border-color: #ffffff;
      transform: scale(1.03);
    }
  }

  @keyframes textShine {
    0% {
      filter: drop-shadow(0 2px 4px rgba(230, 126, 34, 0.4));
    }
    100% {
      filter: drop-shadow(0 2px 18px rgba(243, 156, 18, 0.9));
    }
  }

  /* Mobile Responsive Breakpoint */
  @media only screen and (max-width: 768px) {
    .menuToggle {
      display: flex;
    }

    .drawerBackdrop {
      display: block;
    }

    .main {
      width: 100%;
      height: 100vh;

      .finished {
        margin: auto;
        padding: 30px 20px;
        width: 90%;
      }

      .endText {
        font-size: 32px;
      }

      .earnedAmount {
        font-size: 40px;
      }

      .top {
        height: 35%;
      }

      .timer {
        bottom: 5px;
        left: 20px;
        width: 60px;
        height: 60px;
        font-size: 24px;
        border-width: 4px;
      }

      .bottom {
        height: 65%;
        padding-bottom: 50px;
      }
    }

    .pyramidHeader {
      display: flex;
    }

    .pyramid {
      position: fixed;
      top: 0;
      right: 0;
      bottom: 0;
      width: 290px;
      max-width: 85vw;
      height: 100vh;
      background: rgba(3, 2, 47, 0.96);
      backdrop-filter: blur(15px);
      border-left: 2px solid #f8c146;
      box-shadow: -8px 0 30px rgba(0, 0, 0, 0.8);
      z-index: 9999;
      transform: translateX(100%);
      transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      justify-content: flex-start;
      padding-top: 10px;

      &.open {
        transform: translateX(0);
      }

      .moneyList {
        padding: 10px 15px 15px 15px;
      }

      .moneyListItem {
        padding: 4px 8px;
      }

      .moneyListItemNumber {
        font-size: 15px;
      }

      .moneyListItemAmount {
        font-size: 16px;
      }
    }

    .volumeControl {
      padding-bottom: 45px; /* space for bottom sticky footer on mobile */
    }
  }
`;

export default function HomeScreen() {
  const [questionNumber, setQuestionNumber] = useState(1);
  const [stop, setStop] = useState(false);
  const [timerPaused, setTimerPaused] = useState(false);
  const [earned, setEarned] = useState("₹ 0");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [quizQuestions, setQuizQuestions] = useState(localQuizData);

  // Fetch dynamic questions from backend API
  useEffect(() => {
    let isMounted = true;
    const loadQuestions = async () => {
      try {
        const data = await fetchQuizQuestions();
        if (isMounted && Array.isArray(data) && data.length > 0) {
          setQuizQuestions(data);
        }
      } catch (err) {
        console.warn("Could not fetch quiz questions from API, using fallback data:", err.message);
      }
    };
    loadQuestions();
    return () => {
      isMounted = false;
    };
  }, []);

  // Persistent Volume State
  const [volume, setVolume] = useState(() => {
    const saved = localStorage.getItem("kbc_volume");
    return saved !== null ? parseFloat(saved) : 0.8;
  });
  const [prevVolume, setPrevVolume] = useState(0.8);

  useEffect(() => {
    Howler.volume(volume);
    localStorage.setItem("kbc_volume", volume.toString());
  }, [volume]);

  const toggleMute = () => {
    if (volume > 0) {
      setPrevVolume(volume);
      setVolume(0);
    } else {
      setVolume(prevVolume > 0 ? prevVolume : 0.8);
    }
  };

  const getVolumeIcon = () => {
    if (volume === 0) return "🔇";
    if (volume < 0.5) return "🔉";
    return "🔊";
  };

  const [playGameOver] = useSound(gameOverSound);

  useEffect(() => {
    if (stop) {
      playGameOver();
    }
  }, [stop, playGameOver]);

  const moneyPyramid = useMemo(
    () =>
      quizQuestions
        .map((item) => ({
          id: item.id,
          amount: item.amount,
        }))
        .reverse(),
    [quizQuestions],
  );

  useEffect(() => {
    if (stop && questionNumber === quizQuestions.length) {
      const topTier = moneyPyramid.find((m) => m.id === quizQuestions.length);
      if (topTier) setEarned(topTier.amount);
    } else if (questionNumber > 1) {
      const currentTier = moneyPyramid.find((m) => m.id === questionNumber - 1);
      if (currentTier) setEarned(currentTier.amount);
    }
  }, [moneyPyramid, questionNumber, stop, quizQuestions.length]);

  return (
    <HomeStyled>
      {/* Mobile Hamburger Button */}
      <button
        className={`menuToggle ${isMenuOpen ? "open" : ""}`}
        onClick={() => setIsMenuOpen((prev) => !prev)}
        aria-label="Toggle Prize Ladder">
        <div className="bar" />
        <div className="bar" />
        <div className="bar" />
      </button>

      {/* Mobile Backdrop Overlay */}
      {isMenuOpen && (
        <div className="drawerBackdrop" onClick={() => setIsMenuOpen(false)} />
      )}

      {/* Main Game Screen */}
      <div className="main">
        {stop ? (
          <div className="finished">
            <span className="endTitle">Game Over</span>
            <h1 className="endText">
              You earned:
              <span className="earnedAmount">{earned}</span>
            </h1>
            <button className="restartBtn" onClick={() => window.location.reload()}>
              Play Again
            </button>
          </div>
        ) : (
          <>
            <div className="top">
              <div className="timer">
                <Timer
                  setStop={setStop}
                  questionNumber={questionNumber}
                  timerPaused={timerPaused}
                />
              </div>
            </div>
            <div className="bottom">
              <Trivia
                data={quizQuestions}
                setStop={setStop}
                questionNumber={questionNumber}
                setQuestionNumber={setQuestionNumber}
                setTimerPaused={setTimerPaused}
                earned={earned}
              />
            </div>
          </>
        )}
      </div>

      {/* Money Pyramid (Desktop sidebar / Mobile slide-in drawer) */}
      <div className={`pyramid ${isMenuOpen ? "open" : ""}`}>
        <div className="pyramidHeader">
          <h3>Prize Ladder</h3>
          <button className="closeBtn" onClick={() => setIsMenuOpen(false)}>
            ✕
          </button>
        </div>
        <ul className="moneyList">
          {moneyPyramid.map((m, index) => (
            <li
              key={index}
              className={questionNumber === m.id ? "moneyListItem active" : "moneyListItem"}>
              <span className="moneyListItemNumber">{m.id}</span>
              <span className="moneyListItemAmount">{m.amount}</span>
            </li>
          ))}
        </ul>

        {/* Persistent Volume Control */}
        <div className="volumeControl">
          <button
            className="volumeBtn"
            onClick={toggleMute}
            aria-label="Mute or Unmute"
            title={volume === 0 ? "Unmute" : "Mute"}>
            {getVolumeIcon()}
          </button>
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={volume}
            onChange={(e) => setVolume(parseFloat(e.target.value))}
            className="volumeSlider"
            aria-label="Volume Slider"
          />
          <span className="volumeText">{Math.round(volume * 100)}%</span>
        </div>
      </div>
    </HomeStyled>
  );
}
