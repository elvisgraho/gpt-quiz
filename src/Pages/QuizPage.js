import React, { useContext, useState, useRef } from "react";
import { QuizContext } from "../Functional/QuizContext";
import Question from "../Components/Question";
import ResultsPage from "./ResultsPage";
import { useNavigate } from "react-router-dom";

const QuizPage = () => {
  const { quizData } = useContext(QuizContext);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [submittedAnswers, setSubmittedAnswers] = useState({});
  const [quizCompleted, setQuizCompleted] = useState(false);
  const questionRef = useRef(null);

  const navigate = useNavigate();

  const onlyShowResultsAtEnd = quizData?.onlyShowResultsAtEnd || false;

  // Calculate progress percentage
  const progressPercentage =
    quizData && quizData.quiz
      ? ((currentQuestionIndex + 1) / quizData.quiz.length) * 100
      : 0;

  // Check if the current question has been submitted
  const isQuestionSubmitted =
    submittedAnswers[currentQuestionIndex] !== undefined;

  // Handler functions
  const handleNext = () => {
    if (currentQuestionIndex < quizData.quiz.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    } else {
      // Navigate back to Create Quiz if on the first question
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
    setQuizCompleted(true);
  };

  const handleSubmit = () => {
    if (questionRef.current) {
      questionRef.current.submitAnswer();
    }
  };

  if (!quizData || Object.keys(quizData).length === 0) {
    return (
      <div
        className="container d-flex justify-content-center align-items-center"
        style={{ minHeight: "calc(100vh - 80px)" }}
      >
        <div className="card shadow p-4 text-center">
          <h2 className="mb-4">No Quiz Data Available</h2>
          {typeof quizData === "object" && (
            <pre className="bg-light p-3 border rounded">
              <code>{JSON.stringify(quizData)}</code>
            </pre>
          )}
          <button onClick={handlePrevious} className="btn btn-primary">
            Go Back to Create Quiz
          </button>
        </div>
      </div>
    );
  }

  if (quizCompleted) {
    return (
      <ResultsPage quizData={quizData} submittedAnswers={submittedAnswers} />
    );
  }

  return (
    <div
      className="container d-flex justify-content-center align-items-center"
      style={{ minHeight: "calc(100vh - 80px)" }}
    >
      <div
        className="card shadow p-3 p-md-5"
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

        {/* Render only the current question with a unique key */}
        <Question
          key={currentQuestionIndex} // Add a unique key based on currentQuestionIndex
          ref={questionRef}
          question={quizData.quiz[currentQuestionIndex]}
          questionIndex={currentQuestionIndex}
          onSubmit={handleQuestionSubmit}
          submittedAnswer={submittedAnswers[currentQuestionIndex]}
          onlyShowResultsAtEnd={onlyShowResultsAtEnd}
        />

        {/* Buttons Section */}
        <div className="d-flex justify-content-between mt-2">
          {currentQuestionIndex === 0 ? (
            <button className="btn btn-danger" onClick={() => navigate("/")}>
              Back to Create Quiz
            </button>
          ) : (
            <button className="btn btn-secondary" onClick={handlePrevious}>
              Previous
            </button>
          )}

          {!isQuestionSubmitted && !onlyShowResultsAtEnd ? (
            <button className="btn btn-primary" onClick={handleSubmit}>
              Submit
            </button>
          ) : currentQuestionIndex < quizData.quiz.length - 1 ? (
            <button className="btn btn-secondary" onClick={handleNext}>
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
