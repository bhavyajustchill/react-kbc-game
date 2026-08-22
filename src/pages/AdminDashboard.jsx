import React, { useState, useEffect, useMemo } from "react";
import { useNavigate, Link } from "react-router-dom";
import styled from "styled-components";
import {
  fetchQuizQuestions,
  createQuizQuestion,
  updateQuizQuestion,
  deleteQuizQuestion,
  bulkCreateQuizQuestions,
  logoutAdmin,
  getStoredUser,
} from "../services/api";
import defaultQuizData from "../assets/data/quizData.json";

const PRIZE_PRESETS = [
  "₹ 1,000",
  "₹ 2,000",
  "₹ 3,000",
  "₹ 5,000",
  "₹ 10,000",
  "₹ 20,000",
  "₹ 40,000",
  "₹ 80,000",
  "₹ 1,60,000",
  "₹ 3,20,000",
  "₹ 6,40,000",
  "₹ 12,50,000",
  "₹ 25,00,000",
  "₹ 50,00,000",
  "₹ 1,00,00,000",
  "₹ 7,00,00,000",
];

const LightDashboardContainer = styled.div`
  min-height: 100vh;
  background-color: #f8fafc;
  color: #0f172a;
  padding: 0;
  box-sizing: border-box;
  font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;

  * {
    color: inherit;
    box-sizing: border-box;
  }

  /* Sticky Top Navigation */
  .navbar {
    background: #ffffff;
    border-bottom: 1px solid #e2e8f0;
    padding: 14px 32px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    box-shadow: 0 1px 4px rgba(0, 0, 0, 0.05);
    position: sticky;
    top: 0;
    z-index: 1000;

    .brand {
      display: flex;
      align-items: center;
      gap: 12px;

      .logoIcon {
        font-size: 24px;
      }

      .title {
        font-size: 20px;
        font-weight: 800;
        color: #0f172a;
        letter-spacing: -0.5px;
      }

      .adminBadge {
        background: #fef3c7;
        border: 1px solid #f59e0b;
        color: #b45309;
        font-size: 11px;
        font-weight: 700;
        padding: 2px 8px;
        border-radius: 12px;
        text-transform: uppercase;
      }

      .themeBadge {
        background: #f1f5f9;
        border: 1px solid #cbd5e1;
        color: #475569;
        font-size: 11px;
        font-weight: 600;
        padding: 2px 8px;
        border-radius: 12px;
      }
    }

    .navActions {
      display: flex;
      align-items: center;
      gap: 16px;

      .userEmail {
        font-size: 13px;
        font-weight: 600;
        color: #64748b;
      }

      .playGameBtn {
        padding: 8px 16px;
        background: #eff6ff;
        border: 1px solid #bfdbfe;
        border-radius: 8px;
        color: #1d4ed8;
        font-size: 13px;
        font-weight: 700;
        display: flex;
        align-items: center;
        gap: 6px;
        transition: all 0.2s;
        text-decoration: none;

        &:hover {
          background: #dbeafe;
          transform: translateY(-1px);
        }
      }

      .logoutBtn {
        padding: 8px 16px;
        background: #fef2f2;
        border: 1px solid #fecaca;
        border-radius: 8px;
        color: #dc2626;
        font-size: 13px;
        font-weight: 700;
        cursor: pointer;
        transition: all 0.2s;

        &:hover {
          background: #fee2e2;
          transform: translateY(-1px);
        }
      }
    }
  }

  .mainContent {
    max-width: 1280px;
    margin: 0 auto;
    padding: 32px 24px 60px;
  }

  /* Stats Grid */
  .statsGrid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
    gap: 20px;
    margin-bottom: 32px;

    .statCard {
      background: #ffffff;
      border: 1px solid #e2e8f0;
      border-radius: 14px;
      padding: 20px;
      box-shadow: 0 2px 6px rgba(0, 0, 0, 0.04);
      display: flex;
      align-items: center;
      gap: 16px;
      transition: transform 0.2s, box-shadow 0.2s;

      &:hover {
        transform: translateY(-2px);
        box-shadow: 0 6px 16px rgba(0, 0, 0, 0.08);
      }

      .statIcon {
        width: 48px;
        height: 48px;
        border-radius: 12px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 22px;

        &.iconQuestions {
          background: #fef3c7;
          border: 1px solid #fde68a;
        }

        &.iconPrize {
          background: #ecfdf5;
          border: 1px solid #a7f3d0;
        }

        &.iconDb {
          background: #eff6ff;
          border: 1px solid #bfdbfe;
        }
      }

      .statDetails {
        .statLabel {
          font-size: 12px;
          font-weight: 700;
          color: #64748b;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          margin-bottom: 4px;
        }

        .statValue {
          font-size: 22px;
          font-weight: 800;
          color: #0f172a;
        }
      }
    }
  }

  /* Toolbar */
  .toolbar {
    background: #ffffff;
    border: 1px solid #e2e8f0;
    border-radius: 14px;
    padding: 16px 20px;
    margin-bottom: 24px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 16px;
    flex-wrap: wrap;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.03);

    .searchWrapper {
      flex: 1;
      min-width: 250px;
      position: relative;

      input {
        width: 100%;
        padding: 10px 16px 10px 38px;
        background: #f8fafc;
        border: 1.5px solid #cbd5e1;
        border-radius: 8px;
        color: #0f172a;
        font-size: 14px;
        outline: none;
        transition: all 0.2s;

        &:focus {
          border-color: #d97706;
          background: #ffffff;
          box-shadow: 0 0 0 3px rgba(217, 119, 6, 0.15);
        }

        &::placeholder {
          color: #94a3b8;
        }
      }

      .searchIcon {
        position: absolute;
        left: 12px;
        top: 50%;
        transform: translateY(-50%);
        color: #94a3b8;
      }
    }

    .toolbarActions {
      display: flex;
      align-items: center;
      gap: 12px;

      .btn {
        padding: 10px 18px;
        border-radius: 8px;
        font-size: 13px;
        font-weight: 700;
        cursor: pointer;
        display: flex;
        align-items: center;
        gap: 8px;
        transition: all 0.2s;
        border: none;
      }

      .addBtn {
        background: linear-gradient(135deg, #d97706, #b45309);
        color: #ffffff;
        box-shadow: 0 2px 8px rgba(217, 119, 6, 0.3);

        &:hover {
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(217, 119, 6, 0.4);
        }
      }

      .seedBtn {
        background: #f8fafc;
        border: 1px solid #cbd5e1;
        color: #334155;

        &:hover {
          background: #e2e8f0;
        }
      }

      .refreshBtn {
        background: #f8fafc;
        border: 1px solid #cbd5e1;
        color: #334155;

        &:hover {
          background: #e2e8f0;
        }
      }
    }
  }

  /* Notifications / Feedback */
  .feedbackAlert {
    padding: 12px 18px;
    border-radius: 8px;
    margin-bottom: 20px;
    font-size: 13px;
    font-weight: 600;
    display: flex;
    align-items: center;
    justify-content: space-between;

    &.success {
      background: #ecfdf5;
      border: 1px solid #a7f3d0;
      color: #065f46;
    }

    &.error {
      background: #fef2f2;
      border: 1px solid #fecaca;
      color: #991b1b;
    }

    .dismissBtn {
      background: none;
      border: none;
      color: inherit;
      cursor: pointer;
      font-size: 16px;
      font-weight: 700;
    }
  }

  /* Questions Cards Grid */
  .questionsGrid {
    display: flex;
    flex-direction: column;
    gap: 16px;
  }

  .questionCard {
    background: #ffffff;
    border: 1px solid #e2e8f0;
    border-radius: 14px;
    padding: 22px;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.03);
    transition: all 0.2s ease;
    position: relative;

    &:hover {
      border-color: #cbd5e1;
      box-shadow: 0 6px 18px rgba(0, 0, 0, 0.06);
    }

    .cardTop {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 14px;

      .levelBadge {
        display: flex;
        align-items: center;
        gap: 10px;

        .qNum {
          background: #d97706;
          color: #ffffff;
          font-weight: 800;
          font-size: 12px;
          padding: 4px 10px;
          border-radius: 6px;
        }

        .qAmount {
          font-size: 17px;
          font-weight: 800;
          color: #047857;
        }
      }

      .cardActions {
        display: flex;
        align-items: center;
        gap: 8px;

        .editBtn {
          background: #eff6ff;
          border: 1px solid #bfdbfe;
          color: #1d4ed8;
          padding: 6px 14px;
          border-radius: 6px;
          font-size: 12px;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.2s;

          &:hover {
            background: #dbeafe;
            border-color: #93c5fd;
          }
        }

        .deleteBtn {
          background: #fef2f2;
          border: 1px solid #fecaca;
          color: #dc2626;
          padding: 6px 14px;
          border-radius: 6px;
          font-size: 12px;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.2s;

          &:hover {
            background: #fee2e2;
            border-color: #fca5a5;
          }
        }
      }
    }

    .questionText {
      font-size: 16px;
      font-weight: 700;
      color: #0f172a;
      margin-bottom: 18px;
      line-height: 1.5;
    }

    .answersGrid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 10px;

      @media (max-width: 640px) {
        grid-template-columns: 1fr;
      }

      .answerPill {
        padding: 10px 14px;
        border-radius: 8px;
        font-size: 13px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        background: #f8fafc;
        border: 1px solid #e2e8f0;
        color: #334155;

        &.correct {
          background: #ecfdf5;
          border: 1.5px solid #10b981;
          color: #065f46;
          font-weight: 700;

          .correctBadge {
            background: #10b981;
            color: #ffffff;
            font-size: 10px;
            font-weight: 800;
            padding: 2px 8px;
            border-radius: 4px;
            text-transform: uppercase;
          }
        }

        .optLabel {
          font-weight: 800;
          color: #d97706;
          margin-right: 8px;
        }

        .optText {
          flex: 1;
        }
      }
    }
  }

  /* Empty State */
  .emptyState {
    text-align: center;
    padding: 60px 20px;
    background: #ffffff;
    border: 2px dashed #cbd5e1;
    border-radius: 16px;

    .emptyIcon {
      font-size: 48px;
      margin-bottom: 12px;
    }

    h3 {
      font-size: 18px;
      font-weight: 700;
      color: #0f172a;
      margin-bottom: 8px;
    }

    p {
      color: #64748b;
      font-size: 13px;
      margin-bottom: 20px;
    }
  }

  /* Modal Overlay */
  .modalOverlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(15, 23, 42, 0.6);
    backdrop-filter: blur(4px);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 2000;
    padding: 20px;
  }

  .modalCard {
    background: #ffffff;
    border: 1px solid #e2e8f0;
    border-radius: 18px;
    width: 100%;
    max-width: 680px;
    max-height: 90vh;
    overflow-y: auto;
    padding: 30px;
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);

    .modalHeader {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 24px;
      border-bottom: 1px solid #e2e8f0;
      padding-bottom: 16px;

      h2 {
        font-size: 20px;
        font-weight: 800;
        color: #0f172a;
      }

      .closeModalBtn {
        background: none;
        border: none;
        color: #94a3b8;
        font-size: 22px;
        cursor: pointer;

        &:hover {
          color: #0f172a;
        }
      }
    }

    .formRow {
      display: grid;
      grid-template-columns: 1fr 2fr;
      gap: 16px;
      margin-bottom: 18px;

      @media (max-width: 600px) {
        grid-template-columns: 1fr;
      }
    }

    .formGroup {
      margin-bottom: 18px;

      label {
        display: block;
        font-size: 13px;
        font-weight: 700;
        color: #334155;
        margin-bottom: 6px;
      }

      input,
      textarea,
      select {
        width: 100%;
        padding: 12px 14px;
        background: #ffffff;
        border: 1.5px solid #cbd5e1;
        border-radius: 8px;
        color: #0f172a;
        font-size: 14px;
        box-sizing: border-box;

        &:focus {
          outline: none;
          border-color: #d97706;
          box-shadow: 0 0 0 3px rgba(217, 119, 6, 0.15);
        }
      }

      textarea {
        resize: vertical;
        min-height: 80px;
      }
    }

    .optionsSectionHeader {
      font-size: 14px;
      font-weight: 800;
      color: #0f172a;
      margin: 20px 0 12px;
      display: flex;
      align-items: center;
      justify-content: space-between;

      .hint {
        font-size: 12px;
        color: #64748b;
        font-weight: 500;
      }
    }

    .optionInputRow {
      display: flex;
      align-items: center;
      gap: 12px;
      margin-bottom: 10px;

      .optPrefix {
        font-weight: 800;
        color: #d97706;
        width: 20px;
      }

      input {
        flex: 1;
        padding: 10px 14px;
        background: #ffffff;
        border: 1.5px solid #cbd5e1;
        border-radius: 8px;
        color: #0f172a;
        font-size: 13px;

        &:focus {
          outline: none;
          border-color: #d97706;
          box-shadow: 0 0 0 3px rgba(217, 119, 6, 0.15);
        }
      }

      .correctRadio {
        display: flex;
        align-items: center;
        gap: 6px;
        background: #f8fafc;
        border: 1.5px solid #cbd5e1;
        padding: 8px 12px;
        border-radius: 8px;
        cursor: pointer;
        font-size: 12px;
        color: #475569;
        font-weight: 600;
        transition: all 0.2s;

        &.active {
          background: #ecfdf5;
          border-color: #10b981;
          color: #065f46;
          font-weight: 800;
        }

        input {
          cursor: pointer;
          accent-color: #10b981;
        }
      }
    }

    .modalFooter {
      margin-top: 24px;
      padding-top: 16px;
      border-top: 1px solid #e2e8f0;
      display: flex;
      align-items: center;
      justify-content: flex-end;
      gap: 12px;

      .cancelBtn {
        padding: 10px 20px;
        background: #f1f5f9;
        border: 1px solid #cbd5e1;
        color: #334155;
        font-weight: 600;
        border-radius: 8px;
        cursor: pointer;

        &:hover {
          background: #e2e8f0;
        }
      }

      .saveBtn {
        padding: 10px 24px;
        background: linear-gradient(135deg, #d97706, #b45309);
        border: none;
        color: #ffffff;
        font-weight: 700;
        border-radius: 8px;
        cursor: pointer;

        &:hover:not(:disabled) {
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(217, 119, 6, 0.35);
        }

        &:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
      }
    }
  }

  /* Responsive styling */
  @media (max-width: 768px) {
    .navbar {
      padding: 12px 16px;
      flex-direction: column;
      align-items: flex-start;
      gap: 12px;

      .navActions {
        width: 100%;
        justify-content: space-between;
      }
    }

    .mainContent {
      padding: 20px 14px 40px;
    }
  }
`;

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [feedback, setFeedback] = useState(null);

  // Modal State (Used for both Create and Edit)
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingTargetId, setEditingTargetId] = useState(null); // Mongo _id or numeric id
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    id: 1,
    amount: "₹ 1,000",
    question: "",
    options: ["", "", "", ""],
    correctIndex: 0,
  });

  useEffect(() => {
    const stored = getStoredUser();
    setUser(stored);
    loadQuestions();
  }, []);

  const loadQuestions = async () => {
    setIsLoading(true);
    try {
      const data = await fetchQuizQuestions();
      setQuestions(data);
      if (!isEditing) {
        const nextId = data.length > 0 ? Math.max(...data.map((q) => q.id || 0)) + 1 : 1;
        setFormData({
          id: nextId,
          amount: PRIZE_PRESETS[nextId - 1] || "₹ 1,000",
          question: "",
          options: ["", "", "", ""],
          correctIndex: 0,
        });
      }
    } catch (err) {
      setFeedback({ type: "error", message: err.message });
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    logoutAdmin();
    navigate("/admin");
  };

  // Open modal in Create mode
  const handleOpenCreateModal = () => {
    setIsEditing(false);
    setEditingTargetId(null);
    const nextId = questions.length > 0 ? Math.max(...questions.map((q) => q.id || 0)) + 1 : 1;
    setFormData({
      id: nextId,
      amount: PRIZE_PRESETS[nextId - 1] || "₹ 1,000",
      question: "",
      options: ["", "", "", ""],
      correctIndex: 0,
    });
    setIsModalOpen(true);
  };

  // Open modal in Edit mode
  const handleOpenEditModal = (q) => {
    setIsEditing(true);
    setEditingTargetId(q._id || q.id);

    const correctIdx = q.answers?.findIndex((a) => a.correct);
    const opts = q.answers?.map((a) => a.text) || ["", "", "", ""];
    while (opts.length < 4) opts.push("");

    setFormData({
      id: q.id,
      amount: q.amount || "₹ 1,000",
      question: q.question || "",
      options: opts.slice(0, 4),
      correctIndex: correctIdx !== -1 ? correctIdx : 0,
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (question) => {
    const identifier = question._id || question.id;
    const confirm = window.confirm(
      `Are you sure you want to delete Question #${question.id} ("${question.question.substring(0, 30)}...")?`
    );
    if (!confirm) return;

    try {
      await deleteQuizQuestion(identifier);
      setFeedback({
        type: "success",
        message: `Question #${question.id} deleted successfully!`,
      });
      loadQuestions();
    } catch (err) {
      setFeedback({ type: "error", message: err.message });
    }
  };

  const handleBulkSeed = async () => {
    const confirm = window.confirm(
      "Seed / Restore 15 standard KBC questions to the database?"
    );
    if (!confirm) return;

    setIsLoading(true);
    try {
      await bulkCreateQuizQuestions(defaultQuizData);
      setFeedback({
        type: "success",
        message: "Default 15 quiz questions seeded successfully!",
      });
      loadQuestions();
    } catch (err) {
      setFeedback({ type: "error", message: err.message });
    } finally {
      setIsLoading(false);
    }
  };

  const handleOptionChange = (index, value) => {
    const newOptions = [...formData.options];
    newOptions[index] = value;
    setFormData((prev) => ({ ...prev, options: newOptions }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.question.trim()) {
      setFeedback({ type: "error", message: "Question text is required." });
      return;
    }

    if (formData.options.some((opt) => !opt.trim())) {
      setFeedback({
        type: "error",
        message: "All 4 answer options must be filled.",
      });
      return;
    }

    const payload = {
      id: Number(formData.id),
      amount: formData.amount,
      question: formData.question.trim(),
      answers: formData.options.map((optText, idx) => ({
        text: optText.trim(),
        correct: idx === Number(formData.correctIndex),
      })),
    };

    setIsSubmitting(true);
    try {
      if (isEditing && editingTargetId) {
        // Update existing question
        await updateQuizQuestion(editingTargetId, payload);
        setFeedback({
          type: "success",
          message: `Question #${payload.id} updated successfully!`,
        });
      } else {
        // Create new question
        await createQuizQuestion(payload);
        setFeedback({
          type: "success",
          message: `Question #${payload.id} created successfully!`,
        });
      }

      setIsModalOpen(false);
      loadQuestions();
    } catch (err) {
      setFeedback({ type: "error", message: err.message });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Filter questions based on search query
  const filteredQuestions = useMemo(() => {
    if (!searchQuery.trim()) return questions;
    const q = searchQuery.toLowerCase();
    return questions.filter(
      (item) =>
        item.question?.toLowerCase().includes(q) ||
        item.id?.toString().includes(q) ||
        item.amount?.toLowerCase().includes(q)
    );
  }, [questions, searchQuery]);

  const maxPrize = useMemo(() => {
    if (questions.length === 0) return "₹ 0";
    return questions[questions.length - 1]?.amount || "₹ 1,00,00,000";
  }, [questions]);

  const OPTION_LETTERS = ["A", "B", "C", "D"];

  return (
    <LightDashboardContainer>
      {/* Top Navbar */}
      <nav className="navbar">
        <div className="brand">
          <span className="logoIcon">👑</span>
          <span className="title">KBC Question Management</span>
          <span className="adminBadge">Admin</span>
          <span className="themeBadge">☀️ Light Mode</span>
        </div>
        <div className="navActions">
          {user && <span className="userEmail">{user.email}</span>}
          <Link to="/" className="playGameBtn">
            🎮 Play Quiz Game
          </Link>
          <button className="logoutBtn" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </nav>

      <div className="mainContent">
        {/* Feedback Alert */}
        {feedback && (
          <div className={`feedbackAlert ${feedback.type}`}>
            <span>
              {feedback.type === "success" ? "✅" : "⚠️"} {feedback.message}
            </span>
            <button
              className="dismissBtn"
              onClick={() => setFeedback(null)}
              title="Dismiss">
              ✕
            </button>
          </div>
        )}

        {/* Stats Grid */}
        <div className="statsGrid">
          <div className="statCard">
            <div className="statIcon iconQuestions">❓</div>
            <div className="statDetails">
              <div className="statLabel">Total Questions</div>
              <div className="statValue">{questions.length}</div>
            </div>
          </div>
          <div className="statCard">
            <div className="statIcon iconPrize">💰</div>
            <div className="statDetails">
              <div className="statLabel">Top Prize Level</div>
              <div className="statValue">{maxPrize}</div>
            </div>
          </div>
          <div className="statCard">
            <div className="statIcon iconDb">⚡</div>
            <div className="statDetails">
              <div className="statLabel">Database Status</div>
              <div className="statValue" style={{ color: "#059669", fontSize: "18px" }}>
                ● Connected
              </div>
            </div>
          </div>
        </div>

        {/* Toolbar */}
        <div className="toolbar">
          <div className="searchWrapper">
            <span className="searchIcon">🔍</span>
            <input
              type="text"
              placeholder="Search questions by text, level ID, or prize..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="toolbarActions">
            <button className="btn addBtn" onClick={handleOpenCreateModal}>
              ➕ Add New Question
            </button>
            <button className="btn seedBtn" onClick={handleBulkSeed}>
              ⚡ Bulk Import Defaults
            </button>
            <button className="btn refreshBtn" onClick={loadQuestions}>
              🔄 Refresh
            </button>
          </div>
        </div>

        {/* Question Cards Grid */}
        {isLoading ? (
          <div className="emptyState">
            <div className="emptyIcon">⏳</div>
            <h3>Loading Questions from MongoDB...</h3>
          </div>
        ) : filteredQuestions.length === 0 ? (
          <div className="emptyState">
            <div className="emptyIcon">📭</div>
            <h3>No Questions Found</h3>
            <p>
              {searchQuery
                ? "No questions matched your search query."
                : "Your quiz question database is currently empty."}
            </p>
            <button className="btn addBtn" onClick={handleOpenCreateModal}>
              ➕ Add First Question
            </button>
          </div>
        ) : (
          <div className="questionsGrid">
            {filteredQuestions.map((q) => (
              <div key={q._id || q.id} className="questionCard">
                <div className="cardTop">
                  <div className="levelBadge">
                    <span className="qNum">Level {q.id}</span>
                    <span className="qAmount">{q.amount}</span>
                  </div>
                  <div className="cardActions">
                    <button
                      className="editBtn"
                      onClick={() => handleOpenEditModal(q)}
                      title="Edit Question">
                      ✏️ Edit
                    </button>
                    <button
                      className="deleteBtn"
                      onClick={() => handleDelete(q)}
                      title="Delete Question">
                      🗑️ Delete
                    </button>
                  </div>
                </div>

                <div className="questionText">{q.question}</div>

                <div className="answersGrid">
                  {q.answers?.map((ans, idx) => (
                    <div
                      key={idx}
                      className={`answerPill ${ans.correct ? "correct" : ""}`}>
                      <div>
                        <span className="optLabel">{OPTION_LETTERS[idx]}:</span>
                        <span className="optText">{ans.text}</span>
                      </div>
                      {ans.correct && (
                        <span className="correctBadge">✓ Correct</span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add / Edit Question Modal */}
      {isModalOpen && (
        <div className="modalOverlay" onClick={() => setIsModalOpen(false)}>
          <div className="modalCard" onClick={(e) => e.stopPropagation()}>
            <div className="modalHeader">
              <h2>{isEditing ? `✏️ Edit Quiz Question #${formData.id}` : "➕ Add New Quiz Question"}</h2>
              <button
                className="closeModalBtn"
                onClick={() => setIsModalOpen(false)}>
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="formRow">
                <div className="formGroup">
                  <label htmlFor="q-id">Question / Level ID</label>
                  <input
                    id="q-id"
                    type="number"
                    min="1"
                    value={formData.id}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        id: parseInt(e.target.value) || 1,
                      }))
                    }
                    required
                  />
                </div>

                <div className="formGroup">
                  <label htmlFor="q-amount">Prize Amount</label>
                  <input
                    id="q-amount"
                    type="text"
                    list="prize-presets"
                    placeholder="e.g. ₹ 10,000"
                    value={formData.amount}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        amount: e.target.value,
                      }))
                    }
                    required
                  />
                  <datalist id="prize-presets">
                    {PRIZE_PRESETS.map((p, idx) => (
                      <option key={idx} value={p} />
                    ))}
                  </datalist>
                </div>
              </div>

              <div className="formGroup">
                <label htmlFor="q-text">Question Text</label>
                <textarea
                  id="q-text"
                  placeholder="Enter the quiz question here..."
                  value={formData.question}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      question: e.target.value,
                    }))
                  }
                  required
                />
              </div>

              <div className="optionsSectionHeader">
                <span>Answer Options (4 Required)</span>
                <span className="hint">Select the radio button for the correct answer</span>
              </div>

              {formData.options.map((opt, idx) => (
                <div key={idx} className="optionInputRow">
                  <span className="optPrefix">{OPTION_LETTERS[idx]}:</span>
                  <input
                    type="text"
                    placeholder={`Option ${OPTION_LETTERS[idx]} text`}
                    value={opt}
                    onChange={(e) => handleOptionChange(idx, e.target.value)}
                    required
                  />
                  <label
                    className={`correctRadio ${
                      formData.correctIndex === idx ? "active" : ""
                    }`}>
                    <input
                      type="radio"
                      name="correctOption"
                      checked={formData.correctIndex === idx}
                      onChange={() =>
                        setFormData((prev) => ({
                          ...prev,
                          correctIndex: idx,
                        }))
                      }
                    />
                    Correct
                  </label>
                </div>
              ))}

              <div className="modalFooter">
                <button
                  type="button"
                  className="cancelBtn"
                  onClick={() => setIsModalOpen(false)}>
                  Cancel
                </button>
                <button
                  type="submit"
                  className="saveBtn"
                  disabled={isSubmitting}>
                  {isSubmitting
                    ? isEditing
                      ? "Updating..."
                      : "Saving..."
                    : isEditing
                    ? "Update Question →"
                    : "Save Question →"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </LightDashboardContainer>
  );
}
