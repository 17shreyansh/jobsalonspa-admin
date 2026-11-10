import { useState } from 'react';
import {
    Box, Typography, Button, Dialog, DialogTitle, DialogContent, DialogActions,
    TextField, MenuItem, Switch, IconButton, Tooltip, Chip,
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

const TYPE_CHIP = {
    standard: { label: 'Salon', sx: { bgcolor: '#f0fdf4', color: '#15803d' } },
    spa:      { label: 'Spa',   sx: { bgcolor: '#eff6ff', color: '#1d4ed8' } },
};

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
        onSuccess: () => { toast.success('Job saved'); setDialog(null); invalidate(); },
        onError: (e) => toast.error(e.response?.data?.message || 'Error'),
    });

    const toggleMutation = useMutation({
        mutationFn: toggleJobStatus,
        onSuccess: () => { toast.success('Status updated'); invalidate(); },
    });

    const deleteMutation = useMutation({
        mutationFn: deleteJob,
        onSuccess: () => { toast.success('Job deleted'); setDeleteTarget(null); invalidate(); },
    });

    const openCreate = () => { setForm(EMPTY); setDialog({ mode: 'create' }); };
    const openEdit = (row) => {
        setForm({ title: row.title, description: row.description, type: row.type, categoryId: row.category?._id || '' });
        setDialog({ mode: 'edit', data: row });
    };

    const columns = [
        {
            key: 'title', label: 'Title',
            render: (row) => <Typography sx={{ fontSize: 13.5, fontWeight: 500 }}>{row.title}</Typography>,
        },
        {
            key: 'type', label: 'Type',
            render: (row) => {
                const cfg = TYPE_CHIP[row.type] || TYPE_CHIP.standard;
                return <Chip label={cfg.label} size="small" sx={cfg.sx} />;
            },
        },
        { key: 'category', label: 'Category', render: (row) => row.category?.name || '—' },
        {
            key: 'status', label: 'Active',
            render: (row) => (
                <Switch
                    checked={row.status}
                    size="small"
                    onChange={() => toggleMutation.mutate(row._id)}
                    sx={{ '& .MuiSwitch-switchBase.Mui-checked': { color: '#2563eb' }, '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': { bgcolor: '#2563eb' } }}
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
                            sx={{ color: '#64748b', '&:hover': { color: '#dc2626', bgcolor: '#fee2e2' } }}>
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
                    <Typography variant="h5">Jobs</Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                        {total} total job listings
                    </Typography>
                </Box>
                <Button variant="contained" startIcon={<AddIcon sx={{ fontSize: 16 }} />} onClick={openCreate}>
                    Add Job
                </Button>
            </Box>

            <DataTable
                columns={columns} rows={rows} total={total} page={page}
                rowsPerPage={10} onPageChange={(_, p) => setPage(p)} loading={isLoading}
            />

            <Dialog open={!!dialog} onClose={() => setDialog(null)} maxWidth="sm" fullWidth>
                <DialogTitle>{dialog?.mode === 'edit' ? 'Edit Job' : 'New Job'}</DialogTitle>
                <DialogContent>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
                        <Box>
                            <Typography sx={{ fontSize: 12, fontWeight: 500, mb: 0.75, color: '#374151' }}>Job Title</Typography>
                            <TextField fullWidth required value={form.title}
                                onChange={(e) => setForm({ ...form, title: e.target.value })}
                                placeholder="e.g. Senior Hairdresser" />
                        </Box>
                        <Box>
                            <Typography sx={{ fontSize: 12, fontWeight: 500, mb: 0.75, color: '#374151' }}>Description</Typography>
                            <TextField fullWidth required multiline rows={4} value={form.description}
                                onChange={(e) => setForm({ ...form, description: e.target.value })}
                                placeholder="Describe the job role and requirements..." />
                        </Box>
                        <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
                            <Box>
                                <Typography sx={{ fontSize: 12, fontWeight: 500, mb: 0.75, color: '#374151' }}>Type</Typography>
                                <TextField select fullWidth value={form.type}
                                    onChange={(e) => setForm({ ...form, type: e.target.value })}>
                                    <MenuItem value="standard">Salon</MenuItem>
                                    <MenuItem value="spa">Spa</MenuItem>
                                </TextField>
                            </Box>
                            <Box>
                                <Typography sx={{ fontSize: 12, fontWeight: 500, mb: 0.75, color: '#374151' }}>Category</Typography>
                                <TextField select fullWidth required value={form.categoryId}
                                    onChange={(e) => setForm({ ...form, categoryId: e.target.value })}>
                                    {categories.map((c) => (
                                        <MenuItem key={c._id} value={c._id}>{c.name}</MenuItem>
                                    ))}
                                </TextField>
                            </Box>
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
                        {saveMutation.isPending ? 'Saving...' : 'Save Job'}
                    </Button>
                </DialogActions>
            </Dialog>

            <ConfirmDialog
                open={!!deleteTarget}
                title="Delete Job"
                message={`Delete "${deleteTarget?.title}"? This cannot be undone.`}
                onConfirm={() => deleteMutation.mutate(deleteTarget._id)}
                onClose={() => setDeleteTarget(null)}
                loading={deleteMutation.isPending}
            />
        </Box>
    );
}
