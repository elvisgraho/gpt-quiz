import React, {
  useState,
  useEffect,
  forwardRef,
  useImperativeHandle,
} from "react";

const Question = forwardRef(
  (
    {
      question,
      questionIndex,
      onSubmit,
      submittedAnswer,
      onlyShowResultsAtEnd,
    },
    ref
  ) => {
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
      if (submitted && !onlyShowResultsAtEnd) return;

      let newSelectedOptions;
      if (question.type === "multiple") {
        if (selectedOptions.includes(option)) {
          newSelectedOptions = selectedOptions.filter(
            (item) => item !== option
          );
        } else {
          newSelectedOptions = [...selectedOptions, option];
        }
      } else {
        newSelectedOptions = [option];
      }
      setSelectedOptions(newSelectedOptions);

      if (onlyShowResultsAtEnd) {
        // Auto-submit
        onSubmit(questionIndex, newSelectedOptions);
        setSubmitted(true);
      }
    };

    const handleInputChange = (e) => {
      if (submitted && !onlyShowResultsAtEnd) return;
      const value = e.target.value;
      setUserAnswer(value);

      if (onlyShowResultsAtEnd) {
        // Auto-submit
        onSubmit(questionIndex, value);
        setSubmitted(true);
      }
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

    // Expose handleSubmit to parent via ref
    useImperativeHandle(ref, () => ({
      submitAnswer: handleSubmit,
    }));

    const isUserAnswerCorrect = () => {
      if (!submitted) return false;
      const correctAnswer = question.answer.toString().trim().toLowerCase();
      const userResponse = userAnswer.toString().trim().toLowerCase();
      return userResponse === correctAnswer;
    };

    const getOptionBgColor = (option) => {
      if (onlyShowResultsAtEnd) {
        return selectedOptions.includes(option) ? "bg-info" : "";
      }

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
      if (onlyShowResultsAtEnd) {
        return "";
      }

      if (!submitted) return "";
      return isUserAnswerCorrect()
        ? "bg-success text-white"
        : "bg-danger text-white";
    };

    return (
      <div>
        <h4 className="mb-4 text-center">{question.question}</h4>

        {question.type === "multiple" && (
          <p className="text-muted text-center">(multiple choice)</p>
        )}

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
                    cursor:
                      submitted && !onlyShowResultsAtEnd
                        ? "default"
                        : "pointer",
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
            <div>
              <input
                type={question.type}
                className={`form-control mb-3 ${getInputBgColor()}`}
                placeholder="Enter your answer"
                value={userAnswer}
                onChange={handleInputChange}
                disabled={submitted && !onlyShowResultsAtEnd}
              />
              {/* Display correct answer if submitted and incorrect */}
              {!onlyShowResultsAtEnd && submitted && !isUserAnswerCorrect() && (
                <div className="alert alert-info">
                  The correct answer is: {question.answer}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    );
  }
);

export default Question;
