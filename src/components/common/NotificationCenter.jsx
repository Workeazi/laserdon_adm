import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
 Notifications, 
 Storefront,
 Factory,
 Description,
 CheckCircle,
 Cancel,
 Warning
} from '@mui/icons-material';
import { IconButton, Badge, Menu, MenuItem, Typography, Box, Divider, Avatar } from '@mui/material';
import toast from 'react-hot-toast';
import { supabase } from '../../config/supabaseClient';

const timeAgo = (dateParam) => {
 if (!dateParam) return '';
 const date = typeof dateParam === 'object' ? dateParam : new Date(dateParam);
 const today = new Date();
 const seconds = Math.round((today - date) / 1000);
 const minutes = Math.round(seconds / 60);
 const hours = Math.round(minutes / 60);
 const days = Math.round(hours / 24);

 if (seconds < 60) return 'Just now';
 if (minutes < 60) return `${minutes} min ago`;
 if (hours < 24) return `${hours} hr ago`;
 return `${days} days ago`;
};

const NotificationCenter = () => {
 const navigate = useNavigate();
 const [notifications, setNotifications] = useState([]);
 const [unreadCount, setUnreadCount] = useState(0);
 const [anchorEl, setAnchorEl] = useState(null);
 const open = Boolean(anchorEl);

 const getNotificationConfig = (notif) => {
 switch (notif.notif_type) {
 case 'vendor_registration':
 return {
 icon: <Avatar sx={{ width: 28, height: 28, fontSize: '0.875rem', bgcolor: '#3B82F6' }}>{(notif.company_name || 'V').charAt(0).toUpperCase()}</Avatar>,
 title: '📋 New Vendor Registration',
 mainText: `${notif.company_name} has submitted a registration request.`,
 subText: null,
 statusText: notif.status ? `Status: ${notif.status.charAt(0).toUpperCase() + notif.status.slice(1)}` : 'Status: Pending',
 iconColor: 'bg-transparent',
 path: `/vendors/${notif.id}`
 };
 case 'DOCUMENT_VERIFICATION':
 return {
 icon: <Avatar sx={{ width: 28, height: 28, fontSize: '0.875rem', bgcolor: '#3B82F6' }}>{(notif.company_name || 'V').charAt(0).toUpperCase()}</Avatar>,
 title: '📄 Document Verification Required',
 mainText: `${notif.company_name} has uploaded documents for verification.`,
 subText: null,
 statusText: 'Status: Uploaded',
 iconColor: 'bg-transparent',
 path: `/verify-docs`
 };
 case 'document_submission':
 return {
 icon: <Avatar sx={{ width: 28, height: 28, fontSize: '0.875rem', bgcolor: '#3B82F6' }}>{(notif.username || 'V').charAt(0).toUpperCase()}</Avatar>,
 title: 'Document Submitted',
 mainText: notif.username,
 subText: `${notif.document_type || 'Document'} Uploaded`,
 statusText: 'Pending Verification',
 iconColor: 'bg-transparent',
 path: `/verify-docs`
 };
 case 'vendor_approval':
 return {
 icon: <CheckCircle fontSize="small" />,
 title: 'Vendor Approved',
 mainText: notif.company_name,
 subText: null,
 iconColor: 'text-green-600 bg-green-100',
 path: `/vendors/${notif.id}`
 };
 case 'vendor_rejection':
 return {
 icon: <Cancel fontSize="small" />,
 title: 'Vendor Rejected',
 mainText: notif.company_name,
 subText: null,
 iconColor: 'text-red-600 bg-red-100',
 path: `/vendors/${notif.id}`
 };
 case 'document_verification':
 return {
 icon: <Avatar sx={{ width: 28, height: 28, fontSize: '0.875rem', bgcolor: '#10B981' }}>{(notif.username || 'V').charAt(0).toUpperCase()}</Avatar>,
 title: 'Document Verified',
 mainText: notif.username,
 subText: notif.document_type || 'Document',
 statusText: 'Approved',
 iconColor: 'bg-transparent',
 path: `/verify-docs`
 };
 case 'document_rejection':
 return {
 icon: <Avatar sx={{ width: 28, height: 28, fontSize: '0.875rem', bgcolor: '#EF4444' }}>{(notif.username || 'V').charAt(0).toUpperCase()}</Avatar>,
 title: 'Document Rejected',
 mainText: notif.username,
 subText: notif.document_type || 'Document',
 statusText: 'Rejected',
 iconColor: 'bg-transparent',
 path: `/verify-docs`
 };
 default:
 return {
 icon: <Notifications fontSize="small" />,
 title: 'Notification',
 mainText: notif.company_name || 'System',
 subText: null,
 iconColor: 'text-textSecondary bg-gray-100',
 path: '/notifications'
 };
 }
 };

 useEffect(() => {
 const fetchNotifications = async () => {
 const [pendingRes, uploadedRes] = await Promise.all([
 supabase
 .from('vendors')
 .select(`*, companies(id, short_name, company_address, company_gst_number)`)
 .eq('status', 'pending')
 .order('created_at', { ascending: false, nullsFirst: false }),
 supabase
 .from('vendors')
 .select(`*, companies(id, short_name, company_address, company_gst_number)`)
 .eq('document_status', 'uploaded')
 .order('updated_at', { ascending: false, nullsFirst: false })
 ]);

 let combined = [];

 if (!pendingRes.error && pendingRes.data) {
 pendingRes.data.forEach(v => {
 const companyName = v.companies?.short_name || v.username || 'Vendor';
 combined.push({ ...v, company_name: companyName, notif_type: 'vendor_registration', notif_id: `reg_${v.id}`, timestamp: v.created_at || v.updated_at });
 });
 }
 
 if (!uploadedRes.error && uploadedRes.data) {
 uploadedRes.data.forEach(v => {
 const companyName = v.companies?.short_name || v.username || 'Vendor';
 combined.push({ ...v, company_name: companyName, notif_type: 'DOCUMENT_VERIFICATION', notif_id: `doc_verif_${v.id}`, timestamp: v.updated_at });
 });
 }

 combined.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
 combined = combined.slice(0, 50);
 
 setNotifications(combined);
 setUnreadCount(combined.filter(n => n.notif_type === 'vendor_registration' || n.notif_type === 'DOCUMENT_VERIFICATION').length);
 };

 fetchNotifications();

 const regChannel = supabase
 .channel('vendor-registration-listener')
 .on(
 'postgres_changes',
 { event: '*', schema: 'public', table: 'vendors' },
 async (payload) => {
 fetchNotifications();

 if (payload.eventType === 'INSERT') {
 console.log('Vendor Insert Event:', payload);
 console.log('Vendor Status:', payload.new?.status);
 }

 const triggeredPending =
 (payload.eventType === 'INSERT' &&
 payload.new?.status === 'pending') ||
 (payload.eventType === 'UPDATE' &&
 payload.old?.status !== undefined &&
 payload.old?.status !== payload.new?.status &&
 payload.new?.status === 'pending');

 if (triggeredPending) {
 console.log('Vendor Registration Notification Triggered');
 console.log('Old Status:', payload.old?.status);
 console.log('New Status:', payload.new?.status);
 
 let companyName = payload.new.username || 'Vendor';
 if (payload.new.company_id) {
 const { data } = await supabase.from('companies').select('short_name').eq('id', payload.new.company_id).single();
 if (data?.short_name) companyName = data.short_name;
 }

 toast.custom((t) => (
 <div
 className={`${
 t.visible ? 'animate-enter' : 'animate-leave'
 } max-w-md w-full bg-card shadow-lg rounded-xl pointer-events-auto flex border border-borderLight cursor-pointer transition-transform`}
 onClick={() => {
 toast.dismiss(t.id);
 navigate('/notifications');
 }}
 >
 <div className="flex-1 w-0 p-4">
 <div className="flex items-start gap-3">
 <div className="flex-shrink-0 mt-0.5">
 <Avatar sx={{ width: 32, height: 32, fontSize: '1rem', bgcolor: '#3B82F6' }}>
 {(companyName || 'V').charAt(0).toUpperCase()}
 </Avatar>
 </div>
 <div className="flex-1 min-w-0">
 <p className="text-sm font-semibold text-slate-900 leading-snug">
 📋 New Vendor Registration
 </p>
 <p className="mt-1 text-[13px] font-medium text-slate-700 truncate">
 {companyName} has submitted a registration request.
 </p>
 </div>
 </div>
 </div>
 </div>
 ), { duration: 3000 });
 }
 }
 )
 .subscribe();

 const docChannel = supabase
 .channel('document-verification-listener')
 .on(
 'postgres_changes',
 { event: '*', schema: 'public', table: 'vendors' },
 async (payload) => {
 fetchNotifications();

 const docStatusChanged = payload.old?.document_status !== undefined && payload.old?.document_status !== payload.new?.document_status;

 if (payload.eventType === 'UPDATE' && docStatusChanged) {
 const newDocStatus = payload.new?.document_status;
 
 if (newDocStatus === 'uploaded') {
 console.log('Document Verification Notification Triggered');
 let companyName = payload.new?.username || 'Vendor';
 if (payload.new.company_id) {
 supabase.from('companies').select('short_name').eq('id', payload.new.company_id).single().then(({ data }) => {
 if (data?.short_name) companyName = data.short_name;
 showDocToast(companyName);
 });
 } else {
 showDocToast(companyName);
 }
 
 function showDocToast(cName) {
 toast.custom((t) => (
 <div
 className={`${
 t.visible ? 'animate-enter' : 'animate-leave'
 } max-w-md w-full bg-card shadow-lg rounded-xl pointer-events-auto flex border border-borderLight cursor-pointer transition-transform`}
 onClick={() => {
 toast.dismiss(t.id);
 navigate('/verify-docs');
 }}
 >
 <div className="flex-1 w-0 p-4">
 <div className="flex items-start gap-3">
 <div className="flex-shrink-0 mt-0.5">
 <Avatar sx={{ width: 32, height: 32, fontSize: '1rem', bgcolor: '#3B82F6' }}>
 {(cName || 'V').charAt(0).toUpperCase()}
 </Avatar>
 </div>
 <div className="flex-1 min-w-0">
 <p className="text-sm font-semibold text-slate-900 leading-snug">
 📄 Document Verification Required
 </p>
 <p className="mt-1 text-[13px] font-medium text-slate-700 truncate">
 {cName} has uploaded documents for verification.
 </p>
 </div>
 </div>
 </div>
 </div>
 ), { duration: 3000 });
 }
 } else if (newDocStatus === 'verified') {
 toast.success('Documents verified successfully');
 } else if (newDocStatus === 'rejected') {
 toast.error('Documents rejected');
 }
 }
 }
 )
 .subscribe();

 return () => {
 supabase.removeChannel(regChannel);
 supabase.removeChannel(docChannel);
 };
 }, [navigate]);

 const handleClick = (event) => {
 setAnchorEl(event.currentTarget);
 };

 const handleClose = () => {
 setAnchorEl(null);
 };

 const handleNotificationClick = (notif) => {
 handleClose();
 const config = getNotificationConfig(notif);
 if (config.path) {
 navigate(config.path);
 }
 };

 return (
 <>
 <IconButton size="small" onClick={handleClick}>
 <Badge badgeContent={unreadCount} color="error">
 <Notifications className="text-textSecondary" />
 </Badge>
 </IconButton>

 <Menu
 anchorEl={anchorEl}
 open={open}
 onClose={handleClose}
 transformOrigin={{ horizontal: 'right', vertical: 'top' }}
 anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
 PaperProps={{
 elevation: 0,
 sx: {
 overflow: 'visible',
 filter: 'drop-shadow(0px 10px 25px rgba(0,0,0,0.1))',
 mt: 1.5,
 width: 340,
 maxHeight: 480,
 borderRadius: '12px',
 border: '1px solid var(--border-color)',
 '&:before': {
 content: '""',
 display: 'block',
 position: 'absolute',
 top: 0,
 right: 14,
 width: 10,
 height: 10,
 bgcolor: 'background.paper',
 transform: 'translateY(-50%) rotate(45deg)',
 zIndex: 0,
 borderLeft: '1px solid var(--border-color)',
 borderTop: '1px solid var(--border-color)',
 },
 },
 }}
 >
 <Box className="px-4 py-3 flex justify-between items-center bg-card rounded-t-xl border-b border-borderLight">
 <Typography variant="subtitle1" className="font-semibold text-textPrimary text-[15px]">
 Notifications ({unreadCount})
 </Typography>
 </Box>

 {(!notifications || notifications.length === 0) ? (
 <Box className="px-4 py-12 text-center">
 <Notifications sx={{ fontSize: 32 }} className="text-textSecondary mb-2" />
 <Typography variant="body2" className="text-textSecondary">
 No pending requests.
 </Typography>
 </Box>
 ) : (
 <Box sx={{ pb: 1, maxHeight: 400, overflowY: 'auto' }}>
 {/* Section 1: Vendor Registrations */}
 {notifications.filter(n => n.notif_type === 'vendor_registration').length > 0 && (
 <>
 <Box className="px-4 py-2 bg-black/5 dark:bg-white/5 border-b border-borderLight">
 <Typography variant="caption" className="font-bold text-textSecondary uppercase tracking-widest">
 Vendor Registration Requests ({notifications.filter(n => n.notif_type === 'vendor_registration').length})
 </Typography>
 </Box>
 {notifications.filter(n => n.notif_type === 'vendor_registration').map((notif, index, arr) => {
 const config = getNotificationConfig(notif);
 return (
 <MenuItem 
 key={notif.notif_id}
 onClick={() => handleNotificationClick(notif)} 
 sx={{
 py: 1.75,
 px: 2,
 display: 'flex',
 alignItems: 'flex-start',
 gap: 1.5,
 borderBottom: index < arr.length - 1 ? '1px solid var(--border-color)' : 'none',
 transition: 'all 0.2s ease',
 }}
 className="hover:bg-black/5 dark:hover:bg-white/5"
 >
 <Box className={`p-1.5 rounded-md flex-shrink-0 mt-0.5 ${config.iconColor}`}>
 {config.icon}
 </Box>
 <Box sx={{ flex: 1, minWidth: 0 }}>
 <Typography className="font-semibold text-textPrimary text-[14px] leading-tight">
 {config.title}
 </Typography>
 <Typography className="text-textSecondary text-[13px] mt-1 font-medium truncate">
 {config.mainText}
 </Typography>
 </Box>
 <Typography className="text-textSecondary text-[12px] whitespace-nowrap mt-1">
 {timeAgo(notif.timestamp)}
 </Typography>
 </MenuItem>
 );
 })}
 </>
 )}

 {/* Section 2: Document Verifications */}
 {notifications.filter(n => n.notif_type === 'DOCUMENT_VERIFICATION').length > 0 && (
 <>
 <Box className="px-4 py-2 bg-black/5 dark:bg-white/5 border-y border-borderLight">
 <Typography variant="caption" className="font-bold text-textSecondary uppercase tracking-widest">
 Document Verification Requests ({notifications.filter(n => n.notif_type === 'DOCUMENT_VERIFICATION').length})
 </Typography>
 </Box>
 {notifications.filter(n => n.notif_type === 'DOCUMENT_VERIFICATION').map((notif, index, arr) => {
 const config = getNotificationConfig(notif);
 return (
 <MenuItem 
 key={notif.notif_id}
 onClick={() => handleNotificationClick(notif)} 
 sx={{
 py: 1.75,
 px: 2,
 display: 'flex',
 alignItems: 'flex-start',
 gap: 1.5,
 borderBottom: index < arr.length - 1 ? '1px solid var(--border-color)' : 'none',
 transition: 'all 0.2s ease',
 }}
 className="hover:bg-black/5 dark:hover:bg-white/5"
 >
 <Box className={`p-1.5 rounded-md flex-shrink-0 mt-0.5 ${config.iconColor}`}>
 {config.icon}
 </Box>
 <Box sx={{ flex: 1, minWidth: 0 }}>
 <Typography className="font-semibold text-textPrimary text-[14px] leading-tight">
 {config.title}
 </Typography>
 <Typography className="text-textSecondary text-[13px] mt-1 font-medium truncate">
 {config.mainText}
 </Typography>
 </Box>
 <Typography className="text-textSecondary text-[12px] whitespace-nowrap mt-1">
 {timeAgo(notif.timestamp)}
 </Typography>
 </MenuItem>
 );
 })}
 </>
 )}
 </Box>
 )}
 </Menu>
 </>
 );
};

export default NotificationCenter;


