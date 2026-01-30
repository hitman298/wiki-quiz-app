
import React, { useState, useEffect, useRef } from 'react';
import { CheckCircle, XCircle, HelpCircle, Trophy, Book, Users, MapPin, Hash, ArrowRight, Home, RefreshCw } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import clsx from 'clsx';
import confetti from 'canvas-confetti';

export default function QuizDisplay({ data }) {
    const [answers, setAnswers] = useState(() => {
        // Load saved answers specific to this quiz ID to support History/Review mode
        if (!data?.id) return {};

        const storageKey = `wiki_quiz_answers_${data.id}`;
        const saved = localStorage.getItem(storageKey);

        if (saved) {
            try {
                return JSON.parse(saved);
            } catch (e) {
                console.error("Failed to parse saved answers", e);
                return {};
            }
        }
        return {};
    });

    const [showResults, setShowResults] = useState(false);
    const resultsRef = useRef(null);

    // Calculate progress
    const totalQuestions = data.quiz.length;
    const answeredCount = Object.keys(answers).length;
    const progress = (answeredCount / totalQuestions) * 100;

    useEffect(() => {
        if (data?.id) {
            const storageKey = `wiki_quiz_answers_${data.id}`;
            localStorage.setItem(storageKey, JSON.stringify(answers));
        }
    }, [answers, data.id]);

    const handleOptionSelect = (questionIndex, option) => {
        if (showResults) return;
        setAnswers(prev => ({
            ...prev,
            [questionIndex]: option
        }));
    };

    const handleSubmit = () => {
        setShowResults(true);
        // Trigger confetti
        confetti({
            particleCount: 150,
            spread: 70,
            origin: { y: 0.6 },
            colors: ['#000000', '#2563eb', '#db2777']
        });

        // Scroll to results
        setTimeout(() => {
            resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }, 100);
    };

    const calculateScore = () => {
        let score = 0;
        data.quiz.forEach((q, idx) => {
            if (answers[idx] === q.answer) score++;
        });
        return score;
    };

    const score = calculateScore();
    const percentage = Math.round((score / totalQuestions) * 100);

    return (
        <div className="max-w-3xl mx-auto space-y-12">
            {/* Header / Briefing */}
            <motion.div
                initial={{ rotate: 1, scale: 0.95 }}
                animate={{ rotate: 0, scale: 1 }}
                className="bg-white rounded-xl p-8 border-4 border-black shadow-neo-lg relative overflow-hidden"
            >
                <div className="absolute top-0 right-0 w-20 h-20 bg-accent-pink rounded-bl-full border-l-4 border-b-4 border-black z-0" />

                <div className="relative z-10">
                    <h1 className="text-4xl font-black text-black mb-6 uppercase tracking-tight leading-none">{data.title}</h1>
                    <p className="text-gray-800 font-medium leading-relaxed mb-8 text-lg border-l-4 border-accent-blue pl-4">{data.summary}</p>

                    <div className="flex flex-wrap gap-2">
                        {data.related_topics.map((topic, i) => (
                            <span key={i} className="inline-flex items-center px-3 py-1 text-sm font-bold bg-accent-yellow border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] rounded-md hover:-translate-y-1 hover:shadow-neo transition-all cursor-default">
                                {topic}
                            </span>
                        ))}
                    </div>
                </div>
            </motion.div>

            {/* Questions Stream */}
            <div className="space-y-8">
                <div className="flex items-center justify-between pb-2 border-b-4 border-black">
                    <span className="text-base font-black text-black uppercase tracking-widest bg-accent-green px-3 py-1 border-2 border-black shadow-neo-sm transform -rotate-2">
                        Quiz Progress
                    </span>
                    <span className="text-xl font-black text-black">{answeredCount}/{totalQuestions}</span>
                </div>

                {/* Progress Line */}
                {!showResults && (
                    <div className="h-6 bg-white border-4 border-black rounded-full w-full overflow-hidden shadow-neo-sm">
                        <motion.div
                            className="h-full bg-accent-pink border-r-4 border-black"
                            initial={{ width: 0 }}
                            animate={{ width: `${progress}%` }}
                        />
                    </div>
                )}

                <AnimatePresence>
                    {data.quiz.map((q, idx) => {
                        const isCorrect = answers[idx] === q.answer;
                        const userAnswer = answers[idx];
                        const isAnswered = answers[idx] !== undefined;

                        return (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, y: 50 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: idx * 0.1 }}
                                className={clsx(
                                    "p-6 md:p-8 rounded-xl border-4 border-black transition-all duration-300 relative group",
                                    isAnswered ? "bg-white shadow-neo" : "bg-white/80 opacity-90 hover:opacity-100 hover:shadow-neo hover:-translate-y-1"
                                )}
                            >
                                <span className="absolute -top-4 -right-2 text-4xl font-black text-white text-stroke-3 bg-black w-12 h-12 flex items-center justify-center rounded-full border-4 border-white shadow-neo z-20">
                                    {(idx + 1)}
                                </span>

                                <h3 className="text-xl md:text-2xl font-black text-black mb-8 relative z-10 pr-8 leading-snug">
                                    {q.question}
                                </h3>

                                <div className="grid grid-cols-1 gap-4 relative z-10">
                                    {q.options.map((opt, optIdx) => {
                                        const isSelected = userAnswer === opt;
                                        const isTarget = opt === q.answer;
                                        let btnClass = "text-left p-4 rounded-lg border-2 border-black transition-all duration-150 text-base font-bold flex items-center justify-between ";

                                        if (showResults) {
                                            if (isTarget) btnClass += "bg-accent-green text-black shadow-neo";
                                            else if (isSelected && !isTarget) btnClass += "bg-red-400 text-white shadow-neo";
                                            else btnClass += "bg-gray-100 text-gray-400 opacity-60";
                                        } else {
                                            if (isSelected) btnClass += "bg-black text-white shadow-neo transform -translate-y-1";
                                            else btnClass += "bg-white text-black hover:bg-accent-blue hover:shadow-neo hover:-translate-y-1";
                                        }

                                        return (
                                            <button
                                                key={optIdx}
                                                onClick={() => handleOptionSelect(idx, opt)}
                                                className={btnClass}
                                                disabled={showResults}
                                            >
                                                <span>{opt}</span>
                                                {showResults && isTarget && <CheckCircle className="w-6 h-6 text-black fill-white" />}
                                                {showResults && isSelected && !isTarget && <XCircle className="w-6 h-6 text-black fill-white" />}
                                            </button>
                                        );
                                    })}
                                </div>

                                {showResults && (
                                    <motion.div
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: 'auto' }}
                                        className="mt-6 pt-6 border-t-4 border-black bg-accent-yellow -mx-6 -mb-6 p-6 rounded-b-lg border-b-0 border-x-0"
                                    >
                                        <div className="flex gap-3">
                                            <div className="p-2 bg-black rounded-lg h-fit shrink-0 rotate-3">
                                                <Book className="w-5 h-5 text-white" />
                                            </div>
                                            <div>
                                                <span className="font-black text-black block mb-1 uppercase tracking-wider text-sm">Expert Note</span>
                                                <p className="text-black font-medium leading-relaxed">{q.explanation}</p>
                                            </div>
                                        </div>
                                    </motion.div>
                                )}
                            </motion.div>
                        );
                    })}
                </AnimatePresence>
            </div>

            {/* Results Section */}
            <div ref={resultsRef} className="pb-20">
                {!showResults ? (
                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={handleSubmit}
                        disabled={answeredCount < totalQuestions}
                        className="w-full py-6 bg-black text-white text-2xl font-black rounded-xl border-4 border-black shadow-neo-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none transition-all flex items-center justify-center gap-4 hover:-translate-y-2 hover:shadow-[12px_12px_0px_0px_#93c5fd]"
                    >
                        COMPLETE QUIZ <ArrowRight className="w-8 h-8" />
                    </motion.button>
                ) : (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-black text-white rounded-2xl p-8 md:p-12 text-center relative overflow-hidden border-4 border-black shadow-neo-lg"
                    >
                        {/* Background Pattern */}
                        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-20" />

                        <div className="relative z-10">
                            <motion.div
                                initial={{ scale: 0, rotate: -180 }}
                                animate={{ scale: 1, rotate: 0 }}
                                transition={{ type: "spring", delay: 0.2 }}
                                className="w-24 h-24 bg-accent-yellow rounded-full flex items-center justify-center mx-auto mb-6 border-4 border-white shadow-[0_0_20px_rgba(255,255,255,0.3)]"
                            >
                                <Trophy className="w-12 h-12 text-black" />
                            </motion.div>

                            <h2 className="text-5xl font-black mb-2 text-white italic tracking-tighter">QUIZ CRUSHED!</h2>
                            <p className="text-gray-400 mb-10 font-bold text-lg">You absolutely smashed it.</p>

                            <div className="flex flex-col md:flex-row gap-6 justify-center mb-12">
                                <div className="bg-white text-black rounded-xl p-6 border-4 border-black shadow-[4px_4px_0px_0px_#f9a8d4] transform -rotate-2">
                                    <div className="text-4xl font-black">{percentage}%</div>
                                    <div className="text-sm font-bold uppercase tracking-widest bg-black text-white px-2 py-1 -mx-2 mt-2 -rotate-1 inline-block">Accuracy</div>
                                </div>
                                <div className="bg-white text-black rounded-xl p-6 border-4 border-black shadow-[4px_4px_0px_0px_#86efac] transform rotate-2">
                                    <div className="text-4xl font-black">{score}/{totalQuestions}</div>
                                    <div className="text-sm font-bold uppercase tracking-widest bg-black text-white px-2 py-1 -mx-2 mt-2 rotate-1 inline-block">Score</div>
                                </div>
                            </div>

                            <button
                                onClick={() => window.location.reload()}
                                className="bg-accent-blue text-black border-4 border-black px-8 py-4 rounded-xl font-black hover:bg-white hover:-translate-y-1 hover:shadow-neo transition-all inline-flex items-center gap-3 text-lg"
                            >
                                <RefreshCw className="w-6 h-6" /> START NEW ROUND
                            </button>
                        </div>
                    </motion.div>
                )}
            </div>
        </div>
    );
}
