import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, Typography, Button, IconButton, Tooltip, TextField, InputAdornment } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import DeleteIcon from '@mui/icons-material/Delete';
import SearchIcon from '@mui/icons-material/Search';
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
        {
            key: 'name', label: 'Name',
            render: (r) => <Typography sx={{ fontSize: 13.5, fontWeight: 500 }}>{r.name || '—'}</Typography>,
        },
        { key: 'phone', label: 'Phone' },
        {
            key: 'createdAt', label: 'Added',
            render: (r) => new Date(r.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }),
        },
        {
            key: 'actions', label: '',
            render: (r) => (
                <Tooltip title="Delete">
                    <IconButton size="small" onClick={() => setDeleteTarget(r)}
                        sx={{ color: '#9ca3af', '&:hover': { color: '#dc2626', bgcolor: '#fee2e2' } }}>
                        <DeleteIcon sx={{ fontSize: 15 }} />
                    </IconButton>
                </Tooltip>
            ),
        },
    ];

    return (
        <Box>
            <Button
                startIcon={<ArrowBackIcon sx={{ fontSize: 16 }} />}
                onClick={() => navigate('/contacts')}
                sx={{ mb: 2.5, color: '#6b7280', fontWeight: 500, fontSize: 13, '&:hover': { bgcolor: '#f3f4f6' } }}
            >
                Back to Contacts
            </Button>

            {/* Device info card */}
            {ownerData && (
                <Box sx={{
                    bgcolor: '#fff', borderRadius: '12px', border: '1px solid #e5e7eb',
                    p: 2.5, mb: 3,
                    display: 'flex', alignItems: 'center', gap: 3,
                }}>
                    <Box sx={{
                        width: 40, height: 40, borderRadius: '10px',
                        bgcolor: '#f3f4f6',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        flexShrink: 0,
                    }}>
                        <Typography sx={{ fontWeight: 800, fontSize: 16, color: '#374151' }}>
                            {ownerData.userName?.[0]?.toUpperCase() || 'D'}
                        </Typography>
                    </Box>
                    <Box sx={{ flexGrow: 1 }}>
                        <Typography sx={{ fontWeight: 600, fontSize: 14, color: '#111827' }}>
                            {ownerData.userName}
                        </Typography>
                        <Typography sx={{ fontSize: 11, fontFamily: 'monospace', color: '#9ca3af', mt: 0.25 }}>
                            {ownerData.deviceId}
                        </Typography>
                    </Box>
                    <Box sx={{ textAlign: 'right' }}>
                        <Typography sx={{ fontSize: 22, fontWeight: 700, color: '#111827', lineHeight: 1 }}>
                            {total}
                        </Typography>
                        <Typography sx={{ fontSize: 11, color: '#9ca3af', mt: 0.25 }}>contacts</Typography>
                    </Box>
                    <Box sx={{ borderLeft: '1px solid #e5e7eb', pl: 3, textAlign: 'right' }}>
                        <Typography sx={{ fontSize: 11, color: '#9ca3af' }}>First seen</Typography>
                        <Typography sx={{ fontSize: 13, color: '#374151', fontWeight: 500, mt: 0.25 }}>
                            {new Date(ownerData.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                        </Typography>
                    </Box>
                </Box>
            )}

            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2.5 }}>
                <Typography variant="h5">Contact List</Typography>
                <TextField
                    placeholder="Search contacts..."
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
                columns={columns} rows={rows} total={total} page={page}
                rowsPerPage={15} onPageChange={(_, p) => setPage(p)} loading={isLoading}
            />

            <ConfirmDialog
                open={!!deleteTarget}
                title="Delete Contact"
                message={`Delete contact "${deleteTarget?.name}"? This cannot be undone.`}
                onConfirm={() => deleteMutation.mutate(deleteTarget._id)}
                onClose={() => setDeleteTarget(null)}
                loading={deleteMutation.isPending}
            />
        </Box>
    );
}
