import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 30);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSmoothScroll = (e, targetId) => {
    e.preventDefault();
    setMobileMenuOpen(false);
    const target = document.querySelector(targetId);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 w-full z-[1000] border-b border-[#D3CCC8] backdrop-blur-[12px] transition-all duration-300 ${
        isScrolled
          ? 'py-3 bg-[#F8F2F0]/95 shadow-[0_4px_20px_rgba(43,27,20,0.06)]'
          : 'py-4 bg-[#F8F2F0]/90 shadow-none'
      }`}
    >
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center">
        {/* Brand Logo */}
        <div
          className="flex items-center gap-3 cursor-pointer select-none group"
          onClick={() => {
            setMobileMenuOpen(false);
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
        >
          <div className="w-[36px] h-[36px] bg-[#2B1B14] rounded-[8px] relative shadow-sm flex items-center justify-center transition-transform duration-200 group-hover:scale-105">
            <div className="w-[14px] h-[14px] bg-[#F8F2F0] rounded-[3px]"></div>
          </div>
          <span className="text-xl sm:text-[1.5rem] font-bold tracking-[2px] text-[#2B1B14]">
            B.H.U.M.I
          </span>
        </div>

        {/* Desktop Navigation Links */}
        <ul className="hidden md:flex list-none items-center gap-8 lg:gap-12">
          {['#about', '#features', '#services', '#contact'].map((targetId) => {
            const label = targetId.replace('#', '').charAt(0).toUpperCase() + targetId.slice(2);
            return (
              <li key={targetId}>
                <a
                  href={targetId}
                  onClick={(e) => handleSmoothScroll(e, targetId)}
                  className="text-[#6E5D53] text-[0.95rem] font-medium transition-colors duration-200 hover:text-[#2B1B14] relative py-1 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[2px] after:bg-[#2B1B14] after:transition-all after:duration-200 hover:after:w-full"
                >
                  {label}
                </a>
              </li>
            );
          })}
        </ul>

        {/* Desktop Action Buttons */}
        <div className="hidden md:flex items-center gap-3 sm:gap-4">
          <button
            onClick={() => navigate('/auth/login')}
            className="bg-transparent text-[#2B1B14] border border-[#D3CCC8] py-2 px-5 sm:px-6 rounded-[8px] cursor-pointer text-sm font-semibold transition-all duration-200 hover:bg-[#E6DEDA] hover:border-[#2B1B14]/30 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2B1B14]"
          >
            Sign In
          </button>
          <button
            onClick={() => navigate('/auth/register')}
            className="bg-[#2B1B14] text-[#F8F2F0] border-none py-2 px-5 sm:px-6 rounded-[8px] cursor-pointer text-sm font-semibold transition-all duration-200 shadow-sm hover:-translate-y-0.5 hover:shadow-md hover:bg-[#3D281F] active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2B1B14]"
          >
            Get Started
          </button>
        </div>

        {/* Mobile Hamburger Toggle Button */}
        <div className="flex md:hidden items-center gap-2">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-lg bg-[#E6DEDA] border border-[#D3CCC8] text-[#2B1B14] transition-colors hover:bg-[#D3CCC8] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2B1B14]"
            aria-label="Toggle navigation menu"
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Collapsible Dropdown Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-[#D3CCC8] bg-[#F8F2F0]/98 backdrop-blur-md px-6 py-6 shadow-lg animate-fade-in">
          <ul className="flex flex-col gap-4 list-none mb-6">
            {['#about', '#features', '#services', '#contact'].map((targetId) => {
              const label = targetId.replace('#', '').charAt(0).toUpperCase() + targetId.slice(2);
              return (
                <li key={targetId}>
                  <a
                    href={targetId}
                    onClick={(e) => handleSmoothScroll(e, targetId)}
                    className="text-[#6E5D53] hover:text-[#2B1B14] text-base font-semibold block py-1.5 transition-colors"
                  >
                    {label}
                  </a>
                </li>
              );
            })}
          </ul>
          <div className="flex flex-col gap-3 pt-4 border-t border-[#D3CCC8]">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                navigate('/auth/login');
              }}
              className="w-full bg-transparent text-[#2B1B14] border border-[#D3CCC8] py-2.5 px-4 rounded-[8px] text-sm font-semibold transition-all hover:bg-[#E6DEDA] active:scale-[0.98]"
            >
              Sign In
            </button>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                navigate('/auth/register');
              }}
              className="w-full bg-[#2B1B14] text-[#F8F2F0] py-2.5 px-4 rounded-[8px] text-sm font-semibold transition-all shadow-sm hover:bg-[#3D281F] active:scale-[0.98]"
            >
              Get Started
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}
