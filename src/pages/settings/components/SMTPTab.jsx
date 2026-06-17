import React from 'react';
import { Box, Typography, TextField, Button } from '@mui/material';

const SMTPTab = () => {
 return (
 <Box className="space-y-6 max-w-3xl">
 <Box>
 <Typography variant="h5" className="font-bold text-textPrimary mb-1">SMTP Configuration</Typography>
 <Typography variant="body2" className="text-textSecondary">Configure your email provider to send system emails and notifications.</Typography>
 </Box>

 <Box className="bg-card border border-borderLight rounded-xl overflow-hidden">
 <Box className="px-6 py-5 border-b border-borderLight">
 <Typography variant="subtitle1" className="font-semibold text-textPrimary">Server Settings</Typography>
 </Box>
 <Box className="p-6 space-y-5">
 <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
 <TextField fullWidth label="SMTP Host" defaultValue="smtp.sendgrid.net" size="small" />
 <TextField fullWidth label="SMTP Port" defaultValue="587" size="small" />
 </div>
 <TextField fullWidth label="Username" defaultValue="apikey" size="small" />
 <TextField fullWidth type="password" label="Password" defaultValue="********" size="small" />
 <TextField fullWidth label="Sender Email" defaultValue="no-reply@laserdon.com" size="small" />
 </Box>
 <Box className="px-6 py-4 bg-gray-50 border-t border-borderLight flex items-center justify-between">
 <Button variant="outlined" color="secondary" className="rounded-btn text-gray-700 border-gray-300">Test Connection</Button>
 <Button variant="contained" color="primary" disableElevation className="rounded-btn">Save Settings</Button>
 </Box>
 </Box>
 </Box>
 );
};

export default SMTPTab;

