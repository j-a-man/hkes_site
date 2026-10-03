import { useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router';
import AuthPoster from '../../components/portal/AuthPoster';
import { Field, FormError, FormSuccess, INPUT } from '../../components/portal/Form';
import SiteButton from '../../components/site/SiteButton';
import { supabase } from '../../lib/supabase';

export default function PortalResetPassword() {
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
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
    <AuthPoster title="New password" subtitle="Choose a password with at least 8 characters.">
      {success ? (
        <FormSuccess>Password updated. Taking you to your dashboard…</FormSuccess>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-5">
          <Field label="New password">
            <input type="password" autoComplete="new-password" value={password} onChange={(e) => setPassword(e.target.value)} className={INPUT} required />
          </Field>
          <Field label="Confirm password">
            <input type="password" autoComplete="new-password" value={confirm} onChange={(e) => setConfirm(e.target.value)} className={INPUT} required />
          </Field>
          {error && <FormError>{error}</FormError>}
          <SiteButton type="submit" disabled={submitting} className="w-full">
            {submitting ? 'Saving…' : 'Save password'}
          </SiteButton>
        </form>
      )}
    </AuthPoster>
  );
}
