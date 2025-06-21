'use client';

import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

interface WorkerData {
  name: string;
  income: number;
}

interface TopWorkersChartProps {
  data: WorkerData[];
}

const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff8042', '#0088fe'];

const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="p-3 bg-white rounded-lg shadow-lg border border-gray-200">
          <p className="font-bold text-gray-800">{`${payload[0].payload.name}`}</p>
          <p className="text-sm" style={{color: payload[0].fill}}>{`Income: $${payload[0].value.toLocaleString()}`}</p>
        </div>
      );
    }
    return null;
};

export default function TopWorkersChart({ data }: TopWorkersChartProps) {
  if (!data || data.length === 0) {
    return <p className="text-center text-gray-500">No worker data available.</p>;
  }
  
  const sortedData = [...data].sort((a, b) => a.income - b.income);

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={sortedData} layout="vertical" margin={{ top: 10, right: 30, left: 20, bottom: 10 }}>
        <XAxis type="number" hide />
        <YAxis 
            dataKey="name" 
            type="category" 
            stroke="#9ca3af" 
            fontSize={12} 
            tickLine={false} 
            axisLine={false}
            width={80}
        />
        <Tooltip content={<CustomTooltip />} cursor={{fill: 'rgba(241, 245, 249, 0.5)'}} />
        <Bar dataKey="income" background={{ fill: '#f1f5f9' }} animationDuration={1500}>
            {sortedData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
} 