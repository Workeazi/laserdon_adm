import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../../services/authService';
import { dashboardService } from '../../services/dashboardService';
import { supabase } from '../../config/supabaseClient';
import { features } from '../../config/features';
import { Box, Typography, CircularProgress } from '@mui/material';
import { 
 PeopleAlt, 
 Storefront, 
 AccountBalanceWallet,
 Receipt,
 PendingActions,
 CheckCircle,
 Cancel,
 Description
} from '@mui/icons-material';

import PageHeader from '../../components/common/PageHeader';
import StatCard from '../../components/common/StatCard';
import LineChartWidget from '../../components/charts/LineChartWidget';
import BarChartWidget from '../../components/charts/BarChartWidget';
import DonutChartWidget from '../../components/charts/DonutChartWidget';
import HorizontalBarChartWidget from '../../components/charts/HorizontalBarChartWidget';
import ComposedChartWidget from '../../components/charts/ComposedChartWidget';
import PendingVendorQueue from './components/PendingVendorQueue';

const DashboardPage = () => {
 const navigate = useNavigate();
 const currentAdmin = authService.getCurrentAdmin();
 const isMasterAdmin = currentAdmin?.role === 'master_admin';
 const role = currentAdmin?.role || 'sub_admin';

 const [stats, setStats] = useState(null);
 const [chartData, setChartData] = useState(null);
 const [loading, setLoading] = useState(true);

 const fetchDashboardData = async () => {
 try {
 const [statsData, chartDataRes] = await Promise.all([
 dashboardService.getDashboardStats(role),
 dashboardService.getChartData(role)
 ]);
 setStats(statsData);
 setChartData(chartDataRes);
 } catch (error) {
 console.error("Error loading dashboard data:", error);
 } finally {
 setLoading(false);
 }
 };

 useEffect(() => {
 fetchDashboardData();

 const vendorsSubscription = supabase
 .channel('public:vendors')
 .on('postgres_changes', { event: '*', schema: 'public', table: 'vendors' }, () => {
 fetchDashboardData();
 })
 .subscribe();

 return () => {
 supabase.removeChannel(vendorsSubscription);
 };
 }, [role]);

 if (loading || !stats || !chartData) {
 return (
 <Box className="flex items-center justify-center h-full min-h-[400px]">
 <CircularProgress />
 </Box>
 );
 }

 return (
 <Box className="pb-8 space-y-8">
 <PageHeader 
 title="Dashboard" 
 breadcrumbs={[{ label: 'Dashboard' }]} 
 />

 {/* KPI Cards */}
 <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" data-purpose="metrics-overview">
 {/* Common KPI */}
 <div className="cursor-pointer" onClick={() => navigate('/vendors')}>
 <StatCard title="Total Vendors" value={stats.totalVendors || 0} icon={<Storefront />} color="#3B82F6" />
 </div>
 <div className="cursor-pointer" onClick={() => navigate('/vendors?status=pending')}>
 <StatCard title="Pending Vendors" value={stats.pendingVendors || 0} icon={<PendingActions />} color="#F59E0B" />
 </div>
 <div className="cursor-pointer" onClick={() => navigate('/vendors?status=approved')}>
 <StatCard title="Approved Vendors" value={stats.approvedVendors || 0} icon={<CheckCircle />} color="#10B981" />
 </div>
 <div className="cursor-pointer" onClick={() => navigate('/vendors?status=rejected')}>
 <StatCard title="Rejected Vendors" value={stats.rejectedVendors || 0} icon={<Cancel />} color="#EF4444" />
 </div>
 <div className="cursor-pointer" onClick={() => navigate('/verify-docs')}>
 <StatCard title="Pending Document Verifications" value={stats.pendingDocuments || 0} icon={<Description />} color="#8B5CF6" />
 </div>

 {/* Master Admin Specific KPI */}
 {isMasterAdmin && (
 <>
 <div className="cursor-pointer" onClick={() => navigate('/payments')}>
 <StatCard title="Total Revenue" value={`₹${(stats.totalRevenue || 0).toLocaleString()}`} icon={<AccountBalanceWallet />} color="#8B5CF6" />
 </div>
 <div className="cursor-pointer" onClick={() => navigate('/payments')}>
 <StatCard title="Total Payments" value={stats.totalPayments || 0} icon={<Receipt />} color="#6366F1" />
 </div>
 </>
 )}

 {/* Sub Admin Specific KPI */}
 </section>

 {/* Master Admin Charts */}
 {isMasterAdmin && (
 <>
  <section className="grid grid-cols-1 lg:grid-cols-3 gap-6" data-purpose="master-charts-row-1">
    <div className="lg:col-span-1 h-[400px]">
      <DonutChartWidget title="Vendor Status Distribution" data={chartData.vendorStatusDistribution || []} colors={['#10B981', '#F59E0B', '#EF4444', '#64748B']} />
    </div>
    <div className="lg:col-span-2 h-[400px]">
      <BarChartWidget title="Monthly Vendor Registrations" data={chartData.monthlyVendorRegistrations || []} dataKey={['vendors']} barColors={['#3B82F6']} />
    </div>
  </section>

  <section className="grid grid-cols-1 lg:grid-cols-2 gap-6" data-purpose="master-charts-row-2">
    <div className="h-[400px]">
      <LineChartWidget title="Vendor Approval Performance" data={chartData.vendorActivityTrend || []} dataKey={['approved', 'rejected', 'pending']} lineColors={['#10B981', '#EF4444', '#F59E0B']} />
    </div>
    <div className="h-[400px]">
      <HorizontalBarChartWidget title="Top Vendors by Revenue" data={chartData.topVendorsByRevenue || []} dataKey="revenue" barColor="#6366F1" />
    </div>
  </section>

  <section className="grid grid-cols-1 lg:grid-cols-3 gap-6" data-purpose="master-charts-row-3">
    <div className="lg:col-span-2 h-[400px]">
      <ComposedChartWidget title="Vendor Growth vs Revenue Growth" data={chartData.growthComparison || []} barDataKey="vendors" lineDataKey="revenue" />
    </div>
    <div className="lg:col-span-1 h-[400px]">
      <LineChartWidget title="Revenue Trend" data={chartData.revenueTrend || []} dataKey={['revenue']} lineColors={['#8B5CF6']} />
    </div>
  </section>

  <section className="grid grid-cols-1 gap-6 mt-6" data-purpose="master-queue">
    <div className="min-h-[300px]">
      <PendingVendorQueue vendors={chartData.pendingVendorQueue || []} />
    </div>
  </section>
 </>
 )}

 {/* Sub Admin Charts */}
 {!isMasterAdmin && (
 <>
  <section className="grid grid-cols-1 lg:grid-cols-2 gap-6" data-purpose="sub-charts-row-1">
    <div className="h-[400px]">
      <DonutChartWidget title="Vendor Status Distribution" data={chartData.vendorStatusDistribution || []} colors={['#10B981', '#F59E0B', '#EF4444']} />
    </div>
    <div className="h-[400px]">
      <DonutChartWidget title="Document Verification Status" data={chartData.documentVerificationStatus || []} colors={['#10B981', '#F59E0B', '#EF4444']} />
    </div>
  </section>

  <section className="grid grid-cols-1 lg:grid-cols-3 gap-6" data-purpose="sub-charts-row-2">
    <div className="lg:col-span-2 h-[400px]">
      <LineChartWidget title="Vendor Activity Trend" data={chartData.vendorActivityTrend || []} dataKey={['new', 'approved', 'rejected']} lineColors={['#3B82F6', '#10B981', '#EF4444']} />
    </div>
    <div className="lg:col-span-1 h-[400px]">
      <BarChartWidget title="Vendor Registration Trend" data={chartData.monthlyVendorRegistrations || []} dataKey={['vendors']} barColors={['#3B82F6']} />
    </div>
  </section>

  <section className="grid grid-cols-1 gap-6 mt-6" data-purpose="sub-queue">
    <div className="min-h-[300px]">
      <PendingVendorQueue vendors={chartData.pendingVendorQueue || []} />
    </div>
  </section>
 </>
 )}

 </Box>
 );
};

export default DashboardPage;


