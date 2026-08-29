import React from 'react';

interface RiskGaugeProps {
  score: number; // 0-100
  level: string; // LOW, MODERATE, HIGH, CRITICAL
}

export default function RiskGauge({ score, level }: RiskGaugeProps) {
  const radius = 42;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  let colorClass = 'stroke-civic-leaf text-civic-leaf';
  let bgGlow = 'from-civic-leaf/10';

  if (level === 'CRITICAL') {
    colorClass = 'stroke-civic-red text-civic-red';
    bgGlow = 'from-civic-red/15';
  } else if (level === 'HIGH') {
    colorClass = 'stroke-civic-terracotta text-civic-terracotta';
    bgGlow = 'from-civic-terracotta/15';
  } else if (level === 'MODERATE') {
    colorClass = 'stroke-civic-saffron text-civic-saffron';
    bgGlow = 'from-civic-saffron/15';
  }

  return (
    <div className={`relative flex items-center justify-center p-2 rounded-full bg-gradient-to-b ${bgGlow} to-transparent`}>
      <svg className="w-28 h-28 transform -rotate-90">
        <circle
          cx="56"
          cy="56"
          r={radius}
          className="stroke-civic-neutral"
          strokeWidth="8"
          fill="transparent"
        />
        <circle
          cx="56"
          cy="56"
          r={radius}
          className={`${colorClass} transition-all duration-1000 ease-out`}
          strokeWidth="8"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          fill="transparent"
        />
      </svg>
      <div className="absolute flex flex-col items-center justify-center text-center">
        <span className="text-2xl font-bold font-mono text-civic-charcoal leading-none">
          {score}
        </span>
        <span className="text-[9px] uppercase tracking-wider text-civic-charcoal/60 font-semibold mt-0.5 font-mono">
          / 100
        </span>
      </div>
    </div>
  );
}
