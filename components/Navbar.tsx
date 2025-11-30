import React from 'react';
import { User } from '../types';

interface NavbarProps {
  user: User | null;
  onSignOut: () => void;
  onNavigate: (path: string) => void;
}

const Navbar: React.FC<NavbarProps> = ({ user, onSignOut, onNavigate }) => {
  return (
    <nav className="bg-white border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0 flex items-center gap-2 cursor-pointer" onClick={() => onNavigate('home')}>
              <div className="w-8 h-8 bg-brand-500 rounded-lg flex items-center justify-center text-white font-bold font-display">
                L
              </div>
              <span className="font-display font-bold text-xl text-slate-900">LMS Pro</span>
            </div>
            
            {/* Contextual Navigation based on Role */}
            <div className="hidden sm:ml-8 sm:flex sm:space-x-8">
              <button onClick={() => onNavigate('home')} className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">
                Home
              </button>
              
              {user && (
                 <button onClick={() => onNavigate('dashboard')} className="border-brand-500 text-gray-900 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">
                   Dashboard
                 </button>
              )}

              <button onClick={() => onNavigate('courses')} className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">
                Courses
              </button>
            </div>
          </div>
          <div className="flex items-center gap-4">
             {/* Gamification Points Display - Only for Students */}
             {user && user.role === 'student' && user.points > 0 && (
                <div className="hidden sm:flex items-center gap-1.5 bg-yellow-50 text-yellow-700 px-3 py-1 rounded-full border border-yellow-200">
                  <svg className="w-4 h-4 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                     <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  <span className="text-sm font-bold">{user.points} pts</span>
                </div>
             )}
             
             {!user ? (
               <div className="flex items-center gap-4">
                 <button onClick={() => onNavigate('signin')} className="text-gray-500 hover:text-gray-900 font-medium text-sm">Sign In</button>
                 <button onClick={() => onNavigate('signup')} className="bg-slate-900 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-slate-800 transition-colors shadow-lg shadow-slate-900/10">
                   Get Started
                 </button>
               </div>
             ) : (
               <div className="flex items-center gap-4">
                 <div className="flex items-center gap-2">
                    <div className="text-right hidden md:block">
                       <div className="text-sm font-bold text-slate-800">{user.name}</div>
                       <div className="text-xs text-gray-500 capitalize">{user.role}</div>
                    </div>
                    <img 
                      src={user.avatar || `https://ui-avatars.com/api/?name=${user.name}&background=random`} 
                      className="w-8 h-8 rounded-full border border-gray-200" 
                      alt=""
                    />
                 </div>
                 <button 
                  onClick={onSignOut}
                  className="text-gray-400 hover:text-red-600 transition-colors"
                  title="Sign Out"
                 >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                 </button>
               </div>
             )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;