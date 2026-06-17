import React from 'react';
import { Card, CardContent, Typography } from '@mui/material';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useThemeContext } from '../../core/theme/ThemeContext';

const LineChartWidget = ({ title, data, dataKey, lineColors }) => {
 const { theme } = useThemeContext();
 const isDark = theme === 'dark';
 return (
 <Card className="rounded-card bg-card border border-borderLight shadow-sm w-full h-full">
 <CardContent className="p-6 h-full flex flex-col">
 <Typography variant="h6" className="font-bold text-textPrimary mb-6">
 {title}
 </Typography>
 <div className="flex-1 w-full min-h-[300px]">
 <ResponsiveContainer width="100%" height="100%">
 <LineChart data={data} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
 <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={isDark ? '#334155' : '#E2E8F0'} />
 <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: isDark ? '#94A3B8' : '#64748B', fontSize: 12 }} dy={10} />
 <YAxis axisLine={false} tickLine={false} tick={{ fill: isDark ? '#94A3B8' : '#64748B', fontSize: 12 }} dx={-10} />
 <Tooltip 
 contentStyle={{ borderRadius: '8px', border: isDark ? '1px solid #334155' : 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', backgroundColor: isDark ? '#1E293B' : '#fff', color: isDark ? '#F8FAFC' : '#111827' }}
 />
 {dataKey.map((key, index) => (
 <Line 
 key={key}
 type="monotone" 
 dataKey={key} 
 stroke={lineColors[index] || '#2563EB'} 
 strokeWidth={3}
 dot={{ r: 4, strokeWidth: 2 }}
 activeDot={{ r: 6 }}
 />
 ))}
 </LineChart>
 </ResponsiveContainer>
 </div>
 </CardContent>
 </Card>
 );
};

export default LineChartWidget;

