import React from 'react';

interface SeloKProps {
  className?: string;
  fill?: string;
}

export const SeloK: React.FC<SeloKProps> = ({ className, fill = "currentColor" }) => {
  return (
    <svg 
      viewBox="0 0 212 356" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path 
        fillRule="evenodd" 
        clipRule="evenodd" 
        d="M67.125 275.629V196.337L208.156 275.629V355.556L67.125 275.629Z" 
        fill={fill}
      />
      <path 
        fillRule="evenodd" 
        clipRule="evenodd" 
        d="M74.1289 191.195L142.749 230.555L208.156 192.718V116.664L74.1289 191.195Z" 
        fill={fill}
      />
      <path 
        fillRule="evenodd" 
        clipRule="evenodd" 
        d="M2.48828 40.1657L70.3371 2.26562V354.476L2.48828 317.91V40.1657Z" 
        fill={fill}
      />
    </svg>
  );
};