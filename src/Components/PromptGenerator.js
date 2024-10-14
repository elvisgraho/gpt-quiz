import React, { useState } from "react";

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
          number: true,
          boolean: true,
          text: true,
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
    const newAmount = e.target.value;
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
    const selectedQuestionTypes = Object.keys(questionTypes).filter(
      (type) => questionTypes[type]
    );

    // Construct the core prompt based on the mode
    let corePrompt = `The test is about "${topic}"`;
    if (mode === "Document") {
      corePrompt = `The test is based on the document that I will provide you. You can add ideas and questions relevant to the topic in the document provided. If the document has questions and answers already, also use those but rephrase them if possible.`;
    } else if (mode === "Data") {
      corePrompt = `The test is based on the data I will provide you. You can add ideas and questions relevant to the topic in the data provided. If the data has questions and answers already, also use those but rephrase them if possible.`;
    }

    let typesJsonString = "";
    for (let questionType of selectedQuestionTypes) {
      if (questionType === "single") {
        typesJsonString += `{"question":"What is the capital of France?","type":"single","options":["Paris","London","Berlin","Madrid"],"answer":"Paris"},`;
      } else if (questionType === "multiple") {
        corePrompt +=
          " Multiple choice questions can have more than 4 answers.";
        typesJsonString += `{"question":"Which of the following are programming languages?","type":"multiple","options":["Python","HTML","JavaScript","CSS"],"answer":["Python","JavaScript"]},`;
      } else if (questionType === "number") {
        typesJsonString += `{"question":"What is the square root of 16?","type":"number","options":[],"answer":4},`;
      } else if (questionType === "boolean") {
        typesJsonString += `{"question":"Is the Earth flat?","type":"boolean","options":[true,false],"answer":false},`;
      } else if (questionType === "text") {
        typesJsonString += `{"question":"Enter the capital of Germany:","type":"text","options":[],"answer":"Berlin"},`;
      }
    }

    // Remove the trailing comma from typesJsonString
    if (typesJsonString.endsWith(",")) {
      typesJsonString = typesJsonString.slice(0, -1);
    }

    let prompt = `'I want to prepare myself for a test. ${corePrompt}.\nAmountOfQuestions=${amountOfQuestions} SelectedQuestionTypes=${JSON.stringify(
      selectedQuestionTypes
    )}. When providing me with the quiz, please don't say anything else other than JSON quiz data. Never ask personal questions that have no established answers; only ask questions that have straightforward, well-known, and correct answers. The question sample I provided does not reflect actual type distribution; the majority of questions should be type single or multiple. False answers should be within reason and not stand out as wrong. The data you provide should be accessible to copy to clipboard. The questions should be hard; the test should be hard and is meant for experts. You must have a mix of truthful and untruthful questions. Sometimes be creative and present a specific scenario-based or an situation-based question. Here is the example of data structure: {"quiz":[${typesJsonString}]}'`;

    return prompt;
  };

  // Descriptions for each mode
  const modeDescriptions = {
    Topic: "Provide a topic for the quiz to ChatGPT.",
    Document: "Attach a document to ChatGPT and paste this prompt.",
    Data: "Paste data into the textarea and copy the prompt for ChatGPT.",
  };

  return (
    <>
      {/* 3-way toggle */}
      <div className="d-flex justify-content-center mb-3">
        <div className="btn-group" role="group">
          <button
            type="button"
            className={`btn btn-${mode === "Topic" ? "primary" : "secondary"}`}
            onClick={() => handleModeChange("Topic")}
          >
            Topic
          </button>
          <button
            type="button"
            className={`btn btn-${
              mode === "Document" ? "primary" : "secondary"
            }`}
            onClick={() => handleModeChange("Document")}
          >
            Document
          </button>
          <button
            type="button"
            className={`btn btn-${mode === "Data" ? "primary" : "secondary"}`}
            onClick={() => handleModeChange("Data")}
          >
            Data
          </button>
        </div>
      </div>

      {/* Mode description */}
      <div className="text mb-2">
        <small className="text-muted">{modeDescriptions[mode]}</small>
      </div>

      {/* Conditional inputs based on mode */}
      {mode === "Topic" && (
        <div className="form-group mb-3">
          <input
            type="text"
            className="form-control"
            placeholder="Enter topic"
            value={topic}
            onChange={handleTopicChange}
          />
        </div>
      )}

      {mode === "Data" && (
        <div className="form-group mb-3">
          <textarea
            className="form-control"
            placeholder="Enter data"
            value={dataInput}
            onChange={handleDataInputChange}
            rows="4"
          />
        </div>
      )}

      {/* Common inputs */}
      <div className="form-group mb-3">
        <label>Amount of Questions:</label>
        <input
          type="number"
          className="form-control"
          value={amountOfQuestions}
          onChange={handleAmountChange}
          min="1"
        />
      </div>

      <div className="form-group mb-3">
        <label>Question Types:</label>
        <div className="form-check">
          {["single", "multiple", "number", "boolean", "text"].map((type) => (
            <div key={type}>
              <input
                className="form-check-input"
                type="checkbox"
                name={type}
                checked={questionTypes[type]}
                onChange={handleQuestionTypeChange}
                id={type}
              />
              <label className="form-check-label" htmlFor={type}>
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </label>
            </div>
          ))}
        </div>
      </div>

      {/* Copy to clipboard button */}
      <div className="d-flex justify-content-center">
        <button
          className="btn btn-secondary"
          onClick={handleCopyText}
          style={{ width: "250px" }}
        >
          {copied ? "Copied!" : "Copy ChatGPT Prompt"}
        </button>
      </div>
    </>
  );
};

export default PromptGenerator;
