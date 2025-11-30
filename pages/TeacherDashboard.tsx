import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { supabase } from '../lib/supabaseClient';
import { Course } from '../types';
import { generateCourseDescription } from '../services/geminiService';

interface TeacherDashboardProps {
  onNavigate: (path: string) => void;
}

interface Submission {
  id: string;
  student: { full_name: string };
  course: { title: string };
  assignment: { title: string };
  status: 'pending' | 'graded';
  submitted_at: string;
}

interface Question {
  id: string;
  student: { full_name: string };
  course: { title: string };
  question: string;
  ai_answer: string;
  teacher_answer?: string;
  created_at: string;
}

const TeacherDashboard: React.FC<TeacherDashboardProps> = ({ onNavigate }) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'courses' | 'grading'>('overview');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [courses, setCourses] = useState<Course[]>([]);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);
  const [instructorName, setInstructorName] = useState<string>('');

  // Form State
  const [newCourseTitle, setNewCourseTitle] = useState('');
  const [newCourseCategory, setNewCourseCategory] = useState('Development');
  const [newCourseDescription, setNewCourseDescription] = useState('');
  const [newCourseLevel, setNewCourseLevel] = useState('Beginner');
  const [isGeneratingDescription, setIsGeneratingDescription] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        console.log("User not logged in");
        return;
      }
      setUserId(user.id);

      // Fetch Profile to get Name
      const { data: profile } = await supabase
        .from('profiles')
        .select('full_name')
        .eq('id', user.id)
        .single();
      
      const name = profile?.full_name || 'Unknown Instructor';
      setInstructorName(name);

      // Fetch Courses
      // Note: Filtering by instructor name is brittle but required by current schema
      // Ideally, schema should have instructor_id
      const { data: coursesData, error: coursesError } = await supabase
        .from('courses')
        .select('*')
        .eq('instructor', name);

      if (coursesError) throw coursesError;
      setCourses(coursesData || []);

      // Fetch Submissions
      const { data: submissionsData } = await supabase
        .from('submissions')
        .select(`
          id,
          status,
          submitted_at,
          student:profiles(full_name),
          assignment:assignments(title, course:courses(title))
        `);
        
      if (submissionsData) {
         const formattedSubmissions = submissionsData.map((s: any) => ({
            id: s.id,
            student: s.student,
            course: s.assignment?.course,
            assignment: s.assignment,
            status: s.status,
            submitted_at: s.submitted_at
         }));
         setSubmissions(formattedSubmissions);
      }

      // Fetch Questions
      const { data: questionsData } = await supabase
        .from('questions')
        .select(`
          id,
          question,
          ai_answer,
          teacher_answer,
          created_at,
          student:profiles(full_name),
          course:courses(title)
        `)
        .order('created_at', { ascending: false })
        .limit(5);

      if (questionsData) {
        const formattedQuestions = questionsData.map((q: any) => ({
          id: q.id,
          student: q.student,
          course: q.course,
          question: q.question,
          ai_answer: q.ai_answer,
          teacher_answer: q.teacher_answer,
          created_at: q.created_at
        }));
        setQuestions(formattedQuestions);
      }

    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateCourse = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId) return;

    try {
      const { data, error } = await supabase
        .from('courses')
        .insert([
          {
            title: newCourseTitle,
            description: newCourseDescription,
            category: newCourseCategory,
            level: newCourseLevel,
            instructor: instructorName, // Using name as per schema
            thumbnail: 'https://picsum.photos/400/225', // Using thumbnail as per schema
            // published: false // Removed as per schema
          }
        ])
        .select();

      if (error) throw error;

      setCourses([...courses, data[0] as any]);
      setIsCreateModalOpen(false);
      setNewCourseTitle('');
      setNewCourseDescription('');
      alert('Course Created Successfully!');
    } catch (error) {
      console.error('Error creating course:', error);
      alert('Failed to create course');
    }
  };

  const handleGenerateDescription = async () => {
    if (!newCourseTitle) {
      alert('Please enter a title first.');
      return;
    }
    setIsGeneratingDescription(true);
    try {
      const description = await generateCourseDescription(newCourseTitle, newCourseCategory, newCourseLevel);
      if (description) {
        setNewCourseDescription(description);
      }
    } catch (error) {
      console.error(error);
      alert('Failed to generate description');
    } finally {
      setIsGeneratingDescription(false);
    }
  };

  const handleGradeSubmission = async (id: string) => {
    try {
      const { error } = await supabase
        .from('submissions')
        .update({ status: 'graded' })
        .eq('id', id);

      if (error) throw error;

      setSubmissions(submissions.map(s => s.id === id ? { ...s, status: 'graded' } : s));
      alert('Submission graded!');
    } catch (error) {
      console.error('Error grading submission:', error);
      alert('Failed to grade submission');
    }
  };

  const handleAddInsight = async (id: string) => {
    const insight = prompt("Enter your insight for this question:");
    if (!insight) return;

    try {
      const { error } = await supabase
        .from('questions')
        .update({ teacher_answer: insight })
        .eq('id', id);

      if (error) throw error;

      setQuestions(questions.map(q => q.id === id ? { ...q, teacher_answer: insight } : q));
      alert('Insight added!');
    } catch (error) {
      console.error('Error adding insight:', error);
      alert('Failed to add insight');
    }
  };

  const chartData = [
    { name: 'Mon', students: 40 },
    { name: 'Tue', students: 65 },
    { name: 'Wed', students: 85 },
    { name: 'Thu', students: 50 },
    { name: 'Fri', students: 90 },
    { name: 'Sat', students: 30 },
    { name: 'Sun', students: 20 },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
         <div>
            <h1 className="text-3xl font-display font-bold text-slate-900">Teacher Dashboard</h1>
            <p className="text-gray-500 mt-1">Manage your courses, grading, and student questions.</p>
         </div>
         <div className="flex gap-3">
             <button 
                onClick={() => setIsCreateModalOpen(true)}
                className="bg-brand-600 text-white px-6 py-3 rounded-lg font-medium shadow-lg shadow-brand-600/20 hover:bg-brand-700 transition-all flex items-center gap-2"
             >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Create New Course
             </button>
         </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 mb-8">
        <nav className="-mb-px flex space-x-8">
          {['overview', 'courses', 'grading'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab as any)}
              className={`${
                activeTab === tab
                  ? 'border-brand-500 text-brand-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm capitalize transition-colors`}
            >
              {tab}
            </button>
          ))}
        </nav>
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
             <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <h3 className="text-gray-500 text-sm font-medium uppercase tracking-wider">Total Students</h3>
                <div className="mt-2 flex items-baseline gap-2">
                   <span className="text-4xl font-bold text-slate-900">4,740</span>
                   <span className="text-sm text-green-600 font-bold">↑ 12%</span>
                </div>
             </div>
             <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <h3 className="text-gray-500 text-sm font-medium uppercase tracking-wider">Avg. Course Rating</h3>
                <div className="mt-2 flex items-baseline gap-2">
                   <span className="text-4xl font-bold text-slate-900">4.8</span>
                   <div className="flex text-yellow-400 text-sm">★★★★★</div>
                </div>
             </div>
             <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <h3 className="text-gray-500 text-sm font-medium uppercase tracking-wider">Assignments to Grade</h3>
                <div className="mt-2 flex items-baseline gap-2">
                   <span className="text-4xl font-bold text-slate-900">{submissions.filter(s => s.status === 'pending').length}</span>
                   <span className="text-sm text-gray-400">pending</span>
                </div>
             </div>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
             {/* Left: Charts */}
             <div className="lg:col-span-2 space-y-8">
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                   <h2 className="text-lg font-bold text-slate-900 mb-6">Student Activity</h2>
                   <div className="h-64">
                      <ResponsiveContainer width="100%" height="100%">
                         <BarChart data={chartData}>
                            <XAxis dataKey="name" axisLine={false} tickLine={false} fontSize={12} tick={{fill: '#94a3b8'}} />
                            <Tooltip cursor={{fill: '#f1f5f9'}} contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}} />
                            <Bar dataKey="students" fill="#0ea5a4" radius={[4, 4, 0, 0]} barSize={32} />
                         </BarChart>
                      </ResponsiveContainer>
                   </div>
                </div>
             </div>

             {/* Right: Recent Questions */}
             <div className="space-y-6">
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                   <h2 className="text-lg font-bold text-slate-900 mb-4">Recent AI Questions</h2>
                   <p className="text-xs text-gray-500 mb-4">Questions students asked the AI Assistant that might need your attention.</p>
                   <div className="space-y-4">
                      {questions.length === 0 ? (
                         <p className="text-sm text-gray-500 italic">No recent questions.</p>
                      ) : (
                      questions.map((q) => (
                         <div key={q.id} className="p-3 bg-gray-50 rounded-xl border border-gray-100">
                            <div className="flex items-center gap-2 mb-2">
                               <div className="w-6 h-6 rounded-full bg-indigo-100 flex items-center justify-center text-xs font-bold text-indigo-600">S</div>
                               <span className="text-xs font-bold text-gray-700">{q.student?.full_name || 'Student'} in {q.course?.title || 'Course'}</span>
                            </div>
                            <p className="text-sm text-slate-800 italic">"{q.question}"</p>
                            {q.teacher_answer ? (
                               <p className="mt-2 text-xs text-green-600 font-medium">✓ Insight added</p>
                            ) : (
                               <button onClick={() => handleAddInsight(q.id)} className="mt-3 text-xs font-bold text-brand-600 hover:underline">Add Teacher Insight</button>
                            )}
                         </div>
                      )))}
                   </div>
                </div>
             </div>
          </div>
        </>
      )}

      {/* Courses Tab */}
      {activeTab === 'courses' && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
           <h2 className="text-lg font-bold text-slate-900 mb-6">Your Course Catalog</h2>
           {courses.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                 <p>You haven't created any courses yet.</p>
                 <button onClick={() => setIsCreateModalOpen(true)} className="mt-4 text-brand-600 font-bold hover:underline">Create your first course</button>
              </div>
           ) : (
           <div className="space-y-4">
              {courses.map(course => (
                 <div key={course.id} className="flex flex-col sm:flex-row sm:items-center gap-4 p-4 border rounded-xl hover:bg-gray-50 transition-colors group">
                    <img src={course.thumbnail || 'https://via.placeholder.com/150'} className="w-full sm:w-32 h-20 object-cover rounded-lg bg-gray-200" alt="" />
                    <div className="flex-1">
                       <h3 className="font-bold text-slate-900">{course.title}</h3>
                       <p className="text-sm text-gray-500">{course.studentsCount || 0} Students • {course.rating || 'N/A'} Rating</p>
                       <div className="mt-2 flex gap-2">
                          <span className="text-xs px-2 py-0.5 bg-gray-100 rounded-full text-gray-600">{course.category}</span>
                          <span className="text-xs px-2 py-0.5 bg-gray-100 rounded-full text-gray-600">{course.level}</span>
                       </div>
                    </div>
                    <div className="flex gap-2 mt-2 sm:mt-0 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                       <button className="px-3 py-1.5 text-sm font-medium text-slate-600 border border-gray-200 rounded-lg hover:bg-white hover:border-gray-300">Analytics</button>
                       <button className="px-3 py-1.5 text-sm font-medium text-brand-600 border border-brand-200 bg-brand-50 rounded-lg hover:bg-brand-100">Edit</button>
                    </div>
                 </div>
              ))}
           </div>
           )}
        </div>
      )}

      {/* Grading Tab */}
      {activeTab === 'grading' && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
           <h2 className="text-lg font-bold text-slate-900 mb-6">Assignment Submissions</h2>
           {submissions.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                 <p>No submissions to grade.</p>
              </div>
           ) : (
             <div className="overflow-x-auto">
               <table className="w-full text-left border-collapse">
                 <thead>
                   <tr className="border-b border-gray-100 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                     <th className="pb-3 pl-4">Student</th>
                     <th className="pb-3">Assignment</th>
                     <th className="pb-3">Course</th>
                     <th className="pb-3">Submitted</th>
                     <th className="pb-3">Status</th>
                     <th className="pb-3 pr-4 text-right">Action</th>
                   </tr>
                 </thead>
                 <tbody className="text-sm">
                   {submissions.map(submission => (
                     <tr key={submission.id} className="border-b border-gray-50 last:border-0 hover:bg-gray-50 transition-colors">
                       <td className="py-4 pl-4 font-medium text-slate-900">{submission.student?.full_name || 'Unknown'}</td>
                       <td className="py-4 text-gray-600">{submission.assignment?.title}</td>
                       <td className="py-4 text-gray-500">{submission.course?.title}</td>
                       <td className="py-4 text-gray-500">{new Date(submission.submitted_at).toLocaleDateString()}</td>
                       <td className="py-4">
                         <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                           submission.status === 'graded' 
                             ? 'bg-green-100 text-green-700' 
                             : 'bg-yellow-100 text-yellow-700'
                         }`}>
                           {submission.status}
                         </span>
                       </td>
                       <td className="py-4 pr-4 text-right">
                         {submission.status === 'pending' && (
                           <button 
                             onClick={() => handleGradeSubmission(submission.id)}
                             className="text-brand-600 font-medium hover:text-brand-700 hover:underline"
                           >
                             Mark as Graded
                           </button>
                         )}
                       </td>
                     </tr>
                   ))}
                 </tbody>
               </table>
             </div>
           )}
        </div>
      )}

      {/* Create Course Modal */}
      {isCreateModalOpen && (
         <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg p-8 animate-slide-up">
               <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold font-display text-slate-900">Create New Course</h2>
                  <button onClick={() => setIsCreateModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                     <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                  </button>
               </div>
               <form className="space-y-4" onSubmit={handleCreateCourse}>
                  <div>
                     <label className="block text-sm font-medium text-gray-700 mb-1">Course Title</label>
                     <input 
                        type="text" 
                        required
                        value={newCourseTitle}
                        onChange={(e) => setNewCourseTitle(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:outline-none bg-white" 
                        placeholder="e.g. Advanced Machine Learning" 
                     />
                  </div>
                  <div>
                     <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                     <select 
                        value={newCourseCategory}
                        onChange={(e) => setNewCourseCategory(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:outline-none bg-white"
                     >
                        <option>Development</option>
                        <option>Business</option>
                        <option>Data Science</option>
                        <option>Design</option>
                     </select>
                  </div>
                  <div>
                     <label className="block text-sm font-medium text-gray-700 mb-1">Level</label>
                     <select 
                        value={newCourseLevel}
                        onChange={(e) => setNewCourseLevel(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:outline-none bg-white"
                     >
                        <option>Beginner</option>
                        <option>Intermediate</option>
                        <option>Advanced</option>
                     </select>
                  </div>
                  <div>
                     <div className="flex justify-between items-center mb-1">
                        <label className="block text-sm font-medium text-gray-700">Description</label>
                        <button 
                          type="button"
                          onClick={handleGenerateDescription}
                          disabled={isGeneratingDescription || !newCourseTitle}
                          className="text-xs text-brand-600 font-medium hover:text-brand-700 flex items-center gap-1 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {isGeneratingDescription ? (
                            <>Generating...</>
                          ) : (
                            <>
                              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                              Generate with AI
                            </>
                          )}
                        </button>
                     </div>
                     <textarea 
                        required
                        value={newCourseDescription}
                        onChange={(e) => setNewCourseDescription(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:outline-none bg-white" 
                        rows={4} 
                        placeholder="What will students learn?"
                     ></textarea>
                  </div>
                  <div className="flex justify-end gap-3 pt-4">
                     <button type="button" onClick={() => setIsCreateModalOpen(false)} className="px-4 py-2 text-gray-600 font-medium hover:bg-gray-100 rounded-lg transition-colors">Cancel</button>
                     <button type="submit" className="px-6 py-2 bg-brand-600 text-white font-medium rounded-lg hover:bg-brand-700 transition-colors">Create Course</button>
                  </div>
               </form>
            </div>
         </div>
      )}
    </div>
  );
};

export default TeacherDashboard;
