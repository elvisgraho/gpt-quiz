import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import QuizCreation from "./Pages/QuizCreation";
import QuizPage from "./Pages/QuizPage";
import { QuizProvider } from "./Functional/QuizContext";

function App() {
  return (
    <QuizProvider>
      {/* Add a wrapper div with margin classes */}
      <div className="app-container">
        <Router>
          <Routes>
            <Route path="/" element={<QuizCreation />} />
            <Route path="/quiz" element={<QuizPage />} />
          </Routes>
        </Router>
      </div>
    </QuizProvider>
  );
}

export default App;
