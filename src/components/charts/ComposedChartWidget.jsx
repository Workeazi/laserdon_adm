import React from 'react';
import { Card, CardContent, Typography, Box } from '@mui/material';
import { ComposedChart, Line, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useThemeContext } from '../../core/theme/ThemeContext';

const ComposedChartWidget = ({ title, data, barDataKey, lineDataKey, barColor = '#10B981', lineColor = '#8B5CF6' }) => {
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
 <ComposedChart
 data={data}
 margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
 >
 <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={isDark ? '#334155' : '#E2E8F0'} />
 <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: isDark ? '#94A3B8' : '#64748B', fontSize: 12 }} dy={10} />
 <YAxis yAxisId="left" axisLine={false} tickLine={false} tick={{ fill: isDark ? '#94A3B8' : '#64748B', fontSize: 12 }} dx={-10} />
 <YAxis yAxisId="right" orientation="right" axisLine={false} tickLine={false} tick={{ fill: isDark ? '#94A3B8' : '#64748B', fontSize: 12 }} dx={10} />
 <Tooltip 
 cursor={{ fill: isDark ? '#1E293B' : '#F8FAFC' }}
 contentStyle={{ borderRadius: '8px', border: isDark ? '1px solid #334155' : 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', backgroundColor: isDark ? '#1E293B' : '#fff', color: isDark ? '#F8FAFC' : '#111827' }}
 />
 <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '20px' }} />
 <Bar yAxisId="left" dataKey={barDataKey} barSize={20} fill={barColor} radius={[4, 4, 0, 0]} name="Vendors" />
 <Line yAxisId="right" type="monotone" dataKey={lineDataKey} stroke={lineColor} strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} name="Revenue" />
 </ComposedChart>
 </ResponsiveContainer>
 </div>
 </CardContent>
 </Card>
 );
};

export default ComposedChartWidget;

