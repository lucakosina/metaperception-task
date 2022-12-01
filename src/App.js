import logo from "./logo.svg";
import "./App.css";
import { Routes, Route } from "react-router-dom";

import StartPage from "./Components/StartPage";
import MetaPerTut from "./Components/MetaPerTut";
import MetaPerTask from "./Components/MetaPerTask";
import Questionnaires from "./Components/Questionnaires";

function App() {
  return (
    <Routes>
      <Route path="/" element={<StartPage />} />
      <Route path="MetaPerTut" element={<MetaPerTut />} />
      <Route path="MetaPerTask" element={<MetaPerTask />} />
      <Route path="Questionnaires" element={<Questionnaires />} />
    </Routes>
  );
}

export default App;
