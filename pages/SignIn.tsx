import React, { useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { UserRole } from '../types';

interface SignInProps {
  onSignIn: (role: UserRole) => void;
  onNavigate: (path: string) => void;
}

const SignIn: React.FC<SignInProps> = ({ onSignIn, onNavigate }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedRole, setSelectedRole] = useState<string>('student');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;
      
      // Explicitly navigate to dashboard on success
      onNavigate('dashboard');
      
    } catch (err: any) {
      console.error("Signin error", err);
      setError(err.message || "Invalid login credentials");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-2xl shadow-xl border border-gray-100">
        <div>
          <div className="mx-auto w-12 h-12 bg-brand-500 rounded-lg flex items-center justify-center text-white font-bold text-xl">L</div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-slate-900 font-display">
            Welcome back
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Or{' '}
            <button onClick={() => onNavigate('signup')} className="font-medium text-brand-600 hover:text-brand-500">
              create a new account
            </button>
          </p>
        </div>

        {/* Visual Role Tabs */}
        <div className="flex justify-center border-b border-gray-200">
           {['student', 'teacher', 'creator', 'admin'].map((role) => (
              <button
                 key={role}
                 onClick={() => setSelectedRole(role)}
                 className={`px-4 py-2 text-sm font-medium capitalize border-b-2 transition-colors ${
                    selectedRole === role 
                    ? 'border-brand-500 text-brand-600' 
                    : 'border-transparent text-gray-400 hover:text-gray-600'
                 }`}
              >
                 {role}
              </button>
           ))}
        </div>
        
        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm text-center">
            {error}
          </div>
        )}

        <form className="mt-6 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="email-address" className="sr-only">Email address</label>
              <input
                id="email-address"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="appearance-none rounded-none relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 bg-white rounded-t-md focus:outline-none focus:ring-brand-500 focus:border-brand-500 focus:z-10 sm:text-sm"
                placeholder="Email address"
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">Password</label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="appearance-none rounded-none relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 bg-white rounded-b-md focus:outline-none focus:ring-brand-500 focus:border-brand-500 focus:z-10 sm:text-sm"
                placeholder="Password"
              />
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                className="h-4 w-4 text-brand-600 focus:ring-brand-500 border-gray-300 rounded"
              />
              <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
                Remember me
              </label>
            </div>

            <div className="text-sm">
              <a href="#" className="font-medium text-brand-600 hover:text-brand-500">
                Forgot password?
              </a>
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-slate-900 hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-900 transition-colors disabled:opacity-50"
            >
              {loading ? 'Signing In...' : `Sign In as ${selectedRole.charAt(0).toUpperCase() + selectedRole.slice(1)}`}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SignIn;