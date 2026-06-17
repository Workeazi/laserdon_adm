import React, { useState } from 'react';
import { Box, Card, CardContent, Typography, Button, Tabs, Tab, Avatar } from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import PageHeader from '../../components/common/PageHeader';
import StatusBadge from '../../components/common/StatusBadge';
import DataTable from '../../components/common/DataTable';
import { mockPayments } from '../../mock/payments';

const PaymentDetailPage = () => {
 const { id } = useParams();
 const navigate = useNavigate();
 const payment = mockPayments.find(p => p.id === id) || mockPayments[0]; 

 const [tabValue, setTabValue] = useState(0);

 const handleTabChange = (event, newValue) => {
 setTabValue(newValue);
 };

 const renderOverview = () => (
 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
 <Card className="rounded-card shadow-sm border border-borderLight">
 <CardContent className="p-6">
 <Typography variant="h6" className="font-bold mb-4">Payment Details</Typography>
 <div className="space-y-3">
 <div className="flex justify-between border-b border-borderLight pb-2">
 <Typography variant="body2" className="text-textSecondary">Payment ID</Typography>
 <Typography variant="body2" className="font-medium">{payment.id}</Typography>
 </div>
 <div className="flex justify-between border-b border-borderLight pb-2">
 <Typography variant="body2" className="text-textSecondary">Method</Typography>
 <Typography variant="body2" className="font-medium uppercase">{payment.method}</Typography>
 </div>
 <div className="flex justify-between border-b border-borderLight pb-2">
 <Typography variant="body2" className="text-textSecondary">Gateway</Typography>
 <Typography variant="body2" className="font-medium capitalize">{payment.gateway}</Typography>
 </div>
 <div className="flex justify-between">
 <Typography variant="body2" className="text-textSecondary">Date</Typography>
 <Typography variant="body2" className="font-medium">{payment.created_at}</Typography>
 </div>
 </div>
 </CardContent>
 </Card>

 <Card className="rounded-card shadow-sm border border-borderLight">
 <CardContent className="p-6">
 <Typography variant="h6" className="font-bold mb-4">Related Entities</Typography>
 <div className="space-y-3">
 <div className="flex justify-between border-b border-borderLight pb-2">
 <Typography variant="body2" className="text-textSecondary">Order ID</Typography>
 <Typography variant="body2" className="font-medium cursor-pointer text-primary-main hover:underline" onClick={() => navigate(`/orders/${payment.order_id}`)}>{payment.order_id}</Typography>
 </div>
 <div className="flex justify-between border-b border-borderLight pb-2">
 <Typography variant="body2" className="text-textSecondary">User</Typography>
 <Typography variant="body2" className="font-medium">{payment.user_name}</Typography>
 </div>
 <div className="flex justify-between">
 <Typography variant="body2" className="text-textSecondary">Vendor</Typography>
 <Typography variant="body2" className="font-medium">{payment.vendor_name}</Typography>
 </div>
 </div>
 </CardContent>
 </Card>
 </div>
 );

 return (
 <Box className="pb-8 space-y-6">
 <PageHeader 
 title={`Payment: ${payment.id}`}
 breadcrumbs={[
 { label: 'Dashboard', path: '/' }, 
 { label: 'Payments', path: '/payments' }, 
 { label: payment.id }
 ]} 
 actions={
 <>
 {payment.status === 'pending' && (
 <Button variant="contained" color="primary" disableElevation className="rounded-btn font-semibold">
 Verify Payment
 </Button>
 )}
 <Button variant="outlined" color="primary" className="rounded-btn font-semibold">
 Download Receipt
 </Button>
 </>
 }
 />

 <Card className="rounded-card shadow-sm border border-borderLight mb-6">
 <CardContent className="p-6 flex flex-col md:flex-row items-center justify-between">
 <div className="flex items-center">
 <Avatar sx={{ width: 64, height: 64, bgcolor: '#10B981', fontSize: '24px' }}>
 ₹
 </Avatar>
 <div className="ml-6">
 <Typography variant="h5" className="font-bold text-textPrimary">₹{payment.amount.toLocaleString()}</Typography>
 <div className="flex items-center space-x-3 mt-1">
 <StatusBadge status={payment.status} module="payment" />
 <Typography variant="body2" className="text-textSecondary">• {payment.gateway} ({payment.method.toUpperCase()})</Typography>
 </div>
 </div>
 </div>
 </CardContent>
 </Card>

 <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
 <Tabs value={tabValue} onChange={handleTabChange}>
 <Tab label="Overview" sx={{ textTransform: 'none', fontWeight: 600 }} />
 <Tab label="Timeline" sx={{ textTransform: 'none', fontWeight: 600 }} />
 <Tab label="Related Orders" sx={{ textTransform: 'none', fontWeight: 600 }} />
 </Tabs>
 </Box>

 <Box className="pt-4">
 {tabValue === 0 && renderOverview()}
 {tabValue === 1 && (
 <Card className="rounded-card shadow-sm border border-borderLight p-6">
 <Typography variant="h6" className="font-bold mb-4">Activity Timeline</Typography>
 <div className="space-y-4">
 <div className="flex">
 <div className="w-3 h-3 rounded-full bg-primary-main mt-1.5 mr-4"></div>
 <div>
 <Typography variant="body2" className="font-semibold">Payment Initiated</Typography>
 <Typography variant="caption" className="text-textSecondary">{payment.created_at}</Typography>
 </div>
 </div>
 {payment.status === 'success' && (
 <div className="flex">
 <div className="w-3 h-3 rounded-full bg-success mt-1.5 mr-4"></div>
 <div>
 <Typography variant="body2" className="font-semibold">Payment Completed successfully</Typography>
 <Typography variant="caption" className="text-textSecondary">{payment.created_at}</Typography>
 </div>
 </div>
 )}
 </div>
 </Card>
 )}
 {tabValue === 2 && (
 <DataTable 
 columns={[
 { field: 'id', headerName: 'Order ID' },
 { field: 'user_name', headerName: 'User' },
 { field: 'vendor_name', headerName: 'Vendor' },
 { field: 'status', headerName: 'Status', renderCell: (r) => <StatusBadge status={r.status} module="order" /> },
 ]}
 data={[{ id: payment.order_id, user_name: payment.user_name, vendor_name: payment.vendor_name, status: 'confirmed' }]}
 onRowClick={(row) => navigate(`/orders/${row.id}`)}
 />
 )}
 </Box>
 </Box>
 );
};

export default PaymentDetailPage;

