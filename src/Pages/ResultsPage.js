import React, { useState } from "react";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend, Title } from "chart.js";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Clock, ArrowLeft, History } from "lucide-react";
import { useQuiz } from "../Functional/QuizContext";
import QuizHistoryPanel from "../Components/QuizHistoryPanel";

ChartJS.register(ArcElement, Tooltip, Legend, Title);

const ResultsPage = ({ quizData, submittedAnswers, timeSpent }) => {
  const navigate = useNavigate();
  const [showReview, setShowReview] = useState(false);
  const [currentReviewIndex, setCurrentReviewIndex] = useState(0);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const { quizHistory, deleteFromHistory, clearHistory, setQuizData } = useQuiz();
  const totalQuestions = quizData.quiz.length;
  const wrongQuestionsByType = {};
  let correctAnswersCount = 0;
  let wrongAnswersCount = 0;
  const incorrectQuestions = [];

  const handleCreateQuiz = () => {
    navigate("/");
  };

  quizData.quiz.forEach((question, index) => {
    const userAnswer = submittedAnswers[index];
    const correctAnswer = question.answer;

    let isCorrect = false;

    if (question.type === "multiple") {
      if (
        Array.isArray(userAnswer) &&
        userAnswer.length === correctAnswer.length &&
        userAnswer.every((val) => correctAnswer.includes(val))
      ) {
        isCorrect = true;
      }
    } else {
      if (
        userAnswer !== undefined &&
        userAnswer.toString().toLowerCase().trim() ===
        correctAnswer.toString().toLowerCase().trim()
      ) {
        isCorrect = true;
      }
    }

    if (isCorrect) {
      correctAnswersCount++;
    } else {
      wrongAnswersCount++;
      if (wrongQuestionsByType[question.type]) {
        wrongQuestionsByType[question.type]++;
      } else {
        wrongQuestionsByType[question.type] = 1;
      }

      incorrectQuestions.push({
        question,
        userAnswer,
        index
      });
    }
  });

  const percentageCorrect = (correctAnswersCount / totalQuestions) * 100;
  const averageTimePerQuestion = timeSpent ? (timeSpent / totalQuestions).toFixed(1) : null;

  const pieData = {
    labels: ["Correct", "Wrong"],
    datasets: [
      {
        data: [correctAnswersCount, wrongAnswersCount],
        backgroundColor: ["#22c55e", "#ef4444"],
        hoverBackgroundColor: ["#16a34a", "#dc2626"],
        borderColor: "transparent",
      },
    ],
  };

  const wrongTypesData = {
    labels: Object.keys(wrongQuestionsByType),
    datasets: [
      {
        data: Object.values(wrongQuestionsByType),
        backgroundColor: ["#eab308", "#06b6d4", "#8b5cf6", "#f97316"],
        hoverBackgroundColor: ["#ca8a04", "#0891b2", "#7c3aed", "#ea580c"],
        borderColor: "transparent",
      },
    ],
  };

  const handleHistorySelect = (historyItem) => {
    const quizDataFromHistory = {
      ...historyItem.quizData,
      fromHistory: true
    };
    setQuizData(quizDataFromHistory);
    setIsHistoryOpen(false);
    navigate("/quiz");
  };

  const renderReviewSection = () => {
    if (!showReview || incorrectQuestions.length === 0) return null;

    const currentQuestion = incorrectQuestions[currentReviewIndex];
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mt-6 rounded-lg border bg-card p-6"
      >
        <div className="mb-4 flex items-center justify-between">
          <button
            onClick={() => setShowReview(false)}
            className="flex items-center text-sm text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Results
          </button>
          <span className="text-sm text-muted-foreground">
            {currentReviewIndex + 1} of {incorrectQuestions.length}
          </span>
        </div>
        <h4 className="mb-4 text-lg font-semibold">{currentQuestion.question.question}</h4>
        <div className="mb-4">
          <p className="text-sm text-muted-foreground">Your answer:</p>
          <p className="text-red-500">
            {Array.isArray(currentQuestion.userAnswer)
              ? currentQuestion.userAnswer.map((ans, idx) => (
                <span key={idx} className="block">{ans}</span>
              ))
              : currentQuestion.userAnswer}
          </p>
        </div>
        <div className="mb-4">
          <p className="text-sm text-muted-foreground">Correct answer:</p>
          <p className="text-green-500">
            {Array.isArray(currentQuestion.question.answer)
              ? currentQuestion.question.answer.map((ans, idx) => (
                <span key={idx} className="block">{ans}</span>
              ))
              : currentQuestion.question.answer}
          </p>
        </div>
        {currentQuestion.question.explanation && (
          <div className="mb-4">
            <p className="text-sm text-muted-foreground">Explanation:</p>
            <p className="text-foreground">{currentQuestion.question.explanation}</p>
          </div>
        )}
        <div className="flex justify-between">
          <button
            onClick={() => setCurrentReviewIndex(prev => Math.max(0, prev - 1))}
            disabled={currentReviewIndex === 0}
            className="rounded-md bg-secondary px-4 py-2 text-sm font-medium text-secondary-foreground disabled:opacity-50"
          >
            Previous
          </button>
          <button
            onClick={() => setCurrentReviewIndex(prev => Math.min(incorrectQuestions.length - 1, prev + 1))}
            disabled={currentReviewIndex === incorrectQuestions.length - 1}
            className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </motion.div>
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex min-h-screen items-center justify-center p-4"
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

      <div className="w-full max-w-4xl rounded-lg border bg-card p-6 shadow-lg">
        {quizData.quizTitle && (
          <h2 className="mb-2 text-center text-2xl font-bold text-foreground">
            {quizData.quizTitle}
          </h2>
        )}

        <h3 className="mb-6 text-center text-xl font-semibold text-foreground">
          Quiz Results
        </h3>

        <div className="mb-6">
          <div className="h-2 w-full overflow-hidden rounded-full bg-secondary">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${percentageCorrect}%` }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="h-full bg-primary"
            >
              <span className="sr-only">
                {percentageCorrect.toFixed(0)}% Correct
              </span>
            </motion.div>
          </div>
          <p className="mt-2 text-center text-sm text-muted-foreground">
            {percentageCorrect.toFixed(0)}% Correct
          </p>
        </div>

        {wrongAnswersCount === 0 ? (
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="text-center"
          >
            <h3 className="mb-4 text-xl font-semibold text-green-500">
              Congratulations! Perfect Score!
            </h3>
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              className="mb-6 text-6xl text-yellow-500"
            >
              🏆
            </motion.div>
          </motion.div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h5 className="mb-4 text-center text-sm font-medium text-foreground">
                Correct vs Wrong Answers
              </h5>
              <Pie data={pieData} />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h5 className="mb-4 text-center text-sm font-medium text-foreground">
                Wrong Answers by Question Type
              </h5>
              <Pie data={wrongTypesData} />
            </motion.div>
          </div>
        )}

        {timeSpent && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-6 flex items-center justify-center text-sm text-muted-foreground"
          >
            <Clock className="mr-2 h-4 w-4" />
            <span>Average time per question: {averageTimePerQuestion} seconds</span>
          </motion.div>
        )}

        {renderReviewSection()}

        <div className="mt-8 flex justify-center space-x-4">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleCreateQuiz}
            className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
          >
            Create Quiz
          </motion.button>
          {incorrectQuestions.length > 0 && !showReview && (
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setShowReview(true)}
              className="rounded-md bg-secondary px-4 py-2 text-sm font-medium text-secondary-foreground hover:bg-secondary/90"
            >
              Review Incorrect Answers
            </motion.button>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default ResultsPage;
