
'use client';

import { cn } from '@/lib/utils';
import { Check } from 'lucide-react';

const SuccessAnimation = ({ className }: { className?: string }) => {
  return (
    <div className={cn("flex flex-col items-center justify-center", className)}>
      <svg
        className="animate-success-stroke"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 52 52"
        width="80"
        height="80"
      >
        <circle
          className="animate-success-circle"
          cx="26"
          cy="26"
          r="25"
          fill="none"
          stroke="hsl(var(--primary))"
          strokeWidth="2"
        />
        <path
          className="animate-success-check"
          fill="none"
          stroke="hsl(var(--primary))"
          strokeWidth="2"
          strokeLinecap="round"
          d="M14 27l5.2 5.2L38 20"
        />
      </svg>
    </div>
  );
};

export default SuccessAnimation;
