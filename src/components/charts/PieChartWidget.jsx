import React from 'react';
import { Card, CardContent, Typography } from '@mui/material';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { useThemeContext } from '../../core/theme/ThemeContext';

const PieChartWidget = ({ title, data, colors }) => {
 const { theme } = useThemeContext();
 const isDark = theme === 'dark';
 return (
 <Card className="rounded-card bg-card border border-borderLight shadow-sm w-full h-full">
 <CardContent className="p-6 h-full flex flex-col">
 <Typography variant="h6" className="font-bold text-textPrimary mb-2">
 {title}
 </Typography>
 <div className="flex-1 w-full min-h-[300px]">
 <ResponsiveContainer width="100%" height="100%">
 <PieChart>
 <Pie
 data={data}
 cx="50%"
 cy="50%"
 outerRadius={100}
 dataKey="value"
 stroke="none"
 >
 {data.map((entry, index) => (
 <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
 ))}
 </Pie>
 <Tooltip 
 contentStyle={{ borderRadius: '8px', border: isDark ? '1px solid #334155' : 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', backgroundColor: isDark ? '#1E293B' : '#fff', color: isDark ? '#F8FAFC' : '#111827' }}
 itemStyle={{ color: isDark ? '#F8FAFC' : '#0F172A', fontWeight: 600 }}
 />
 <Legend 
 verticalAlign="bottom" 
 height={36} 
 iconType="circle"
 wrapperStyle={{ fontSize: '12px', paddingTop: '20px' }}
 />
 </PieChart>
 </ResponsiveContainer>
 </div>
 </CardContent>
 </Card>
 );
};

export default PieChartWidget;

