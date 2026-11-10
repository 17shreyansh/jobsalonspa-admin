import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Typography, TextField, InputAdornment, IconButton, Tooltip } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import DeleteIcon from '@mui/icons-material/Delete';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import DataTable from '../../components/DataTable';
import ConfirmDialog from '../../components/ConfirmDialog';
import { getContactOwners, deleteContactOwner, getContactStats } from '../../api/services';

export default function ContactsPage() {
    const navigate = useNavigate();
    const qc = useQueryClient();
    const [page, setPage] = useState(0);
    const [search, setSearch] = useState('');
    const [deleteTarget, setDeleteTarget] = useState(null);

    const { data: statsData } = useQuery({ queryKey: ['contact-stats'], queryFn: getContactStats });
    const { data, isLoading } = useQuery({
        queryKey: ['contacts-owners', page, search],
        queryFn: () => getContactOwners({ page: page + 1, limit: 10, search: search || undefined }),
    });

    const rows = data?.data?.data?.owners || [];
    const total = data?.data?.data?.total || 0;
    const stats = statsData?.data?.data || {};

    const deleteMutation = useMutation({
        mutationFn: deleteContactOwner,
        onSuccess: () => {
            toast.success('Owner and contacts deleted');
            setDeleteTarget(null);
            qc.invalidateQueries({ queryKey: ['contacts-owners'] });
            qc.invalidateQueries({ queryKey: ['contact-stats'] });
        },
    });

    const columns = [
        {
            key: 'userName', label: 'User Name',
            render: (r) => <Typography sx={{ fontSize: 13.5, fontWeight: 500 }}>{r.userName || '—'}</Typography>,
        },
        {
            key: 'deviceId', label: 'Device ID',
            render: (r) => (
                <Typography sx={{ fontSize: 12, fontFamily: 'monospace', color: '#6b7280', maxWidth: 200 }} noWrap>
                    {r.deviceId}
                </Typography>
            ),
        },
        {
            key: 'createdAt', label: 'First Seen',
            render: (r) => new Date(r.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }),
        },
        {
            key: 'actions', label: '',
            render: (r) => (
                <Box sx={{ display: 'flex', gap: 0.5 }}>
                    <Tooltip title="View contacts">
                        <IconButton size="small" onClick={() => navigate(`/contacts/${r._id}`)}>
                            <OpenInNewIcon sx={{ fontSize: 15 }} />
                        </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete">
                        <IconButton size="small" onClick={() => setDeleteTarget(r)}
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
                    <Typography variant="h5">Contacts</Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                        Device contact uploads from the mobile app
                    </Typography>
                </Box>
                <TextField
                    placeholder="Search by name..."
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

            {/* Stat pills */}
            <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
                {[
                    { label: 'Total Devices', value: stats.totalDevices ?? '—', bg: '#f3f4f6', color: '#374151' },
                    { label: 'Total Contacts', value: stats.totalContacts ?? '—', bg: '#dbeafe', color: '#2563eb' },
                ].map((s) => (
                    <Box key={s.label} sx={{
                        bgcolor: s.bg, borderRadius: '10px',
                        px: 2.5, py: 1.5,
                        display: 'flex', alignItems: 'center', gap: 1.5,
                    }}>
                        <Typography sx={{ fontSize: 20, fontWeight: 700, color: s.color, lineHeight: 1 }}>
                            {s.value}
                        </Typography>
                        <Typography sx={{ fontSize: 12, color: '#6b7280', fontWeight: 500 }}>
                            {s.label}
                        </Typography>
                    </Box>
                ))}
            </Box>

            <DataTable
                columns={columns} rows={rows} total={total} page={page}
                rowsPerPage={10} onPageChange={(_, p) => setPage(p)} loading={isLoading}
            />

            <ConfirmDialog
                open={!!deleteTarget}
                title="Delete Owner"
                message={`Delete "${deleteTarget?.userName}" and all their contacts? This cannot be undone.`}
                onConfirm={() => deleteMutation.mutate(deleteTarget._id)}
                onClose={() => setDeleteTarget(null)}
                loading={deleteMutation.isPending}
            />
        </Box>
    );
}
