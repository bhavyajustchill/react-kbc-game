import { useState } from "react";
import HomeScreen from "./pages/HomeScreen";
import StartScreen from "./pages/StartScreen";
import "./App.css";

function App() {
  const [username, setUsername] = useState(null);

  return <>{username ? <HomeScreen /> : <StartScreen setUsername={setUsername} />}</>;
}

export default App;

