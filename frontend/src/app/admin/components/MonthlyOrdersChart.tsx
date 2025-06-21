'use client';

import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface OrdersData {
  month: string;
  orders: number;
}

interface MonthlyOrdersChartProps {
  data: OrdersData[];
}

const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="p-3 bg-white rounded-lg shadow-lg border border-gray-200">
          <p className="font-bold text-gray-800">{label}</p>
          <p className="text-sm text-blue-600">{`Orders: ${payload[0].value}`}</p>
        </div>
      );
    }
    return null;
  };
  
  const getPath = (x, y, width, height) => {
    const radius = 6;
    return `M${x},${y + height}
            L${x},${y + radius}
            A${radius},${radius},0,0,1,${x + radius},${y}
            L${x + width - radius},${y}
            A${radius},${radius},0,0,1,${x + width},${y + radius}
            L${x + width},${y + height}
            Z`;
  };
  
  const RoundedBar = (props) => {
    const { fill, x, y, width, height } = props;
    return <path d={getPath(x, y, width, height)} stroke="none" fill={fill} />;
  };

export default function MonthlyOrdersChart({ data }: MonthlyOrdersChartProps) {
  if (!data || data.length === 0) {
    return <p className="text-center text-gray-500">No order data available.</p>;
  }

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" vertical={false}/>
        <XAxis dataKey="month" stroke="#9ca3af" fontSize={12} tickLine={false} axisLine={false} />
        <YAxis stroke="#9ca3af" fontSize={12} tickLine={false} axisLine={false} />
        <Tooltip content={<CustomTooltip />} cursor={{fill: 'rgba(239, 246, 255, 0.5)'}} />
        <Bar 
            dataKey="orders" 
            fill="#3b82f6" 
            shape={<RoundedBar />} 
            animationDuration={1500}
        />
      </BarChart>
    </ResponsiveContainer>
  );
} 