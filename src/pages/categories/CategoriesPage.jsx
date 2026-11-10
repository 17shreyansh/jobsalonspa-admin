import { useState } from 'react';
import {
    Box, Typography, Button, Dialog, DialogTitle, DialogContent,
    DialogActions, TextField, Switch, FormControlLabel, Chip, IconButton, Tooltip,
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
    const [dialog, setDialog] = useState(null); // null | { mode: 'create'|'edit', data }
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
        onSuccess: () => { toast.success('Saved'); setDialog(null); invalidate(); },
        onError: (e) => toast.error(e.response?.data?.message || 'Error'),
    });

    const toggleMutation = useMutation({
        mutationFn: toggleCategoryStatus,
        onSuccess: () => { toast.success('Status updated'); invalidate(); },
    });

    const deleteMutation = useMutation({
        mutationFn: deleteCategory,
        onSuccess: () => { toast.success('Deleted'); setDeleteTarget(null); invalidate(); },
        onError: (e) => toast.error(e.response?.data?.message || 'Error'),
    });

    const openCreate = () => { setForm(EMPTY); setDialog({ mode: 'create' }); };
    const openEdit = (row) => { setForm({ name: row.name, type: row.type }); setDialog({ mode: 'edit', data: row }); };

    const columns = [
        { key: 'name', label: 'Name' },
        { key: 'type', label: 'Type' },
        {
            key: 'status', label: 'Status',
            render: (row) => (
                <Switch checked={row.status} size="small"
                    onChange={() => toggleMutation.mutate(row._id)} />
            ),
        },
        {
            key: 'createdAt', label: 'Created',
            render: (row) => new Date(row.createdAt).toLocaleDateString(),
        },
        {
            key: 'actions', label: '',
            render: (row) => (
                <Box sx={{ display: 'flex', gap: 0.5 }}>
                    <Tooltip title="Edit"><IconButton size="small" onClick={() => openEdit(row)}><EditIcon fontSize="small" /></IconButton></Tooltip>
                    <Tooltip title="Delete"><IconButton size="small" color="error" onClick={() => setDeleteTarget(row)}><DeleteIcon fontSize="small" /></IconButton></Tooltip>
                </Box>
            ),
        },
    ];

    return (
        <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h5" fontWeight={700}>Categories</Typography>
                <Button variant="contained" startIcon={<AddIcon />} onClick={openCreate}>Add Category</Button>
            </Box>

            <DataTable columns={columns} rows={rows} total={total} page={page}
                rowsPerPage={10} onPageChange={(_, p) => setPage(p)} loading={isLoading} />

            {/* Create / Edit Dialog */}
            <Dialog open={!!dialog} onClose={() => setDialog(null)} maxWidth="xs" fullWidth>
                <DialogTitle>{dialog?.mode === 'edit' ? 'Edit Category' : 'New Category'}</DialogTitle>
                <DialogContent sx={{ pt: 2 }}>
                    <TextField label="Name" fullWidth required value={form.name}
                        onChange={(e) => setForm({ ...form, name: e.target.value })} sx={{ mb: 2 }} />
                    <TextField label="Type" fullWidth required value={form.type}
                        onChange={(e) => setForm({ ...form, type: e.target.value })} />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setDialog(null)}>Cancel</Button>
                    <Button variant="contained" onClick={() => saveMutation.mutate(form)}
                        disabled={saveMutation.isPending}>Save</Button>
                </DialogActions>
            </Dialog>

            <ConfirmDialog open={!!deleteTarget} title="Delete Category"
                message={`Delete "${deleteTarget?.name}"? This cannot be undone.`}
                onConfirm={() => deleteMutation.mutate(deleteTarget._id)}
                onClose={() => setDeleteTarget(null)} loading={deleteMutation.isPending} />
        </Box>
    );
}
