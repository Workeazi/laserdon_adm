import React, { useState, useEffect } from 'react';
import { Box, Card, CardContent, Typography, Button, Tabs, Tab, Avatar, CircularProgress, Alert } from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import PageHeader from '../../components/common/PageHeader';
import StatusBadge from '../../components/common/StatusBadge';
import DataTable from '../../components/common/DataTable';
import { adminService } from '../../services/adminService';
import dayjs from 'dayjs';

const AdminDetailPage = () => {
 const { id } = useParams();
 const navigate = useNavigate();
 
 const [admin, setAdmin] = useState(null);
 const [loading, setLoading] = useState(true);
 const [error, setError] = useState(null);
 const [tabValue, setTabValue] = useState(0);

 useEffect(() => {
 const fetchAdmin = async () => {
 try {
 setLoading(true);
 const data = await adminService.getAdminById(id);
 setAdmin(data);
 } catch (err) {
 setError('Failed to load admin details');
 } finally {
 setLoading(false);
 }
 };
 if (id) fetchAdmin();
 }, [id]);

 const handleTabChange = (event, newValue) => {
 setTabValue(newValue);
 };

 if (loading) {
 return <Box className="p-8 flex justify-center"><CircularProgress /></Box>;
 }

 if (error || !admin) {
 return <Box className="p-8"><Alert severity="error">{error || 'Admin not found'}</Alert></Box>;
 }

 const renderOverview = () => (
 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
 <Card className="rounded-card shadow-sm border border-borderLight">
 <CardContent className="p-6">
 <Typography variant="h6" className="font-bold mb-4">Admin Information</Typography>
 <div className="space-y-3">
 <div className="flex justify-between border-b border-borderLight pb-2">
 <Typography variant="body2" className="text-textSecondary">Name</Typography>
 <Typography variant="body2" className="font-medium">{admin.name}</Typography>
 </div>
 <div className="flex justify-between border-b border-borderLight pb-2">
 <Typography variant="body2" className="text-textSecondary">Email</Typography>
 <Typography variant="body2" className="font-medium">{admin.email}</Typography>
 </div>
 <div className="flex justify-between border-b border-borderLight pb-2">
 <Typography variant="body2" className="text-textSecondary">Role</Typography>
 <Typography variant="body2" className="font-medium">{admin.role}</Typography>
 </div>
 <div className="flex justify-between">
 <Typography variant="body2" className="text-textSecondary">Created Date</Typography>
 <Typography variant="body2" className="font-medium">{dayjs(admin.created_at).format('MMM D, YYYY')}</Typography>
 </div>
 </div>
 </CardContent>
 </Card>
 </div>
 );

 return (
 <Box className="pb-8 space-y-6">
 <PageHeader 
 title={`Admin: ${admin.name}`}
 breadcrumbs={[
 { label: 'Dashboard', path: '/' }, 
 { label: 'Admins', path: '/settings/admins' }, 
 { label: admin.name }
 ]} 
 actions={
 <>
 {admin.status === 'inactive' ? (
 <Button variant="contained" color="success" disableElevation className="rounded-btn font-semibold">
 Reactivate
 </Button>
 ) : (
 <Button variant="outlined" color="error" className="rounded-btn font-semibold">
 Deactivate
 </Button>
 )}
 <Button variant="outlined" color="primary" className="rounded-btn font-semibold">
 Reset Password
 </Button>
 </>
 }
 />

 <Card className="rounded-card shadow-sm border border-borderLight mb-6">
 <CardContent className="p-6 flex flex-col md:flex-row items-center justify-between">
 <div className="flex items-center">
 <Avatar sx={{ width: 64, height: 64, bgcolor: '#8B5CF6', fontSize: '24px' }}>
 {admin.name.charAt(0)}
 </Avatar>
 <div className="ml-6">
 <Typography variant="h5" className="font-bold text-textPrimary">{admin.name}</Typography>
 <div className="flex items-center space-x-3 mt-1">
 <StatusBadge status={admin.status.toLowerCase() === 'active' ? 'active' : 'suspended'} module="admin" />
 <Typography variant="body2" className="text-textSecondary">• {admin.role}</Typography>
 </div>
 </div>
 </div>
 </CardContent>
 </Card>

 <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
 <Tabs value={tabValue} onChange={handleTabChange}>
 <Tab label="Overview" sx={{ textTransform: 'none', fontWeight: 600 }} />
 <Tab label="Activity Logs" sx={{ textTransform: 'none', fontWeight: 600 }} />
 </Tabs>
 </Box>

 <Box className="pt-4">
 {tabValue === 0 && renderOverview()}
 {tabValue === 1 && (
 <Typography variant="body2" color="textSecondary">Activity logs will be implemented in the next phase.</Typography>
 )}
 </Box>
 </Box>
 );
};

export default AdminDetailPage;

