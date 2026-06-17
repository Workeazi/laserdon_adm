import React from 'react';
import { FormControl, Select, MenuItem, InputLabel } from '@mui/material';

const FilterDropdown = ({ label, options, value, onChange, minWidth = 150 }) => {
 return (
 <FormControl size="small" sx={{ minWidth }} className="bg-card">
 {label && <InputLabel id={`filter-${label.toLowerCase()}-label`}>{label}</InputLabel>}
 <Select
 labelId={label ? `filter-${label.toLowerCase()}-label` : undefined}
 id={`filter-${label?.toLowerCase()}`}
 value={value}
 label={label}
 onChange={(e) => onChange(e.target.value)}
 sx={{ borderRadius: '8px' }}
 >
 {options.map((option) => (
 <MenuItem key={option.value} value={option.value}>
 {option.label}
 </MenuItem>
 ))}
 </Select>
 </FormControl>
 );
};

export default FilterDropdown;

