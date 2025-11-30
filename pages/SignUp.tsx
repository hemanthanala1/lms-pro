import React, { useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { UserRole } from '../types';

interface SignUpProps {
  onNavigate: (path: string) => void;
}

const SignUp: React.FC<SignUpProps> = ({ onNavigate }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [role, setRole] = useState<UserRole>('student');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // 1. Sign up with Supabase Auth
      // Metadata (full_name, role) will be handled by the SQL Trigger to create a Profile
      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
            role: role,
          },
        },
      });

      if (signUpError) throw signUpError;

      alert('Registration successful! Please check your email to verify your account.');
      onNavigate('signin');
    } catch (err: any) {
      console.error("Signup error", err);
      setError(err.message || "An error occurred during sign up");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-white">
      {/* Left Side - Image/Gradient */}
      <div className="hidden lg:flex lg:w-1/2 bg-indigo-900 relative overflow-hidden items-center justify-center">
         <div className="absolute inset-0 bg-gradient-to-br from-indigo-900 to-purple-900 z-10 opacity-90"></div>
         <img src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80" className="absolute inset-0 w-full h-full object-cover" alt="Students collaborating" />
         
         <div className="relative z-20 max-w-lg px-12 text-center">
            <div className="w-16 h-16 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center mx-auto mb-8 border border-white/20">
               <span className="text-3xl font-bold text-white">L</span>
            </div>
            <h2 className="text-4xl font-display font-bold text-white mb-6">Start your journey today.</h2>
            <p className="text-indigo-200 text-lg leading-relaxed">Create an account to unlock unlimited access to our library of expert-led courses and AI tools.</p>
         </div>

         {/* Decorative Circles */}
         <div className="absolute top-0 left-0 -ml-24 -mt-24 w-96 h-96 rounded-full bg-white/10 blur-3xl z-10"></div>
         <div className="absolute bottom-0 right-0 -mr-24 -mb-24 w-96 h-96 rounded-full bg-purple-500/20 blur-3xl z-10"></div>
      </div>

      {/* Right Side - Form */}
      <div className="flex-1 flex items-center justify-center p-4 sm:px-6 lg:px-8 bg-gray-50 lg:bg-white">
        <div className="max-w-md w-full space-y-8 bg-white p-8 lg:p-0 rounded-2xl shadow-xl lg:shadow-none border border-gray-100 lg:border-none">
          <div>
            <div className="lg:hidden mx-auto w-12 h-12 bg-indigo-500 rounded-lg flex items-center justify-center text-white font-bold text-xl mb-4">L</div>
            <h2 className="text-3xl font-extrabold text-slate-900 font-display">
              Create Account
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              Already have an account?{' '}
              <button onClick={() => onNavigate('signin')} className="font-medium text-brand-600 hover:text-brand-500 transition-colors">
                Sign in
              </button>
            </p>
          </div>
          
          {error && (
            <div className="bg-red-50 text-red-600 p-4 rounded-xl text-sm text-center border border-red-100 flex items-center justify-center gap-2">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              {error}
            </div>
          )}

          <form className="mt-8 space-y-5" onSubmit={handleSignUp}>
            {/* Role Selection */}
            <div>
               <label className="block text-sm font-medium text-gray-700 mb-2">I am a...</label>
               <div className="grid grid-cols-3 gap-3">
                  {['student', 'teacher', 'creator'].map((r) => (
                     <button
                       key={r}
                       type="button"
                       onClick={() => setRole(r as UserRole)}
                       className={`p-3 rounded-xl border text-sm font-bold capitalize transition-all ${
                         role === r 
                           ? 'bg-brand-50 border-brand-500 text-brand-700 ring-1 ring-brand-500 shadow-sm' 
                           : 'border-gray-200 text-gray-500 hover:border-gray-300 hover:bg-gray-50'
                       }`}
                     >
                       {r}
                     </button>
                  ))}
               </div>
            </div>

            <div>
              <label htmlFor="full-name" className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
              <input 
                id="full-name" 
                type="text" 
                required 
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="appearance-none block w-full px-4 py-3 border border-gray-300 rounded-xl placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all bg-gray-50 focus:bg-white" 
                placeholder="John Doe" 
              />
            </div>
            
            <div>
              <label htmlFor="email-address" className="block text-sm font-medium text-gray-700 mb-1">Email address</label>
              <input 
                id="email-address" 
                type="email" 
                required 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="appearance-none block w-full px-4 py-3 border border-gray-300 rounded-xl placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all bg-gray-50 focus:bg-white" 
                placeholder="you@example.com" 
              />
            </div>
            
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <input 
                id="password" 
                type="password" 
                required 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="appearance-none block w-full px-4 py-3 border border-gray-300 rounded-xl placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all bg-gray-50 focus:bg-white" 
                placeholder="Min 6 characters" 
              />
            </div>

            <div className="flex items-center">
              <input id="terms" type="checkbox" required className="h-4 w-4 text-brand-600 focus:ring-brand-500 border-gray-300 rounded" />
              <label htmlFor="terms" className="ml-2 block text-sm text-gray-900">
                I agree to the <a href="#" className="text-brand-600 hover:underline font-medium">Terms of Service</a> and <a href="#" className="text-brand-600 hover:underline font-medium">Privacy Policy</a>
              </label>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-3.5 px-4 border border-transparent text-sm font-bold rounded-xl text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all shadow-lg shadow-indigo-600/20 hover:shadow-indigo-600/30 disabled:opacity-50 disabled:cursor-not-allowed transform hover:-translate-y-0.5"
            >
              {loading ? (
                 <span className="flex items-center gap-2">
                    <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                    Creating Account...
                 </span>
              ) : `Sign Up as ${role.charAt(0).toUpperCase() + role.slice(1)}`}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
