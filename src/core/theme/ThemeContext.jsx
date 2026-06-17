import React, { createContext, useContext, useEffect, useState } from 'react';

import { ThemeProvider as MuiThemeProvider } from '@mui/material/styles';
import { getMuiTheme } from './muiTheme';

const ThemeContext = createContext();

export const useThemeContext = () => useContext(ThemeContext);

export const CustomThemeProvider = ({ children }) => {
 const [theme, setTheme] = useState(() => {
 // Check local storage first
 const savedTheme = localStorage.getItem('admin-portal-theme');
 if (savedTheme) {
 return savedTheme;
 }
 // Default to light
 return 'light';
 });

 useEffect(() => {
 const root = window.document.documentElement;
 
 // Remove old theme class
 root.classList.remove('light', 'dark');
 
 // Add current theme class
 root.classList.add(theme);
 
 // Persist to local storage
 localStorage.setItem('admin-portal-theme', theme);
 }, [theme]);

 const toggleTheme = () => {
 setTheme(prevTheme => prevTheme === 'light' ? 'dark' : 'light');
 };

 const muiThemeInstance = getMuiTheme(theme);

 return (
 <ThemeContext.Provider value={{ theme, toggleTheme }}>
 <MuiThemeProvider theme={muiThemeInstance}>
 {children}
 </MuiThemeProvider>
 </ThemeContext.Provider>
 );
};

