import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import { InboxOutlined } from '@mui/icons-material';

const EmptyState = ({ 
 title = 'No data found', 
 description = 'There are no records to display at this moment.', 
 icon = <InboxOutlined sx={{ fontSize: 64, color: 'text.secondary', opacity: 0.5 }} />,
 actionLabel,
 onAction 
}) => {
 return (
 <Box className="flex flex-col items-center justify-center p-12 text-center bg-card rounded-card border border-borderLight shadow-sm my-4">
 <div className="mb-4">
 {icon}
 </div>
 <Typography variant="h6" className="font-bold text-textPrimary mb-2">
 {title}
 </Typography>
 <Typography variant="body2" className="text-textSecondary max-w-sm mx-auto mb-6">
 {description}
 </Typography>
 
 {actionLabel && onAction && (
 <Button variant="contained" color="primary" onClick={onAction} disableElevation className="rounded-btn px-6 py-2">
 {actionLabel}
 </Button>
 )}
 </Box>
 );
};

export default EmptyState;

