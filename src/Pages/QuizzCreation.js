import React, { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { QuizContext } from "../Functional/QuizzContext";
import PromptGenerator from "../Components/PromptGenerator";

const QuizCreation = () => {
  const [inputValue, setInputValue] = useState("");
  const [onlyShowResultsAtEnd, setOnlyShowResultsAtEnd] = useState(false);
  const [error, setError] = useState("");
  const { setQuizData } = useContext(QuizContext);
  const navigate = useNavigate();

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

  return (
    <div
      className="container d-flex justify-content-center align-items-center"
      style={{ minHeight: "100vh" }}
    >
      <div
        className="card shadow py-5 px-4" // Added padding here
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

        {/* Checkbox for "Only show results at the end" */}
        <div className="form-check mb-3">
          <input
            className="form-check-input"
            type="checkbox"
            id="onlyShowResultsAtEnd"
            checked={onlyShowResultsAtEnd}
            onChange={handleCheckboxChange}
          />
          <label className="form-check-label" htmlFor="onlyShowResultsAtEnd">
            Only show results at the end
          </label>
        </div>

        <div className="d-flex justify-content-center">
          <button
            className="btn btn-primary"
            onClick={handleCreateQuiz}
            style={{ width: "250px" }}
          >
            Create Quiz
          </button>
        </div>

        {/* Horizontal line */}
        <hr />

        {/* PromptGenerator component placed after the horizontal line */}
        <PromptGenerator />
      </div>
    </div>
  );
};

export default QuizCreation;
