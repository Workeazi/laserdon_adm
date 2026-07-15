import React from 'react';
import { Box, Card, Typography, Button, IconButton, Tooltip } from '@mui/material';
import { Phone, WhatsApp, Email, ContentCopy, SupportAgent } from '@mui/icons-material';
import toast from 'react-hot-toast';
import supportLogo from '../../../assets/support_logo.png';

const CustomerSupportTab = () => {
  const handleCopy = (text, type) => {
    navigator.clipboard.writeText(text);
    toast.success(`${type} copied to clipboard!`, {
      style: {
        borderRadius: '12px',
        background: '#333',
        color: '#fff',
      },
    });
  };

  const supportContacts = [
    {
      title: 'Phone Support',
      value: '+91 9363100658',
      description: 'Speak directly with our technical team.',
      icon: Phone,
      themeColor: 'blue',
      actionLabel: 'Call Now',
      action: () => window.location.href = 'tel:+919363100658',
      copyType: 'Phone number'
    },
    {
      title: 'WhatsApp Chat',
      value: '+91 9363100658',
      description: 'Quick responses for urgent queries.',
      icon: WhatsApp,
      themeColor: 'emerald',
      actionLabel: 'Message Us',
      action: () => window.open('https://wa.me/919363100658', '_blank'),
      copyType: 'WhatsApp number'
    },
    {
      title: 'Email Us',
      value: 'info@workeazi.com',
      description: 'For detailed inquiries and documentation.',
      icon: Email,
      themeColor: 'purple',
      actionLabel: 'Send Email',
      action: () => window.location.href = 'mailto:info@workeazi.com',
      copyType: 'Email address'
    }
  ];

  // Helper to map color strings to tailwind classes since dynamic interpolation can be tricky with JIT
  const getColorClasses = (color) => {
    const classes = {
      blue: {
        bg: 'bg-blue-50 dark:bg-blue-900/20',
        text: 'text-blue-600 dark:text-blue-400',
        hoverBg: 'group-hover:bg-blue-500',
        hoverText: 'group-hover:text-white',
        border: 'border-blue-100 dark:border-blue-800/50',
        btnHover: 'hover:bg-blue-50 dark:hover:bg-blue-900/30'
      },
      emerald: {
        bg: 'bg-emerald-50 dark:bg-emerald-900/20',
        text: 'text-emerald-600 dark:text-emerald-400',
        hoverBg: 'group-hover:bg-emerald-500',
        hoverText: 'group-hover:text-white',
        border: 'border-emerald-100 dark:border-emerald-800/50',
        btnHover: 'hover:bg-emerald-50 dark:hover:bg-emerald-900/30'
      },
      purple: {
        bg: 'bg-purple-50 dark:bg-purple-900/20',
        text: 'text-purple-600 dark:text-purple-400',
        hoverBg: 'group-hover:bg-purple-500',
        hoverText: 'group-hover:text-white',
        border: 'border-purple-100 dark:border-purple-800/50',
        btnHover: 'hover:bg-purple-50 dark:hover:bg-purple-900/30'
      }
    };
    return classes[color];
  };

  return (
    <Box className="w-full animate-fade-in flex flex-col items-center max-w-6xl mx-auto mt-2 mb-12">
      
      {/* Hero Section */}
      <Box className="w-full relative rounded-[2.5rem] bg-gradient-to-b from-slate-50 to-white dark:from-sidebar dark:to-background border border-slate-100 dark:border-white/5 shadow-sm overflow-hidden mb-8 p-10 md:p-16 flex flex-col items-center text-center">
        {/* Decorative background elements */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
          <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] rounded-full bg-blue-100/40 dark:bg-blue-900/10 blur-[80px]"></div>
          <div className="absolute top-[20%] -right-[10%] w-[40%] h-[60%] rounded-full bg-purple-100/40 dark:bg-purple-900/10 blur-[80px]"></div>
        </div>

        <div className="relative z-10 flex flex-col items-center">
          <Box className="bg-white dark:bg-white/5 p-4 rounded-3xl shadow-sm border border-slate-100 dark:border-white/10 mb-8 inline-block backdrop-blur-sm">
            <img 
              src={supportLogo} 
              alt="WorkeAzi Logo" 
              className="h-16 md:h-20 object-contain" 
            />
          </Box>
          
          <Typography variant="h3" className="font-extrabold text-slate-800 dark:text-white tracking-tight mb-4 text-3xl md:text-5xl">
            How can we help you?
          </Typography>
          
          <Typography className="text-slate-500 dark:text-slate-400 max-w-2xl text-base md:text-lg leading-relaxed">
            Our dedicated support team is ready to assist you with software development, automation solutions, technical troubleshooting, and admin portal management.
          </Typography>
        </div>
      </Box>

      {/* Cards Grid */}
      <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-6">
        {supportContacts.map((contact, index) => {
          const colors = getColorClasses(contact.themeColor);
          const Icon = contact.icon;

          return (
            <Card 
              key={index} 
              className="relative flex flex-col p-8 rounded-3xl shadow-sm hover:shadow-2xl transition-all duration-300 border border-slate-100 dark:border-white/5 bg-white dark:bg-sidebar group hover:-translate-y-1.5 overflow-hidden"
              elevation={0}
            >
              {/* Copy Button (Absolute Top Right) */}
              <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                <Tooltip title="Copy" placement="left">
                  <IconButton 
                    size="small" 
                    onClick={() => handleCopy(contact.value, contact.copyType)} 
                    className="text-slate-400 hover:text-slate-700 dark:hover:text-white bg-slate-50 dark:bg-white/5 hover:bg-slate-100 dark:hover:bg-white/10"
                  >
                    <ContentCopy fontSize="small" className="text-[16px]" />
                  </IconButton>
                </Tooltip>
              </div>

              {/* Icon */}
              <Box className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-6 transition-all duration-300 ${colors.bg} ${colors.hoverBg}`}>
                <Icon className={`text-3xl transition-colors duration-300 ${colors.text} ${colors.hoverText}`} />
              </Box>

              {/* Content */}
              <Typography variant="h6" className="font-bold text-slate-800 dark:text-white mb-2">
                {contact.title}
              </Typography>
              <Typography className="text-slate-500 dark:text-slate-400 text-sm mb-6 flex-grow">
                {contact.description}
              </Typography>

              {/* Value & Action */}
              <div className="mt-auto pt-6 border-t border-slate-100 dark:border-white/5">
                <Typography className="font-bold text-slate-800 dark:text-white text-lg tracking-wide mb-4 text-center">
                  {contact.value}
                </Typography>
                
                <Button 
                  variant="outlined" 
                  fullWidth 
                  className={`rounded-xl py-2.5 font-bold border-2 transition-all duration-200 ${colors.border} ${colors.text} ${colors.btnHover}`}
                  onClick={contact.action}
                >
                  {contact.actionLabel}
                </Button>
              </div>
            </Card>
          );
        })}
      </div>

    </Box>
  );
};

export default CustomerSupportTab;
