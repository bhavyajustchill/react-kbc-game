import { useState } from "react";
import { BrowserRouter, Routes, Route, Navigate, Link } from "react-router-dom";
import HomeScreen from "./pages/HomeScreen";
import StartScreen from "./pages/StartScreen";
import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import "./App.css";

function GameScreen() {
  const [username, setUsername] = useState();

  return (
    <div className="app-container">
      {username ? <HomeScreen /> : <StartScreen setUsername={setUsername} />}
      <footer className="app-footer">
        <span>
          Made with <span className="heart-icon">&#10084;</span> by{" "}
          <a
            href="https://bhavyajustchill.vercel.app"
            target="_blank"
            rel="noopener noreferrer"
            className="footer-link">
            BhavyaJustChill
          </a>
        </span>
        <span className="footer-separator">•</span>
        <Link to="/admin" className="footer-link admin-link" title="Admin Portal">
          🔒 Admin Portal
        </Link>
      </footer>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Main Quiz Game Route */}
        <Route path="/" element={<GameScreen />} />

        {/* Admin Login Route */}
        <Route path="/admin" element={<AdminLogin />} />

        {/* Protected Admin Dashboard Route */}
        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />

        {/* Fallback to Home */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
