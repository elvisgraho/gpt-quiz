import React, {
  useState,
  useEffect,
  forwardRef,
  useImperativeHandle,
} from "react";
import { motion } from "framer-motion";
import ExplanationPanel from "./ExplanationPanel";

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
    const [showExplanation, setShowExplanation] = useState(false);

    const processQuestionText = (text) => {
      if (!text) return "";

      // Split the text by backticks
      const parts = text.split(/(`+)/);
      let result = [];
      let inCodeBlock = false;

      for (let i = 0; i < parts.length; i++) {
        const part = parts[i];

        if (part === '`') {
          inCodeBlock = !inCodeBlock;
          if (inCodeBlock) {
            result.push('<code class="bg-muted/50 dark:bg-muted/80 border border-border/50 dark:border-border/30 px-1.5 py-0.5 rounded font-mono text-sm">');
          } else {
            result.push('</code>');
          }
        } else if (part === '``') {
          // Handle double backticks
          if (i + 1 < parts.length) {
            result.push('<code class="bg-muted/50 dark:bg-muted/80 border border-border/50 dark:border-border/30 px-1.5 py-0.5 rounded font-mono text-sm">');
            result.push(escapeHtml(parts[i + 1]));
            result.push('</code>');
            i++; // Skip the next part as we've already processed it
          }
        } else {
          if (inCodeBlock) {
            result.push(escapeHtml(part));
          } else {
            result.push(part);
          }
        }
      }

      return result.join('');
    };

    // Helper function to escape HTML special characters
    const escapeHtml = (text) => {
      const div = document.createElement('div');
      div.textContent = text;
      return div.innerHTML;
    };

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
        onSubmit(questionIndex, newSelectedOptions);
        setSubmitted(true);
      }
    };

    const handleInputChange = (e) => {
      if (submitted && !onlyShowResultsAtEnd) return;
      const value = e.target.value;
      setUserAnswer(value);

      if (onlyShowResultsAtEnd) {
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

    useImperativeHandle(ref, () => ({
      submitAnswer: handleSubmit,
    }));

    const isUserAnswerCorrect = () => {
      if (!submitted) return false;
      const correctAnswer = question.answer.toString().trim().toLowerCase();
      const userResponse = userAnswer.toString().trim().toLowerCase();
      return userResponse === correctAnswer;
    };

    const getOptionClasses = (option) => {
      if (onlyShowResultsAtEnd) {
        return selectedOptions.includes(option)
          ? "border-primary bg-blue-500/20 text-blue-500 font-medium"
          : "border-border hover:border-primary/50 hover:bg-primary/10";
      }

      if (!submitted) {
        return selectedOptions.includes(option)
          ? "border-primary bg-blue-500/20 text-blue-500 font-medium"
          : "border-border hover:border-primary/50 hover:bg-primary/10";
      }

      const isCorrect = (() => {
        if (Array.isArray(question.answer)) {
          return question.answer.includes(option);
        } else {
          return question.answer.toString() === option.toString();
        }
      })();
      const isSelected = selectedOptions.includes(option);

      if (isCorrect && isSelected) return "border-green-500 bg-green-500/20 text-green-500 font-medium";
      if (!isCorrect && isSelected) return "border-destructive bg-destructive/20 text-destructive font-medium";
      if (isCorrect && !isSelected) return "border-yellow-500 bg-yellow-500/20 text-yellow-500 font-medium";
      return "border-border hover:bg-primary/10";
    };

    const getInputClasses = () => {
      if (onlyShowResultsAtEnd) {
        return "border-border focus:border-primary focus:ring-2 focus:ring-primary/20";
      }

      if (!submitted) return "border-border focus:border-primary focus:ring-2 focus:ring-primary/20";
      return isUserAnswerCorrect()
        ? "border-green-500 bg-green-500/20 text-green-500"
        : "border-destructive bg-destructive/20 text-destructive";
    };

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="space-y-6"
      >
        <div className="text-center">
          <h4
            className="mb-4 text-xl font-semibold text-foreground"
            dangerouslySetInnerHTML={{ __html: processQuestionText(question.question) }}
          />

          {question.type === "multiple" && (
            <p className="mb-4 text-sm text-muted-foreground">
              (multiple choice)
            </p>
          )}
        </div>

        <div className="mb-4 flex flex-col space-y-3">
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
                <motion.div
                  key={index}
                  className={`rounded-lg border p-4 transition-colors ${getOptionClasses(
                    valueOption
                  )} ${submitted && !onlyShowResultsAtEnd
                    ? "cursor-default"
                    : "cursor-pointer"
                    }`}
                  onClick={() => handleChoiceSelection(valueOption)}
                >
                  <p
                    className="text-center text-foreground"
                    dangerouslySetInnerHTML={{ __html: processQuestionText(displayOption) }}
                  />
                </motion.div>
              );
            })
          ) : (
            <div className="space-y-3">
              <input
                type={question.type}
                className={`w-full rounded-md border bg-background p-3 text-foreground transition-colors ${getInputClasses()}`}
                placeholder="Enter your answer"
                value={userAnswer}
                onChange={handleInputChange}
                disabled={submitted && !onlyShowResultsAtEnd}
              />
              {!onlyShowResultsAtEnd && submitted && !isUserAnswerCorrect() && (
                <div className="rounded-md bg-muted p-3 text-sm text-muted-foreground">
                  The correct answer is: <span dangerouslySetInnerHTML={{ __html: processQuestionText(question.answer) }} />
                </div>
              )}
            </div>
          )}
        </div>

        {!onlyShowResultsAtEnd && submitted && question.explanation && (
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            onClick={() => setShowExplanation(true)}
            className="w-full rounded-md bg-secondary px-4 py-2 text-sm font-medium text-secondary-foreground hover:bg-secondary/80"
          >
            Show Explanation
          </motion.button>
        )}

        <ExplanationPanel
          isOpen={showExplanation}
          onClose={() => setShowExplanation(false)}
          explanation={processQuestionText(question.explanation)}
        />
      </motion.div>
    );
  }
);

export default Question;
