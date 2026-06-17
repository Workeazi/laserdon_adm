import React, { useState } from 'react';
import { Box, Typography, TextField, Button, Switch } from '@mui/material';

const SupabaseTab = () => {
 const [realtimeEnabled, setRealtimeEnabled] = useState(true);

 return (
 <Box className="space-y-6 max-w-3xl">
 <Box>
 <Typography variant="h5" className="font-bold text-textPrimary mb-1">Supabase Credentials</Typography>
 <Typography variant="body2" className="text-textSecondary">Configure your BaaS connection for database, auth, and storage.</Typography>
 </Box>

 <Box className="bg-card border border-borderLight rounded-xl overflow-hidden">
 <Box className="px-6 py-5 border-b border-borderLight">
 <Typography variant="subtitle1" className="font-semibold text-textPrimary">Project Connection</Typography>
 </Box>
 <Box className="p-6 space-y-5">
 <TextField fullWidth label="Project URL" defaultValue="https://xxxx.supabase.co" size="small" />
 <TextField fullWidth type="password" label="Anon Key" defaultValue="********" size="small" />
 <TextField fullWidth type="password" label="Service Role Key (Backend Only)" defaultValue="********" size="small" />
 <TextField fullWidth label="Default Storage Bucket" defaultValue="laserdon-assets" size="small" />
 
 <Box className="flex items-center justify-between pt-2">
 <Box>
 <Typography variant="body2" className="font-medium text-textPrimary">Enable Realtime Subscriptions</Typography>
 <Typography variant="caption" className="text-textSecondary">Listen to Postgres changes on the client-side.</Typography>
 </Box>
 <Switch 
 checked={realtimeEnabled} 
 onChange={(e) => setRealtimeEnabled(e.target.checked)} 
 color="primary" 
 />
 </Box>
 </Box>
 <Box className="px-6 py-4 bg-gray-50 border-t border-borderLight flex justify-end">
 <Button variant="contained" color="primary" disableElevation className="rounded-btn">Save Settings</Button>
 </Box>
 </Box>
 </Box>
 );
};

export default SupabaseTab;

