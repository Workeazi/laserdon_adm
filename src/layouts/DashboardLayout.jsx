import React, { useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { Box, useMediaQuery, useTheme, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button } from '@mui/material';
import Sidebar from '../components/common/Sidebar';
import Topbar from '../components/common/Topbar';

const DashboardLayout = () => {
 const theme = useTheme();
 const navigate = useNavigate();
 const isMobile = useMediaQuery(theme.breakpoints.down('md')); 
 const isTablet = useMediaQuery('(min-width: 768px) and (max-width: 1199px)');
 
 const [mobileOpen, setMobileOpen] = useState(false);
 const [tabletCollapsed, setTabletCollapsed] = useState(true);
 const [logoutOpen, setLogoutOpen] = useState(false);

 const handleDrawerToggle = () => {
 if (isMobile) {
 setMobileOpen(!mobileOpen);
 } else if (isTablet) {
 setTabletCollapsed(!tabletCollapsed);
 }
 };

 const handleLogoutConfirm = () => {
 localStorage.removeItem('isAuthenticated');
 localStorage.removeItem('admin');
 setLogoutOpen(false);
 navigate('/login');
 };

 let sidebarWidth = 280;
 if (isMobile) {
 sidebarWidth = 0; 
 } else if (isTablet) {
 sidebarWidth = tabletCollapsed ? 80 : 280;
 }

 return (
 <Box className="bg-background relative min-h-screen">
 <Sidebar 
 isMobile={isMobile} 
 isTablet={isTablet}
 mobileOpen={mobileOpen}
 onMobileClose={() => setMobileOpen(false)}
 tabletCollapsed={tabletCollapsed}
 onLogout={() => setLogoutOpen(true)}
 />

 <Topbar 
 onMenuClick={handleDrawerToggle} 
 sidebarWidth={sidebarWidth} 
 onLogout={() => setLogoutOpen(true)}
 />

 <Box 
 component="main" 
 sx={{
 marginLeft: `${sidebarWidth}px`,
 marginTop: '72px',
 transition: 'margin-left 0.3s ease',
 padding: '24px',
 }}
 >
 <Outlet />
 </Box>

 {/* Logout Confirmation Dialog */}
 <Dialog 
 open={logoutOpen} 
 onClose={() => setLogoutOpen(false)}
 PaperProps={{ sx: { borderRadius: '12px', minWidth: '320px' } }}
 >
 <DialogTitle className="font-bold text-textPrimary">Logout</DialogTitle>
 <DialogContent>
 <DialogContentText className="text-textSecondary">
 Are you sure you want to logout?
 </DialogContentText>
 </DialogContent>
 <DialogActions className="px-6 pb-6 pt-2">
 <Button onClick={() => setLogoutOpen(false)} color="inherit" className="rounded-btn text-textSecondary dark:text-textSecondary hover:bg-gray-100 dark:hover:bg-slate-700">
 Cancel
 </Button>
 <Button onClick={handleLogoutConfirm} color="error" variant="contained" disableElevation className="rounded-btn">
 Logout
 </Button>
 </DialogActions>
 </Dialog>
 </Box>
 );
};

export default DashboardLayout;

