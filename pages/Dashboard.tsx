import React, { useState } from 'react';
import { MOCK_COURSES, MOCK_BADGES, MOCK_LEADERBOARD } from '../constants';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Badge } from '../types';
import { generateLearningPath } from '../services/geminiService';

interface DashboardProps {
  onNavigate: (path: string) => void;
  userPoints: number;
  userBadges: Badge[];
  enrolledCourseIds: string[];
}

interface LearningStep {
  title: string;
  description: string;
  type: 'video' | 'article' | 'practice';
  estimatedTime: string;
}

const Dashboard: React.FC<DashboardProps> = ({ onNavigate, userPoints, userBadges, enrolledCourseIds }) => {
  
  // Filter courses based on enrollment
  const myCourses = MOCK_COURSES.filter(course => enrolledCourseIds.includes(course.id));
  const [learningPath, setLearningPath] = useState<LearningStep[]>([]);
  const [isGeneratingPath, setIsGeneratingPath] = useState(false);

  const progressData = myCourses.map(c => ({
    name: c.title.split(' ').slice(0, 2).join(' '),
    progress: c.progress
  }));

  const nextLevelPoints = Math.ceil((userPoints + 1) / 1000) * 1000;
  const progressToNextLevel = (userPoints / nextLevelPoints) * 100;
  const currentLevel = Math.floor(userPoints / 1000) + 1;

  const handleGeneratePath = async () => {
    setIsGeneratingPath(true);
    try {
      // Mocking recent activity for demo
      const recentTopics = ['React Hooks', 'State Management'];
      const weakAreas = ['useEffect dependencies', 'Context API performance'];
      
      const path = await generateLearningPath(recentTopics, weakAreas);
      setLearningPath(path);
    } catch (e) {
      console.error(e);
    } finally {
      setIsGeneratingPath(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
           <h1 className="text-3xl font-display font-bold text-slate-900">Welcome back!</h1>
           <p className="text-gray-500 mt-1">Level {currentLevel} Scholar • {nextLevelPoints - userPoints} points to next level</p>
        </div>
        <div className="bg-white px-4 py-2 rounded-xl shadow-sm border border-gray-100 flex items-center gap-3">
           <div className="text-right">
              <div className="text-xs text-gray-400 font-bold uppercase tracking-wider">Total Score</div>
              <div className="text-xl font-bold text-brand-600">{userPoints} pts</div>
           </div>
           <div className="w-12 h-12 rounded-full bg-yellow-100 flex items-center justify-center text-2xl">🏆</div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Left Col - Stats & Courses */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* AI Learning Path Section */}
          <div className="bg-gradient-to-r from-brand-600 to-indigo-600 rounded-2xl shadow-lg p-6 text-white relative overflow-hidden">
             <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-16 -mt-16"></div>
             <div className="relative z-10">
                <div className="flex justify-between items-start mb-6">
                   <div>
                      <h2 className="text-xl font-bold flex items-center gap-2">
                         <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                         AI Personalized Path
                      </h2>
                      <p className="text-brand-100 text-sm mt-1">Based on your recent quiz performance and weak areas.</p>
                   </div>
                   <button 
                     onClick={handleGeneratePath}
                     disabled={isGeneratingPath}
                     className="bg-white text-brand-600 px-4 py-2 rounded-lg text-sm font-bold hover:bg-brand-50 transition-colors disabled:opacity-70"
                   >
                     {isGeneratingPath ? 'Analyzing...' : 'Generate New Path'}
                   </button>
                </div>

                {learningPath.length > 0 ? (
                   <div className="space-y-3">
                      {learningPath.map((step, idx) => (
                         <div key={idx} className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20 flex items-center gap-4">
                            <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center font-bold text-lg">
                               {idx + 1}
                            </div>
                            <div className="flex-1">
                               <h3 className="font-bold text-white">{step.title}</h3>
                               <p className="text-xs text-brand-100">{step.description}</p>
                            </div>
                            <div className="text-right">
                               <span className="text-xs font-bold bg-white/20 px-2 py-1 rounded uppercase">{step.type}</span>
                               <div className="text-xs text-brand-100 mt-1">{step.estimatedTime}</div>
                            </div>
                         </div>
                      ))}
                   </div>
                ) : (
                   <div className="text-center py-8 bg-white/5 rounded-xl border border-white/10 border-dashed">
                      <p className="text-brand-100 text-sm">Click "Generate New Path" to get a custom study plan.</p>
                   </div>
                )}
             </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-3 gap-4">
             <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <div className="text-3xl font-bold text-brand-600 mb-1">{Math.floor(userPoints / 200)}</div>
                <div className="text-sm text-gray-500 font-medium">Hours Learned</div>
             </div>
             <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <div className="text-3xl font-bold text-indigo-600 mb-1">85%</div>
                <div className="text-sm text-gray-500 font-medium">Avg. Quiz Score</div>
             </div>
             <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <div className="text-3xl font-bold text-slate-700 mb-1">{myCourses.length}</div>
                <div className="text-sm text-gray-500 font-medium">Active Courses</div>
             </div>
          </div>

          {/* Gamification - Badges */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
             <div className="flex justify-between items-center mb-6">
               <h2 className="text-lg font-bold text-slate-900">Your Achievements</h2>
               <span className="text-xs font-medium text-gray-400">{userBadges.length} / {MOCK_BADGES.length} Unlocked</span>
             </div>
             <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
               {MOCK_BADGES.map(badge => {
                 const isUnlocked = userBadges.find(b => b.id === badge.id);
                 return (
                   <div key={badge.id} className={`p-4 rounded-xl border flex flex-col items-center text-center transition-all ${isUnlocked ? `bg-white border-gray-100 shadow-sm ${badge.color.replace('text-', 'hover:bg-opacity-50 ')}` : 'bg-gray-50 border-gray-100 opacity-50 grayscale'}`}>
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center text-2xl mb-3 ${isUnlocked ? badge.color : 'bg-gray-200 text-gray-400'}`}>
                         {badge.icon}
                      </div>
                      <h3 className="font-bold text-slate-800 text-sm">{badge.name}</h3>
                      <p className="text-xs text-gray-500 mt-1 leading-tight">{badge.description}</p>
                   </div>
                 );
               })}
             </div>
          </div>

          {/* Continue Learning */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-lg font-bold text-slate-900 mb-4">My Courses</h2>
            {myCourses.length > 0 ? (
              <div className="space-y-4">
                {myCourses.map(course => (
                  <div key={course.id} className="flex flex-col sm:flex-row gap-4 p-4 rounded-xl hover:bg-gray-50 transition-colors border border-transparent hover:border-gray-100 cursor-pointer" onClick={() => onNavigate('player')}>
                     <div className="w-full sm:w-32 h-20 rounded-lg overflow-hidden bg-gray-200 flex-shrink-0">
                        <img src={course.thumbnail} className="w-full h-full object-cover" alt="" />
                     </div>
                     <div className="flex-1">
                        <h3 className="font-bold text-slate-900">{course.title}</h3>
                        <p className="text-sm text-gray-500 mb-3">{course.instructor}</p>
                        <div className="w-full bg-gray-100 rounded-full h-2">
                           <div className="bg-brand-500 h-2 rounded-full" style={{ width: `${course.progress}%` }}></div>
                        </div>
                        <div className="flex justify-between mt-2 text-xs text-gray-400">
                           <span>{course.progress}% Complete</span>
                           <span>{course.lessons.length} Lessons left</span>
                        </div>
                     </div>
                     <div className="flex items-center">
                        <button className="w-10 h-10 rounded-full bg-white border border-gray-200 flex items-center justify-center text-slate-400 hover:text-brand-600 hover:border-brand-600 transition-colors">
                          <svg className="w-5 h-5 ml-0.5" fill="currentColor" viewBox="0 0 20 20">
                             <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
                          </svg>
                        </button>
                     </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-10 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                <p className="text-gray-500 mb-4">You haven't enrolled in any courses yet.</p>
                <button onClick={() => onNavigate('courses')} className="bg-brand-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-brand-700">Explore Courses</button>
              </div>
            )}
          </div>
        </div>

        {/* Right Col - Charts, Leaderboard & Goals */}
        <div className="space-y-8">
           
           {/* Level Progress */}
           <div className="bg-gradient-to-br from-indigo-600 to-indigo-800 p-6 rounded-2xl shadow-lg text-white relative overflow-hidden">
              <div className="absolute top-0 right-0 -mt-4 -mr-4 w-32 h-32 bg-white/10 rounded-full blur-xl"></div>
              <div className="relative z-10">
                 <div className="flex justify-between items-center mb-2">
                   <h3 className="font-bold text-lg">Level {currentLevel}</h3>
                   <span className="text-indigo-200 text-sm">{Math.round(progressToNextLevel)}%</span>
                 </div>
                 <div className="w-full bg-black/20 rounded-full h-2.5 mb-4">
                    <div className="bg-white h-2.5 rounded-full transition-all duration-1000" style={{ width: `${progressToNextLevel}%` }}></div>
                 </div>
                 <p className="text-indigo-100 text-sm">
                   Earn <strong>{nextLevelPoints - userPoints}</strong> more points to reach Level {currentLevel + 1}!
                 </p>
              </div>
           </div>

           {/* Leaderboard */}
           <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
              <h2 className="text-lg font-bold text-slate-900 mb-4">Class Leaderboard</h2>
              <div className="space-y-4">
                {MOCK_LEADERBOARD.map((user) => (
                   <div key={user.id} className="flex items-center gap-3">
                      <div className={`w-6 text-center font-bold ${user.rank === 1 ? 'text-yellow-500' : user.rank === 2 ? 'text-gray-400' : user.rank === 3 ? 'text-orange-400' : 'text-slate-400'}`}>
                        {user.rank}
                      </div>
                      <img src={user.avatar} className="w-10 h-10 rounded-full bg-gray-100" alt={user.name} />
                      <div className="flex-1 min-w-0">
                         <div className="text-sm font-bold text-slate-900 truncate">{user.name}</div>
                         <div className="text-xs text-gray-500">{user.points} pts</div>
                      </div>
                   </div>
                ))}
              </div>
              <button className="w-full mt-4 py-2 text-sm text-brand-600 font-medium hover:bg-brand-50 rounded-lg transition-colors">
                 View Full Ranking
              </button>
           </div>
           
           {/* Learning Activity Chart */}
           {myCourses.length > 0 && (
             <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <h2 className="text-lg font-bold text-slate-900 mb-6">Learning Activity</h2>
                <div className="h-48">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={progressData}>
                      <XAxis dataKey="name" axisLine={false} tickLine={false} fontSize={12} tick={{fill: '#94a3b8'}} />
                      <Tooltip cursor={{fill: '#f1f5f9'}} contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}} />
                      <Bar dataKey="progress" radius={[4, 4, 0, 0]}>
                        {progressData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={index % 2 === 0 ? '#0ea5a4' : '#6366f1'} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
             </div>
           )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
