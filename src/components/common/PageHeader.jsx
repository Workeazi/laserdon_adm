import React from 'react';
import { Breadcrumbs, Link, Typography, Box } from '@mui/material';
import { NavigateNext } from '@mui/icons-material';

const PageHeader = ({ title, breadcrumbs, actions }) => {
 return (
 <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 pb-4 border-b border-borderLight">
 <div>
 <Breadcrumbs 
 separator={<NavigateNext fontSize="small" />} 
 aria-label="breadcrumb"
 className="mb-2 text-sm text-textSecondary"
 >
 {breadcrumbs?.map((crumb, index) => {
 const isLast = index === breadcrumbs.length - 1;
 return isLast ? (
 <Typography key={index} color="text.primary" className="text-sm font-medium">
 {crumb.label}
 </Typography>
 ) : (
 <Link 
 key={index} 
 underline="hover" 
 color="inherit" 
 href={crumb.path}
 className="text-sm hover:text-primary-main transition-colors"
 >
 {crumb.label}
 </Link>
 );
 })}
 </Breadcrumbs>
 <Typography variant="h4" component="h1" className="font-bold text-textPrimary tracking-tight">
 {title}
 </Typography>
 </div>
 
 {actions && (
 <div className="mt-4 md:mt-0 flex items-center space-x-3">
 {actions}
 </div>
 )}
 </div>
 );
};

export default PageHeader;

