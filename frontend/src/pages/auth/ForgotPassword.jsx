import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const navigate = useNavigate();

  const handleReset = (e) => {
    e.preventDefault();
    alert('Password reset link has been sent to your email!');
    setTimeout(() => {
      navigate('/auth/login');
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-[#F8F2F0] flex items-center justify-center p-3 sm:p-4 md:p-6">
      <div className="w-full max-w-[1000px] grid grid-cols-1 md:grid-cols-2 rounded-2xl overflow-hidden shadow-[0_15px_40px_rgba(43,27,20,0.08)] border border-[#D3CCC8]">
        {/* Left Side */}
        <div className="hidden md:flex bg-[#E6DEDA] border-r border-[#D3CCC8] p-12 lg:p-16 flex-col justify-center relative overflow-hidden text-[#2B1B14]">
          <Link to="/" className="flex items-center gap-3.5 mb-8 group inline-flex">
            <div className="w-[46px] h-[46px] bg-[#2B1B14] rounded-[10px] relative shadow-md flex items-center justify-center transition-transform group-hover:scale-105">
              <div className="w-[18px] h-[18px] bg-[#E6DEDA] rounded-[4px]" />
            </div>
            <span className="text-2xl sm:text-3xl font-bold tracking-[2px] text-[#2B1B14]">
              B.H.U.M.I
            </span>
          </Link>
          <h1 className="text-3xl lg:text-4xl font-extrabold mb-4 leading-tight text-[#2B1B14]">
            Reset Your Password
          </h1>
          <p className="text-lg text-[#6E5D53]">
            We'll send you instructions to reset your password
          </p>
        </div>

        {/* Right Side */}
        <div className="bg-[#F8F2F0] p-4 sm:p-8 md:p-10 lg:p-14 flex flex-col justify-center">
          {/* Mobile Logo */}
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
              <h2 className="text-2xl sm:text-3xl font-extrabold text-[#2B1B14] mb-1.5">Forgot Password?</h2>
              <p className="text-sm text-[#6E5D53]">Enter your email to receive reset instructions</p>
            </div>

            <form onSubmit={handleReset} className="flex flex-col gap-5 sm:gap-6">
              <div className="flex flex-col gap-1.5">
                <label htmlFor="resetEmail" className="text-sm font-semibold text-[#2B1B14]">
                  Email Address
                </label>
                <input
                  type="email"
                  id="resetEmail"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your.email@example.com"
                  required
                  className="p-3 sm:p-3.5 bg-[#F8F2F0] border-2 border-[#D3CCC8] rounded-[10px] text-[#2B1B14] text-sm sm:text-base placeholder-[#7A6B63] focus:outline-none focus:border-[#2B1B14] focus:ring-2 focus:ring-[#2B1B14]/15 transition-all"
                />
              </div>

              <button
                type="submit"
                className="p-3.5 bg-[#2B1B14] rounded-[10px] text-[#F8F2F0] text-sm sm:text-base font-bold cursor-pointer transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md hover:bg-[#3D281F] active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2B1B14] focus-visible:ring-offset-2"
              >
                Send Reset Link
              </button>

              <div className="text-center mt-1">
                <Link to="/auth/login" className="text-sm text-[#6E5D53] hover:text-[#2B1B14] transition-colors font-semibold">
                  &larr; Back to Login
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
