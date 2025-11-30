
import { Assignment, AssignmentSubmission } from '../types';
import { supabase } from '../lib/supabaseClient';

// Mock Data
const MOCK_ASSIGNMENTS: Assignment[] = [
  {
    id: '1',
    courseId: '1', // Assuming course ID 1 exists
    title: 'React Component Design',
    description: 'Create a reusable Button component with variants (primary, secondary, outline) and sizes (sm, md, lg). Submit the code snippet or a link to a Gist.',
    dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days from now
  },
  {
    id: '2',
    courseId: '1',
    title: 'State Management Essay',
    description: 'Write a short essay (300 words) comparing Redux and Context API. When to use which?',
    dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
  }
];

export const getAssignmentsForCourse = async (courseId: string): Promise<Assignment[]> => {
  // In a real app:
  // const { data, error } = await supabase.from('assignments').select('*').eq('course_id', courseId);
  // if (error) throw error;
  // return data;
  
  return MOCK_ASSIGNMENTS.filter(a => a.courseId === courseId || a.courseId === '1'); // Return mocks for any course for demo
};

export const submitAssignment = async (submission: Omit<AssignmentSubmission, 'id' | 'submittedAt' | 'status'>): Promise<AssignmentSubmission> => {
  // In a real app:
  // const { data, error } = await supabase.from('submissions').insert(submission).select().single();
  // if (error) throw error;
  // return data;

  return {
    id: Math.random().toString(36).substr(2, 9),
    ...submission,
    submittedAt: new Date().toISOString(),
    status: 'pending'
  };
};

export const getStudentSubmissions = async (studentId: string, courseId: string): Promise<AssignmentSubmission[]> => {
    // Mock implementation
    return [];
}
