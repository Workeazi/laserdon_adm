import React, { useState, useEffect } from 'react';
import { Box, Card, CardContent, Typography, Button, Tabs, Tab, Avatar, CircularProgress, LinearProgress, Divider } from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchVendorDetails, fetchVendorAnalytics, clearVendorData } from '../../store/slices/vendorSlice';
import PageHeader from '../../components/common/PageHeader';
import StatusBadge from '../../components/common/StatusBadge';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import { vendorService } from '../../services/vendorService';
import { authService } from '../../services/authService';
import LineChartWidget from '../../components/charts/LineChartWidget';
import PieChartWidget from '../../components/charts/PieChartWidget';
import StatCard from '../../components/common/StatCard';
import { AccountBalanceWallet, Handyman, Description, StarRate } from '@mui/icons-material';
import toast from 'react-hot-toast';

const VendorDetailPage = () => {
 const { id } = useParams();
 const navigate = useNavigate();
 const dispatch = useDispatch();
 
 const { currentVendor: vendor, analytics, loading, error } = useSelector((state) => state.vendor);
 
 const [tabValue, setTabValue] = useState(0);
 const [actionModal, setActionModal] = useState({ open: false, type: '' });
 const [rejectionReason, setRejectionReason] = useState('');
 
 const currentAdmin = authService.getCurrentAdmin();
 const isSuperAdmin = currentAdmin?.role === 'master_admin'; // Assuming 'master_admin' is Super Admin
 const isSubAdmin = !isSuperAdmin;

 useEffect(() => {
 dispatch(fetchVendorDetails(id));
 dispatch(fetchVendorAnalytics({ vendorId: id, isSuperAdmin }));
 
 return () => {
 dispatch(clearVendorData());
 };
 }, [id, dispatch, isSuperAdmin]);

 const handleStatusChange = async (newStatus) => {
 try {
 console.log('Reject Vendor ID:', vendor?.id);
 console.log('Rejection Reason:', rejectionReason);
 
 console.log('Vendor Object:', vendor);
 console.log('Vendor ID:', vendor?.id);
 console.log('Updating Vendor ID:', vendor?.id);
 console.log('New Status:', newStatus);

 await vendorService.updateVendorStatus(vendor.id, newStatus, currentAdmin?.id, rejectionReason);
 dispatch(fetchVendorDetails(id)); // Refresh vendor details
 setActionModal({ open: false, type: '' });
 setRejectionReason('');
 toast.success(`Vendor ${newStatus} successfully`);
 } catch (err) {
 console.error("Error updating status:", err);
 toast.error('Failed to update status');
 }
 };

 const handleDocumentAction = async () => {
 // Navigate to verify docs or handle doc verification
 navigate('/verify-docs');
 };

 const handleTabChange = (event, newValue) => {
 setTabValue(newValue);
 };

 if (loading && !vendor) {
 return <Box className="flex items-center justify-center h-[50vh]"><CircularProgress /></Box>;
 }

 if (error || !vendor) {
 return <Box className="p-8"><Typography>Vendor not found.</Typography></Box>;
 }

 console.log('Role:', currentAdmin?.role);
 console.log('Vendor:', vendor);
 console.log('Analytics Data:', analytics);
 console.log('Company:', vendor?.companies);
 console.log('Industry Data:', vendor?.industries);

 const renderAnalytics = () => {
 if (!analytics) return <CircularProgress />;
 
 const { kpis, charts } = analytics;

 return (
 <Box className="space-y-6">
 {/* KPI Row */}
 <div className={`grid grid-cols-1 md:grid-cols-3 ${isSuperAdmin ? 'lg:grid-cols-4' : 'lg:grid-cols-3'} gap-6`}>
 {isSuperAdmin && (
 <StatCard 
 title="Total Revenue" 
 value={`₹${(kpis.totalRevenue || 0).toLocaleString()}`} 
 icon={<AccountBalanceWallet />} 
 color="#2563EB" 
 />
 )}
 <StatCard 
 title="Submitted Quotations" 
 value={kpis.submittedQuotations} 
 icon={<Description />} 
 color="#3B82F6" 
 />
 <StatCard 
 title="Approved Quotations" 
 value={kpis.approvedQuotations} 
 icon={<Handyman />} 
 color="#10B981" 
 />
 <StatCard 
 title="Rejected Quotations" 
 value={kpis.rejectedQuotations} 
 icon={<StarRate />} 
 color="#EF4444" 
 />
 </div>

 {/* Charts Row */}
 <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
 {isSuperAdmin && (
 <div className="lg:col-span-3 h-[400px] mb-6">
 <LineChartWidget 
 title="Revenue Trend" 
 data={charts.revenueTrend} 
 dataKey={['revenue']} 
 lineColors={['#2563EB']} 
 />
 </div>
 )}
 
 <div className="lg:col-span-1 h-[400px]">
 <PieChartWidget 
 title="Quotation Status Distribution" 
 data={charts.quotationStatusDistribution} 
 colors={['#3B82F6', '#10B981', '#EF4444']} 
 />
 </div>

 <div className="lg:col-span-1 h-[400px]">
 <LineChartWidget 
 title="Quotation Trend" 
 data={charts.quotationTrend} 
 dataKey={['quotations']} 
 lineColors={['#8B5CF6']} 
 />
 </div>

 <div className="lg:col-span-1 h-[400px]">
 <Card className="rounded-card border border-borderLight shadow-sm h-full">
 <CardContent className="p-6 h-full flex flex-col">
 <Typography variant="h6" className="font-bold text-textPrimary mb-6">
 Quotation Conversion
 </Typography>
 
 <Box className="flex-1 flex flex-col justify-center space-y-6">
 <Box className="flex items-center justify-between text-center">
 <div>
 <Typography variant="h4" className="font-bold text-slate-800">{charts.quotationConversion.rate}%</Typography>
 <Typography variant="body2" className="text-slate-500 font-medium">Conversion Rate</Typography>
 </div>
 </Box>
 
 <Box>
 <Box className="flex justify-between mb-2">
 <Typography variant="body2" className="font-semibold text-slate-700">Accepted vs Received</Typography>
 <Typography variant="body2" className="text-slate-500">
 {charts.quotationConversion.accepted} / {charts.quotationConversion.received}
 </Typography>
 </Box>
 <LinearProgress 
 variant="determinate" 
 value={charts.quotationConversion.rate} 
 sx={{ height: 10, borderRadius: 5, backgroundColor: '#E2E8F0', '& .MuiLinearProgress-bar': { backgroundColor: '#10B981' } }} 
 />
 </Box>
 </Box>
 </CardContent>
 </Card>
 </div>
 </div>
 </Box>
 );
 };

 const renderOverview = () => (
 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
 {/* Profile Information */}
 <Card className="rounded-card shadow-sm border border-borderLight">
 <CardContent className="p-6">
 <Typography variant="h6" className="font-bold mb-4">Profile Information</Typography>
 <div className="space-y-3">
 <div className="flex justify-between border-b border-borderLight pb-2">
 <Typography variant="body2" className="text-textSecondary">Company Name</Typography>
 <Typography variant="body2" className="font-medium text-right ml-4">{vendor.companies?.short_name || 'N/A'}</Typography>
 </div>
 <div className="flex justify-between border-b border-borderLight pb-2">
 <Typography variant="body2" className="text-textSecondary">User Name</Typography>
 <Typography variant="body2" className="font-medium text-right ml-4">{vendor.username}</Typography>
 </div>
 <div className="flex justify-between border-b border-borderLight pb-2">
 <Typography variant="body2" className="text-textSecondary">Email</Typography>
 <Typography variant="body2" className="font-medium text-right ml-4">{vendor.email}</Typography>
 </div>
 <div className="flex justify-between">
 <Typography variant="body2" className="text-textSecondary">GST Number</Typography>
 <Typography variant="body2" className="font-medium text-right ml-4">{vendor.companies?.company_gst_number || 'N/A'}</Typography>
 </div>
 </div>
 </CardContent>
 </Card>

 {/* Contact Information */}
 <Card className="rounded-card shadow-sm border border-borderLight">
 <CardContent className="p-6">
 <Typography variant="h6" className="font-bold mb-4">Contact Information</Typography>
 <div className="space-y-3">
 <div className="flex justify-between border-b border-borderLight pb-2">
 <Typography variant="body2" className="text-textSecondary">Phone Number</Typography>
 <Typography variant="body2" className="font-medium text-right ml-4">{vendor.phone}</Typography>
 </div>
 <div className="flex justify-between border-b border-borderLight pb-2">
 <Typography variant="body2" className="text-textSecondary">WhatsApp Number</Typography>
 <Typography variant="body2" className="font-medium text-right ml-4">{vendor.whatsapp_number}</Typography>
 </div>
 <div className="flex justify-between">
 <Typography variant="body2" className="text-textSecondary">Alternative Phone</Typography>
 <Typography variant="body2" className="font-medium text-right ml-4">{vendor.alt_phone || '-'}</Typography>
 </div>
 </div>
 </CardContent>
 </Card>

 {/* Business Information */}
 <Card className="rounded-card shadow-sm border border-borderLight">
 <CardContent className="p-6">
 <Typography variant="h6" className="font-bold mb-4">Business Information</Typography>
 <div className="space-y-3">
 <div className="flex justify-between border-b border-borderLight pb-2">
 <Typography variant="body2" className="text-textSecondary">Industry Type</Typography>
 <Typography variant="body2" className="font-medium capitalize text-right ml-4">{vendor.industries?.map(i => i.name).join(', ') || 'N/A'}</Typography>
 </div>
 <div className="flex flex-col">
 <Typography variant="body2" className="text-textSecondary mb-1">Office Address</Typography>
 <Typography variant="body2" className="font-medium">{vendor.companies?.company_address || 'N/A'}</Typography>
 </div>
 </div>
 </CardContent>
 </Card>

 {/* Location Information */}
 <Card className="rounded-card shadow-sm border border-borderLight">
 <CardContent className="p-6">
 <Typography variant="h6" className="font-bold mb-4">Location</Typography>
 <div className="space-y-3">
 <div className="flex justify-between border-b border-borderLight pb-2">
 <Typography variant="body2" className="text-textSecondary">Latitude</Typography>
 <Typography variant="body2" className="font-medium text-right ml-4">{vendor.latitude || '-'}</Typography>
 </div>
 <div className="flex justify-between">
 <Typography variant="body2" className="text-textSecondary">Longitude</Typography>
 <Typography variant="body2" className="font-medium text-right ml-4">{vendor.longitude || '-'}</Typography>
 </div>
 </div>
 </CardContent>
 </Card>

 {/* Approval Information */}
 <Card className="rounded-card shadow-sm border border-borderLight">
 <CardContent className="p-6">
 <Typography variant="h6" className="font-bold mb-4">Approval Information</Typography>
 <div className="space-y-3">
 <div className="flex justify-between border-b border-borderLight pb-2">
 <Typography variant="body2" className="text-textSecondary">Status</Typography>
 <Typography variant="body2" component="div" className="font-medium capitalize text-right ml-4"><StatusBadge status={vendor.status} module="vendor" /></Typography>
 </div>
 <div className="flex justify-between border-b border-borderLight pb-2">
 <Typography variant="body2" className="text-textSecondary">Approved By</Typography>
 <Typography variant="body2" className="font-medium text-right ml-4">{vendor.approved_by || '-'}</Typography>
 </div>
 <div className="flex justify-between">
 <Typography variant="body2" className="text-textSecondary">Approved At</Typography>
 <Typography variant="body2" className="font-medium text-right ml-4">
 {vendor.approved_at ? new Date(vendor.approved_at).toLocaleDateString() : '-'}
 </Typography>
 </div>
 </div>
 </CardContent>
 </Card>

 {/* Documents Overview */}
 <Card className="rounded-card shadow-sm border border-borderLight">
 <CardContent className="p-6">
 <Typography variant="h6" className="font-bold mb-4">Documents</Typography>
 <div className="space-y-3">
 <div className="flex justify-between items-center pb-2">
 <Typography variant="body2" className="text-textSecondary">Document Status</Typography>
 <StatusBadge status={vendor.document_status || 'pending'} module="document" />
 </div>
 <Button variant="outlined" size="small" fullWidth onClick={handleDocumentAction}>
 View Documents
 </Button>
 </div>
 </CardContent>
 </Card>
 </div>
 );

 return (
 <Box className="pb-8 space-y-6">
 <PageHeader 
 title={`Vendor: ${vendor.companies?.short_name || vendor.username || 'Unknown'}`}
 breadcrumbs={[
 { label: 'Dashboard', path: '/' }, 
 { label: 'Vendors', path: '/vendors' }, 
 { label: vendor.companies?.short_name || vendor.username || 'Unknown' }
 ]} 
 actions={
 <div className="flex gap-2">
 {(vendor.status === 'pending' || vendor.status === 'suspended' || vendor.status === 'rejected') && (
 <Button variant="contained" color="success" disableElevation onClick={() => setActionModal({ open: true, type: 'approve' })}>
 Approve Vendor
 </Button>
 )}
 {(vendor.status === 'pending' || vendor.status === 'approved') && (
 <Button variant="outlined" color="error" onClick={() => setActionModal({ open: true, type: 'reject' })}>
 Reject Vendor
 </Button>
 )}
 {vendor.status === 'approved' && (
 <Button variant="outlined" color="warning" onClick={() => setActionModal({ open: true, type: 'suspend' })}>
 Suspend Vendor
 </Button>
 )}
 <Button variant="outlined" onClick={handleDocumentAction}>
 Verify Documents
 </Button>
 </div>
 }
 />

 {/* Vendor Header Summary Card */}
 <Card className="rounded-card shadow-sm border border-borderLight mb-6">
 <CardContent className="p-6 flex flex-col md:flex-row items-center justify-between">
 <div className="flex items-center">
 <Avatar sx={{ width: 64, height: 64, bgcolor: '#2563EB', fontSize: '24px' }}>
 {(vendor.companies?.short_name || vendor.username || 'V').charAt(0).toUpperCase()}
 </Avatar>
 <div className="ml-6">
 <Typography variant="h5" className="font-bold text-textPrimary">{vendor.companies?.short_name || vendor.username || 'Unknown Vendor'}</Typography>
 <div className="flex items-center space-x-3 mt-1">
 <Typography variant="body2" className="text-slate-500 font-medium">ID: {vendor.id?.substring(0,8).toUpperCase()}</Typography>
 <Typography variant="body2" className="text-slate-400">•</Typography>
 <StatusBadge status={vendor.status} module="vendor" />
 <Typography variant="body2" className="text-slate-400">•</Typography>
 <Typography variant="body2" className="text-textSecondary">Joined {new Date(vendor.created_at).toLocaleDateString()}</Typography>
 </div>
 </div>
 </div>
 {isSuperAdmin && analytics && (
 <div className="mt-4 md:mt-0 text-right">
 <Typography variant="body2" className="text-textSecondary uppercase text-xs font-bold tracking-wider mb-1">Total Revenue Generated</Typography>
 <Typography variant="h4" className="font-bold text-textPrimary">₹{(analytics.kpis.totalRevenue || 0).toLocaleString()}</Typography>
 </div>
 )}
 </CardContent>
 </Card>

 {/* Tabs */}
 <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
 <Tabs value={tabValue} onChange={handleTabChange} aria-label="vendor details tabs">
 <Tab label="Analytics Dashboard" sx={{ textTransform: 'none', fontWeight: 600, fontSize: '15px' }} />
 <Tab label="Company Overview" sx={{ textTransform: 'none', fontWeight: 600, fontSize: '15px' }} />
 </Tabs>
 </Box>

 {/* Tab Panels */}
 <Box className="pt-4">
 {tabValue === 0 && renderAnalytics()}
 {tabValue === 1 && renderOverview()}
 </Box>

 {/* Action Modals */}
 <ConfirmDialog 
 open={actionModal.open && actionModal.type === 'approve'}
 title="Approve Vendor"
 message="Are you sure you want to approve this vendor?"
 confirmLabel="Approve"
 confirmColor="success"
 onCancel={() => setActionModal({ open: false, type: '' })}
 onConfirm={() => handleStatusChange('approved')}
 />

 <ConfirmDialog 
 open={actionModal.open && actionModal.type === 'reject'}
 title="Reject Vendor"
 message="Are you sure you want to reject this vendor?"
 requiresReason={true}
 reasonLabel="Reason for rejection"
 reasonValue={rejectionReason}
 onReasonChange={setRejectionReason}
 confirmLabel="Reject"
 confirmColor="error"
 onCancel={() => { setActionModal({ open: false, type: '' }); setRejectionReason(''); }}
 onConfirm={() => handleStatusChange('rejected')}
 />

 <ConfirmDialog 
 open={actionModal.open && actionModal.type === 'suspend'}
 title="Suspend Vendor"
 message="Are you sure you want to suspend this vendor's account?"
 requiresReason={true}
 reasonLabel="Reason for suspension"
 reasonValue={rejectionReason}
 onReasonChange={setRejectionReason}
 confirmLabel="Suspend"
 confirmColor="warning"
 onCancel={() => { setActionModal({ open: false, type: '' }); setRejectionReason(''); }}
 onConfirm={() => handleStatusChange('suspended')}
 />
 </Box>
 );
};

export default VendorDetailPage;

