import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function Register() {
  const [formData, setFormData] = useState({
    userType: '',
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    aadhaar: '',
    password: '',
    confirmPassword: '',
    terms: false,
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { id, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleRegister = (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      alert('Passwords do not match!');
      return;
    }

    alert('Registration Successful!\n\nPlease verify your email to activate your account.');
    navigate('/auth/login');
  };

  return (
    <div className="min-h-screen bg-[#F8F2F0] flex items-center justify-center p-3 sm:p-4 md:p-6">
      <div className="w-full max-w-[1200px] grid grid-cols-1 md:grid-cols-2 min-h-auto md:min-h-[760px] rounded-2xl overflow-hidden shadow-[0_15px_40px_rgba(43,27,20,0.08)] border border-[#D3CCC8]">
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
              Join B.H.U.M.I Today
            </h1>
            <p className="text-lg text-[#6E5D53]">
              Create your account and start managing land records digitally
            </p>
          </div>

          <div className="absolute inset-0 pointer-events-none opacity-20">
            <div className="absolute top-[20%] left-[10%] text-6xl animate-float"></div>
            <div className="absolute top-[60%] right-[15%] text-6xl animate-float [animation-delay:2s]"></div>
            <div className="absolute bottom-[15%] left-[20%] text-6xl animate-float [animation-delay:4s]"></div>
          </div>
        </div>

        {/* Right Side / Mobile Form */}
        <div className="bg-[#F8F2F0] p-4 sm:p-8 md:p-10 lg:p-12 flex flex-col justify-center overflow-y-auto">
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
            <div className="text-center mb-6">
              <h2 className="text-2xl sm:text-3xl font-extrabold text-[#2B1B14] mb-1.5">Create Account</h2>
              <p className="text-sm text-[#6E5D53]">Fill in your details to register</p>
            </div>

            <form onSubmit={handleRegister} className="flex flex-col gap-3.5 sm:gap-4">
              <div className="flex flex-col gap-1">
                <label htmlFor="userType" className="text-xs sm:text-sm font-semibold text-[#2B1B14]">
                  Register As
                </label>
                <select
                  id="userType"
                  value={formData.userType}
                  onChange={handleChange}
                  required
                  className="p-3 bg-[#F8F2F0] border-2 border-[#D3CCC8] rounded-[10px] text-[#2B1B14] text-xs sm:text-sm focus:outline-none focus:border-[#2B1B14] focus:ring-2 focus:ring-[#2B1B14]/15 transition-all"
                >
                  <option value="">Select User Type</option>
                  <option value="citizen">Citizen</option>
                  <option value="authority">Local Authority</option>
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="flex flex-col gap-1">
                  <label htmlFor="firstName" className="text-xs sm:text-sm font-semibold text-[#2B1B14]">
                    First Name
                  </label>
                  <input
                    type="text"
                    id="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    placeholder="John"
                    required
                    className="p-3 bg-[#F8F2F0] border-2 border-[#D3CCC8] rounded-[10px] text-[#2B1B14] text-xs sm:text-sm placeholder-[#7A6B63] focus:outline-none focus:border-[#2B1B14] focus:ring-2 focus:ring-[#2B1B14]/15 transition-all"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label htmlFor="lastName" className="text-xs sm:text-sm font-semibold text-[#2B1B14]">
                    Last Name
                  </label>
                  <input
                    type="text"
                    id="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    placeholder="Doe"
                    required
                    className="p-3 bg-[#F8F2F0] border-2 border-[#D3CCC8] rounded-[10px] text-[#2B1B14] text-xs sm:text-sm placeholder-[#7A6B63] focus:outline-none focus:border-[#2B1B14] focus:ring-2 focus:ring-[#2B1B14]/15 transition-all"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1">
                <label htmlFor="email" className="text-xs sm:text-sm font-semibold text-[#2B1B14]">
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="your.email@example.com"
                  required
                  className="p-3 bg-[#F8F2F0] border-2 border-[#D3CCC8] rounded-[10px] text-[#2B1B14] text-xs sm:text-sm placeholder-[#7A6B63] focus:outline-none focus:border-[#2B1B14] focus:ring-2 focus:ring-[#2B1B14]/15 transition-all"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="flex flex-col gap-1">
                  <label htmlFor="phone" className="text-xs sm:text-sm font-semibold text-[#2B1B14]">
                    Mobile Number
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="10-digit mobile number"
                    required
                    className="p-3 bg-[#F8F2F0] border-2 border-[#D3CCC8] rounded-[10px] text-[#2B1B14] text-xs sm:text-sm placeholder-[#7A6B63] focus:outline-none focus:border-[#2B1B14] focus:ring-2 focus:ring-[#2B1B14]/15 transition-all"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label htmlFor="aadhaar" className="text-xs sm:text-sm font-semibold text-[#2B1B14]">
                    Aadhaar Number
                  </label>
                  <input
                    type="text"
                    id="aadhaar"
                    value={formData.aadhaar}
                    onChange={handleChange}
                    placeholder="12-digit Aadhaar number"
                    required
                    className="p-3 bg-[#F8F2F0] border-2 border-[#D3CCC8] rounded-[10px] text-[#2B1B14] text-xs sm:text-sm placeholder-[#7A6B63] focus:outline-none focus:border-[#2B1B14] focus:ring-2 focus:ring-[#2B1B14]/15 transition-all"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="flex flex-col gap-1">
                  <label htmlFor="password" className="text-xs sm:text-sm font-semibold text-[#2B1B14]">
                    Password
                  </label>
                  <input
                    type="password"
                    id="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Create password"
                    required
                    className="p-3 bg-[#F8F2F0] border-2 border-[#D3CCC8] rounded-[10px] text-[#2B1B14] text-xs sm:text-sm placeholder-[#7A6B63] focus:outline-none focus:border-[#2B1B14] focus:ring-2 focus:ring-[#2B1B14]/15 transition-all"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label htmlFor="confirmPassword" className="text-xs sm:text-sm font-semibold text-[#2B1B14]">
                    Confirm Password
                  </label>
                  <input
                    type="password"
                    id="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="Re-enter password"
                    required
                    className="p-3 bg-[#F8F2F0] border-2 border-[#D3CCC8] rounded-[10px] text-[#2B1B14] text-xs sm:text-sm placeholder-[#7A6B63] focus:outline-none focus:border-[#2B1B14] focus:ring-2 focus:ring-[#2B1B14]/15 transition-all"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 mt-1">
                <input
                  type="checkbox"
                  id="terms"
                  checked={formData.terms}
                  onChange={handleChange}
                  required
                  className="w-4 h-4 accent-[#2B1B14] rounded cursor-pointer"
                />
                <label htmlFor="terms" className="text-xs text-[#6E5D53] cursor-pointer">
                  I agree to the <a href="#" className="text-[#2B1B14] font-semibold underline">Terms &amp; Conditions</a> and <a href="#" className="text-[#2B1B14] font-semibold underline">Privacy Policy</a>
                </label>
              </div>

              <button
                type="submit"
                className="mt-2 p-3.5 bg-[#2B1B14] rounded-[10px] text-[#F8F2F0] text-sm sm:text-base font-bold cursor-pointer transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md hover:bg-[#3D281F] active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2B1B14] focus-visible:ring-offset-2"
              >
                Create Account
              </button>

              <div className="text-center mt-1 text-xs sm:text-sm text-[#6E5D53]">
                Already have an account?{' '}
                <Link to="/auth/login" className="text-[#2B1B14] font-bold hover:underline">
                  Sign In
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
