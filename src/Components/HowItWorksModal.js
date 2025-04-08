// HowItWorksModal.js
import React from "react";
import { motion, AnimatePresence } from "framer-motion";

const HowItWorksModal = ({ show, handleClose }) => {
  return (
    <AnimatePresence>
      {show && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-background/80 backdrop-blur-sm"
            onClick={handleClose}
            role="presentation"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.2 }}
            className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto"
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-title"
          >
            <div className="rounded-lg border bg-card p-6 shadow-lg">
              <div className="mb-4">
                <h2 id="modal-title" className="text-xl font-semibold text-foreground">
                  How Does This Work?
                </h2>
              </div>

              <div className="space-y-4 text-foreground">
                <p className="text-sm">
                  Create custom quizzes using ChatGPT in three simple steps:
                </p>
                <ol className="list-decimal space-y-2 pl-5 text-sm">
                  <li>
                    <strong>Generate Prompt</strong>: Use the Prompt Generator to create a custom prompt for your quiz.
                  </li>
                  <li>
                    <strong>Get Quiz Data</strong>: Paste the prompt into ChatGPT to generate quiz questions.
                  </li>
                  <li>
                    <strong>Create Quiz</strong>: Copy the generated JSON and paste it here to start your quiz.
                  </li>
                </ol>

                <div className="rounded-md bg-muted p-4 text-sm">
                  <p className="mb-2 font-medium">Quiz Data Format:</p>
                  <pre className="whitespace-pre-wrap break-all text-xs">
                    {`{
  "quiz": [
    {
      "id": "q1",           // Optional
      "question": "...",    // Question text
      "type": "...",       // single/multiple/number/boolean/text
      "options": [...],    // For single/multiple/boolean
      "answer": "...",     // Correct answer
      "explanation": "..." // Optional explanation
    }
  ]
}`}
                  </pre>
                </div>

                <div className="text-sm">
                  <p className="font-medium mb-2">Question Types:</p>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>Single Choice - Choose one correct answer</li>
                    <li>Multiple Choice - Select all correct answers</li>
                    <li>Number - Enter a numerical answer</li>
                    <li>Boolean - True or False</li>
                    <li>Text - Type your answer</li>
                  </ul>
                </div>
              </div>

              <div className="mt-6 flex justify-end">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleClose}
                  className="rounded-md bg-secondary px-4 py-2 text-sm font-medium text-secondary-foreground hover:bg-secondary/80"
                >
                  Close
                </motion.button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default HowItWorksModal;
