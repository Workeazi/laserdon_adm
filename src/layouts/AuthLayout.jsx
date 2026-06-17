import React from 'react';
import { Outlet } from 'react-router-dom';
import { Box, Typography } from '@mui/material';
import { Shield, VerifiedUser, Speed, Timeline } from '@mui/icons-material';

const features = [
 { title: 'Verified Vendors', icon: <VerifiedUser /> },
 { title: 'Secure Platform', icon: <Shield /> },
 { title: 'Fast Quotations', icon: <Speed /> },
 { title: 'Project Tracking', icon: <Timeline /> },
];

const AuthLayout = () => {
 return (
 <div className="min-h-screen bg-background flex">
 {/* Left Side: Branding & Features (Desktop Only) */}
 <Box 
 className="hidden lg:flex flex-col w-[500px] xl:w-[600px] bg-gradient-to-br from-sidebar to-gray-900 text-white relative p-12 overflow-hidden"
 >
 <div className="absolute inset-0 opacity-10 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-500 via-transparent to-transparent pointer-events-none"></div>
 
 <Box className="relative z-10 flex flex-col h-full">
 {/* Top: Logo */}
 <div className="flex items-center mb-16">
 <div className="w-10 h-10 bg-primary-main rounded-lg flex items-center justify-center mr-3 shadow-lg">
 <Typography variant="h6" className="text-white font-bold">LD</Typography>
 </div>
 <Typography variant="h5" className="font-bold tracking-wide">LaserDon</Typography>
 </div>

 {/* Center: Headline & Subtitle */}
 <Typography variant="h3" className="font-bold mb-4 leading-tight">
 Industrial <br/>Manufacturing <br/>Marketplace
 </Typography>
 <Typography variant="body1" className="text-textSecondary mb-12 text-lg leading-relaxed max-w-md">
 Connect customers with verified manufacturing vendors across India.
 </Typography>

 {/* Feature Cards */}
 <div className="grid grid-cols-2 gap-4 mb-auto">
 {features.map((feature, idx) => (
 <div key={idx} className="bg-card/5 backdrop-blur-sm border border-white/10 rounded-xl p-4 flex flex-col items-start hover:bg-card/10 transition-colors">
 <div className="text-primary-main mb-3 bg-primary-main/10 p-2 rounded-lg">
 {feature.icon}
 </div>
 <Typography variant="body2" className="font-semibold text-white">{feature.title}</Typography>
 </div>
 ))}
 </div>

 {/* Bottom: Version */}
 <div className="mt-12 text-textSecondary flex justify-between items-center text-sm font-medium">
 <span>LaserDon Admin v1.0</span>
 <span>&copy; {new Date().getFullYear()}</span>
 </div>
 </Box>
 </Box>

 {/* Right Side: Auth Forms */}
 <Box className="flex-1 flex items-center justify-center p-6 relative">
 <div className="w-full max-w-[480px]">
 <Outlet />
 </div>
 </Box>
 </div>
 );
};

export default AuthLayout;

