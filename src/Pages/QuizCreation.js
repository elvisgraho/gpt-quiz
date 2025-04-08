import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useQuiz } from "../Functional/QuizContext";
import PromptGenerator from "../Components/PromptGenerator";
import HowItWorksModal from "../Components/HowItWorksModal.js"; // Import the modal component
import { shuffleArray } from "../Functional/shuffleArray.js";
import { motion } from "framer-motion";
import { History } from "lucide-react";
import QuizHistoryPanel from "../Components/QuizHistoryPanel";

const QuizCreation = () => {
  const [inputValue, setInputValue] = useState("");
  const [onlyShowResultsAtEnd, setOnlyShowResultsAtEnd] = useState(false);
  const [error, setError] = useState("");
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const { setQuizData, quizHistory, deleteFromHistory, clearHistory } = useQuiz();
  const navigate = useNavigate();

  // State for modal and accordion
  const [showModal, setShowModal] = useState(false);
  const [accordionOpen, setAccordionOpen] = useState(false);

  // Load saved inputValue from localStorage when component mounts
  useEffect(() => {
    const savedInputValue = localStorage.getItem("quizInputValue");
    if (savedInputValue) {
      setInputValue(savedInputValue);
    }
  }, []);

  const handleCreateQuiz = () => {
    try {
      // Parse the input as JSON
      const quizData = JSON.parse(inputValue);

      if (!Array.isArray(quizData.quiz) || quizData.quiz.length <= 0) {
        setError("Invalid JSON data. No questions found.");
        return;
      }

      // 1. Shuffle the questions
      quizData.quiz = shuffleArray(quizData.quiz);

      // 2. Shuffle options for 'single' and 'multiple' type questions
      quizData.quiz = quizData.quiz.map((question) => {
        if (question.type === "single" || question.type === "multiple") {
          question.options = shuffleArray(question.options);
        } else if (question.type === "boolean") {
          // Ensure that 'True' is always first
          question.options = ["True", "False"];
        }
        return question;
      });

      // Store quiz data and settings in context state
      setQuizData({ ...quizData, onlyShowResultsAtEnd });

      // Navigate to the Quiz page
      navigate("/quiz");
    } catch (err) {
      setError("Invalid JSON format. Please enter valid JSON.");
    }
  };

  const handleInputChange = (e) => {
    const newValue = e.target.value;
    setInputValue(newValue);
    setError(""); // Reset error on change

    // Save the new inputValue to localStorage
    localStorage.setItem("quizInputValue", newValue);
  };

  const handleCheckboxChange = (e) => {
    setOnlyShowResultsAtEnd(e.target.checked);
  };

  const handleOpenModal = () => setShowModal(true);
  const handleCloseModal = () => setShowModal(false);

  const toggleAccordion = () => setAccordionOpen(!accordionOpen);

  const handleHistorySelect = (historyItem) => {
    const quizDataFromHistory = {
      ...historyItem.quizData,
      fromHistory: true
    };
    setQuizData(quizDataFromHistory);
    setIsHistoryOpen(false);
    navigate("/quiz");
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="relative w-full"
    >
      <div className="fixed left-4 top-4 z-50 flex gap-2">
        <button
          onClick={() => setIsHistoryOpen(true)}
          className="rounded-full bg-primary p-2 text-primary-foreground shadow-lg hover:bg-primary/90 transition-transform hover:scale-105"
        >
          <History className="h-5 w-5" />
        </button>
      </div>

      <QuizHistoryPanel
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        history={quizHistory}
        onDelete={deleteFromHistory}
        onSelect={handleHistorySelect}
        onClear={clearHistory}
      />

      <div className="rounded-lg border bg-card p-6 shadow-lg">
        <h2 className="mb-2 text-center text-2xl font-bold text-foreground">
          Create Quiz
        </h2>

        <div className="mb-4 text-center">
          <button
            onClick={handleOpenModal}
            className="text-sm text-muted-foreground hover:text-primary"
          >
            How does this work?
          </button>
        </div>

        <HowItWorksModal show={showModal} handleClose={handleCloseModal} />

        <div className="mb-4">
          <textarea
            className="w-full rounded-md border bg-background p-3 text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            placeholder="Enter JSON-formatted quiz data"
            value={inputValue}
            onChange={handleInputChange}
            rows="6"
          />
        </div>

        {error && (
          <p className="mb-4 text-sm text-destructive">{error}</p>
        )}

        <div className="mb-6 flex items-center">
          <input
            type="checkbox"
            id="onlyShowResultsAtEnd"
            checked={onlyShowResultsAtEnd}
            onChange={handleCheckboxChange}
            className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
          />
          <label
            htmlFor="onlyShowResultsAtEnd"
            className="ml-2 text-sm text-foreground"
          >
            Only show results at the end
          </label>
        </div>

        <div className="mb-6 flex justify-center">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleCreateQuiz}
            className="w-full max-w-xs rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
          >
            Create Quiz
          </motion.button>
        </div>

        <div className="border-t border-border pt-6">
          <div
            className="cursor-pointer rounded-lg bg-secondary p-4 text-center text-sm font-medium text-secondary-foreground hover:bg-secondary/80"
            onClick={toggleAccordion}
          >
            {accordionOpen ? "Hide Prompt Generator" : "Show Prompt Generator"}
          </div>

          {accordionOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="mt-4"
            >
              <PromptGenerator />
            </motion.div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default QuizCreation;
