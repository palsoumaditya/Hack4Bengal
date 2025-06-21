'use client';

import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface RevenueData {
  month: string;
  revenue: number;
}

interface RevenueChartProps {
  data: RevenueData[];
}

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="p-3 bg-white rounded-lg shadow-lg border border-gray-200">
        <p className="font-bold text-gray-800">{`${label}`}</p>
        <p className="text-sm text-green-600">{`Revenue: $${payload[0].value.toLocaleString()}`}</p>
      </div>
    );
  }
  return null;
};

export default function RevenueChart({ data }: RevenueChartProps) {
  if (!data || !Array.isArray(data) || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-500">
        <p>No revenue data available.</p>
      </div>
    );
  }

  const formatYAxis = (tickItem: number) => {
    return `$${(tickItem / 1000)}k`;
  };

  return (
    <ResponsiveContainer width="100%" height={300}>
      <AreaChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
        <defs>
          <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#10b981" stopOpacity={0.8}/>
            <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" vertical={false} />
        <XAxis 
          dataKey="month" 
          stroke="#9ca3af"
          fontSize={12}
          tickLine={false}
          axisLine={false}
        />
        <YAxis 
          stroke="#9ca3af"
          fontSize={12}
          tickLine={false}
          axisLine={false}
          tickFormatter={formatYAxis}
        />
        <Tooltip content={<CustomTooltip />} />
        <Area 
          type="monotone" 
          dataKey="revenue" 
          stroke="#10b981" 
          strokeWidth={3}
          fillOpacity={1} 
          fill="url(#colorRevenue)"
          activeDot={{ r: 8, strokeWidth: 2 }}
          animationDuration={1500}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
} 