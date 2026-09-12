import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import PassPassLogo from './PassPassLogo';
import {
  User,
  Mail,
  Lock,
  Phone,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  Eye,
  EyeOff,
  ShieldCheck,
  Film,
  KeyRound,
} from 'lucide-react';

function Auth() {
  const location = useLocation();
  const navigate = useNavigate();
  const { loginUser, registerUser } = useAuth();

  // Determine initial mode based on route (/signup vs /login)
  const isInitialSignup = location.pathname === '/signup';
  const [isLogin, setIsLogin] = useState(!isInitialSignup);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });

  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isDuplicate, setIsDuplicate] = useState(false);
  const [registeredSuccess, setRegisteredSuccess] = useState(null);
  const [loginSuccessUser, setLoginSuccessUser] = useState(null);
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Sync mode if user navigates via browser or links
  useEffect(() => {
    if (location.pathname === '/signup') {
      setIsLogin(false);
    } else if (location.pathname === '/login') {
      setIsLogin(true);
    }
    setError('');
    setIsDuplicate(false);
  }, [location.pathname]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError('');
    setIsDuplicate(false);
  };

  const switchMode = (loginMode) => {
    setIsLogin(loginMode);
    setError('');
    setIsDuplicate(false);
    setRegisteredSuccess(null);
  };

  // Password strength calculation for sign up
  const getPasswordStrength = (pwd) => {
    if (!pwd) return { score: 0, text: '', color: 'bg-transparent' };
    let score = 0;
    if (pwd.length >= 6) score += 1;
    if (pwd.length >= 9) score += 1;
    if (/[0-9]/.test(pwd)) score += 1;
    if (/[^A-Za-z0-9]/.test(pwd) || /[A-Z]/.test(pwd)) score += 1;

    if (score <= 1) return { score: 1, text: 'Weak', color: 'bg-rose-500' };
    if (score === 2 || score === 3) return { score: 2, text: 'Medium', color: 'bg-amber-400' };
    return { score: 3, text: 'Strong', color: 'bg-emerald-400' };
  };

  const pwdStrength = getPasswordStrength(formData.password);
  const passwordsMatch = formData.password && formData.confirmPassword && formData.password === formData.confirmPassword;
  const passwordsMismatch = formData.password && formData.confirmPassword && formData.password !== formData.confirmPassword;

  // Handle Form Submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsDuplicate(false);

    // Common Email validation
    const emailTrimmed = formData.email.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(emailTrimmed)) {
      setError('Please enter a valid email address (e.g. name@domain.com).');
      return;
    }

    if (!isLogin) {
      // --- CREATE ACCOUNT VALIDATION ---
      if (!formData.name.trim()) {
        setError('Please enter your full name.');
        return;
      }

      if (formData.password.length < 6) {
        setError('Password must be at least 6 characters.');
        return;
      }

      if (formData.password !== formData.confirmPassword) {
        setError('Passwords do not match. Please re-enter your password.');
        return;
      }

      setLoading(true);

      const result = await registerUser({
        name: formData.name,
        email: emailTrimmed,
        phone: formData.phone,
        password: formData.password,
      });

      setLoading(false);

      if (result.success) {
        // Genuine authentication behavior: Do NOT immediately jump to home page.
        // Show Google-style confirmation view with clear prompt to sign in!
        setRegisteredSuccess({
          name: formData.name,
          email: emailTrimmed,
        });
        // Retain email for smooth Sign In transition
        setFormData((prev) => ({
          ...prev,
          name: '',
          password: '',
          confirmPassword: '',
          phone: '',
        }));
      } else {
        setError(result.message);
        if (result.duplicate) {
          setIsDuplicate(true);
        }
      }
    } else {
      // --- SIGN IN FLOW ---
      if (!formData.password) {
        setError('Please enter your password.');
        return;
      }

      setLoading(true);

      const result = await loginUser(emailTrimmed, formData.password);
      setLoading(false);

      if (result.success && result.data) {
        setLoginSuccessUser(result.data);
        setIsTransitioning(true);

        // Smooth transition effect between Auth and Homepage
        setTimeout(() => {
          navigate('/');
        }, 900);
      } else {
        setError(result.message || 'Authentication failed. Please check your credentials.');
      }
    }
  };

  return (
    <div className={`min-h-screen bg-[#0C0A09] text-[#fdfbf7] flex flex-col justify-center items-center p-4 relative overflow-hidden transition-all duration-700 cinema-backdrop-glow ${isTransitioning ? 'auth-card-exit-animate' : 'page-transition'}`}>
      {/* Ambient Cinema Lighting in GoBus Orange */}
      <div className="absolute -top-40 -left-40 w-[32rem] h-[32rem] rounded-full bg-[#FF6B00]/20 blur-[140px] pointer-events-none animate-pulse"></div>
      <div className="absolute -bottom-40 -right-40 w-[32rem] h-[32rem] rounded-full bg-[#FF8533]/15 blur-[140px] pointer-events-none animate-pulse" style={{ animationDelay: '1.8s' }}></div>

      {/* Top Navigation Back Link */}
      <div className="absolute top-6 left-6 sm:left-12 z-20">
        <Link
          to="/"
          className="flex items-center gap-2 px-4 py-2 rounded-full bg-[#181512]/90 hover:bg-[#FF6B00]/40 border border-[#FF6B00]/30 text-xs font-medium text-[#fdfbf7] backdrop-blur-md transition-all duration-300 hover:scale-105 shadow-md"
        >
          <ArrowLeft className="w-3.5 h-3.5 text-[#FF8533]" />
          <span>Back to Films</span>
        </Link>
      </div>

      {/* Main Google-Style Cinema Authentication Card */}
      <div className="w-full max-w-md pass-panel rounded-3xl p-7 sm:p-9 relative z-10 shadow-2xl border border-[#FF6B00]/30 backdrop-blur-2xl auth-card-animate">
        
        {/* Cinema Brand & Google-style Heading */}
        <div className="text-center mb-6">
          <div className="inline-block transform hover:scale-105 transition-transform duration-300">
            <PassPassLogo className="h-11" />
          </div>
          <h2 className="text-lg sm:text-xl font-bold text-white mt-3 tracking-tight">
            {registeredSuccess
              ? 'Account Created'
              : isLogin
              ? 'Sign In to Pass Pass'
              : 'Create your Cinema Account'}
          </h2>
          <p className="text-xs text-[#FFA066] mt-1 font-medium">
            {registeredSuccess
              ? 'Ready to sign in and book movie seats'
              : isLogin
              ? 'to continue to Pass Pass Movies & Reservations'
              : 'One genuine account for reservations, passes & rewards'}
          </p>
        </div>

        {/* Tab Switcher (Sign In vs Create Account) */}
        {!registeredSuccess && !loginSuccessUser && (
          <div className="relative flex items-center p-1 rounded-2xl bg-[#0C0A09]/70 border border-[#FF6B00]/30 mb-6">
            <div
              className={`absolute top-1 bottom-1 w-1/2 rounded-xl btn-pass-primary transition-all duration-300 ease-out shadow-md`}
              style={{
                transform: isLogin ? 'translateX(0%)' : 'translateX(100%)',
              }}
            />

            <button
              type="button"
              onClick={() => switchMode(true)}
              className={`flex-1 py-2 text-xs font-bold text-center z-10 transition-colors duration-200 ${
                isLogin ? 'text-white' : 'text-[#FFA066] hover:text-white'
              }`}
            >
              Sign In
            </button>

            <button
              type="button"
              onClick={() => switchMode(false)}
              className={`flex-1 py-2 text-xs font-bold text-center z-10 transition-colors duration-200 ${
                !isLogin ? 'text-white' : 'text-[#FFA066] hover:text-white'
              }`}
            >
              Create Account
            </button>
          </div>
        )}

        {/* Alert Error Box */}
        {error && (
          <div className="p-3.5 mb-5 rounded-2xl bg-[#EA580C]/25 border border-rose-500/50 text-[#fdfbf7] text-xs flex flex-col gap-2 animate-shake shadow-lg">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0 text-rose-300" />
              <span className="font-semibold">{error}</span>
            </div>
            {isDuplicate && (
              <button
                type="button"
                onClick={() => {
                  switchMode(true);
                  setError('');
                }}
                className="mt-1 self-start px-3 py-1 rounded-lg bg-[#FF6B00]/25 hover:bg-[#FF6B00]/40 text-[11px] font-bold text-[#FFD4B8] transition border border-[#FF6B00]/40"
              >
                Sign In with this email →
              </button>
            )}
          </div>
        )}

        {/* LOGIN SUCCESS TRANSITION STATE */}
        {loginSuccessUser && (
          <div className="text-center py-6 space-y-4">
            <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-[#FF6B00] to-[#FF8533] text-white flex items-center justify-center mx-auto shadow-2xl auth-success-badge">
              <CheckCircle2 className="w-9 h-9" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Welcome back, {loginSuccessUser.name}!</h3>
              <p className="text-xs text-[#FFA066] mt-1">Authentication confirmed. Entering cinema lobby...</p>
            </div>
            <div className="w-48 h-1.5 bg-[#181512] rounded-full mx-auto overflow-hidden">
              <div className="w-full h-full bg-gradient-to-r from-[#FF6B00] to-[#FF8533] animate-pulse"></div>
            </div>
          </div>
        )}

        {/* REGISTERED SUCCESS STATE (Google-style confirmation before signing in) */}
        {registeredSuccess && (
          <div className="text-center py-4 space-y-5">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center mx-auto shadow-xl auth-success-badge">
              <ShieldCheck className="w-9 h-9" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white mb-1">
                Account Created Successfully!
              </h3>
              <p className="text-xs text-stone-300 leading-relaxed">
                Welcome, <span className="text-white font-semibold">{registeredSuccess.name}</span>. Your account for{' '}
                <span className="text-[#FF8533] font-mono font-semibold">{registeredSuccess.email}</span> is now active.
              </p>
            </div>

            <div className="p-3.5 rounded-2xl bg-[#0C0A09]/70 border border-[#FF6B00]/25 text-left text-xs space-y-1">
              <div className="text-[10px] text-[#FFA066] uppercase font-bold tracking-wider">Next Step</div>
              <div className="text-white font-medium">Please sign in with your credentials to verify your session and access tickets.</div>
            </div>

            <button
              type="button"
              onClick={() => {
                setRegisteredSuccess(null);
                switchMode(true);
              }}
              className="w-full py-3.5 rounded-xl btn-pass-primary text-xs font-bold flex items-center justify-center gap-2 shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all duration-200"
            >
              <span>Proceed to Sign In</span>
              <ArrowRight className="w-4 h-4 text-white" />
            </button>
          </div>
        )}

        {/* ACTIVE AUTH FORMS */}
        {!registeredSuccess && !loginSuccessUser && (
          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* FULL NAME (CREATE ACCOUNT ONLY) */}
            {!isLogin && (
              <div className="space-y-1">
                <label className="block text-[11px] font-semibold text-[#FFA066]">
                  Full Name <span className="text-rose-400">*</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    name="name"
                    required
                    placeholder="e.g. Karn Sharma"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-[#0C0A09]/70 border border-[#FF6B00]/30 text-white placeholder-stone-500 text-xs focus:outline-none focus:border-[#FF6B00] focus:ring-1 focus:ring-[#FF6B00] transition-all"
                  />
                  <User className="w-4 h-4 text-[#FF8533] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>
            )}

            {/* EMAIL ADDRESS (BOTH) */}
            <div className="space-y-1">
              <label className="block text-[11px] font-semibold text-[#FFA066]">
                Email Address <span className="text-rose-400">*</span>
              </label>
              <div className="relative">
                <input
                  type="email"
                  name="email"
                  required
                  placeholder="name@example.com"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-[#0C0A09]/70 border border-[#FF6B00]/30 text-white placeholder-stone-500 text-xs focus:outline-none focus:border-[#FF6B00] focus:ring-1 focus:ring-[#FF6B00] transition-all"
                />
                <Mail className="w-4 h-4 text-[#FF8533] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>

            {/* PHONE NUMBER (CREATE ACCOUNT ONLY) */}
            {!isLogin && (
              <div className="space-y-1">
                <label className="block text-[11px] font-semibold text-[#FFA066]">
                  Phone Number <span className="text-[10px] text-stone-400 font-normal">(for SMS e-tickets)</span>
                </label>
                <div className="relative">
                  <input
                    type="tel"
                    name="phone"
                    placeholder="+91 98765 43210"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-[#0C0A09]/70 border border-[#FF6B00]/30 text-white placeholder-stone-500 text-xs focus:outline-none focus:border-[#FF6B00] focus:ring-1 focus:ring-[#FF6B00] transition-all"
                  />
                  <Phone className="w-4 h-4 text-[#FF8533] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>
            )}

            {/* PASSWORD (BOTH) */}
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <label className="block text-[11px] font-semibold text-[#FFA066]">
                  Password <span className="text-rose-400">*</span>
                </label>
                {!isLogin && formData.password && (
                  <span className="text-[10px] font-medium text-stone-300">
                    Strength: <span className="text-[#FF8533] font-bold">{pwdStrength.text}</span>
                  </span>
                )}
              </div>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  required
                  placeholder="At least 6 characters"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="w-full pl-9 pr-10 py-2.5 rounded-xl bg-[#0C0A09]/70 border border-[#FF6B00]/30 text-white placeholder-stone-500 text-xs focus:outline-none focus:border-[#FF6B00] focus:ring-1 focus:ring-[#FF6B00] transition-all"
                />
                <Lock className="w-4 h-4 text-[#FF8533] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-[#FF8533] transition"
                  title={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>

              {/* Password strength bar for registration */}
              {!isLogin && formData.password && (
                <div className="w-full h-1 bg-[#181512] rounded-full mt-1.5 overflow-hidden flex gap-1">
                  <div className={`h-full flex-1 rounded-full ${pwdStrength.score >= 1 ? pwdStrength.color : 'bg-transparent'}`}></div>
                  <div className={`h-full flex-1 rounded-full ${pwdStrength.score >= 2 ? pwdStrength.color : 'bg-transparent'}`}></div>
                  <div className={`h-full flex-1 rounded-full ${pwdStrength.score >= 3 ? pwdStrength.color : 'bg-transparent'}`}></div>
                </div>
              )}
            </div>

            {/* CONFIRM PASSWORD (CREATE ACCOUNT ONLY) */}
            {!isLogin && (
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <label className="block text-[11px] font-semibold text-[#FFA066]">
                    Confirm Password <span className="text-rose-400">*</span>
                  </label>
                  {passwordsMatch && (
                    <span className="text-[10px] text-emerald-400 flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" /> Matches
                    </span>
                  )}
                  {passwordsMismatch && (
                    <span className="text-[10px] text-rose-400">
                      Does not match
                    </span>
                  )}
                </div>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="confirmPassword"
                    required
                    placeholder="Re-type your password"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    className={`w-full pl-9 pr-3 py-2.5 rounded-xl bg-[#0C0A09]/70 border text-white placeholder-stone-500 text-xs focus:outline-none transition-all ${
                      passwordsMismatch
                        ? 'border-rose-500 focus:border-rose-500'
                        : passwordsMatch
                        ? 'border-emerald-500 focus:border-emerald-500'
                        : 'border-[#FF6B00]/30 focus:border-[#FF6B00]'
                    }`}
                  />
                  <KeyRound className="w-4 h-4 text-[#FF8533] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>
            )}

            {/* REMEMBER ME & FORGOT PASSWORD (SIGN IN ONLY) */}
            {isLogin && (
              <div className="flex items-center justify-between text-xs pt-1">
                <label className="flex items-center gap-2 text-stone-300 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-3.5 h-3.5 rounded border-[#FF6B00]/40 accent-[#FF6B00]"
                  />
                  <span>Stay signed in</span>
                </label>
                <button
                  type="button"
                  onClick={() => alert('Password recovery is linked to your registered email. Contact cinema helpdesk or re-register.')}
                  className="text-[#FFA066] hover:text-white transition text-[11px] underline"
                >
                  Forgot password?
                </button>
              </div>
            )}

            {/* SUBMIT BUTTON */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 mt-4 rounded-xl btn-pass-primary text-xs font-bold flex items-center justify-center gap-2 shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 disabled:opacity-60 disabled:pointer-events-none"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>{isLogin ? 'Authenticating...' : 'Creating Account...'}</span>
                </span>
              ) : (
                <>
                  <span>{isLogin ? 'Sign In to Account' : 'Create Cinema Account'}</span>
                  <ArrowRight className="w-4 h-4 text-white" />
                </>
              )}
            </button>
          </form>
        )}

        {/* BOTTOM HELPER & SWITCH LINKS */}
        {!registeredSuccess && !loginSuccessUser && (
          <div className="mt-6 pt-4 border-t border-[#FF6B00]/20 flex flex-col items-center gap-3">
            <p className="text-xs text-stone-300">
              {isLogin ? "Don't have an account yet?" : 'Already have an account?'}
              <button
                type="button"
                onClick={() => switchMode(!isLogin)}
                className="ml-1.5 font-bold text-[#FF8533] hover:text-[#FFA066] transition underline"
              >
                {isLogin ? 'Create one now' : 'Sign in here'}
              </button>
            </p>

            <button
              type="button"
              onClick={() => {
                switchMode(true);
                setFormData({
                  name: '',
                  email: 'alex@example.com',
                  phone: '',
                  password: 'password123',
                  confirmPassword: '',
                });
              }}
              className="text-[11px] text-[#FFA066]/80 hover:text-white transition"
            >
              Use sample test user (alex@example.com)
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default Auth;