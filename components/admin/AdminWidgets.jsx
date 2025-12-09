
import React from 'react';
import { ArrowUp, ArrowDown } from 'lucide-react';
import { motion } from 'framer-motion';

export const KpiCard = ({ title, value, trend, icon, color }) => {
  const trendIcon = trend.startsWith('+') ? <ArrowUp size={14} /> : <ArrowDown size={14} />;
  const trendColor = trend.startsWith('+') ? 'text-green-400' : 'text-red-400';

  return (
    <div className={`relative p-6 rounded-[2rem] border border-gray-200 dark:border-white/5 shadow-lg bg-white dark:bg-[#121212] overflow-hidden`}>
      <div className={`absolute top-0 left-0 h-2 ${color} w-1/3`}></div>
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">{title}</p>
          <p className="text-3xl font-black text-gray-900 dark:text-white">{value}</p>
        </div>
        {icon && <div className={`p-3 rounded-xl ${color}/10`}>{React.cloneElement(icon, { className: `text-white ${color}` })}</div>}
      </div>
      {trend && (
        <div className={`mt-4 flex items-center gap-1 text-xs font-bold ${trendColor}`}>
          {trendIcon} {trend} vs last month
        </div>
      )}
    </div>
  );
};

export const SimpleBarChart = ({ data, color }) => (
  <div className="w-full h-full flex items-end justify-between gap-2 px-2">
    {data.map((d, i) => (
      <motion.div
        key={i}
        initial={{ height: 0 }}
        animate={{ height: `${d.value}%` }}
        className={`w-full rounded-t-md opacity-80 hover:opacity-100 transition-opacity ${color || 'bg-purple-500'}`}
        title={`${d.label}: ${d.value}`}
      />
    ))}
  </div>
);
