
"use client";
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

const MailIcon = ({ className }) => ( <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><rect width="20" height="16" x="2" y="4" rx="2" /><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" /></svg> );
const LockIcon = ({ className }) => ( <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><rect width="18" height="11" x="3" y="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></svg> );

export default function LoginSignupForm() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const toggleForm = () => {
    setIsLogin(!isLogin);
    setError('');
    setEmail('');
    setPassword('');
    setConfirmPassword('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    if (!isLogin && password !== confirmPassword) {
      setError("Passwords do not match.");
      setIsLoading(false);
      return;
    }
     if (password.length < 6) {
        setError("Password must be at least 6 characters long.");
        setIsLoading(false);
        return;
      }

    const endpoint = isLogin ? '/api/auth/login' : '/api/auth/signup';
    const payload = { email, password };

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Something went wrong');
      }
      
      localStorage.setItem('authToken', data.token);
      router.push('/dashboard');

    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 flex items-center justify-center font-sans p-4">
      <div className="w-full max-w-md">
        <div className="bg-white/95 dark:bg-gray-800/90 backdrop-blur-sm rounded-2xl shadow-2xl p-6 sm:p-8">
          <h2 className="text-3xl sm:text-4xl font-bold text-center text-gray-800 dark:text-white mb-2">
            {isLogin ? 'Welcome Back!' : 'Create Account'}
          </h2>
          <p className="text-center text-gray-500 dark:text-gray-400 mb-8">
            {isLogin ? 'Sign in to continue' : 'Get started with a free account'}
          </p>
          <form onSubmit={handleSubmit}>
            <div className="space-y-6">
              <div className="relative">
                <div className="absolute top-1/2 left-3 -translate-y-1/2 text-gray-400"><MailIcon className="w-5 h-5" /></div>
                <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required className="w-full pl-10 pr-4 py-3 bg-gray-100 dark:bg-gray-700 border-2 border-transparent rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-800 dark:text-gray-200 transition-all duration-300" />
              </div>
              <div className="relative">
                 <div className="absolute top-1/2 left-3 -translate-y-1/2 text-gray-400"><LockIcon className="w-5 h-5" /></div>
                <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required className="w-full pl-10 pr-4 py-3 bg-gray-100 dark:bg-gray-700 border-2 border-transparent rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-800 dark:text-gray-200 transition-all duration-300" />
              </div>
              {!isLogin && (
                <div className="relative">
                   <div className="absolute top-1/2 left-3 -translate-y-1/2 text-gray-400"><LockIcon className="w-5 h-5" /></div>
                  <input type="password" placeholder="Confirm Password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required className="w-full pl-10 pr-4 py-3 bg-gray-100 dark:bg-gray-700 border-2 border-transparent rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-800 dark:text-gray-200 transition-all duration-300" />
                </div>
              )}
            </div>
            {error && <p className="text-red-500 text-sm text-center mt-4 animate-pulse">{error}</p>}
            <button type="submit" disabled={isLoading} className="w-full mt-8 py-3 font-semibold text-white bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg shadow-lg hover:from-indigo-700 hover:to-purple-700 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transform hover:-translate-y-1 transition-all duration-300 disabled:from-indigo-400 disabled:to-purple-400 disabled:cursor-not-allowed disabled:transform-none">
              {isLoading ? 'Processing...' : (isLogin ? 'Login' : 'Sign Up')}
            </button>
          </form>
          <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-8">
            {isLogin ? "Don't have an account?" : 'Already have an account?'}
            <button onClick={toggleForm} className="font-semibold text-indigo-500 hover:text-indigo-400 ml-1 focus:outline-none transition-colors duration-300">
              {isLogin ? 'Sign Up' : 'Login'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
