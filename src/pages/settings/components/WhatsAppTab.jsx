import React from 'react';
import { Box, Typography, TextField, Button } from '@mui/material';

const WhatsAppTab = () => {
 return (
 <Box className="space-y-6 max-w-3xl">
 <Box>
 <Typography variant="h5" className="font-bold text-textPrimary mb-1">WhatsApp Integration</Typography>
 <Typography variant="body2" className="text-textSecondary">Configure WhatsApp Business API for transactional messaging and updates.</Typography>
 </Box>

 <Box className="bg-card border border-borderLight rounded-xl overflow-hidden">
 <Box className="px-6 py-5 border-b border-borderLight">
 <Typography variant="subtitle1" className="font-semibold text-textPrimary">API Credentials</Typography>
 </Box>
 <Box className="p-6 space-y-5">
 <TextField fullWidth label="Meta Business ID" placeholder="Enter your Meta Business ID" size="small" />
 <TextField fullWidth label="Phone Number ID" placeholder="Enter your registered WhatsApp Phone Number ID" size="small" />
 <TextField fullWidth type="password" label="System User Access Token" placeholder="Paste your permanent access token" size="small" />
 <TextField fullWidth label="Webhook Verification Token" placeholder="Enter webhook verification token" size="small" />
 <TextField fullWidth label="Webhook URL" defaultValue="https://api.laserdon.com/v1/webhooks/whatsapp" size="small" disabled />
 </Box>
 <Box className="px-6 py-4 bg-gray-50 border-t border-borderLight flex items-center justify-between">
 <Button variant="outlined" color="secondary" className="rounded-btn text-gray-700 border-gray-300">Test Connection</Button>
 <Button variant="contained" color="primary" disableElevation className="rounded-btn">Save Settings</Button>
 </Box>
 </Box>
 </Box>
 );
};

export default WhatsAppTab;

