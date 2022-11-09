import logo from "./logo.svg";
import "./App.css";
import { Routes, Route } from "react-router-dom";

import StartPage from "./Components/StartPage";
import  TutorDotsTask from "./Components/TutorDotsTask";

function App() {
  return (

      <Routes>
        <Route path="/" element={<StartPage />}  />
        <Route path="TutorDotsTask" element={<TutorDotsTask/>}  />
      </Routes>

  );
}

export default App;
