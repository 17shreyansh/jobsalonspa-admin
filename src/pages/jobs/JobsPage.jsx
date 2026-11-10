import { useState } from 'react';
import {
    Box, Typography, Button, Dialog, DialogTitle, DialogContent, DialogActions,
    TextField, MenuItem, Switch, IconButton, Tooltip,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import DataTable from '../../components/DataTable';
import ConfirmDialog from '../../components/ConfirmDialog';
import { getJobs, createJob, updateJob, toggleJobStatus, deleteJob, getActiveCategories } from '../../api/services';

const EMPTY = { title: '', description: '', type: 'standard', categoryId: '' };

export default function JobsPage() {
    const qc = useQueryClient();
    const [page, setPage] = useState(0);
    const [dialog, setDialog] = useState(null);
    const [deleteTarget, setDeleteTarget] = useState(null);
    const [form, setForm] = useState(EMPTY);

    const { data, isLoading } = useQuery({
        queryKey: ['jobs', page],
        queryFn: () => getJobs({ page: page + 1, limit: 10 }),
    });

    const { data: catData } = useQuery({ queryKey: ['categories-active'], queryFn: getActiveCategories });
    const categories = catData?.data?.data?.categories || [];
    const rows = data?.data?.data?.jobs || [];
    const total = data?.data?.data?.total || 0;

    const invalidate = () => qc.invalidateQueries({ queryKey: ['jobs'] });

    const saveMutation = useMutation({
        mutationFn: (d) => dialog?.data?._id ? updateJob(dialog.data._id, d) : createJob(d),
        onSuccess: () => { toast.success('Saved'); setDialog(null); invalidate(); },
        onError: (e) => toast.error(e.response?.data?.message || 'Error'),
    });

    const toggleMutation = useMutation({
        mutationFn: toggleJobStatus,
        onSuccess: () => { toast.success('Status updated'); invalidate(); },
    });

    const deleteMutation = useMutation({
        mutationFn: deleteJob,
        onSuccess: () => { toast.success('Deleted'); setDeleteTarget(null); invalidate(); },
    });

    const openCreate = () => { setForm(EMPTY); setDialog({ mode: 'create' }); };
    const openEdit = (row) => {
        setForm({ title: row.title, description: row.description, type: row.type, categoryId: row.category._id });
        setDialog({ mode: 'edit', data: row });
    };

    const columns = [
        { key: 'title', label: 'Title' },
        { key: 'type', label: 'Type' },
        { key: 'category', label: 'Category', render: (row) => row.category?.name },
        {
            key: 'status', label: 'Status',
            render: (row) => <Switch checked={row.status} size="small" onChange={() => toggleMutation.mutate(row._id)} />,
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
                <Typography variant="h5" fontWeight={700}>Jobs</Typography>
                <Button variant="contained" startIcon={<AddIcon />} onClick={openCreate}>Add Job</Button>
            </Box>

            <DataTable columns={columns} rows={rows} total={total} page={page}
                rowsPerPage={10} onPageChange={(_, p) => setPage(p)} loading={isLoading} />

            <Dialog open={!!dialog} onClose={() => setDialog(null)} maxWidth="sm" fullWidth>
                <DialogTitle>{dialog?.mode === 'edit' ? 'Edit Job' : 'New Job'}</DialogTitle>
                <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 2 }}>
                    <TextField label="Title" fullWidth required value={form.title}
                        onChange={(e) => setForm({ ...form, title: e.target.value })} />
                    <TextField label="Description" fullWidth required multiline rows={4} value={form.description}
                        onChange={(e) => setForm({ ...form, description: e.target.value })} />
                    <TextField select label="Type" fullWidth value={form.type}
                        onChange={(e) => setForm({ ...form, type: e.target.value })}>
                        <MenuItem value="standard">Standard</MenuItem>
                        <MenuItem value="spa">Spa</MenuItem>
                    </TextField>
                    <TextField select label="Category" fullWidth required value={form.categoryId}
                        onChange={(e) => setForm({ ...form, categoryId: e.target.value })}>
                        {categories.map((c) => <MenuItem key={c._id} value={c._id}>{c.name}</MenuItem>)}
                    </TextField>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setDialog(null)}>Cancel</Button>
                    <Button variant="contained" onClick={() => saveMutation.mutate(form)}
                        disabled={saveMutation.isPending}>Save</Button>
                </DialogActions>
            </Dialog>

            <ConfirmDialog open={!!deleteTarget} title="Delete Job"
                message={`Delete "${deleteTarget?.title}"?`}
                onConfirm={() => deleteMutation.mutate(deleteTarget._id)}
                onClose={() => setDeleteTarget(null)} loading={deleteMutation.isPending} />
        </Box>
    );
}
