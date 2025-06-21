'use client'

import React from 'react';
import styles from './AdminDashboard.module.css'; // Use the main dashboard styles

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  color: 'blue' | 'green' | 'yellow' | 'purple';
}

const StatsCard: React.FC<StatsCardProps> = ({ title, value, icon, color }) => {
  const cardStyle = `${styles.card} flex items-center p-4`;
  const iconStyle = `${styles.cardIcon} ${styles[color]} mr-4`;

  return (
    <div className={cardStyle}>
      <div className={iconStyle}>{icon}</div>
      <div>
        <p className="text-sm text-gray-500 font-medium">{title}</p>
        <p className="text-2xl font-bold text-gray-800">{value}</p>
      </div>
    </div>
  );
};

export default StatsCard; 