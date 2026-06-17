import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { 
 Box, 
 Card, 
 CardContent, 
 Typography, 
 TextField, 
 Button, 
 Checkbox, 
 FormControlLabel, 
 InputAdornment, 
 IconButton,
 Alert
} from '@mui/material';
import { Visibility, VisibilityOff, LockOutlined, EmailOutlined, ContentCopy } from '@mui/icons-material';
import { motion } from 'framer-motion';
import { authService } from '../../services/authService';

const schema = yup.object({
 email: yup.string().email('Enter a valid email').required('Email is required'),
 password: yup.string().required('Password is required'),
}).required();

const LoginPage = () => {
 const navigate = useNavigate();
 const [showPassword, setShowPassword] = useState(false);
 const [isLoading, setIsLoading] = useState(false);
 const [error, setError] = useState('');
 const [success, setSuccess] = useState('');

 const { register, handleSubmit, setValue, formState: { errors } } = useForm({
 resolver: yupResolver(schema),
 defaultValues: {
 email: 'admin@laserdon.com',
 password: 'admin123'
 }
 });

 const onSubmit = async (data) => {
 setIsLoading(true);
 setError('');
 setSuccess('');
 
 try {
 await authService.login(data.email, data.password);
 setSuccess('Authentication successful! Redirecting...');
 setTimeout(() => navigate('/dashboard'), 800);
 } catch (err) {
 setError(err.message || 'Invalid email or password.');
 } finally {
 setIsLoading(false);
 }
 };

 return (
 <motion.div
 initial={{ opacity: 0, y: 30 }}
 animate={{ opacity: 1, y: 0 }}
 transition={{ duration: 0.5, ease:"easeOut" }}
 >
 <Card 
 className="w-full bg-card/90 /90 backdrop-blur-xl border border-borderLight mb-6"
 sx={{ borderRadius: '24px', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.15)' }}
 >
 <CardContent className="p-8 sm:p-10">
 <Box className="flex flex-col items-center mb-8">
 <Typography variant="h4" className="font-bold text-textPrimary mb-2">
 Welcome Back
 </Typography>
 <Typography variant="body1" className="text-textSecondary text-center">
 Sign in to your LaserDon Admin command center
 </Typography>
 </Box>

 {error && (
 <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}>
 <Alert severity="error" className="mb-6 rounded-lg font-medium">{error}</Alert>
 </motion.div>
 )}

 {success && (
 <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}>
 <Alert severity="success" className="mb-6 rounded-lg font-medium">{success}</Alert>
 </motion.div>
 )}

 <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
 <TextField
 fullWidth
 label="Email Address"
 variant="outlined"
 {...register('email')}
 error={!!errors.email}
 helperText={errors.email?.message}
 InputProps={{
 startAdornment: (
 <InputAdornment position="start">
 <EmailOutlined className="text-textSecondary" />
 </InputAdornment>
 ),
 }}
 sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }}
 />

 <TextField
 fullWidth
 label="Password"
 type={showPassword ? 'text' : 'password'}
 variant="outlined"
 {...register('password')}
 error={!!errors.password}
 helperText={errors.password?.message}
 InputProps={{
 startAdornment: (
 <InputAdornment position="start">
 <LockOutlined className="text-textSecondary" />
 </InputAdornment>
 ),
 endAdornment: (
 <InputAdornment position="end">
 <IconButton
 aria-label="toggle password visibility"
 onClick={() => setShowPassword(!showPassword)}
 edge="end"
 >
 {showPassword ? <VisibilityOff /> : <Visibility />}
 </IconButton>
 </InputAdornment>
 ),
 }}
 sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }}
 />

 <Box className="flex items-center justify-between">
 <FormControlLabel
 control={<Checkbox color="primary" />}
 label={<Typography variant="body2" className="text-textSecondary font-medium">Remember me</Typography>}
 />
 <Link to="/forgot-password" className="text-primary-main text-sm font-semibold hover:underline">
 Forgot Password?
 </Link>
 </Box>

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
 {isLoading ? 'Authenticating...' : 'Login'}
 </Button>
 </form>
 </CardContent>
 </Card>

 </motion.div>
 );
};

export default LoginPage;

