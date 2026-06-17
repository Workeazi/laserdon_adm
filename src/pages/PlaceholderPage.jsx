import React from 'react';
import { Box } from '@mui/material';
import PageHeader from '../components/common/PageHeader';
import EmptyState from '../components/common/EmptyState';

const PlaceholderPage = ({ title }) => {
 return (
 <Box className="pb-8 space-y-6 h-full flex flex-col">
 <PageHeader 
 title={title} 
 breadcrumbs={[{ label: 'Dashboard', path: '/' }, { label: title }]} 
 />
 <div className="flex-1 flex items-center justify-center">
 <EmptyState 
 title={`${title} Module`} 
 description={`The UI for the ${title} module is currently under development. Mock data will be populated here shortly.`} 
 />
 </div>
 </Box>
 );
};

export default PlaceholderPage;

