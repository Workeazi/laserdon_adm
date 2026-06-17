import React from 'react';
import { Link } from 'react-router-dom';
import { Box, Card, CardContent, Typography, Button } from '@mui/material';
import { SearchOff, ArrowBack } from '@mui/icons-material';
import { motion } from 'framer-motion';

const NotFoundPage = () => {
 return (
 <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
 <Card className="w-full bg-card/90 backdrop-blur-xl border border-borderLight text-center" sx={{ borderRadius: '24px', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.15)' }}>
 <CardContent className="p-8 sm:p-12">
 <Box className="w-20 h-20 bg-gray-100 text-textSecondary rounded-full flex items-center justify-center mx-auto mb-6">
 <SearchOff sx={{ fontSize: 40 }} />
 </Box>
 <Typography variant="h3" className="font-bold text-textPrimary mb-2">
 404
 </Typography>
 <Typography variant="h6" className="font-bold text-textPrimary mb-2">
 Page Not Found
 </Typography>
 <Typography variant="body1" className="text-textSecondary mb-8">
 The page you are looking for doesn't exist or has been moved.
 </Typography>
 <Button
 variant="contained"
 color="primary"
 component={Link}
 to="/dashboard"
 startIcon={<ArrowBack />}
 size="large"
 sx={{ borderRadius: '12px' }}
 disableElevation
 >
 Return to Dashboard
 </Button>
 </CardContent>
 </Card>
 </motion.div>
 );
};

export default NotFoundPage;

