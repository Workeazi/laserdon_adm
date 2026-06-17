import React, { useState, useEffect } from 'react';
import { Search } from '@mui/icons-material';

const SearchBar = ({ placeholder = 'Search...', onChange, value = '', delay = 300 }) => {
 const [searchTerm, setSearchTerm] = useState(value);

 useEffect(() => {
 const handler = setTimeout(() => {
 if (onChange) onChange(searchTerm);
 }, delay);

 return () => clearTimeout(handler);
 }, [searchTerm, delay, onChange]);

 useEffect(() => {
 setSearchTerm(value);
 }, [value]);

 return (
 <div className="relative w-full max-w-md">
 <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
 <Search className="text-textSecondary" fontSize="small" />
 </div>
 <input
 type="text"
 className="block w-full pl-10 pr-3 py-2 border border-borderLight rounded-btn leading-5 bg-card placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-primary-main focus:border-primary-main sm:text-sm transition duration-150 ease-in-out shadow-sm hover:shadow-sm"
 placeholder={placeholder}
 value={searchTerm}
 onChange={(e) => setSearchTerm(e.target.value)}
 />
 </div>
 );
};

export default SearchBar;

