import React from 'react';

export default function RoleBadge({ role, className = '' }) {
  if (!role) return null;

  let text = role;
  if (role === 'GOVERNMENT_HQ') text = 'GOV HQ';
  if (role === 'REGISTRAR') text = 'REGISTRAR';
  if (role === 'CITIZEN') text = 'CITIZEN';

  return (
    <span
      className={`inline-block text-[0.62rem] font-extrabold uppercase px-2 py-0.5 rounded-full bg-[#2B1B14]/10 border border-[#2B1B14]/20 text-[#2B1B14] w-fit ${className}`}
    >
      {text}
    </span>
  );
}
