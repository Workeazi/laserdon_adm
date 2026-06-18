import React from 'react';
import { Box, Card, Typography, IconButton } from '@mui/material';
import { Phone, WhatsApp, Email, ContentCopy } from '@mui/icons-material';
import toast from 'react-hot-toast';
import supportLogo from '../../../assets/support_logo.png';

const CustomerSupportTab = () => {
  const supportContacts = [
    {
      title: 'Call Support',
      value: '+91 9363100658',
      icon: <Phone className="text-blue-600 dark:text-blue-400" />,
      actionLabel: 'Call Now',
      actionType: 'tel',
    },
    {
      title: 'WhatsApp Support',
      value: '+91 9363100658',
      icon: <WhatsApp className="text-green-600 dark:text-emerald-400" />,
      actionLabel: 'Message',
      actionType: 'whatsapp',
    },
    {
      title: 'Email Support',
      value: 'info@workeazi.com',
      icon: <Email className="text-purple-600 dark:text-purple-400" />,
      actionLabel: 'Email',
      actionType: 'mailto',
    }
  ];

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard');
  };

  return (
    <Box className="w-full animate-fade-in flex flex-col items-center max-w-5xl mx-auto mt-4">
      {/* Main Support Card */}
      <Card className="w-full rounded-2xl shadow-xl dark:shadow-[0_10px_40px_rgba(0,0,0,0.4)] border border-slate-200 dark:border-borderLight bg-white dark:bg-sidebar overflow-hidden flex flex-col md:flex-row">
        
        {/* Left Section: Branding */}
        <Box className="md:w-5/12 bg-slate-50 dark:bg-black/20 p-10 flex flex-col justify-center items-start border-b md:border-b-0 md:border-r border-slate-200 dark:border-borderLight">
          <img 
            src={supportLogo} 
            alt="Support Logo" 
            className="w-auto h-auto object-contain mb-6 max-w-[100px] md:max-w-[120px] lg:max-w-[140px]" 
          />
          <Typography variant="h4" className="font-black text-slate-800 dark:text-white tracking-tight mb-4">
            Support Team
          </Typography>
          <Typography variant="body1" className="text-slate-600 dark:text-slate-400 font-medium mb-2">
            Helping businesses with:
          </Typography>
          <ul className="text-slate-600 dark:text-slate-400 font-medium space-y-1 ml-1">
            <li className="flex items-center"><span className="mr-2 text-blue-500">•</span> Software Development</li>
            <li className="flex items-center"><span className="mr-2 text-blue-500">•</span> Automation Solutions</li>
            <li className="flex items-center"><span className="mr-2 text-blue-500">•</span> Technical Support</li>
            <li className="flex items-center"><span className="mr-2 text-blue-500">•</span> Admin Portal Assistance</li>
          </ul>
        </Box>

        {/* Right Section: Support Cards */}
        <Box className="md:w-7/12 p-8 md:p-10 bg-white dark:bg-sidebar flex flex-col justify-center space-y-4">
          {supportContacts.map((contact, index) => (
            <Box 
              key={index} 
              className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-5 rounded-xl border border-slate-100 dark:border-white/5 bg-white dark:bg-white/5 shadow-sm hover:shadow-md hover:border-blue-100 dark:hover:border-blue-900/50 transition-all duration-200 group"
            >
              <Box className="flex items-center space-x-4 mb-4 sm:mb-0">
                <Box className="w-12 h-12 rounded-full bg-slate-50 dark:bg-black/30 flex items-center justify-center border border-slate-100 dark:border-white/10 shrink-0 group-hover:scale-110 transition-transform duration-200">
                  {contact.icon}
                </Box>
                <Box>
                  <Typography variant="caption" className="text-slate-500 dark:text-textSecondary font-bold uppercase tracking-wider text-[10px]">
                    {contact.title}
                  </Typography>
                  <Typography variant="subtitle1" className="font-bold text-slate-800 dark:text-white leading-tight">
                    {contact.value}
                  </Typography>
                </Box>
              </Box>

              <Box className="flex items-center space-x-2 self-end sm:self-auto w-full sm:w-auto justify-end">
                <IconButton size="small" onClick={() => handleCopy(contact.value)} className="text-slate-400 hover:text-slate-600 dark:hover:text-white" title="Copy to clipboard">
                  <ContentCopy fontSize="small" />
                </IconButton>
                <Box 
                  className="px-4 py-1.5 rounded-lg bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 font-bold text-xs cursor-pointer hover:bg-blue-100 dark:hover:bg-blue-800/50 transition-colors uppercase tracking-wide border border-blue-100 dark:border-blue-800/50"
                  onClick={() => {
                    if (contact.actionType === 'tel') window.location.href = `tel:+919363100658`;
                    if (contact.actionType === 'mailto') window.location.href = `mailto:info@workeazi.com`;
                    if (contact.actionType === 'whatsapp') window.open(`https://wa.me/919363100658`, '_blank');
                  }}
                >
                  {contact.actionLabel}
                </Box>
              </Box>
            </Box>
          ))}
        </Box>
      </Card>
    </Box>
  );
};

export default CustomerSupportTab;
