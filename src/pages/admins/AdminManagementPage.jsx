import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
 Box,
 Card,
 CardContent,
 Typography,
 Tabs,
 Tab,
 Grid,
 TextField,
 FormControl,
 InputLabel,
 Select,
 MenuItem,
 Button,
 IconButton,
 Divider,
 Snackbar,
 Alert 
} from '@mui/material';
import { Add, Edit, CheckCircle, Block } from '@mui/icons-material';
import PageHeader from '../../components/common/PageHeader';
import DataTable from '../../components/common/DataTable';
import StatusBadge from '../../components/common/StatusBadge';
import SearchBar from '../../components/common/SearchBar';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import { adminService } from '../../services/adminService';
import { authService } from '../../services/authService';

const AdminManagementPage = () => {
 const [activeTab, setActiveTab] = useState(0);
 const [formState, setFormState] = useState({
 name: '',
 email: '',
 password: '',
 confirmPassword: '',
 status: 'active'
 });
 const [formErrors, setFormErrors] = useState({});
 const [toastOpen, setToastOpen] = useState(false);
 const [toastMessage, setToastMessage] = useState('');
 const [toastSeverity, setToastSeverity] = useState('success');
 const [admins, setAdmins] = useState([]);
 const [loadingAdmins, setLoadingAdmins] = useState(true);
 const [formLoading, setFormLoading] = useState(false);
 const [page, setPage] = useState(0);
 const [rowsPerPage, setRowsPerPage] = useState(10);
 const [confirmOpen, setConfirmOpen] = useState(false);
 const [selectedAdmin, setSelectedAdmin] = useState(null);
 const [confirmAction, setConfirmAction] = useState('');
 const [searchTerm, setSearchTerm] = useState('');
 const navigate = useNavigate();

 const validateEmail = (email) => {
 return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
 };

 const validateForm = () => {
 const errors = {};
 if (!formState.name.trim()) {
 errors.name = 'Full Name is required';
 }
 if (!formState.email.trim()) {
 errors.email = 'Email is required';
 } else if (!validateEmail(formState.email)) {
 errors.email = 'Enter a valid email address';
 }
 if (!formState.password) {
 errors.password = 'Password is required';
 }
 if (!formState.confirmPassword) {
 errors.confirmPassword = 'Confirm Password is required';
 } else if (formState.password !== formState.confirmPassword) {
 errors.confirmPassword = 'Passwords do not match';
 }
 setFormErrors(errors);
 return Object.keys(errors).length === 0;
 };

 const fetchAdmins = async () => {
 try {
 setLoadingAdmins(true);
 const data = await adminService.getAdmins();
 setAdmins(data.filter((admin) => admin.role === 'sub_admin'));
 } catch (error) {
 setToastSeverity('error');
 setToastMessage('Failed to load admin list.');
 setToastOpen(true);
 } finally {
 setLoadingAdmins(false);
 }
 };

 useEffect(() => {
 fetchAdmins();
 }, []);

 const handleFormSubmit = async (event) => {
 event.preventDefault();
 if (!validateForm()) {
 return;
 }

 setFormLoading(true);
 setFormErrors({});

 try {
 const currentAdmin = authService.getCurrentAdmin();
 if (!currentAdmin) {
 throw new Error('Current admin session not found.');
 }

 await adminService.createAdmin({
 name: formState.name.trim(),
 email: formState.email.trim().toLowerCase(),
 password: formState.password,
 status: formState.status
 }, currentAdmin.id);

 setToastSeverity('success');
 setToastMessage('Sub Admin created successfully');
 setToastOpen(true);
 setFormState({ name: '', email: '', password: '', confirmPassword: '', status: 'active' });
 setActiveTab(1);
 await fetchAdmins();
 setPage(0);
 } catch (error) {
 const message = error?.message || 'Failed to create admin.';
 if (/duplicate|already exists|unique/i.test(message)) {
 setFormErrors({ email: 'An admin with this email already exists.' });
 } else {
 setToastSeverity('error');
 setToastMessage(message);
 setToastOpen(true);
 }
 } finally {
 setFormLoading(false);
 }
 };

 const handleConfirmOpen = (admin, action) => {
 setSelectedAdmin(admin);
 setConfirmAction(action);
 setConfirmOpen(true);
 };

 const handleConfirmClose = () => {
 setConfirmOpen(false);
 setSelectedAdmin(null);
 setConfirmAction('');
 };

 const handleConfirmAction = async () => {
 if (!selectedAdmin) return;

 setFormLoading(true);
 setConfirmOpen(false);

 try {
 const currentAdmin = authService.getCurrentAdmin();
 if (!currentAdmin) {
 throw new Error('Current admin session not found.');
 }

 if (confirmAction === 'activate') {
 await adminService.updateAdmin(selectedAdmin.id, { status: 'active' }, currentAdmin.id);
 setToastSeverity('success');
 setToastMessage('Sub Admin activated successfully');
 } else {
 await adminService.disableAdmin(selectedAdmin.id, currentAdmin.id);
 setToastSeverity('success');
 setToastMessage('Sub Admin deactivated successfully');
 }

 setToastOpen(true);
 await fetchAdmins();
 } catch (error) {
 setToastSeverity('error');
 setToastMessage(error?.message || 'Failed to update admin status.');
 setToastOpen(true);
 } finally {
 setFormLoading(false);
 handleConfirmClose();
 }
 };

 const filteredAdmins = admins.filter((admin) =>
 admin.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
 admin.email.toLowerCase().includes(searchTerm.toLowerCase())
 );

 const paginatedAdmins = filteredAdmins.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

 const columns = [
 { field: 'name', headerName: 'Name' },
 { field: 'email', headerName: 'Email' },
 {
 field: 'status',
 headerName: 'Status',
 renderCell: (row) => (
 <StatusBadge status={row.status === 'active' ? 'active' : 'suspended'} module="admin" />
 )
 },
 { field: 'created_at', headerName: 'Created Date' },
 {
 field: 'actions',
 headerName: 'Actions',
 renderCell: (row) => (
 <Box className="flex items-center gap-1">
 <IconButton size="small" color="primary" onClick={() => navigate(`/admins/${row.id}`)}>
 <Edit fontSize="small" />
 </IconButton>
 {row.status === 'active' ? (
 <IconButton size="small" color="error" onClick={() => handleConfirmOpen(row, 'deactivate')}>
 <Block fontSize="small" />
 </IconButton>
 ) : (
 <IconButton size="small" color="success" onClick={() => handleConfirmOpen(row, 'activate')}>
 <CheckCircle fontSize="small" />
 </IconButton>
 )}
 </Box>
 )
 }
 ];

 const handleTabChange = (event, value) => {
 setActiveTab(value);
 if (value === 1) {
 setPage(0);
 }
 };

 const handleFormChange = (event) => {
 const { name, value } = event.target;
 setFormState((prev) => ({ ...prev, [name]: value }));
 };

 return (
 <Box className="pb-8 space-y-6 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
 <PageHeader
 title="Admin Management"
 breadcrumbs={[
 { label: 'Dashboard', path: '/' },
 { label: 'Admin Management' }
 ]}
 actions={
 <Button
 variant="contained"
 color="primary"
 startIcon={<Add />}
 className="rounded-btn"
 onClick={() => setActiveTab(0)}
 >
 Add New Sub Admin
 </Button>
 }
 />

 <Card className="rounded-card border border-borderLight shadow-sm overflow-hidden">
 <CardContent className="p-4 sm:p-6">
 <Tabs
 value={activeTab}
 onChange={handleTabChange}
 indicatorColor="primary"
 textColor="primary"
 className="mb-4"
 >
 <Tab label="Add Admin" />
 <Tab label="Admin List" />
 </Tabs>

 <Divider className="mb-6" />

 {activeTab === 0 && (
 <Box className="space-y-6">
 <Typography variant="h6" className="font-bold text-textPrimary">
 Add Sub Admin
 </Typography>
 <Typography variant="body2" className="text-textSecondary max-w-2xl">
 Create a sub admin account with restricted access. This admin will only have operational access to the Supported modules.
 </Typography>

 <Box className="grid grid-cols-1 xl:grid-cols-[1fr_360px] gap-6">
 <Card className="rounded-card border border-borderLight shadow-sm">
 <CardContent className="space-y-6 p-6">
 <Grid container spacing={3}>
 <Grid item xs={12} md={6}>
 <TextField
 fullWidth
 label="Full Name"
 name="name"
 value={formState.name}
 onChange={handleFormChange}
 placeholder="Enter full name"
 error={Boolean(formErrors.name)}
 helperText={formErrors.name}
 />
 </Grid>
 <Grid item xs={12} md={6}>
 <TextField
 fullWidth
 label="Email Address"
 name="email"
 type="email"
 value={formState.email}
 onChange={handleFormChange}
 placeholder="Enter email address"
 error={Boolean(formErrors.email)}
 helperText={formErrors.email}
 />
 </Grid>
 <Grid item xs={12} md={6}>
 <TextField
 fullWidth
 label="Password"
 name="password"
 type="password"
 value={formState.password}
 onChange={handleFormChange}
 placeholder="Create password"
 error={Boolean(formErrors.password)}
 helperText={formErrors.password}
 />
 </Grid>
 <Grid item xs={12} md={6}>
 <TextField
 fullWidth
 label="Confirm Password"
 name="confirmPassword"
 type="password"
 value={formState.confirmPassword}
 onChange={handleFormChange}
 placeholder="Confirm password"
 error={Boolean(formErrors.confirmPassword)}
 helperText={formErrors.confirmPassword}
 />
 </Grid>
 <Grid item xs={12} md={6}>
 <FormControl fullWidth>
 <InputLabel id="status-label">Status</InputLabel>
 <Select
 labelId="status-label"
 label="Status"
 name="status"
 value={formState.status}
 onChange={handleFormChange}
 >
 <MenuItem value="active">Active</MenuItem>
 <MenuItem value="inactive">Inactive</MenuItem>
 </Select>
 </FormControl>
 </Grid>
 <Grid item xs={12} md={6}>
 <TextField
 fullWidth
 label="Role"
 value="sub_admin"
 disabled
 />
 </Grid>
 </Grid>

 <Box className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pt-2">
 <Box>
 <Typography variant="body2" className="text-textSecondary">
 The role is fixed to <strong>sub_admin</strong> for this workflow.
 </Typography>
 </Box>
 <Button
 variant="contained"
 color="primary"
 size="large"
 className="rounded-btn"
 disableElevation
 onClick={handleFormSubmit}
 disabled={formLoading}
 >
 {formLoading ? 'Saving...' : 'Save Sub Admin'}
 </Button>
 </Box>
 </CardContent>
 </Card>

 <Card className="rounded-card border border-borderLight shadow-sm">
 <CardContent className="p-6">
 <Typography variant="subtitle1" className="font-semibold mb-3">
 Creation Guidelines
 </Typography>
 <Typography variant="body2" className="text-textSecondary space-y-3">
 <Box component="span" className="block mb-3">
 • Sub admins can access operational modules only.
 </Box>
 <Box component="span" className="block mb-3">
 • Passwords must be shared securely outside the portal.
 </Box>
 <Box component="span" className="block">
 • Master admin retains full permission control.
 </Box>
 </Typography>
 </CardContent>
 </Card>

 <Snackbar
 open={toastOpen}
 autoHideDuration={4000}
 onClose={() => setToastOpen(false)}
 anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
 >
 <Alert onClose={() => setToastOpen(false)} severity={toastSeverity} sx={{ width: '100%' }}>
 {toastMessage}
 </Alert>
 </Snackbar>

 <ConfirmDialog
 open={confirmOpen}
 title={confirmAction === 'activate' ? 'Activate Sub Admin' : 'Deactivate Sub Admin'}
 message={
 confirmAction === 'activate'
 ? `Are you sure you want to activate ${selectedAdmin?.name}?`
 : `Are you sure you want to deactivate ${selectedAdmin?.name}?`
 }
 confirmLabel={confirmAction === 'activate' ? 'Activate' : 'Deactivate'}
 confirmColor={confirmAction === 'activate' ? 'success' : 'error'}
 onConfirm={handleConfirmAction}
 onCancel={handleConfirmClose}
 />
 </Box>
 </Box>
 )}

 {activeTab === 1 && (
 <Box className="space-y-6">
 <Box className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
 <Box>
 <Typography variant="h6" className="font-bold text-textPrimary">
 Admin List
 </Typography>
 <Typography variant="body2" className="text-textSecondary">
 View all sub admin accounts and manage status quickly.
 </Typography>
 </Box>
 <SearchBar
 value={searchTerm}
 onChange={(value) => {
 setSearchTerm(value);
 setPage(0);
 }}
 placeholder="Search admins by name or email"
 />
 </Box>

 <Card className="rounded-card border border-borderLight shadow-sm">
 <CardContent className="p-6">
 <DataTable
 columns={columns}
 data={paginatedAdmins}
 loading={loadingAdmins}
 totalCount={filteredAdmins.length}
 page={page}
 rowsPerPage={rowsPerPage}
 onPageChange={setPage}
 onRowsPerPageChange={(newRowsPerPage) => {
 setRowsPerPage(newRowsPerPage);
 setPage(0);
 }}
 />
 </CardContent>
 </Card>
 </Box>
 )}
 </CardContent>
 </Card>
 </Box>
 );
};

export default AdminManagementPage;

