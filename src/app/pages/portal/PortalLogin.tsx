import { useNavigate } from 'react-router';
import { useState } from 'react';
import Logo from '../../components/Logo';
import { useAuth } from '../../lib/auth';
import { supabase } from '../../lib/supabase';

export default function PortalLogin() {
  const navigate = useNavigate();
  const { signIn } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [resetMessage, setResetMessage] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    const { error } = await signIn(email, password);
    setSubmitting(false);
    if (error) {
      setError(error);
      return;
    }
    navigate('/portal/dashboard');
  };

  const handleForgotPassword = async () => {
    if (!email) {
      setError('Enter your email above first, then click "Forgot password?"');
      return;
    }
    setError(null);
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/portal/reset-password`,
    });
    setResetMessage(error ? error.message : 'Check your email for a password reset link.');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#DE2910] via-[#FF6B6B] to-[#FF9A5C] flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute top-20 left-20 w-64 h-64 bg-[#FF9A5C] rounded-full opacity-20 blur-3xl"></div>
      <div className="absolute bottom-20 right-20 w-80 h-80 bg-[#DE2910] rounded-full opacity-20 blur-3xl"></div>

      <svg className="absolute bottom-0 left-0 right-0 w-full h-32 opacity-10" viewBox="0 0 1200 120" preserveAspectRatio="none">
        <path d="M0 40 L150 60 L300 50 L450 70 L600 55 L750 65 L900 50 L1050 60 L1200 45 L1200 120 L0 120 Z" fill="white" />
      </svg>

      <div className="bg-white dark:bg-[#1a1b1e] rounded-3xl shadow-2xl p-8 md:p-12 w-full max-w-md relative z-10">
        <div className="text-center mb-8">
          <Logo size={80} className="mx-auto mb-4" />
          <h1 className="text-3xl mb-2">Member Portal</h1>
          <p className="text-[#555555]">Sign in to access your dashboard</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block mb-2">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#DE2910]"
              placeholder="your.email@binghamton.edu"
              required
            />
          </div>

          <div>
            <label className="block mb-2">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#DE2910]"
              placeholder="••••••••"
              required
            />
          </div>

          {error && <p className="text-sm text-red-600">{error}</p>}
          {resetMessage && <p className="text-sm text-green-600">{resetMessage}</p>}

          <div className="text-right">
            <button type="button" onClick={handleForgotPassword} className="text-[#DE2910] hover:underline text-sm">
              Forgot password?
            </button>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-[#DE2910] text-white px-6 py-3 rounded-lg hover:bg-[#C32410] transition-colors disabled:opacity-60"
          >
            {submitting ? 'Signing in…' : 'Login'}
          </button>
        </form>

        <div className="mt-8 text-center">
          <p className="text-sm text-[#555555]">
            Not a member yet?{' '}
            <a href="/" className="text-[#DE2910] hover:underline">
              Learn more about HKES
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
