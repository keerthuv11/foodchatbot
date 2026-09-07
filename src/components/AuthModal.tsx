import React, { useState } from 'react';
import { X, Sparkles, Phone, Mail, Lock, Shield, CheckCircle, ChefHat, User } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const AuthModal: React.FC = () => {
  const {
    isAuthModalOpen,
    setIsAuthModalOpen,
    authMode,
    setAuthMode,
    loginUser,
    user
  } = useApp();

  const [method, setMethod] = useState<'phone' | 'email'>('phone');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [selectedRole, setSelectedRole] = useState<'USER' | 'VENDOR' | 'ADMIN'>('USER');

  if (!isAuthModalOpen) return null;

  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (phoneNumber.length < 10) {
      alert('Please enter a valid 10-digit Indian mobile number');
      return;
    }
    setIsOtpSent(true);
  };

  const handleVerifyAndLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const identifier = method === 'phone' ? `+91 ${phoneNumber}` : email || 'user@budgetbite.ai';
    loginUser(identifier, selectedRole);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
      <div
        className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border border-stone-200 p-6 overflow-hidden animate-in zoom-in-95"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={() => setIsAuthModalOpen(false)}
          className="absolute top-4 right-4 p-2 text-stone-400 hover:text-stone-700 rounded-full hover:bg-stone-100 transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="text-center mb-6">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-600 flex items-center justify-center text-white mx-auto mb-3 shadow-md">
            <Sparkles className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-black text-stone-900">
            {authMode === 'login'
              ? 'Welcome to BudgetBite AI'
              : authMode === 'register'
              ? 'Create your Account'
              : 'Reset Password'}
          </h3>
          <p className="text-xs text-stone-500 mt-1">
            Sign in to personalize meal recommendations & track orders
          </p>
        </div>

        {/* Role selector for quick persona testing */}
        <div className="mb-5 p-2 bg-stone-100 rounded-2xl">
          <p className="text-[10px] font-black uppercase text-stone-500 text-center mb-1.5 tracking-wider">
            Select Testing Persona / Role
          </p>
          <div className="grid grid-cols-3 gap-1.5">
            <button
              type="button"
              onClick={() => setSelectedRole('USER')}
              className={`py-1.5 px-2 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1 ${
                selectedRole === 'USER'
                  ? 'bg-white text-emerald-800 shadow-xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              <User className="w-3.5 h-3.5" />
              Customer
            </button>
            <button
              type="button"
              onClick={() => setSelectedRole('VENDOR')}
              className={`py-1.5 px-2 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1 ${
                selectedRole === 'VENDOR'
                  ? 'bg-white text-amber-800 shadow-xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              <ChefHat className="w-3.5 h-3.5" />
              Vendor
            </button>
            <button
              type="button"
              onClick={() => setSelectedRole('ADMIN')}
              className={`py-1.5 px-2 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1 ${
                selectedRole === 'ADMIN'
                  ? 'bg-white text-indigo-800 shadow-xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              <Shield className="w-3.5 h-3.5" />
              Admin
            </button>
          </div>
        </div>

        {/* Method Toggle: Phone vs Email */}
        <div className="flex border-b border-stone-200 mb-5">
          <button
            onClick={() => {
              setMethod('phone');
              setIsOtpSent(false);
            }}
            className={`flex-1 py-2 text-xs font-bold border-b-2 text-center transition ${
              method === 'phone'
                ? 'border-emerald-600 text-emerald-700'
                : 'border-transparent text-stone-500 hover:text-stone-800'
            }`}
          >
            Indian Mobile (+91)
          </button>
          <button
            onClick={() => {
              setMethod('email');
              setIsOtpSent(false);
            }}
            className={`flex-1 py-2 text-xs font-bold border-b-2 text-center transition ${
              method === 'email'
                ? 'border-emerald-600 text-emerald-700'
                : 'border-transparent text-stone-500 hover:text-stone-800'
            }`}
          >
            Email Address
          </button>
        </div>

        {/* Forms */}
        {method === 'phone' ? (
          <form onSubmit={isOtpSent ? handleVerifyAndLogin : handleSendOtp} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">
                Mobile Number
              </label>
              <div className="flex rounded-xl border border-stone-300 overflow-hidden focus-within:border-emerald-500">
                <span className="px-3 py-2.5 bg-stone-100 text-stone-600 text-xs font-bold flex items-center border-r border-stone-300">
                  +91
                </span>
                <input
                  type="tel"
                  placeholder="98765 43210"
                  maxLength={10}
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, ''))}
                  disabled={isOtpSent}
                  className="flex-1 px-3 py-2.5 text-xs sm:text-sm text-stone-900 focus:outline-hidden"
                  required
                />
              </div>
            </div>

            {isOtpSent && (
              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="text-xs font-bold text-stone-700">
                    Enter OTP (Use 1234)
                  </label>
                  <button
                    type="button"
                    onClick={() => setIsOtpSent(false)}
                    className="text-[11px] text-emerald-700 font-bold hover:underline"
                  >
                    Change Number
                  </button>
                </div>
                <input
                  type="text"
                  placeholder="4-digit OTP"
                  maxLength={4}
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-stone-300 focus:outline-hidden focus:border-emerald-500 text-center tracking-widest text-base font-bold"
                  required
                />
              </div>
            )}

            <button
              type="submit"
              className="w-full py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm shadow-md transition"
            >
              {isOtpSent ? 'Verify OTP & Continue' : 'Send One-Time Password'}
            </button>
          </form>
        ) : (
          <form onSubmit={handleVerifyAndLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
                <input
                  type="email"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-stone-300 focus:outline-hidden focus:border-emerald-500 text-xs sm:text-sm text-stone-900"
                  required
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="text-xs font-bold text-stone-700">Password</label>
                {authMode === 'login' && (
                  <button
                    type="button"
                    onClick={() => setAuthMode('forgot')}
                    className="text-[11px] text-emerald-700 font-bold hover:underline"
                  >
                    Forgot?
                  </button>
                )}
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
                <input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-stone-300 focus:outline-hidden focus:border-emerald-500 text-xs sm:text-sm text-stone-900"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm shadow-md transition"
            >
              {authMode === 'login' ? 'Sign In' : 'Create Account'}
            </button>
          </form>
        )}

        {/* Switch Auth mode footer */}
        <div className="mt-6 pt-4 border-t border-stone-100 text-center text-xs text-stone-500">
          {authMode === 'login' ? (
            <p>
              Don&apos;t have an account?{' '}
              <button
                onClick={() => setAuthMode('register')}
                className="text-emerald-700 font-bold hover:underline"
              >
                Register here
              </button>
            </p>
          ) : (
            <p>
              Already have an account?{' '}
              <button
                onClick={() => setAuthMode('login')}
                className="text-emerald-700 font-bold hover:underline"
              >
                Sign In
              </button>
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
