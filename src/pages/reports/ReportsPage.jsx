import React, { useState, useEffect } from 'react';
import { Box, Card, CardContent, Typography, Tabs, Tab, Button, CircularProgress } from '@mui/material';
import { Download } from '@mui/icons-material';
import PageHeader from '../../components/common/PageHeader';
import StatCard from '../../components/common/StatCard';
import LineChartWidget from '../../components/charts/LineChartWidget';
import DataTable from '../../components/common/DataTable';
import StatusBadge from '../../components/common/StatusBadge';
import { supabase } from '../../config/supabaseClient';
import Papa from 'papaparse';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import toast from 'react-hot-toast';

const ReportsPage = () => {
 const [tabValue, setTabValue] = useState(0);
 const [loading, setLoading] = useState(true);
 
 // Data States
 const [totalRevenue, setTotalRevenue] = useState(0);
 const [revenueTrend, setRevenueTrend] = useState([]);
 const [topVendors, setTopVendors] = useState([]);
 const [allVendorsList, setAllVendorsList] = useState([]);

 useEffect(() => {
 const fetchReportData = async () => {
 setLoading(true);
 try {
 const { data, error } = await supabase
 .from('vendors')
 .select(`
 id,
 username,
 companies (id, short_name, company_address, company_gst_number),
 status,
 payments (
 amount,
 payment_date,
 created_at,
 payment_status
 )
 `);

 console.log('Payments Data:', data);
 console.log('Payments Error:', error);

 if (error) throw error;

 // Debugging logs requested by user
 const allPayments = data?.flatMap(v => v.payments || []) || [];
 const revenuePayments = allPayments.filter(p => p.payment_status === 'paid' || p.payment_status === 'completed');
 console.log('Payments:', allPayments);
 console.log('Revenue Payments:', revenuePayments);
 console.log('Statuses:', allPayments.map(p => p.payment_status));

 let total = 0;
 const trendMap = {};
 const allVendors = [];

 data?.forEach(vendor => {
 let vRev = 0;
 
 // Filter payments to only include 'paid' or 'completed'
 const validPayments = vendor.payments?.filter(p => p.payment_status === 'paid' || p.payment_status === 'completed') || [];
 const vCount = validPayments.length;

 validPayments.forEach(payment => {
 const amt = Number(payment.amount) || 0;
 vRev += amt;
 total += amt;

 // Group by Month for Trend
 const date = new Date(payment.payment_date || payment.created_at);
 const monthYear = date.toLocaleString('default', { month: 'short', year: 'numeric' });
 if (!trendMap[monthYear]) trendMap[monthYear] = 0;
 trendMap[monthYear] += amt;
 });

 allVendors.push({
 id: vendor.id,
 company_name: vendor.companies?.short_name || 'N/A',
 vendor_name: vendor.username || 'N/A',
 status: vendor.status || 'pending',
 total_revenue: vRev,
 payment_count: vCount
 });
 });

 setTotalRevenue(total);

 // Format Trend Data
 const sortedTrend = Object.entries(trendMap)
 .map(([name, revenue]) => ({ name, revenue }))
 .sort((a, b) => new Date(a.name) - new Date(b.name));
 setRevenueTrend(sortedTrend);

 // Format Vendor Lists
 const sortedAllVendors = [...allVendors].sort((a, b) => b.total_revenue - a.total_revenue);
 setAllVendorsList(sortedAllVendors);

 // Top Vendors for Revenue tab (only those with > 0 revenue)
 const activeVendors = sortedAllVendors.filter(v => v.total_revenue > 0);
 setTopVendors(activeVendors);

 console.log('Total Revenue:', total);
 console.log('Top Vendor Revenue:', activeVendors[0]?.total_revenue || 0);
 console.log('Active Vendors:', activeVendors);

 } catch (err) {
 console.error('Error fetching reports data:', err);
 } finally {
 setLoading(false);
 }
 };

 fetchReportData();
 }, []);

 const getExportData = () => {
 return tabValue === 0 ? topVendors : allVendorsList;
 };

 const handleExportCSV = () => {
 const exportData = getExportData();
 if (!exportData || exportData.length === 0) {
 toast.error('No report data available to export');
 return;
 }

 const csvData = exportData.map(v => ({
 'Company Name': v.company_name,
 'Vendor Name': v.vendor_name,
 'Total Revenue': v.total_revenue,
 'Transaction Count': v.payment_count,
 'Status': v.status
 }));

 const csv = Papa.unparse(csvData);
 const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
 const url = URL.createObjectURL(blob);
 const link = document.createElement('a');
 link.href = url;
 
 const date = new Date().toISOString().split('T')[0];
 link.setAttribute('download', `Vendor_Revenue_Report_${date}.csv`);
 document.body.appendChild(link);
 link.click();
 document.body.removeChild(link);
 };

 const handleExportPDF = () => {
 const exportData = getExportData();
 if (!exportData || exportData.length === 0) {
 toast.error('No report data available to export');
 return;
 }

 const doc = new jsPDF();
 const dateStr = new Date().toISOString().split('T')[0];
 const timeStr = new Date().toLocaleTimeString();

 // Header
 doc.setFontSize(20);
 doc.text('LaserDon Admin Dashboard', 14, 22);
 
 doc.setFontSize(14);
 doc.text('Vendor & Revenue Report', 14, 32);

 doc.setFontSize(10);
 doc.text(`Generated: ${dateStr} ${timeStr}`, 14, 40);

 // Summary Section
 doc.text(`Total Revenue: Rs. ${totalRevenue.toLocaleString()}`, 14, 50);
 doc.text(`Total Vendors: ${allVendorsList.length}`, 14, 56);
 doc.text(`Top Vendor Revenue: Rs. ${(topVendors[0]?.total_revenue || 0).toLocaleString()}`, 14, 62);

 // Table Section
 const tableColumn = ["Company Name","Vendor Name","Revenue","Transactions"];
 const tableRows = [];

 exportData.forEach(vendor => {
 const vendorData = [
 vendor.company_name,
 vendor.vendor_name,
 `Rs. ${vendor.total_revenue.toLocaleString()}`,
 vendor.payment_count
 ];
 tableRows.push(vendorData);
 });

 autoTable(doc, {
 startY: 70,
 head: [tableColumn],
 body: tableRows,
 });

 // Footer
 const pageCount = doc.internal.getNumberOfPages();
 for (let i = 1; i <= pageCount; i++) {
 doc.setPage(i);
 doc.setFontSize(8);
 doc.text('Generated from LaserDon Admin Panel', 14, doc.internal.pageSize.height - 10);
 }

 doc.save(`Vendor_Revenue_Report_${dateStr}.pdf`);
 };

 const renderRevenueTab = () => {
 if (loading) {
 return (
 <Box className="flex items-center justify-center h-64">
 <CircularProgress />
 </Box>
 );
 }

 return (
 <Box className="space-y-6">
 <div className="flex justify-end space-x-3 mb-4">
 <Button variant="outlined" startIcon={<Download />} size="small" onClick={handleExportCSV}>Export CSV</Button>
 <Button variant="outlined" startIcon={<Download />} size="small" onClick={handleExportPDF}>Export PDF</Button>
 </div>

 <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
 <StatCard title="Total Revenue" value={`₹${totalRevenue.toLocaleString()}`} color="#2563EB" />
 <StatCard title="Top Vendor Revenue" value={`₹${(topVendors[0]?.total_revenue || 0).toLocaleString()}`} color="#10B981" />
 <StatCard title="Active Revenue Vendors" value={topVendors.length} color="#F59E0B" />
 </div>

 <div className="h-96">
 <LineChartWidget 
 title="Revenue Trend" 
 data={revenueTrend} 
 dataKey={['revenue']} 
 lineColors={['#10B981']} 
 />
 </div>

 <Card className="rounded-card border border-borderLight shadow-sm mt-6">
 <CardContent className="p-6">
 <Typography variant="h6" className="font-bold mb-4">Top Vendors by Revenue</Typography>
 <DataTable 
 columns={[
 { field: 'company_name', headerName: 'Company Name' },
 { field: 'vendor_name', headerName: 'Vendor Name' },
 { field: 'payment_count', headerName: 'Transactions' },
 { field: 'total_revenue', headerName: 'Total Revenue', renderCell: (r) => `₹${r.total_revenue.toLocaleString()}` },
 ]}
 data={topVendors}
 />
 </CardContent>
 </Card>
 </Box>
 );
 };

 const renderVendorTab = () => {
 if (loading) {
 return (
 <Box className="flex items-center justify-center h-64">
 <CircularProgress />
 </Box>
 );
 }

 return (
 <Box className="space-y-6">
 <div className="flex justify-end space-x-3 mb-4">
 <Button variant="outlined" startIcon={<Download />} size="small" onClick={handleExportCSV}>Export CSV</Button>
 <Button variant="outlined" startIcon={<Download />} size="small" onClick={handleExportPDF}>Export PDF</Button>
 </div>

 <Card className="rounded-card border border-borderLight shadow-sm mt-6">
 <CardContent className="p-6">
 <Typography variant="h6" className="font-bold mb-4">Vendor Directory & Performance</Typography>
 <DataTable 
 columns={[
 { field: 'company_name', headerName: 'Company Name' },
 { field: 'vendor_name', headerName: 'Vendor Name' },
 { field: 'total_revenue', headerName: 'Total Revenue', renderCell: (r) => `₹${r.total_revenue.toLocaleString()}` },
 { field: 'payment_count', headerName: 'Total Transactions' },
 { field: 'status', headerName: 'Status', renderCell: (r) => <StatusBadge status={r.status} module="vendor" /> },
 ]}
 data={allVendorsList}
 />
 </CardContent>
 </Card>
 </Box>
 );
 };

 return (
 <Box className="pb-8 space-y-6">
 <PageHeader 
 title="Reports & Analytics" 
 breadcrumbs={[{ label: 'Dashboard', path: '/' }, { label: 'Reports' }]} 
 />

 <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
 <Tabs value={tabValue} onChange={(e, v) => setTabValue(v)} aria-label="reports tabs">
 <Tab label="Revenue" sx={{ textTransform: 'none', fontWeight: 600 }} />
 <Tab label="Vendors" sx={{ textTransform: 'none', fontWeight: 600 }} />
 </Tabs>
 </Box>

 <Box className="pt-4">
 {tabValue === 0 && renderRevenueTab()}
 {tabValue === 1 && renderVendorTab()}
 </Box>
 </Box>
 );
};

export default ReportsPage;

