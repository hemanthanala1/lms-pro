
import React, { useState, useEffect } from 'react';
import { MOCK_COURSES } from '../constants';
import AIChatSidebar from '../components/AIChatSidebar';
import { generateQuiz } from '../services/geminiService';
import { getAssignmentsForCourse, submitAssignment } from '../services/assignmentService';
import { getQuizzesForCourse, submitQuiz } from '../services/quizService';
import { Assignment, Quiz, QuizQuestion } from '../types';

interface CoursePlayerProps {
  onAwardPoints: (points: number) => void;
  onNavigate: (path: string) => void;
}

const CoursePlayer: React.FC<CoursePlayerProps> = ({ onAwardPoints, onNavigate }) => {
  const course = MOCK_COURSES[0]; // hardcoded for demo
  const [currentLessonIdx, setCurrentLessonIdx] = useState(0);
  const [isChatOpen, setIsChatOpen] = useState(true);
  const [activeTab, setActiveTab] = useState<'notes' | 'transcript' | 'quiz' | 'assignments'>('notes');
  const [generatedQuiz, setGeneratedQuiz] = useState<string | null>(null);
  const [isGeneratingQuiz, setIsGeneratingQuiz] = useState(false);

  // Assignments State
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [selectedAssignment, setSelectedAssignment] = useState<Assignment | null>(null);
  const [assignmentSubmission, setAssignmentSubmission] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isSubmittingAssignment, setIsSubmittingAssignment] = useState(false);

  // Quiz State
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [selectedQuiz, setSelectedQuiz] = useState<Quiz | null>(null);
  const [quizAnswers, setQuizAnswers] = useState<Record<string, string>>({});
  const [quizScore, setQuizScore] = useState<number | null>(null);

  const currentLesson = course.lessons[currentLessonIdx];

  useEffect(() => {
    // Load Assignments and Quizzes
    const loadData = async () => {
      const fetchedAssignments = await getAssignmentsForCourse(course.id);
      setAssignments(fetchedAssignments);
      const fetchedQuizzes = await getQuizzesForCourse(course.id);
      setQuizzes(fetchedQuizzes);
    };
    loadData();
  }, [course.id]);

  const handleGenerateQuiz = async () => {
    setIsGeneratingQuiz(true);
    try {
      const quiz = await generateQuiz(currentLesson.transcript);
      setGeneratedQuiz(quiz);
      setActiveTab('quiz');
      onAwardPoints(50);
    } catch (e) {
      console.error(e);
      alert("Failed to generate quiz");
    } finally {
      setIsGeneratingQuiz(false);
    }
  };

  const handleSubmitAssignment = async () => {
    if (!selectedAssignment) return;
    setIsSubmittingAssignment(true);
    try {
      // Simulate file upload if a file is selected
      let submissionContent = assignmentSubmission;
      if (selectedFile) {
        // In a real app, upload to Supabase Storage here
        // const { data } = await supabase.storage.from('assignments').upload(...)
        submissionContent += `\n\n[Attached File: ${selectedFile.name}]`;
      }

      await submitAssignment({
        assignmentId: selectedAssignment.id,
        studentId: 'current-user-id', // Mock ID
        content: submissionContent,
      });
      alert('Assignment submitted successfully!');
      setAssignmentSubmission('');
      setSelectedFile(null);
      setSelectedAssignment(null);
      onAwardPoints(100);
    } catch (e) {
      console.error(e);
      alert('Failed to submit assignment');
    } finally {
      setIsSubmittingAssignment(false);
    }
  };

  const handleQuizOptionSelect = (questionId: string, option: string) => {
    setQuizAnswers(prev => ({ ...prev, [questionId]: option }));
  };

  const handleSubmitQuiz = async () => {
    if (!selectedQuiz) return;
    
    // Calculate Score locally for demo (in real app, backend does this)
    let correctCount = 0;
    selectedQuiz.questions.forEach(q => {
      if (quizAnswers[q.id] === q.correctAnswer) {
        correctCount++;
      }
    });
    const score = Math.round((correctCount / selectedQuiz.questions.length) * 100);
    setQuizScore(score);

    try {
      await submitQuiz({
        quizId: selectedQuiz.id,
        studentId: 'current-user-id',
        score: score,
        answers: quizAnswers
      });
      onAwardPoints(score); // Award points based on score
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="flex h-[calc(100vh-64px)] overflow-hidden bg-slate-900">
      {/* Main Content Area */}
      <div className="flex-1 flex flex-col relative overflow-y-auto scrollbar-hide">
        {/* Back Button */}
        <button 
          onClick={() => onNavigate('dashboard')}
          className="absolute top-4 left-4 z-20 bg-black/50 hover:bg-black/70 text-white px-4 py-2 rounded-lg flex items-center gap-2 backdrop-blur-sm transition-colors text-sm font-medium"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Dashboard
        </button>

        {/* Main Content Display (Video or Text) */}
        {currentLesson.type === 'text' ? (
          <div className="bg-slate-100 aspect-video w-full relative flex flex-col p-8 overflow-y-auto">
             <div className="max-w-3xl mx-auto bg-white p-8 rounded-xl shadow-sm w-full my-auto">
                <div className="flex items-center gap-3 mb-6 border-b pb-4">
                   <div className="w-12 h-12 bg-brand-100 rounded-lg flex items-center justify-center text-brand-600">
                      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                      </svg>
                   </div>
                   <div>
                      <h2 className="text-xl font-bold text-slate-800">Study Material</h2>
                      <p className="text-sm text-slate-500">Read carefully to complete the lesson</p>
                   </div>
                </div>
                
                <div className="prose prose-slate max-w-none mb-8">
                   {currentLesson.content.split('\n').map((line, i) => (
                      <p key={i} className="mb-4 text-slate-700 leading-relaxed">{line}</p>
                   ))}
                </div>

                <div className="flex justify-end">
                   <button className="bg-brand-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-brand-700 transition-colors shadow-sm">
                      Mark as Completed
                   </button>
                </div>
             </div>
          </div>
        ) : (
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
        )}

        {/* Lesson Details & Tabs */}
        <div className="flex-1 bg-white">
          <div className="border-b border-gray-200">
            <nav className="flex -mb-px px-6" aria-label="Tabs">
               {['notes', 'transcript', 'quiz', 'assignments'].map((tab) => (
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
                {activeTab === 'quiz' && !selectedQuiz && (
                  <button 
                    onClick={handleGenerateQuiz}
                    disabled={isGeneratingQuiz}
                    className="flex items-center gap-2 bg-indigo-50 text-indigo-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-100 transition-colors"
                  >
                    {isGeneratingQuiz ? 'Generating...' : 'Generate AI Quiz (+50 pts)'}
                  </button>
                )}
             </div>

             {activeTab === 'notes' && (
               <div className="prose prose-slate prose-sm max-w-none">
                 {currentLesson.content.split('\n').map((line, i) => (
                    <p key={i}>{line}</p>
                 ))}
               </div>
             )}

            {activeTab === 'transcript' && (
               <div className="prose prose-slate prose-sm max-w-none text-gray-600">
                 <p>{currentLesson.transcript}</p>
               </div>
             )}

            {activeTab === 'quiz' && (
               <div className="space-y-6">
                 {/* List Quizzes if none selected */}
                 {!selectedQuiz && !generatedQuiz && (
                   <div className="grid gap-4">
                     <h3 className="text-lg font-semibold">Available Quizzes</h3>
                     {quizzes.map(quiz => (
                       <div key={quiz.id} className="border p-4 rounded-lg hover:bg-gray-50 cursor-pointer flex justify-between items-center" onClick={() => { setSelectedQuiz(quiz); setQuizScore(null); setQuizAnswers({}); }}>
                         <div>
                           <h4 className="font-medium">{quiz.title}</h4>
                           <p className="text-sm text-gray-500">{quiz.description}</p>
                         </div>
                         <button className="text-brand-600 font-medium text-sm">Start Quiz &rarr;</button>
                       </div>
                     ))}
                     {quizzes.length === 0 && <p className="text-gray-500">No pre-made quizzes available.</p>}
                   </div>
                 )}

                 {/* Render Selected Quiz */}
                 {selectedQuiz && (
                   <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                     <div className="flex justify-between items-center mb-6">
                        <h2 className="text-xl font-bold">{selectedQuiz.title}</h2>
                        <button onClick={() => setSelectedQuiz(null)} className="text-sm text-gray-500 hover:text-gray-700">Back to List</button>
                     </div>
                     
                     {quizScore !== null ? (
                       <div className="text-center py-8">
                         <div className="text-4xl font-bold text-brand-600 mb-2">{quizScore}%</div>
                         <p className="text-gray-600 mb-6">Your Score</p>
                         <button onClick={() => setSelectedQuiz(null)} className="bg-brand-600 text-white px-6 py-2 rounded-lg hover:bg-brand-700">Done</button>
                       </div>
                     ) : (
                       <div className="space-y-8">
                         {selectedQuiz.questions.map((q, idx) => (
                           <div key={q.id} className="border-b border-gray-100 pb-6 last:border-0">
                             <p className="font-medium text-lg mb-4">{idx + 1}. {q.questionText}</p>
                             <div className="space-y-2">
                               {q.options.map(option => (
                                 <label key={option} className={`flex items-center p-3 rounded-lg border cursor-pointer transition-colors ${quizAnswers[q.id] === option ? 'border-brand-500 bg-brand-50' : 'border-gray-200 hover:bg-gray-50'}`}>
                                   <input 
                                     type="radio" 
                                     name={q.id} 
                                     value={option}
                                     checked={quizAnswers[q.id] === option}
                                     onChange={() => handleQuizOptionSelect(q.id, option)}
                                     className="h-4 w-4 text-brand-600 focus:ring-brand-500 border-gray-300"
                                   />
                                   <span className="ml-3 text-gray-700">{option}</span>
                                 </label>
                               ))}
                             </div>
                           </div>
                         ))}
                         <button 
                           onClick={handleSubmitQuiz}
                           disabled={Object.keys(quizAnswers).length < selectedQuiz.questions.length}
                           className="w-full bg-brand-600 text-white py-3 rounded-lg font-medium hover:bg-brand-700 disabled:opacity-50 disabled:cursor-not-allowed"
                         >
                           Submit Quiz
                         </button>
                       </div>
                     )}
                   </div>
                 )}

                 {/* Render Generated Quiz (Legacy/AI feature) */}
                 {generatedQuiz && !selectedQuiz && (
                    <div className="prose prose-indigo max-w-none bg-gray-50 p-6 rounded-xl border border-gray-100 mt-8">
                      <h3 className="text-lg font-semibold mb-4">AI Generated Quiz</h3>
                      <div dangerouslySetInnerHTML={{__html: generatedQuiz.replace(/\n/g, '<br/>')}} />
                    </div>
                 )}
               </div>
             )}

             {activeTab === 'assignments' && (
               <div className="space-y-6">
                 {!selectedAssignment ? (
                   <div className="grid gap-4">
                     <h3 className="text-lg font-semibold">Course Assignments</h3>
                     {assignments.map(assignment => (
                       <div key={assignment.id} className="border p-4 rounded-lg hover:bg-gray-50 cursor-pointer flex justify-between items-center" onClick={() => setSelectedAssignment(assignment)}>
                         <div>
                           <h4 className="font-medium">{assignment.title}</h4>
                           <p className="text-sm text-gray-500">Due: {new Date(assignment.dueDate).toLocaleDateString()}</p>
                         </div>
                         <button className="text-brand-600 font-medium text-sm">View & Submit &rarr;</button>
                       </div>
                     ))}
                     {assignments.length === 0 && <p className="text-gray-500">No assignments due.</p>}
                   </div>
                 ) : (
                   <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                     <button onClick={() => setSelectedAssignment(null)} className="text-sm text-gray-500 hover:text-gray-700 mb-4">&larr; Back to Assignments</button>
                     <h2 className="text-xl font-bold mb-2">{selectedAssignment.title}</h2>
                     <p className="text-gray-600 mb-4">{selectedAssignment.description}</p>
                     <div className="bg-yellow-50 text-yellow-800 px-4 py-2 rounded-lg text-sm inline-block mb-6">
                       Due: {new Date(selectedAssignment.dueDate).toLocaleDateString()}
                     </div>

                     <div className="space-y-4">
                       <label className="block font-medium text-gray-700">Your Submission</label>
                       <textarea 
                         className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-brand-500 focus:border-transparent h-32"
                         placeholder="Paste your answer, code snippet, or link to your work here..."
                         value={assignmentSubmission}
                         onChange={(e) => setAssignmentSubmission(e.target.value)}
                       ></textarea>

                       <div className="relative border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:bg-gray-50 transition-colors">
                         <input 
                           type="file" 
                           onChange={(e) => setSelectedFile(e.target.files ? e.target.files[0] : null)}
                           className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                           accept=".pdf,.ppt,.pptx,.doc,.docx,.zip,.png,.jpg"
                         />
                         <div className="space-y-2 pointer-events-none">
                           <svg className="mx-auto h-10 w-10 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                             <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                           </svg>
                           <div className="text-sm text-gray-600">
                             {selectedFile ? (
                               <span className="font-medium text-brand-600">{selectedFile.name}</span>
                             ) : (
                               <span>Click to upload a file (PDF, PPT, Images)</span>
                             )}
                           </div>
                         </div>
                       </div>

                       <button 
                         onClick={handleSubmitAssignment}
                         disabled={(!assignmentSubmission && !selectedFile) || isSubmittingAssignment}
                         className="bg-brand-600 text-white px-6 py-2 rounded-lg hover:bg-brand-700 disabled:opacity-50"
                       >
                         {isSubmittingAssignment ? 'Submitting...' : 'Submit Assignment'}
                       </button>
                     </div>
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
                   lesson.type === 'text' ? (
                     <svg className="w-4 h-4 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                     </svg>
                   ) : (
                     <svg className="w-4 h-4 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                     </svg>
                   )
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
