import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Notifications, DarkMode, LightMode, Menu as MenuIcon, Person, Settings } from '@mui/icons-material';
import { Avatar, IconButton, Box, Menu, MenuItem, ListItemIcon } from '@mui/material';
import NotificationCenter from './NotificationCenter';
import { useThemeContext } from '../../core/theme/ThemeContext';

const Topbar = ({ onMenuClick, sidebarWidth }) => {
 const navigate = useNavigate();
 const [adminData, setAdminData] = useState(null);
 const { theme, toggleTheme } = useThemeContext();
 
 // Profile menu state
 const [anchorEl, setAnchorEl] = useState(null);
 const profileOpen = Boolean(anchorEl);

 useEffect(() => {
 // Load admin from localStorage
 const savedAdmin = localStorage.getItem('admin');
 if (savedAdmin) {
 setAdminData(JSON.parse(savedAdmin));
 }
 }, []);

 const handleProfileClick = (event) => {
 setAnchorEl(event.currentTarget);
 };

 const handleProfileClose = () => {
 setAnchorEl(null);
 };

 const handleNavigate = (path) => {
 handleProfileClose();
 navigate(path);
 };

 return (
 <>
 <Box 
 component="header" 
 className="bg-card border-b border-borderLight transition-colors duration-200"
 sx={{
 position: 'fixed',
 top: 0,
 left: `${sidebarWidth}px`,
 right: 0,
 height: '72px',
 display: 'flex',
 alignItems: 'center',
 justifyContent: 'space-between',
 px: 3,
 zIndex: 1100,
 transition: 'left 0.3s ease',
 }}
 >
 <div className="flex items-center">
 <IconButton 
 onClick={onMenuClick} 
 sx={{ display: { xs: 'block', md: 'none' } }}
 className="text-textSecondary"
 >
 <MenuIcon />
 </IconButton>
 </div>

 {/* Right Actions */}
 <div className="flex items-center justify-end flex-1 space-x-2 sm:space-x-4">
 <IconButton size="small" onClick={toggleTheme}>
 {theme === 'dark' ? <LightMode className="text-textSecondary" /> : <DarkMode className="text-textSecondary" />}
 </IconButton>

 <NotificationCenter />

 <div className="border-l border-borderLight h-6 mx-2 hidden sm:block"></div>

 {/* Profile Button */}
 <div 
 onClick={handleProfileClick}
 className="flex items-center cursor-pointer hover:bg-black/5 dark:hover:bg-card/5 px-2 py-1 rounded-btn transition-colors duration-200"
 >
 <Avatar 
 sx={{ width: 32, height: 32 }} 
 src={adminData?.avatar ||"https://i.pravatar.cc/150?img=11"} 
 alt={adminData?.name ||"Admin"}
 />
 <div className="ml-3 hidden md:block text-sm">
 <p className="font-semibold text-textPrimary leading-none">{adminData?.name ||"Super Admin"}</p>
 <p className="text-textSecondary text-xs mt-1">{adminData?.email ||"admin@laserdon.com"}</p>
 </div>
 </div>
 </div>
 </Box>

 {/* Profile Dropdown Menu */}
 <Menu
 anchorEl={anchorEl}
 open={profileOpen}
 onClose={handleProfileClose}
 transformOrigin={{ horizontal: 'right', vertical: 'top' }}
 anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
 PaperProps={{
 elevation: 0,
 sx: {
 overflow: 'visible',
 filter: 'drop-shadow(0px 10px 25px rgba(0,0,0,0.1))',
 mt: 1.5,
 minWidth: 200,
 borderRadius: '12px',
 '& .MuiAvatar-root': {
 width: 32,
 height: 32,
 ml: -0.5,
 mr: 1,
 },
 '&:before': {
 content: '""',
 display: 'block',
 position: 'absolute',
 top: 0,
 right: 20,
 width: 10,
 height: 10,
 bgcolor: 'background.paper',
 transform: 'translateY(-50%) rotate(45deg)',
 zIndex: 0,
 },
 },
 }}
 >
 <MenuItem onClick={() => handleNavigate('/settings?tab=profile')} className="py-2.5">
 <ListItemIcon>
 <Person fontSize="small" className="text-textSecondary" />
 </ListItemIcon>
 Profile
 </MenuItem>
 <MenuItem onClick={() => handleNavigate('/settings')} className="py-2.5">
 <ListItemIcon>
 <Settings fontSize="small" className="text-textSecondary" />
 </ListItemIcon>
 Settings
 </MenuItem>
 </Menu>
 </>
 );
};

export default Topbar;

