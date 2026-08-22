import { useState } from "react";
import HomeScreen from "./pages/HomeScreen";
import StartScreen from "./pages/StartScreen";
import "./App.css";

function App() {
  const [username, setUsername] = useState();

  return (
    <div className="app-container">
      {username ? <HomeScreen /> : <StartScreen setUsername={setUsername} />}
      <footer className="app-footer">
        Made with <span className="heart-icon">&#10084;</span> by{" "}
        <a
          href="https://bhavyajustchill.vercel.app"
          target="_blank"
          rel="noopener noreferrer"
          className="footer-link">
          BhavyaJustChill
        </a>
      </footer>
    </div>
  );
}

export default App;

