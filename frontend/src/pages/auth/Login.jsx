import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { isMockMode } from '../../api/client';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const user = await login(email, password);
      if (user.role === 'CITIZEN') {
        navigate('/citizen/dashboard');
      } else if (user.role === 'REGISTRAR') {
        navigate('/authority/dashboard');
      } else if (user.role === 'GOVERNMENT_HQ') {
        navigate('/government/dashboard');
      } else {
        navigate('/');
      }
    } catch (err) {
      setError(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F2F0] flex items-center justify-center p-3 sm:p-4 md:p-6">
      <div className="w-full max-w-[1200px] grid grid-cols-1 md:grid-cols-2 min-h-auto md:min-h-[720px] rounded-2xl overflow-hidden shadow-[0_15px_40px_rgba(43,27,20,0.08)] border border-[#D3CCC8]">
        {/* Left Side (Desktop Only) */}
        <div className="hidden md:flex bg-[#E6DEDA] border-r border-[#D3CCC8] p-12 lg:p-16 flex-col justify-center relative overflow-hidden text-[#2B1B14]">
          <div className="relative z-10">
            <Link to="/" className="flex items-center gap-3.5 mb-8 group inline-flex">
              <div className="w-[46px] h-[46px] bg-[#2B1B14] rounded-[10px] relative shadow-md flex items-center justify-center transition-transform group-hover:scale-105">
                <div className="w-[18px] h-[18px] bg-[#E6DEDA] rounded-[4px]" />
              </div>
              <span className="text-2xl sm:text-3xl font-bold tracking-[2px] text-[#2B1B14]">
                B.H.U.M.I
              </span>
            </Link>
            <h1 className="text-3xl lg:text-4xl font-extrabold mb-4 leading-tight text-[#2B1B14]">
              Digital Land Registry System
            </h1>
            <p className="text-lg text-[#6E5D53]">
              Securing land rights through blockchain technology
            </p>
          </div>

          <div className="absolute inset-0 pointer-events-none opacity-20">
            <div className="absolute top-[20%] left-[10%] text-6xl animate-float"></div>
            <div className="absolute top-[60%] right-[15%] text-6xl animate-float [animation-delay:2s]"></div>
            <div className="absolute bottom-[15%] left-[20%] text-6xl animate-float [animation-delay:4s]"></div>
          </div>
        </div>

        {/* Right Side / Mobile Form View */}
        <div className="bg-[#F8F2F0] p-4 sm:p-8 md:p-10 lg:p-14 flex flex-col justify-center">
          {/* Mobile Logo Header */}
          <div className="md:hidden flex justify-center mb-6">
            <Link to="/" className="flex items-center gap-3">
              <div className="w-[40px] h-[40px] bg-[#2B1B14] rounded-[8px] relative shadow-sm flex items-center justify-center">
                <div className="w-[16px] h-[16px] bg-[#E6DEDA] rounded-[3px]" />
              </div>
              <span className="text-2xl font-bold tracking-[2px] text-[#2B1B14]">
                B.H.U.M.I
              </span>
            </Link>
          </div>

          <div className="bg-[#E6DEDA] border border-[#D3CCC8] rounded-[20px] sm:rounded-[24px] p-6 sm:p-8 md:p-10 shadow-[0_10px_30px_rgba(43,27,20,0.06)]">
            <div className="text-center mb-6 sm:mb-8">
              <h2 className="text-2xl sm:text-3xl font-extrabold text-[#2B1B14] mb-1.5">Welcome Back</h2>
              <p className="text-sm text-[#6E5D53]">Sign in to access your account</p>
            </div>

            {error && (
              <div className="mb-5 p-3 rounded-lg bg-[#DC2626]/10 border border-[#DC2626]/20 text-[#DC2626] text-xs font-semibold">
                {error}
              </div>
            )}

            <form onSubmit={handleLogin} className="flex flex-col gap-4 sm:gap-5">
              <div className="flex flex-col gap-1.5">
                <label htmlFor="email" className="text-sm font-semibold text-[#2B1B14]">
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your.email@example.com"
                  required
                  className="p-3 sm:p-3.5 bg-[#F8F2F0] border-2 border-[#D3CCC8] rounded-[10px] text-[#2B1B14] text-sm sm:text-base placeholder-[#7A6B63] focus:outline-none focus:border-[#2B1B14] focus:ring-2 focus:ring-[#2B1B14]/15 transition-all"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label htmlFor="password" className="text-sm font-semibold text-[#2B1B14]">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    required
                    className="w-full p-3 sm:p-3.5 pr-12 bg-[#F8F2F0] border-2 border-[#D3CCC8] rounded-[10px] text-[#2B1B14] text-sm sm:text-base placeholder-[#7A6B63] focus:outline-none focus:border-[#2B1B14] focus:ring-2 focus:ring-[#2B1B14]/15 transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#6E5D53] hover:text-[#2B1B14] text-xs sm:text-sm font-medium py-1 px-1.5"
                  >
                    {showPassword ? 'Hide' : 'Show'}
                  </button>
                </div>
              </div>

              <div className="flex items-center text-xs sm:text-sm">
                <label className="flex items-center gap-2 text-[#6E5D53] cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={remember}
                    onChange={(e) => setRemember(e.target.checked)}
                    className="w-4 h-4 accent-[#2B1B14] rounded cursor-pointer"
                  />
                  <span>Remember me</span>
                </label>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="mt-1 p-3.5 bg-[#2B1B14] rounded-[10px] text-[#F8F2F0] text-sm sm:text-base font-bold cursor-pointer transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md hover:bg-[#3D281F] active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2B1B14] focus-visible:ring-offset-2"
              >
                {loading ? 'Signing in...' : 'Sign In'}
              </button>

              <div className="text-center mt-2 text-xs sm:text-sm text-[#6E5D53]">
                Don't have an account?{' '}
                <Link to="/auth/register" className="text-[#2B1B14] font-bold hover:underline">
                  Sign Up
                </Link>
              </div>
            </form>

            {isMockMode() && (
              <div className="mt-5 p-3 rounded-lg bg-[#F8F2F0] border border-[#D3CCC8] text-[0.72rem] text-[#7A6B63] leading-relaxed">
                <span className="font-bold text-[#2B1B14] block mb-0.5">Demo Accounts:</span>
                <div>Citizen: <span className="font-mono text-[#2B1B14]">rajesh.singh@example.com</span></div>
                <div>Registrar: <span className="font-mono text-[#2B1B14]">ramesh.sharma@example.com</span></div>
                <div>HQ: <span className="font-mono text-[#2B1B14]">mukesh.kumar@example.com</span></div>
              </div>
            )}
          </div>

          <div className="text-center mt-5 text-xs text-[#6E5D53]">
            B.H.U.M.I. prototype (not an official government service)
          </div>
        </div>
      </div>
    </div>
  );
}
