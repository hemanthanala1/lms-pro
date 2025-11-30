
export type UserRole = 'student' | 'teacher' | 'admin' | 'creator';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  points: number;
  level: number;
  enrolledCourses: string[]; // List of Course IDs
}

export interface Course {
  id: string;
  title: string;
  description: string;
  instructor: string;
  thumbnail: string;
  progress: number;
  totalLessons: number;
  studentsCount?: number;
  rating?: number;
  category: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  totalDuration?: string;
  lessons: Lesson[];
}

export interface Lesson {
  id: string;
  title: string;
  duration: string;
  type: 'video' | 'text' | 'quiz'; // Added content type
  videoUrl?: string; // Placeholder for video
  transcript: string; // Used for RAG
  content: string; // Markdown content
}

export interface ChatSource {
  title: string;
  lesson: string;
  timestamp: string;
}

export interface AIResponse {
  answer: string;
  sources: ChatSource[];
  confidence_score: number;
  teacher_insight?: string; // Added for teacher perspective
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'ai' | 'system';
  content: string | AIResponse;
  timestamp: Date;
}

export interface RAGChunk {
  text: string;
  metadata: {
    course: string;
    lesson: string;
    timestamp: string;
  };
  similarity: number;
}

export interface Badge {
  id: string;
  name: string;
  icon: string;
  description: string;
  color: string;
}

export interface LeaderboardEntry {
  id: string;
  name: string;
  avatar: string;
  points: number;
  rank: number;
}

// --- New Types for Assignments & Quizzes ---

export interface Assignment {
  id: string;
  courseId: string;
  title: string;
  description: string;
  dueDate: string;
}

export interface AssignmentSubmission {
  id: string;
  assignmentId: string;
  studentId: string;
  content: string;
  status: 'pending' | 'graded';
  grade?: number;
  feedback?: string;
  submittedAt: string;
}

export interface Quiz {
  id: string;
  courseId: string;
  lessonId?: string;
  title: string;
  description?: string;
  questions: QuizQuestion[];
}

export interface QuizQuestion {
  id: string;
  quizId: string;
  questionText: string;
  options: string[];
  correctAnswer: string; // The correct option string
  explanation?: string;
}

export interface QuizSubmission {
  id: string;
  quizId: string;
  studentId: string;
  score: number;
  answers: Record<string, string>; // questionId -> selectedOption
  submittedAt: string;
}
