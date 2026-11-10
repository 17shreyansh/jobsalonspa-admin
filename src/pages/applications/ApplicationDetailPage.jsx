import { useParams, useNavigate } from 'react-router-dom';
import {
    Box, Typography, Chip, Button, Grid,
    CircularProgress, MenuItem, Select,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { getApplication, updateApplicationStatus } from '../../api/services';

const STATUS_CHIP = {
    approved: { label: 'Approved', sx: { bgcolor: '#dcfce7', color: '#16a34a' } },
    rejected: { label: 'Rejected', sx: { bgcolor: '#fee2e2', color: '#dc2626' } },
    pending: { label: 'Pending', sx: { bgcolor: '#f3f4f6', color: '#6b7280' } },
};

function InfoCard({ title, fields }) {
    return (
        <Box sx={{ bgcolor: '#fff', borderRadius: '12px', border: '1px solid #e5e7eb', overflow: 'hidden', mb: 2 }}>
            <Box sx={{ px: 3, py: 2, borderBottom: '1px solid #f3f4f6' }}>
                <Typography sx={{ fontWeight: 600, fontSize: 13.5 }}>{title}</Typography>
            </Box>
            <Box sx={{ p: 3 }}>
                <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px 24px' }}>
                    {fields.map(({ label, value }) => (
                        <Box key={label}>
                            <Typography sx={{ fontSize: 11, fontWeight: 600, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.05em', mb: 0.5 }}>
                                {label}
                            </Typography>
                            <Typography sx={{ fontSize: 13.5, color: value ? '#111827' : '#d1d5db', fontWeight: value ? 500 : 400 }}>
                                {value || '—'}
                            </Typography>
                        </Box>
                    ))}
                </Box>
            </Box>
        </Box>
    );
}

export default function ApplicationDetailPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const qc = useQueryClient();

    const { data, isLoading } = useQuery({
        queryKey: ['application', id],
        queryFn: () => getApplication(id),
    });

    const app = data?.data?.data?.application;

    const statusMutation = useMutation({
        mutationFn: (status) => updateApplicationStatus(id, status),
        onSuccess: () => { toast.success('Status updated'); qc.invalidateQueries({ queryKey: ['application', id] }); },
        onError: () => toast.error('Failed to update status'),
    });

    if (isLoading) return (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 300 }}>
            <CircularProgress size={28} sx={{ color: '#9ca3af' }} />
        </Box>
    );

    if (!app) return (
        <Box sx={{ textAlign: 'center', py: 8 }}>
            <Typography color="text.secondary">Application not found.</Typography>
        </Box>
    );

    const backPath = app.type === 'candidate' ? '/applications/candidate' : '/applications/salon';
    const statusCfg = STATUS_CHIP[app.status] || STATUS_CHIP.pending;
    const typeSx = app.type === 'candidate'
        ? { bgcolor: '#dbeafe', color: '#2563eb' }
        : { bgcolor: '#fef3c7', color: '#d97706' };

    const candidateFields = [
        { label: 'Full Name', value: app.name },
        { label: 'Phone', value: app.phone },
        { label: 'WhatsApp', value: app.whatsapp },
        { label: 'Gender', value: app.gender },
        { label: 'Age', value: app.age },
        { label: 'Education', value: app.education },
        { label: 'Speciality', value: app.speciality },
        { label: 'Experience', value: app.experience },
        { label: 'Diploma', value: app.diploma },
        { label: 'Job Status', value: app.jobStatus },
        { label: 'Hometown', value: app.hometown },
        { label: 'State', value: app.state },
        { label: 'Current City', value: app.currentCity },
        { label: 'Preferred City', value: app.preferredCity },
        { label: 'Current Salary', value: app.currentSalary },
        { label: 'Expected Salary', value: app.expectedSalary },
        { label: 'Home Service', value: app.remark },
    ];

    const salonFields = [
        { label: 'Salon Name', value: app.salonName },
        { label: 'Phone', value: app.phoneNumber },
        { label: 'WhatsApp', value: app.whatsappNumber },
        { label: 'Address', value: app.salonAddress },
        { label: 'Location', value: app.salonLocation },
        { label: 'Speciality Required', value: app.speciality },
        { label: 'Salary Offered', value: app.salary },
        { label: 'Working Hours', value: app.inTime && app.outTime ? `${app.inTime} – ${app.outTime}` : null },
        { label: 'Diploma Required', value: app.diplomaRequired },
        { label: 'Accommodation', value: app.accommodation },
        { label: 'Food Included', value: app.food },
        { label: 'Query', value: app.anyQuery },
    ];

    return (
        <Box>
            <Button
                startIcon={<ArrowBackIcon sx={{ fontSize: 16 }} />}
                onClick={() => navigate(backPath)}
                sx={{ mb: 2.5, color: '#6b7280', fontWeight: 500, fontSize: 13, '&:hover': { bgcolor: '#f3f4f6' } }}
            >
                Back to {app.type === 'candidate' ? 'Candidates' : 'Salons'}
            </Button>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                <Typography variant="h5">Application Details</Typography>
                <Chip label={app.type} size="small" sx={{ ...typeSx, textTransform: 'capitalize' }} />
                <Chip label={statusCfg.label} size="small" sx={statusCfg.sx} />
            </Box>

            <Grid container spacing={2.5}>
                {/* Left: details */}
                <Grid item xs={12} md={8}>
                    {app.type === 'candidate' ? (
                        <>
                            <InfoCard title="Personal & Professional Information" fields={candidateFields} />
                            {app.photoPath && (
                                <Box sx={{ bgcolor: '#fff', borderRadius: '12px', border: '1px solid #e5e7eb', p: 3 }}>
                                    <Typography sx={{ fontSize: 11, fontWeight: 600, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.05em', mb: 1.5 }}>
                                        Profile Photo
                                    </Typography>
                                    <img
                                        src={`${import.meta.env.VITE_API_URL.replace('/api/v1', '')}/uploads/photos/${app.photoPath}`}
                                        alt="Candidate"
                                        style={{ width: 100, height: 100, objectFit: 'cover', borderRadius: 10, display: 'block' }}
                                    />
                                </Box>
                            )}
                        </>
                    ) : (
                        <InfoCard title="Salon Information" fields={salonFields} />
                    )}
                </Grid>

                {/* Right: status */}
                <Grid item xs={12} md={4}>
                    <Box sx={{ bgcolor: '#fff', borderRadius: '12px', border: '1px solid #e5e7eb', overflow: 'hidden', position: 'sticky', top: 72 }}>
                        <Box sx={{ px: 3, py: 2, borderBottom: '1px solid #f3f4f6' }}>
                            <Typography sx={{ fontWeight: 600, fontSize: 13.5 }}>Application Status</Typography>
                        </Box>
                        <Box sx={{ p: 3 }}>
                            <Typography sx={{ fontSize: 11, fontWeight: 600, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.05em', mb: 1 }}>
                                Current Status
                            </Typography>
                            <Select
                                value={app.status}
                                fullWidth
                                size="small"
                                onChange={(e) => statusMutation.mutate(e.target.value)}
                                sx={{ mb: 2.5, borderRadius: '8px', fontSize: 13.5, fontWeight: 600 }}
                            >
                                <MenuItem value="pending">Pending</MenuItem>
                                <MenuItem value="approved">Approved</MenuItem>
                                <MenuItem value="rejected">Rejected</MenuItem>
                            </Select>

                            <Box sx={{ pt: 2, borderTop: '1px solid #f3f4f6' }}>
                                <Typography sx={{ fontSize: 11, fontWeight: 600, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.05em', mb: 0.75 }}>
                                    Submitted
                                </Typography>
                                <Typography sx={{ fontSize: 13.5, color: '#374151' }}>
                                    {new Date(app.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
                                </Typography>
                                <Typography sx={{ fontSize: 12, color: '#9ca3af', mt: 0.25 }}>
                                    {new Date(app.createdAt).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                                </Typography>
                            </Box>
                        </Box>
                    </Box>
                </Grid>
            </Grid>
        </Box>
    );
}
