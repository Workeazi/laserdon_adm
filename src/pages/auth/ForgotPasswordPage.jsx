import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Box, Card, CardContent, Typography, TextField, Button, Alert, InputAdornment } from '@mui/material';
import { EmailOutlined, ArrowBack } from '@mui/icons-material';
import { motion } from 'framer-motion';

const schema = yup.object({
 email: yup.string().email('Enter a valid email').required('Email is required'),
}).required();

const ForgotPasswordPage = () => {
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
 <Link to="/login" className="flex items-center text-textSecondary hover:text-primary-main mb-6 transition-colors">
 <ArrowBack fontSize="small" className="mr-1" />
 <Typography variant="body2" className="font-medium">Back to Login</Typography>
 </Link>

 <Box className="mb-8">
 <Typography variant="h4" className="font-bold text-textPrimary mb-2">
 Forgot Password
 </Typography>
 <Typography variant="body1" className="text-textSecondary">
 Enter your email address and we'll send you a link to reset your password.
 </Typography>
 </Box>

 {success ? (
 <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
 <Alert severity="success" className="mb-6 rounded-lg font-medium">
 Reset link sent! Please check your email inbox.
 </Alert>
 <Button fullWidth variant="outlined" component={Link} to="/login" size="large" sx={{ borderRadius: '12px' }}>
 Return to Login
 </Button>
 </motion.div>
 ) : (
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
 {isLoading ? 'Sending Link...' : 'Send Reset Link'}
 </Button>
 </form>
 )}
 </CardContent>
 </Card>
 </motion.div>
 );
};

export default ForgotPasswordPage;

