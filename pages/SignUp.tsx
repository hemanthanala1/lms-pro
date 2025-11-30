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
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-2xl shadow-xl border border-gray-100">
        <div>
          <div className="mx-auto w-12 h-12 bg-indigo-500 rounded-lg flex items-center justify-center text-white font-bold text-xl">L</div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-slate-900 font-display">
            Create Account
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Already have an account?{' '}
            <button onClick={() => onNavigate('signin')} className="font-medium text-brand-600 hover:text-brand-500">
              Sign in
            </button>
          </p>
        </div>
        
        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm text-center">
            {error}
          </div>
        )}

        <form className="mt-8 space-y-4" onSubmit={handleSignUp}>
          {/* Role Selection */}
          <div className="grid grid-cols-3 gap-2 mb-4">
             {['student', 'teacher', 'creator'].map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => setRole(r as UserRole)}
                  className={`p-2 rounded-lg border text-xs font-bold uppercase tracking-wider transition-all ${
                    role === r 
                      ? 'bg-brand-50 border-brand-500 text-brand-700 ring-1 ring-brand-500' 
                      : 'border-gray-200 text-gray-500 hover:border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  {r}
                </button>
             ))}
          </div>

          <div>
            <label htmlFor="full-name" className="sr-only">Full Name</label>
            <input 
              id="full-name" 
              type="text" 
              required 
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="appearance-none rounded-md relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 bg-white focus:outline-none focus:ring-brand-500 focus:border-brand-500 sm:text-sm" 
              placeholder="Full Name" 
            />
          </div>
          
          <div>
            <label htmlFor="email-address" className="sr-only">Email address</label>
            <input 
              id="email-address" 
              type="email" 
              required 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="appearance-none rounded-md relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 bg-white focus:outline-none focus:ring-brand-500 focus:border-brand-500 sm:text-sm" 
              placeholder="Email address" 
            />
          </div>
          
          <div>
            <label htmlFor="password" className="sr-only">Password</label>
            <input 
              id="password" 
              type="password" 
              required 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="appearance-none rounded-md relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 bg-white focus:outline-none focus:ring-brand-500 focus:border-brand-500 sm:text-sm" 
              placeholder="Password (min 6 chars)" 
            />
          </div>

          <div className="flex items-center">
            <input id="terms" type="checkbox" required className="h-4 w-4 text-brand-600 focus:ring-brand-500 border-gray-300 rounded" />
            <label htmlFor="terms" className="ml-2 block text-sm text-gray-900">
              I agree to the <a href="#" className="text-brand-600 hover:underline">Terms of Service</a> and <a href="#" className="text-brand-600 hover:underline">Privacy Policy</a>
            </label>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors disabled:opacity-50"
          >
            {loading ? 'Creating Account...' : `Sign Up as ${role.charAt(0).toUpperCase() + role.slice(1)}`}
          </button>
        </form>
      </div>
    </div>
  );
};

export default SignUp;