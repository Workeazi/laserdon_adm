import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, InputBase, Box, Typography, List, ListItem, ListItemButton, ListItemIcon, ListItemText } from '@mui/material';
import { Search, Store, People, Folder, ShoppingCart } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

import { features } from '../../config/features';

const allMockResults = [
 { id: 1, type: 'Vendor', title: 'Acme Lasers', icon: <Store fontSize="small" />, path: '/vendors/1' },
 { id: 2, type: 'User', title: 'John Doe', icon: <People fontSize="small" />, path: '/users/1' },
 { id: 3, type: 'Project', title: 'Metal Brackets Batch 10', icon: <Folder fontSize="small" />, path: '/projects/1' },
 { id: 4, type: 'Order', title: 'ORD-2026-001', icon: <ShoppingCart fontSize="small" />, path: '/orders/1' },
];

const mockResults = allMockResults.filter(r => features.showUsersModule || r.type !== 'User');

const CommandPalette = ({ open, onClose }) => {
 const [query, setQuery] = useState('');
 const navigate = useNavigate();

 const handleSelect = (path) => {
 navigate(path);
 onClose();
 };

 const filteredResults = query 
 ? mockResults.filter(item => item.title.toLowerCase().includes(query.toLowerCase()) || item.type.toLowerCase().includes(query.toLowerCase()))
 : [];

 return (
 <Dialog 
 open={open} 
 onClose={onClose} 
 maxWidth="sm" 
 fullWidth 
 PaperProps={{ 
 sx: { 
 borderRadius: '12px',
 margin: '16px',
 position: 'absolute',
 top: '10%'
 } 
 }}
 >
 <Box className="flex items-center px-4 py-2 border-b border-borderLight">
 <Search className="text-textSecondary mr-3" />
 <InputBase
 autoFocus
 fullWidth
 placeholder={features.showUsersModule ?"Search vendors, users, projects, orders..." :"Search vendors, projects, orders..."}
 value={query}
 onChange={(e) => setQuery(e.target.value)}
 sx={{ fontSize: '1.125rem' }}
 />
 <Typography variant="caption" className="text-textSecondary bg-gray-100 px-2 py-1 rounded">
 ESC
 </Typography>
 </Box>

 <DialogContent sx={{ p: 0, maxHeight: '400px' }} className="custom-scrollbar">
 {query && filteredResults.length === 0 ? (
 <Box className="p-8 text-center text-textSecondary">
 No results found for"{query}"
 </Box>
 ) : (
 <List className="py-2">
 {!query && (
 <Box className="px-4 py-2 text-xs font-semibold text-textSecondary uppercase tracking-wider">
 Recent Searches
 </Box>
 )}
 {(query ? filteredResults : mockResults.slice(0, 3)).map((item) => (
 <ListItem disablePadding key={item.id}>
 <ListItemButton onClick={() => handleSelect(item.path)} className="hover:bg-gray-50 px-4 py-3">
 <ListItemIcon sx={{ minWidth: 40, color: 'text.secondary' }}>
 {item.icon}
 </ListItemIcon>
 <ListItemText 
 primary={item.title} 
 secondary={item.type}
 primaryTypographyProps={{ className: 'font-medium text-textPrimary' }}
 secondaryTypographyProps={{ className: 'text-xs mt-0.5' }}
 />
 <Typography variant="body2" className="text-primary-main text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity">
 Jump to
 </Typography>
 </ListItemButton>
 </ListItem>
 ))}
 </List>
 )}
 </DialogContent>
 </Dialog>
 );
};

export default CommandPalette;

