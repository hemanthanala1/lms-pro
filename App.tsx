import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import StudentDashboard from './pages/Dashboard';
import TeacherDashboard from './pages/TeacherDashboard';
import AdminDashboard from './pages/AdminDashboard';
import CreatorDashboard from './pages/CreatorDashboard';
import CoursePlayer from './pages/CoursePlayer';
import Courses from './pages/Courses';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import { MOCK_BADGES, MOCK_COURSES } from './constants';
import { Badge, User, UserRole } from './types';
import { supabase } from './lib/supabaseClient';

// Simple Toast Component for Notifications
const Toast: React.FC<{ message: string; type: 'success' | 'info'; onClose: () => void }> = ({ message, type, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 5000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className={`fixed bottom-4 right-4 max-w-sm w-full bg-white border-l-4 ${type === 'success' ? 'border-green-500' : 'border-blue-500'} shadow-2xl rounded-r-lg p-4 z-50 transform transition-all animate-slide-up`}>
      <div className="flex items-start">
        <div className="flex-shrink-0">
          {type === 'success' ? (
            <svg className="h-6 w-6 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          ) : (
            <svg className="h-6 w-6 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          )}
        </div>
        <div className="ml-3 w-0 flex-1 pt-0.5">
          <p className="text-sm font-medium text-gray-900">
            {type === 'success' ? 'Success' : 'Notification'}
          </p>
          <p className="mt-1 text-sm text-gray-500 whitespace-pre-line">{message}</p>
        </div>
        <div className="ml-4 flex-shrink-0 flex">
          <button onClick={onClose} className="bg-white rounded-md inline-flex text-gray-400 hover:text-gray-500 focus:outline-none">
            <span className="sr-only">Close</span>
            <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" /></svg>
          </button>
        </div>
      </div>
    </div>
  );
};

const App: React.FC = () => {
  const [currentPath, setCurrentPath] = useState('home');
  const [user, setUser] = useState<User | null>(null);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'info' } | null>(null);
  const [userBadges, setUserBadges] = useState<Badge[]>([MOCK_BADGES[0], MOCK_BADGES[2]]);
  const [isInitializing, setIsInitializing] = useState(true);

  // Auth Listener
  useEffect(() => {
    let mounted = true;

    // 1. Check active session on load
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
         fetchUserProfile(session.user.id).finally(() => {
            if(mounted) setIsInitializing(false);
         });
      } else {
         if(mounted) setIsInitializing(false);
      }
    });

    // 2. Listen for auth changes (SignIn, SignOut, etc.)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        setIsInitializing(true);
        // Add a small retry mechanism in fetchUserProfile to handle Trigger latency
        fetchUserProfile(session.user.id).finally(() => {
           if(mounted) {
             setIsInitializing(false);
             
             const hash = window.location.hash.replace('#', '');
             // If user is on public auth pages, redirect to dashboard
             if(hash === 'signin' || hash === 'signup' || hash === '') {
                navigate('dashboard');
             }
           }
        });
      } else {
        if(mounted) {
           setUser(null);
           setIsInitializing(false);
           navigate('home');
        }
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const fetchUserProfile = async (userId: string, retries = 3) => {
    try {
      // Fetch Profile
      let { data: profile, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      // Retry logic: If profile is missing (race condition with SQL trigger), wait and try again
      if ((!profile || error) && retries > 0) {
        await new Promise(resolve => setTimeout(resolve, 500));
        return fetchUserProfile(userId, retries - 1);
      }

      if (error) {
        console.error('Error fetching profile:', error);
        return;
      }

      // Fetch Enrollments
      const { data: enrollments } = await supabase
        .from('enrollments')
        .select('course_id')
        .eq('user_id', userId);
      
      const enrolledIds = enrollments ? enrollments.map((e: any) => e.course_id) : [];

      if (profile) {
        setUser({
          id: profile.id,
          name: profile.full_name || 'User',
          email: 'user@example.com', // Supabase session has email
          role: profile.role as UserRole,
          points: profile.points || 0,
          level: Math.floor((profile.points || 0) / 1000) + 1,
          avatar: profile.avatar_url,
          enrolledCourses: enrolledIds
        });
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleSignIn = () => {
    // handled by supabase listener
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
  };

  const handleAwardPoints = async (points: number) => {
    if (!user || user.role !== 'student') return;
    const newPoints = user.points + points;
    
    // Update local
    setUser({ ...user, points: newPoints });

    // Update DB
    await supabase.from('profiles').update({ points: newPoints }).eq('id', user.id);

    if (newPoints > 2600 && !userBadges.find(b => b.id === 'b2')) {
       setUserBadges(prev => [...prev, MOCK_BADGES[1]]);
       setToast({ message: "You've unlocked the 'Quiz Master' badge!", type: 'success' });
    }
  };

  const handleEnroll = async (courseId: string) => {
    if (!user) {
      navigate('signin');
      return;
    }
    if (user.enrolledCourses.includes(courseId)) return;

    // DB Insert
    const { error } = await supabase
      .from('enrollments')
      .insert({ user_id: user.id, course_id: courseId });
    
    if (error) {
      console.error(error);
      setToast({ message: 'Enrollment failed', type: 'info' });
      return;
    }

    const updatedUser = { ...user, enrolledCourses: [...user.enrolledCourses, courseId] };
    setUser(updatedUser);
    
    const course = MOCK_COURSES.find(c => c.id === courseId);
    const courseTitle = course ? course.title : 'the course';

    setToast({
      message: `You have successfully enrolled in "${courseTitle}"!`,
      type: 'success'
    });
  };

  const handleUnenroll = async (courseId: string) => {
    if (!user) return;

    // DB Delete
    const { error } = await supabase
      .from('enrollments')
      .delete()
      .eq('user_id', user.id)
      .eq('course_id', courseId);
      
    if(error) {
       console.error(error);
       return;
    }

    const updatedUser = { 
      ...user, 
      enrolledCourses: user.enrolledCourses.filter(id => id !== courseId) 
    };
    setUser(updatedUser);

    const course = MOCK_COURSES.find(c => c.id === courseId);
    const courseTitle = course ? course.title : 'the course';

    setToast({
      message: `You have successfully withdrawn from "${courseTitle}".`,
      type: 'info'
    });
  };

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '');
      if (hash) setCurrentPath(hash);
      else setCurrentPath('home');
    };
    window.addEventListener('hashchange', handleHashChange);
    handleHashChange();
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const navigate = (path: string) => {
    window.location.hash = path;
    setCurrentPath(path);
  };

  if (isInitializing) {
     return (
        <div className="min-h-screen bg-white flex flex-col items-center justify-center">
           <div className="w-16 h-16 bg-brand-500 rounded-2xl flex items-center justify-center animate-pulse mb-4">
              <span className="text-white font-bold text-3xl">L</span>
           </div>
           <div className="text-gray-500 font-medium">Loading LMS Pro...</div>
        </div>
     );
  }

  const renderPage = () => {
    switch (currentPath) {
      case 'home':
        return <Home onNavigate={navigate} />;
      case 'signin':
        return <SignIn onSignIn={handleSignIn} onNavigate={navigate} />;
      case 'signup':
        return <SignUp onNavigate={navigate} />;
      case 'dashboard':
        if (!user) return <SignIn onSignIn={handleSignIn} onNavigate={navigate} />;
        if (user.role === 'teacher') return <TeacherDashboard onNavigate={navigate} />;
        if (user.role === 'admin') return <AdminDashboard onNavigate={navigate} />;
        if (user.role === 'creator') return <CreatorDashboard onNavigate={navigate} />;
        return (
          <StudentDashboard 
            onNavigate={navigate} 
            userPoints={user.points} 
            userBadges={userBadges}
            enrolledCourseIds={user.enrolledCourses}
            onUnenroll={handleUnenroll}
          />
        );
      case 'player':
        if (!user) return <SignIn onSignIn={handleSignIn} onNavigate={navigate} />;
        return <CoursePlayer onAwardPoints={handleAwardPoints} />;
      case 'courses':
        return (
          <Courses 
            onNavigate={navigate} 
            user={user} 
            onEnroll={handleEnroll} 
            onUnenroll={handleUnenroll} 
          />
        );
      default:
        return <Home onNavigate={navigate} />;
    }
  };

  return (
    <div className="min-h-screen bg-brand-50 font-sans text-slate-900 relative">
      {currentPath !== 'player' && currentPath !== 'signin' && currentPath !== 'signup' && (
        <Navbar user={user} onSignOut={handleSignOut} onNavigate={navigate} />
      )}
      
      <main>
        {renderPage()}
      </main>
      
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      {currentPath !== 'player' && currentPath !== 'signin' && currentPath !== 'signup' && (
        <footer className="bg-slate-900 text-white py-12 mt-auto">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid md:grid-cols-4 gap-8">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center gap-2 mb-4">
                 <div className="w-8 h-8 bg-brand-500 rounded-lg flex items-center justify-center text-white font-bold">L</div>
                 <span className="font-bold text-xl">LMS Pro</span>
              </div>
              <p className="text-slate-400 max-w-sm">Empowering the next generation of learners with AI-driven tools and world-class content.</p>
            </div>
            <div>
              <h4 className="font-bold mb-4">Product</h4>
              <ul className="space-y-2 text-slate-400 text-sm">
                <li><a href="#" className="hover:text-white">Courses</a></li>
                <li><a href="#" className="hover:text-white">For Business</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">Company</h4>
              <ul className="space-y-2 text-slate-400 text-sm">
                <li><a href="#" className="hover:text-white">About Us</a></li>
                <li><a href="#" className="hover:text-white">Contact</a></li>
              </ul>
            </div>
          </div>
          <div className="max-w-7xl mx-auto px-4 mt-12 pt-8 border-t border-slate-800 text-center text-slate-500 text-sm">
            © 2024 LMS Pro Inc. All rights reserved.
          </div>
        </footer>
      )}
    </div>
  );
};

export default App;