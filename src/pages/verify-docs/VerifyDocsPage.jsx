import React, { useState, useEffect } from 'react';
import { Box, Button, CircularProgress, Tabs, Tab, Typography, Dialog, DialogTitle, DialogContent, DialogActions, Chip } from '@mui/material';
import toast from 'react-hot-toast';
import { supabase } from '../../config/supabaseClient';
import { vendorService } from '../../services/vendorService';
import { authService } from '../../services/authService';
import PageHeader from '../../components/common/PageHeader';
import DataTable from '../../components/common/DataTable';
import StatusBadge from '../../components/common/StatusBadge';

const VerifyDocsPage = () => {
 const [vendors, setVendors] = useState([]);
 const [loading, setLoading] = useState(true);
 const [currentTab, setCurrentTab] = useState('uploaded');
 const currentAdmin = authService.getCurrentAdmin();

 const fetchVendors = async () => {
 setLoading(true);
 try {
 const { data, error } = await supabase
 .from('vendors')
 .select(`
 *,
 companies (
 id,
 short_name,
 company_address,
 company_gst_number
 )
 `)
 .in('document_status', ['uploaded', 'verified', 'rejected'])
 .order('updated_at', { ascending: false, nullsFirst: false });

 console.log('Verify Docs Data:', data);
 console.log('Verify Docs Error:', error);
 console.log('Verify Docs Count:', data?.length);

 if (error) {
 console.error('Supabase Error:', error);
 throw error;
 }
 
 setVendors(data || []);
 console.log('Verify Docs State:', data || []);
 } catch (error) {
 console.error('Error fetching vendors for verify-docs:', error);
 toast.error('Failed to load documents queue');
 } finally {
 setLoading(false);
 }
 };

 useEffect(() => {
 fetchVendors();

 const channel = supabase
 .channel('verify-docs-page')
 .on(
 'postgres_changes',
 { event: '*', schema: 'public', table: 'vendors' },
 () => {
 fetchVendors();
 }
 )
 .subscribe();

 return () => {
 supabase.removeChannel(channel);
 };
 }, []);

 const handleTabChange = (event, newValue) => {
 setCurrentTab(newValue);
 };

 const handleViewDocs = async (vendor) => {
 try {
 toast.loading('Fetching documents...', { id: 'fetch-docs' });
 const urls = await vendorService.getVendorBusinessDocumentsUrls(vendor.id);
 toast.dismiss('fetch-docs');
 
 if (urls && urls.length > 0) {
 urls.forEach(url => window.open(url, '_blank'));
 } else {
 toast.error('No documents found in vendor_business_documents bucket.');
 }
 } catch (error) {
 console.error('Error fetching documents', error);
 toast.error('Failed to fetch documents');
 toast.dismiss('fetch-docs');
 }
 };

 const handleAction = async (vendor, actionType) => {
 try {
 await vendorService.updateDocumentStatus(vendor.id, actionType, currentAdmin.id);
 toast.success(`Documents ${actionType} successfully.`);
 fetchVendors();
 } catch (error) {
 console.error(`Error marking document as ${actionType}:`, error);
 toast.error(`Failed to mark as ${actionType}`);
 }
 };

 const columns = [
 { field: 'company_name', headerName: 'Company Name', renderCell: (row) => row.companies?.short_name || 'N/A' },
 { field: 'username', headerName: 'Vendor Name' },
 { field: 'email', headerName: 'Email' },
 { 
 field: 'updated_at', 
 headerName: 'Status Date', 
 renderCell: (row) => new Date(row.updated_at || row.created_at).toLocaleDateString()
 },
 { 
 field: 'document_status', 
 headerName: 'Current Status', 
 renderCell: (row) => {
 let color = 'default';
 if (row.document_status === 'uploaded') color = 'warning';
 if (row.document_status === 'verified') color = 'success';
 if (row.document_status === 'rejected') color = 'error';
 return <Chip label={row.document_status || 'Pending'} color={color} size="small" />;
 }
 },
 {
 field: 'actions',
 headerName: 'Actions',
 width: 300,
 renderCell: (row) => (
 <div className="flex space-x-2">
 <Button 
 size="small" 
 variant="outlined"
 onClick={() => handleViewDocs(row)}
 >
 View Document
 </Button>
 {row.document_status === 'uploaded' && (
 <>
 <Button 
 size="small" 
 variant="contained"
 color="success"
 disableElevation
 onClick={() => handleAction(row, 'verified')}
 >
 Verify
 </Button>
 <Button 
 size="small" 
 variant="outlined"
 color="error"
 onClick={() => handleAction(row, 'rejected')}
 >
 Reject
 </Button>
 </>
 )}
 </div>
 )
 }
 ];

 const uploadedDocs = vendors.filter(v => v.document_status === 'uploaded');
 const verifiedDocs = vendors.filter(v => v.document_status === 'verified');
 const rejectedDocs = vendors.filter(v => v.document_status === 'rejected');

 console.log('All Vendors:', vendors);
 console.log('Uploaded Vendors:', uploadedDocs);
 console.log('Selected Tab:', currentTab);

 const counts = {
 uploaded: uploadedDocs.length,
 verified: verifiedDocs.length,
 rejected: rejectedDocs.length
 };

 const getTabVendors = () => {
 if (currentTab === 'uploaded') return uploadedDocs;
 if (currentTab === 'verified') return verifiedDocs;
 return rejectedDocs;
 };

 return (
 <Box className="pb-8 space-y-6">
 <PageHeader 
 title="Document Verification" 
 breadcrumbs={[
 { label: 'Dashboard', path: '/' },
 { label: 'Verify Docs' }
 ]} 
 />
 
 <div className="bg-card rounded-card shadow-sm border border-borderLight overflow-hidden">
 <Box sx={{ borderBottom: 1, borderColor: 'divider', px: 2, pt: 2 }}>
 <Tabs value={currentTab} onChange={handleTabChange} aria-label="verify docs tabs" sx={{ '& .MuiTab-root': { textTransform: 'none', fontWeight: 600, fontSize: '15px' } }}>
 <Tab label={`Uploaded (${counts.uploaded})`} value="uploaded" />
 <Tab label={`Verified (${counts.verified})`} value="verified" />
 <Tab label={`Rejected (${counts.rejected})`} value="rejected" />
 </Tabs>
 </Box>

 {loading ? (
 <Box className="flex items-center justify-center h-64">
 <CircularProgress />
 </Box>
 ) : getTabVendors().length > 0 ? (
 <DataTable 
 columns={columns} 
 data={getTabVendors()} 
 />
 ) : (
 <Box className="flex items-center justify-center h-64">
 <Typography variant="body1" sx={{ color: '#64748B' }}>
 No documents found
 </Typography>
 </Box>
 )}
 </div>

 </Box>
 );
};

export default VerifyDocsPage;

