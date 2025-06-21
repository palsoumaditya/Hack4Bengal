'use client';

import React, { useState, useEffect } from 'react';
import {
  Users,
  TrendingUp,
  DollarSign,
  ShoppingCart,
  Award,
  AlertTriangle,
  Calendar,
  BarChart3,
  LayoutDashboard,
  FileText,
  Settings,
  Bell,
  MessageSquare,
  Shield,
} from 'lucide-react';

import styles from './AdminDashboard.module.css';

import StatsCard from './StatsCard';
import WorkerList from './WorkerList';
import RevenueChart from './RevenueChart';
import MonthlyOrdersChart from './MonthlyOrdersChart';
import TopWorkersChart from './TopWorkersChart';
import ComplaintsList from './ComplaintsList';
import DiscountStats from './DiscountStats';

// Mock data - replace with actual API calls
const mockData = {
  totalWorkers: 45,
  avgIncome: 8500,
  highestIncome: 15000,
  monthlyOrders: 234,
  totalRevenue: 125000,
  totalDiscounts: 8500,
  topWorkers: [
    { name: 'John Doe', income: 15000, orders: 45 },
    { name: 'Jane Smith', income: 14200, orders: 42 },
    { name: 'Mike Johnson', income: 13800, orders: 38 },
    { name: 'Sarah Wilson', income: 13200, orders: 35 },
    { name: 'David Brown', income: 12800, orders: 32 }
  ],
  complaints: [
    { id: 1, workerName: 'John Doe', issue: 'Late arrival', status: 'Resolved' as const, date: '2024-01-15' },
    { id: 2, workerName: 'Mike Johnson', issue: 'Poor service quality', status: 'Pending' as const, date: '2024-01-14' },
    { id: 3, workerName: 'Sarah Wilson', issue: 'Equipment damage', status: 'Under Review' as const, date: '2024-01-13' }
  ],
  monthlyRevenue: [
    { month: 'Jan', revenue: 120000 },
    { month: 'Feb', revenue: 135000 },
    { month: 'Mar', revenue: 142000 },
    { month: 'Apr', revenue: 138000 },
    { month: 'May', revenue: 145000 },
    { month: 'Jun', revenue: 152000 }
  ],
  monthlyOrdersData: [
    { month: 'Jan', orders: 210 },
    { month: 'Feb', orders: 225 },
    { month: 'Mar', orders: 240 },
    { month: 'Apr', orders: 235 },
    { month: 'May', orders: 250 },
    { month: 'Jun', orders: 265 }
  ]
};

const Sidebar = () => (
  <aside className={styles.sidebar}>
    <h2><Shield />Admin Panel</h2>
    <nav className={styles.nav}>
      <a href="#" className={styles.active}><LayoutDashboard />Dashboard</a>
      <a href="#"><Users />Workers</a>
      <a href="#"><FileText />Reports</a>
      <a href="#"><MessageSquare />Complaints</a>
      <a href="#"><Settings />Settings</a>
    </nav>
  </aside>
);

const MainContent = ({ data }) => (
  <main className={styles.mainContent}>
    <div className={styles.statsGrid}>
      <StatsCard title="Total Workers" value={data.totalWorkers} icon={<Users />} color="blue" />
      <StatsCard title="Avg Income" value={`$${data.avgIncome.toLocaleString()}`} icon={<TrendingUp />} color="green" />
      <StatsCard title="Highest Income" value={`$${data.highestIncome.toLocaleString()}`} icon={<DollarSign />} color="yellow" />
      <StatsCard title="Monthly Orders" value={data.monthlyOrders} icon={<ShoppingCart />} color="purple" />
    </div>

    <div className={styles.chartGrid}>
      <div className={styles.card}>
        <div className={styles.cardHeader}>
          <h2 className={styles.cardTitle}>Revenue Overview</h2>
          <span className="text-2xl font-bold text-green-600">${data.totalRevenue.toLocaleString()}</span>
        </div>
        <RevenueChart data={data.monthlyRevenue} />
      </div>
      <div className={styles.card}>
        <div className={styles.cardHeader}>
            <h2 className={styles.cardTitle}>Top Workers</h2>
            <Award className="h-5 w-5 text-yellow-500" />
        </div>
        <TopWorkersChart data={data.topWorkers} />
      </div>
    </div>
    
    <div className={styles.chartGrid}>
        <div className={styles.card}>
            <div className={styles.cardHeader}>
                <h2 className={styles.cardTitle}>Monthly Orders</h2>
                <Calendar className="h-5 w-5 text-blue-500" />
            </div>
            <MonthlyOrdersChart data={data.monthlyOrdersData} />
        </div>
        <div className={styles.card}>
            <div className={styles.cardHeader}>
                <h2 className={styles.cardTitle}>Discounts</h2>
                <BarChart3 className="h-5 w-5 text-red-500" />
            </div>
            <DiscountStats totalDiscounts={data.totalDiscounts} />
        </div>
    </div>

    <div className={`${styles.card} ${styles.tableContainer} mt-8`}>
        <div className={styles.cardHeader}>
            <h2 className={styles.cardTitle}>Worker Details</h2>
            <Users className="h-5 w-5 text-blue-500"/>
        </div>
      <WorkerList workers={data.topWorkers} />
    </div>

    <div className={`${styles.card} ${styles.tableContainer} mt-8`}>
        <div className={styles.cardHeader}>
            <h2 className={styles.cardTitle}>Recent Complaints</h2>
            <AlertTriangle className="h-5 w-5 text-red-500"/>
        </div>
      <ComplaintsList complaints={data.complaints} />
    </div>
  </main>
);

export default function AdminDashboard() {
  const [data, setData] = useState(mockData);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    try {
      setTimeout(() => {
        setData(mockData);
        setLoading(false);
      }, 500);
    } catch (err) {
      setError('Failed to load dashboard data');
      setLoading(false);
    }
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="animate-spin rounded-full h-24 w-24 border-t-4 border-b-4 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-red-50">
        <div className="text-center p-8 border border-red-200 rounded-lg shadow-md">
          <AlertTriangle className="h-12 w-12 mx-auto mb-4 text-red-500" />
          <p className="text-red-700 font-semibold text-lg">{error}</p>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <p className="text-gray-500 text-xl">No data available to display.</p>
        </div>
    )
  }

  return (
    <div className={styles.dashboard}>
      <Sidebar />
      <MainContent data={data} />
    </div>
  );
} 