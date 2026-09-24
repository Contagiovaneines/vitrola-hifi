import React from 'react';

interface VitrolaLogoProps {
  className?: string;
  size?: number;
}

export const VitrolaLogo: React.FC<VitrolaLogoProps> = ({ className = '', size = 32 }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 48 48"
      width={size}
      height={size}
      fill="none"
      className={className}
      aria-label="Vitrola Logo"
    >
      <rect width="48" height="48" rx="12" fill="#1C1815" />
      <circle cx="24" cy="24" r="18" fill="#12100E" stroke="#D4A373" strokeWidth="1.5" />
      <circle cx="24" cy="24" r="14" stroke="#2D2824" strokeWidth="1" strokeDasharray="2 2" />
      <circle cx="24" cy="24" r="10" stroke="#3A332E" strokeWidth="1" />
      <circle cx="24" cy="24" r="6" fill="#C86432" />
      <circle cx="24" cy="24" r="2" fill="#FAF5ED" />
      <path d="M34 14 L26 23" stroke="#E0A96D" strokeWidth="2" strokeLinecap="round" />
      <circle cx="34" cy="14" r="2.5" fill="#E0A96D" />
    </svg>
  );
};
