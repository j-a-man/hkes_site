import { useNavigate } from 'react-router';
import { useState } from 'react';

export default function PortalLogin() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    navigate('/portal/dashboard');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#DE2910] via-[#FF6B6B] to-[#FF9A5C] flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute top-20 left-20 w-64 h-64 bg-[#FF9A5C] rounded-full opacity-20 blur-3xl"></div>
      <div className="absolute bottom-20 right-20 w-80 h-80 bg-[#DE2910] rounded-full opacity-20 blur-3xl"></div>

      <svg className="absolute bottom-0 left-0 right-0 w-full h-32 opacity-10" viewBox="0 0 1200 120" preserveAspectRatio="none">
        <path d="M0 40 L150 60 L300 50 L450 70 L600 55 L750 65 L900 50 L1050 60 L1200 45 L1200 120 L0 120 Z" fill="white"/>
      </svg>

      <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12 w-full max-w-md relative z-10">
        <div className="text-center mb-8">
          <img
            src="/src/imports/merchlogo_designs_(1).png"
            alt="HKES Logo"
            className="h-20 w-20 mx-auto mb-4"
          />
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

          <div className="text-right">
            <a href="#" className="text-[#DE2910] hover:underline text-sm">
              Forgot password?
            </a>
          </div>

          <button
            type="submit"
            className="w-full bg-[#DE2910] text-white px-6 py-3 rounded-lg hover:bg-[#C32410] transition-colors"
          >
            Login
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
