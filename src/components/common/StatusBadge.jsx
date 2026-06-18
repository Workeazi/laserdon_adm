import React from 'react';
import { Chip, useTheme } from '@mui/material';

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

const getCustomStyles = (color) => {
  switch (color) {
    case 'warning': return { bgcolor: '#FEF3C7', color: '#B45309', darkBg: '#78350F', darkColor: '#FDE68A' }; // Amber
    case 'success': return { bgcolor: '#D1FAE5', color: '#047857', darkBg: '#064E3B', darkColor: '#A7F3D0' }; // Emerald
    case 'error': return { bgcolor: '#FEE2E2', color: '#B91C1C', darkBg: '#7F1D1D', darkColor: '#FECACA' }; // Red
    case 'info': return { bgcolor: '#DBEAFE', color: '#1D4ED8', darkBg: '#1E3A8A', darkColor: '#BFDBFE' }; // Blue
    default: return { bgcolor: '#F1F5F9', color: '#475569', darkBg: '#0F172A', darkColor: '#94A3B8' }; // Slate
  }
};

const StatusBadge = ({ status, module }) => {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  
  const color = getStatusColor(status, module);
  const styles = getCustomStyles(color);
  
  // Format text (e.g., in_production -> In Production)
  const formattedStatus = status ? status.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()) : 'Unknown';

  return (
    <Chip 
      label={formattedStatus} 
      size="small" 
      sx={{ 
        fontWeight: 600, 
        fontSize: '0.75rem', 
        borderRadius: '6px',
        bgcolor: isDark ? styles.darkBg : styles.bgcolor,
        color: isDark ? styles.darkColor : styles.color,
        border: 'none'
      }} 
    />
  );
};

export default StatusBadge;
