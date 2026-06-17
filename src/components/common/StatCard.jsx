import React from 'react';
import { Card, CardContent, Typography, Box } from '@mui/material';
import { TrendingUp, TrendingDown } from '@mui/icons-material';

const StatCard = ({ title, value, icon, color, trend, percentageChange }) => {
 return (
 <Card className="rounded-card bg-card border border-borderLight shadow-sm hover:shadow-md hover:border-primary/30 transition-all duration-200">
 <CardContent className="p-6">
 <div className="flex justify-between items-start">
 <div>
 <Typography variant="body2" className="text-textSecondary font-medium mb-1 uppercase tracking-wider text-xs">
 {title}
 </Typography>
 <Typography variant="h4" className="text-textPrimary font-bold">
 {value}
 </Typography>
 </div>
 <div
 className="w-12 h-12 rounded-full flex items-center justify-center"
 style={{ backgroundColor: `${color}1A`, color: color }}
 >
 {icon}
 </div>
 </div>
 
 {percentageChange !== undefined && (
 <Box className="mt-4 flex items-center">
 {trend === 'up' ? (
 <TrendingUp className="text-success-main text-sm mr-1" />
 ) : trend === 'down' ? (
 <TrendingDown className="text-danger-main text-sm mr-1" />
 ) : null}
 <Typography
 variant="body2"
 className={`font-semibold text-sm ${
 trend === 'up' ? 'text-success-main' : trend === 'down' ? 'text-danger-main' : 'text-textSecondary'
 }`}
 >
 {percentageChange}%
 </Typography>
 <Typography variant="body2" className="text-textSecondary ml-2 text-sm">
 vs last month
 </Typography>
 </Box>
 )}
 </CardContent>
 </Card>
 );
};

export default StatCard;

