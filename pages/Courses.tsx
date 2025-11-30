import React, { useState, useEffect } from 'react';
import { MOCK_COURSES } from '../constants'; // Fallback
import { User, Course } from '../types';
import { supabase } from '../lib/supabaseClient';

interface CoursesProps {
  onNavigate: (path: string) => void;
  user: User | null;
  onEnroll: (courseId: string) => void;
  onUnenroll: (courseId: string) => void;
}

const CATEGORIES = ['All', 'Development', 'Design', 'Data Science', 'Business'];

const Courses: React.FC<CoursesProps> = ({ onNavigate, user, onEnroll, onUnenroll }) => {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [courses, setCourses] = useState<Course[]>(MOCK_COURSES); // Initialize with Mock, replace with DB
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    setLoading(true);
    try {
      // Fetch courses from Supabase
      const { data, error } = await supabase
        .from('courses')
        .select(`
          *,
          lessons:lessons(id, title, duration, content, transcript)
        `);
      
      if (error) {
        console.error('Error fetching courses:', error);
        // Fallback to MOCK_COURSES is already handled by initial state
      } else if (data && data.length > 0) {
        setCourses(data as Course[]);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const filteredCourses = courses.filter(course => {
    const matchesCategory = selectedCategory === 'All' || course.category === selectedCategory;
    const matchesSearch = course.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          (course.instructor && course.instructor.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Back Button */}
        <button onClick={() => window.history.back()} className="flex items-center text-gray-500 hover:text-slate-900 transition-colors mb-6">
          <svg className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back
        </button>

        {/* Header Section */}
        <div className="mb-12 text-center">
           <h1 className="text-4xl font-display font-bold text-slate-900 mb-4">Explore our Courses</h1>
           <p className="text-lg text-gray-500 max-w-2xl mx-auto">Master new skills with our expert-led curriculum. From coding to design, we have everything you need to succeed.</p>
        </div>

        {/* Filters & Search */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-10 sticky top-20 z-30 bg-gray-50/95 backdrop-blur-sm py-4">
           {/* Categories */}
           <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0 w-full md:w-auto scrollbar-hide">
              {CATEGORIES.map(cat => (
                 <button
                   key={cat}
                   onClick={() => setSelectedCategory(cat)}
                   className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                     selectedCategory === cat 
                       ? 'bg-slate-900 text-white shadow-lg shadow-slate-900/20' 
                       : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-100'
                   }`}
                 >
                   {cat}
                 </button>
              ))}
           </div>

           {/* Search */}
           <div className="relative w-full md:w-72">
              <input
                type="text"
                placeholder="Search courses..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-brand-500 transition-all shadow-sm"
              />
              <svg className="w-5 h-5 text-gray-400 absolute left-3 top-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
           </div>
        </div>

        {/* Results Grid */}
        {loading ? (
          <div className="text-center py-12">
            <p className="text-gray-500">Loading courses...</p>
          </div>
        ) : filteredCourses.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredCourses.map(course => {
              const isEnrolled = user?.enrolledCourses.includes(course.id);
              
              return (
                <div 
                  key={course.id} 
                  className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 flex flex-col h-full hover:-translate-y-1 relative"
                >
                  {/* Thumbnail */}
                  <div className="relative h-48 overflow-hidden cursor-pointer" onClick={() => isEnrolled ? onNavigate('player') : null}>
                    <img src={course.thumbnail || `https://picsum.photos/400/225?random=${course.id}`} alt={course.title} className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500" />
                    <div className="absolute top-4 left-4">
                       <span className={`px-2 py-1 rounded-md text-xs font-bold backdrop-blur-md ${
                          course.level === 'Beginner' ? 'bg-green-500/90 text-white' :
                          course.level === 'Intermediate' ? 'bg-blue-500/90 text-white' :
                          'bg-purple-500/90 text-white'
                       }`}>
                          {course.level}
                       </span>
                    </div>
                    {isEnrolled && (
                       <div className="absolute inset-0 bg-black/40 flex items-center justify-center backdrop-blur-[2px]">
                          <span className="bg-white/90 text-slate-900 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider shadow-lg flex items-center gap-1">
                             <svg className="w-3 h-3 text-green-600" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/></svg>
                             Enrolled
                          </span>
                       </div>
                    )}
                    <div className="absolute bottom-4 right-4 bg-black/60 backdrop-blur-sm px-2 py-1 rounded-md text-xs font-bold text-white flex items-center gap-1">
                       <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                       {course.totalDuration || '4h 30m'}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-6 flex-1 flex flex-col">
                    <div className="flex justify-between items-start mb-2">
                       <span className="text-xs font-semibold text-brand-600 uppercase tracking-wide bg-brand-50 px-2 py-0.5 rounded-full">{course.category}</span>
                       <div className="flex items-center text-yellow-400 text-xs font-bold gap-1">
                          <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                          {course.rating || '4.8'} <span className="text-gray-300 font-normal">({course.studentsCount || 0})</span>
                       </div>
                    </div>
                    
                    <h3 onClick={() => isEnrolled ? onNavigate('player') : null} className="text-xl font-bold text-slate-900 mb-2 group-hover:text-brand-600 transition-colors line-clamp-2 cursor-pointer">{course.title}</h3>
                    <p className="text-gray-500 text-sm mb-4 line-clamp-2">{course.description}</p>
                    
                    <div className="mt-auto pt-4 border-t border-gray-50 flex flex-col gap-3">
                       <div className="flex items-center gap-2">
                          <img src={`https://ui-avatars.com/api/?name=${course.instructor || 'Instructor'}&background=random`} alt={course.instructor} className="w-6 h-6 rounded-full" />
                          <span className="text-xs font-medium text-gray-700">{course.instructor || 'Unknown Instructor'}</span>
                       </div>
                       
                       {isEnrolled ? (
                         <div className="flex gap-2">
                            <button 
                              onClick={() => onNavigate('player')}
                              className="flex-1 bg-brand-600 text-white py-2 rounded-lg font-bold text-sm hover:bg-brand-700 transition-colors shadow-md shadow-brand-600/20"
                            >
                              Continue Learning
                            </button>
                            <button 
                              onClick={(e) => {
                                e.stopPropagation();
                                if(window.confirm(`Are you sure you want to unenroll from "${course.title}"?`)) {
                                  onUnenroll(course.id);
                                }
                              }}
                              className="px-3 py-2 text-red-500 hover:bg-red-50 rounded-lg border border-transparent hover:border-red-100 transition-colors"
                              title="Unenroll"
                            >
                              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                            </button>
                         </div>
                       ) : (
                         <button 
                           onClick={() => onEnroll(course.id)}
                           className="w-full bg-slate-900 text-white py-2 rounded-lg font-bold text-sm hover:bg-slate-800 transition-colors shadow-lg shadow-slate-900/10 flex justify-center items-center gap-2"
                         >
                           Enroll Now
                         </button>
                       )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-24">
             <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
             </div>
             <h3 className="text-lg font-bold text-gray-900">No courses found</h3>
             <p className="text-gray-500">Try adjusting your filters or search terms.</p>
             <button onClick={() => {setSearchQuery(''); setSelectedCategory('All');}} className="mt-4 text-brand-600 font-medium hover:underline">Clear all filters</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Courses;