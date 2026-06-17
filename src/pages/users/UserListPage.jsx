import React, { useState } from 'react';
import { Box, Button } from '@mui/material';
import { Add } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import PageHeader from '../../components/common/PageHeader';
import DataTable from '../../components/common/DataTable';
import StatusBadge from '../../components/common/StatusBadge';
import SearchBar from '../../components/common/SearchBar';
import FilterDropdown from '../../components/common/FilterDropdown';
import { mockUsers } from '../../mock/users';

const UserListPage = () => {
 const navigate = useNavigate();
 const [filter, setFilter] = useState('all');

 const columns = [
 { field: 'name', headerName: 'Name' },
 { field: 'email', headerName: 'Email' },
 { field: 'phone', headerName: 'Phone' },
 { field: 'city', headerName: 'City' },
 { 
 field: 'is_blocked', 
 headerName: 'Status', 
 renderCell: (r) => <StatusBadge status={r.is_blocked ? 'blocked' : 'active'} module="user" /> 
 },
 { field: 'joined', headerName: 'Joined Date' },
 ];

 return (
 <Box className="pb-8 space-y-6">
 <PageHeader 
 title="Users" 
 breadcrumbs={[{ label: 'Dashboard', path: '/' }, { label: 'Users' }]} 
 actions={
 <Button variant="contained" color="primary" startIcon={<Add />} disableElevation className="rounded-btn">
 Invite User
 </Button>
 }
 />

 <div className="flex flex-col md:flex-row gap-4 mb-6">
 <div className="flex-1">
 <SearchBar placeholder="Search users by name, email, or phone..." />
 </div>
 <FilterDropdown 
 label="Status" 
 options={[
 { label: 'All Users', value: 'all' },
 { label: 'Active', value: 'active' },
 { label: 'Blocked', value: 'blocked' },
 ]}
 value={filter}
 onChange={setFilter}
 />
 </div>

 <DataTable 
 columns={columns} 
 data={mockUsers} 
 onRowClick={(row) => navigate(`/users/${row.id}`)}
 />
 </Box>
 );
};

export default UserListPage;

