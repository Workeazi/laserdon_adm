export const mockPayments = [
  { id: 'PAY-901', order_id: 'ORD-2026-001', user_name: 'John Doe', vendor_name: 'Acme Lasers', amount: 14500, method: 'upi', gateway: 'razorpay', status: 'success', created_at: '2026-05-12' },
  { id: 'PAY-902', order_id: 'ORD-2026-002', user_name: 'Sarah Smith', vendor_name: 'TechMachined', amount: 8200, method: 'card', gateway: 'stripe', status: 'success', created_at: '2026-06-03' },
  { id: 'PAY-903', order_id: 'ORD-2026-003', user_name: 'Mike Johnson', vendor_name: 'SteelWorks', amount: 45000, method: 'netbanking', gateway: 'razorpay', status: 'pending', created_at: '2026-06-08' },
];
