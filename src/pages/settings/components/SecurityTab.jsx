import React, { useState } from 'react';
import { Box, Typography, TextField, Button, Switch, FormControlLabel } from '@mui/material';
import { supabase } from '../../../config/supabaseClient';
import { authService } from '../../../services/authService';
import toast from 'react-hot-toast';

const SecurityTab = () => {
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [loading, setLoading] = useState(false);
  const [passwords, setPasswords] = useState({ current: '', new: '', confirm: '' });
  const admin = authService.getCurrentAdmin();

  const handleUpdatePassword = async () => {
    if (!passwords.current || !passwords.new || !passwords.confirm) {
      toast.error('Please fill in all password fields.');
      return;
    }
    if (passwords.new !== passwords.confirm) {
      toast.error('New passwords do not match.');
      return;
    }

    setLoading(true);
    
    // Fetch current admin to check password
    const { data: adminData, error: fetchError } = await supabase
      .from('admins')
      .select('password_hash')
      .eq('id', admin.id)
      .single();

    if (fetchError || !adminData) {
      toast.error('Failed to verify current password.');
      setLoading(false);
      return;
    }

    // Verify password (currently just plain text in authService)
    if (adminData.password_hash !== passwords.current) {
      toast.error('Current password is incorrect.');
      setLoading(false);
      return;
    }

    // Update password using raw fetch to guarantee headers
    const xhr = new XMLHttpRequest();
    xhr.open('PATCH', `/api/admin-update?id=eq.${admin.id}`, true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.setRequestHeader('Prefer', 'return=representation');

    xhr.onload = function () {
      setLoading(false);
      if (xhr.status >= 200 && xhr.status < 300) {
        toast.success('Password updated successfully!');
        setPasswords({ current: '', new: '', confirm: '' });
      } else {
        console.error('Password update failed:', xhr.status, xhr.responseText);
        toast.error('Failed to update password.');
      }
    };

    xhr.onerror = function () {
      setLoading(false);
      console.error('XHR Error');
      toast.error('Network error occurred.');
    };

    xhr.send(JSON.stringify({
      password_hash: passwords.new
    }));
  };

  return (
    <Box className="space-y-6 max-w-3xl">
      <Box>
        <Typography variant="h5" className="font-bold text-textPrimary mb-1">Security</Typography>
        <Typography variant="body2" className="text-textSecondary">Manage your password, two-factor authentication, and active sessions.</Typography>
      </Box>

      {/* Change Password Section */}
      <Box className="bg-card border border-borderLight rounded-xl overflow-hidden">
        <Box className="px-6 py-5 border-b border-borderLight">
          <Typography variant="subtitle1" className="font-semibold text-textPrimary">Change Password</Typography>
        </Box>
        <Box className="p-6 space-y-5">
          <TextField 
            fullWidth 
            type="password" 
            label="Current Password" 
            size="small" 
            value={passwords.current}
            onChange={(e) => setPasswords({ ...passwords, current: e.target.value })}
          />
          <TextField 
            fullWidth 
            type="password" 
            label="New Password" 
            size="small" 
            value={passwords.new}
            onChange={(e) => setPasswords({ ...passwords, new: e.target.value })}
          />
          <TextField 
            fullWidth 
            type="password" 
            label="Confirm Password" 
            size="small" 
            value={passwords.confirm}
            onChange={(e) => setPasswords({ ...passwords, confirm: e.target.value })}
          />
        </Box>
        <Box className="px-6 py-4 bg-gray-50 border-t border-borderLight flex justify-end">
          <Button 
            variant="contained" 
            color="primary" 
            disableElevation 
            className="rounded-btn"
            onClick={handleUpdatePassword}
            disabled={loading}
          >
            {loading ? 'Updating...' : 'Update Password'}
          </Button>
        </Box>
      </Box>

      {/* Two-Factor Authentication Section */}
      <Box className="bg-card border border-borderLight rounded-xl overflow-hidden">
        <Box className="px-6 py-5 flex items-center justify-between">
          <Box>
            <Typography variant="subtitle1" className="font-semibold text-textPrimary">Two-Factor Authentication (2FA)</Typography>
            <Typography variant="body2" className="text-textSecondary mt-1">Add an extra layer of security to your account.</Typography>
          </Box>
          <Switch 
            checked={twoFactorEnabled} 
            onChange={(e) => setTwoFactorEnabled(e.target.checked)} 
            color="primary" 
          />
        </Box>
      </Box>

      {/* Session Management Section */}
      <Box className="bg-card border border-borderLight rounded-xl overflow-hidden">
        <Box className="px-6 py-5 border-b border-borderLight">
          <Typography variant="subtitle1" className="font-semibold text-textPrimary">Session Management</Typography>
          <Typography variant="body2" className="text-textSecondary mt-1">Review devices that are currently logged into your account.</Typography>
        </Box>
        <Box className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <Typography variant="body2" className="font-medium text-textPrimary">Windows • Chrome</Typography>
              <Typography variant="caption" className="text-textSecondary">Active now • Mumbai, India</Typography>
            </div>
            <Typography variant="caption" className="text-success font-medium bg-green-50 px-2 py-1 rounded">Current</Typography>
          </div>
          <div className="flex items-center justify-between border-t border-borderLight pt-4">
            <div>
              <Typography variant="body2" className="font-medium text-textPrimary">MacBook Pro • Safari</Typography>
              <Typography variant="caption" className="text-textSecondary">Last seen 2 days ago • Delhi, India</Typography>
            </div>
            <Button variant="outlined" color="error" size="small" className="rounded-btn text-xs py-1">Revoke</Button>
          </div>
        </Box>
        <Box className="px-6 py-4 bg-gray-50 border-t border-borderLight flex justify-end">
          <Button variant="outlined" color="error" className="rounded-btn">Sign out of all devices</Button>
        </Box>
      </Box>
    </Box>
  );
};

export default SecurityTab;
