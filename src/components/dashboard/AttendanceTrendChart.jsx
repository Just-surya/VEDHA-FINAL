import React from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';

function CustomTooltip({ active, payload, label }) {
  if (active && payload && payload.length) {
    return (
      <div className="bg-[#1c1b30] border border-[#282646] p-3 rounded-xl shadow-xl text-xs">
        <p className="font-semibold text-white mb-1">Month: {label}</p>
        <p className="text-[#8b85ff] font-medium flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-[#f59e0b]" />
          Attendance: <span className="font-bold text-white">{payload[0].value}%</span>
        </p>
      </div>
    );
  }
  return null;
}

export default function AttendanceTrendChart({ data = [] }) {
  return (
    <div className="w-full h-[260px]">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={data}
          margin={{ top: 10, right: 15, left: -20, bottom: 5 }}
        >
          <CartesianGrid
            strokeDasharray="3 3"
            stroke="#282646"
            vertical={false}
          />
          <XAxis
            dataKey="month"
            stroke="#9490b8"
            fontSize={12}
            tickLine={false}
            axisLine={{ stroke: '#282646' }}
          />
          <YAxis
            domain={[80, 100]}
            stroke="#9490b8"
            fontSize={12}
            tickLine={false}
            axisLine={{ stroke: '#282646' }}
            tickFormatter={(val) => `${val}%`}
          />
          <Tooltip content={<CustomTooltip />} />
          <Line
            type="monotone"
            dataKey="attendance"
            stroke="#8b85ff"
            strokeWidth={3}
            dot={{
              r: 5,
              fill: '#f59e0b',
              stroke: '#1c1b30',
              strokeWidth: 2,
            }}
            activeDot={{
              r: 7,
              fill: '#f59e0b',
              stroke: '#ffffff',
              strokeWidth: 2,
            }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
