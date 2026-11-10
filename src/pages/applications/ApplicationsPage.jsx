import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Box, Typography, Chip, MenuItem, Select,
    TextField, InputAdornment, IconButton, Tooltip,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import DeleteIcon from '@mui/icons-material/Delete';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import DataTable from '../../components/DataTable';
import ConfirmDialog from '../../components/ConfirmDialog';
import { getApplications, updateApplicationStatus, deleteApplication } from '../../api/services';

const STATUS_CHIP = {
    approved: { label: 'Approved', sx: { bgcolor: '#dcfce7', color: '#16a34a' } },
    rejected: { label: 'Rejected', sx: { bgcolor: '#fee2e2', color: '#dc2626' } },
    pending: { label: 'Pending', sx: { bgcolor: '#f3f4f6', color: '#6b7280' } },
};

export default function ApplicationsPage({ type }) {
    const navigate = useNavigate();
    const qc = useQueryClient();
    const [page, setPage] = useState(0);
    const [search, setSearch] = useState('');
    const [deleteTarget, setDeleteTarget] = useState(null);

    const { data, isLoading } = useQuery({
        queryKey: ['applications', type, page, search],
        queryFn: () => getApplications({ type, page: page + 1, limit: 20, search: search || undefined }),
    });

    const rows = data?.data?.data?.applications || [];
    const total = data?.data?.data?.total || 0;

    const invalidate = () => qc.invalidateQueries({ queryKey: ['applications', type] });

    const statusMutation = useMutation({
        mutationFn: ({ id, status }) => updateApplicationStatus(id, status),
        onSuccess: () => { toast.success('Status updated'); invalidate(); },
        onError: (e) => toast.error(e.response?.data?.message || 'Error'),
    });

    const deleteMutation = useMutation({
        mutationFn: deleteApplication,
        onSuccess: () => { toast.success('Application deleted'); setDeleteTarget(null); invalidate(); },
    });

    const StatusSelect = ({ row }) => (
        <Select
            value={row.status}
            size="small"
            onChange={(e) => statusMutation.mutate({ id: row._id, status: e.target.value })}
            sx={{
                fontSize: 12, fontWeight: 600, borderRadius: '6px',
                minWidth: 110,
                ...(STATUS_CHIP[row.status]?.sx || {}),
                '& .MuiOutlinedInput-notchedOutline': { border: 'none' },
                '& .MuiSelect-icon': { color: 'inherit' },
            }}
        >
            <MenuItem value="pending">Pending</MenuItem>
            <MenuItem value="approved">Approved</MenuItem>
            <MenuItem value="rejected">Rejected</MenuItem>
        </Select>
    );

    const Actions = ({ row }) => (
        <Box sx={{ display: 'flex', gap: 0.5 }}>
            <Tooltip title="View details">
                <IconButton size="small" onClick={() => navigate(`/applications/${row._id}`)}>
                    <OpenInNewIcon sx={{ fontSize: 15 }} />
                </IconButton>
            </Tooltip>
            <Tooltip title="Delete">
                <IconButton size="small" onClick={() => setDeleteTarget(row)}
                    sx={{ color: '#9ca3af', '&:hover': { color: '#dc2626', bgcolor: '#fee2e2' } }}>
                    <DeleteIcon sx={{ fontSize: 15 }} />
                </IconButton>
            </Tooltip>
        </Box>
    );

    const candidateColumns = [
        { key: 'name', label: 'Name', render: (r) => <Typography sx={{ fontSize: 13.5, fontWeight: 500 }}>{r.name || '—'}</Typography> },
        { key: 'phone', label: 'Phone' },
        { key: 'speciality', label: 'Speciality' },
        { key: 'gender', label: 'Gender', render: (r) => r.gender ? r.gender.charAt(0).toUpperCase() + r.gender.slice(1) : '—' },
        { key: 'currentCity', label: 'City' },
        { key: 'status', label: 'Status', render: (r) => <StatusSelect row={r} /> },
        { key: 'createdAt', label: 'Date', render: (r) => new Date(r.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) },
        { key: 'actions', label: '', render: (r) => <Actions row={r} /> },
    ];

    const salonColumns = [
        { key: 'salonName', label: 'Salon Name', render: (r) => <Typography sx={{ fontSize: 13.5, fontWeight: 500 }}>{r.salonName || '—'}</Typography> },
        { key: 'salonLocation', label: 'Location' },
        { key: 'phoneNumber', label: 'Phone' },
        { key: 'speciality', label: 'Speciality Required' },
        { key: 'status', label: 'Status', render: (r) => <StatusSelect row={r} /> },
        { key: 'createdAt', label: 'Date', render: (r) => new Date(r.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) },
        { key: 'actions', label: '', render: (r) => <Actions row={r} /> },
    ];

    return (
        <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3 }}>
                <Box>
                    <Typography variant="h5">
                        {type === 'candidate' ? 'Candidate Applications' : 'Salon Applications'}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                        {total} total {type === 'candidate' ? 'candidates' : 'salons'}
                    </Typography>
                </Box>
                <TextField
                    placeholder="Search..."
                    value={search}
                    onChange={(e) => { setSearch(e.target.value); setPage(0); }}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <SearchIcon sx={{ fontSize: 16, color: '#9ca3af' }} />
                            </InputAdornment>
                        ),
                    }}
                    sx={{ width: 240 }}
                />
            </Box>

            <DataTable
                columns={type === 'candidate' ? candidateColumns : salonColumns}
                rows={rows} total={total} page={page} rowsPerPage={20}
                onPageChange={(_, p) => setPage(p)} loading={isLoading}
            />

            <ConfirmDialog
                open={!!deleteTarget}
                title="Delete Application"
                message="This will permanently delete the application. This action cannot be undone."
                onConfirm={() => deleteMutation.mutate(deleteTarget._id)}
                onClose={() => setDeleteTarget(null)}
                loading={deleteMutation.isPending}
            />
        </Box>
    );
}
