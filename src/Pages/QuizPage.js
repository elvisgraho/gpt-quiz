import React, { useState, useRef, useEffect } from "react";
import { useQuiz } from "../Functional/QuizContext";
import Question from "../Components/Question";
import ResultsPage from "./ResultsPage";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Clock, History, Home } from "lucide-react"; // Import Home icon
import QuizHistoryPanel from "../Components/QuizHistoryPanel";
import ConfirmationModal from "../Components/ConfirmationModal"; // Import ConfirmationModal

const QuizPage = () => {
  const {
    quizData,
    quizHistory,
    deleteFromHistory,
    setQuizData,
    clearHistory,
  } = useQuiz();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [submittedAnswers, setSubmittedAnswers] = useState({});
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [timeSpent, setTimeSpent] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(true);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [isAbortModalOpen, setIsAbortModalOpen] = useState(false); // State for abort modal
  const questionRef = useRef(null);
  const timerRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!quizData || Object.keys(quizData).length === 0) {
      navigate("/");
    }
  }, [quizData, navigate]);

  const onlyShowResultsAtEnd = quizData?.onlyShowResultsAtEnd || false;
  const progressPercentage =
    quizData && quizData.quiz
      ? ((currentQuestionIndex + 1) / quizData.quiz.length) * 100
      : 0;
  const isQuestionSubmitted =
    submittedAnswers[currentQuestionIndex] !== undefined;

  useEffect(() => {
    if (isTimerRunning) {
      timerRef.current = setInterval(() => {
        setTimeSpent((prev) => prev + 1);
      }, 1000);
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [isTimerRunning]);

  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;
    let timeString = "";
    if (hours > 0) {
      timeString += `${hours}h `;
    }
    timeString += `${minutes}m ${remainingSeconds
      .toString()
      .padStart(2, "0")}s`;
    return timeString;
  };

  const handleNext = () => {
    if (currentQuestionIndex < quizData.quiz.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    } else {
      navigate("/");
    }
  };

  const handleQuestionSubmit = (questionIndex, answerData) => {
    setSubmittedAnswers((prevAnswers) => ({
      ...prevAnswers,
      [questionIndex]: answerData,
    }));
  };

  const handleFinish = () => {
    setIsTimerRunning(false);
    setQuizCompleted(true);
  };

  const handleSubmit = () => {
    if (questionRef.current) {
      questionRef.current.submitAnswer();
    }
  };

  const handleHistorySelect = (historyItem) => {
    const quizDataFromHistory = {
      ...historyItem.quizData,
      fromHistory: true,
    };
    setQuizData(quizDataFromHistory);
    setIsHistoryOpen(false);
    setCurrentQuestionIndex(0);
    setSubmittedAnswers({});
    setQuizCompleted(false);
    setTimeSpent(0);
    setIsTimerRunning(true);
  };

  const handleAbortConfirm = () => {
    setIsAbortModalOpen(false);
    navigate("/");
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="relative w-full overflow-hidden" // Prevent root scroll
    >
      {/* History Panel FAB (Right) - Only visible when NOT in active quiz */}
      {(quizCompleted || !quizData || Object.keys(quizData).length === 0) && (
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsHistoryOpen(true)}
          className="fixed top-4 right-4 z-40 rounded-full bg-secondary p-3 text-secondary-foreground shadow-lg hover:bg-secondary/80"
          aria-label="Open Quiz History"
        >
          <History className="h-6 w-6" />
        </motion.button>
      )}

      <QuizHistoryPanel
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        history={quizHistory}
        onDelete={deleteFromHistory}
        onSelect={handleHistorySelect}
        onClear={clearHistory}
      />

      {/* Abort/Home FAB (Left) - Only visible during active quiz */}
      {!quizCompleted && quizData && Object.keys(quizData).length > 0 && (
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsAbortModalOpen(true)}
          className="fixed top-4 left-4 z-40 rounded-full bg-destructive p-3 text-destructive-foreground shadow-lg hover:bg-destructive/90"
          aria-label="Abort Quiz and Go Home"
        >
          <Home className="h-6 w-6" />
        </motion.button>
      )}

      {/* Main Content Area */}
      {!quizData || Object.keys(quizData).length === 0 ? (
        // No Quiz Data State
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex min-h-screen items-center justify-center"
        >
          <div className="w-full max-w-md rounded-lg border bg-card p-6 shadow-lg">
            <h2 className="mb-4 text-center text-2xl font-bold text-foreground">
              No Quiz Data Available
            </h2>
            {typeof quizData === "object" && (
              <pre className="mb-4 rounded-md bg-muted p-3 text-sm">
                <code>{JSON.stringify(quizData)}</code>
              </pre>
            )}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate("/")}
              className="w-full rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
            >
              Go Back to Create Quiz
            </motion.button>
          </div>
        </motion.div>
      ) : quizCompleted ? (
        // Results Page State
        <ResultsPage
          quizData={quizData}
          submittedAnswers={submittedAnswers}
          timeSpent={timeSpent}
        />
      ) : (
        // Active Quiz State
        <div className="w-full max-w-4xl mx-auto rounded-lg border bg-card p-6 shadow-lg">
          {" "}
          {/* Use mx-auto for horizontal centering */}
          {/* Quiz Header */}
          <div className="mb-4 flex items-center justify-between">
            {quizData.quizTitle && (
              <h2 className="text-2xl font-bold text-foreground">
                {quizData.quizTitle}
              </h2>
            )}
            <div
              className="flex items-center rounded-full bg-secondary px-4 py-2 text-sm font-medium text-secondary-foreground cursor-pointer hover:bg-secondary/80 transition-colors"
              onClick={() => setIsTimerRunning(!isTimerRunning)}
            >
              <div
                className={
                  !isTimerRunning
                    ? "text-yellow-500 flex justify-center align-center"
                    : "flex justify-center align-center"
                }
              >
                <Clock className="mr-2 h-4 w-4 justify-self-center self-center" />
                <span>{formatTime(timeSpent)}</span>
              </div>
            </div>
          </div>
          {/* Progress Bar */}
          <div className="mb-6">
            <div className="h-2 w-full overflow-hidden rounded-full bg-secondary">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${progressPercentage}%` }}
                transition={{ duration: 0.3 }}
                className="h-full bg-primary"
              >
                <span className="sr-only">
                  {currentQuestionIndex + 1}/{quizData.quiz.length}
                </span>
              </motion.div>
            </div>
            <p className="mt-2 text-center text-sm text-muted-foreground">
              Question {currentQuestionIndex + 1} of {quizData.quiz.length}
            </p>
          </div>
          {/* Question Area */}
          <div className="min-h-[400px]">
            <Question
              key={currentQuestionIndex}
              ref={questionRef}
              question={quizData.quiz[currentQuestionIndex]}
              questionIndex={currentQuestionIndex}
              onSubmit={handleQuestionSubmit}
              submittedAnswer={submittedAnswers[currentQuestionIndex]}
              onlyShowResultsAtEnd={onlyShowResultsAtEnd}
            />
          </div>
          {/* Navigation Buttons */}
          <div className="mt-6 flex justify-between">
            {/* Previous Button - Always show if not first question */}
            {currentQuestionIndex > 0 ? (
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handlePrevious}
                className="rounded-md bg-secondary px-4 py-2 text-sm font-medium text-secondary-foreground hover:bg-secondary/80"
              >
                Previous
              </motion.button>
            ) : (
              <div className="w-[88px]"></div> // Placeholder to keep alignment
            )}

            {/* Submit/Next/Finish Button */}
            {!isQuestionSubmitted && !onlyShowResultsAtEnd ? (
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleSubmit}
                className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
              >
                Submit
              </motion.button>
            ) : currentQuestionIndex < quizData.quiz.length - 1 ? (
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleNext}
                className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
              >
                Next
              </motion.button>
            ) : (
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleFinish}
                className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
              >
                Finish
              </motion.button>
            )}
          </div>
        </div>
      )}

      {/* Abort Confirmation Modal */}
      <ConfirmationModal
        isOpen={isAbortModalOpen}
        onClose={() => setIsAbortModalOpen(false)}
        onConfirm={handleAbortConfirm}
        title="Abort Test?"
        message="Are you sure you want to abort the current test and return home?"
      />
    </motion.div>
  );
};

export default QuizPage;
