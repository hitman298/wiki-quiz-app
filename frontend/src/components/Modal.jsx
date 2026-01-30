import React from 'react';
import { X } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Modal({ children, onClose }) {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-accent-yellow/30 backdrop-blur-md">
            <motion.div
                initial={{ scale: 0.9, opacity: 0, rotate: 2 }}
                animate={{ scale: 1, opacity: 1, rotate: 0 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-white rounded-2xl border-4 border-black shadow-neo-lg w-full max-w-5xl max-h-[90vh] overflow-hidden flex flex-col relative"
            >
                <div className="flex items-center justify-between p-4 border-b-4 border-black bg-white sticky top-0 z-20">
                    <span className="font-black text-xl italic bg-black text-white px-3 py-1 transform -rotate-2">
                        REVIEW MODE
                    </span>
                    <button
                        onClick={onClose}
                        className="p-2 bg-accent-pink border-2 border-black shadow-neo-sm hover:translate-y-[2px] hover:shadow-none transition-all rounded-lg"
                    >
                        <X className="w-6 h-6 text-black" />
                    </button>
                </div>
                <div className="p-6 overflow-y-auto custom-scrollbar">
                    {children}
                </div>
            </motion.div>
        </div>
    );
}
