import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

const ExplanationPanel = ({ isOpen, onClose, explanation }) => {
  // Helper function to escape HTML special characters
  const escapeHtml = (text) => {
    if (!text) return "";
    const div = document.createElement("div");
    div.textContent = text;
    return div.innerHTML;
  };

  const processExplanationText = (text) => {
    if (!text) return "";

    // 1. Escape HTML initially to prevent XSS from non-markdown/code content
    let processedText = escapeHtml(text);

    // 2. Process Markdown links: [text](url) -> <a href="url" target="_blank" rel="noopener noreferrer">text</a>
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

    return processedText;
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ x: 300, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: 300, opacity: 0 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className="fixed right-0 top-[50%] z-50 w-[300px] -translate-y-[50%] rounded-l-lg border-l border-t border-b bg-card p-4 shadow-lg max-h-[80vh] overflow-y-auto flex flex-col"
        >
          <div className="flex items-center justify-between border-b pb-2 sticky top-0 bg-card">
            <h3 className="text-lg font-semibold">Explanation</h3>
            <button
              onClick={onClose}
              className="rounded-full p-1 hover:bg-muted"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          <div className="flex-1 flex items-center justify-center">
            <div
              className="explanation-content text-sm text-muted-foreground w-full"
              dangerouslySetInnerHTML={{
                __html: processExplanationText(explanation),
              }}
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ExplanationPanel;
