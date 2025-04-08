import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

const ExplanationPanel = ({ isOpen, onClose, explanation }) => {
    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ x: 300, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    exit={{ x: 300, opacity: 0 }}
                    transition={{ type: 'spring', damping: 25, stiffness: 300 }}
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
                        <div className="text-sm text-muted-foreground" dangerouslySetInnerHTML={{ __html: explanation }} />
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default ExplanationPanel; 