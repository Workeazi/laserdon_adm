import React, { useState } from 'react';
import { Box, Card, CardContent, Typography, Button, Tabs, Tab, Avatar } from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import PageHeader from '../../components/common/PageHeader';
import StatusBadge from '../../components/common/StatusBadge';
import DataTable from '../../components/common/DataTable';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import { mockUsers } from '../../mock/users';
import { mockProjects } from '../../mock/projects';
import { mockOrders } from '../../mock/orders';

const UserDetailPage = () => {
 const { id } = useParams();
 const navigate = useNavigate();
 const user = mockUsers.find(u => u.id === id) || mockUsers[0];
 
 const [tabValue, setTabValue] = useState(0);
 const [actionModal, setActionModal] = useState({ open: false, type: '' }); 

 return (
 <Box className="pb-8 space-y-6">
 <PageHeader 
 title={`User: ${user.name}`}
 breadcrumbs={[
 { label: 'Dashboard', path: '/' }, 
 { label: 'Users', path: '/users' }, 
 { label: user.name }
 ]} 
 actions={
 <Button 
 variant="outlined" 
 color={user.is_blocked ?"success" :"error"} 
 className="rounded-btn font-semibold"
 onClick={() => setActionModal({ open: true, type: user.is_blocked ? 'unblock' : 'block' })}
 >
 {user.is_blocked ? 'Unblock User' : 'Block User'}
 </Button>
 }
 />

 <Card className="rounded-card shadow-sm border border-borderLight mb-6">
 <CardContent className="p-6 flex flex-col md:flex-row items-center justify-between">
 <div className="flex items-center">
 <Avatar sx={{ width: 64, height: 64, bgcolor: '#8B5CF6', fontSize: '24px' }}>
 {user.name.charAt(0)}
 </Avatar>
 <div className="ml-6">
 <Typography variant="h5" className="font-bold text-textPrimary">{user.name}</Typography>
 <div className="flex items-center space-x-3 mt-1">
 <StatusBadge status={user.is_blocked ? 'blocked' : 'active'} module="user" />
 <Typography variant="body2" className="text-textSecondary">• {user.email}</Typography>
 <Typography variant="body2" className="text-textSecondary">• {user.phone}</Typography>
 </div>
 </div>
 </div>
 </CardContent>
 </Card>

 <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
 <Tabs value={tabValue} onChange={(e, v) => setTabValue(v)} aria-label="user details tabs">
 <Tab label="Overview" sx={{ textTransform: 'none', fontWeight: 600 }} />
 <Tab label="Projects" sx={{ textTransform: 'none', fontWeight: 600 }} />
 <Tab label="Orders" sx={{ textTransform: 'none', fontWeight: 600 }} />
 </Tabs>
 </Box>

 <Box className="pt-4">
 {tabValue === 0 && (
 <Card className="rounded-card shadow-sm border border-borderLight">
 <CardContent className="p-6">
 <Typography variant="h6" className="font-bold mb-4">Location Details</Typography>
 <Typography variant="body2">{user.city}, {user.state}</Typography>
 <Typography variant="body2" className="mt-2 text-textSecondary">Joined: {user.joined}</Typography>
 </CardContent>
 </Card>
 )}
 {tabValue === 1 && (
 <DataTable 
 columns={[
 { field: 'id', headerName: 'Project ID' },
 { field: 'title', headerName: 'Title' },
 { field: 'status', headerName: 'Status', renderCell: (r) => <StatusBadge status={r.status} module="project" /> },
 { field: 'created_at', headerName: 'Date' },
 ]}
 data={mockProjects.filter(p => p.user_id === user.id)}
 onRowClick={(row) => navigate(`/projects/${row.id}`)}
 />
 )}
 {tabValue === 2 && (
 <DataTable 
 columns={[
 { field: 'id', headerName: 'Order ID' },
 { field: 'amount', headerName: 'Amount', renderCell: (r) => `₹${r.amount}` },
 { field: 'status', headerName: 'Status', renderCell: (r) => <StatusBadge status={r.status} module="order" /> },
 { field: 'created_at', headerName: 'Date' },
 ]}
 data={mockOrders.filter(o => o.user_id === user.id)}
 onRowClick={(row) => navigate(`/orders/${row.id}`)}
 />
 )}
 </Box>

 <ConfirmDialog 
 open={actionModal.open}
 title={`${actionModal.type === 'block' ? 'Block' : 'Unblock'} User`}
 message={`Are you sure you want to ${actionModal.type} this user?`}
 confirmLabel="Confirm"
 confirmColor={actionModal.type === 'block' ? 'error' : 'success'}
 onCancel={() => setActionModal({ open: false, type: '' })}
 onConfirm={() => setActionModal({ open: false, type: '' })}
 requiresReason={actionModal.type === 'block'}
 />
 </Box>
 );
};

export default UserDetailPage;

