import React from 'react';
import { Skeleton, Box } from '@mui/material';

const LoadingSkeleton = ({ type = 'table', rows = 5 }) => {
 if (type === 'card') {
 return (
 <Box className="p-6 bg-card rounded-card border border-borderLight shadow-sm">
 <div className="flex justify-between mb-4">
 <Skeleton variant="text" width="40%" height={24} />
 <Skeleton variant="circular" width={40} height={40} />
 </div>
 <Skeleton variant="text" width="70%" height={48} />
 <Skeleton variant="text" width="30%" height={24} className="mt-4" />
 </Box>
 );
 }

 if (type === 'table') {
 return (
 <Box className="w-full bg-card rounded-card border border-borderLight p-4">
 <Skeleton variant="rectangular" width="100%" height={48} className="mb-4 rounded" />
 {[...Array(rows)].map((_, i) => (
 <Skeleton key={i} variant="rectangular" width="100%" height={56} className="mb-2 rounded" />
 ))}
 </Box>
 );
 }

 if (type === 'profile') {
 return (
 <Box className="flex items-center space-x-4">
 <Skeleton variant="circular" width={64} height={64} />
 <div>
 <Skeleton variant="text" width={150} height={28} />
 <Skeleton variant="text" width={100} height={20} />
 </div>
 </Box>
 );
 }

 return <Skeleton variant="rectangular" width="100%" height={100} />;
};

export default LoadingSkeleton;

