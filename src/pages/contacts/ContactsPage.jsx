import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Typography, TextField, InputAdornment, IconButton, Tooltip } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import VisibilityIcon from '@mui/icons-material/Visibility';
import DeleteIcon from '@mui/icons-material/Delete';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import DataTable from '../../components/DataTable';
import ConfirmDialog from '../../components/ConfirmDialog';
import { getContactOwners, deleteContactOwner } from '../../api/services';

export default function ContactsPage() {
    const navigate = useNavigate();
    const qc = useQueryClient();
    const [page, setPage] = useState(0);
    const [search, setSearch] = useState('');
    const [deleteTarget, setDeleteTarget] = useState(null);

    const { data, isLoading } = useQuery({
        queryKey: ['contacts-owners', page, search],
        queryFn: () => getContactOwners({ page: page + 1, limit: 10, search: search || undefined }),
    });

    const rows = data?.data?.data?.owners || [];
    const total = data?.data?.data?.total || 0;

    const deleteMutation = useMutation({
        mutationFn: deleteContactOwner,
        onSuccess: () => {
            toast.success('Owner and contacts deleted');
            setDeleteTarget(null);
            qc.invalidateQueries({ queryKey: ['contacts-owners'] });
        },
    });

    const columns = [
        { key: 'userName', label: 'User Name' },
        { key: 'deviceId', label: 'Device ID', render: (r) => <Typography variant="caption" sx={{ fontFamily: 'monospace' }}>{r.deviceId}</Typography> },
        { key: 'createdAt', label: 'First Seen', render: (r) => new Date(r.createdAt).toLocaleDateString() },
        {
            key: 'actions', label: '',
            render: (r) => (
                <Box sx={{ display: 'flex', gap: 0.5 }}>
                    <Tooltip title="View Contacts">
                        <IconButton size="small" onClick={() => navigate(`/contacts/${r._id}`)}>
                            <VisibilityIcon fontSize="small" />
                        </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete">
                        <IconButton size="small" color="error" onClick={() => setDeleteTarget(r)}>
                            <DeleteIcon fontSize="small" />
                        </IconButton>
                    </Tooltip>
                </Box>
            ),
        },
    ];

    return (
        <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h5" fontWeight={700}>Contacts</Typography>
                <TextField size="small" placeholder="Search by name..." value={search}
                    onChange={(e) => { setSearch(e.target.value); setPage(0); }}
                    InputProps={{ startAdornment: <InputAdornment position="start"><SearchIcon fontSize="small" /></InputAdornment> }}
                    sx={{ width: 220 }} />
            </Box>

            <DataTable columns={columns} rows={rows} total={total} page={page}
                rowsPerPage={10} onPageChange={(_, p) => setPage(p)} loading={isLoading} />

            <ConfirmDialog open={!!deleteTarget} title="Delete Owner"
                message={`Delete "${deleteTarget?.userName}" and all their contacts?`}
                onConfirm={() => deleteMutation.mutate(deleteTarget._id)}
                onClose={() => setDeleteTarget(null)} loading={deleteMutation.isPending} />
        </Box>
    );
}
