import React from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Cell,
} from 'recharts';

function CustomTooltip({ active, payload, label }) {
  if (active && payload && payload.length) {
    return (
      <div className="bg-[#1c1b30] border border-[#282646] p-3 rounded-xl shadow-xl text-xs">
        <p className="font-semibold text-white mb-1">Class {label}</p>
        <p className="text-[#8b85ff] font-medium">
          Average Marks: <span className="font-bold text-white">{payload[0].value}%</span>
        </p>
      </div>
    );
  }
  return null;
}

export default function ClassAverageChart({ data = [] }) {
  return (
    <div className="w-full h-[260px]">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          margin={{ top: 10, right: 10, left: -20, bottom: 5 }}
        >
          <CartesianGrid
            strokeDasharray="3 3"
            stroke="#282646"
            vertical={false}
          />
          <XAxis
            dataKey="class"
            stroke="#9490b8"
            fontSize={12}
            tickLine={false}
            axisLine={{ stroke: '#282646' }}
          />
          <YAxis
            domain={[0, 100]}
            stroke="#9490b8"
            fontSize={12}
            tickLine={false}
            axisLine={{ stroke: '#282646' }}
            tickFormatter={(val) => `${val}%`}
          />
          <Tooltip content={<CustomTooltip />} />
          <Bar
            dataKey="average"
            fill="#8b85ff"
            radius={[6, 6, 0, 0]}
            maxBarSize={48}
          >
            {data.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill="#8b85ff"
                className="hover:opacity-85 transition-opacity"
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
