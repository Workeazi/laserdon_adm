import React, { useState } from 'react';
import { Box, Typography, TextField, Button, Switch, FormControlLabel } from '@mui/material';

const SecurityTab = () => {
 const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);

 return (
 <Box className="space-y-6 max-w-3xl">
 <Box>
 <Typography variant="h5" className="font-bold text-textPrimary mb-1">Security</Typography>
 <Typography variant="body2" className="text-textSecondary">Manage your password, two-factor authentication, and active sessions.</Typography>
 </Box>

 {/* Change Password Section */}
 <Box className="bg-card border border-borderLight rounded-xl overflow-hidden">
 <Box className="px-6 py-5 border-b border-borderLight">
 <Typography variant="subtitle1" className="font-semibold text-textPrimary">Change Password</Typography>
 </Box>
 <Box className="p-6 space-y-5">
 <TextField fullWidth type="password" label="Current Password" size="small" />
 <TextField fullWidth type="password" label="New Password" size="small" />
 <TextField fullWidth type="password" label="Confirm Password" size="small" />
 </Box>
 <Box className="px-6 py-4 bg-gray-50 border-t border-borderLight flex justify-end">
 <Button variant="contained" color="primary" disableElevation className="rounded-btn">Update Password</Button>
 </Box>
 </Box>

 {/* Two-Factor Authentication Section */}
 <Box className="bg-card border border-borderLight rounded-xl overflow-hidden">
 <Box className="px-6 py-5 flex items-center justify-between">
 <Box>
 <Typography variant="subtitle1" className="font-semibold text-textPrimary">Two-Factor Authentication (2FA)</Typography>
 <Typography variant="body2" className="text-textSecondary mt-1">Add an extra layer of security to your account.</Typography>
 </Box>
 <Switch 
 checked={twoFactorEnabled} 
 onChange={(e) => setTwoFactorEnabled(e.target.checked)} 
 color="primary" 
 />
 </Box>
 </Box>

 {/* Session Management Section */}
 <Box className="bg-card border border-borderLight rounded-xl overflow-hidden">
 <Box className="px-6 py-5 border-b border-borderLight">
 <Typography variant="subtitle1" className="font-semibold text-textPrimary">Session Management</Typography>
 <Typography variant="body2" className="text-textSecondary mt-1">Review devices that are currently logged into your account.</Typography>
 </Box>
 <Box className="p-6">
 <div className="flex items-center justify-between mb-4">
 <div>
 <Typography variant="body2" className="font-medium text-textPrimary">Windows • Chrome</Typography>
 <Typography variant="caption" className="text-textSecondary">Active now • Mumbai, India</Typography>
 </div>
 <Typography variant="caption" className="text-success font-medium bg-green-50 px-2 py-1 rounded">Current</Typography>
 </div>
 <div className="flex items-center justify-between border-t border-borderLight pt-4">
 <div>
 <Typography variant="body2" className="font-medium text-textPrimary">MacBook Pro • Safari</Typography>
 <Typography variant="caption" className="text-textSecondary">Last seen 2 days ago • Delhi, India</Typography>
 </div>
 <Button variant="outlined" color="error" size="small" className="rounded-btn text-xs py-1">Revoke</Button>
 </div>
 </Box>
 <Box className="px-6 py-4 bg-gray-50 border-t border-borderLight flex justify-end">
 <Button variant="outlined" color="error" className="rounded-btn">Sign out of all devices</Button>
 </Box>
 </Box>
 </Box>
 );
};

export default SecurityTab;

