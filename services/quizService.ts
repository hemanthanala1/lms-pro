
import { Quiz, QuizSubmission } from '../types';
import { supabase } from '../lib/supabaseClient';

// Mock Data
const MOCK_QUIZZES: Quiz[] = [
  {
    id: '1',
    courseId: '1',
    lessonId: '1',
    title: 'React Basics Quiz',
    description: 'Test your knowledge of Components, Props, and State.',
    questions: [
      {
        id: 'q1',
        quizId: '1',
        questionText: 'What is the correct way to pass data from parent to child component?',
        options: ['State', 'Props', 'Context', 'Redux'],
        correctAnswer: 'Props',
        explanation: 'Props (short for properties) are the standard way to pass data from a parent component to a child component.'
      },
      {
        id: 'q2',
        quizId: '1',
        questionText: 'Which hook is used to manage state in a functional component?',
        options: ['useEffect', 'useContext', 'useState', 'useReducer'],
        correctAnswer: 'useState',
        explanation: 'useState is the primary hook for adding state variables to functional components.'
      },
      {
        id: 'q3',
        quizId: '1',
        questionText: 'What is the virtual DOM?',
        options: [
          'A direct copy of the browser DOM',
          'A lightweight copy of the DOM kept in memory',
          'A database for React components',
          'A browser extension'
        ],
        correctAnswer: 'A lightweight copy of the DOM kept in memory',
        explanation: 'The virtual DOM is a programming concept where a virtual representation of a UI is kept in memory and synced with the "real" DOM.'
      }
    ]
  }
];

export const getQuizzesForCourse = async (courseId: string): Promise<Quiz[]> => {
  // In a real app:
  // const { data, error } = await supabase.from('quizzes').select('*, questions(*)').eq('course_id', courseId);
  
  return MOCK_QUIZZES;
};

export const getQuizById = async (quizId: string): Promise<Quiz | undefined> => {
    return MOCK_QUIZZES.find(q => q.id === quizId);
}

export const submitQuiz = async (submission: Omit<QuizSubmission, 'id' | 'submittedAt'>): Promise<QuizSubmission> => {
  // In a real app:
  // const { data, error } = await supabase.from('quiz_submissions').insert(submission).select().single();
  
  return {
    id: Math.random().toString(36).substr(2, 9),
    ...submission,
    submittedAt: new Date().toISOString()
  };
};
