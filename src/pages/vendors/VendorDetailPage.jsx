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
 };  const renderOverview = () => (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Left Column: Profile, Business, Documents */}
      <div className="lg:col-span-2 space-y-8">
        {/* Profile Information */}
        <Card className="rounded-xl shadow-[0_1px_3px_rgba(0,0,0,0.05)] border border-borderLight overflow-hidden">
          <CardContent className="p-6">
            <Typography variant="h6" className="font-bold text-textPrimary mb-6 tracking-tight">Profile Information</Typography>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-8">
              <div>
                <Typography variant="body2" className="text-textSecondary mb-1 font-medium">Company Name</Typography>
                <Typography variant="body1" className="font-semibold text-textPrimary">{vendor.companies?.short_name || 'N/A'}</Typography>
              </div>
              <div>
                <Typography variant="body2" className="text-textSecondary mb-1 font-medium">User Name</Typography>
                <Typography variant="body1" className="font-semibold text-textPrimary">{vendor.username}</Typography>
              </div>
              <div>
                <Typography variant="body2" className="text-textSecondary mb-1 font-medium">Email Address</Typography>
                <Typography variant="body1" className="font-semibold text-textPrimary">{vendor.email}</Typography>
              </div>
              <div>
                <Typography variant="body2" className="text-textSecondary mb-1 font-medium">GST Number</Typography>
                <Typography variant="body1" className="font-semibold text-textPrimary">{vendor.companies?.company_gst_number || 'N/A'}</Typography>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Business Information */}
        <Card className="rounded-xl shadow-[0_1px_3px_rgba(0,0,0,0.05)] border border-borderLight overflow-hidden">
          <CardContent className="p-6">
            <Typography variant="h6" className="font-bold text-textPrimary mb-6 tracking-tight">Business Information</Typography>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-8">
              <div>
                <Typography variant="body2" className="text-textSecondary mb-1 font-medium">Industry Type</Typography>
                <Typography variant="body1" className="font-semibold text-textPrimary capitalize">
                  {vendor.industries?.map(i => i.name).join(', ') || 'N/A'}
                </Typography>
              </div>
              <div>
                <Typography variant="body2" className="text-textSecondary mb-1 font-medium">Office Address</Typography>
                <Typography variant="body1" className="font-semibold text-textPrimary">{vendor.companies?.company_address || 'N/A'}</Typography>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Documents Overview */}
        <Card className="rounded-xl shadow-[0_1px_3px_rgba(0,0,0,0.05)] border border-borderLight overflow-hidden">
          <CardContent className="p-6 flex items-center justify-between">
            <div>
              <Typography variant="h6" className="font-bold text-textPrimary mb-1 tracking-tight">Documents Verification</Typography>
              <div className="flex items-center gap-2 mt-2">
                <Typography variant="body2" className="text-textSecondary font-medium">Current Status:</Typography>
                <StatusBadge status={vendor.document_status || 'pending'} module="document" />
              </div>
            </div>
            <Button variant="outlined" size="large" onClick={handleDocumentAction} className="bg-card hover:bg-black/5 dark:hover:bg-white/5 shadow-sm font-semibold">
              View Documents
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Right Column: Approval, Contact, Location */}
      <div className="lg:col-span-1 space-y-8">
        {/* Approval Information */}
        <Card className="rounded-xl shadow-[0_1px_3px_rgba(0,0,0,0.05)] border border-borderLight overflow-hidden bg-gradient-to-b from-card to-slate-50/50 dark:to-slate-900/50">
          <CardContent className="p-6">
            <Typography variant="h6" className="font-bold text-textPrimary mb-5 tracking-tight">Account Status</Typography>
            <div className="space-y-4">
              <div className="flex justify-between items-center bg-card p-3 rounded-lg border border-borderLight/50">
                <Typography variant="body2" className="text-textSecondary font-medium">Status</Typography>
                <StatusBadge status={vendor.status} module="vendor" />
              </div>
              <div className="flex justify-between items-center p-2">
                <Typography variant="body2" className="text-textSecondary font-medium">Approved By</Typography>
                <Typography variant="body2" className="font-semibold text-textPrimary">{vendor.approved_by || '-'}</Typography>
              </div>
              <div className="flex justify-between items-center p-2">
                <Typography variant="body2" className="text-textSecondary font-medium">Approved At</Typography>
                <Typography variant="body2" className="font-semibold text-textPrimary">
                  {vendor.approved_at ? new Date(vendor.approved_at).toLocaleDateString() : '-'}
                </Typography>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Contact Information */}
        <Card className="rounded-xl shadow-[0_1px_3px_rgba(0,0,0,0.05)] border border-borderLight overflow-hidden">
          <CardContent className="p-6">
            <Typography variant="h6" className="font-bold text-textPrimary mb-5 tracking-tight">Contact</Typography>
            <div className="space-y-4">
              <div>
                <Typography variant="body2" className="text-textSecondary mb-1 font-medium">Primary Phone</Typography>
                <Typography variant="body1" className="font-semibold text-textPrimary">{vendor.phone}</Typography>
              </div>
              <Divider className="my-2 border-borderLight" />
              <div>
                <Typography variant="body2" className="text-textSecondary mb-1 font-medium">WhatsApp</Typography>
                <Typography variant="body1" className="font-semibold text-textPrimary">{vendor.whatsapp_number}</Typography>
              </div>
              <Divider className="my-2 border-borderLight" />
              <div>
                <Typography variant="body2" className="text-textSecondary mb-1 font-medium">Alternative Phone</Typography>
                <Typography variant="body1" className="font-semibold text-textPrimary">{vendor.alt_phone || '-'}</Typography>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Location Information */}
        <Card className="rounded-xl shadow-[0_1px_3px_rgba(0,0,0,0.05)] border border-borderLight overflow-hidden">
          <CardContent className="p-6">
            <Typography variant="h6" className="font-bold text-textPrimary mb-5 tracking-tight">Coordinates</Typography>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-slate-50 dark:bg-slate-900/50 p-3 rounded-lg border border-borderLight/50">
                <Typography variant="body2" className="text-textSecondary mb-1 font-medium">Latitude</Typography>
                <Typography variant="body2" className="font-semibold text-textPrimary">{vendor.latitude || '-'}</Typography>
              </div>
              <div className="bg-slate-50 dark:bg-slate-900/50 p-3 rounded-lg border border-borderLight/50">
                <Typography variant="body2" className="text-textSecondary mb-1 font-medium">Longitude</Typography>
                <Typography variant="body2" className="font-semibold text-textPrimary">{vendor.longitude || '-'}</Typography>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
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
      <Card className="rounded-xl shadow-[0_1px_3px_rgba(0,0,0,0.05)] border border-borderLight mb-6 bg-gradient-to-r from-card to-slate-50/30 dark:to-slate-900/30">
        <CardContent className="p-8 flex flex-col md:flex-row items-center justify-between">
          <div className="flex items-center">
            <Avatar sx={{ width: 80, height: 80, bgcolor: '#2563EB', fontSize: '32px', boxShadow: '0 4px 14px 0 rgba(37,99,235,0.39)' }} className="ring-4 ring-white dark:ring-slate-800">
              {(vendor.companies?.short_name || vendor.username || 'V').charAt(0).toUpperCase()}
            </Avatar>
            <div className="ml-6">
              <Typography variant="h4" className="font-bold text-textPrimary tracking-tight">{vendor.companies?.short_name || vendor.username || 'Unknown Vendor'}</Typography>
              <div className="flex items-center space-x-4 mt-2">
                <Typography variant="body2" className="text-slate-500 font-semibold bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded">ID: {vendor.id?.substring(0,8).toUpperCase()}</Typography>
                <StatusBadge status={vendor.status} module="vendor" />
                <Typography variant="body2" className="text-textSecondary font-medium">Joined {new Date(vendor.created_at).toLocaleDateString()}</Typography>
              </div>
            </div>
          </div>
          {isSuperAdmin && analytics && (
            <div className="mt-6 md:mt-0 md:text-right bg-white dark:bg-slate-800/50 p-4 rounded-xl border border-borderLight/50 shadow-sm">
              <Typography variant="body2" className="text-textSecondary uppercase text-xs font-bold tracking-widest mb-1">Total Revenue Generated</Typography>
              <Typography variant="h4" className="font-bold text-primary-main tracking-tight">₹{(analytics.kpis.totalRevenue || 0).toLocaleString()}</Typography>
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

