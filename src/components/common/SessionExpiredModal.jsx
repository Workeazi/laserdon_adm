import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button, Box } from '@mui/material';
import { TimerOff } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const SessionExpiredModal = ({ open, onClose }) => {
 const navigate = useNavigate();

 const handleLogin = () => {
 localStorage.removeItem('isAuthenticated');
 localStorage.removeItem('admin');
 onClose();
 navigate('/login');
 };

 return (
 <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth PaperProps={{ sx: { borderRadius: '12px', textAlign: 'center' } }}>
 <Box className="pt-6 pb-2">
 <TimerOff sx={{ fontSize: 60, color: 'warning.main', mb: 2 }} />
 </Box>
 <DialogTitle className="font-bold text-textPrimary pt-0">Session Expired</DialogTitle>
 <DialogContent>
 <DialogContentText className="text-textSecondary">
 Your session has expired.<br />Please login again.
 </DialogContentText>
 </DialogContent>
 <DialogActions className="justify-center px-6 pb-6">
 <Button 
 onClick={handleLogin} 
 color="primary" 
 variant="contained" 
 disableElevation
 fullWidth
 className="rounded-btn py-2"
 >
 Go To Login
 </Button>
 </DialogActions>
 </Dialog>
 );
};

export default SessionExpiredModal;

