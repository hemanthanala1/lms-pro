import React, { useState } from 'react';
import { MOCK_COURSES } from '../constants';
import AIChatSidebar from '../components/AIChatSidebar';
import { generateQuiz } from '../services/geminiService';

interface CoursePlayerProps {
  onAwardPoints: (points: number) => void;
}

const CoursePlayer: React.FC<CoursePlayerProps> = ({ onAwardPoints }) => {
  const course = MOCK_COURSES[0]; // hardcoded for demo
  const [currentLessonIdx, setCurrentLessonIdx] = useState(0);
  const [isChatOpen, setIsChatOpen] = useState(true);
  const [activeTab, setActiveTab] = useState<'notes' | 'transcript' | 'quiz'>('notes');
  const [generatedQuiz, setGeneratedQuiz] = useState<string | null>(null);
  const [isGeneratingQuiz, setIsGeneratingQuiz] = useState(false);

  const currentLesson = course.lessons[currentLessonIdx];

  const handleGenerateQuiz = async () => {
    setIsGeneratingQuiz(true);
    try {
      const quiz = await generateQuiz(currentLesson.transcript);
      setGeneratedQuiz(quiz);
      setActiveTab('quiz');
      // Gamification: Award points for generating a quiz
      onAwardPoints(50);
      // Optional: Trigger a browser alert or toast for demo
      // alert("You earned 50 points for creating a quiz!");
    } catch (e) {
      console.error(e);
      alert("Failed to generate quiz");
    } finally {
      setIsGeneratingQuiz(false);
    }
  };

  return (
    <div className="flex h-[calc(100vh-64px)] overflow-hidden bg-slate-900">
      {/* Main Content Area */}
      <div className="flex-1 flex flex-col relative overflow-y-auto scrollbar-hide">
        {/* Video Player Placeholder */}
        <div className="bg-black aspect-video w-full relative group">
           {/* Mock Video UI */}
           <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center cursor-pointer hover:scale-110 transition-transform">
                 <svg className="w-6 h-6 text-white ml-1" fill="currentColor" viewBox="0 0 20 20"><path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" /></svg>
              </div>
           </div>
           <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
              <div className="h-1 bg-gray-600 rounded-full mb-4 cursor-pointer">
                 <div className="h-1 bg-brand-500 w-1/3 rounded-full relative">
                    <div className="w-3 h-3 bg-white rounded-full absolute right-0 -top-1 shadow"></div>
                 </div>
              </div>
              <div className="flex justify-between text-white text-xs">
                 <span>04:20 / {currentLesson.duration}</span>
                 <span>1080p</span>
              </div>
           </div>
        </div>

        {/* Lesson Details & Tabs */}
        <div className="flex-1 bg-white">
          <div className="border-b border-gray-200">
            <nav className="flex -mb-px px-6" aria-label="Tabs">
               {['notes', 'transcript', 'quiz'].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab as any)}
                    className={`${
                      activeTab === tab
                        ? 'border-brand-500 text-brand-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    } whitespace-nowrap py-4 px-6 border-b-2 font-medium text-sm capitalize`}
                  >
                    {tab}
                  </button>
               ))}
            </nav>
          </div>
          
          <div className="p-8 max-w-4xl mx-auto">
             <div className="flex justify-between items-start mb-6">
                <h1 className="text-2xl font-bold text-slate-900">{currentLesson.title}</h1>
                <button 
                  onClick={handleGenerateQuiz}
                  disabled={isGeneratingQuiz}
                  className="flex items-center gap-2 bg-indigo-50 text-indigo-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-100 transition-colors"
                >
                  {isGeneratingQuiz ? (
                    <>
                      <svg className="animate-spin h-4 w-4 text-indigo-700" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                      Generating...
                    </>
                  ) : (
                    <>
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.384-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" /></svg>
                      Generate AI Quiz (+50 pts)
                    </>
                  )}
                </button>
             </div>

             {activeTab === 'notes' && (
               <div className="prose prose-slate prose-sm max-w-none">
                 {currentLesson.content.split('\n').map((line, i) => (
                    <p key={i}>{line}</p>
                 ))}
                 <p className="text-gray-500 italic mt-8">Note: This is a simulated Markdown rendering.</p>
               </div>
             )}

            {activeTab === 'transcript' && (
               <div className="prose prose-slate prose-sm max-w-none text-gray-600">
                 <p>{currentLesson.transcript}</p>
               </div>
             )}

            {activeTab === 'quiz' && (
               <div className="prose prose-indigo max-w-none bg-gray-50 p-6 rounded-xl border border-gray-100">
                 {generatedQuiz ? (
                    <div dangerouslySetInnerHTML={{__html: generatedQuiz.replace(/\n/g, '<br/>')}} />
                 ) : (
                    <div className="text-center py-12 text-gray-400">
                       <p>No quiz generated yet.</p>
                       <p className="text-sm">Click "Generate AI Quiz" to practice active recall.</p>
                    </div>
                 )}
               </div>
             )}
          </div>
        </div>
      </div>

      {/* Playlist Sidebar (Collapsible on mobile) */}
      <div className="w-80 bg-slate-900 border-l border-slate-800 hidden lg:flex flex-col">
        <div className="p-4 border-b border-slate-800">
          <h3 className="text-slate-200 font-bold mb-1">Course Content</h3>
          <p className="text-xs text-slate-500">{course.lessons.length} Lessons • 3h 20m Total</p>
        </div>
        <div className="flex-1 overflow-y-auto">
          {course.lessons.map((lesson, idx) => (
            <div 
              key={lesson.id} 
              onClick={() => setCurrentLessonIdx(idx)}
              className={`p-4 cursor-pointer hover:bg-slate-800 transition-colors flex gap-3 ${idx === currentLessonIdx ? 'bg-slate-800 border-l-2 border-brand-500' : 'border-l-2 border-transparent'}`}
            >
              <div className="mt-1">
                {idx === currentLessonIdx ? (
                   <div className="w-4 h-4 rounded-full border-2 border-brand-500 flex items-center justify-center">
                      <div className="w-1.5 h-1.5 rounded-full bg-brand-500"></div>
                   </div>
                ) : (
                   <div className="w-4 h-4 rounded-full border-2 border-slate-600"></div>
                )}
              </div>
              <div>
                <h4 className={`text-sm font-medium ${idx === currentLessonIdx ? 'text-white' : 'text-slate-400'}`}>{idx + 1}. {lesson.title}</h4>
                <p className="text-xs text-slate-500 mt-1">{lesson.duration}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* AI Chat Button */}
      {!isChatOpen && (
        <button 
          onClick={() => setIsChatOpen(true)}
          className="absolute bottom-6 right-6 w-14 h-14 bg-brand-600 rounded-full shadow-2xl flex items-center justify-center hover:scale-105 transition-transform z-40"
        >
          <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
          </svg>
        </button>
      )}

      {/* AI Sidebar */}
      <AIChatSidebar 
        course={course}
        currentLesson={currentLesson}
        isOpen={isChatOpen}
        onClose={() => setIsChatOpen(false)}
        onAwardPoints={onAwardPoints}
      />
    </div>
  );
};

export default CoursePlayer;