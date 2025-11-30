import React, { useState, useRef, useEffect } from 'react';
import { generateStudentAnswer } from '../services/geminiService';
import { mockRetrieveContext } from '../constants';
import { ChatMessage, Course, Lesson } from '../types';

interface AIChatSidebarProps {
  course: Course;
  currentLesson: Lesson;
  isOpen: boolean;
  onClose: () => void;
  onAwardPoints: (points: number) => void;
}

const AIChatSidebar: React.FC<AIChatSidebarProps> = ({ course, currentLesson, isOpen, onClose, onAwardPoints }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'system',
      content: `Hi! I'm your LMS Pro Assistant. Ask me anything about "${currentLesson.title}".`,
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    // Gamification: Award small points for engagement
    onAwardPoints(10); 

    try {
      // 1. RAG Step: Retrieve context
      const context = mockRetrieveContext(userMsg.content as string, course.id);
      
      // 2. Generation Step: Call Gemini
      const response = await generateStudentAnswer(
        userMsg.content as string,
        context,
        course.title,
        currentLesson.title
      );

      const aiMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'ai',
        content: response, // This is an object of type AIResponse
        timestamp: new Date()
      };

      setMessages(prev => [...prev, aiMsg]);
    } catch (err) {
      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        role: 'system',
        content: "Sorry, I encountered an error. Please try again.",
        timestamp: new Date()
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-y-0 right-0 w-full sm:w-96 bg-white shadow-2xl z-50 flex flex-col transform transition-transform duration-300 ease-in-out border-l border-gray-100">
      {/* Header */}
      <div className="h-16 flex items-center justify-between px-6 border-b border-gray-100 bg-white">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
          <h3 className="font-display font-semibold text-slate-800">AI Tutor</h3>
        </div>
        <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50/50" ref={scrollRef}>
        {messages.map((msg) => {
          const isUser = msg.role === 'user';
          const isAI = msg.role === 'ai';
          
          return (
            <div key={msg.id} className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[90%] rounded-2xl p-4 shadow-sm ${
                isUser 
                  ? 'bg-brand-600 text-white rounded-br-none' 
                  : 'bg-white border border-gray-100 text-slate-700 rounded-bl-none'
              }`}>
                {/* Text Content */}
                {typeof msg.content === 'string' ? (
                  <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                ) : (
                  <div>
                    <p className="text-sm leading-relaxed mb-3">{msg.content.answer}</p>
                    
                    {/* Teacher's Insight Block */}
                    {msg.content.teacher_insight && (
                      <div className="mt-3 mb-3 p-3 bg-indigo-50 border border-indigo-100 rounded-lg text-xs relative overflow-hidden group">
                        <div className="absolute top-0 right-0 -mt-2 -mr-2 w-8 h-8 bg-indigo-200 rounded-full blur-xl opacity-50"></div>
                        <div className="flex items-center gap-2 mb-1.5 text-indigo-700 font-bold uppercase tracking-wider text-[10px]">
                           <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.384-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                           </svg>
                           Teacher's Perspective
                        </div>
                        <p className="text-slate-700 italic border-l-2 border-indigo-300 pl-2 leading-relaxed">
                          "{msg.content.teacher_insight}"
                        </p>
                      </div>
                    )}

                    {/* Sources / Citations */}
                    {msg.content.sources && msg.content.sources.length > 0 && (
                      <div className="mt-3 pt-3 border-t border-gray-100">
                        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Sources</p>
                        <ul className="space-y-1">
                          {msg.content.sources.map((src, idx) => (
                            <li key={idx} className="text-xs flex items-start gap-1.5 text-brand-600 bg-brand-50 p-1.5 rounded">
                               <svg className="w-3 h-3 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                               </svg>
                               <span>{src.lesson} <span className="opacity-50">@</span> {src.timestamp}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                    
                     {/* Confidence Badge */}
                    {msg.content.confidence_score && (
                       <div className="mt-2 flex justify-end">
                          <span className={`text-[10px] px-1.5 py-0.5 rounded border ${
                            msg.content.confidence_score > 0.8 ? 'border-green-200 text-green-600 bg-green-50' : 'border-yellow-200 text-yellow-600 bg-yellow-50'
                          }`}>
                            Confidence: {Math.round(msg.content.confidence_score * 100)}%
                          </span>
                       </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          );
        })}
        {isLoading && (
          <div className="flex justify-start">
             <div className="bg-white border border-gray-100 rounded-2xl rounded-bl-none p-4 shadow-sm flex gap-1 items-center">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-75"></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-150"></div>
             </div>
          </div>
        )}
      </div>

      {/* Input */}
      <div className="p-4 border-t border-gray-100 bg-white">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Ask a question..."
            className="flex-1 bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 transition-all"
          />
          <button 
            onClick={handleSend}
            disabled={!input.trim() || isLoading}
            className="bg-brand-600 text-white p-2.5 rounded-xl hover:bg-brand-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-lg shadow-brand-600/20"
          >
            <svg className="w-5 h-5 transform rotate-90" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
          </button>
        </div>
        <p className="text-center text-[10px] text-gray-400 mt-2">AI can make mistakes. Verify important info.</p>
      </div>
    </div>
  );
};

export default AIChatSidebar;