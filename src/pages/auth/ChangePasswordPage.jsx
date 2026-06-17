import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Box, Card, CardContent, Typography, TextField, Button, Alert, InputAdornment, IconButton } from '@mui/material';
import { LockOutlined, Visibility, VisibilityOff, ArrowBack } from '@mui/icons-material';
import { motion } from 'framer-motion';

const schema = yup.object({
 currentPassword: yup.string().required('Current password is required'),
 newPassword: yup.string().required('New password is required').min(8, 'Minimum 8 characters').matches(/[A-Z]/, 'Must contain uppercase').matches(/[a-z]/, 'Must contain lowercase').matches(/[0-9]/, 'Must contain a number').matches(/[^a-zA-Z0-9]/, 'Must contain a special character'),
 confirmPassword: yup.string().oneOf([yup.ref('newPassword'), null], 'Passwords must match').required('Confirm Password is required'),
}).required();

const ChangePasswordPage = () => {
 const [showPassword, setShowPassword] = useState(false);
 const [isLoading, setIsLoading] = useState(false);
 const [success, setSuccess] = useState(false);

 const { register, handleSubmit, formState: { errors }, reset } = useForm({
 resolver: yupResolver(schema)
 });

 const onSubmit = (data) => {
 setIsLoading(true);
 setTimeout(() => {
 setIsLoading(false);
 setSuccess(true);
 reset();
 }, 1500);
 };

 return (
 <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, ease:"easeOut" }}>
 <Card className="w-full bg-card/90 backdrop-blur-xl border border-borderLight" sx={{ borderRadius: '24px', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.15)' }}>
 <CardContent className="p-8 sm:p-10">
 <Link to="/dashboard" className="flex items-center text-textSecondary hover:text-primary-main mb-6 transition-colors">
 <ArrowBack fontSize="small" className="mr-1" />
 <Typography variant="body2" className="font-medium">Back to Dashboard</Typography>
 </Link>

 <Box className="mb-8">
 <Typography variant="h4" className="font-bold text-textPrimary mb-2">
 Change Password
 </Typography>
 <Typography variant="body1" className="text-textSecondary">
 Update your account password.
 </Typography>
 </Box>

 {success && (
 <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
 <Alert severity="success" className="mb-6 rounded-lg font-medium">
 Your password has been successfully changed.
 </Alert>
 </motion.div>
 )}

 <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
 <TextField
 fullWidth
 label="Current Password"
 type={showPassword ? 'text' : 'password'}
 variant="outlined"
 {...register('currentPassword')}
 error={!!errors.currentPassword}
 helperText={errors.currentPassword?.message}
 InputProps={{
 startAdornment: <InputAdornment position="start"><LockOutlined className="text-textSecondary" /></InputAdornment>,
 endAdornment: (
 <InputAdornment position="end">
 <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
 {showPassword ? <VisibilityOff /> : <Visibility />}
 </IconButton>
 </InputAdornment>
 ),
 }}
 sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }}
 />

 <TextField
 fullWidth
 label="New Password"
 type={showPassword ? 'text' : 'password'}
 variant="outlined"
 {...register('newPassword')}
 error={!!errors.newPassword}
 helperText={errors.newPassword?.message}
 InputProps={{
 startAdornment: <InputAdornment position="start"><LockOutlined className="text-textSecondary" /></InputAdornment>,
 }}
 sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }}
 />

 <TextField
 fullWidth
 label="Confirm New Password"
 type={showPassword ? 'text' : 'password'}
 variant="outlined"
 {...register('confirmPassword')}
 error={!!errors.confirmPassword}
 helperText={errors.confirmPassword?.message}
 InputProps={{
 startAdornment: <InputAdornment position="start"><LockOutlined className="text-textSecondary" /></InputAdornment>,
 }}
 sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }}
 />

 <Button
 type="submit"
 fullWidth
 variant="contained"
 color="primary"
 size="large"
 disabled={isLoading}
 className="py-3.5 mt-4 font-bold text-base transition-all"
 sx={{ 
 borderRadius: '12px', 
 boxShadow: '0 8px 16px -4px rgba(37, 99, 235, 0.4)',
 '&:hover': {
 boxShadow: '0 12px 20px -4px rgba(37, 99, 235, 0.5)',
 transform: 'translateY(-1px)'
 }
 }}
 >
 {isLoading ? 'Updating...' : 'Change Password'}
 </Button>
 </form>
 </CardContent>
 </Card>
 </motion.div>
 );
};

export default ChangePasswordPage;

