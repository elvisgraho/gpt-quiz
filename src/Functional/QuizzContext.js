import React, { createContext, useState } from 'react';

// Create context
export const QuizContext = createContext();

// Provider component
export const QuizProvider = ({ children }) => {
  const [quizData, setQuizData] = useState(null);

  return (
    <QuizContext.Provider value={{ quizData, setQuizData }}>
      {children}
    </QuizContext.Provider>
  );
};
