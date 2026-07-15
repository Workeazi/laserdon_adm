import React, { useState, useEffect } from 'react';
import { Box, Typography, TextField, Button, Avatar } from '@mui/material';
import { supabase } from '../../../config/supabaseClient';
import { authService } from '../../../services/authService';
import toast from 'react-hot-toast';

const ProfileTab = () => {
  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState({ name: '', email: '', role: '', profile_url: '' });
  const admin = authService.getCurrentAdmin();

  useEffect(() => {
    if (admin) {
      fetchProfile();
    }
  }, []);

  const fetchProfile = async () => {
    const { data, error } = await supabase.from('admins').select('*').eq('id', admin.id).single();
    if (data) {
      setProfile({ name: data.name, email: data.email, role: data.role, profile_url: data.profile_url || '' });
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) { // 2MB limit
        toast.error('Image must be less than 2MB');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfile({ ...profile, profile_url: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
    if (!profile.name || !profile.email) {
      toast.error('Name and Email are required.');
      return;
    }
    setLoading(true);
    
    const xhr = new XMLHttpRequest();
    xhr.open('PATCH', `/api/admin-update?id=eq.${admin.id}`, true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.setRequestHeader('Prefer', 'return=representation');

    xhr.onload = function () {
      setLoading(false);
      if (xhr.status >= 200 && xhr.status < 300) {
        toast.success('Profile updated successfully!');
        if (admin) {
          const sessionData = { ...admin, name: profile.name, email: profile.email };
          localStorage.setItem('admin', JSON.stringify(sessionData));
        }
      } else {
        console.error('Update failed:', xhr.status, xhr.responseText);
        toast.error('Failed to update profile.');
      }
    };

    xhr.onerror = function () {
      setLoading(false);
      console.error('XHR Error');
      toast.error('Network error occurred.');
    };

    xhr.send(JSON.stringify({
      name: profile.name,
      email: profile.email,
      profile_url: profile.profile_url
    }));
  };

  return (
    <Box className="space-y-6 max-w-3xl">
      <Box>
        <Typography variant="h5" className="font-bold text-textPrimary mb-1">Profile</Typography>
        <Typography variant="body2" className="text-textSecondary">Manage your personal information and account avatar.</Typography>
      </Box>

      {/* Avatar Section */}
      <Box className="bg-card border border-borderLight rounded-xl p-6 flex items-start space-x-6">
        <Avatar src={profile.profile_url || ''} sx={{ width: 80, height: 80 }}>
          {profile.name ? profile.name.charAt(0).toUpperCase() : ''}
        </Avatar>
        <Box>
          <Typography variant="subtitle1" className="font-semibold text-textPrimary mb-2">Avatar</Typography>
          <Typography variant="body2" className="text-textSecondary mb-4">Upload a new avatar. Recommended size 256x256px. Max 2MB.</Typography>
          <div className="flex space-x-3">
            <Button variant="outlined" component="label" color="primary" size="small" className="rounded-btn">
              Upload Image
              <input type="file" hidden accept="image/*" onChange={handleImageUpload} />
            </Button>
            <Button 
              variant="text" 
              color="error" 
              size="small" 
              className="rounded-btn"
              onClick={() => setProfile({ ...profile, profile_url: '' })}
            >
              Remove
            </Button>
          </div>
        </Box>
      </Box>

      {/* Profile Information Section */}
      <Box className="bg-card border border-borderLight rounded-xl overflow-hidden">
        <Box className="px-6 py-5 border-b border-borderLight">
          <Typography variant="subtitle1" className="font-semibold text-textPrimary">Profile Information</Typography>
        </Box>
        <Box className="p-6 space-y-5">
          <Box className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <TextField 
              fullWidth 
              label="Full Name" 
              value={profile.name} 
              onChange={(e) => setProfile({ ...profile, name: e.target.value })}
              size="small" 
            />
            <TextField 
              fullWidth 
              label="Role" 
              value={profile.role} 
              size="small" 
              disabled 
            />
          </Box>
          <TextField 
            fullWidth 
            label="Email Address" 
            value={profile.email} 
            onChange={(e) => setProfile({ ...profile, email: e.target.value })}
            size="small" 
          />
        </Box>
        <Box className="px-6 py-4 bg-gray-50 border-t border-borderLight flex justify-end">
          <Button 
            variant="contained" 
            color="primary" 
            disableElevation 
            className="rounded-btn"
            onClick={handleSave}
            disabled={loading}
          >
            {loading ? 'Saving...' : 'Save Changes'}
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default ProfileTab;
