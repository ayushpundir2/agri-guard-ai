import React from 'react';

interface RiskGaugeProps {
  score: number; // 0-100
  level: string; // LOW, MODERATE, HIGH, CRITICAL
}

export default function RiskGauge({ score, level }: RiskGaugeProps) {
  const radius = 42;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  let colorClass = 'stroke-emerald-400 text-emerald-400';
  let bgGlow = 'from-emerald-500/10';

  if (level === 'CRITICAL') {
    colorClass = 'stroke-red-500 text-red-400';
    bgGlow = 'from-red-500/20';
  } else if (level === 'HIGH') {
    colorClass = 'stroke-orange-500 text-orange-400';
    bgGlow = 'from-orange-500/20';
  } else if (level === 'MODERATE') {
    colorClass = 'stroke-amber-400 text-amber-400';
    bgGlow = 'from-amber-500/15';
  }

  return (
    <div className={`relative flex items-center justify-center p-2 rounded-full bg-gradient-to-b ${bgGlow} to-transparent`}>
      <svg className="w-28 h-28 transform -rotate-90">
        {/* Background track */}
        <circle
          cx="56"
          cy="56"
          r={radius}
          className="stroke-slate-800"
          strokeWidth="8"
          fill="transparent"
        />
        {/* Animated fill indicator */}
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
      {/* Center score label */}
      <div className="absolute flex flex-col items-center justify-center text-center">
        <span className="text-2xl font-bold font-mono text-white leading-none">
          {score}
        </span>
        <span className="text-[9px] uppercase tracking-wider text-slate-400 font-semibold mt-0.5">
          / 100
        </span>
      </div>
    </div>
  );
}
