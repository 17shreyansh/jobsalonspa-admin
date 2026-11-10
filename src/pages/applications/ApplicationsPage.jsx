import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Box, Typography, Chip, MenuItem, Select, FormControl, InputLabel,
    TextField, InputAdornment, IconButton, Tooltip,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import VisibilityIcon from '@mui/icons-material/Visibility';
import DeleteIcon from '@mui/icons-material/Delete';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import DataTable from '../../components/DataTable';
import ConfirmDialog from '../../components/ConfirmDialog';
import { getApplications, updateApplicationStatus, deleteApplication } from '../../api/services';

const STATUS_COLORS = { pending: 'default', approved: 'success', rejected: 'error' };

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
        onSuccess: () => { toast.success('Deleted'); setDeleteTarget(null); invalidate(); },
    });

    const candidateColumns = [
        { key: 'name', label: 'Name' },
        { key: 'phone', label: 'Phone' },
        { key: 'speciality', label: 'Speciality' },
        { key: 'gender', label: 'Gender', render: (r) => r.gender ? r.gender.charAt(0).toUpperCase() + r.gender.slice(1) : '—' },
        { key: 'currentCity', label: 'City' },
        { key: 'status', label: 'Status', render: (r) => <StatusSelect row={r} /> },
        { key: 'createdAt', label: 'Date', render: (r) => new Date(r.createdAt).toLocaleDateString() },
        { key: 'actions', label: '', render: (r) => <Actions row={r} /> },
    ];

    const salonColumns = [
        { key: 'salonName', label: 'Salon Name' },
        { key: 'salonLocation', label: 'Location' },
        { key: 'phoneNumber', label: 'Phone' },
        { key: 'speciality', label: 'Speciality Required' },
        { key: 'status', label: 'Status', render: (r) => <StatusSelect row={r} /> },
        { key: 'createdAt', label: 'Date', render: (r) => new Date(r.createdAt).toLocaleDateString() },
        { key: 'actions', label: '', render: (r) => <Actions row={r} /> },
    ];

    const StatusSelect = ({ row }) => (
        <FormControl size="small" sx={{ minWidth: 110 }}>
            <Select value={row.status}
                onChange={(e) => statusMutation.mutate({ id: row._id, status: e.target.value })}>
                <MenuItem value="pending">Pending</MenuItem>
                <MenuItem value="approved">Approved</MenuItem>
                <MenuItem value="rejected">Rejected</MenuItem>
            </Select>
        </FormControl>
    );

    const Actions = ({ row }) => (
        <Box sx={{ display: 'flex', gap: 0.5 }}>
            <Tooltip title="View">
                <IconButton size="small" onClick={() => navigate(`/applications/${row._id}`)}>
                    <VisibilityIcon fontSize="small" />
                </IconButton>
            </Tooltip>
            <Tooltip title="Delete">
                <IconButton size="small" color="error" onClick={() => setDeleteTarget(row)}>
                    <DeleteIcon fontSize="small" />
                </IconButton>
            </Tooltip>
        </Box>
    );

    return (
        <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h5" fontWeight={700}>
                    {type === 'candidate' ? 'Candidate Applications' : 'Salon Applications'}
                </Typography>
                <TextField size="small" placeholder="Search..." value={search}
                    onChange={(e) => { setSearch(e.target.value); setPage(0); }}
                    InputProps={{ startAdornment: <InputAdornment position="start"><SearchIcon fontSize="small" /></InputAdornment> }}
                    sx={{ width: 220 }} />
            </Box>

            <DataTable
                columns={type === 'candidate' ? candidateColumns : salonColumns}
                rows={rows} total={total} page={page} rowsPerPage={20}
                onPageChange={(_, p) => setPage(p)} loading={isLoading} />

            <ConfirmDialog open={!!deleteTarget} title="Delete Application"
                message="Delete this application? This cannot be undone."
                onConfirm={() => deleteMutation.mutate(deleteTarget._id)}
                onClose={() => setDeleteTarget(null)} loading={deleteMutation.isPending} />
        </Box>
    );
}
