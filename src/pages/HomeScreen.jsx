import React, { useState, useEffect, useMemo } from "react";
import styled from "styled-components";
import img from "../assets/images/bg.jpg";

// Components
import Trivia from "../components/Trivia";
import data from "../assets/data/questions";
import Timer from "../components/Timer";

const HomeStyled = styled.div`
  height: 100vh;
  display: flex;
  color: white;

  .main {
    width: 75%;
    background:
      linear-gradient(to bottom, rgba(0, 0, 0, 0), var(--deep-dark)),
      url(${img}) center;
    display: flex;
    flex-direction: column;
    position: relative;

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
    height: 50%;
    position: relative;
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
  }

  .bottom {
    height: 50%;
  }

  .pyramid {
    width: 25%;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .moneyList {
    list-style: none;
    width: 100%;
    padding: 20px;
  }

  .moneyListItem {
    display: flex;
    align-items: center;
    padding: 5px;
    border-radius: 5px;
  }

  .moneyListItem.active {
    background: teal;
  }

  .moneyListItemNumber {
    font-size: 18px;
    font-weight: 100;
    width: 30%;
  }

  .moneyListItemAmount {
    font-size: 20px;
    font-weight: 300;
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

  @media only screen and (max-width: 768px) {
    display: flex;
    flex-direction: column;

    .main {
      width: 100%;
      height: 100%;

      .finished {
        margin-top: 80px;
        margin-bottom: 80px;
        padding: 30px 25px;
      }

      .endText {
        font-size: 34px;
      }

      .earnedAmount {
        font-size: 42px;
      }

      .top {
        height: 30%;
      }

      .timer {
        display: flex;
        position: relative;
        bottom: 0;
        top: 10%;
        left: 40%;
      }
    }

    .pyramid {
      width: 100%;
    }
  }
`;

export default function HomeScreen() {
  const [questionNumber, setQuestionNumber] = useState(1);
  const [stop, setStop] = useState(false);
  const [earned, setEarned] = useState("$ 0");

  const moneyPyramid = useMemo(
    () =>
      [
        { id: 1, amount: "$ 100" },
        { id: 2, amount: "$ 200" },
        { id: 3, amount: "$ 300" },
        { id: 4, amount: "$ 500" },
        { id: 5, amount: "$ 1.000" },
        { id: 6, amount: "$ 2.000" },
        { id: 7, amount: "$ 4.000" },
        { id: 8, amount: "$ 8.000" },
        { id: 9, amount: "$ 16.000" },
        { id: 10, amount: "$ 32.000" },
        { id: 11, amount: "$ 64.000" },
        { id: 12, amount: "$ 125.000" },
        { id: 13, amount: "$ 250.000" },
        { id: 14, amount: "$ 500.000" },
        { id: 15, amount: "$ 1.000.000" },
      ].reverse(),
    []
  );

  useEffect(() => {
    questionNumber > 1 &&
      setEarned(moneyPyramid.find((m) => m.id === questionNumber - 1).amount);
  }, [moneyPyramid, questionNumber]);

  return (
    <HomeStyled>
      <div className="main">
        {stop ? (
          <div className="finished">
            <span className="endTitle">Game Over</span>
            <h1 className="endText">
              You earned:
              <span className="earnedAmount">{earned}</span>
            </h1>
            <button
              className="restartBtn"
              onClick={() => window.location.reload()}>
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
                />
              </div>
            </div>
            <div className="bottom">
              <Trivia
                data={data}
                setStop={setStop}
                questionNumber={questionNumber}
                setQuestionNumber={setQuestionNumber}
              />
            </div>
          </>
        )}
      </div>
      <div className="pyramid">
        <ul className="moneyList">
          {moneyPyramid.map((m, index) => (
            <li
              key={index}
              className={
                questionNumber === m.id
                  ? "moneyListItem active"
                  : "moneyListItem"
              }>
              <span className="moneyListItemNumber">{m.id}</span>
              <span className="moneyListItemAmount">{m.amount}</span>
            </li>
          ))}
        </ul>
      </div>
    </HomeStyled>
  );
}
