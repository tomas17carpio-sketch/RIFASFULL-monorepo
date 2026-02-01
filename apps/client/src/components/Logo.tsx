
import React from 'react';

interface LogoProps {
  className?: string;
  variant?: 'full' | 'icon';
}

const Logo: React.FC<LogoProps> = ({ className = "size-14", variant = 'icon' }) => {
  return (
    <div className={`relative ${className} flex items-center justify-center group`}>
      <svg
        viewBox="0 0 48 48"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full drop-shadow-[0_8px_20px_rgba(244,140,37,0.4)] animate-float"
      >
        <defs>
          <linearGradient id="ticketGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#f48c25" />
            <stop offset="50%" stopColor="#ff9d3f" />
            <stop offset="100%" stopColor="#d67618" />
          </linearGradient>
          
          <linearGradient id="shineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="white" stopOpacity="0" />
            <stop offset="50%" stopColor="white" stopOpacity="0.4" />
            <stop offset="100%" stopColor="white" stopOpacity="0" />
          </linearGradient>

          <mask id="ticketMask">
            <path
              d="M4 14C4 11.7909 5.79086 10 8 10H40C42.2091 10 44 11.7909 44 14V19.5C42.6193 19.5 41.5 20.6193 41.5 22C41.5 23.3807 42.6193 24.5 44 24.5V34C44 36.2091 42.2091 38 40 38H8C5.79086 38 4 36.2091 4 34V24.5C5.38071 24.5 6.5 23.3807 6.5 22C6.5 20.6193 5.38071 19.5 4 19.5V14Z"
              fill="white"
            />
          </mask>
        </defs>

        {/* Background Ticket - Soft Shadow Layer */}
        <path
          d="M4 16C4 14.3431 5.34315 13 7 13H41C42.6569 13 44 14.3431 44 16V20.5C42.6193 20.5 41.5 21.6193 41.5 23C41.5 24.3807 42.6193 25.5 44 25.5V32C44 33.6569 42.6569 35 41 35H7C5.34315 35 4 33.6569 4 32V25.5C5.38071 25.5 6.5 24.3807 6.5 23C6.5 21.6193 5.38071 20.5 4 20.5V16Z"
          fill="#d67618"
          opacity="0.3"
        />

        {/* Main Ticket - 45 Degree Rotation with Details */}
        <g transform="rotate(45 24 24)">
          {/* Main Body */}
          <path
            d="M4 14C4 11.7909 5.79086 10 8 10H40C42.2091 10 44 11.7909 44 14V19.5C42.6193 19.5 41.5 20.6193 41.5 22C41.5 23.3807 42.6193 24.5 44 24.5V34C44 36.2091 42.2091 38 40 38H8C5.79086 38 4 36.2091 4 34V24.5C5.38071 24.5 6.5 23.3807 6.5 22C6.5 20.6193 5.38071 19.5 4 19.5V14Z"
            fill="url(#ticketGradient)"
          />

          {/* Shine Effect Overlay */}
          <rect
            x="-20" y="10" width="30" height="28"
            fill="url(#shineGradient)"
            mask="url(#ticketMask)"
            className="animate-shine"
          />

          {/* Perforations (Circles instead of dots) */}
          <g fill="white" fillOpacity="0.4">
            <circle cx="15" cy="13" r="0.8" />
            <circle cx="15" cy="16.5" r="0.8" />
            <circle cx="15" cy="20" r="0.8" />
            <circle cx="15" cy="24" r="0.8" />
            <circle cx="15" cy="27.5" r="0.8" />
            <circle cx="15" cy="31" r="0.8" />
            <circle cx="15" cy="35" r="0.8" />
          </g>

          {/* Micro-Details: Simulated Text Lines */}
          <g stroke="white" strokeWidth="0.8" strokeLinecap="round" strokeOpacity="0.3">
            <line x1="20" y1="16" x2="32" y2="16" />
            <line x1="20" y1="19" x2="28" y2="19" />
          </g>

          {/* Simulated Barcode */}
          <g fill="white" fillOpacity="0.3">
            <rect x="33" y="28" width="1" height="6" />
            <rect x="35" y="28" width="1.5" height="6" />
            <rect x="37.5" y="28" width="0.8" height="6" />
            <rect x="39.3" y="28" width="1.2" height="6" />
          </g>

          {/* Central Winning Star */}
          <path
            d="M24 18L25.3 21.5L29 22L26.2 24.5L27 28L24 26.2L21 28L21.8 24.5L19 22L22.7 21.5L24 18Z"
            fill="white"
            className="animate-pulse shadow-glow"
          />
        </g>
      </svg>
      
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-6px) rotate(1deg); }
        }
        @keyframes shine {
          0% { transform: translateX(-40px) skewX(-20deg); }
          30%, 100% { transform: translateX(80px) skewX(-20deg); }
        }
        .animate-float {
          animation: float 5s ease-in-out infinite;
        }
        .animate-shine {
          animation: shine 4s cubic-bezier(0.4, 0, 0.2, 1) infinite;
        }
        .shadow-glow {
          filter: drop-shadow(0 0 4px rgba(255, 255, 255, 0.8));
        }
        .group:hover svg {
          filter: brightness(1.1) saturate(1.15);
          transform: scale(1.08) rotate(5deg);
        }
      `}</style>
    </div>
  );
};

export default Logo;
