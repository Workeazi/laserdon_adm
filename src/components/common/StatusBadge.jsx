import React from 'react';
import { Chip } from '@mui/material';

const getStatusColor = (status, module) => {
 const s = status?.toLowerCase();
 
 if (module === 'vendor') {
 if (s === 'pending') return 'warning';
 if (s === 'verified') return 'success';
 if (s === 'rejected') return 'error';
 if (s === 'suspended') return 'default';
 }
 
 if (module === 'order') {
 if (s === 'confirmed') return 'info';
 if (s === 'in_production') return 'warning';
 if (s === 'quality_check') return 'warning';
 if (s === 'shipped') return 'info';
 if (s === 'delivered') return 'success';
 if (s === 'cancelled') return 'error';
 }
 
 if (module === 'payment') {
 if (s === 'pending') return 'warning';
 if (s === 'success') return 'success';
 if (s === 'failed') return 'error';
 if (s === 'refunded') return 'default';
 }
 
 if (module === 'dispute') {
 if (s === 'open') return 'error';
 if (s === 'under_review') return 'warning';
 if (s === 'resolved') return 'success';
 if (s === 'closed') return 'default';
 }

 // Fallback
 return 'default';
};

const StatusBadge = ({ status, module }) => {
 const color = getStatusColor(status, module);
 // Format text (e.g., in_production -> In Production)
 const formattedStatus = status ? status.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()) : 'Unknown';

 return (
 <Chip 
 label={formattedStatus} 
 color={color} 
 size="small" 
 sx={{ fontWeight: 600, fontSize: '0.75rem', borderRadius: '6px' }} 
 />
 );
};

export default StatusBadge;

