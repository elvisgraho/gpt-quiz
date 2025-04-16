import React, { createContext, useState, useContext, useEffect } from "react";

// Create context
export const QuizContext = createContext();

export const useQuiz = () => useContext(QuizContext);

// Provider component
export const QuizProvider = ({ children }) => {
  const [quizData, setQuizData] = useState(null);
  const [quizHistory, setQuizHistory] = useState(() => {
    try {
      const savedHistory = localStorage.getItem("quizHistory");
      if (savedHistory) {
        const parsed = JSON.parse(savedHistory);
        // Validate that the parsed data is an array
        if (Array.isArray(parsed)) {
          return parsed;
        }
      }
      return [];
    } catch (error) {
      console.error("Error loading quiz history:", error);
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem("quizHistory", JSON.stringify(quizHistory));
    } catch (error) {
      console.error("Error saving quiz history:", error);
      // If storage is full, remove oldest items
      if (error.name === "QuotaExceededError") {
        const reducedHistory = quizHistory.slice(
          0,
          Math.floor(quizHistory.length / 2)
        );
        setQuizHistory(reducedHistory);
      }
    }
  }, [quizHistory]);

  const addToHistory = (newQuizData) => {
    // Only add/update history if it's a new quiz, not one loaded from history
    if (!newQuizData.fromHistory && newQuizData.quizTitle) {
      // Ensure quizTitle exists
      setQuizHistory((prev) => {
        const existingIndex = prev.findIndex(
          (item) => item.quizData.quizTitle === newQuizData.quizTitle
        );
        let updatedHistory;

        if (existingIndex > -1) {
          // Quiz exists, update timestamp and move to front
          const existingItem = prev[existingIndex];
          const filteredHistory = prev.filter(
            (_, index) => index !== existingIndex
          );
          updatedHistory = [
            { ...existingItem, timestamp: Date.now(), quizData: newQuizData }, // Update timestamp and potentially quiz data itself
            ...filteredHistory,
          ];
        } else {
          // Quiz doesn't exist, add as new
          updatedHistory = [
            {
              timestamp: Date.now(),
              quizData: newQuizData,
            },
            ...prev,
          ];
        }

        // Limit history to 50 items
        return updatedHistory.slice(0, 50);
      });
    }
  };

  const deleteFromHistory = (timestamp) => {
    setQuizHistory((prev) =>
      prev.filter((item) => item.timestamp !== timestamp)
    );
  };

  const clearHistory = () => {
    setQuizHistory([]);
    try {
      localStorage.removeItem("quizHistory");
    } catch (error) {
      console.error("Error clearing quiz history:", error);
    }
  };

  const setQuizDataWithHistory = (data) => {
    setQuizData(data);
    addToHistory(data);
  };

  return (
    <QuizContext.Provider
      value={{
        quizData,
        setQuizData: setQuizDataWithHistory,
        quizHistory,
        deleteFromHistory,
        clearHistory,
      }}
    >
      {children}
    </QuizContext.Provider>
  );
};
