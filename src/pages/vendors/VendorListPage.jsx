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

import ConfirmDialog from '../../components/common/ConfirmDialog';
import toast from 'react-hot-toast';

const VendorListPage = () => {
 const navigate = useNavigate();
 const [page, setPage] = useState(0);
 const [rowsPerPage, setRowsPerPage] = useState(10);
 const [filter, setFilter] = useState('all');
 const [vendors, setVendors] = useState([]);
 const [loading, setLoading] = useState(true);
  const [actionModal, setActionModal] = useState({ open: false, type: '', vendorId: null, oldStatus: '', newStatus: '' });
  const [rejectionReason, setRejectionReason] = useState('');
  
  const currentAdmin = authService.getCurrentAdmin();
  const isMasterAdmin = currentAdmin?.role === 'master_admin';

  const handleAction = async () => {
    if (!actionModal.vendorId) return;
    try {
      await vendorService.updateVendorStatus(
        actionModal.vendorId, 
        actionModal.newStatus, 
        currentAdmin.id,
        rejectionReason
      );
      toast.success('Vendor status updated successfully');
      setActionModal({ open: false, type: '', vendorId: null, oldStatus: '', newStatus: '' });
      setRejectionReason('');
      fetchVendors();
    } catch (error) {
      console.error('Error updating vendor status:', error);
      toast.error(error.message || 'Failed to update status');
    }
  };

  const columns = [
    { field: 'company_name', headerName: 'Company Name', renderCell: (r) => r.companies?.short_name || 'N/A' },
    { field: 'username', headerName: 'User Name' },
    { field: 'email', headerName: 'Email' },
    { field: 'status', headerName: 'Status', renderCell: (r) => <StatusBadge status={r.status} module="vendor" /> },
    { field: 'total_revenue', headerName: 'Total Revenue', renderCell: (r) => `₹${(r.total_revenue || 0).toLocaleString()}` },
    { field: 'created_at', headerName: 'Created Date', renderCell: (r) => r.created_at ? new Date(r.created_at).toLocaleDateString() : '' },
    { 
      field: 'actions', 
      headerName: 'Actions', 
      renderCell: (r) => (
        <div className="flex gap-2" onClick={(e) => e.stopPropagation()}>
          {r.status === 'pending' ? (
            <>
               <Button size="small" variant="contained" color="success" onClick={() => setActionModal({ open: true, type: 'changeStatus', vendorId: r.id, oldStatus: r.status, newStatus: 'approved' })}>Approve</Button>
               <Button size="small" variant="outlined" color="error" onClick={() => setActionModal({ open: true, type: 'changeStatus', vendorId: r.id, oldStatus: r.status, newStatus: 'rejected' })}>Reject</Button>
            </>
          ) : (
            <Button size="small" variant="text" onClick={() => navigate(`/vendors/${r.id}`)}>View</Button>
          )}
        </div>
      )
    }
  ];

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

    <ConfirmDialog 
      open={actionModal.open && actionModal.type === 'changeStatus'}
      title="Change Vendor Status"
      message={`Are you sure you want to change vendor status from ${actionModal.oldStatus} to ${actionModal.newStatus}?`}
      requiresReason={actionModal.newStatus === 'rejected'}
      reasonLabel="Reason for rejection"
      reasonValue={rejectionReason}
      onReasonChange={setRejectionReason}
      confirmLabel="Confirm"
      confirmColor="primary"
      onCancel={() => { setActionModal({ open: false, type: '', vendorId: null, oldStatus: '', newStatus: '' }); setRejectionReason(''); }}
      onConfirm={handleAction}
    />
  </Box>
 );
};

export default VendorListPage;

