import React from 'react';
import { Box, Card, CardContent, Typography, TextField, Button, Avatar, Divider, Switch, FormControlLabel } from '@mui/material';
import PageHeader from '../../components/common/PageHeader';

const AdminProfilePage = () => {
 return (
 <Box className="pb-8 space-y-6">
 <PageHeader 
 title="Admin Profile" 
 breadcrumbs={[{ label: 'Dashboard', path: '/' }, { label: 'Profile' }]} 
 />

 <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
 
 {/* Left Col: Personal Info & Photo */}
 <div className="lg:col-span-1 space-y-6">
 <Card className="rounded-card border border-borderLight shadow-sm">
 <CardContent className="p-6 text-center">
 <Avatar 
 src="https://i.pravatar.cc/150?img=11" 
 sx={{ width: 100, height: 100, mx: 'auto', mb: 2 }}
 />
 <Typography variant="h6" className="font-bold">Super Admin</Typography>
 <Typography variant="body2" className="text-textSecondary mb-4">admin@laserdon.com</Typography>
 <Button variant="outlined" size="small" className="rounded-btn">
 Change Photo
 </Button>
 </CardContent>
 </Card>
 
 <Card className="rounded-card border border-borderLight shadow-sm">
 <CardContent className="p-6">
 <Typography variant="h6" className="font-bold mb-4 text-textPrimary">Personal Information</Typography>
 <form className="space-y-4">
 <TextField fullWidth label="Full Name" defaultValue="Super Admin" size="small" />
 <TextField fullWidth label="Email Address" defaultValue="admin@laserdon.com" size="small" disabled />
 <TextField fullWidth label="Role" defaultValue="Super Admin" size="small" disabled />
 <Button variant="contained" color="primary" disableElevation className="rounded-btn w-full">
 Save Changes
 </Button>
 </form>
 </CardContent>
 </Card>
 </div>

 {/* Right Col: Change Password & Security */}
 <div className="lg:col-span-2 space-y-6">
 <Card className="rounded-card border border-borderLight shadow-sm">
 <CardContent className="p-6">
 <Typography variant="h6" className="font-bold mb-4 text-textPrimary">Change Password</Typography>
 <form className="space-y-4 max-w-md">
 <TextField fullWidth label="Current Password" type="password" size="small" />
 <TextField fullWidth label="New Password" type="password" size="small" />
 <TextField fullWidth label="Confirm New Password" type="password" size="small" />
 <Button variant="contained" color="primary" disableElevation className="rounded-btn">
 Update Password
 </Button>
 </form>
 </CardContent>
 </Card>

 <Card className="rounded-card border border-borderLight shadow-sm">
 <CardContent className="p-6">
 <Typography variant="h6" className="font-bold mb-4 text-textPrimary">Security Settings</Typography>
 <div className="space-y-4">
 <div className="flex items-center justify-between">
 <div>
 <Typography variant="subtitle2" className="font-bold text-textPrimary">Two-Factor Authentication (2FA)</Typography>
 <Typography variant="body2" className="text-textSecondary">Add an extra layer of security to your account.</Typography>
 </div>
 <FormControlLabel control={<Switch defaultChecked color="primary" />} label="" />
 </div>
 <Divider />
 <div className="flex items-center justify-between">
 <div>
 <Typography variant="subtitle2" className="font-bold text-textPrimary">Login Notifications</Typography>
 <Typography variant="body2" className="text-textSecondary">Get an email when a new device logs in.</Typography>
 </div>
 <FormControlLabel control={<Switch color="primary" />} label="" />
 </div>
 </div>
 </CardContent>
 </Card>
 </div>

 </div>
 </Box>
 );
};

export default AdminProfilePage;

