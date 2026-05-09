import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Timer, Trophy, ChevronRight, RotateCcw, Play, CheckCircle2, XCircle, Brain, Book, Share2, Languages, Calculator, Flag } from 'lucide-react';
import { QUESTION_BANK } from './constants';
import { AppState, Question, QuizState } from './types';

const TIMER_DURATION = 60;

export default function App() {
  const [appState, setAppState] = useState<AppState>('setup');
  const [questionCount, setQuestionCount] = useState(10);
  const [quiz, setQuiz] = useState<QuizState | null>(null);

  // Shuffle questions randomly
  const shuffleQuestions = useCallback((count: number): Question[] => {
    // We might not have 100 questions yet, so we cap at actual length
    const shuffled = [...QUESTION_BANK].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, Math.min(count, shuffled.length));
  }, []);

  const startTest = () => {
    const selectedQuestions = shuffleQuestions(questionCount);
    setQuiz({
      questions: selectedQuestions,
      currentQuestionIndex: 0,
      score: 0,
      answers: new Array(selectedQuestions.length).fill(null),
      timeRemaining: TIMER_DURATION,
    });
    setAppState('quiz');
  };

  const handleAnswer = (optionIndex: number) => {
    if (!quiz) return;
    
    const isCorrect = optionIndex === quiz.questions[quiz.currentQuestionIndex].correctAnswer;
    const newAnswers = [...quiz.answers];
    newAnswers[quiz.currentQuestionIndex] = optionIndex;

    setQuiz({
      ...quiz,
      score: isCorrect ? quiz.score + 1 : quiz.score,
      answers: newAnswers,
    });

    // Move to next question after a brief delay for feedback
    setTimeout(() => {
      moveToNextQuestion();
    }, 400);
  };

  const moveToNextQuestion = useCallback(() => {
    setQuiz((prev) => {
      if (!prev) return null;
      if (prev.currentQuestionIndex + 1 >= prev.questions.length) {
        setAppState('result');
        return prev;
      }
      return {
        ...prev,
        currentQuestionIndex: prev.currentQuestionIndex + 1,
        timeRemaining: TIMER_DURATION,
      };
    });
  }, []);

  // Timer logic
  useEffect(() => {
    if (appState !== 'quiz' || !quiz) return;

    const interval = setInterval(() => {
      setQuiz((prev) => {
        if (!prev) return null;
        if (prev.timeRemaining <= 1) {
          // Time's up for current question
          moveToNextQuestion();
          return prev;
        }
        return {
          ...prev,
          timeRemaining: prev.timeRemaining - 1,
        };
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [appState, quiz?.currentQuestionIndex, moveToNextQuestion]);

  const restartTest = () => {
    setAppState('setup');
    setQuiz(null);
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white font-sans selection:bg-orange-500 selection:text-white">
      {/* Background decoration */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none opacity-20">
        <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-orange-900 rounded-full blur-[120px]" />
        <div className="absolute -bottom-[10%] -right-[10%] w-[40%] h-[40%] bg-blue-900 rounded-full blur-[120px]" />
      </div>

      <main className="relative z-10 max-w-2xl mx-auto px-6 py-12 min-h-screen flex flex-col justify-center">
        <AnimatePresence mode="wait">
          {appState === 'setup' && (
            <motion.div
              key="setup"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-8"
              id="setup-screen"
            >
              <div className="text-center space-y-4">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-orange-500/10 border border-orange-500/20 mb-4">
                  <Play className="w-8 h-8 text-orange-500 fill-orange-500" />
                </div>
                <h1 className="text-5xl font-bold tracking-tight italic border-b-2 border-orange-500 inline-block px-2">
                  TESTER
                </h1>
                <p className="text-gray-400 text-lg">Online MCQs Exam System</p>
              </div>

              <div className="bg-[#151619] border border-white/5 rounded-3xl p-8 space-y-6 shadow-2xl shadow-black/50">
                <div className="space-y-4">
                  <label className="text-xs uppercase tracking-widest font-mono text-orange-500/80">
                    Test Configuration
                  </label>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center text-sm font-medium">
                      <span>Number of Questions</span>
                      <span className="text-orange-500 font-mono bg-orange-500/10 px-2 py-0.5 rounded">
                        {questionCount} Questions
                      </span>
                    </div>
                    <input
                      type="range"
                      min="5"
                      max="100"
                      value={questionCount}
                      onChange={(e) => setQuestionCount(parseInt(e.target.value))}
                      className="w-full h-1.5 bg-white/10 rounded-full appearance-none cursor-pointer accent-orange-500"
                    />
                    <div className="flex justify-between text-[10px] text-gray-500 font-mono">
                      <span>5</span>
                      <span>25</span>
                      <span>50</span>
                      <span>75</span>
                      <span>100</span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  <div className="p-3 rounded-xl bg-white/5 border border-white/5 flex items-center gap-2">
                    <div className="p-1.5 rounded-lg bg-blue-500/10">
                      <Brain className="w-4 h-4 text-blue-400" />
                    </div>
                    <div>
                      <p className="text-[9px] uppercase font-mono text-gray-500">Subject</p>
                      <p className="text-xs font-semibold">Comp Sci</p>
                    </div>
                  </div>
                  <div className="p-3 rounded-xl bg-white/5 border border-white/5 flex items-center gap-2">
                    <div className="p-1.5 rounded-lg bg-green-500/10">
                      <Book className="w-4 h-4 text-green-400" />
                    </div>
                    <div>
                      <p className="text-[9px] uppercase font-mono text-gray-500">Subject</p>
                      <p className="text-xs font-semibold">Islamics</p>
                    </div>
                  </div>
                  <div className="p-3 rounded-xl bg-white/5 border border-white/5 flex items-center gap-2">
                    <div className="p-1.5 rounded-lg bg-purple-500/10">
                      <Share2 className="w-4 h-4 text-purple-400" />
                    </div>
                    <div>
                      <p className="text-[9px] uppercase font-mono text-gray-500">Subject</p>
                      <p className="text-xs font-semibold">Social Media</p>
                    </div>
                  </div>
                  <div className="p-3 rounded-xl bg-white/5 border border-white/5 flex items-center gap-2">
                    <div className="p-1.5 rounded-lg bg-yellow-500/10">
                      <Languages className="w-4 h-4 text-yellow-400" />
                    </div>
                    <div>
                      <p className="text-[9px] uppercase font-mono text-gray-500">Subject</p>
                      <p className="text-xs font-semibold">English</p>
                    </div>
                  </div>
                  <div className="p-3 rounded-xl bg-white/5 border border-white/5 flex items-center gap-2">
                    <div className="p-1.5 rounded-lg bg-red-500/10">
                      <Calculator className="w-4 h-4 text-red-400" />
                    </div>
                    <div>
                      <p className="text-[9px] uppercase font-mono text-gray-500">Subject</p>
                      <p className="text-xs font-semibold">Math</p>
                    </div>
                  </div>
                  <div className="p-3 rounded-xl bg-white/5 border border-white/5 flex items-center gap-2">
                    <div className="p-1.5 rounded-lg bg-emerald-500/10">
                      <Flag className="w-4 h-4 text-emerald-400" />
                    </div>
                    <div>
                      <p className="text-[9px] uppercase font-mono text-gray-500">Subject</p>
                      <p className="text-xs font-semibold">Pak Study</p>
                    </div>
                  </div>
                </div>

                <button
                  onClick={startTest}
                  className="w-full py-4 bg-orange-500 hover:bg-orange-600 active:scale-[0.98] transition-all rounded-2xl font-bold flex items-center justify-center gap-2 text-black shadow-lg shadow-orange-500/20"
                  id="start-btn"
                >
                  START TEST <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </motion.div>
          )}

          {appState === 'quiz' && quiz && (
            <motion.div
              key="quiz"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.05 }}
              className="space-y-6"
              id="quiz-screen"
            >
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-[10px] uppercase tracking-[0.2em] font-mono text-gray-500">Progress</p>
                  <p className="text-lg font-mono">
                    {String(quiz.currentQuestionIndex + 1).padStart(2, '0')} 
                    <span className="text-gray-600 mx-1">/</span> 
                    {String(quiz.questions.length).padStart(2, '0')}
                  </p>
                </div>
                
                <div className={`p-4 rounded-2xl bg-[#151619] border border-white/5 flex items-center gap-3 transition-colors ${quiz.timeRemaining <= 10 ? 'border-red-500/50 bg-red-500/5' : ''}`}>
                  <Timer className={`w-5 h-5 transition-colors ${quiz.timeRemaining <= 10 ? 'text-red-500 animate-pulse' : 'text-orange-500'}`} />
                  <div>
                    <p className="text-[10px] uppercase font-mono text-gray-500">Time Left</p>
                    <p className={`text-xl font-mono leading-none ${quiz.timeRemaining <= 10 ? 'text-red-500' : 'text-white'}`}>
                      {quiz.timeRemaining}s
                    </p>
                  </div>
                </div>
              </div>

              <div className="h-1 bg-white/10 rounded-full overflow-hidden">
                <motion.div 
                  className="h-full bg-orange-500"
                  initial={{ width: 0 }}
                  animate={{ width: `${((quiz.currentQuestionIndex) / quiz.questions.length) * 100}%` }}
                />
              </div>

              <div className="bg-[#151619] border border-white/5 rounded-3xl p-8 space-y-8 shadow-2xl">
                <div className="space-y-2">
                  <span className={`px-2 py-0.5 text-[10px] uppercase tracking-widest rounded-md font-mono border ${
                    quiz.questions[quiz.currentQuestionIndex].category === 'Computer Science' 
                    ? 'border-blue-500/30 text-blue-400 bg-blue-500/5' 
                    : quiz.questions[quiz.currentQuestionIndex].category === 'Social Media'
                      ? 'border-purple-500/30 text-purple-400 bg-purple-500/5'
                      : quiz.questions[quiz.currentQuestionIndex].category === 'English'
                        ? 'border-yellow-500/30 text-yellow-400 bg-yellow-500/5'
                        : quiz.questions[quiz.currentQuestionIndex].category === 'Math'
                          ? 'border-red-500/30 text-red-400 bg-red-500/5'
                          : quiz.questions[quiz.currentQuestionIndex].category === 'Pakistan Studies'
                            ? 'border-emerald-500/30 text-emerald-400 bg-emerald-500/5'
                            : 'border-green-500/30 text-green-400 bg-green-500/5'
                  }`}>
                    {quiz.questions[quiz.currentQuestionIndex].category}
                  </span>
                  <h2 className={`text-2xl font-medium leading-relaxed ${quiz.questions[quiz.currentQuestionIndex].category === 'Islamic Studies' ? 'text-right' : ''}`}>
                    {quiz.questions[quiz.currentQuestionIndex].question}
                  </h2>
                </div>

                <div className={`grid gap-3 ${quiz.questions[quiz.currentQuestionIndex].category === 'Islamic Studies' ? 'rtl_list' : ''}`}>
                  {quiz.questions[quiz.currentQuestionIndex].options.map((option, idx) => {
                    const isSelected = quiz.answers[quiz.currentQuestionIndex] === idx;
                    const isAnswered = quiz.answers[quiz.currentQuestionIndex] !== null;
                    const isUrdu = quiz.questions[quiz.currentQuestionIndex].category === 'Islamic Studies';

                    return (
                      <button
                        key={idx}
                        disabled={isAnswered}
                        onClick={() => handleAnswer(idx)}
                        className={`group relative p-5 rounded-2xl border text-left transition-all duration-200 flex items-center justify-between ${
                          isSelected 
                            ? 'bg-orange-500 border-orange-500 text-black' 
                            : isAnswered
                              ? 'bg-white/5 border-white/5 text-gray-500 opacity-50'
                              : 'bg-white/5 border-white/5 hover:bg-white/10 hover:border-white/10 active:scale-[0.99] text-gray-300'
                        } ${isUrdu ? 'flex-row-reverse text-right' : ''}`}
                      >
                        <span className={`text-base font-medium ${isUrdu ? 'font-urdu' : ''}`}>{option}</span>
                        <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${
                          isSelected ? 'border-black/20' : 'border-white/10 group-hover:border-white/20'
                        }`}>
                          <div className={`w-2.5 h-2.5 rounded-full transition-transform ${
                            isSelected ? 'bg-black scale-100' : 'bg-transparent scale-0'
                          }`} />
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          )}

          {appState === 'result' && quiz && (
            <motion.div
              key="result"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-8"
              id="result-screen"
            >
              <div className="text-center space-y-4">
                <div className={`inline-flex items-center justify-center w-24 h-24 rounded-full border-4 mb-4 ${
                  (quiz.score / quiz.questions.length) >= 0.5 
                  ? 'bg-green-500/10 border-green-500 text-green-500 shadow-[0_0_40px_rgba(34,197,94,0.2)]' 
                  : 'bg-red-500/10 border-red-500 text-red-500 shadow-[0_0_40px_rgba(239,68,68,0.2)]'
                }`}>
                  <Trophy className="w-12 h-12" />
                </div>
                <h2 className="text-4xl font-bold tracking-tight">Test Completed</h2>
                <div className={`text-6xl font-black italic tracking-tighter ${
                  (quiz.score / quiz.questions.length) >= 0.5 ? 'text-green-500' : 'text-red-500'
                }`}>
                  {(quiz.score / quiz.questions.length) >= 0.5 ? 'PASSED' : 'FAILED'}
                </div>
              </div>

              <div className="bg-[#151619] border border-white/5 rounded-3xl p-8 space-y-6 shadow-2xl">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white/5 p-6 rounded-2xl border border-white/5 text-center">
                    <p className="text-[10px] uppercase font-mono text-gray-500 mb-1">Total Score</p>
                    <p className="text-3xl font-mono font-bold">{quiz.score}<span className="text-gray-600 text-xl">/{quiz.questions.length}</span></p>
                  </div>
                  <div className="bg-white/5 p-6 rounded-2xl border border-white/5 text-center">
                    <p className="text-[10px] uppercase font-mono text-gray-500 mb-1">Percentage</p>
                    <p className="text-3xl font-mono font-bold">
                      {Math.round((quiz.score / quiz.questions.length) * 100)}%
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 rounded-xl bg-green-500/5 border border-green-500/10">
                    <div className="flex items-center gap-3">
                      <CheckCircle2 className="w-5 h-5 text-green-500" />
                      <span className="text-sm font-medium text-green-200">Correct Answers</span>
                    </div>
                    <span className="font-mono font-bold text-green-500">{quiz.score}</span>
                  </div>
                  <div className="flex items-center justify-between p-4 rounded-xl bg-red-500/5 border border-red-500/10">
                    <div className="flex items-center gap-3">
                      <XCircle className="w-5 h-5 text-red-500" />
                      <span className="text-sm font-medium text-red-200">Incorrect / Unanswered</span>
                    </div>
                    <span className="font-mono font-bold text-red-500">{quiz.questions.length - quiz.score}</span>
                  </div>
                </div>

                <button
                  onClick={restartTest}
                  className="w-full py-4 bg-white hover:bg-gray-200 active:scale-[0.98] transition-all rounded-2xl font-bold flex items-center justify-center gap-2 text-black shadow-xl"
                  id="restart-btn"
                >
                  <RotateCcw className="w-5 h-5" /> RESTART TEST
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Decorative dots */}
      <div className="fixed top-8 right-8 flex flex-col gap-2 opacity-50">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="flex gap-2">
            {[...Array(4)].map((_, j) => (
              <div key={j} className="w-1 h-1 bg-white/20 rounded-full" />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
