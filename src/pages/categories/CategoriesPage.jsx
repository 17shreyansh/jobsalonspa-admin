import { useState } from 'react';
import {
    Box, Typography, Button, Dialog, DialogTitle, DialogContent,
    DialogActions, TextField, Switch, IconButton, Tooltip,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import DataTable from '../../components/DataTable';
import ConfirmDialog from '../../components/ConfirmDialog';
import { getCategories, createCategory, updateCategory, toggleCategoryStatus, deleteCategory } from '../../api/services';

const EMPTY = { name: '', type: '' };

export default function CategoriesPage() {
    const qc = useQueryClient();
    const [page, setPage] = useState(0);
    const [dialog, setDialog] = useState(null);
    const [deleteTarget, setDeleteTarget] = useState(null);
    const [form, setForm] = useState(EMPTY);

    const { data, isLoading } = useQuery({
        queryKey: ['categories', page],
        queryFn: () => getCategories({ page: page + 1, limit: 10 }),
    });

    const rows = data?.data?.data?.categories || [];
    const total = data?.data?.data?.total || 0;

    const invalidate = () => qc.invalidateQueries({ queryKey: ['categories'] });

    const saveMutation = useMutation({
        mutationFn: (d) => dialog?.data?._id ? updateCategory(dialog.data._id, d) : createCategory(d),
        onSuccess: () => { toast.success('Category saved'); setDialog(null); invalidate(); },
        onError: (e) => toast.error(e.response?.data?.message || 'Error'),
    });

    const toggleMutation = useMutation({
        mutationFn: toggleCategoryStatus,
        onSuccess: () => { toast.success('Status updated'); invalidate(); },
    });

    const deleteMutation = useMutation({
        mutationFn: deleteCategory,
        onSuccess: () => { toast.success('Category deleted'); setDeleteTarget(null); invalidate(); },
        onError: (e) => toast.error(e.response?.data?.message || 'Error'),
    });

    const openCreate = () => { setForm(EMPTY); setDialog({ mode: 'create' }); };
    const openEdit = (row) => { setForm({ name: row.name, type: row.type }); setDialog({ mode: 'edit', data: row }); };

    const columns = [
        {
            key: 'name', label: 'Name',
            render: (row) => <Typography sx={{ fontSize: 13.5, fontWeight: 500 }}>{row.name}</Typography>,
        },
        { key: 'type', label: 'Type' },
        {
            key: 'status', label: 'Active',
            render: (row) => (
                <Switch
                    checked={row.status}
                    size="small"
                    onChange={() => toggleMutation.mutate(row._id)}
                    sx={{ '& .MuiSwitch-switchBase.Mui-checked': { color: '#16a34a' }, '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': { bgcolor: '#16a34a' } }}
                />
            ),
        },
        {
            key: 'createdAt', label: 'Created',
            render: (row) => new Date(row.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }),
        },
        {
            key: 'actions', label: '',
            render: (row) => (
                <Box sx={{ display: 'flex', gap: 0.5 }}>
                    <Tooltip title="Edit">
                        <IconButton size="small" onClick={() => openEdit(row)}>
                            <EditIcon sx={{ fontSize: 15 }} />
                        </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete">
                        <IconButton size="small" onClick={() => setDeleteTarget(row)}
                            sx={{ color: '#9ca3af', '&:hover': { color: '#dc2626', bgcolor: '#fee2e2' } }}>
                            <DeleteIcon sx={{ fontSize: 15 }} />
                        </IconButton>
                    </Tooltip>
                </Box>
            ),
        },
    ];

    return (
        <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3 }}>
                <Box>
                    <Typography variant="h5">Categories</Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                        {total} total categories
                    </Typography>
                </Box>
                <Button variant="contained" startIcon={<AddIcon sx={{ fontSize: 16 }} />} onClick={openCreate}>
                    Add Category
                </Button>
            </Box>

            <DataTable
                columns={columns} rows={rows} total={total} page={page}
                rowsPerPage={10} onPageChange={(_, p) => setPage(p)} loading={isLoading}
            />

            <Dialog open={!!dialog} onClose={() => setDialog(null)} maxWidth="xs" fullWidth>
                <DialogTitle>{dialog?.mode === 'edit' ? 'Edit Category' : 'New Category'}</DialogTitle>
                <DialogContent>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
                        <Box>
                            <Typography sx={{ fontSize: 12, fontWeight: 500, mb: 0.75, color: '#374151' }}>Name</Typography>
                            <TextField fullWidth required value={form.name}
                                onChange={(e) => setForm({ ...form, name: e.target.value })}
                                placeholder="e.g. Hairdresser" />
                        </Box>
                        <Box>
                            <Typography sx={{ fontSize: 12, fontWeight: 500, mb: 0.75, color: '#374151' }}>Type</Typography>
                            <TextField fullWidth required value={form.type}
                                onChange={(e) => setForm({ ...form, type: e.target.value })}
                                placeholder="e.g. salon" />
                        </Box>
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setDialog(null)} variant="outlined" color="inherit"
                        sx={{ color: '#374151', borderColor: '#e5e7eb' }}>
                        Cancel
                    </Button>
                    <Button variant="contained" onClick={() => saveMutation.mutate(form)}
                        disabled={saveMutation.isPending}>
                        {saveMutation.isPending ? 'Saving...' : 'Save'}
                    </Button>
                </DialogActions>
            </Dialog>

            <ConfirmDialog
                open={!!deleteTarget}
                title="Delete Category"
                message={`Delete "${deleteTarget?.name}"? This cannot be undone.`}
                onConfirm={() => deleteMutation.mutate(deleteTarget._id)}
                onClose={() => setDeleteTarget(null)}
                loading={deleteMutation.isPending}
            />
        </Box>
    );
}
