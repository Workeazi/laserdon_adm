import React from 'react';
import { Box, Typography, TextField, Button, MenuItem } from '@mui/material';

const PlatformTab = () => {
 return (
 <Box className="space-y-6 max-w-3xl">
 <Box>
 <Typography variant="h5" className="font-bold text-textPrimary mb-1">Platform Settings</Typography>
 <Typography variant="body2" className="text-textSecondary">Manage core platform defaults, support contacts, and fees.</Typography>
 </Box>

 <Box className="bg-card border border-borderLight rounded-xl overflow-hidden">
 <Box className="px-6 py-5 border-b border-borderLight">
 <Typography variant="subtitle1" className="font-semibold text-textPrimary">General Details</Typography>
 </Box>
 <Box className="p-6 space-y-5">
 <TextField fullWidth label="Platform Name" defaultValue="LaserDon" size="small" />
 <TextField fullWidth label="Support Email" defaultValue="support@laserdon.com" size="small" />
 <TextField fullWidth label="Support Phone" defaultValue="+91 1800 123 4567" size="small" />
 
 <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
 <TextField fullWidth label="Platform Fee (%)" defaultValue="5.00" type="number" size="small" />
 <TextField fullWidth label="Currency" select defaultValue="INR" size="small">
 <MenuItem value="INR">INR (₹)</MenuItem>
 <MenuItem value="USD">USD ($)</MenuItem>
 </TextField>
 </div>
 </Box>
 <Box className="px-6 py-4 bg-gray-50 border-t border-borderLight flex justify-end">
 <Button variant="contained" color="primary" disableElevation className="rounded-btn">Save Changes</Button>
 </Box>
 </Box>
 </Box>
 );
};

export default PlatformTab;

