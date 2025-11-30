
import { Course, RAGChunk, Badge, LeaderboardEntry } from './types';

export const MOCK_COURSES: Course[] = [
  {
    id: 'c1',
    title: 'Advanced React Patterns',
    description: 'Master modern React with hooks, context, and performance optimization techniques.',
    instructor: 'Sarah Drasner',
    thumbnail: 'https://picsum.photos/400/225?random=1',
    progress: 45,
    totalLessons: 12,
    studentsCount: 1240,
    rating: 4.8,
    category: 'Development',
    level: 'Advanced',
    totalDuration: '6h 30m',
    lessons: [
      {
        id: 'l1',
        title: 'Understanding useEffect Deeply',
        duration: '14:20',
        type: 'video',
        content: '# The Dependency Array\n\nThe dependency array in `useEffect` controls when the effect runs...',
        transcript: "Welcome to the lesson on useEffect. In this video, we will discuss the dependency array. If you leave it empty, it runs only on mount. If you add variables, it runs when they change. At 02:30, we discuss the infinite loop pitfall. Common mistake: updating a state that is also a dependency without conditions."
      },
      {
        id: 'l2',
        title: 'Custom Hooks for Logic Reuse',
        duration: '18:45',
        type: 'video',
        content: '# Building useLocalStorage\n\nCustom hooks allow you to extract component logic into reusable functions...',
        transcript: "Let's build a custom hook called useLocalStorage. This hook abstracts the window.localStorage API. At 05:00 we handle the JSON parsing. Remember to wrap your initial state in a function if it's expensive to calculate."
      },
      {
        id: 'l3',
        title: 'React Cheatsheet & Best Practices',
        duration: '10 min read',
        type: 'text',
        content: '# React Best Practices\n\n## 1. Component Structure\nKeep components small and focused on a single responsibility.\n\n## 2. State Management\nUse local state for UI interactions and global state (Context/Redux) only when necessary.\n\n## 3. Performance\n- Use `React.memo` for expensive renders.\n- Use `useCallback` to prevent function recreation.\n\n[Download PDF Version](#)',
        transcript: "This is a reading material lesson. No audio transcript available."
      }
    ]
  },
  {
    id: 'c2',
    title: 'Python for Data Science',
    description: 'From Pandas to Scikit-Learn, learn the tools to analyze data effectively.',
    instructor: 'Andrew Ng',
    thumbnail: 'https://picsum.photos/400/225?random=2',
    progress: 10,
    totalLessons: 24,
    studentsCount: 3500,
    rating: 4.9,
    category: 'Data Science',
    level: 'Beginner',
    totalDuration: '12h 15m',
    lessons: [
      {
        id: 'l1',
        title: 'Introduction to Pandas',
        duration: '12:00',
        type: 'video',
        content: '# DataFrames\n\nThe core structure in Pandas is the DataFrame...',
        transcript: "Pandas is built on top of NumPy. The main object is the DataFrame. Think of it like an Excel sheet but more powerful. At 03:15, we talk about iloc and loc for selection."
      }
    ]
  },
  {
    id: 'c3',
    title: 'UI/UX Design Principles',
    description: 'Learn to design beautiful, user-friendly interfaces using Figma and design theory.',
    instructor: 'Gary Simon',
    thumbnail: 'https://picsum.photos/400/225?random=3',
    progress: 0,
    totalLessons: 18,
    studentsCount: 980,
    rating: 4.7,
    category: 'Design',
    level: 'Beginner',
    totalDuration: '8h 45m',
    lessons: []
  },
  {
    id: 'c4',
    title: 'Product Management 101',
    description: 'The complete guide to becoming a successful product manager in tech.',
    instructor: 'Lenny Rachitsky',
    thumbnail: 'https://picsum.photos/400/225?random=4',
    progress: 0,
    totalLessons: 15,
    studentsCount: 2100,
    rating: 4.8,
    category: 'Business',
    level: 'Intermediate',
    totalDuration: '5h 20m',
    lessons: []
  },
  {
    id: 'c5',
    title: 'Next.js 14 Full Course',
    description: 'Build full-stack applications with the App Router, Server Actions, and Prisma.',
    instructor: 'Lee Robinson',
    thumbnail: 'https://picsum.photos/400/225?random=5',
    progress: 0,
    totalLessons: 28,
    studentsCount: 5400,
    rating: 4.9,
    category: 'Development',
    level: 'Intermediate',
    totalDuration: '14h 10m',
    lessons: []
  },
  {
    id: 'c6',
    title: 'Machine Learning Basics',
    description: 'Understand the math and logic behind neural networks and deep learning.',
    instructor: 'Andrej Karpathy',
    thumbnail: 'https://picsum.photos/400/225?random=6',
    progress: 0,
    totalLessons: 20,
    studentsCount: 8900,
    rating: 5.0,
    category: 'Data Science',
    level: 'Advanced',
    totalDuration: '10h 00m',
    lessons: []
  }
];

export const MOCK_BADGES: Badge[] = [
  { id: 'b1', name: 'Fast Learner', icon: '🚀', description: 'Completed 5 lessons in one day', color: 'bg-orange-100 text-orange-600' },
  { id: 'b2', name: 'Quiz Master', icon: '🎯', description: 'Scored 100% on 3 quizzes', color: 'bg-green-100 text-green-600' },
  { id: 'b3', name: 'Curious Mind', icon: '💡', description: 'Asked 10 AI questions', color: 'bg-blue-100 text-blue-600' },
  { id: 'b4', name: 'Early Bird', icon: '🌅', description: 'Studied before 8 AM', color: 'bg-yellow-100 text-yellow-600' }
];

export const MOCK_LEADERBOARD: LeaderboardEntry[] = [
  { id: 'u1', name: 'Alex Johnson', avatar: 'https://ui-avatars.com/api/?name=Alex+Johnson&background=0ea5a4&color=fff', points: 2450, rank: 1 },
  { id: 'u2', name: 'Maria Garcia', avatar: 'https://ui-avatars.com/api/?name=Maria+Garcia&background=6366f1&color=fff', points: 2100, rank: 2 },
  { id: 'u3', name: 'David Chen', avatar: 'https://ui-avatars.com/api/?name=David+Chen&background=f59e0b&color=fff', points: 1850, rank: 3 },
  { id: 'u4', name: 'Sarah Smith', avatar: 'https://ui-avatars.com/api/?name=Sarah+Smith&background=ec4899&color=fff', points: 1600, rank: 4 },
  { id: 'u5', name: 'James Wilson', avatar: 'https://ui-avatars.com/api/?name=James+Wilson&background=8b5cf6&color=fff', points: 1400, rank: 5 },
];

// Simulating a Vector Database Retrieval
export const mockRetrieveContext = (query: string, courseId: string): RAGChunk[] => {
  const course = MOCK_COURSES.find(c => c.id === courseId);
  if (!course) return [];

  const chunks: RAGChunk[] = [];
  
  // Very naive keyword matching to simulate "Semantic Search"
  const keywords = query.toLowerCase().split(' ').filter(w => w.length > 3);

  course.lessons.forEach(lesson => {
    // Split transcript into "sentences" or chunks
    const sentences = lesson.transcript?.split('. ') || [];
    sentences.forEach((sentence, idx) => {
      let score = 0;
      keywords.forEach(k => {
        if (sentence.toLowerCase().includes(k)) score += 1;
      });

      if (score > 0) {
        chunks.push({
          text: sentence,
          metadata: {
            course: course.title,
            lesson: lesson.title,
            timestamp: `00:${10 + idx}:00` // Mock timestamp logic
          },
          similarity: score
        });
      }
    });
  });

  // Sort by "relevance"
  return chunks.sort((a, b) => b.similarity - a.similarity).slice(0, 3);
};
