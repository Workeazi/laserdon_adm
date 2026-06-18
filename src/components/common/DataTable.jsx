import React, { useState } from 'react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow, 
  TablePagination, 
  Box 
} from '@mui/material';
import EmptyState from './EmptyState';
import LoadingSkeleton from './LoadingSkeleton';

const DataTable = ({ 
  columns, 
  data, 
  loading = false, 
  totalCount = 0, 
  page = 0, 
  rowsPerPage = 10, 
  onPageChange, 
  onRowsPerPageChange,
  onRowClick
}) => {
  if (loading) {
    return <LoadingSkeleton type="table" rows={rowsPerPage} />;
  }

  if (!data || data.length === 0) {
    return <EmptyState />;
  }

  return (
    <Box className="bg-card rounded-xl border border-borderLight shadow-[0_1px_3px_rgba(0,0,0,0.05)] overflow-hidden w-full">
      <TableContainer className="custom-scrollbar" sx={{ maxHeight: 'calc(100vh - 200px)' }}>
        <Table stickyHeader sx={{ minWidth: 650 }} aria-label="data table">
          <TableHead>
            <TableRow>
              {columns.map((col) => (
                <TableCell 
                  key={col.field} 
                  align={col.align || 'left'}
                  sx={{ 
                    fontWeight: 600, 
                    color: 'text.secondary',
                    fontSize: '0.75rem',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                    paddingY: 2,
                    backgroundColor: 'var(--bg-card)',
                    borderBottom: '1px solid var(--border-color)'
                  }}
                  className="whitespace-nowrap"
                >
                  {col.headerName}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((row, index) => (
              <TableRow
                key={row.id || index}
                hover
                onClick={() => onRowClick && onRowClick(row)}
                sx={{ 
                  cursor: onRowClick ? 'pointer' : 'default',
                  '&:last-child td, &:last-child th': { border: 0 } 
                }}
                className="transition-colors hover:bg-slate-50 dark:hover:bg-slate-800/50"
              >
                {columns.map((col) => (
                  <TableCell 
                    key={`${row.id || index}-${col.field}`} 
                    align={col.align || 'left'}
                    className="whitespace-nowrap py-3 text-textPrimary border-b border-borderLight"
                  >
                    {col.renderCell ? col.renderCell(row) : row[col.field]}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      
      {totalCount > 0 && onPageChange && onRowsPerPageChange && (
        <TablePagination
          component="div"
          count={totalCount}
          page={page}
          onPageChange={(e, newPage) => onPageChange(newPage)}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={(e) => onRowsPerPageChange(parseInt(e.target.value, 10))}
          className="border-t border-borderLight bg-black/5 dark:bg-white/5 text-textPrimary"
        />
      )}
    </Box>
  );
};

export default DataTable;
