import React from 'react';
import { Box, Typography, TextField, Button, Avatar } from '@mui/material';

const ProfileTab = () => {
 return (
 <Box className="space-y-6 max-w-3xl">
 <Box>
 <Typography variant="h5" className="font-bold text-textPrimary mb-1">Profile</Typography>
 <Typography variant="body2" className="text-textSecondary">Manage your personal information and account avatar.</Typography>
 </Box>

 {/* Avatar Section */}
 <Box className="bg-card border border-borderLight rounded-xl p-6 flex items-start space-x-6">
 <Avatar src="https://i.pravatar.cc/150?img=11" sx={{ width: 80, height: 80 }} />
 <Box>
 <Typography variant="subtitle1" className="font-semibold text-textPrimary mb-2">Avatar</Typography>
 <Typography variant="body2" className="text-textSecondary mb-4">Upload a new avatar. Recommended size 256x256px.</Typography>
 <div className="flex space-x-3">
 <Button variant="outlined" color="primary" size="small" className="rounded-btn">Upload Image</Button>
 <Button variant="text" color="error" size="small" className="rounded-btn">Remove</Button>
 </div>
 </Box>
 </Box>

 {/* Profile Information Section */}
 <Box className="bg-card border border-borderLight rounded-xl overflow-hidden">
 <Box className="px-6 py-5 border-b border-borderLight">
 <Typography variant="subtitle1" className="font-semibold text-textPrimary">Profile Information</Typography>
 </Box>
 <Box className="p-6 space-y-5">
 <Box className="grid grid-cols-1 md:grid-cols-2 gap-5">
 <TextField fullWidth label="Full Name" defaultValue="Super Admin" size="small" />
 <TextField fullWidth label="Role" defaultValue="Administrator" size="small" disabled />
 </Box>
 <TextField fullWidth label="Email Address" defaultValue="admin@laserdon.com" size="small" />
 </Box>
 <Box className="px-6 py-4 bg-gray-50 border-t border-borderLight flex justify-end">
 <Button variant="contained" color="primary" disableElevation className="rounded-btn">Save Changes</Button>
 </Box>
 </Box>
 </Box>
 );
};

export default ProfileTab;

