import {
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
    Paper, TablePagination, CircularProgress, Box, Typography,
} from '@mui/material';

export default function DataTable({
    columns, rows, total, page, rowsPerPage,
    onPageChange, loading, emptyText = 'No records found',
}) {
    return (
        <Paper
            elevation={0}
            sx={{
                border: '1px solid #e5e7eb',
                borderRadius: '12px',
                overflow: 'hidden',
            }}
        >
            <TableContainer>
                <Table>
                    <TableHead>
                        <TableRow>
                            {columns.map((col) => (
                                <TableCell key={col.key} sx={{ whiteSpace: 'nowrap' }}>
                                    {col.label}
                                </TableCell>
                            ))}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {loading ? (
                            <TableRow>
                                <TableCell colSpan={columns.length} align="center" sx={{ py: 6, border: 0 }}>
                                    <CircularProgress size={24} sx={{ color: '#9ca3af' }} />
                                </TableCell>
                            </TableRow>
                        ) : rows.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={columns.length} align="center" sx={{ py: 6, border: 0 }}>
                                    <Typography sx={{ color: '#9ca3af', fontSize: 14 }}>{emptyText}</Typography>
                                </TableCell>
                            </TableRow>
                        ) : (
                            rows.map((row, i) => (
                                <TableRow
                                    key={row._id || i}
                                    sx={{
                                        '&:hover': { bgcolor: '#f9fafb' },
                                        '& td': { borderColor: '#f3f4f6' },
                                    }}
                                >
                                    {columns.map((col) => (
                                        <TableCell key={col.key} sx={{ fontSize: 13.5, color: '#374151' }}>
                                            {col.render ? col.render(row) : (row[col.key] ?? <span style={{ color: '#d1d5db' }}>—</span>)}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </TableContainer>
            <Box sx={{ borderTop: '1px solid #f3f4f6' }}>
                <TablePagination
                    component="div"
                    count={total}
                    page={page}
                    rowsPerPage={rowsPerPage}
                    onPageChange={onPageChange}
                    rowsPerPageOptions={[]}
                    sx={{ '& .MuiTablePagination-toolbar': { minHeight: 48 }, '& p': { fontSize: 13 } }}
                />
            </Box>
        </Paper>
    );
}
