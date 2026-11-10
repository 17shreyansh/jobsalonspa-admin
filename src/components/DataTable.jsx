import {
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
    Paper, TablePagination, CircularProgress, Box, Typography,
} from '@mui/material';

export default function DataTable({ columns, rows, total, page, rowsPerPage, onPageChange, loading, emptyText = 'No records found' }) {
    return (
        <Paper elevation={0} variant="outlined">
            <TableContainer>
                <Table size="small">
                    <TableHead>
                        <TableRow sx={{ bgcolor: '#f5f5f5' }}>
                            {columns.map((col) => (
                                <TableCell key={col.key} sx={{ fontWeight: 600, whiteSpace: 'nowrap' }}>
                                    {col.label}
                                </TableCell>
                            ))}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {loading ? (
                            <TableRow>
                                <TableCell colSpan={columns.length} align="center" sx={{ py: 4 }}>
                                    <CircularProgress size={28} />
                                </TableCell>
                            </TableRow>
                        ) : rows.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={columns.length} align="center" sx={{ py: 4 }}>
                                    <Typography color="text.secondary">{emptyText}</Typography>
                                </TableCell>
                            </TableRow>
                        ) : (
                            rows.map((row, i) => (
                                <TableRow key={row._id || i} hover>
                                    {columns.map((col) => (
                                        <TableCell key={col.key}>
                                            {col.render ? col.render(row) : row[col.key] ?? '—'}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </TableContainer>
            <TablePagination
                component="div"
                count={total}
                page={page}
                rowsPerPage={rowsPerPage}
                onPageChange={onPageChange}
                rowsPerPageOptions={[]}
            />
        </Paper>
    );
}
