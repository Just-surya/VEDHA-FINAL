import React, { useState } from 'react';
import { useNavigate, useLocation, Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { Lock, User, Eye, EyeOff, AlertCircle, ArrowRight, ShieldCheck, Sparkles } from 'lucide-react';

export default function SignInPage() {
  const { isAuthenticated, login, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/dashboard';

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  const [errorMessage, setErrorMessage] = useState('');

  // If already authenticated, redirect to target
  if (isAuthenticated) {
    return <Navigate to={from} replace />;
  }

  const validate = () => {
    const errors = {};
    if (!username.trim()) {
      errors.username = 'Username is required';
    }
    if (!password) {
      errors.password = 'Password is required';
    } else if (password.length < 4) {
      errors.password = 'Password must be at least 4 characters';
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (!validate()) return;

    try {
      await login(username, password);
      navigate(from, { replace: true });
    } catch (err) {
      setErrorMessage(err.message || 'Authentication failed. Please check your credentials.');
    }
  };

  const handleFillDemo = () => {
    setUsername('admin');
    setPassword('admin123');
    setFormErrors({});
    setErrorMessage('');
  };

  return (
    <div className="min-h-screen w-full flex flex-col lg:flex-row bg-[#12111f]">
      {/* Left panel - Solid Purple Panel */}
      <div className="w-full lg:w-1/2 min-h-[380px] lg:min-h-screen bg-gradient-to-br from-[#665cf5] via-[#5b50ed] to-[#473ccc] p-8 md:p-14 flex flex-col justify-between relative overflow-hidden text-white select-none shadow-2xl">
        {/* Subtle decorative background circles */}
        <div className="absolute -top-24 -left-24 w-96 h-96 rounded-full bg-white/10 blur-2xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-96 h-96 rounded-full bg-indigo-900/30 blur-2xl pointer-events-none" />

        {/* Top badge */}
        <div className="relative z-10 flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-white/20 backdrop-blur-md flex items-center justify-center font-bold text-white shadow-inner">
            V
          </div>
          <span className="text-xs uppercase tracking-widest font-semibold text-white/80">
            School Staff Portal
          </span>
        </div>

        {/* Center branding */}
        <div className="relative z-10 max-w-lg my-auto py-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md border border-white/25 mb-4">
            <span className="font-devanagari text-amber-200 text-sm font-semibold tracking-wider">
              वेद
            </span>
            <span className="text-xs text-white/90 font-medium">Knowledge & Insight</span>
          </div>

          <h1 className="font-serif-logo text-5xl sm:text-6xl md:text-7xl font-bold tracking-tight text-white mb-6 leading-none">
            Vedha
          </h1>

          <p className="text-lg sm:text-xl text-white/90 leading-relaxed font-normal">
            Keep every student's record clear, current and in one place.
          </p>

          <div className="mt-8 flex items-center gap-6 pt-6 border-t border-white/20 text-xs text-white/80">
            <div>
              <span className="block text-xl font-bold text-white">Term 2</span>
              <span>Academic Year 2025–26</span>
            </div>
            <div className="h-8 w-px bg-white/20" />
            <div>
              <span className="block text-xl font-bold text-white">Classes 9 & 10</span>
              <span>Central High School</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="relative z-10 text-xs text-white/70">
          © {new Date().getFullYear()} Vedha Student Information System. Authorized staff access only.
        </div>
      </div>

      {/* Right panel - Dark sign-in form */}
      <div className="w-full lg:w-1/2 min-h-[500px] lg:min-h-screen flex items-center justify-center p-6 sm:p-10 lg:p-16 bg-[#12111f]">
        <div className="w-full max-w-md">
          {/* Header */}
          <div className="mb-8">
            <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              Sign in
            </h2>
            <p className="text-sm text-[#9490b8] mt-1.5">
              Use your staff account to continue.
            </p>
          </div>

          {/* Failure error alert with retry button */}
          {errorMessage && (
            <div className="mb-6 p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 flex items-start justify-between gap-3 animate-in fade-in">
              <div className="flex items-start gap-2.5">
                <AlertCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-semibold text-rose-300">Authentication Failed</p>
                  <p className="text-xs text-rose-200/80 mt-0.5">{errorMessage}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setErrorMessage('')}
                className="text-xs px-2.5 py-1 rounded bg-rose-500/20 hover:bg-rose-500/30 text-rose-200 transition-colors shrink-0"
              >
                Retry
              </button>
            </div>
          )}

          {/* Sign-in Form */}
          <form onSubmit={handleSubmit} className="space-y-5" noValidate>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2">
                Username
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#9490b8]">
                  <User className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  autoComplete="username"
                  value={username}
                  onChange={(e) => {
                    setUsername(e.target.value);
                    if (formErrors.username) setFormErrors({ ...formErrors, username: null });
                  }}
                  placeholder="Enter staff username"
                  className={`w-full pl-10 pr-4 py-3 bg-[#1c1b30] border ${
                    formErrors.username ? 'border-rose-500 ring-1 ring-rose-500/40' : 'border-[#282646] focus:border-[#8b85ff] focus:ring-1 focus:ring-[#8b85ff]'
                  } rounded-xl text-white placeholder-slate-500 text-sm outline-none transition-all`}
                />
              </div>
              {formErrors.username && (
                <p className="text-xs text-rose-400 mt-1.5 flex items-center gap-1">
                  <span>•</span> {formErrors.username}
                </p>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#9490b8]">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (formErrors.password) setFormErrors({ ...formErrors, password: null });
                  }}
                  placeholder="Enter your password"
                  className={`w-full pl-10 pr-11 py-3 bg-[#1c1b30] border ${
                    formErrors.password ? 'border-rose-500 ring-1 ring-rose-500/40' : 'border-[#282646] focus:border-[#8b85ff] focus:ring-1 focus:ring-[#8b85ff]'
                  } rounded-xl text-white placeholder-slate-500 text-sm outline-none transition-all`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-[#9490b8] hover:text-white transition-colors"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {formErrors.password && (
                <p className="text-xs text-rose-400 mt-1.5 flex items-center gap-1">
                  <span>•</span> {formErrors.password}
                </p>
              )}
            </div>

            {/* Purple Sign In Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 py-3.5 px-4 rounded-xl bg-[#8b85ff] hover:bg-[#7b75f5] text-white font-medium text-sm transition-all shadow-lg shadow-indigo-950/40 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed group active:scale-[0.99]"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Signing in...</span>
                </>
              ) : (
                <>
                  <span>Sign in</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                </>
              )}
            </button>
          </form>

          {/* Demo login hint box */}
          <div className="mt-8 p-4 rounded-xl bg-[#1c1b30] border border-[#282646] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-[#9490b8]">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-[#8b85ff]/15 flex items-center justify-center text-[#8b85ff] shrink-0">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <div>
                <span className="font-semibold text-slate-200">Demo Credentials:</span>
                <p className="font-mono text-slate-300">admin / admin123</p>
              </div>
            </div>
            <button
              type="button"
              onClick={handleFillDemo}
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[#8b85ff]/20 hover:bg-[#8b85ff]/30 text-[#8b85ff] font-medium transition-colors cursor-pointer text-xs self-stretch sm:self-auto justify-center"
            >
              <Sparkles className="w-3.5 h-3.5" />
              Auto-fill
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
