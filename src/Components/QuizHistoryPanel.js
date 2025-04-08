import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, History, Trash2, Play, Trash } from 'lucide-react';

const QuizHistoryPanel = ({ isOpen, onClose, history, onDelete, onSelect, onClear }) => {
    const formatDate = (timestamp) => {
        return new Date(timestamp).toLocaleString();
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ x: -300, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    exit={{ x: -300, opacity: 0 }}
                    transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                    className="fixed left-0 top-0 z-50 h-full w-[300px] border-r bg-card shadow-lg"
                >
                    <div className="flex h-full flex-col">
                        <div className="flex items-center justify-between border-b p-4">
                            <div className="flex items-center gap-2">
                                <History className="h-5 w-5" />
                                <h3 className="text-lg font-semibold">Quiz History</h3>
                            </div>
                            <button
                                onClick={onClose}
                                className="rounded-full p-1 hover:bg-muted"
                            >
                                <X className="h-5 w-5" />
                            </button>
                        </div>

                        <div className="flex items-center justify-between border-b p-4">
                            <p className="text-sm text-muted-foreground">
                                {history.length} {history.length === 1 ? 'item' : 'items'}
                            </p>
                            {history.length > 0 && (
                                <button
                                    onClick={onClear}
                                    className="flex items-center gap-2 rounded-md bg-destructive/10 px-3 py-1.5 text-sm font-medium text-destructive hover:bg-destructive/20"
                                >
                                    <Trash className="h-4 w-4" />
                                    Clear All
                                </button>
                            )}
                        </div>

                        <div className="flex-1 overflow-y-auto p-4">
                            {history.length === 0 ? (
                                <p className="text-center text-sm text-muted-foreground">
                                    No quiz history yet
                                </p>
                            ) : (
                                <div className="space-y-3">
                                    {history.map((item, index) => (
                                        <motion.div
                                            key={item.timestamp}
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: index * 0.1 }}
                                            className="rounded-lg border bg-background p-3"
                                        >
                                            <div className="mb-2 flex items-center justify-between">
                                                <h4 className="font-medium">
                                                    {item.quizData.quizTitle || 'Untitled Quiz'}
                                                </h4>
                                                <button
                                                    onClick={() => onDelete(item.timestamp)}
                                                    className="rounded-full p-1 text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </button>
                                            </div>
                                            <p className="mb-2 text-xs text-muted-foreground">
                                                {formatDate(item.timestamp)}
                                            </p>
                                            <button
                                                onClick={() => onSelect(item)}
                                                className="flex w-full items-center justify-center gap-2 rounded-md bg-primary px-3 py-1.5 text-sm font-medium text-primary-foreground hover:bg-primary/90"
                                            >
                                                <Play className="h-4 w-4" />
                                                Take Quiz Again
                                            </button>
                                        </motion.div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default QuizHistoryPanel; 