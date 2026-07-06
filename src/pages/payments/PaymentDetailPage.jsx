import React, { useState, useEffect } from 'react';
import { Box, Card, CardContent, Typography, Button, Tabs, Tab, Avatar, CircularProgress } from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import PageHeader from '../../components/common/PageHeader';
import StatusBadge from '../../components/common/StatusBadge';
import { paymentService } from '../../services/paymentService';
import toast from 'react-hot-toast';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

const PaymentDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [payment, setPayment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [tabValue, setTabValue] = useState(0);

  useEffect(() => {
    const fetchPayment = async () => {
      try {
        setLoading(true);
        const data = await paymentService.getPaymentById(id);
        setPayment(data);
      } catch (error) {
        console.error("Error fetching payment:", error);
        toast.error('Failed to load payment details');
      } finally {
        setLoading(false);
      }
    };
    fetchPayment();
  }, [id]);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleDownloadReceipt = () => {
    try {
      const doc = new jsPDF();
      const vendorName = payment.vendors?.companies?.short_name || payment.vendors?.username || 'N/A';
      const paymentDate = payment.payment_date ? new Date(payment.payment_date).toLocaleString() : (payment.created_at ? new Date(payment.created_at).toLocaleString() : 'N/A');
      
      // Header
      doc.setFontSize(20);
      doc.text('Payment Receipt', 14, 22);
      
      doc.setFontSize(10);
      doc.setTextColor(100);
      doc.text(`Receipt generated on ${new Date().toLocaleString()}`, 14, 30);
      
      // Payment Info Box
      doc.autoTable({
        startY: 40,
        head: [['Payment Detail', 'Information']],
        body: [
          ['Payment ID', payment.id],
          ['Amount', `Rs. ${(payment.amount || 0).toLocaleString()}`],
          ['Date', paymentDate],
          ['Status', (payment.payment_status || 'pending').toUpperCase()],
          ['Vendor', vendorName],
          ['Drawing Request ID', payment.drawing_request_id || 'N/A'],
          ['Payment Method', payment.method || 'N/A'],
          ['Payment Gateway', payment.gateway || 'N/A'],
        ],
        theme: 'grid',
        headStyles: { fillColor: [41, 128, 185], textColor: 255 },
        styles: { fontSize: 11, cellPadding: 5 }
      });
      
      // Footer
      const finalY = doc.lastAutoTable.finalY || 40;
      doc.setFontSize(10);
      doc.setTextColor(150);
      doc.text('Thank you for your business.', 14, finalY + 20);
      
      doc.save(`receipt_${payment.id.substring(0, 8)}.pdf`);
      toast.success('Receipt downloaded successfully');
    } catch (error) {
      console.error('Error generating PDF:', error);
      toast.error('Failed to generate receipt');
    }
  };

  if (loading) {
    return <Box className="flex justify-center p-8"><CircularProgress /></Box>;
  }

  if (!payment) {
    return <Typography className="p-8 text-center text-textSecondary">Payment not found.</Typography>;
  }

  const vendorName = payment.vendors?.companies?.short_name || payment.vendors?.username || 'N/A';

  const renderOverview = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Card className="rounded-card shadow-sm border border-borderLight">
        <CardContent className="p-6">
          <Typography variant="h6" className="font-bold mb-4">Payment Details</Typography>
          <div className="space-y-3">
            <div className="flex justify-between border-b border-borderLight pb-2">
              <Typography variant="body2" className="text-textSecondary">Payment ID</Typography>
              <Typography variant="body2" className="font-medium">{payment.id}</Typography>
            </div>
            <div className="flex justify-between border-b border-borderLight pb-2">
              <Typography variant="body2" className="text-textSecondary">Method</Typography>
              <Typography variant="body2" className="font-medium uppercase">{payment.method || 'N/A'}</Typography>
            </div>
            <div className="flex justify-between border-b border-borderLight pb-2">
              <Typography variant="body2" className="text-textSecondary">Gateway</Typography>
              <Typography variant="body2" className="font-medium capitalize">{payment.gateway || 'N/A'}</Typography>
            </div>
            <div className="flex justify-between">
              <Typography variant="body2" className="text-textSecondary">Date</Typography>
              <Typography variant="body2" className="font-medium">
                {payment.payment_date ? new Date(payment.payment_date).toLocaleString() : (payment.created_at ? new Date(payment.created_at).toLocaleString() : 'N/A')}
              </Typography>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="rounded-card shadow-sm border border-borderLight">
        <CardContent className="p-6">
          <Typography variant="h6" className="font-bold mb-4">Related Entities</Typography>
          <div className="space-y-3">
            <div className="flex justify-between border-b border-borderLight pb-2">
              <Typography variant="body2" className="text-textSecondary">Drawing Req ID</Typography>
              <Typography variant="body2" className="font-medium cursor-pointer text-primary-main hover:underline" onClick={() => navigate(`/drawing-requests`)}>
                {payment.drawing_request_id ? payment.drawing_request_id.substring(0, 8) + '...' : 'N/A'}
              </Typography>
            </div>
            <div className="flex justify-between border-b border-borderLight pb-2">
              <Typography variant="body2" className="text-textSecondary">Vendor</Typography>
              <Typography variant="body2" className="font-medium">{vendorName}</Typography>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  return (
    <Box className="pb-8 space-y-6">
      <PageHeader 
        title={`Payment Details`}
        breadcrumbs={[
          { label: 'Dashboard', path: '/' }, 
          { label: 'Payments', path: '/payments' }, 
          { label: payment.id.substring(0, 8) }
        ]} 
        actions={
          <>
            {payment.payment_status === 'pending' && (
              <Button variant="contained" color="primary" disableElevation className="rounded-btn font-semibold">
                Verify Payment
              </Button>
            )}
            <Button variant="outlined" color="primary" className="rounded-btn font-semibold" onClick={handleDownloadReceipt}>
              Download Receipt
            </Button>
          </>
        }
      />

      <Card className="rounded-card shadow-sm border border-borderLight mb-6">
        <CardContent className="p-6 flex flex-col md:flex-row items-center justify-between">
          <div className="flex items-center">
            <Avatar sx={{ width: 64, height: 64, bgcolor: '#10B981', fontSize: '24px' }}>
              ₹
            </Avatar>
            <div className="ml-6">
              <Typography variant="h5" className="font-bold text-textPrimary">₹{(payment.amount || 0).toLocaleString()}</Typography>
              <div className="flex items-center space-x-3 mt-1">
                <StatusBadge status={payment.payment_status || 'pending'} module="payment" />
                <Typography variant="body2" className="text-textSecondary font-medium">• Vendor: {vendorName}</Typography>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={tabValue} onChange={handleTabChange}>
          <Tab label="Overview" sx={{ textTransform: 'none', fontWeight: 600 }} />
          <Tab label="Timeline" sx={{ textTransform: 'none', fontWeight: 600 }} />
        </Tabs>
      </Box>

      <Box className="pt-4">
        {tabValue === 0 && renderOverview()}
        {tabValue === 1 && (
          <Card className="rounded-card shadow-sm border border-borderLight p-6">
            <Typography variant="h6" className="font-bold mb-4">Activity Timeline</Typography>
            <div className="space-y-4">
              <div className="flex">
                <div className="w-3 h-3 rounded-full bg-primary-main mt-1.5 mr-4"></div>
                <div>
                  <Typography variant="body2" className="font-semibold">Payment Initiated</Typography>
                  <Typography variant="caption" className="text-textSecondary">{payment.created_at ? new Date(payment.created_at).toLocaleString() : 'N/A'}</Typography>
                </div>
              </div>
              {payment.payment_status === 'paid' && (
                <div className="flex">
                  <div className="w-3 h-3 rounded-full bg-success mt-1.5 mr-4"></div>
                  <div>
                    <Typography variant="body2" className="font-semibold">Payment Completed successfully</Typography>
                    <Typography variant="caption" className="text-textSecondary">{payment.payment_date ? new Date(payment.payment_date).toLocaleString() : 'N/A'}</Typography>
                  </div>
                </div>
              )}
            </div>
          </Card>
        )}
      </Box>
    </Box>
  );
};

export default PaymentDetailPage;
