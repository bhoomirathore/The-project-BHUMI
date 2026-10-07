import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function Hero() {
  const navigate = useNavigate();

  return (
    <section className="relative overflow-hidden pt-28 sm:pt-32 md:pt-36 pb-14 sm:pb-16 md:pb-20 px-4 sm:px-6 lg:px-8 bg-[#F8F2F0]">
      {/* Subtle warm background ambient glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[350px] bg-[#E6DEDA]/50 rounded-full blur-[100px] pointer-events-none -z-10" />

      <div className="max-w-[1300px] mx-auto grid grid-cols-1 md:grid-cols-[1.1fr_0.9fr] gap-10 md:gap-8 items-center w-full">
        {/* Left Column: Content */}
        <div className="text-left">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-[3.2rem] font-extrabold leading-[1.15] mb-4 text-[#2B1B14] tracking-tight">
            Securing Land Rights<br />
            <span className="text-[#6E5D53] block mt-1">
              Through Blockchain
            </span>
          </h1>
          <p className="text-base sm:text-lg text-[#6E5D53] mb-8 max-w-[540px] leading-relaxed">
            A revolutionary digital land registry system that brings transparency,
            security, and efficiency to land ownership and transactions across India.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 max-w-md sm:max-w-none">
            <button
              onClick={() => navigate('/citizen/verify-land')}
              className="w-full sm:w-auto text-center justify-center bg-[#2B1B14] text-[#F8F2F0] border-none py-3.5 px-8 rounded-[8px] cursor-pointer text-[0.95rem] font-bold transition-all duration-200 shadow-sm hover:-translate-y-0.5 hover:shadow-md hover:bg-[#3D281F] active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2B1B14] focus-visible:ring-offset-2"
            >
              Verify Your Land
            </button>
            <button
              onClick={(e) => {
                e.preventDefault();
                const target = document.querySelector('#features');
                if (target) {
                  target.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
              }}
              className="w-full sm:w-auto text-center justify-center bg-[#E6DEDA] text-[#2B1B14] border border-[#D3CCC8] py-3.5 px-8 rounded-[8px] cursor-pointer text-[0.95rem] font-semibold transition-all duration-200 hover:bg-[#D3CCC8] hover:border-[#2B1B14]/30 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2B1B14] focus-visible:ring-offset-2"
            >
              Learn More
            </button>
          </div>
        </div>

        {/* Right Column: Floating Cards Composition */}
        <div className="w-full">
          {/* Mobile representation: clean responsive card grid; Desktop: floating spatial composition */}
          <div className="grid grid-cols-1 sm:grid-cols-3 md:block relative md:h-[360px] gap-4 md:gap-0 mt-4 md:mt-0">
            {/* Card 1: Secure */}
            <div className="md:absolute md:top-[6%] md:left-[6%] [animation-delay:0s] bg-[#E6DEDA] border border-[#D3CCC8] rounded-[14px] p-5 sm:p-4 md:py-[1.25rem] md:px-[1.6rem] md:min-w-[190px] shadow-[0_8px_25px_rgba(43,27,20,0.06)] md:animate-float transition-all duration-200 hover:-translate-y-1 hover:shadow-md hover:border-[#2B1B14]/25">
              <div className="flex md:block items-center justify-between">
                <div>
                  <h3 className="text-base md:text-[1.15rem] mb-0.5 md:mb-[0.25rem] text-[#2B1B14] font-bold">Secure</h3>
                  <p className="text-[#6E5D53] text-xs md:text-[0.85rem]">Blockchain Protected</p>
                </div>
                <div className="md:hidden text-lg">🛡️</div>
              </div>
            </div>

            {/* Card 2: Fast */}
            <div className="md:absolute md:top-[40%] md:right-[6%] [animation-delay:1.5s] bg-[#E6DEDA] border border-[#D3CCC8] rounded-[14px] p-5 sm:p-4 md:py-[1.25rem] md:px-[1.6rem] md:min-w-[190px] shadow-[0_8px_25px_rgba(43,27,20,0.06)] md:animate-float transition-all duration-200 hover:-translate-y-1 hover:shadow-md hover:border-[#2B1B14]/25">
              <div className="flex md:block items-center justify-between">
                <div>
                  <h3 className="text-base md:text-[1.15rem] mb-0.5 md:mb-[0.25rem] text-[#2B1B14] font-bold">Fast</h3>
                  <p className="text-[#6E5D53] text-xs md:text-[0.85rem]">Quick Processing</p>
                </div>
                <div className="md:hidden text-lg">⚡</div>
              </div>
            </div>

            {/* Card 3: Verified */}
            <div className="md:absolute md:bottom-[6%] md:left-[22%] [animation-delay:3s] bg-[#E6DEDA] border border-[#D3CCC8] rounded-[14px] p-5 sm:p-4 md:py-[1.25rem] md:px-[1.6rem] md:min-w-[190px] shadow-[0_8px_25px_rgba(43,27,20,0.06)] md:animate-float transition-all duration-200 hover:-translate-y-1 hover:shadow-md hover:border-[#2B1B14]/25">
              <div className="flex md:block items-center justify-between">
                <div>
                  <h3 className="text-base md:text-[1.15rem] mb-0.5 md:mb-[0.25rem] text-[#2B1B14] font-bold">Verified</h3>
                  <p className="text-[#6E5D53] text-xs md:text-[0.85rem]">100% Authentic</p>
                </div>
                <div className="md:hidden text-lg">✓</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
