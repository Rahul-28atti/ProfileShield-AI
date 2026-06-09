import React, { useState } from 'react';
import { Shield, Key, Mail, User, ShieldAlert, CheckCircle2 } from 'lucide-react';

interface AuthScreenProps {
  onLoginSuccess: (user: any, token: string) => void;
}

export default function AuthScreen({ onLoginSuccess }: AuthScreenProps) {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [registeredSuccess, setRegisteredSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const url = isLogin ? '/api/auth/login' : '/api/auth/register';
    const body = isLogin 
      ? { email, password } 
      : { username, email, password, role: isAdmin ? 'admin' : 'user' };

    try {
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });
      
      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.error || 'Identity core authentication rejected input values.');
      }

      if (!isLogin && !registeredSuccess) {
        // Toggle to login with success visual
        setRegisteredSuccess(true);
        setIsLogin(true);
        setPassword('');
        setError('');
        setLoading(false);
        return;
      }

      onLoginSuccess(data.user, data.token);
    } catch (err: any) {
      setError(err.message || 'Defensive shield error. Please check database connections.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-[#F5F5F5] relative overflow-hidden flex items-center justify-center font-sans">
      
      <div className="w-full max-w-md mx-4 relative z-10">
        {/* Brand Banner */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-12 h-12 bg-[#121212] border border-[#8B7355]/30 rounded-xl flex items-center justify-center shadow-lg mb-3">
            <Shield className="w-6 h-6 text-[#C9A227]" fill="none" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white select-none uppercase font-sans">
            ProfileShield <span className="text-[#C9A227] font-black">AI</span>
          </h1>
          <p className="text-[9px] font-mono text-neutral-500 uppercase tracking-widest mt-1.5 font-bold">
            Defense Gateway Access Control
          </p>
        </div>

        {/* Auth Sandbox Card */}
        <div className="bg-[#121212] rounded-2xl border border-[#8B7355]/25 overflow-hidden shadow-2xl premium-shadow">
          <div className="p-8">
            <div className="flex border-b border-[#8B7355]/20 mb-6">
              <button
                type="button"
                onClick={() => { setIsLogin(true); setError(''); }}
                className={`flex-1 pb-3 text-xs font-bold tracking-wider transition-colors duration-150 uppercase font-mono ${
                  isLogin ? 'text-[#C9A227] border-b border-[#C9A227]' : 'text-neutral-500 hover:text-white'
                }`}
              >
                Secure Login
              </button>
              <button
                type="button"
                onClick={() => { setIsLogin(false); setError(''); }}
                className={`flex-1 pb-3 text-xs font-bold tracking-wider transition-colors duration-150 uppercase font-mono ${
                  !isLogin ? 'text-[#C9A227] border-b border-[#C9A227]' : 'text-neutral-500 hover:text-white'
                }`}
              >
                Create Account
              </button>
            </div>

            {registeredSuccess && isLogin && (
              <div className="mb-6 p-4 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 text-xs flex items-center gap-3 font-semibold font-mono">
                <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-500" />
                <span>Operator registration complete. Please authorize below.</span>
              </div>
            )}

            {error && (
              <div className="mb-6 p-4 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-500 text-xs flex items-start gap-3 leading-relaxed font-sans">
                <ShieldAlert className="w-5 h-5 shrink-0 text-rose-500" />
                <div>
                  <span className="font-bold">Access Denied:</span> <span className="opacity-95 text-neutral-300">{error}</span>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5 text-xs">
              {!isLogin && (
                <div>
                  <label className="block text-[9px] text-neutral-450 uppercase tracking-wider mb-2 font-mono font-bold">
                    System Username
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-neutral-500">
                      <User className="w-4 h-4 text-neutral-500" />
                    </div>
                    <input
                      type="text"
                      className="w-full bg-[#1A1A1A] border border-[#8B7355]/20 rounded-lg pl-10 pr-4 py-2.5 text-xs text-white focus:outline-none focus:border-[#C9A227]/40 transition-all font-sans"
                      placeholder="e.g. analyst_99"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      required
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-[9px] text-neutral-450 uppercase tracking-wider mb-2 font-mono font-bold">
                  Corporate Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-neutral-500">
                    <Mail className="w-4 h-4 text-neutral-500" />
                  </div>
                  <input
                    type="email"
                    className="w-full bg-[#1A1A1A] border border-[#8B7355]/20 rounded-lg pl-10 pr-4 py-2.5 text-xs text-white focus:outline-none focus:border-[#C9A227]/40 transition-all font-sans"
                    placeholder="analyst@profileshield.ai"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-[9px] text-neutral-450 uppercase tracking-wider mb-2 font-mono font-bold">
                  Vault Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-neutral-500">
                    <Key className="w-4 h-4 text-neutral-500" />
                  </div>
                  <input
                    type="password"
                    className="w-full bg-[#1A1A1A] border border-[#8B7355]/20 rounded-lg pl-10 pr-4 py-2.5 text-xs text-white focus:outline-none focus:border-[#C9A227]/40 transition-all font-sans"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
              </div>

              {!isLogin && (
                <div className="py-2.5 flex items-center justify-between border-t border-[#8B7355]/15 mt-3">
                  <div className="flex flex-col">
                    <span className="text-[9px] text-neutral-400 uppercase tracking-wider font-mono font-bold">
                      Admin Clearance Elevation
                    </span>
                    <span className="text-[9px] text-neutral-500 mt-0.5">
                      Grant root logs and command-line execution access
                    </span>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={isAdmin}
                      onChange={(e) => setIsAdmin(e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-[#1A1A1A] border border-[#8B7355]/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[4px] after:left-[4px] after:bg-neutral-600 after:border-neutral-500 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#C9A227]/30 peer-checked:after:bg-[#C9A227]"></div>
                  </label>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#1A1A1A] hover:bg-neutral-900 text-[#C9A227] border border-[#C9A227]/25 font-bold text-xs tracking-wider py-3 px-4 rounded-lg flex items-center justify-center gap-2 transition-all active:scale-98 disabled:opacity-50 mt-4 cursor-pointer font-mono"
              >
                {loading ? (
                  <div className="w-4 h-4 border-2 border-[#C9A227] border-t-transparent animate-spin rounded-full"></div>
                ) : (
                  <>
                    <Shield className="w-4 h-4 shrink-0 text-[#C9A227]" />
                    <span>{isLogin ? 'Validate Credentials' : 'Provision Analyst Account'}</span>
                  </>
                )}
              </button>
            </form>

            {isLogin && (
              <div className="mt-6 text-center border-t border-[#8B7355]/15 pt-4 font-sans text-[11px] text-[#A0A0A0] leading-relaxed">
                <span className="text-[#C9A227] font-bold block mb-1 font-mono">DEFAULT SYSTEMS GATEWAY ACCOUNTS</span>
                <span className="block font-mono">Admin: <code className="text-white bg-[#1A1A1A] px-1 py-0.5 rounded border border-[#8B7355]/10">admin@profileshield.ai</code> • <code className="text-[#C9A227]">admin123</code></span>
                <span className="block mt-1 font-mono">Analyst: <code className="text-white bg-[#1A1A1A] px-1 py-0.5 rounded border border-[#8B7355]/10">adam@profileshield.ai</code> • <code className="text-[#C9A227]">user123</code></span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
