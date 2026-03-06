import { useState } from 'react';
import { X, Mail, Lock, User, Loader2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const { login, signup } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      if (isLogin) {
        const success = await login(email, password);
        if (!success) {
          setError('Invalid email or password');
        } else {
          onClose();
          resetForm();
        }
      } else {
        if (!name.trim()) {
          setError('Name is required');
          setIsLoading(false);
          return;
        }
        const success = await signup(email, password, name);
        if (!success) {
          setError('Email already exists');
        } else {
          onClose();
          resetForm();
        }
      }
    } catch {
      setError('An error occurred. Please try again.');
    }

    setIsLoading(false);
  };

  const resetForm = () => {
    setEmail('');
    setPassword('');
    setName('');
    setError('');
  };

  const switchMode = () => {
    setIsLogin(!isLogin);
    setError('');
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50" onClick={onClose} />

      <div className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-[#111] border border-white/10 rounded-2xl z-50 p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold">
            {isLogin ? 'Welcome Back' : 'Create Account'}
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-lg transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <div>
              <label className="block text-sm text-gray-400 mb-1">Name</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-lg pl-10 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="Your name"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-sm text-gray-400 mb-1">Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-lg pl-10 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="you@example.com"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-1">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-lg pl-10 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="••••••••"
                required
                minLength={6}
              />
            </div>
          </div>

          {error && (
            <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm px-4 py-2 rounded-lg">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 py-3 rounded-lg font-semibold transition-all flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {isLoading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              isLogin ? 'Sign In' : 'Create Account'
            )}
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-gray-400">
          {isLogin ? "Don't have an account?" : 'Already have an account?'}
          <button onClick={switchMode} className="text-purple-400 hover:text-purple-300 ml-1">
            {isLogin ? 'Sign up' : 'Sign in'}
          </button>
        </div>
      </div>
    </>
  );
}
