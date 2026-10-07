import React from 'react';

export default function Footer() {
  const handleSmoothScroll = (e, targetId) => {
    e.preventDefault();
    const target = document.querySelector(targetId);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <footer className="bg-[#E6DEDA] border-t border-[#D3CCC8] pt-12 sm:pt-14 px-4 sm:px-6 lg:px-8 pb-8 text-[#2B1B14]">
      <div className="max-w-[1300px] mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-10 mb-10">
        {/* Brand Col */}
        <div className="sm:col-span-2 lg:col-span-1">
          <div className="flex items-center gap-3 mb-3.5 cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            <div className="w-[36px] h-[36px] bg-[#2B1B14] rounded-[8px] relative shadow-sm flex items-center justify-center shrink-0">
              <div className="w-[14px] h-[14px] bg-[#F8F2F0] rounded-[3px]"></div>
            </div>
            <span className="text-xl font-bold tracking-[2px] text-[#2B1B14]">
              B.H.U.M.I
            </span>
          </div>
          <p className="text-[#6E5D53] text-sm leading-relaxed max-w-sm">
            Revolutionizing land registry through blockchain technology.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="text-[#2B1B14] mb-3 text-base font-bold">Quick Links</h4>
          <ul className="list-none space-y-2">
            <li>
              <a
                href="#about"
                onClick={(e) => handleSmoothScroll(e, '#about')}
                className="text-[#6E5D53] text-sm transition-colors duration-200 hover:text-[#2B1B14] inline-block py-0.5"
              >
                About Us
              </a>
            </li>
            <li>
              <a
                href="#features"
                onClick={(e) => handleSmoothScroll(e, '#features')}
                className="text-[#6E5D53] text-sm transition-colors duration-200 hover:text-[#2B1B14] inline-block py-0.5"
              >
                Features
              </a>
            </li>
            <li>
              <a
                href="#services"
                onClick={(e) => handleSmoothScroll(e, '#services')}
                className="text-[#6E5D53] text-sm transition-colors duration-200 hover:text-[#2B1B14] inline-block py-0.5"
              >
                Services
              </a>
            </li>
            <li>
              <a
                href="#contact"
                onClick={(e) => handleSmoothScroll(e, '#contact')}
                className="text-[#6E5D53] text-sm transition-colors duration-200 hover:text-[#2B1B14] inline-block py-0.5"
              >
                Contact
              </a>
            </li>
          </ul>
        </div>

        {/* Legal */}
        <div>
          <h4 className="text-[#2B1B14] mb-3 text-base font-bold">Legal</h4>
          <ul className="list-none space-y-2">
            <li>
              <a href="#" className="text-[#6E5D53] text-sm transition-colors duration-200 hover:text-[#2B1B14] inline-block py-0.5">
                Privacy Policy
              </a>
            </li>
            <li>
              <a href="#" className="text-[#6E5D53] text-sm transition-colors duration-200 hover:text-[#2B1B14] inline-block py-0.5">
                Terms of Service
              </a>
            </li>
            <li>
              <a href="#" className="text-[#6E5D53] text-sm transition-colors duration-200 hover:text-[#2B1B14] inline-block py-0.5">
                Compliance
              </a>
            </li>
            <li>
              <a href="#" className="text-[#6E5D53] text-sm transition-colors duration-200 hover:text-[#2B1B14] inline-block py-0.5">
                Support
              </a>
            </li>
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h4 className="text-[#2B1B14] mb-3 text-base font-bold">Contact</h4>
          <ul className="list-none space-y-2 text-sm text-[#6E5D53]">
            <li className="py-0.5">Email: info@b.h.u.m.i.gov.in</li>
            <li className="py-0.5">Phone: 1800-XXX-XXXX</li>
            <li className="py-0.5">Ministry of Land Resources</li>
          </ul>
        </div>
      </div>

      <div className="text-center pt-6 border-t border-[#D3CCC8] text-[#7A6B63] text-xs">
        <p>&copy; 2024 B.H.U.M.I. All rights reserved. Government of India</p>
      </div>
    </footer>
  );
}
