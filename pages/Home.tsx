import React from 'react';
import { MOCK_COURSES } from '../constants';

const Home: React.FC<{onNavigate: (path: string) => void}> = ({ onNavigate }) => {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative pt-32 pb-24 lg:pt-48 lg:pb-32 overflow-hidden">
        <div className="absolute top-0 right-0 -mr-24 -mt-24 w-96 h-96 rounded-full bg-brand-500/10 blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 left-0 -ml-24 -mb-24 w-64 h-64 rounded-full bg-indigo-500/10 blur-3xl animate-pulse delay-1000"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-50 text-brand-600 text-xs font-bold uppercase tracking-wider mb-6 animate-fade-in">
            <span className="w-2 h-2 rounded-full bg-brand-500 animate-ping"></span>
            New AI Features Available
          </div>
          <h1 className="text-5xl md:text-7xl font-display font-bold text-slate-900 tracking-tight mb-6 animate-slide-up">
            Learn. Practice. <br/> 
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-600 to-indigo-600">Succeed — anywhere.</span>
          </h1>
          <p className="mt-4 max-w-2xl mx-auto text-xl text-gray-500 mb-10 font-light animate-slide-up delay-100">
            LMS Pro helps students learn faster with expert-led lessons and <span className="text-slate-800 font-medium">24/7 AI tutor support</span> built into every course.
          </p>
          <div className="flex justify-center gap-4 animate-slide-up delay-200">
            <button 
              onClick={() => onNavigate('dashboard')}
              className="px-8 py-4 rounded-full bg-brand-600 text-white font-semibold text-lg hover:bg-brand-700 hover:shadow-xl hover:shadow-brand-600/20 transition-all transform hover:-translate-y-1"
            >
              Get Started — Free
            </button>
            <button className="px-8 py-4 rounded-full bg-white text-slate-700 border border-gray-200 font-semibold text-lg hover:bg-gray-50 transition-all hover:border-gray-300">
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
             <div className="text-2xl font-bold font-display text-slate-800">Stanford</div>
             <div className="text-2xl font-bold font-display text-slate-800">MIT OpenCourseWare</div>
             <div className="text-2xl font-bold font-display text-slate-800">Google Cloud</div>
             <div className="text-2xl font-bold font-display text-slate-800">Duolingo</div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-display font-bold text-slate-900">Why choose LMS Pro?</h2>
            <p className="mt-4 text-gray-500 max-w-2xl mx-auto">We combine world-class content with cutting-edge AI technology to help you master any subject faster.</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-12">
            <div className="text-center group">
              <div className="w-16 h-16 bg-brand-50 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                <svg className="w-8 h-8 text-brand-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" /></svg>
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">AI-Powered Learning</h3>
              <p className="text-gray-500 leading-relaxed">Get instant answers to your questions while watching videos. Our AI tutor understands the context of every lesson.</p>
            </div>
            <div className="text-center group">
              <div className="w-16 h-16 bg-indigo-50 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                <svg className="w-8 h-8 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Expert Instructors</h3>
              <p className="text-gray-500 leading-relaxed">Learn from industry professionals who have worked at top companies. Practical knowledge, not just theory.</p>
            </div>
            <div className="text-center group">
              <div className="w-16 h-16 bg-rose-50 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                <svg className="w-8 h-8 text-rose-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Gamified Progress</h3>
              <p className="text-gray-500 leading-relaxed">Earn points, badges, and climb the leaderboard. Stay motivated by tracking your streak and achievements.</p>
            </div>
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
              <button onClick={() => onNavigate('courses')} className="text-brand-600 font-medium hover:text-brand-700 flex items-center gap-1 group">
                View All <span aria-hidden="true" className="group-hover:translate-x-1 transition-transform">&rarr;</span>
              </button>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {MOCK_COURSES.map(course => (
                <div key={course.id} className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 flex flex-col h-full cursor-pointer hover:-translate-y-1" onClick={() => onNavigate('player')}>
                  <div className="relative h-48 overflow-hidden">
                    <img src={course.thumbnail} alt={course.title} className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500" />
                    <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-md text-xs font-bold text-slate-800 shadow-sm">
                      {course.lessons.length} Lessons
                    </div>
                    <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                       <span className="bg-white text-slate-900 px-4 py-2 rounded-full font-bold text-sm transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">Start Learning</span>
                    </div>
                  </div>
                  <div className="p-6 flex-1 flex flex-col">
                    <div className="flex justify-between items-start mb-2">
                       <div className="text-xs font-semibold text-brand-600 uppercase tracking-wide bg-brand-50 px-2 py-0.5 rounded-full">Development</div>
                       <div className="flex items-center text-yellow-400 text-xs font-bold gap-1">
                          <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                          4.8
                       </div>
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-brand-600 transition-colors">{course.title}</h3>
                    <p className="text-gray-500 text-sm mb-4 line-clamp-2">{course.description}</p>
                    <div className="mt-auto flex items-center gap-3 pt-4 border-t border-gray-50">
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

      {/* CTA Section */}
      <section className="py-24 bg-slate-900 relative overflow-hidden">
         <div className="absolute top-0 right-0 -mr-24 -mt-24 w-96 h-96 rounded-full bg-brand-500/20 blur-3xl"></div>
         <div className="absolute bottom-0 left-0 -ml-24 -mb-24 w-64 h-64 rounded-full bg-indigo-500/20 blur-3xl"></div>
         
         <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
            <h2 className="text-4xl font-display font-bold text-white mb-6">Ready to start your learning journey?</h2>
            <p className="text-slate-300 text-lg mb-10">Join thousands of students who are already mastering new skills with LMS Pro. Get started for free today.</p>
            <button 
              onClick={() => onNavigate('signup')}
              className="px-8 py-4 rounded-full bg-white text-slate-900 font-bold text-lg hover:bg-brand-50 transition-all transform hover:-translate-y-1 shadow-xl shadow-white/10"
            >
              Create Free Account
            </button>
         </div>
      </section>
    </div>
  );
};

export default Home;
