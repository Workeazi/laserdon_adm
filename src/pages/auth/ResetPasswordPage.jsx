import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Box, Card, CardContent, Typography, TextField, Button, Alert, InputAdornment, IconButton } from '@mui/material';
import { LockOutlined, Visibility, VisibilityOff } from '@mui/icons-material';
import { motion } from 'framer-motion';

const schema = yup.object({
 password: yup.string().required('Password is required').min(8, 'Minimum 8 characters').matches(/[A-Z]/, 'Must contain uppercase').matches(/[a-z]/, 'Must contain lowercase').matches(/[0-9]/, 'Must contain a number').matches(/[^a-zA-Z0-9]/, 'Must contain a special character'),
 confirmPassword: yup.string().oneOf([yup.ref('password'), null], 'Passwords must match').required('Confirm Password is required'),
}).required();

const ResetPasswordPage = () => {
 const [showPassword, setShowPassword] = useState(false);
 const [isLoading, setIsLoading] = useState(false);
 const [success, setSuccess] = useState(false);

 const { register, handleSubmit, formState: { errors } } = useForm({
 resolver: yupResolver(schema)
 });

 const onSubmit = (data) => {
 setIsLoading(true);
 setTimeout(() => {
 setIsLoading(false);
 setSuccess(true);
 }, 1500);
 };

 return (
 <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, ease:"easeOut" }}>
 <Card className="w-full bg-card/90 backdrop-blur-xl border border-borderLight" sx={{ borderRadius: '24px', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.15)' }}>
 <CardContent className="p-8 sm:p-10">
 <Box className="mb-8">
 <Typography variant="h4" className="font-bold text-textPrimary mb-2">
 Set New Password
 </Typography>
 <Typography variant="body1" className="text-textSecondary">
 Your new password must be different to previously used passwords.
 </Typography>
 </Box>

 {success ? (
 <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
 <Alert severity="success" className="mb-6 rounded-lg font-medium">
 Password has been successfully reset!
 </Alert>
 <Button fullWidth variant="contained" component={Link} to="/login" size="large" sx={{ borderRadius: '12px' }} disableElevation>
 Login Now
 </Button>
 </motion.div>
 ) : (
 <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
 <TextField
 fullWidth
 label="New Password"
 type={showPassword ? 'text' : 'password'}
 variant="outlined"
 {...register('password')}
 error={!!errors.password}
 helperText={errors.password?.message}
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
 label="Confirm Password"
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
 {isLoading ? 'Resetting Password...' : 'Reset Password'}
 </Button>
 </form>
 )}
 </CardContent>
 </Card>
 </motion.div>
 );
};

export default ResetPasswordPage;

