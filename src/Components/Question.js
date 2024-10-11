import React, { useState, useEffect } from "react";

const Question = ({ question, questionIndex, onSubmit, submittedAnswer }) => {
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [submitted, setSubmitted] = useState(false);
  const [userAnswer, setUserAnswer] = useState("");

  useEffect(() => {
    if (submittedAnswer !== undefined) {
      setSubmitted(true);
      if (
        question.type === "multiple" ||
        question.type === "single" ||
        question.type === "boolean"
      ) {
        setSelectedOptions(
          Array.isArray(submittedAnswer) ? submittedAnswer : [submittedAnswer]
        );
      } else {
        setUserAnswer(submittedAnswer);
      }
    }
  }, [submittedAnswer, question.type]);

  const handleChoiceSelection = (option) => {
    if (submitted) return;

    if (question.type === "multiple") {
      setSelectedOptions((prev) =>
        prev.includes(option)
          ? prev.filter((item) => item !== option)
          : [...prev, option]
      );
    } else {
      setSelectedOptions([option]);
    }
  };

  const handleInputChange = (e) => {
    if (submitted) return;
    setUserAnswer(e.target.value);
  };

  const handleSubmit = () => {
    setSubmitted(true);
    const answerData =
      question.type === "multiple" ||
      question.type === "single" ||
      question.type === "boolean"
        ? selectedOptions
        : userAnswer;
    onSubmit(questionIndex, answerData);
  };

  const getOptionBgColor = (option) => {
    if (!submitted) {
      return selectedOptions.includes(option) ? "bg-info" : "";
    }
    const isCorrect = (() => {
      if (Array.isArray(question.answer)) {
        return question.answer.includes(option);
      } else {
        return question.answer.toString() === option.toString();
      }
    })();
    const isSelected = selectedOptions.includes(option);
    if (isCorrect && isSelected) return "bg-success text-white";
    if (!isCorrect && isSelected) return "bg-danger text-white";
    if (isCorrect && !isSelected) return "bg-warning text-dark";
    return "";
  };

  const getInputBgColor = () => {
    if (!submitted) return "";
    const correctAnswer = question.answer.toString().trim().toLowerCase();
    const userResponse = userAnswer.toString().trim().toLowerCase();
    return userResponse === correctAnswer
      ? "bg-success text-white"
      : "bg-danger text-white";
  };

  return (
    <div>
      <h4 className="mb-4 text-center">{question.question}</h4>
      <div className="mb-4 d-flex flex-column align-items-stretch">
        {question.type === "multiple" ||
        question.type === "single" ||
        question.type === "boolean" ? (
          (question.type === "boolean"
            ? ["True", "False"]
            : question.options
          ).map((option, index) => {
            const displayOption =
              question.type === "boolean" ? option.toString() : option;
            const valueOption =
              question.type === "boolean"
                ? option.toString().toLowerCase()
                : option;
            return (
              <div
                key={index}
                className={`card mb-2 ${getOptionBgColor(valueOption)}`}
                onClick={() => handleChoiceSelection(valueOption)}
                style={{
                  cursor: submitted ? "default" : "pointer",
                  width: "100%",
                }}
              >
                <div className="card-body text-center">
                  <h5 className="card-title">{displayOption}</h5>
                </div>
              </div>
            );
          })
        ) : (
          <input
            type={question.type}
            className={`form-control mb-3 ${getInputBgColor()}`}
            placeholder="Enter your answer"
            value={userAnswer}
            onChange={handleInputChange}
            disabled={submitted}
          />
        )}
      </div>
      {!submitted && (
        <button className="btn btn-primary" onClick={handleSubmit}>
          Submit
        </button>
      )}
    </div>
  );
};

export default Question;
