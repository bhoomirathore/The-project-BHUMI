import React, { useState, useEffect, useRef } from 'react';

const statsData = [
  { target: 50000, label: 'Land Records Digitized' },
  { target: 15000, label: 'Successful Registrations' },
  { target: 200, label: 'Tehsils Connected' },
  { target: 99, label: '% Accuracy Rate' },
];

function StatItem({ target, label }) {
  const [count, setCount] = useState(0);
  const itemRef = useRef(null);
  const animatedRef = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !animatedRef.current) {
            animatedRef.current = true;
            const duration = 2000;
            let start = 0;
            const increment = target / (duration / 16);
            const timer = setInterval(() => {
              start += increment;
              if (start >= target) {
                setCount(target);
                clearInterval(timer);
              } else {
                setCount(Math.floor(start));
              }
            }, 16);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.3 }
    );

    if (itemRef.current) {
      observer.observe(itemRef.current);
    }

    return () => observer.disconnect();
  }, [target]);

  return (
    <div ref={itemRef} className="text-center p-4">
      <h3 className="text-3xl sm:text-4xl md:text-[2.8rem] font-extrabold text-[#2B1B14] mb-1.5 tracking-tight">
        {count.toLocaleString()}
      </h3>
      <p className="text-xs sm:text-sm font-medium text-[#6E5D53]">{label}</p>
    </div>
  );
}

export default function Stats() {
  return (
    <section className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8 bg-[#E6DEDA] border-y border-[#D3CCC8]">
      <div className="max-w-[1300px] mx-auto grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
        {statsData.map((stat, index) => (
          <StatItem key={index} target={stat.target} label={stat.label} />
        ))}
      </div>
    </section>
  );
}
