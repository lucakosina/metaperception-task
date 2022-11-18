import logo from "./logo.svg";
import "./App.css";
import { Routes, Route } from "react-router-dom";

import StartPage from "./Components/StartPage";
import MetaPerTut from "./Components/MetaPerTut";
import MetaPerTask from "./Components/MetaPerTask";

function App() {
  return (
    <Routes>
      <Route path="/" element={<StartPage />} />
      <Route path="MetaPerTut" element={<MetaPerTut />} />
      <Route path="MetaPerTask" element={<MetaPerTask />} />
    </Routes>
  );
}

export default App;
