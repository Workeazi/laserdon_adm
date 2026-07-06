import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Button, CircularProgress } from '@mui/material';
import { Add } from '@mui/icons-material';
import PageHeader from '../../components/common/PageHeader';
import DataTable from '../../components/common/DataTable';
import StatusBadge from '../../components/common/StatusBadge';
import SearchBar from '../../components/common/SearchBar';
import FilterDropdown from '../../components/common/FilterDropdown';
import { paymentService } from '../../services/paymentService';
import { authService } from '../../services/authService';

import ConfirmDialog from '../../components/common/ConfirmDialog';
import toast from 'react-hot-toast';

const PaymentsPage = () => {
  const navigate = useNavigate();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [filter, setFilter] = useState('all');
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionModal, setActionModal] = useState({ open: false, type: '', paymentId: null, oldStatus: '', newStatus: '' });
  const [rejectionReason, setRejectionReason] = useState('');
  
  const currentAdmin = authService.getCurrentAdmin();

  const handleAction = async () => {
    if (!actionModal.paymentId) return;
    try {
      await paymentService.updatePaymentStatus(
        actionModal.paymentId, 
        actionModal.newStatus, 
        currentAdmin.id,
        rejectionReason
      );
      toast.success('Payment status updated successfully');
      setActionModal({ open: false, type: '', paymentId: null, oldStatus: '', newStatus: '' });
      setRejectionReason('');
      fetchPayments();
    } catch (error) {
      console.error('Error updating payment status:', error);
      toast.error(error.message || 'Failed to update status');
    }
  };

  const columns = [
    { field: 'id', headerName: 'Payment ID', renderCell: (r) => r.id.substring(0, 8) + '...' },
    { field: 'amount', headerName: 'Amount', renderCell: (r) => `₹${(r.amount || 0).toLocaleString()}` },
    { field: 'vendor', headerName: 'Vendor', renderCell: (r) => r.vendors?.companies?.short_name || r.vendors?.username || 'N/A' },
    { field: 'drawing_request_id', headerName: 'Drawing Request ID', renderCell: (r) => r.drawing_request_id ? r.drawing_request_id.substring(0, 8) + '...' : 'N/A' },
    { field: 'payment_status', headerName: 'Status', renderCell: (r) => <StatusBadge status={r.payment_status} module="payment" /> },
    { field: 'payment_date', headerName: 'Date', renderCell: (r) => r.payment_date ? new Date(r.payment_date).toLocaleDateString() : (r.created_at ? new Date(r.created_at).toLocaleDateString() : '') },
    { 
      field: 'actions', 
      headerName: 'Actions', 
      renderCell: (r) => (
        <div className="flex gap-2" onClick={(e) => e.stopPropagation()}>
          {r.payment_status === 'pending' ? (
            <>
               <Button size="small" variant="contained" color="success" onClick={() => setActionModal({ open: true, type: 'changeStatus', paymentId: r.id, oldStatus: r.payment_status, newStatus: 'paid' })}>Complete</Button>
               <Button size="small" variant="outlined" color="error" onClick={() => setActionModal({ open: true, type: 'changeStatus', paymentId: r.id, oldStatus: r.payment_status, newStatus: 'failed' })}>Fail</Button>
            </>
          ) : (
            <Button size="small" variant="text" onClick={() => navigate(`/payments/${r.id}`)}>View</Button>
          )}
        </div>
      )
    }
  ];

  useEffect(() => {
    fetchPayments();
  }, []);

  const fetchPayments = async () => {
    try {
      setLoading(true);
      const data = await paymentService.getPayments();
      setPayments(data);
    } catch (error) {
      console.error("Error fetching payments:", error);
      toast.error('Failed to load payments data');
    } finally {
      setLoading(false);
    }
  };

  const filteredPayments = payments.filter(p => filter === 'all' || p.payment_status === filter);

  return (
    <Box className="pb-8 space-y-6">
      <PageHeader 
        title="Payments" 
        breadcrumbs={[{ label: 'Dashboard', path: '/' }, { label: 'Payments' }]} 
        actions={
          <Button variant="contained" color="primary" startIcon={<Add />} disableElevation className="rounded-btn">
            Record Payment
          </Button>
        }
      />

      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="flex-1">
          <SearchBar placeholder="Search payments by ID or vendor..." />
        </div>
        <FilterDropdown 
          label="Status" 
          options={[
            { label: 'All Statuses', value: 'all' },
            { label: 'Paid', value: 'paid' },
            { label: 'Pending', value: 'pending' },
            { label: 'Failed', value: 'failed' },
          ]}
          value={filter}
          onChange={setFilter}
        />
      </div>

      {loading ? (
        <Box className="flex justify-center p-8"><CircularProgress /></Box>
      ) : (
        <DataTable 
          onRowClick={(row) => navigate(`/payments/${row.id}`)} 
          columns={columns} 
          data={filteredPayments} 
          totalCount={filteredPayments.length}
          page={page}
          rowsPerPage={rowsPerPage}
          onPageChange={setPage}
          onRowsPerPageChange={setRowsPerPage}
        />
      )}

      <ConfirmDialog 
        open={actionModal.open && actionModal.type === 'changeStatus'}
        title="Change Payment Status"
        message={`Are you sure you want to change payment status from ${actionModal.oldStatus} to ${actionModal.newStatus}?`}
        requiresReason={actionModal.newStatus === 'failed'}
        reasonLabel="Reason for failure"
        reasonValue={rejectionReason}
        onReasonChange={setRejectionReason}
        confirmLabel="Confirm"
        confirmColor="primary"
        onCancel={() => { setActionModal({ open: false, type: '', paymentId: null, oldStatus: '', newStatus: '' }); setRejectionReason(''); }}
        onConfirm={handleAction}
      />
    </Box>
  );
};

export default PaymentsPage;
