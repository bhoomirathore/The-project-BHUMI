import React from 'react';
import { useNavigate } from 'react-router-dom';

const servicesData = [
  {
    number: '01',
    title: 'For Citizens',
    featured: false,
    route: '/citizen/dashboard',
    items: [
      'Land ownership verification',
      'Registry appointment booking',
      'E-registry download',
      'Transaction history',
    ],
  },
  {
    number: '02',
    title: 'For Local Authorities',
    featured: true,
    route: '/authority/dashboard',
    items: [
      'Document verification',
      'eKYC processing',
      'Registry & mutation',
      'Blockchain integration',
    ],
  },
  {
    number: '03',
    title: 'For Government HQ',
    featured: false,
    route: '/government/dashboard',
    items: [
      'Registry monitoring',
      'Analytics & reports',
      'Tehsil-wise tracking',
      'Dispute management',
    ],
  },
];

export default function Services() {
  const navigate = useNavigate();

  return (
    <section className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8 bg-[#F8F2F0]" id="services">
      <div className="max-w-[1300px] mx-auto">
        <div className="text-center mb-10 sm:mb-14">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#2B1B14] tracking-tight">
            Our Services
          </h2>
          <p className="text-sm sm:text-base text-[#6E5D53] mt-2 max-w-xl mx-auto">
            Comprehensive land management solutions
          </p>
        </div>

        {/* 1 col mobile, 2 col tablet, 3 col desktop */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-7">
          {servicesData.map((service, index) => (
            <div
              key={index}
              className={`rounded-[16px] p-6 sm:p-8 relative transition-all duration-200 ease-out flex flex-col justify-between hover:-translate-y-1 ${
                service.featured
                  ? 'border-2 border-[#2B1B14]/25 bg-[#D3CCC8] shadow-md hover:shadow-lg'
                  : 'bg-[#E6DEDA] border border-[#D3CCC8] shadow-sm hover:shadow-md hover:border-[#2B1B14]/30'
              }`}
            >
              <div>
                <div className="text-4xl sm:text-5xl font-black text-[#2B1B14]/15 absolute top-5 right-6 select-none pointer-events-none">
                  {service.number}
                </div>
                <h3 className="text-xl sm:text-2xl mb-5 text-[#2B1B14] font-bold">
                  {service.title}
                </h3>
                <ul className="list-none mb-8 space-y-2.5">
                  {service.items.map((item, idx) => (
                    <li
                      key={idx}
                      className="py-1 text-[#6E5D53] text-sm sm:text-[0.93rem] border-b border-[#D3CCC8]/60 flex items-center"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-[#2B1B14] mr-2.5 shrink-0 inline-block" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <button
                onClick={() => navigate(service.route)}
                className="w-full bg-transparent text-[#2B1B14] border-2 border-[#2B1B14] py-3 px-4 rounded-[10px] cursor-pointer text-sm sm:text-base font-bold transition-all duration-200 hover:bg-[#2B1B14] hover:text-[#F8F2F0] active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2B1B14] focus-visible:ring-offset-2"
              >
                Access Portal
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
