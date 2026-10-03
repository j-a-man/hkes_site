import { useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router';
import { Eye, EyeOff } from 'lucide-react';
import AuthPoster from '../../components/portal/AuthPoster';
import { Field, FormError, FormSuccess, INPUT } from '../../components/portal/Form';
import SiteButton from '../../components/site/SiteButton';
import { useAuth } from '../../lib/auth';
import { supabase } from '../../lib/supabase';

export default function PortalLogin() {
  const navigate = useNavigate();
  const { signIn } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setNotice(null);
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
    setNotice(null);
    if (!email) {
      setError('Enter your email above first, then choose "Forgot password?"');
      return;
    }
    setError(null);
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/portal/reset-password`,
    });
    if (error) setError(error.message);
    else setNotice('Check your email for a password reset link.');
  };

  return (
    <AuthPoster title="Welcome back!" subtitle="Sign in with your HKES account.">
      <form onSubmit={handleLogin} className="space-y-5">
        <Field label="Email">
          <input
            type="email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={INPUT}
            placeholder="you@binghamton.edu"
            required
          />
        </Field>

        <div>
          <Field label="Password">
            <span className="relative block">
              <input
                type={showPassword ? 'text' : 'password'}
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={`${INPUT} pr-12`}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword((s) => !s)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
                className="absolute right-1.5 top-1/2 grid h-9 w-9 -translate-y-1/2 place-items-center rounded-full text-hk-ink-soft hover:text-hk-red focus-visible:outline-2 focus-visible:outline-hk-red"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </span>
          </Field>
          <button type="button" onClick={handleForgotPassword} className="mt-2 text-sm font-semibold text-hk-red hover:underline">
            Forgot password?
          </button>
        </div>

        {error && <FormError>{error}</FormError>}
        {notice && <FormSuccess>{notice}</FormSuccess>}

        <SiteButton type="submit" disabled={submitting} className="w-full">
          {submitting ? 'Signing in…' : 'Sign in'}
        </SiteButton>
      </form>

      <p className="mt-7 border-t-2 border-dashed border-hk-line pt-5 text-center text-sm text-hk-ink-soft">
        Not a member yet?{' '}
        <Link to="/about" className="font-semibold text-hk-red hover:underline">
          Learn about HKES
        </Link>
      </p>
    </AuthPoster>
  );
}
