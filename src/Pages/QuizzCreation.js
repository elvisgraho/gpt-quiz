import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { QuizContext } from "../Functional/QuizzContext"; // Import QuizContext
import { someText } from "../Data/copyText"; // Import the text to copy

const QuizCreation = () => {
  const [inputValue, setInputValue] = useState("");
  const [error, setError] = useState("");
  const { setQuizData } = useContext(QuizContext); // Get the setQuizData function from context
  const navigate = useNavigate();
  const [copied, setCopied] = useState(false); // State to track if text is copied

  const handleCreateQuiz = () => {
    try {
      // Parse the input as JSON
      const quizData = JSON.parse(inputValue);

      // Store quiz data in context state
      setQuizData(quizData);

      // Navigate to the Quiz page
      navigate("/quiz");
    } catch (err) {
      setError("Invalid JSON format. Please enter valid JSON.");
    }
  };

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
    setError(""); // Reset error on change
  };

  const handleCopyText = () => {
    navigator.clipboard.writeText(someText).then(
      () => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000); // Show "Copied" for 2 seconds
      },
      (err) => {
        console.error("Could not copy text: ", err);
      }
    );
  };

  return (
    <div
      className="container d-flex justify-content-center align-items-center"
      style={{ minHeight: "100vh" }}
    >
      <div
        className="card shadow p-4"
        style={{ maxWidth: "600px", width: "100%" }}
      >
        <h2 className="text-center mb-4">Create Quiz</h2>

        <div className="form-group mb-3">
          <textarea
            className="form-control"
            placeholder="Enter JSON-formatted quiz data"
            value={inputValue}
            onChange={handleInputChange}
            rows="6"
          />
        </div>

        {error && <p className="text-danger">{error}</p>}

        <div className="d-flex justify-content-between">
          <button
            className="btn btn-secondary me-2"
            onClick={handleCopyText}
            style={{ width: "200px" }}
          >
            {copied ? "Copied!" : "Copy ChatGPT Prompt"}
          </button>
          <button
            className="btn btn-primary"
            onClick={handleCreateQuiz}
            style={{ width: "200px" }}
          >
            Create Quiz
          </button>
        </div>
      </div>
    </div>
  );
};

export default QuizCreation;
