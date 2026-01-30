import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { ExternalLink, Eye, Calendar, ArrowRight, FileText } from 'lucide-react';
import Modal from './Modal';
import QuizDisplay from './QuizDisplay';
import { motion } from 'framer-motion';

const API_URL = `${import.meta.env.VITE_API_URL}/api/quiz`;

export default function QuizHistory() {
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedQuiz, setSelectedQuiz] = useState(null);
    const [modalOpen, setModalOpen] = useState(false);

    useEffect(() => {
        fetchHistory();
    }, []);

    const fetchHistory = async () => {
        try {
            const res = await axios.get(API_URL);
            setHistory(res.data);
        } catch (err) {
            console.error("Failed to fetch history", err);
        } finally {
            setLoading(false);
        }
    };

    const fetchDetails = async (id) => {
        try {
            const res = await axios.get(`${API_URL}/${id}`);
            setSelectedQuiz(res.data);
            setModalOpen(true);
        } catch (err) {
            console.error("Failed to fetch details");
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-8"
        >
            <div className="bg-white p-8 rounded-xl border-4 border-black shadow-neo-lg relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-accent-green rounded-full blur-3xl opacity-50 pointer-events-none" />
                <div className="relative z-10">
                    <h2 className="text-3xl font-black text-black transform -rotate-1 italic inline-block bg-accent-yellow px-2 border-2 border-black shadow-neo-sm mb-2">
                        Past Quizzes
                    </h2>
                    <p className="text-gray-600 font-bold text-lg">Your legendary archive of knowledge.</p>
                </div>
            </div>

            {loading ? (
                <div className="p-12 text-center text-gray-500 animate-pulse">
                    <div className="h-4 bg-gray-200 rounded w-1/4 mx-auto mb-4"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/3 mx-auto"></div>
                </div>
            ) : history.length === 0 ? (
                <div className="p-12 text-center flex flex-col items-center bg-white border-4 border-black rounded-xl shadow-neo border-dashed">
                    <div className="p-4 bg-gray-100 rounded-full mb-4 border-2 border-black">
                        <FileText className="w-8 h-8 text-black" />
                    </div>
                    <p className="text-xl font-black text-black">No quizzes yet!</p>
                    <p className="text-gray-500 font-bold">Generate your first one to start the streak.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {history.map((item, index) => (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05 }}
                            key={item.id}
                            className="bg-white p-6 rounded-xl border-4 border-black shadow-neo hover:shadow-neo-lg hover:-translate-y-2 transition-all group flex flex-col justify-between"
                        >
                            <div className="mb-4">
                                <h3 className="font-black text-xl text-black mb-2 leading-tight line-clamp-2">{item.title}</h3>
                                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-gray-400">
                                    <Calendar className="w-3 h-3" />
                                    {new Date(item.created_at).toLocaleDateString()}
                                </div>
                            </div>

                            <div className="space-y-4">
                                <a
                                    href={item.url}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="text-gray-500 hover:text-accent-blue flex items-center gap-1 text-xs font-bold transition-colors truncate w-full"
                                >
                                    <ExternalLink className="w-3 h-3 shrink-0" />
                                    <span className="truncate">{item.url}</span>
                                </a>

                                <button
                                    onClick={() => fetchDetails(item.id)}
                                    className="w-full py-3 bg-black text-white font-black rounded-lg border-2 border-black shadow-[2px_2px_0px_0px_rgba(255,255,255,0.2)] group-hover:bg-accent-pink group-hover:text-black group-hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all flex items-center justify-center gap-2"
                                >
                                    Review Quiz <ArrowRight className="w-4 h-4" />
                                </button>
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}

            {modalOpen && selectedQuiz && (
                <Modal onClose={() => setModalOpen(false)}>
                    <QuizDisplay data={selectedQuiz} />
                </Modal>
            )}
        </motion.div>
    );
}
