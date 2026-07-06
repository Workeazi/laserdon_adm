import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import CssBaseline from '@mui/material/CssBaseline';
import { Provider } from 'react-redux';
import { Toaster } from 'react-hot-toast';
import { store } from './store';
import { CustomThemeProvider } from './core/theme/ThemeContext';

import AuthLayout from './layouts/AuthLayout';
import DashboardLayout from './layouts/DashboardLayout';
import { authService } from './services/authService';

import LoginPage from './pages/auth/LoginPage';
import ForgotPasswordPage from './pages/auth/ForgotPasswordPage';
import ResetPasswordPage from './pages/auth/ResetPasswordPage';
import ChangePasswordPage from './pages/auth/ChangePasswordPage';
import AccessDeniedPage from './pages/auth/AccessDeniedPage';
import NotFoundPage from './pages/auth/NotFoundPage';

import DashboardPage from './pages/dashboard/DashboardPage';
import VendorListPage from './pages/vendors/VendorListPage';
import VendorDetailPage from './pages/vendors/VendorDetailPage';
import UserListPage from './pages/users/UserListPage';
import UserDetailPage from './pages/users/UserDetailPage';
import PaymentsPage from './pages/payments/PaymentsPage';
import PaymentDetailPage from './pages/payments/PaymentDetailPage';
import AdminDetailPage from './pages/admins/AdminDetailPage';

import ReportsPage from './pages/reports/ReportsPage';
import SettingsPage from './pages/settings/SettingsPage';
import AdminManagementPage from './pages/settings/AdminManagementPage';
import AdminProfilePage from './pages/settings/AdminProfilePage';
import NotificationCenterPage from './pages/notifications/NotificationCenterPage';
import PlaceholderPage from './pages/PlaceholderPage';
import VerifyDocsPage from './pages/verify-docs/VerifyDocsPage';

import SessionExpiredModal from './components/common/SessionExpiredModal';

const PrivateRoute = ({ children }) => {
 const isAuthenticated = authService.checkSession();
 if (!isAuthenticated) return <Navigate to="/login" replace />;
 return children;
};


const AuthRoute = ({ children }) => {
 const isAuthenticated = authService.checkSession();
 if (isAuthenticated) return <Navigate to="/dashboard" replace />;
 return children;
};

const RoleRoute = ({ children, allowedRoles }) => {
 const currentAdmin = authService.getCurrentAdmin();
 if (!currentAdmin || !allowedRoles.includes(currentAdmin.role)) {
 return <Navigate to="/dashboard" replace />;
 }
 return children;
};


function App() {
 const [sessionExpired, setSessionExpired] = useState(false);

 return (
 <Provider store={store}>
 <CustomThemeProvider>
 <CssBaseline />
 <Toaster 
 position="top-right" 
 containerStyle={{ zIndex: 999999 }}
 />
 <BrowserRouter>
 <Routes>
 <Route element={<AuthLayout />}>
 <Route path="/login" element={<AuthRoute><LoginPage /></AuthRoute>} />
 <Route path="/forgot-password" element={<AuthRoute><ForgotPasswordPage /></AuthRoute>} />
 <Route path="/reset-password" element={<AuthRoute><ResetPasswordPage /></AuthRoute>} />
 <Route path="/change-password" element={<AuthRoute><ChangePasswordPage /></AuthRoute>} />
 <Route path="/403" element={<AccessDeniedPage />} />
 </Route>
 
 <Route path="/" element={<PrivateRoute><DashboardLayout /></PrivateRoute>}>
 <Route index element={<Navigate to="/dashboard" replace />} />
 <Route path="dashboard" element={<DashboardPage />} />
 
 <Route path="vendors" element={<VendorListPage />} />
 <Route path="vendors/:id" element={<VendorDetailPage />} />
 <Route path="vendors/documents" element={<PlaceholderPage title="Vendor Documents" />} />
 <Route path="verify-docs" element={<VerifyDocsPage />} />
 
 <Route path="users" element={<UserListPage />} />
 <Route path="users/:id" element={<UserDetailPage />} />
 
 <Route path="payments" element={<RoleRoute allowedRoles={['master_admin']}><PaymentsPage /></RoleRoute>} />
 <Route path="payments/:id" element={<RoleRoute allowedRoles={['master_admin']}><PaymentDetailPage /></RoleRoute>} />
 
 <Route path="reports" element={<RoleRoute allowedRoles={['master_admin']}><ReportsPage /></RoleRoute>} />
 <Route path="notifications" element={<NotificationCenterPage />} />
 <Route path="notifications/send" element={<PlaceholderPage title="Send Notification" />} />
 <Route path="admins" element={<RoleRoute allowedRoles={['master_admin']}><AdminManagementPage /></RoleRoute>} />
 <Route path="admins/:id" element={<RoleRoute allowedRoles={['master_admin']}><AdminDetailPage /></RoleRoute>} />
 
 <Route path="settings" element={<SettingsPage />} />
 <Route path="settings/admins" element={<RoleRoute allowedRoles={['master_admin']}><AdminManagementPage /></RoleRoute>} />

 <Route path="settings/profile" element={<AdminProfilePage />} />
 </Route>

 <Route path="*" element={<NotFoundPage />} />
 </Routes>
 <SessionExpiredModal open={sessionExpired} onClose={() => setSessionExpired(false)} />
 </BrowserRouter>
 </CustomThemeProvider>
 </Provider>
 );
}

export default App;

