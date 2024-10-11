import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import QuizCreation from './Pages/QuizzCreation';
import QuizPage from './Pages/QuizPage';
import { QuizProvider } from './Functional/QuizzContext';

function App() {
  return (
    <QuizProvider>
      <Router>
        <Routes>
          <Route path="/" element={<QuizCreation />} />
          <Route path="/quiz" element={<QuizPage />} />
        </Routes>
      </Router>
    </QuizProvider>
  );
}

export default App;
