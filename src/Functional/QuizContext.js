import React, { createContext, useState, useContext, useEffect } from 'react';

// Create context
export const QuizContext = createContext();

export const useQuiz = () => useContext(QuizContext);

// Provider component
export const QuizProvider = ({ children }) => {
  const [quizData, setQuizData] = useState(null);
  const [quizHistory, setQuizHistory] = useState(() => {
    try {
      const savedHistory = localStorage.getItem('quizHistory');
      if (savedHistory) {
        const parsed = JSON.parse(savedHistory);
        // Validate that the parsed data is an array
        if (Array.isArray(parsed)) {
          return parsed;
        }
      }
      return [];
    } catch (error) {
      console.error('Error loading quiz history:', error);
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('quizHistory', JSON.stringify(quizHistory));
    } catch (error) {
      console.error('Error saving quiz history:', error);
      // If storage is full, remove oldest items
      if (error.name === 'QuotaExceededError') {
        const reducedHistory = quizHistory.slice(0, Math.floor(quizHistory.length / 2));
        setQuizHistory(reducedHistory);
      }
    }
  }, [quizHistory]);

  const addToHistory = (newQuizData) => {
    // Only add to history if it's a new quiz, not from history
    if (!newQuizData.fromHistory) {
      setQuizHistory(prev => {
        // Limit history to 50 items
        const newHistory = [{
          timestamp: Date.now(),
          quizData: newQuizData
        }, ...prev];
        return newHistory.slice(0, 50);
      });
    }
  };

  const deleteFromHistory = (timestamp) => {
    setQuizHistory(prev => prev.filter(item => item.timestamp !== timestamp));
  };

  const clearHistory = () => {
    setQuizHistory([]);
    try {
      localStorage.removeItem('quizHistory');
    } catch (error) {
      console.error('Error clearing quiz history:', error);
    }
  };

  const setQuizDataWithHistory = (data) => {
    setQuizData(data);
    addToHistory(data);
  };

  return (
    <QuizContext.Provider value={{
      quizData,
      setQuizData: setQuizDataWithHistory,
      quizHistory,
      deleteFromHistory,
      clearHistory
    }}>
      {children}
    </QuizContext.Provider>
  );
};
