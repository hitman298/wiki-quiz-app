import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Loader2, AlertCircle, Wand2, Link as LinkIcon, RefreshCw } from 'lucide-react';
import QuizDisplay from './QuizDisplay';
import { motion, AnimatePresence } from 'framer-motion';

const API_URL = `${import.meta.env.VITE_API_URL}/api/quiz/generate`;

export default function QuizGenerator() {
    const [url, setUrl] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [data, setData] = useState(() => {
        const saved = localStorage.getItem('wiki_quiz_current_data');
        return saved ? JSON.parse(saved) : null;
    });

    useEffect(() => {
        if (data) {
            localStorage.setItem('wiki_quiz_current_data', JSON.stringify(data));
        }
    }, [data]);

    const handleGenerate = async (e) => {
        e.preventDefault();
        if (!url) return;

        setLoading(true);
        setError(null);
        // Don't clear data immediately to allow "regenerating" feel or just keep old one visible until new one arrives
        // But user might want to clear, let's clear it to show we are working
        setData(null);
        localStorage.removeItem('wiki_quiz_current_data');

        try {
            const response = await axios.post(API_URL, { url });
            setData(response.data);
            setUrl(''); // Clear input on success
        } catch (err) {
            setError(err.response?.data?.detail || 'Failed to generate quiz. Please check the URL and try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleClear = () => {
        setData(null);
        localStorage.removeItem('wiki_quiz_current_data');
        localStorage.removeItem('wiki_quiz_answers'); // Clear answers too if we clear the quiz
    };

    return (
        <div className="space-y-8">
            <AnimatePresence mode="wait">
                {!data ? (
                    <motion.div
                        initial={{ rotate: -1, scale: 0.9 }}
                        animate={{ rotate: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 50, scale: 0.95 }}
                        className="bg-white p-8 md:p-12 rounded-xl border-4 border-black shadow-neo-lg text-center max-w-2xl mx-auto relative overflow-hidden"
                    >
                        {/* Decorative blobs */}
                        <div className="absolute top-[-20px] left-[-20px] w-24 h-24 bg-accent-yellow rounded-full z-0 border-2 border-black" />
                        <div className="absolute bottom-[-20px] right-[-20px] w-32 h-32 bg-accent-blue rounded-full z-0 border-2 border-black" />

                        <div className="relative z-10">
                            <h2 className="text-4xl font-black mb-4 text-black transform -rotate-1 italic">
                                Turn Wikipedia into a <span className="bg-accent-pink px-2 border-2 border-black text-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] inline-block transform rotate-2">Quiz!</span>
                            </h2>
                            <p className="text-gray-600 mb-10 font-bold text-lg max-w-md mx-auto">
                                Paste any article link and we'll craft a custom study game for you.
                            </p>

                            <form onSubmit={handleGenerate} className="flex flex-col gap-4 max-w-lg mx-auto">
                                <div className="relative group">
                                    <div className="absolute inset-0 bg-black rounded-xl translate-x-2 translate-y-2 transition-transform group-hover:translate-x-3 group-hover:translate-y-3" />
                                    <input
                                        type="url"
                                        placeholder="https://en.wikipedia.org/wiki/..."
                                        className="relative w-full px-6 py-4 bg-white border-2 border-black rounded-xl text-lg font-bold outline-none ring-0 placeholder:text-gray-400 placeholder:font-medium focus:translate-x-[2px] focus:translate-y-[2px] transition-all"
                                        value={url}
                                        onChange={(e) => setUrl(e.target.value)}
                                        required
                                    />
                                </div>

                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.95 }}
                                    type="submit"
                                    disabled={loading}
                                    className="w-full py-4 bg-accent-green text-black text-xl font-black rounded-xl border-2 border-black shadow-neo hover:shadow-neo-lg hover:-translate-y-1 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 active:translate-x-[4px] active:translate-y-[4px] active:shadow-none"
                                >
                                    {loading ? <Loader2 className="w-6 h-6 animate-spin text-black" /> : <>LET'S GO <Wand2 className="w-6 h-6 border-black" /></>}
                                </motion.button>
                            </form>

                            {error && (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="mt-8 p-4 bg-red-100 text-red-900 font-bold rounded-lg border-2 border-red-900 shadow-neo-sm flex items-center justify-center gap-3 transform rotate-1"
                                >
                                    <AlertCircle className="w-6 h-6" />
                                    {error}
                                </motion.div>
                            )}
                        </div>
                    </motion.div>
                ) : (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                    >
                        <div className="flex justify-between items-center mb-8">
                            <h2 className="text-2xl font-black italic bg-white px-4 py-2 border-2 border-black shadow-neo-sm transform -rotate-1">
                                Generated Results!
                            </h2>
                            <button
                                onClick={handleClear}
                                className="px-4 py-2 font-bold text-sm bg-white border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-y-1 hover:shadow-none transition-all rounded-lg flex items-center gap-2"
                            >
                                <RefreshCw className="w-4 h-4" /> New Quiz
                            </button>
                        </div>
                        <QuizDisplay data={data} key={data.url} />
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
