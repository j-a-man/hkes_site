import { useState } from 'react';
import { useNavigate } from 'react-router';
import Logo from '../../components/Logo';
import { supabase } from '../../lib/supabase';

export default function PortalResetPassword() {
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (password.length < 8) {
      setError('Password must be at least 8 characters.');
      return;
    }
    if (password !== confirm) {
      setError('Passwords do not match.');
      return;
    }
    setSubmitting(true);
    const { error } = await supabase.auth.updateUser({ password });
    setSubmitting(false);
    if (error) {
      setError(error.message);
      return;
    }
    setSuccess(true);
    setTimeout(() => navigate('/portal/dashboard'), 1500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#DE2910] via-[#FF6B6B] to-[#FF9A5C] flex items-center justify-center p-4">
      <div className="bg-white dark:bg-[#1a1b1e] rounded-3xl shadow-2xl p-8 md:p-12 w-full max-w-md relative z-10">
        <div className="text-center mb-8">
          <Logo size={80} className="mx-auto mb-4" />
          <h1 className="text-3xl mb-2">Set a New Password</h1>
        </div>

        {success ? (
          <p className="text-center text-green-600">Password updated — redirecting…</p>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block mb-2">New Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#DE2910]"
                required
              />
            </div>
            <div>
              <label className="block mb-2">Confirm Password</label>
              <input
                type="password"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#DE2910]"
                required
              />
            </div>
            {error && <p className="text-sm text-red-600">{error}</p>}
            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-[#DE2910] text-white px-6 py-3 rounded-lg hover:bg-[#C32410] transition-colors disabled:opacity-60"
            >
              {submitting ? 'Saving…' : 'Save Password'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
