import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import styled from "styled-components";
import { loginAdmin, getAuthToken } from "../services/api";

const LightLoginContainer = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f8fafc;
  background: radial-gradient(circle at top center, #f1f5f9 0%, #e2e8f0 100%);
  padding: 20px;
  position: relative;
  font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;

  * {
    box-sizing: border-box;
  }

  .loginCard {
    position: relative;
    width: 100%;
    max-width: 440px;
    background: #ffffff;
    border: 1px solid #e2e8f0;
    border-radius: 20px;
    padding: 40px 35px;
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.08), 0 1px 3px rgba(0, 0, 0, 0.05);
    z-index: 10;
  }

  .cardHeader {
    text-align: center;
    margin-bottom: 30px;

    .badge {
      display: inline-block;
      padding: 4px 14px;
      background: #fef3c7;
      border: 1px solid #f59e0b;
      border-radius: 20px;
      color: #b45309;
      font-size: 11px;
      font-weight: 800;
      letter-spacing: 1.5px;
      text-transform: uppercase;
      margin-bottom: 12px;
    }

    h1 {
      font-size: 26px;
      font-weight: 800;
      color: #0f172a;
      margin-bottom: 6px;
      letter-spacing: -0.5px;
    }

    p {
      font-size: 13px;
      color: #64748b;
    }
  }

  .errorBanner {
    background: #fef2f2;
    border: 1px solid #fecaca;
    border-radius: 10px;
    padding: 12px 16px;
    margin-bottom: 22px;
    color: #991b1b;
    font-size: 13px;
    font-weight: 600;
    display: flex;
    align-items: center;
    gap: 10px;
    animation: shake 0.3s ease-in-out;
  }

  @keyframes shake {
    0%, 100% { transform: translateX(0); }
    25% { transform: translateX(-6px); }
    75% { transform: translateX(6px); }
  }

  .formGroup {
    margin-bottom: 20px;
    text-align: left;

    label {
      display: block;
      font-size: 13px;
      font-weight: 700;
      color: #334155;
      margin-bottom: 8px;
    }

    .inputWrapper {
      position: relative;
      display: flex;
      align-items: center;

      input {
        width: 100%;
        padding: 13px 16px;
        background: #ffffff;
        border: 1.5px solid #cbd5e1;
        border-radius: 10px;
        color: #0f172a;
        font-size: 14px;
        transition: all 0.2s ease;

        &:focus {
          outline: none;
          border-color: #d97706;
          box-shadow: 0 0 0 3px rgba(217, 119, 6, 0.15);
        }

        &::placeholder {
          color: #94a3b8;
        }
      }

      .togglePassword {
        position: absolute;
        right: 12px;
        background: none;
        border: none;
        color: #64748b;
        cursor: pointer;
        font-size: 16px;
        padding: 4px;
        display: flex;
        align-items: center;

        &:hover {
          color: #0f172a;
        }
      }
    }
  }

  .submitButton {
    width: 100%;
    padding: 14px 20px;
    background: linear-gradient(135deg, #d97706 0%, #b45309 100%);
    border: none;
    border-radius: 10px;
    color: #ffffff;
    font-size: 15px;
    font-weight: 700;
    letter-spacing: 0.5px;
    cursor: pointer;
    box-shadow: 0 4px 12px rgba(217, 119, 6, 0.3);
    transition: all 0.2s ease;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
    margin-top: 10px;

    &:hover:not(:disabled) {
      transform: translateY(-2px);
      box-shadow: 0 6px 18px rgba(217, 119, 6, 0.45);
    }

    &:active:not(:disabled) {
      transform: translateY(0);
    }

    &:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }
  }

  .footerLinks {
    margin-top: 25px;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 12px;
    text-align: center;

    .backLink {
      color: #64748b;
      font-size: 13px;
      font-weight: 600;
      display: flex;
      align-items: center;
      gap: 6px;
      transition: color 0.2s;
      text-decoration: none;

      &:hover {
        color: #d97706;
        text-decoration: underline;
      }
    }

    .credentialsHint {
      margin-top: 10px;
      padding: 10px 14px;
      background: #f8fafc;
      border: 1px dashed #cbd5e1;
      border-radius: 8px;
      font-size: 12px;
      color: #475569;
      line-height: 1.5;

      span {
        color: #b45309;
        font-weight: 700;
      }
    }
  }
`;

export default function AdminLogin() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("bhavyajustchill@gmail.com");
  const [password, setPassword] = useState("#1Bhavya#1");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    // If already logged in, go straight to dashboard
    if (getAuthToken()) {
      navigate("/admin/dashboard", { replace: true });
    }
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Please fill in both email and password.");
      return;
    }

    setIsLoading(true);
    try {
      await loginAdmin(email.trim(), password);
      navigate("/admin/dashboard");
    } catch (err) {
      setError(err.message || "Failed to log in. Please check your credentials.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <LightLoginContainer>
      <div className="loginCard">
        <div className="cardHeader">
          <div className="badge">KBC Administration</div>
          <h1>Admin Portal</h1>
          <p>Sign in to manage quiz questions and game data</p>
        </div>

        {error && (
          <div className="errorBanner">
            <span>⚠️</span>
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="formGroup">
            <label htmlFor="admin-email">Admin Email</label>
            <div className="inputWrapper">
              <input
                id="admin-email"
                type="email"
                placeholder="admin@kbc.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
              />
            </div>
          </div>

          <div className="formGroup">
            <label htmlFor="admin-password">Password</label>
            <div className="inputWrapper">
              <input
                id="admin-password"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
              />
              <button
                type="button"
                className="togglePassword"
                onClick={() => setShowPassword((prev) => !prev)}
                title={showPassword ? "Hide password" : "Show password"}>
                {showPassword ? "👁️" : "🙈"}
              </button>
            </div>
          </div>

          <button type="submit" className="submitButton" disabled={isLoading}>
            {isLoading ? "Authenticating..." : "Sign In to Dashboard →"}
          </button>
        </form>

        <div className="footerLinks">
          <Link to="/" className="backLink">
            ← Return to KBC Quiz Game
          </Link>
          <div className="credentialsHint">
            Default Admin: <span>bhavyajustchill@gmail.com</span><br />
            Password: <span>#1Bhavya#1</span>
          </div>
        </div>
      </div>
    </LightLoginContainer>
  );
}
