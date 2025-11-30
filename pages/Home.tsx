import React from 'react';
import { MOCK_COURSES } from '../constants';

const Home: React.FC<{onNavigate: (path: string) => void}> = ({ onNavigate }) => {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative pt-32 pb-24 lg:pt-48 lg:pb-32 overflow-hidden">
        <div className="absolute top-0 right-0 -mr-24 -mt-24 w-96 h-96 rounded-full bg-brand-500/10 blur-3xl"></div>
        <div className="absolute bottom-0 left-0 -ml-24 -mb-24 w-64 h-64 rounded-full bg-indigo-500/10 blur-3xl"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <h1 className="text-5xl md:text-7xl font-display font-bold text-slate-900 tracking-tight mb-6">
            Learn. Practice. <br/> 
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-600 to-indigo-600">Succeed — anywhere.</span>
          </h1>
          <p className="mt-4 max-w-2xl mx-auto text-xl text-gray-500 mb-10 font-light">
            LMS Pro helps students learn faster with expert-led lessons and <span className="text-slate-800 font-medium">24/7 AI tutor support</span> built into every course.
          </p>
          <div className="flex justify-center gap-4">
            <button 
              onClick={() => onNavigate('dashboard')}
              className="px-8 py-4 rounded-full bg-brand-600 text-white font-semibold text-lg hover:bg-brand-700 hover:shadow-xl hover:shadow-brand-600/20 transition-all transform hover:-translate-y-1"
            >
              Get Started — Free
            </button>
            <button className="px-8 py-4 rounded-full bg-white text-slate-700 border border-gray-200 font-semibold text-lg hover:bg-gray-50 transition-all">
              Book a Demo
            </button>
          </div>
        </div>
      </section>

      {/* Stats / Logos */}
      <section className="border-y border-gray-100 bg-white py-12">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-sm font-semibold text-gray-400 uppercase tracking-widest mb-6">Trusted by leading universities & teams</p>
          <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16 opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
             {/* Mock Logos */}
             <div className="text-2xl font-bold font-display">Stanford</div>
             <div className="text-2xl font-bold font-display">MIT OpenCourseWare</div>
             <div className="text-2xl font-bold font-display">Google Cloud</div>
             <div className="text-2xl font-bold font-display">Duolingo</div>
          </div>
        </div>
      </section>

      {/* Courses Preview */}
      <section className="py-24 bg-gray-50" id="courses">
         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-end mb-12">
              <div>
                <h2 className="text-3xl font-display font-bold text-slate-900">Popular Courses</h2>
                <p className="mt-2 text-gray-500">Explore our highest-rated content.</p>
              </div>
              <button className="text-brand-600 font-medium hover:text-brand-700 flex items-center gap-1">
                View All <span aria-hidden="true">&rarr;</span>
              </button>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {MOCK_COURSES.map(course => (
                <div key={course.id} className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 flex flex-col h-full cursor-pointer" onClick={() => onNavigate('player')}>
                  <div className="relative h-48 overflow-hidden">
                    <img src={course.thumbnail} alt={course.title} className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500" />
                    <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-md text-xs font-bold text-slate-800">
                      {course.lessons.length} Lessons
                    </div>
                  </div>
                  <div className="p-6 flex-1 flex flex-col">
                    <div className="text-xs font-semibold text-brand-600 mb-2 uppercase tracking-wide">Development</div>
                    <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-brand-600 transition-colors">{course.title}</h3>
                    <p className="text-gray-500 text-sm mb-4 line-clamp-2">{course.description}</p>
                    <div className="mt-auto flex items-center gap-3">
                       <div className="w-8 h-8 rounded-full bg-gray-200 overflow-hidden">
                          <img src={`https://ui-avatars.com/api/?name=${course.instructor}&background=random`} alt={course.instructor} />
                       </div>
                       <span className="text-sm font-medium text-gray-700">{course.instructor}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
         </div>
      </section>
    </div>
  );
};

export default Home;