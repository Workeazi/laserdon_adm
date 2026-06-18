import React, { useState, useEffect, useRef } from 'react';
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

 // Refs for tracking previously notified records to prevent duplicates
 const notifiedVendorRef = useRef(new Map());
 const notifiedDocRef = useRef(new Map());
 const isInitialLoad = useRef(true);

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

  const showVendorToast = (vendor) => {
    const companyName = vendor.companies?.short_name || vendor.username || 'Vendor';
    toast.custom((t) => (
      <div
        className={`${
          t.visible ? 'animate-enter' : 'animate-leave'
        } max-w-md w-full bg-white/90 dark:bg-slate-900/90 backdrop-blur-md shadow-xl rounded-xl pointer-events-auto flex border border-borderLight cursor-pointer transition-transform`}
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
              <p className="text-sm font-semibold text-slate-900 dark:text-slate-100 leading-snug">
                New Vendor Registration
              </p>
              <p className="mt-1 text-[13px] font-medium text-slate-700 dark:text-slate-300 truncate">
                {companyName} has submitted a registration request.
              </p>
            </div>
          </div>
        </div>
      </div>
    ), { duration: 3000, position: 'top-right' });
  };

  const showDocToast = (vendor) => {
    const companyName = vendor.companies?.short_name || vendor.username || 'Vendor';
    toast.custom((t) => (
      <div
        className={`${
          t.visible ? 'animate-enter' : 'animate-leave'
        } max-w-md w-full bg-white/90 dark:bg-slate-900/90 backdrop-blur-md shadow-xl rounded-xl pointer-events-auto flex border border-borderLight cursor-pointer transition-transform`}
        onClick={() => {
          toast.dismiss(t.id);
          navigate('/verify-docs');
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
              <p className="text-sm font-semibold text-slate-900 dark:text-slate-100 leading-snug">
                Document Verification Required
              </p>
              <p className="mt-1 text-[13px] font-medium text-slate-700 dark:text-slate-300 truncate">
                {companyName} has uploaded documents for verification.
              </p>
            </div>
          </div>
        </div>
      </div>
    ), { duration: 3000, position: 'top-right' });
  };

  useEffect(() => {
    let intervalId;

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
        const currentPendingIds = new Set();
        pendingRes.data.forEach(v => {
          currentPendingIds.add(v.id);
          const isNewStatus = !notifiedVendorRef.current.has(v.id) || notifiedVendorRef.current.get(v.id) !== v.status;
          
          if (!isInitialLoad.current && isNewStatus) {
            console.log('Vendor Popup Check:', v);
            console.log('Popup Triggered:', v.id);
            showVendorToast(v);
          }
          notifiedVendorRef.current.set(v.id, v.status);
          
          const companyName = v.companies?.short_name || v.username || 'Vendor';
          combined.push({ ...v, company_name: companyName, notif_type: 'vendor_registration', notif_id: `reg_${v.id}`, timestamp: v.created_at || v.updated_at });
        });

        // Cleanup vendors that are no longer pending so they trigger again if status goes back to pending
        for (const id of notifiedVendorRef.current.keys()) {
          if (!currentPendingIds.has(id)) {
            notifiedVendorRef.current.delete(id);
          }
        }
      }
      
      if (!uploadedRes.error && uploadedRes.data) {
        const currentDocIds = new Set();
        uploadedRes.data.forEach(v => {
          currentDocIds.add(v.id);
          const isNewDocStatus = !notifiedDocRef.current.has(v.id) || notifiedDocRef.current.get(v.id) !== v.document_status;
          
          if (!isInitialLoad.current && isNewDocStatus) {
            console.log('Document Popup Check:', v);
            console.log('Popup Triggered:', v.id);
            showDocToast(v);
          }
          notifiedDocRef.current.set(v.id, v.document_status);

          const companyName = v.companies?.short_name || v.username || 'Vendor';
          combined.push({ ...v, company_name: companyName, notif_type: 'DOCUMENT_VERIFICATION', notif_id: `doc_verif_${v.id}`, timestamp: v.updated_at });
        });

        // Cleanup vendors whose documents are no longer uploaded
        for (const id of notifiedDocRef.current.keys()) {
          if (!currentDocIds.has(id)) {
            notifiedDocRef.current.delete(id);
          }
        }
      }

      isInitialLoad.current = false;

      combined.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
      combined = combined.slice(0, 50);
      
      setNotifications(combined);
      setUnreadCount(combined.filter(n => n.notif_type === 'vendor_registration' || n.notif_type === 'DOCUMENT_VERIFICATION').length);
    };

    fetchNotifications();
    intervalId = setInterval(fetchNotifications, 15000); // Polling every 15s

    // Realtime fallbacks to trigger fetch immediately on any change
    const channel = supabase
      .channel('notification-center-listener')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'vendors' },
        () => {
          fetchNotifications();
        }
      )
      .subscribe();

    return () => {
      clearInterval(intervalId);
      supabase.removeChannel(channel);
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
 width: 360,
 maxHeight: 480,
 borderRadius: '16px',
 border: '1px solid var(--border-color)',
 backdropFilter: 'blur(16px)',
 backgroundColor: 'transparent',
 boxShadow: '0 20px 40px -10px rgba(0,0,0,0.15)',
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


