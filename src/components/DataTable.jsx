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
                border: '1px solid #e2e8f0',
                borderRadius: '10px',
                overflow: 'hidden',
                boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
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
                                    <CircularProgress size={22} sx={{ color: '#2563eb' }} />
                                </TableCell>
                            </TableRow>
                        ) : rows.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={columns.length} align="center" sx={{ py: 6, border: 0 }}>
                                    <Typography sx={{ color: '#94a3b8', fontSize: 14 }}>{emptyText}</Typography>
                                </TableCell>
                            </TableRow>
                        ) : (
                            rows.map((row, i) => (
                                <TableRow
                                    key={row._id || i}
                                    sx={{
                                        '&:hover': { bgcolor: '#f8fafc' },
                                        '& td': { borderColor: '#f1f5f9' },
                                    }}
                                >
                                    {columns.map((col) => (
                                        <TableCell key={col.key}>
                                            {col.render ? col.render(row) : (row[col.key] ?? <span style={{ color: '#cbd5e1' }}>—</span>)}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </TableContainer>
            <Box sx={{ borderTop: '1px solid #f1f5f9' }}>
                <TablePagination
                    component="div"
                    count={total}
                    page={page}
                    rowsPerPage={rowsPerPage}
                    onPageChange={onPageChange}
                    rowsPerPageOptions={[]}
                    sx={{ '& .MuiTablePagination-toolbar': { minHeight: 46 }, '& p': { fontSize: 13, color: '#475569' } }}
                />
            </Box>
        </Paper>
    );
}
