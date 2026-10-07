import React from 'react';

const featuresData = [
  {
    title: 'Land Verification',
    description: 'Instantly verify land ownership using Khasra number with complete transparency and accuracy.',
  },
  {
    title: 'Online Appointments',
    description: 'Book registry appointments at your convenience without standing in long queues.',
  },
  {
    title: 'E-Registry',
    description: 'Download your digital land registry certificates instantly in PDF format.',
  },
  {
    title: 'Blockchain Security',
    description: 'All transactions recorded on immutable blockchain for maximum security and trust.',
  },
  {
    title: 'Real-time Tracking',
    description: 'Monitor your registry process from application to completion in real-time.',
  },
  {
    title: 'Dispute Resolution',
    description: 'Efficient handling of land disputes with transparent documentation.',
  },
];

export default function Features() {
  return (
    <section className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8 bg-[#E6DEDA] transition-colors" id="features">
      <div className="max-w-[1300px] mx-auto">
        <div className="text-center mb-10 sm:mb-14">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#2B1B14] tracking-tight">
            Why Choose B.H.U.M.I?
          </h2>
          <p className="text-sm sm:text-base text-[#6E5D53] mt-2 max-w-xl mx-auto">
            Modern solutions for traditional land management
          </p>
        </div>

        {/* 1 col mobile, 2 col tablet, 3 col desktop */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 lg:gap-7">
          {featuresData.map((feature, index) => (
            <div
              key={index}
              className="bg-[#F8F2F0] border border-[#D3CCC8] rounded-[16px] p-6 sm:p-7 transition-all duration-200 ease-out shadow-sm hover:-translate-y-1 hover:border-[#2B1B14]/30 hover:shadow-md flex flex-col justify-between"
            >
              <div>
                <h3 className="text-lg sm:text-[1.25rem] mb-2.5 text-[#2B1B14] font-bold">
                  {feature.title}
                </h3>
                <p className="text-[#6E5D53] leading-relaxed text-sm sm:text-[0.93rem]">
                  {feature.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
