import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import QuizCreation from "./Pages/QuizCreation";
import QuizPage from "./Pages/QuizPage";
import { QuizProvider } from "./Functional/QuizContext";
import ThemeToggle from "./Components/ThemeToggle";

function App() {
  return (
    <QuizProvider>
      <div className="flex min-h-screen flex-col bg-background text-foreground transition-colors duration-200">
        <ThemeToggle />
        <Router basename="/gpt-quiz">
          <main className="flex flex-1 items-center justify-center p-4">
            <div className="w-full max-w-4xl">
              <Routes>
                <Route path="/" element={<QuizCreation />} />
                <Route path="/quiz" element={<QuizPage />} />
              </Routes>
            </div>
          </main>
        </Router>
      </div>
    </QuizProvider>
  );
}

export default App;
