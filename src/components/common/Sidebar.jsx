import React, { useState, useEffect } from 'react';
import { NavLink, useLocation, matchPath } from 'react-router-dom';
import { supabase } from '../../config/supabaseClient';
import { authService } from '../../services/authService';
import { features } from '../../config/features';

import { Drawer, Box, Typography, IconButton } from '@mui/material';
import {
 Dashboard,
 Store,
 VerifiedUser,
 People,
 Folder,
 Payment,
 BarChart,
 Notifications,
 Settings,
 Logout,
 MenuOpen,
 Menu as MenuIcon,
 AdminPanelSettings
} from '@mui/icons-material';

const navItems = [
 { text: 'Dashboard', icon: <Dashboard />, path: '/dashboard', patterns: ['/dashboard'] },
 { text: 'Vendors', icon: <Store />, path: '/vendors', patterns: ['/vendors', '/vendors/:id'] },
 { text: 'Verify Docs', icon: <VerifiedUser />, path: '/verify-docs', patterns: ['/verify-docs'] },
 ...(features.showUsersModule ? [{ text: 'Users', icon: <People />, path: '/users', patterns: ['/users', '/users/:id'] }] : []),
 { text: 'Payments', icon: <Payment />, path: '/payments', patterns: ['/payments', '/payments/:id'], roles: ['master_admin'] },
 { text: 'Reports', icon: <BarChart />, path: '/reports', patterns: ['/reports'], roles: ['master_admin'] },
 { text: 'Admin Management', icon: <AdminPanelSettings />, path: '/admins', patterns: ['/admins', '/admins/:id'], roles: ['master_admin'] },
 { text: 'Notifications', icon: <Notifications />, path: '/notifications', patterns: ['/notifications', '/notifications/send'] },
 { text: 'Settings', icon: <Settings />, path: '/settings', patterns: ['/settings', '/settings/:tab', '/settings/admins'] },
];

const SidebarContent = ({ collapsed, onClose, onLogout, isMobile }) => {
 const { pathname } = useLocation();
 const currentAdmin = authService.getCurrentAdmin();
 const role = currentAdmin?.role || 'sub_admin';
 const [pendingVendors, setPendingVendors] = useState(0);
 const [uploadedDocs, setUploadedDocs] = useState(0);

 useEffect(() => {
 const fetchCounts = async () => {
 const { count: pendingCount } = await supabase
 .from('vendors')
 .select('*', { count: 'exact', head: true })
 .eq('status', 'pending');
 
 const { count: docsCount } = await supabase
 .from('vendors')
 .select('*', { count: 'exact', head: true })
 .eq('document_status', 'uploaded');

 setPendingVendors(pendingCount || 0);
 setUploadedDocs(docsCount || 0);
 };

 fetchCounts();

 const channel = supabase
 .channel('sidebar-badges')
 .on('postgres_changes', { event: '*', schema: 'public', table: 'vendors' }, () => {
 fetchCounts();
 })
 .subscribe();

 return () => {
 supabase.removeChannel(channel);
 };
 }, []);

 const dynamicNavItems = navItems.map(item => {
 if (item.path === '/verify-docs') {
 return { ...item, badge: uploadedDocs > 0 ? uploadedDocs : null };
 }
 if (item.path === '/notifications') {
 return { ...item, badge: pendingVendors > 0 ? pendingVendors : null };
 }
 return item;
 });

 return (
 <Box className="bg-sidebar text-textPrimary flex flex-col h-[100vh] overflow-hidden w-full border-r border-borderLight transition-colors duration-200">
 <Box className="h-[72px] flex items-center px-4 border-b border-borderLight justify-between shrink-0">
 {!collapsed && <Typography variant="h6" className="font-bold tracking-wide text-primary-main">LaserDon</Typography>}
 {onClose && (
 <IconButton onClick={onClose} size="small" className="text-textPrimary">
 <MenuOpen />
 </IconButton>
 )}
 </Box>

 <nav className={`flex-1 py-4 ${isMobile ? 'overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:\'none\'] [scrollbar-width:\'none\']' : 'overflow-hidden'}`}>
 <ul className="space-y-1 px-3">
 {dynamicNavItems.filter(item => !item.roles || item.roles.includes(role)).map((item) => {
 const isActive = item.patterns.some(pattern => {
 const match = matchPath({ path: pattern, end: true }, pathname);
 if (!match) return false;
 if (item.exclude && item.exclude.some(ex => matchPath({ path: ex, end: true }, pathname))) return false;
 return true;
 });
 
 return (
 <li key={item.path}>
 <NavLink
 to={item.path}
 onClick={onClose}
 className={`flex items-center px-3 py-2.5 rounded-lg transition-all duration-200 ${
 isActive ? 'bg-primary-main/10 text-primary-main shadow-sm font-medium' : 'text-textSecondary hover:bg-black/5 dark:hover:bg-card/5 hover:text-textPrimary'
 } ${collapsed ? 'justify-center' : ''}`}
 >
 <span className={`flex-shrink-0 ${isActive ? 'text-primary-main' : 'text-textSecondary'}`}>{item.icon}</span>
 {!collapsed && (
 <span className="ml-3 flex-1 flex items-center justify-between whitespace-nowrap">
 {item.text}
 {item.badge && (
 <span className="bg-danger-main text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
 {item.badge}
 </span>
 )}
 </span>
 )}
 </NavLink>
 </li>
 );
 })}
 </ul>

 </nav>

 <Box className="p-4 border-t border-borderLight shrink-0">
 <button onClick={onLogout} className={`flex items-center text-textSecondary hover:text-danger-main transition-colors duration-200 w-full ${collapsed ? 'justify-center' : ''}`}>
 <Logout />
 {!collapsed && <span className="ml-3 font-medium">Logout</span>}
 </button>
 </Box>
 </Box>
 );
};

const Sidebar = ({ isMobile, isTablet, mobileOpen, onMobileClose, tabletCollapsed, onLogout }) => {
 // Mobile drawer
 if (isMobile) {
 return (
 <Drawer
 variant="temporary"
 open={mobileOpen}
 onClose={onMobileClose}
 ModalProps={{ keepMounted: true }}
 sx={{
 display: { xs: 'block', md: 'none' },
 '& .MuiDrawer-paper': { boxSizing: 'border-box', width: 280, borderRight: 'none' },
 }}
 >
 <SidebarContent collapsed={false} onClose={onMobileClose} onLogout={onLogout} isMobile={true} />
 </Drawer>
 );
 }

 // Desktop / Tablet fixed sidebar
 const width = isTablet && tabletCollapsed ? 80 : 280;

 return (
 <Box
 sx={{
 position: 'fixed',
 left: 0,
 top: 0,
 height: '100vh',
 overflow: 'hidden',
 width: `${width}px`,
 transition: 'width 0.3s ease',
 zIndex: 1200,
 }}
 >
 <SidebarContent collapsed={isTablet && tabletCollapsed} onLogout={onLogout} isMobile={false} />
 </Box>
 );
};

export default Sidebar;

