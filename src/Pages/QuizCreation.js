import React, { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { QuizContext } from "../Functional/QuizContext";
import PromptGenerator from "../Components/PromptGenerator";
import HowItWorksModal from "../Components/HowItWorksModal.js"; // Import the modal component
import { shuffleArray } from "../Functional/shuffleArray.js";

const QuizCreation = () => {
  const [inputValue, setInputValue] = useState("");
  const [onlyShowResultsAtEnd, setOnlyShowResultsAtEnd] = useState(false);
  const [error, setError] = useState("");
  const { setQuizData } = useContext(QuizContext);
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

  return (
    <div
      className="container d-flex justify-content-center align-items-center"
      style={{ minHeight: "calc(100vh - 80px)" }}
    >
      <div
        className="card shadow py-4 px-4"
        style={{ maxWidth: "600px", width: "100%" }}
      >
        <h2 className="text-center mb-1">Create Quiz</h2>

        <div className="text-center mb-3">
          <button className="btn btn-link" onClick={handleOpenModal}>
            How does this work?
          </button>
        </div>

        <HowItWorksModal show={showModal} handleClose={handleCloseModal} />

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

        {/* Accordion for PromptGenerator */}
        <div className="accordion" id="promptGeneratorAccordion">
          <div className="card">
            <div
              className="card-header bg-secondary text-white"
              id="headingOne"
              onClick={toggleAccordion}
              style={{ cursor: "pointer" }}
            >
              <p className="mb-0 text-center">
                {accordionOpen
                  ? "Hide Prompt Generator"
                  : "Show Prompt Generator"}
              </p>
            </div>

            {accordionOpen && (
              <div
                id="collapseOne"
                className="collapse show"
                aria-labelledby="headingOne"
              >
                <div className="card-body">
                  {/* PromptGenerator component */}
                  <PromptGenerator />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuizCreation;
