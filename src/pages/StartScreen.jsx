import React from "react";
import styled, { keyframes } from "styled-components";
import logoImg from "../assets/images/logo.jpg";
import bgImg from "../assets/images/bg.jpg";

const floatLogo = keyframes`
  0% {
    transform: translateY(0px) scale(1);
    filter: drop-shadow(0 10px 25px rgba(0, 0, 0, 0.7))
            drop-shadow(0 0 25px rgba(248, 193, 70, 0.45));
  }
  50% {
    transform: translateY(-12px) scale(1.04);
    filter: drop-shadow(0 20px 40px rgba(0, 0, 0, 0.85))
            drop-shadow(0 0 45px rgba(248, 193, 70, 0.8))
            drop-shadow(0 0 35px rgba(0, 168, 255, 0.5));
  }
  100% {
    transform: translateY(0px) scale(1);
    filter: drop-shadow(0 10px 25px rgba(0, 0, 0, 0.7))
            drop-shadow(0 0 25px rgba(248, 193, 70, 0.45));
  }
`;

const spinRing = keyframes`
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
`;

const pulseGlow = keyframes`
  0%, 100% {
    opacity: 0.5;
    transform: scale(0.95);
  }
  50% {
    opacity: 0.9;
    transform: scale(1.08);
  }
`;

const buttonShine = keyframes`
  0% {
    background-position: -200% center;
  }
  100% {
    background-position: 200% center;
  }
`;

const StartStyled = styled.div`
  height: 100vh;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
  background:
    radial-gradient(
      circle at center,
      rgba(16, 10, 68, 0.85) 0%,
      rgba(3, 2, 47, 0.98) 75%,
      #010018 100%
    ),
    url(${bgImg}) center / cover no-repeat;

  /* Ambient light spotlight in center */
  &::before {
    content: "";
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 600px;
    height: 600px;
    background: radial-gradient(
      circle,
      rgba(248, 193, 70, 0.18) 0%,
      rgba(0, 168, 255, 0.08) 50%,
      transparent 70%
    );
    border-radius: 50%;
    pointer-events: none;
    animation: ${pulseGlow} 4s infinite ease-in-out;
  }

  .start-content {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    position: relative;
    z-index: 2;
    padding-bottom: 40px; /* offset for bottom sticky footer */
    gap: 60px; /* Generous spacing between logo and button */
    animation: fadeIn 0.8s cubic-bezier(0.16, 1, 0.3, 1);
  }

  .logo-wrapper {
    position: relative;
    width: 250px;
    height: 250px;
    margin-bottom: 60px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
  }

  /* Animated Outer Golden Orbit Ring */
  .orbit-ring {
    position: absolute;
    inset: -14px;
    border-radius: 50%;
    border: 2.5px dashed rgba(248, 193, 70, 0.7);
    box-shadow:
      0 0 30px rgba(248, 193, 70, 0.4),
      inset 0 0 18px rgba(248, 193, 70, 0.25);
    animation: ${spinRing} 22s linear infinite;
    pointer-events: none;
  }

  .logo-img-container {
    width: 100%;
    height: 100%;
    border-radius: 50%;
    padding: 1px;
    background: linear-gradient(135deg, #f8c146 0%, #ff9800 50%, #b7950b 100%);
    box-shadow:
      0 15px 40px rgba(0, 0, 0, 0.85),
      0 0 35px rgba(248, 193, 70, 0.55),
      0 0 60px rgba(0, 168, 255, 0.35);
    animation: ${floatLogo} 3.6s ease-in-out infinite;
    transition: transform 0.3s ease;

    &:hover {
      transform: scale(1.05);
    }
  }

  .logo-img {
    width: 100%;
    height: 100%;
    border-radius: 50%;
    object-fit: cover;
    display: block;
    border: 4px solid #03022f;
  }

  /* High-Contrast KBC Start Button */
  .start-btn {
    position: relative;
    padding: 18px 58px;
    font-size: 22px;
    font-weight: 900;
    letter-spacing: 2px;
    text-transform: uppercase;
    color: #000000; /* Crisp solid black for maximum contrast */
    background: linear-gradient(135deg, #ffc107 0%, #ff9800 50%, #f57c00 100%);
    border: 2.5px solid #ffffff;
    border-radius: 50px;
    cursor: pointer;
    box-shadow:
      0 10px 30px rgba(0, 0, 0, 0.7),
      0 0 30px rgba(248, 193, 70, 0.65),
      inset 0 1px 2px rgba(255, 255, 255, 0.9);
    transition: all 0.25s cubic-bezier(0.175, 0.885, 0.32, 1.275);
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 12px;
    outline: none;

    .start-text {
      color: #000000;
      font-weight: 900;
    }

    .play-icon {
      font-size: 20px;
      color: #000000;
      transition: transform 0.25s ease;
    }

    &:hover {
      transform: translateY(-4px) scale(1.06);
      background: linear-gradient(135deg, #ffffff 0%, #ffeb3b 40%, #ffc107 100%);
      color: #000000;
      box-shadow:
        0 16px 40px rgba(0, 0, 0, 0.8),
        0 0 50px rgba(255, 215, 0, 1),
        0 0 70px rgba(248, 193, 70, 0.9);

      .start-text,
      .play-icon {
        color: #000000;
      }

      .play-icon {
        transform: translateX(4px) scale(1.15);
      }
    }

    &:active {
      transform: translateY(1px) scale(0.98);
      box-shadow:
        0 6px 20px rgba(0, 0, 0, 0.6),
        0 0 25px rgba(248, 193, 70, 0.6);
    }
  }

  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: scale(0.92);
    }
    to {
      opacity: 1;
      transform: scale(1);
    }
  }

  @media only screen and (max-width: 768px) {
    .logo-wrapper {
      width: 230px;
      height: 230px;
    }

    .orbit-ring {
      inset: -11px;
    }

    .start-content {
      gap: 48px;
    }

    .start-btn {
      padding: 16px 48px;
      font-size: 20px;
    }
  }

  @media only screen and (max-width: 480px) {
    .logo-wrapper {
      width: 195px;
      height: 195px;
    }

    .orbit-ring {
      inset: -9px;
    }

    .start-content {
      gap: 40px;
    }

    .start-btn {
      padding: 14px 40px;
      font-size: 18px;
      letter-spacing: 1.5px;
    }
  }
`;

export default function StartScreen({ setUsername, onStart }) {
  const handleStart = () => {
    if (typeof setUsername === "function") {
      setUsername("Player");
    }
    if (typeof onStart === "function") {
      onStart();
    }
  };

  return (
    <StartStyled>
      <div className="start-content">
        <div className="logo-wrapper" onClick={handleStart} title="Click to Start">
          <div className="orbit-ring" />
          <div className="logo-img-container">
            <img src={logoImg} alt="KBC Logo" className="logo-img" />
          </div>
        </div>

        <button className="start-btn" onClick={handleStart} aria-label="Start Game">
          <span className="start-text">Start Game</span>
          <span className="play-icon">▶</span>
        </button>
      </div>
    </StartStyled>
  );
}
