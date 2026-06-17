import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Box, Typography, List, ListItem, ListItemButton, ListItemText, Divider, useMediaQuery, useTheme } from '@mui/material';
import PageHeader from '../../components/common/PageHeader';
import PlatformTab from './components/PlatformTab';
import ProfileTab from './components/ProfileTab';
import SecurityTab from './components/SecurityTab';
import SMTPTab from './components/SMTPTab';
import WhatsAppTab from './components/WhatsAppTab';
import SupabaseTab from './components/SupabaseTab';
import IntegrationsTab from './components/IntegrationsTab';

const navGroups = [
 {
 title: 'General',
 items: [
 { id: 'platform', label: 'Platform' }
 ]
 },
 {
 title: 'Account',
 items: [
 { id: 'profile', label: 'Profile' },
 { id: 'security', label: 'Security' }
 ]
 },
 {
 title: 'Communication',
 items: [
 { id: 'smtp', label: 'SMTP' },
 { id: 'whatsapp', label: 'WhatsApp' }
 ]
 },
 {
 title: 'System',
 items: [
 { id: 'supabase', label: 'Supabase' },
 { id: 'integrations', label: 'Integrations' }
 ]
 }
];

const SettingsPage = () => {
 const [searchParams, setSearchParams] = useSearchParams();
 const initialTab = searchParams.get('tab') || 'platform';
 const [activeTab, setActiveTab] = useState(initialTab);
 const theme = useTheme();
 const isMobile = useMediaQuery(theme.breakpoints.down('md'));

 useEffect(() => {
 const tab = searchParams.get('tab');
 if (tab) {
 setActiveTab(tab);
 }
 }, [searchParams]);

 const handleTabChange = (tabId) => {
 setActiveTab(tabId);
 setSearchParams({ tab: tabId });
 };

 const renderContent = () => {
 switch (activeTab) {
 case 'platform': return <PlatformTab />;
 case 'profile': return <ProfileTab />;
 case 'security': return <SecurityTab />;
 case 'smtp': return <SMTPTab />;
 case 'whatsapp': return <WhatsAppTab />;
 case 'supabase': return <SupabaseTab />;
 case 'integrations': return <IntegrationsTab />;
 default: return <PlatformTab />;
 }
 };

 return (
 <Box className="pb-8 space-y-6 max-w-7xl mx-auto">
 <PageHeader 
 title="Settings" 
 breadcrumbs={[{ label: 'Dashboard', path: '/' }, { label: 'Settings' }]} 
 />

 <Box className="flex flex-col md:flex-row gap-8 relative items-start">
 {/* Left Sidebar Navigation */}
 <Box 
 sx={{
 width: isMobile ? '100%' : '280px',
 flexShrink: 0,
 position: isMobile ? 'static' : 'sticky',
 top: '96px', // Header height + padding
 }}
 >
 {navGroups.map((group, gIdx) => (
 <Box key={group.title} className="mb-6">
 <Typography variant="caption" className="uppercase font-bold tracking-wider text-textSecondary mb-2 px-3 block">
 {group.title}
 </Typography>
 <List disablePadding>
 {group.items.map((item) => {
 const isActive = activeTab === item.id;
 return (
 <ListItem key={item.id} disablePadding className="mb-1">
 <ListItemButton 
 onClick={() => handleTabChange(item.id)}
 sx={{
 borderRadius: '8px',
 py: 1,
 px: 2,
 backgroundColor: isActive ? 'rgba(37, 99, 235, 0.08)' : 'transparent',
 color: isActive ? 'primary.main' : 'text.secondary',
 '&:hover': {
 backgroundColor: isActive ? 'rgba(37, 99, 235, 0.12)' : 'rgba(0, 0, 0, 0.04)',
 color: isActive ? 'primary.main' : 'text.primary',
 }
 }}
 >
 <ListItemText 
 primary={item.label} 
 primaryTypographyProps={{ 
 variant: 'body2', 
 fontWeight: isActive ? 600 : 500 
 }} 
 />
 </ListItemButton>
 </ListItem>
 );
 })}
 </List>
 {gIdx < navGroups.length - 1 && <Divider className="my-4 mx-3" />}
 </Box>
 ))}
 </Box>

 {/* Right Content Area */}
 <Box className="flex-1 w-full min-w-0">
 {renderContent()}
 </Box>
 </Box>
 </Box>
 );
};

export default SettingsPage;

