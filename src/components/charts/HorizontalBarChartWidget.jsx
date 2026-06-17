import React from 'react';
import { Card, CardContent, Typography, Box } from '@mui/material';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useThemeContext } from '../../core/theme/ThemeContext';

const HorizontalBarChartWidget = ({ title, data, dataKey, barColor = '#3B82F6' }) => {
 const { theme } = useThemeContext();
 const isDark = theme === 'dark';

 return (
 <Card className="rounded-card bg-card border border-borderLight shadow-sm w-full h-full">
 <CardContent className="p-6 h-full flex flex-col">
 <Typography variant="h6" className="font-bold text-textPrimary mb-4">
 {title}
 </Typography>
 <div className="flex-1 w-full min-h-[300px]">
 <ResponsiveContainer width="100%" height="100%">
 <BarChart
 data={data}
 layout="vertical"
 margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
 >
 <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke={isDark ? '#334155' : '#E2E8F0'} />
 <XAxis type="number" axisLine={false} tickLine={false} tick={{ fill: isDark ? '#94A3B8' : '#64748B', fontSize: 12 }} dy={10} />
 <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{ fill: isDark ? '#94A3B8' : '#64748B', fontSize: 12 }} dx={-10} width={100} />
 <Tooltip 
 cursor={{ fill: isDark ? '#1E293B' : '#F8FAFC' }}
 contentStyle={{ borderRadius: '8px', border: isDark ? '1px solid #334155' : 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', backgroundColor: isDark ? '#1E293B' : '#fff', color: isDark ? '#F8FAFC' : '#111827' }}
 />
 <Bar dataKey={dataKey} fill={barColor} radius={[0, 4, 4, 0]} barSize={20} />
 </BarChart>
 </ResponsiveContainer>
 </div>
 </CardContent>
 </Card>
 );
};

export default HorizontalBarChartWidget;

