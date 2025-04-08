import React, { useState } from "react";
import { motion } from "framer-motion";

const PromptGenerator = () => {
  // Initialize state from localStorage or default values
  const [mode, setMode] = useState(localStorage.getItem("pg_mode") || "Topic");
  const [topic, setTopic] = useState(localStorage.getItem("pg_topic") || "");
  const [dataInput, setDataInput] = useState(
    localStorage.getItem("pg_dataInput") || ""
  );
  const [amountOfQuestions, setAmountOfQuestions] = useState(
    parseInt(localStorage.getItem("pg_amountOfQuestions")) || 10
  );
  const [questionTypes, setQuestionTypes] = useState(() => {
    const savedQuestionTypes = localStorage.getItem("pg_questionTypes");
    return savedQuestionTypes
      ? JSON.parse(savedQuestionTypes)
      : {
        single: true,
        multiple: true,
        number: false,
        boolean: true,
        text: false,
      };
  });
  const [copied, setCopied] = useState(false); // State to track if text is copied

  // Handlers to update state and save to localStorage
  const handleModeChange = (newMode) => {
    setMode(newMode);
    localStorage.setItem("pg_mode", newMode);

    // Reset topic and dataInput when mode changes
    setTopic("");
    setDataInput("");
    localStorage.setItem("pg_topic", "");
    localStorage.setItem("pg_dataInput", "");
  };

  const handleTopicChange = (e) => {
    const newTopic = e.target.value;
    setTopic(newTopic);
    localStorage.setItem("pg_topic", newTopic);
  };

  const handleDataInputChange = (e) => {
    const newDataInput = e.target.value;
    setDataInput(newDataInput);
    localStorage.setItem("pg_dataInput", newDataInput);
  };

  const handleAmountChange = (e) => {
    const targetValue = e.target.value;
    let newAmount = targetValue;
    if (targetValue <= 0 || targetValue > 150) {
      // support only between 1 and 150 questions
      newAmount = 10;
    }
    setAmountOfQuestions(newAmount);
    localStorage.setItem("pg_amountOfQuestions", newAmount);
  };

  const handleQuestionTypeChange = (e) => {
    const newQuestionTypes = {
      ...questionTypes,
      [e.target.name]: e.target.checked,
    };
    setQuestionTypes(newQuestionTypes);
    localStorage.setItem("pg_questionTypes", JSON.stringify(newQuestionTypes));
  };

  const handleCopyText = () => {
    const prompt = generatePrompt();
    navigator.clipboard.writeText(prompt).then(
      () => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000); // Show "Copied!" for 2 seconds
      },
      (err) => {
        console.error("Could not copy text: ", err);
      }
    );
  };

  const generatePrompt = () => {
    let selectedQuestionTypes = Object.keys(questionTypes).filter(
      (type) => questionTypes[type]
    );

    if (!selectedQuestionTypes || selectedQuestionTypes.length <= 0) {
      selectedQuestionTypes = Object.keys(questionTypes);
    }

    // Construct the core prompt based on the mode
    let corePrompt = `The test is about "${topic}";`;
    if (mode === "Document") {
      corePrompt = `The test is based on the document provided and must use the document when constructing the questions; If the document has questions and answers already, use them but rephrase them if possible;`;
    } else if (mode === "Data") {
      corePrompt = `The test is based on the data provided. Questions relevant to the topic of the overall theme are allowed; If the data has questions and answers already, use them but rephrase them if possiblel The data for the test: '${dataInput}';`;
    }

    let typesJsonString = "";
    for (let questionType of selectedQuestionTypes) {
      if (questionType === "single") {
        typesJsonString += `{"id":"q1","question":"What is the capital of France?","type":"single","options":["Paris","London","Berlin","Madrid"],"answer":"Paris","explanation":"Paris has been the capital of France since 987 CE."},`;
      } else if (questionType === "multiple") {
        corePrompt +=
          " Multiple choice questions can have more than 4 answers;";
        typesJsonString += `{"id":"q2","question":"Which of the following are programming languages?","type":"multiple","options":["Python","HTML","JavaScript","CSS"],"answer":["Python","JavaScript"],"explanation":"Python and JavaScript are programming languages, while HTML and CSS are markup and styling languages respectively."},`;
      } else if (questionType === "number") {
        typesJsonString += `{"id":"q3","question":"What is the square root of 16?","type":"number","options":[],"answer":4,"explanation":"The square root of 16 is 4 because 4 × 4 = 16."},`;
      } else if (questionType === "boolean") {
        typesJsonString += `{"id":"q4","question":"Is the Earth flat?","type":"boolean","options":[true,false],"answer":false,"explanation":"The Earth is an oblate spheroid, slightly flattened at the poles and bulging at the equator."},`;
      } else if (questionType === "text") {
        typesJsonString += `{"id":"q5","question":"Enter the capital of Germany:","type":"text","options":[],"answer":"Berlin","explanation":"Berlin has been the capital of Germany since the reunification in 1990."},`;
      }
    }

    // Remove the trailing comma from typesJsonString
    if (typesJsonString.endsWith(",")) {
      typesJsonString = typesJsonString.slice(0, -1);
    }

    const corePromptList = [
      // core
      `I want to prepare myself for a test. ${corePrompt};`,
      `Amount of questions: ${amountOfQuestions};`,
      `Allowed question types: ${JSON.stringify(selectedQuestionTypes)};`,
      // questions
      `Personal and abstract questions that have no established answers are not allowed;`,
      `Only questions that are straightforward with well-established answers are allowed;`,
      `Questions which include the answer in the question itself are not allowed;`,
      `The test and the questions should be hard and are for experts;`,
      `The test must have a mix of truthful and untruthful questions;`,
      `The test must have some creative scenario-based or situation-based questions;`,
      `Questions should test deep understanding rather than just memorization;`,
      `Include questions that require analysis, synthesis, and application of knowledge;`,
      `Ensure questions are clear, unambiguous, and free from grammatical errors;`,
      // answers
      `False options and answers should be within reason and not stand out as wrong;`,
      `Do not use A, B, C, D or similar letter prefixes for answer choices - present options as clean text only;`,
      `For multiple choice questions, ensure all options are plausible and well-thought-out;`,
      `For multiple choice questions, avoid using "all of the above" or "none of the above" as options;`,
      `For number questions, provide a reasonable range of possible answers;`,
      `For text questions, be specific about the expected format of the answer;`,
      `For boolean questions, ensure both true and false options are equally plausible;`,
      // output
      `The output must be accessible for clipboard copy;`,
      `When generating an output, don't include anything else other than the output JSON test;`,
      `The question sample provided does not reflect the question type distribution;`,
      `This is the data structure for your response: {"quiz":[${typesJsonString}]};`,
    ];

    const prompt = `${corePromptList.join(" ")}`;

    return prompt;
  };

  // Descriptions for each mode
  const modeDescriptions = {
    Topic: "Provide a topic for the quiz to ChatGPT.",
    Document:
      "Attach a document to ChatGPT and paste this prompt. Hint: for books, it is better to construct the quiz one chapter at a time.",
    Data: "Paste data into the textarea and copy the prompt for ChatGPT.",
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-4"
    >
      <div className="flex justify-center">
        <div className="inline-flex rounded-lg border border-border bg-card p-1">
          {["Topic", "Document", "Data"].map((m) => (
            <motion.button
              key={m}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleModeChange(m)}
              className={`rounded-md px-4 py-2 text-sm font-medium transition-colors ${mode === m
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:text-foreground"
                }`}
            >
              {m}
            </motion.button>
          ))}
        </div>
      </div>

      <p className="text-center text-sm text-muted-foreground">
        {modeDescriptions[mode]}
      </p>

      {mode === "Topic" && (
        <div>
          <input
            type="text"
            className="w-full rounded-md border border-border bg-background p-3 text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            placeholder="Enter topic"
            value={topic}
            onChange={handleTopicChange}
          />
        </div>
      )}

      {mode === "Data" && (
        <div>
          <textarea
            className="w-full rounded-md border border-border bg-background p-3 text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            placeholder="Enter data"
            value={dataInput}
            onChange={handleDataInputChange}
            rows="4"
          />
        </div>
      )}

      <div className="space-y-2">
        <label className="text-sm font-medium text-foreground">
          Amount of Questions: {amountOfQuestions}
        </label>
        <input
          type="range"
          min="1"
          max="150"
          value={amountOfQuestions}
          onChange={handleAmountChange}
          className="w-full h-2 bg-secondary rounded-lg appearance-none cursor-pointer"
        />
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>1</span>
          <span>150</span>
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-foreground">
          Question Types:
        </label>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
          {["single", "multiple", "number", "boolean", "text"].map((type) => (
            <div key={type} className="flex items-center space-x-2">
              <input
                type="checkbox"
                name={type}
                checked={questionTypes[type]}
                onChange={handleQuestionTypeChange}
                id={type}
                className="h-4 w-4 rounded border-border text-primary focus:ring-primary"
              />
              <label
                htmlFor={type}
                className="text-sm text-foreground"
              >
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </label>
            </div>
          ))}
        </div>
      </div>

      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={handleCopyText}
        className="w-full rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
      >
        {copied ? "Copied!" : "Copy to Clipboard"}
      </motion.button>
    </motion.div>
  );
};

export default PromptGenerator;
