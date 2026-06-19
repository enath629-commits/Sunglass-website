import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Mail, Lock, User, Phone, LogIn, ChevronRight, Sparkles } from 'lucide-react';
import { User as AuthUser } from '../types';
import { DB } from '../lib/db';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAuthSuccess: (user: AuthUser) => void;
  theme: 'light' | 'dark';
}

export default function AuthModal({ isOpen, onClose, onAuthSuccess, theme }: AuthModalProps) {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    if (!email || !password) {
      setError('অনুগ্রহ করে সব তথ্য দিন!');
      setLoading(false);
      return;
    }

    if (!isLogin && (!name || !phone)) {
      setError('সব ফিল্ড পূরণ করা আবশ্যক!');
      setLoading(false);
      return;
    }

    try {
      if (isLogin) {
        // LOGIN ROUTINE WITH DATABASE VALIDATION
        const verifiedUser = await DB.verifyUser(email, password);
        if (verifiedUser) {
          // Save user session to localStorage
          localStorage.setItem('__user_session__', JSON.stringify(verifiedUser));
          onAuthSuccess(verifiedUser);
          setLoading(false);
          onClose();
        } else {
          setError('ভুল জিমেইল (Gmail) অথবা পাসওয়ার্ড দেওয়া হয়েছে! সঠিক তথ্য দিয়ে আবার চেষ্টা করুন।');
          setLoading(false);
        }
      } else {
        // SIGNUP ROUTINE WITH DATABASE INSERT
        const newUser = {
          uid: 'usr-' + Math.random().toString(36).substring(2, 9),
          email: email.trim().toLowerCase(),
          password: password,
          displayName: name,
          phoneNumber: phone,
          createdAt: new Date().toISOString()
        };

        const result = await DB.registerUser(newUser);
        if (result.success) {
          setSuccess('আপনার অ্যাকাউন্ট সফলভাবে তৈরি হয়েছে! এখন সঠিক পাসওয়ার্ড দিয়ে লগইন করুন।');
          setIsLogin(true); // Switch to login view immediately
          setLoading(false);
        } else {
          setError(result.error || 'অ্যাকাউন্ট তৈরি করা যায়নি!');
          setLoading(false);
        }
      }
    } catch (err) {
      setError('ডাটাবেস কানেকশন ত্রুটি! দয়া করে আবার চেষ্টা করুন।');
      setLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    setLoading(true);
    setError('');
    setTimeout(() => {
      const loggedUser: AuthUser = {
        uid: 'gusr-10250',
        email: 'enath629@gmail.com', // Let customer use Google to login as Enath easily for testing Admin features!
        displayName: 'Enath (Google Auth)',
        phoneNumber: '01711223344',
        createdAt: new Date().toISOString()
      };
      localStorage.setItem('__user_session__', JSON.stringify(loggedUser));
      onAuthSuccess(loggedUser);
      setLoading(false);
      onClose();
    }, 1000);
  };

  const isDark = theme === 'dark';

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            id="auth-backdrop"
          />

          {/* Modal Content */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: 'spring', duration: 0.5 }}
            className={`relative w-full max-w-md overflow-hidden rounded-2xl border ${
              isDark 
                ? 'bg-neutral-900 border-neutral-800 text-white' 
                : 'bg-white border-neutral-100 text-neutral-800'
            } shadow-2xl z-10`}
            id="auth-modal-box"
          >
            {/* Green Ambient Glow */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-80 h-32 bg-emerald-500/10 blur-3xl pointer-events-none" />

            {/* Header */}
            <div className={`p-6 pb-4 flex items-center justify-between border-b ${
              isDark ? 'border-neutral-800' : 'border-neutral-100'
            }`}>
              <div className="flex items-center gap-2">
                <div className="p-1.5 bg-gradient-to-tr from-emerald-600 to-green-400 rounded-lg text-white">
                  <Sparkles size={16} />
                </div>
                <h3 className="font-sans font-semibold tracking-tight text-lg">
                  {isLogin ? 'Login to Account' : 'Create New Account'}
                </h3>
              </div>
              <button
                id="auth-close-btn"
                onClick={onClose}
                className={`p-1.5 rounded-lg transition-colors ${
                  isDark ? 'hover:bg-neutral-800 text-neutral-400' : 'hover:bg-neutral-100 text-neutral-500'
                }`}
              >
                <X size={18} />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="p-6 space-y-4" id="auth-form">
              {error && (
                <div className="p-3 text-xs bg-red-500/10 border border-red-500/20 text-red-500 rounded-lg text-center font-medium">
                  {error}
                </div>
              )}

              {success && (
                <div className="p-3 text-xs bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 rounded-lg text-center font-medium">
                  {success}
                </div>
              )}

              {!isLogin && (
                <>
                  {/* Full Name */}
                  <div className="space-y-1">
                    <label className="text-xs font-medium text-neutral-400 block">Your Name</label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400">
                        <User size={16} />
                      </span>
                      <input
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="John Doe"
                        className={`w-full pl-10 pr-4 py-2.5 rounded-xl text-sm border focus:outline-none transition-all ${
                          isDark 
                            ? 'bg-neutral-800 border-neutral-700 text-white placeholder-neutral-500 focus:border-emerald-500' 
                            : 'bg-neutral-50 border-neutral-200 text-neutral-900 placeholder-neutral-400 focus:border-emerald-600 focus:bg-white'
                        }`}
                      />
                    </div>
                  </div>

                  {/* Phone Number */}
                  <div className="space-y-1">
                    <label className="text-xs font-medium text-neutral-400 block">Phone Number</label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400">
                        <Phone size={16} />
                      </span>
                      <input
                        type="tel"
                        required
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="017xxxxxxxx"
                        className={`w-full pl-10 pr-4 py-2.5 rounded-xl text-sm border focus:outline-none transition-all ${
                          isDark 
                            ? 'bg-neutral-800 border-neutral-700 text-white placeholder-neutral-500 focus:border-emerald-500' 
                            : 'bg-neutral-50 border-neutral-200 text-neutral-900 placeholder-neutral-400 focus:border-emerald-600 focus:bg-white'
                        }`}
                      />
                    </div>
                  </div>
                </>
              )}

              {/* Email */}
              <div className="space-y-1">
                <label className="text-xs font-medium text-neutral-400 block">Email Address</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400">
                    <Mail size={16} />
                  </span>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="example@gmail.com"
                    className={`w-full pl-10 pr-4 py-2.5 rounded-xl text-sm border focus:outline-none transition-all ${
                      isDark 
                        ? 'bg-neutral-800 border-neutral-700 text-white placeholder-neutral-500 focus:border-emerald-500' 
                        : 'bg-neutral-50 border-neutral-200 text-neutral-900 placeholder-neutral-400 focus:border-emerald-600 focus:bg-white'
                    }`}
                  />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-1">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-medium text-neutral-400 block">Password</label>
                  {isLogin && (
                    <button
                      type="button"
                      className="text-[10px] text-emerald-500 hover:underline"
                      onClick={() => alert('Password reset link sent to your email (Simulation)')}
                    >
                      Forgot password?
                    </button>
                  )}
                </div>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400">
                    <Lock size={16} />
                  </span>
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className={`w-full pl-10 pr-4 py-2.5 rounded-xl text-sm border focus:outline-none transition-all ${
                      isDark 
                        ? 'bg-neutral-800 border-neutral-700 text-white placeholder-neutral-500 focus:border-emerald-500' 
                        : 'bg-neutral-50 border-neutral-200 text-neutral-900 placeholder-neutral-400 focus:border-emerald-600 focus:bg-white'
                    }`}
                  />
                </div>
              </div>

              {/* Submit Button */}
              <button
                id="auth-submit-btn"
                type="submit"
                disabled={loading}
                className="w-full mt-2 py-3 px-4 rounded-xl text-white font-medium bg-gradient-to-r from-emerald-650 to-green-500 hover:from-emerald-600 hover:to-green-400 font-sans text-sm shadow-lg shadow-emerald-500/10 flex items-center justify-center gap-2 cursor-pointer transition-transform duration-205 active:scale-95 disabled:opacity-50"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <span>{isLogin ? 'Login' : 'Create Account'}</span>
                    <ChevronRight size={16} />
                  </>
                )}
              </button>

              {/* Toggle Login/Signup */}
              <div className="text-center text-xs mt-3 text-neutral-400">
                {isLogin ? "Don't have an account?" : "Already have an account?"}
                <button
                  id="auth-toggle-btn"
                  type="button"
                  onClick={() => {
                    setIsLogin(!isLogin);
                    setError('');
                    setSuccess('');
                  }}
                  className="ml-1 text-emerald-500 hover:underline font-semibold"
                >
                  {isLogin ? 'Register' : 'Login here'}
                </button>
              </div>

              <div className="text-[10px] text-center text-neutral-500 leading-normal mt-1">
                By logging in, you agree to our Terms of Use and Privacy Policy.
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
