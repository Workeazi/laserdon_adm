import React from 'react';
import { Box, Typography, Button } from '@mui/material';

const IntegrationsTab = () => {
 return (
 <Box className="space-y-6 max-w-3xl">
 <Box>
 <Typography variant="h5" className="font-bold text-textPrimary mb-1">Integrations</Typography>
 <Typography variant="body2" className="text-textSecondary">Manage third-party service connections and API keys.</Typography>
 </Box>

 <Box className="bg-card border border-borderLight rounded-xl overflow-hidden p-12 text-center flex flex-col items-center justify-center">
 <Typography variant="subtitle1" className="font-semibold text-textPrimary mb-2">No Active Integrations</Typography>
 <Typography variant="body2" className="text-textSecondary mb-6 max-w-md">
 You haven't connected any external services yet. Stripe and Slack integrations are coming soon.
 </Typography>
 <Button variant="outlined" color="primary" className="rounded-btn" disabled>Browse Integrations</Button>
 </Box>
 </Box>
 );
};

export default IntegrationsTab;

