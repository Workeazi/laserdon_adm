import React, { useState, useEffect } from 'react';
import { Box, Button, IconButton, Menu, MenuItem, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Typography, CircularProgress, Alert } from '@mui/material';
import { Add, MoreVert, Edit, Block, LockReset, Visibility } from '@mui/icons-material';
import toast from 'react-hot-toast';
import PageHeader from '../../components/common/PageHeader';
import DataTable from '../../components/common/DataTable';
import StatusBadge from '../../components/common/StatusBadge';
import SearchBar from '../../components/common/SearchBar';
import { adminService } from '../../services/adminService';
import { authService } from '../../services/authService';
import dayjs from 'dayjs';

const AdminManagementPage = () => {
 const [admins, setAdmins] = useState([]);
 const [loading, setLoading] = useState(true);
 const [error, setError] = useState(null);

 const [anchorEl, setAnchorEl] = useState(null);
 const [selectedAdmin, setSelectedAdmin] = useState(null);
 
 // Modal State
 const [isModalOpen, setIsModalOpen] = useState(false);
 const [formData, setFormData] = useState({ name: '', email: '', password: '', passwordConfirm: '' });
 const [formLoading, setFormLoading] = useState(false);
 const [formError, setFormError] = useState('');

 const fetchAdmins = async () => {
 try {
 setLoading(true);
 const data = await adminService.getAdmins();
 setAdmins(data);
 } catch (err) {
 setError('Failed to fetch admins');
 } finally {
 setLoading(false);
 }
 };

 useEffect(() => {
 fetchAdmins();
 }, []);

 const handleMenuClick = (event, admin) => {
 setAnchorEl(event.currentTarget);
 setSelectedAdmin(admin);
 };

 const handleMenuClose = () => {
 setAnchorEl(null);
 setSelectedAdmin(null);
 };

 const handleInputChange = (e) => {
 const { name, value } = e.target;
 setFormData(prev => ({ ...prev, [name]: value }));
 };

 const handleCreateAdmin = async () => {
 if (formData.password !== formData.passwordConfirm) {
 setFormError('Passwords do not match');
 return;
 }

 try {
 setFormLoading(true);
 setFormError('');
 const currentUser = authService.getCurrentAdmin();
 await adminService.createAdmin(formData, currentUser.id);
 setIsModalOpen(false);
 setFormData({ name: '', email: '', password: '', passwordConfirm: '' });
 toast.success('Sub Admin created successfully');
 fetchAdmins();
 } catch (err) {
 setFormError(err.message || 'Failed to create admin');
 } finally {
 setFormLoading(false);
 }
 };

 const columns = [
 { field: 'name', headerName: 'Name' },
 { field: 'email', headerName: 'Email' },
 { field: 'role', headerName: 'Role' },
 { field: 'status', headerName: 'Status', renderCell: (r) => <StatusBadge status={r.status === 'active' ? 'active' : 'suspended'} module="user" /> },
 { field: 'created_at', headerName: 'Created Date', renderCell: (r) => dayjs(r.created_at).format('MMM D, YYYY') },
 {
 field: 'actions',
 headerName: 'Actions',
 renderCell: (r) => (
 <>
 <IconButton size="small" onClick={(e) => handleMenuClick(e, r)}>
 <MoreVert fontSize="small" />
 </IconButton>
 </>
 ),
 },
 ];

 return (
 <Box className="pb-8 space-y-6">
 <PageHeader 
 title="Admin Management (RBAC)" 
 breadcrumbs={[{ label: 'Dashboard', path: '/' }, { label: 'Settings', path: '/settings' }, { label: 'Admins' }]} 
 actions={
 <Button 
 variant="contained" 
 color="primary" 
 startIcon={<Add />} 
 disableElevation 
 className="rounded-btn"
 onClick={() => setIsModalOpen(true)}
 >
 Create Sub Admin
 </Button>
 }
 />

 <div className="flex mb-6">
 <div className="w-full md:w-1/2">
 <SearchBar placeholder="Search admins by name or email..." />
 </div>
 </div>

 {error && <Alert severity="error" className="mb-4">{error}</Alert>}
 {loading ? <CircularProgress /> : <DataTable columns={columns} data={admins} />}

 <Menu
 anchorEl={anchorEl}
 open={Boolean(anchorEl)}
 onClose={handleMenuClose}
 PaperProps={{ sx: { minWidth: 160, borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' } }}
 >
 <MenuItem onClick={handleMenuClose}><Visibility fontSize="small" className="mr-2 text-textSecondary"/> View Profile</MenuItem>
 <MenuItem onClick={handleMenuClose}><Edit fontSize="small" className="mr-2 text-textSecondary"/> Edit Admin</MenuItem>
 <MenuItem onClick={handleMenuClose}><Block fontSize="small" className="mr-2 text-textSecondary"/> Disable</MenuItem>
 <MenuItem onClick={handleMenuClose}><LockReset fontSize="small" className="mr-2 text-textSecondary"/> Reset Password</MenuItem>
 </Menu>

 {/* Create Admin Modal */}
 <Dialog open={isModalOpen} onClose={() => setIsModalOpen(false)} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: '12px' } }}>
 <DialogTitle className="font-bold border-b border-borderLight">Create New Sub Admin</DialogTitle>
 <DialogContent className="pt-6 space-y-4">
 <Typography variant="body2" className="text-textSecondary mb-4">
 Create a sub admin with restricted module access.
 </Typography>
 {formError && <Alert severity="error">{formError}</Alert>}
 <TextField fullWidth name="name" label="Full Name" size="small" value={formData.name} onChange={handleInputChange} />
 <TextField fullWidth name="email" label="Email Address" type="email" size="small" value={formData.email} onChange={handleInputChange} />
 <TextField fullWidth name="password" label="Temporary Password" type="password" size="small" value={formData.password} onChange={handleInputChange} />
 <TextField fullWidth name="passwordConfirm" label="Confirm Password" type="password" size="small" value={formData.passwordConfirm} onChange={handleInputChange} />
 </DialogContent>
 <DialogActions className="p-4 border-t border-borderLight">
 <Button onClick={() => setIsModalOpen(false)} color="inherit" className="font-semibold" disabled={formLoading}>Cancel</Button>
 <Button onClick={handleCreateAdmin} variant="contained" color="primary" disableElevation className="rounded-btn font-semibold" disabled={formLoading}>
 {formLoading ? <CircularProgress size={24} /> : 'Create Sub Admin'}
 </Button>
 </DialogActions>
 </Dialog>
 </Box>
 );
};

export default AdminManagementPage;

