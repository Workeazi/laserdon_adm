import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Button, CircularProgress } from '@mui/material';
import { Add } from '@mui/icons-material';
import PageHeader from '../../components/common/PageHeader';
import DataTable from '../../components/common/DataTable';
import StatusBadge from '../../components/common/StatusBadge';
import SearchBar from '../../components/common/SearchBar';
import FilterDropdown from '../../components/common/FilterDropdown';
import { vendorService } from '../../services/vendorService';
import { authService } from '../../services/authService';

const columns = [
 { field: 'company_name', headerName: 'Company Name', renderCell: (r) => r.companies?.short_name || 'N/A' },
 { field: 'username', headerName: 'User Name' },
 { field: 'email', headerName: 'Email' },
 { field: 'gst_number', headerName: 'GST Number', renderCell: (r) => r.companies?.company_gst_number || 'N/A' },
 { field: 'phone', headerName: 'Phone' },
 { field: 'whatsapp_number', headerName: 'WhatsApp' },
 { field: 'alt_phone', headerName: 'Alt Phone' },
 { field: 'industry_type', headerName: 'Industry Type', renderCell: (r) => r.industries?.map(i => i.name).join(', ') || 'N/A' },
 { field: 'office_address', headerName: 'Office Address', renderCell: (r) => r.companies?.company_address || 'N/A' },
 { field: 'status', headerName: 'Status', renderCell: (r) => <StatusBadge status={r.status} module="vendor" /> },
 { field: 'total_revenue', headerName: 'Total Revenue', renderCell: (r) => `₹${(r.total_revenue || 0).toLocaleString()}` },
 { field: 'created_at', headerName: 'Created Date', renderCell: (r) => r.created_at ? new Date(r.created_at).toLocaleDateString() : '' },
];

const VendorListPage = () => {
 const navigate = useNavigate();
 const [page, setPage] = useState(0);
 const [rowsPerPage, setRowsPerPage] = useState(10);
 const [filter, setFilter] = useState('all');
 const [vendors, setVendors] = useState([]);
 const [loading, setLoading] = useState(true);
 
 const currentAdmin = authService.getCurrentAdmin();
 const isMasterAdmin = currentAdmin?.role === 'master_admin';
 const visibleColumns = isMasterAdmin ? columns : columns.filter(c => c.field !== 'total_revenue');

 useEffect(() => {
 fetchVendors();
 }, []);

 const fetchVendors = async () => {
 try {
 setLoading(true);
 const data = await vendorService.getVendors();
 setVendors(data);
 } catch (error) {
 console.error("Error fetching vendors:", error);
 } finally {
 setLoading(false);
 }
 };

 const filteredVendors = vendors.filter(v => filter === 'all' || v.status === filter);
 if (vendors.length > 0) {
 console.log('Vendor:', vendors[0]);
 console.log('Company:', vendors[0].companies);
 console.log('Industry Data:', vendors[0].industries);
 }

 return (
 <Box className="pb-8 space-y-6">
 <PageHeader 
 title="Vendors" 
 breadcrumbs={[{ label: 'Dashboard', path: '/' }, { label: 'Vendors' }]} 
 actions={
 <Button variant="contained" color="primary" startIcon={<Add />} disableElevation className="rounded-btn">
 Add Vendor
 </Button>
 }
 />

 <div className="flex flex-col md:flex-row gap-4 mb-6">
 <div className="flex-1">
 <SearchBar placeholder="Search vendors by name or city..." />
 </div>
 <FilterDropdown 
 label="Status" 
 options={[
 { label: 'All Statuses', value: 'all' },
 { label: 'Approved', value: 'approved' },
 { label: 'Pending', value: 'pending' },
 { label: 'Rejected', value: 'rejected' },
 ]}
 value={filter}
 onChange={setFilter}
 />
 </div>

 <div className="mb-4 text-sm font-bold text-textSecondary dark:text-gray-300 bg-gray-100 dark:bg-slate-700 p-2 rounded">
 Raw Vendor Count: {vendors.length}
 </div>

 {loading ? (
 <Box className="flex justify-center p-8"><CircularProgress /></Box>
 ) : (
 <DataTable onRowClick={(row) => navigate(`/vendors/${row.id}`)} 
 columns={visibleColumns} 
 data={filteredVendors} 
 totalCount={filteredVendors.length}
 page={page}
 rowsPerPage={rowsPerPage}
 onPageChange={setPage}
 onRowsPerPageChange={setRowsPerPage}
 />
 )}
 </Box>
 );
};

export default VendorListPage;

