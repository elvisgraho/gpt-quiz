import React, { useContext, useState } from "react";
import { QuizContext } from "../Functional/QuizContext";
import Question from "../Components/Question";
import ResultsPage from "./ResultsPage"; // Import the ResultsPage component

const QuizPage = () => {
  const { quizData } = useContext(QuizContext);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [submittedAnswers, setSubmittedAnswers] = useState({});
  const [quizCompleted, setQuizCompleted] = useState(false);

  if (!quizData || Object.keys(quizData).length === 0) {
    return (
      <div
        className="container d-flex justify-content-center align-items-center"
        style={{ minHeight: "100vh" }}
      >
        <div className="card shadow p-4 text-center">
          <h2 className="mb-4">No Quiz Data Available</h2>
          {typeof quizData === "object" && (
            <pre className="bg-light p-3 border rounded">
              <code>{JSON.stringify(quizData)}</code>
            </pre>
          )}
          <a href="/" className="btn btn-primary">
            Go Back to Create Quiz
          </a>
        </div>
      </div>
    );
  }

  const onlyShowResultsAtEnd = quizData.onlyShowResultsAtEnd || false;

  const handleNext = () => {
    if (currentQuestionIndex < quizData.quiz.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleQuestionSubmit = (questionIndex, answerData) => {
    setSubmittedAnswers((prevAnswers) => ({
      ...prevAnswers,
      [questionIndex]: answerData,
    }));
  };

  const handleFinish = () => {
    setQuizCompleted(true);
  };

  const progressPercentage =
    ((currentQuestionIndex + 1) / quizData.quiz.length) * 100;

  if (quizCompleted) {
    return (
      <ResultsPage quizData={quizData} submittedAnswers={submittedAnswers} />
    );
  }

  return (
    <div
      className="container d-flex justify-content-center align-items-center"
      style={{ minHeight: "100vh" }}
    >
      <div
        className="card shadow p-5"
        style={{ maxWidth: "600px", width: "100%" }}
      >
        {/* Question Counter */}
        <div className="mb-4">
          <div className="progress">
            <div
              className="progress-bar bg-success"
              role="progressbar"
              style={{ width: `${progressPercentage}%` }}
              aria-valuenow={progressPercentage}
              aria-valuemin="0"
              aria-valuemax="100"
            >
              {currentQuestionIndex + 1}/{quizData.quiz.length}
            </div>
          </div>
        </div>

        {/* Render all questions but display only the current one */}
        {quizData.quiz.map((question, index) => (
          <div
            key={index}
            style={{
              display: index === currentQuestionIndex ? "block" : "none",
            }}
          >
            <Question
              question={question}
              questionIndex={index}
              onSubmit={handleQuestionSubmit}
              submittedAnswer={submittedAnswers[index]}
              onlyShowResultsAtEnd={onlyShowResultsAtEnd} // Pass the setting to Question component
            />
          </div>
        ))}

        {/* Buttons Section */}
        <div className="d-flex justify-content-between mt-4">
          <button
            className="btn btn-secondary"
            onClick={handlePrevious}
            disabled={currentQuestionIndex === 0}
          >
            Previous
          </button>
          {currentQuestionIndex < quizData.quiz.length - 1 ? (
            <button
              className="btn btn-secondary"
              onClick={handleNext}
              disabled={currentQuestionIndex === quizData.quiz.length - 1}
            >
              Next
            </button>
          ) : (
            <button className="btn btn-primary" onClick={handleFinish}>
              Finish
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default QuizPage;
