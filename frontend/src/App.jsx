import React, { useState, useEffect } from 'react';
import QuizGenerator from './components/QuizGenerator';
import QuizHistory from './components/QuizHistory';
import { BookOpen, History, Sparkles, Zap } from 'lucide-react';
import { motion } from 'framer-motion';

function App() {
  const [activeTab, setActiveTab] = useState(() => {
    return localStorage.getItem('wiki_quiz_active_tab') || 'generate';
  });

  useEffect(() => {
    localStorage.setItem('wiki_quiz_active_tab', activeTab);
  }, [activeTab]);

  return (
    <div className="min-h-screen bg-paper text-black font-sans selection:bg-accent-yellow selection:text-black relative overflow-x-hidden">
      {/* Abstract Background Shapes */}
      <div className="fixed top-20 left-10 w-32 h-32 bg-accent-blue rounded-full opacity-20 blur-3xl pointer-events-none mix-blend-multiply animate-pulse" />
      <div className="fixed bottom-20 right-10 w-40 h-40 bg-accent-pink rounded-full opacity-20 blur-3xl pointer-events-none mix-blend-multiply animate-pulse delay-700" />

      <header className="fixed top-0 left-0 right-0 z-50 bg-white border-b-4 border-black transition-all duration-300">
        <div className="max-w-6xl mx-auto px-6 h-20 flex items-center justify-between">
          <motion.div
            whileHover={{ rotate: -2, scale: 1.05 }}
            className="flex items-center gap-3 cursor-pointer"
          >
            <div className="w-10 h-10 bg-accent-yellow border-2 border-black rounded-lg flex items-center justify-center shadow-neo-sm">
              <BookOpen className="w-5 h-5 text-black" />
            </div>
            <h1 className="text-2xl font-black tracking-tight italic">WikiQuiz</h1>
          </motion.div>

          <nav className="flex gap-4">
            {['generate', 'history'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-2.5 rounded-lg text-sm font-bold border-2 border-black transition-all duration-200 flex items-center gap-2 relative z-10 ${activeTab === tab
                    ? 'bg-black text-white shadow-neo hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-none'
                    : 'bg-white text-black hover:bg-gray-50 hover:-translate-y-1 hover:shadow-neo'
                  }`}
              >
                {tab === 'generate' ? <Zap className="w-4 h-4 fill-current" /> : <History className="w-4 h-4" />}
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </nav>
        </div>
      </header>

      <main className="relative z-10 max-w-4xl mx-auto px-6 pt-32 pb-20">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ type: "spring", bounce: 0.4 }}
        >
          {activeTab === 'generate' ? <QuizGenerator /> : <QuizHistory />}
        </motion.div>
      </main>
    </div>
  );
}

export default App;
