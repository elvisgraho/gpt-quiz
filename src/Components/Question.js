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

      // 1. Escape HTML initially to prevent XSS from non-markdown/code content
      let processedText = escapeHtml(text);

      // 2. Process Markdown links: [text](url) -> <a href="url" target="_blank" rel="noopener noreferrer">text</a>
      // Make sure not to process links inside potential future code blocks (though escaping first helps)
      processedText = processedText.replace(
        /\[([^\]]+)\]\(([^)]+)\)/g,
        '<a href="$2" target="_blank" rel="noopener noreferrer" class="text-primary underline hover:text-primary/80">$1</a>'
      );

      // 3. Process code blocks (```code``` or `code`)
      // Handle multiline code blocks first
      processedText = processedText.replace(
        /```([\s\S]*?)```/g,
        (match, codeContent) =>
          `<pre><code class="block whitespace-pre-wrap p-2 rounded bg-muted/50 dark:bg-muted/80 border border-border/50 dark:border-border/30 font-mono text-sm">${codeContent.trim()}</code></pre>`
      );

      // Handle inline code blocks
      processedText = processedText.replace(
        /`([^`]+)`/g,
        (match, codeContent) =>
          `<code class="bg-muted/50 dark:bg-muted/80 border border-border/50 dark:border-border/30 px-1.5 py-0.5 rounded font-mono text-sm">${codeContent}</code>`
      );

      // Allow specific HTML tags (like the links we just created)
      // This is a simplified approach; a more robust solution might use a dedicated sanitizer library.
      // Since we control the link creation, this is relatively safe here.
      // We rely on the initial escapeHtml to sanitize other potentially harmful tags.

      return processedText;
    };

    // Helper function to escape HTML special characters
    const escapeHtml = (text) => {
      const div = document.createElement("div");
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

    // Effect to auto-show explanation on incorrect answer when not showing results at end
    useEffect(() => {
      if (submitted && !onlyShowResultsAtEnd && question.explanation) {
        const isCorrect = (() => {
          if (
            question.type === "multiple" ||
            question.type === "single" ||
            question.type === "boolean"
          ) {
            const correctAnswers = Array.isArray(question.answer)
              ? question.answer.map((a) => a.toString())
              : [question.answer.toString()];
            const selected = Array.isArray(selectedOptions)
              ? selectedOptions.map((s) => s.toString())
              : [selectedOptions.toString()];

            if (question.type === "multiple") {
              // For multiple choice, all correct answers must be selected, and no incorrect answers selected.
              return (
                correctAnswers.length === selected.length &&
                correctAnswers.every((ans) => selected.includes(ans))
              );
            } else {
              // For single/boolean, the selected option must be the correct answer.
              return (
                selected.length === 1 && correctAnswers.includes(selected[0])
              );
            }
          } else {
            // Text input
            return (
              userAnswer.toString().trim().toLowerCase() ===
              question.answer.toString().trim().toLowerCase()
            );
          }
        })();

        if (!isCorrect) {
          setShowExplanation(true);
        }
      }
      // Depend on `submitted` state and the specific question data
    }, [
      submitted,
      onlyShowResultsAtEnd,
      question.explanation,
      question.answer,
      question.type,
      selectedOptions,
      userAnswer,
    ]);

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

      if (isCorrect && isSelected)
        return "border-green-500 bg-green-500/20 text-green-500 font-medium";
      if (!isCorrect && isSelected)
        return "border-destructive bg-destructive/20 text-destructive font-medium";
      if (isCorrect && !isSelected)
        return "border-yellow-500 bg-yellow-500/20 text-yellow-500 font-medium";
      return "border-border hover:bg-primary/10";
    };

    const getInputClasses = () => {
      if (onlyShowResultsAtEnd) {
        return "border-border focus:border-primary focus:ring-2 focus:ring-primary/20";
      }

      if (!submitted)
        return "border-border focus:border-primary focus:ring-2 focus:ring-primary/20";
      return isUserAnswerCorrect()
        ? "border-green-500 bg-green-500/20 text-green-500"
        : "border-destructive bg-destructive/20 text-destructive";
    };

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="space-y-6 flex flex-col items-center justify-center h-full"
      >
        <div className="text-center">
          <h4
            className="mb-4 text-xl font-semibold text-foreground"
            dangerouslySetInnerHTML={{
              __html: processQuestionText(question.question),
            }}
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
                  )} ${
                    submitted && !onlyShowResultsAtEnd
                      ? "cursor-default"
                      : "cursor-pointer"
                  }`}
                  onClick={() => handleChoiceSelection(valueOption)}
                >
                  <p
                    className="text-center text-foreground"
                    dangerouslySetInnerHTML={{
                      __html: processQuestionText(displayOption),
                    }}
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
                  The correct answer is:{" "}
                  <span
                    dangerouslySetInnerHTML={{
                      __html: processQuestionText(question.answer),
                    }}
                  />
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
          explanation={question.explanation} // Pass raw explanation, panel will process
        />
      </motion.div>
    );
  }
);

export default Question;
