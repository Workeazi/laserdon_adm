import React from 'react';
import { Card, CardContent, Typography, Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Chip } from '@mui/material';

const formatDate = (dateString) => {
 if (!dateString) return 'N/A';
 const date = new Date(dateString);
 return date.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
};

const PendingVendorQueue = ({ vendors }) => {
 console.log('Pending Queue Props:', vendors);

 return (
 <Card className="rounded-card border border-borderLight shadow-sm w-full h-full">
 <CardContent className="p-6 h-full flex flex-col">
 <Typography variant="h6" className="font-bold text-textPrimary mb-2">
 Pending Vendor Queue
 </Typography>
 <Box sx={{ mb: 2 }}>
 <Typography variant="body2" color="textSecondary" fontWeight="medium">
 Pending Vendor Count: {vendors.length}
 </Typography>
 </Box>
 <TableContainer>
 <Table size="small">
 <TableHead>
 <TableRow>
 <TableCell className="font-bold text-slate-500">Company Name</TableCell>
 <TableCell className="font-bold text-slate-500">Username</TableCell>
 <TableCell className="font-bold text-slate-500">Applied On</TableCell>
 <TableCell className="font-bold text-slate-500">Status</TableCell>
 </TableRow>
 </TableHead>
 <TableBody>
 {vendors.length === 0 ? (
 <TableRow>
 <TableCell colSpan={4} align="center" className="text-slate-400 py-4">
 No pending vendors
 </TableCell>
 </TableRow>
 ) : (
 vendors.map((vendor) => {
 console.log('Vendor:', vendor);
 console.log('Company:', vendor.companies);
 console.log('Company Name:', vendor.companies?.short_name);
 return (
 <TableRow key={vendor.id} hover>
 <TableCell className="font-medium">{vendor.companies?.short_name || 'N/A'}</TableCell>
 <TableCell>{vendor.username}</TableCell>
 <TableCell>{formatDate(vendor.created_at)}</TableCell>
 <TableCell>
 <Chip label="Pending" size="small" sx={{ bgcolor: '#FEF3C7', color: '#D97706', fontWeight: 600 }} />
 </TableCell>
 </TableRow>
 );
 })
 )}
 </TableBody>
 </Table>
 </TableContainer>
 </CardContent>
 </Card>
 );
};

export default PendingVendorQueue;

