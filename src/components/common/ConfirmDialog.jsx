import React from 'react';
import { 
 Dialog, 
 DialogTitle, 
 DialogContent, 
 DialogContentText, 
 DialogActions, 
 Button, 
 TextField 
} from '@mui/material';

const ConfirmDialog = ({ 
 open, 
 title, 
 message, 
 onConfirm, 
 onCancel, 
 confirmLabel = 'Confirm', 
 confirmColor = 'primary',
 requiresReason = false,
 reasonLabel = 'Reason',
 reasonValue = '',
 onReasonChange = () => {}
}) => {
 return (
 <Dialog open={open} onClose={onCancel} maxWidth="xs" fullWidth PaperProps={{ sx: { borderRadius: '12px' } }}>
 <DialogTitle className="font-bold text-textPrimary">{title}</DialogTitle>
 <DialogContent>
 <DialogContentText className="text-textSecondary mb-4">
 {message}
 </DialogContentText>
 {requiresReason && (
 <TextField
 autoFocus
 margin="dense"
 label={reasonLabel}
 type="text"
 fullWidth
 variant="outlined"
 value={reasonValue}
 onChange={(e) => onReasonChange(e.target.value)}
 multiline
 rows={3}
 />
 )}
 </DialogContent>
 <DialogActions className="px-6 pb-6">
 <Button onClick={onCancel} color="inherit" className="text-textSecondary">
 Cancel
 </Button>
 <Button 
 onClick={onConfirm} 
 color={confirmColor} 
 variant="contained" 
 disableElevation
 disabled={requiresReason && !reasonValue.trim()}
 className="rounded-btn"
 >
 {confirmLabel}
 </Button>
 </DialogActions>
 </Dialog>
 );
};

export default ConfirmDialog;

