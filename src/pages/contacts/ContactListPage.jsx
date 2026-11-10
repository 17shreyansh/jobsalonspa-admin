import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, Typography, Button, IconButton, Tooltip, TextField, InputAdornment, Paper, Divider } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import DeleteIcon from '@mui/icons-material/Delete';
import SearchIcon from '@mui/icons-material/Search';
import PhoneAndroidIcon from '@mui/icons-material/PhoneAndroid';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import DataTable from '../../components/DataTable';
import ConfirmDialog from '../../components/ConfirmDialog';
import { getOwnerContacts, deleteContact, getContactOwner } from '../../api/services';

export default function ContactListPage() {
    const { ownerId } = useParams();
    const navigate = useNavigate();
    const qc = useQueryClient();
    const [page, setPage] = useState(0);
    const [search, setSearch] = useState('');
    const [deleteTarget, setDeleteTarget] = useState(null);

    const { data: ownerData } = useQuery({
        queryKey: ['contact-owner', ownerId],
        queryFn: () => getContactOwner(ownerId),
        select: (res) => res?.data?.data?.owner,
    });

    const { data, isLoading } = useQuery({
        queryKey: ['contacts', ownerId, page, search],
        queryFn: () => getOwnerContacts(ownerId, { page: page + 1, limit: 15, search: search || undefined }),
    });

    const rows = data?.data?.data?.contacts || [];
    const total = data?.data?.data?.total || 0;

    const deleteMutation = useMutation({
        mutationFn: deleteContact,
        onSuccess: () => {
            toast.success('Contact deleted');
            setDeleteTarget(null);
            qc.invalidateQueries({ queryKey: ['contacts', ownerId] });
            qc.invalidateQueries({ queryKey: ['contact-stats'] });
        },
    });

    const columns = [
        { key: 'name', label: 'Name' },
        { key: 'phone', label: 'Phone' },
        { key: 'createdAt', label: 'Added', render: (r) => new Date(r.createdAt).toLocaleDateString() },
        {
            key: 'actions', label: '',
            render: (r) => (
                <Tooltip title="Delete">
                    <IconButton size="small" color="error" onClick={() => setDeleteTarget(r)}>
                        <DeleteIcon fontSize="small" />
                    </IconButton>
                </Tooltip>
            ),
        },
    ];

    return (
        <Box>
            <Button startIcon={<ArrowBackIcon />} onClick={() => navigate('/contacts')} sx={{ mb: 2 }}>
                Back to Contacts
            </Button>

            {ownerData && (
                <Paper variant="outlined" sx={{ p: 2, mb: 3, display: 'flex', alignItems: 'center', gap: 2 }}>
                    <PhoneAndroidIcon color="primary" />
                    <Box>
                        <Typography fontWeight={700}>{ownerData.userName}</Typography>
                        <Typography variant="caption" sx={{ fontFamily: 'monospace', color: 'text.secondary' }}>
                            {ownerData.deviceId}
                        </Typography>
                    </Box>
                    <Divider orientation="vertical" flexItem sx={{ mx: 1 }} />
                    <Typography variant="body2" color="text.secondary">
                        First seen: {new Date(ownerData.createdAt).toLocaleDateString()}
                    </Typography>
                    <Box sx={{ ml: 'auto' }}>
                        <Typography variant="h6" fontWeight={700} color="primary">{total}</Typography>
                        <Typography variant="caption" color="text.secondary">contacts</Typography>
                    </Box>
                </Paper>
            )}

            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h5" fontWeight={700}>Contact List</Typography>
                <TextField size="small" placeholder="Search..." value={search}
                    onChange={(e) => { setSearch(e.target.value); setPage(0); }}
                    InputProps={{ startAdornment: <InputAdornment position="start"><SearchIcon fontSize="small" /></InputAdornment> }}
                    sx={{ width: 220 }} />
            </Box>

            <DataTable columns={columns} rows={rows} total={total} page={page}
                rowsPerPage={15} onPageChange={(_, p) => setPage(p)} loading={isLoading} />

            <ConfirmDialog open={!!deleteTarget} title="Delete Contact"
                message={`Delete contact "${deleteTarget?.name}"?`}
                onConfirm={() => deleteMutation.mutate(deleteTarget._id)}
                onClose={() => setDeleteTarget(null)} loading={deleteMutation.isPending} />
        </Box>
    );
}
