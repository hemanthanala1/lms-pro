import React, { useState, useEffect } from 'react';
import { AreaChart, Area, XAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { supabase } from '../lib/supabaseClient';
import { Course } from '../types';
import { generateCourseDescription } from '../services/geminiService';

interface CreatorDashboardProps {
  onNavigate: (path: string) => void;
}

const CreatorDashboard: React.FC<CreatorDashboardProps> = ({ onNavigate }) => {
  const [activeTab, setActiveTab] = useState<'studio' | 'analytics' | 'content'>('studio');
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);
  const [instructorName, setInstructorName] = useState<string>('');
  const [totalViews, setTotalViews] = useState(0);

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
      
      const name = profile?.full_name || 'Unknown Creator';
      setInstructorName(name);

      // Fetch Courses (Content)
      const { data: coursesData, error: coursesError } = await supabase
        .from('courses')
        .select('*')
        .eq('instructor', name);

      if (coursesError) throw coursesError;
      
      const fetchedCourses = coursesData || [];
      setCourses(fetchedCourses);

      // Calculate Total Views (using studentsCount as a proxy for views)
      const views = fetchedCourses.reduce((acc, course) => acc + (course.studentsCount || 0), 0);
      setTotalViews(views);

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
            instructor: instructorName,
            thumbnail: `https://picsum.photos/400/225?random=${Math.floor(Math.random() * 1000)}`,
          }
        ])
        .select();

      if (error) throw error;

      setCourses([...courses, data[0] as any]);
      setIsUploadModalOpen(false);
      setNewCourseTitle('');
      setNewCourseDescription('');
      alert('Content Uploaded Successfully!');
    } catch (error) {
      console.error('Error creating course:', error);
      alert('Failed to upload content');
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

  const viewData = [
    { name: 'Mon', views: 4000 },
    { name: 'Tue', views: 3000 },
    { name: 'Wed', views: 2000 },
    { name: 'Thu', views: 2780 },
    { name: 'Fri', views: 1890 },
    { name: 'Sat', views: 2390 },
    { name: 'Sun', views: 3490 },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
         <div>
            <h1 className="text-3xl font-display font-bold text-slate-900">Creator Studio</h1>
            <p className="text-gray-500 mt-1">Manage your video content and uploads.</p>
         </div>
         <button 
           onClick={() => setIsUploadModalOpen(true)}
           className="bg-rose-600 text-white px-6 py-3 rounded-lg font-medium shadow-lg shadow-rose-600/20 hover:bg-rose-700 transition-all flex items-center gap-2"
         >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
            </svg>
            Upload Content
         </button>
      </div>

       {/* Tabs */}
       <div className="border-b border-gray-200 mb-8">
        <nav className="-mb-px flex space-x-8">
          {['studio', 'content', 'analytics'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab as any)}
              className={`${
                activeTab === tab
                  ? 'border-rose-500 text-rose-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm capitalize transition-colors`}
            >
              {tab}
            </button>
          ))}
        </nav>
      </div>

      {activeTab === 'studio' && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
             <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <h3 className="text-gray-500 text-sm font-medium uppercase tracking-wider">Total Students (Views)</h3>
                <div className="mt-2 text-3xl font-bold text-slate-900">{totalViews.toLocaleString()}</div>
                <div className="text-xs text-green-600 mt-1">Across all content</div>
             </div>
             <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <h3 className="text-gray-500 text-sm font-medium uppercase tracking-wider">Content Pieces</h3>
                <div className="mt-2 text-3xl font-bold text-slate-900">{courses.length}</div>
             </div>
             <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <h3 className="text-gray-500 text-sm font-medium uppercase tracking-wider">Subscribers</h3>
                <div className="mt-2 text-3xl font-bold text-slate-900">12.5k</div>
                <div className="text-xs text-gray-400 mt-1">Mock Data</div>
             </div>
             <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <h3 className="text-gray-500 text-sm font-medium uppercase tracking-wider">Avg Rating</h3>
                <div className="mt-2 text-3xl font-bold text-slate-900">4.8</div>
                <div className="w-full bg-gray-100 h-1.5 rounded-full mt-2">
                   <div className="bg-rose-500 h-1.5 rounded-full w-[96%]"></div>
                </div>
             </div>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <h2 className="text-lg font-bold text-slate-900 mb-6">Realtime Views (48h)</h2>
                <div className="h-72">
                  <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={viewData}>
                        <defs>
                          <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#e11d48" stopOpacity={0.8}/>
                            <stop offset="95%" stopColor="#e11d48" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8'}} />
                        <Tooltip />
                        <Area type="monotone" dataKey="views" stroke="#e11d48" fillOpacity={1} fill="url(#colorViews)" />
                      </AreaChart>
                  </ResponsiveContainer>
                </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
               <h2 className="text-lg font-bold text-slate-900 mb-6">Latest Comments</h2>
               <div className="space-y-6">
                 {[1, 2, 3].map(i => (
                    <div key={i} className="flex gap-3">
                       <div className="w-8 h-8 rounded-full bg-gray-200 flex-shrink-0"></div>
                       <div>
                          <div className="text-sm font-bold text-slate-900">User {i}</div>
                          <p className="text-xs text-gray-500 mt-1">Great explanation! Really helped me understand the concept.</p>
                          <div className="mt-2 flex gap-3 text-xs text-gray-400">
                             <button className="hover:text-rose-600">Reply</button>
                             <button className="hover:text-rose-600">Like</button>
                          </div>
                       </div>
                    </div>
                 ))}
               </div>
            </div>
          </div>
        </>
      )}

      {(activeTab === 'content' || activeTab === 'studio') && (
        <div className={`bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden ${activeTab === 'studio' ? 'mt-8' : ''}`}>
           <div className="p-6 border-b border-gray-100">
              <h2 className="text-lg font-bold text-slate-900">Recent Uploads</h2>
           </div>
           <div className="p-6">
              {courses.length === 0 ? (
                 <div className="text-center py-8 text-gray-500">No content uploaded yet.</div>
              ) : (
              <div className="grid gap-6">
                 {courses.map((course, i) => (
                    <div key={course.id} className="flex flex-col sm:flex-row gap-4 group cursor-pointer hover:bg-gray-50 p-2 rounded-xl transition-colors">
                       <div className="relative w-full sm:w-48 aspect-video bg-gray-900 rounded-lg overflow-hidden">
                          <img src={course.thumbnail || `https://picsum.photos/300/170?random=${i}`} className="w-full h-full object-cover" alt="" />
                          <span className="absolute bottom-1 right-1 bg-black/80 text-white text-[10px] px-1 rounded">12:40</span>
                       </div>
                       <div className="flex-1">
                          <h3 className="font-bold text-slate-900 group-hover:text-rose-600 transition-colors">{course.title}</h3>
                          <p className="text-sm text-gray-500 mt-1 line-clamp-2">{course.description}</p>
                          <div className="flex items-center gap-4 mt-3 text-xs text-gray-400 font-medium uppercase tracking-wide">
                             <span>{course.category}</span>
                             <span>•</span>
                             <span>{course.studentsCount || 0} Views</span>
                             <span>•</span>
                             <span className="text-green-600">Monetized</span>
                          </div>
                       </div>
                       <div className="flex sm:flex-col gap-2 justify-center">
                          <button className="p-2 text-gray-400 hover:text-slate-900 border border-transparent hover:border-gray-200 rounded">
                             <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                          </button>
                          <button className="p-2 text-gray-400 hover:text-red-600 border border-transparent hover:border-gray-200 rounded">
                             <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                          </button>
                       </div>
                    </div>
                 ))}
              </div>
              )}
           </div>
        </div>
      )}

      {/* Upload Modal */}
      {isUploadModalOpen && (
         <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg p-8 animate-slide-up">
               <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold font-display text-slate-900">Upload New Content</h2>
                  <button onClick={() => setIsUploadModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                     <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                  </button>
               </div>
               
               <form className="space-y-4" onSubmit={handleCreateCourse}>
                  <div>
                     <label className="block text-sm font-medium text-gray-700 mb-1">Content Title</label>
                     <input 
                        type="text" 
                        required
                        value={newCourseTitle}
                        onChange={(e) => setNewCourseTitle(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:outline-none bg-white" 
                        placeholder="e.g. Advanced CSS Grid" 
                     />
                  </div>
                  <div>
                     <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                     <select 
                        value={newCourseCategory}
                        onChange={(e) => setNewCourseCategory(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:outline-none bg-white"
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
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:outline-none bg-white"
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
                          className="text-xs text-rose-600 font-medium hover:text-rose-700 flex items-center gap-1 disabled:opacity-50 disabled:cursor-not-allowed"
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
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:outline-none bg-white" 
                        rows={4} 
                        placeholder="What is this content about?"
                     ></textarea>
                  </div>
                  <div className="flex justify-end gap-3 pt-4">
                     <button type="button" onClick={() => setIsUploadModalOpen(false)} className="px-4 py-2 text-gray-600 font-medium hover:bg-gray-100 rounded-lg transition-colors">Cancel</button>
                     <button type="submit" className="px-6 py-2 bg-rose-600 text-white font-medium rounded-lg hover:bg-rose-700 transition-colors">Upload</button>
                  </div>
               </form>
            </div>
         </div>
      )}
    </div>
  );
};

export default CreatorDashboard;
