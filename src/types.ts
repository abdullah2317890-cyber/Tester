
export interface Question {
  id: string;
  category: 'Islamic Studies' | 'Computer Science' | 'Social Media' | 'English' | 'Math' | 'Pakistan Studies';
  question: string;
  options: string[];
  correctAnswer: number; // Index of correct option
}

export type AppState = 'setup' | 'quiz' | 'result';

export interface QuizState {
  questions: Question[];
  currentQuestionIndex: number;
  score: number;
  answers: (number | null)[]; // Index of selected option, or null for unanswered
  timeRemaining: number;
}
