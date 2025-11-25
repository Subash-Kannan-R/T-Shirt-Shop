import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { loginApi, registerApi } from '../utils/api';

const AuthForm = ({ onClose }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleToggle = (loginSelected) => {
    setIsLogin(loginSelected);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    if (!email || !password) {
      setError('Please enter email and password');
      return;
    }
    setSubmitting(true);
    try {
      const data = await loginApi(email, password);
      const payload = { user: { _id: data._id, name: data.name, email: data.email, role: data.role }, token: data.token };
      login(payload);
      if (onClose) onClose();
      if (data.role === 'admin') navigate('/admin', { replace: true });
      else navigate('/', { replace: true });
    } catch (err) {
      setError(err.message || 'Login failed');
    } finally {
      setSubmitting(false);
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setError('');
    if (!name || !email || !password) {
      setError('Please fill all required fields');
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Please enter a valid email');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }
    setSubmitting(true);
    try {
      const data = await registerApi(name, email, password);
      const payload = { user: { _id: data._id, name: data.name, email: data.email, role: data.role }, token: data.token };
      login(payload);
      if (onClose) onClose();
      // New accounts are customers by default
      navigate('/', { replace: true });
    } catch (err) {
      setError(err.message || 'Signup failed');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-white">
      <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-lg mx-auto">
        {onClose && (
          <button
            className="absolute top-4 right-4 text-gray-400 hover:text-black text-2xl font-bold bg-transparent border-none p-0 m-0 z-50"
            onClick={onClose}
            aria-label="Close"
            type="button"
          >
            &times;
          </button>
        )}
  {/* Modal Header with Logo */}
        <div className="flex items-center border-b px-8 py-4">
          <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">UP</span>
          <span className="font-semibold text-lg tracking-wide ml-2">STYLE</span>
        </div>
        <div className="px-8 py-8">
          {error && (
            <div className="mb-4 text-sm text-red-600">{error}</div>
          )}
          {isLogin ? (
            <form onSubmit={handleLogin}>
              <h2 className="text-center text-2xl font-semibold mb-8 mt-2">Great to have you back!</h2>
              <div className="mb-5">
                <div className="flex justify-between items-center mb-1">
                  <label htmlFor="login-email" className="font-medium text-gray-800">Username or email <span className="text-red-500">*</span></label>
                  <label htmlFor="remember" className="text-sm text-gray-600 flex items-center">
                    <input type="checkbox" id="remember" className="mr-1" /> Remember
                  </label>
                </div>
                <input type="email" id="login-email" required value={email} onChange={e=>setEmail(e.target.value)} className="w-full px-4 py-3 border border-gray-200 rounded-md text-base focus:border-blue-500 focus:outline-none" />
              </div>
              <div className="mb-5">
                <div className="flex justify-between items-center mb-1">
                  <label htmlFor="login-password" className="font-medium text-gray-800">Password <span className="text-red-500">*</span></label>
                  <button type="button" onClick={() => { if (onClose) onClose(); navigate('/forgot-password'); }} className="text-sm text-gray-600 hover:underline bg-transparent">Lost?</button>
                </div>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id="login-password"
                    required
                    value={password}
                    onChange={e=>setPassword(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-200 rounded-md text-base focus:border-blue-500 focus:outline-none pr-10"
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700 bg-transparent p-0 m-0 border-none shadow-none focus:outline-none"
                    tabIndex={-1}
                    onClick={() => setShowPassword((v) => !v)}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? (
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 3l18 18M9.88 9.88A3 3 0 0012 15a3 3 0 002.12-5.12M15 12a3 3 0 11-6 0 3 3 0 016 0zm6.36 2.64A9.97 9.97 0 0021 12c0-5-4.03-9-9-9S3 7 3 12c0 1.61.38 3.13 1.06 4.47M9.88 9.88l4.24 4.24" />
                      </svg>
                    ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0zm6.36 2.64A9.97 9.97 0 0021 12c0-5-4.03-9-9-9S3 7 3 12c0 1.61.38 3.13 1.06 4.47" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>
              <button disabled={submitting} type="submit" className="w-full py-3 mt-4 bg-red-400 hover:bg-red-500 text-white rounded font-semibold tracking-wide text-base">{submitting ? 'Signing in...' : 'SIGN IN TO YOUR ACCOUNT'}</button>
              <div className="mt-6 text-center text-gray-600 text-sm">
                Not a member?{' '}
                <button type="button" className="text-red-400 font-medium bg-transparent hover:underline" onClick={() => handleToggle(false)}>
                  Create an account
                </button>
              </div>
            </form>
          ) : (
            <form onSubmit={handleSignup}>
              <h2 className="text-center text-2xl font-semibold mb-8 mt-2">Great to see you here!</h2>
              <div className="mb-5">
                <label htmlFor="signup-name" className="font-medium text-gray-800 mb-1 block">Full name <span className="text-red-500">*</span></label>
                <input type="text" id="signup-name" required value={name} onChange={e=>setName(e.target.value)} className="w-full px-4 py-3 border border-gray-200 rounded-md text-base focus:border-blue-500 focus:outline-none" />
              </div>
              <div className="mb-5">
                <label htmlFor="signup-email" className="font-medium text-gray-800 mb-1 block">Email address <span className="text-red-500">*</span></label>
                <input type="email" id="signup-email" required value={email} onChange={e=>setEmail(e.target.value)} className="w-full px-4 py-3 border border-gray-200 rounded-md text-base focus:border-blue-500 focus:outline-none" />
              </div>
              <div className="mb-5">
                <label htmlFor="signup-password" className="font-medium text-gray-800 mb-1 block">Password <span className="text-red-500">*</span></label>
                <input type="password" id="signup-password" required value={password} onChange={e=>setPassword(e.target.value)} className="w-full px-4 py-3 border border-gray-200 rounded-md text-base focus:border-blue-500 focus:outline-none" />
              </div>
              <p className="text-sm text-gray-600 mb-4">A link to set a new password will be sent to your email address.</p>
              <p className="text-xs text-gray-400 mb-4 leading-relaxed">
                Your personal data will be used to support your experience throughout this website, to manage access to your account, and for other purposes described in our <a href="#" className="underline">privacy policy</a>.
              </p>
              <button disabled={submitting} type="submit" className="w-full py-3 mt-2 bg-red-400 hover:bg-red-500 text-white rounded font-semibold tracking-wide text-base">{submitting ? 'Creating...' : 'SETUP YOUR ACCOUNT'}</button>
              <div className="mt-6 text-center text-gray-600 text-sm">
                Already got an account?{' '}
                <button type="button" className="text-red-400 font-medium hover:underline p-0 m-0 bg-transparent shadow-none" onClick={() => handleToggle(true)}>
                  Sign in here
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthForm;
