// HowItWorksModal.js
import React from "react";

const HowItWorksModal = ({ show, handleClose }) => {
  if (!show) {
    return null;
  }

  return (
    <>
      {/* Backdrop */}
      <div
        className="modal-backdrop fade show"
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          zIndex: 1040,
        }}
      ></div>

      {/* Modal */}
      <div
        className="modal fade show"
        style={{
          display: "block",
          position: "fixed",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          zIndex: 1050,
        }}
        tabIndex="-1"
        role="dialog"
        aria-modal="true"
      >
        <div
          className="modal-dialog"
          role="document"
          style={{ maxWidth: "600px" }}
        >
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">How Does This Work?</h5>
              {/* Removed the close 'X' button */}
            </div>
            <div className="modal-body">
              <p>
                Welcome to the Quiz Creator! Follow these steps to create your
                custom quiz:
              </p>
              <ol>
                <li>
                  <strong>Generate a Prompt</strong>: Click on the{" "}
                  <em>"Show Prompt Generator"</em> button below to open the
                  Prompt Generator. Use it to create a custom prompt tailored to
                  the quiz you want to generate.
                </li>
                <li>
                  <strong>Copy the Prompt</strong>: Once you've generated the
                  prompt, click the <em>"Copy to Clipboard"</em> button to copy
                  the prompt text.
                </li>
                <li>
                  <strong>Use ChatGPT</strong>: Open ChatGPT in a new tab or
                  window. Paste the copied prompt into ChatGPT.
                </li>
                <li>
                  <strong>Get Quiz Data</strong>: ChatGPT will generate quiz
                  data in JSON format based on your prompt.
                </li>
                <li>
                  <strong>Copy Quiz Data</strong>: Copy the JSON-formatted quiz
                  data that ChatGPT provides.
                </li>
                <li>
                  <strong>Paste Quiz Data</strong>: Return to this page and
                  paste the quiz data into the text area above.
                </li>
                <li>
                  <strong>Create the Quiz</strong>: Click the{" "}
                  <em>"Create Quiz"</em> button to load your custom quiz.
                </li>
                <li>
                  <strong>Start the Quiz</strong>: Begin the quiz and enjoy!
                </li>
              </ol>
              <p>
                <strong>Note</strong>: Ensure that the quiz data you paste is in
                valid JSON format to avoid any errors.
              </p>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={handleClose}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default HowItWorksModal;
