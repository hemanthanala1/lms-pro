import React, { useState } from 'react';
import { User } from '../types';
import NotificationDropdown, { Notification } from './NotificationDropdown';

interface NavbarProps {
  user: User | null;
  onSignOut: () => void;
  onNavigate: (path: string) => void;
  currentPath: string;
}

const MOCK_NOTIFICATIONS: Notification[] = [
  { id: '1', title: 'Assignment Graded', message: 'Your "React Component Design" assignment has been graded.', type: 'success', read: false, createdAt: new Date().toISOString() },
  { id: '2', title: 'New Course Available', message: 'Check out the new "Advanced TypeScript" course.', type: 'info', read: false, createdAt: new Date(Date.now() - 86400000).toISOString() },
  { id: '3', title: 'Quiz Reminder', message: 'You have a pending quiz in "UI/UX Design Principles".', type: 'warning', read: true, createdAt: new Date(Date.now() - 172800000).toISOString() },
];

const Navbar: React.FC<NavbarProps> = ({ user, onSignOut, onNavigate, currentPath }) => {
  const isActive = (path: string) => currentPath === path;
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>(MOCK_NOTIFICATIONS);

  const unreadCount = notifications.filter(n => !n.read).length;

  const handleMarkAsRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const handleClearAll = () => {
    setNotifications([]);
  };

  return (
    <nav className="glass sticky top-0 z-50 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0 flex items-center gap-2 cursor-pointer group" onClick={() => onNavigate('home')}>
              <div className="w-8 h-8 bg-brand-500 rounded-lg flex items-center justify-center text-white font-bold font-display transform group-hover:rotate-12 transition-transform">
                L
              </div>
              <span className="font-display font-bold text-xl text-slate-900 tracking-tight">LMS Pro</span>
            </div>
            
            {/* Contextual Navigation based on Role */}
            <div className="hidden sm:ml-10 sm:flex sm:space-x-8">
              <button 
                onClick={() => onNavigate('home')} 
                className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors ${
                  isActive('home') 
                    ? 'border-brand-500 text-slate-900' 
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Home
              </button>
              
              {user && (
                 <button 
                   onClick={() => onNavigate('dashboard')} 
                   className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors ${
                     isActive('dashboard') 
                       ? 'border-brand-500 text-slate-900' 
                       : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                   }`}
                 >
                   Dashboard
                 </button>
              )}

              <button 
                onClick={() => onNavigate('courses')} 
                className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors ${
                  isActive('courses') 
                    ? 'border-brand-500 text-slate-900' 
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Courses
              </button>
            </div>
          </div>
          <div className="flex items-center gap-4">
             {/* Gamification Points Display - Only for Students */}
             {user && user.role === 'student' && user.points > 0 && (
                <div className="hidden sm:flex items-center gap-1.5 bg-yellow-50 text-yellow-700 px-3 py-1 rounded-full border border-yellow-200 shadow-sm">
                  <svg className="w-4 h-4 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                     <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  <span className="text-sm font-bold">{user.points} pts</span>
                </div>
             )}
             
             {!user ? (
               <div className="flex items-center gap-4">
                 <button onClick={() => onNavigate('signin')} className="text-gray-500 hover:text-gray-900 font-medium text-sm transition-colors">Sign In</button>
                 <button onClick={() => onNavigate('signup')} className="bg-slate-900 text-white px-5 py-2 rounded-full text-sm font-medium hover:bg-slate-800 transition-all shadow-lg shadow-slate-900/20 hover:shadow-slate-900/30 transform hover:-translate-y-0.5">
                   Get Started
                 </button>
               </div>
             ) : (
               <div className="flex items-center gap-4">
                 {/* Notification Bell */}
                 <div className="relative">
                    <button 
                      onClick={() => setIsNotifOpen(!isNotifOpen)}
                      className="p-2 text-gray-400 hover:text-slate-600 transition-colors relative"
                    >
                       <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                       </svg>
                       {unreadCount > 0 && (
                         <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white"></span>
                       )}
                    </button>
                    <NotificationDropdown 
                      notifications={notifications}
                      onMarkAsRead={handleMarkAsRead}
                      onClearAll={handleClearAll}
                      isOpen={isNotifOpen}
                      onClose={() => setIsNotifOpen(false)}
                    />
                 </div>

                 <div className="flex items-center gap-3 pl-4 border-l border-gray-200">
                    <div className="text-right hidden md:block">
                       <div className="text-sm font-bold text-slate-800">{user.name}</div>
                       <div className="text-xs text-gray-500 capitalize">{user.role}</div>
                    </div>
                    <img 
                      src={user.avatar || `https://ui-avatars.com/api/?name=${user.name}&background=random`} 
                      className="w-9 h-9 rounded-full border-2 border-white shadow-sm" 
                      alt=""
                    />
                 </div>
                 <button 
                  onClick={onSignOut}
                  className="text-gray-400 hover:text-red-600 transition-colors p-1 rounded-full hover:bg-red-50"
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
