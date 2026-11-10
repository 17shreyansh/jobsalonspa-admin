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
    approved: { label: 'Approved', sx: { bgcolor: '#dcfce7', color: '#15803d' } },
    rejected: { label: 'Rejected', sx: { bgcolor: '#fee2e2', color: '#b91c1c' } },
    pending:  { label: 'Pending',  sx: { bgcolor: '#fef9c3', color: '#a16207' } },
};

function InfoCard({ title, fields }) {
    return (
        <Box sx={{ bgcolor: '#fff', borderRadius: '10px', border: '1px solid #e2e8f0', overflow: 'hidden', mb: 2, boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
            <Box sx={{ px: 3, py: 2, borderBottom: '1px solid #f1f5f9', bgcolor: '#f8fafc' }}>
                <Typography sx={{ fontWeight: 600, fontSize: 13.5, color: '#0f172a' }}>{title}</Typography>
            </Box>
            <Box sx={{ p: 3 }}>
                <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px 24px' }}>
                    {fields.map(({ label, value }) => (
                        <Box key={label}>
                            <Typography sx={{ fontSize: 11, fontWeight: 600, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.06em', mb: 0.5 }}>
                                {label}
                            </Typography>
                            <Typography sx={{ fontSize: 13.5, color: value ? '#0f172a' : '#cbd5e1', fontWeight: value ? 500 : 400 }}>
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
            <CircularProgress size={26} sx={{ color: '#2563eb' }} />
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
        ? { bgcolor: '#dbeafe', color: '#1d4ed8' }
        : { bgcolor: '#f0fdf4', color: '#15803d' };

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
                startIcon={<ArrowBackIcon sx={{ fontSize: 15 }} />}
                onClick={() => navigate(backPath)}
                sx={{ mb: 2.5, color: '#475569', fontWeight: 500, fontSize: 13, '&:hover': { bgcolor: '#f1f5f9' } }}
            >
                Back to {app.type === 'candidate' ? 'Candidates' : 'Salons'}
            </Button>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 3 }}>
                <Typography variant="h5">Application Details</Typography>
                <Chip label={app.type} size="small" sx={{ ...typeSx, textTransform: 'capitalize' }} />
                <Chip label={statusCfg.label} size="small" sx={statusCfg.sx} />
            </Box>

            <Grid container spacing={2.5}>
                <Grid item xs={12} md={8}>
                    {app.type === 'candidate' ? (
                        <>
                            <InfoCard title="Personal & Professional Information" fields={candidateFields} />
                            {app.photoPath && (
                                <Box sx={{ bgcolor: '#fff', borderRadius: '10px', border: '1px solid #e2e8f0', p: 3 }}>
                                    <Typography sx={{ fontSize: 11, fontWeight: 600, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.06em', mb: 1.5 }}>
                                        Profile Photo
                                    </Typography>
                                    <img
                                        src={`${import.meta.env.VITE_API_URL.replace('/api/v1', '')}/uploads/photos/${app.photoPath}`}
                                        alt="Candidate"
                                        style={{ width: 96, height: 96, objectFit: 'cover', borderRadius: 8, display: 'block', border: '1px solid #e2e8f0' }}
                                    />
                                </Box>
                            )}
                        </>
                    ) : (
                        <InfoCard title="Salon Information" fields={salonFields} />
                    )}
                </Grid>

                <Grid item xs={12} md={4}>
                    <Box sx={{ bgcolor: '#fff', borderRadius: '10px', border: '1px solid #e2e8f0', overflow: 'hidden', position: 'sticky', top: 68, boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
                        <Box sx={{ px: 3, py: 2, borderBottom: '1px solid #f1f5f9', bgcolor: '#f8fafc' }}>
                            <Typography sx={{ fontWeight: 600, fontSize: 13.5, color: '#0f172a' }}>Application Status</Typography>
                        </Box>
                        <Box sx={{ p: 3 }}>
                            <Typography sx={{ fontSize: 11, fontWeight: 600, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.06em', mb: 1 }}>
                                Current Status
                            </Typography>
                            <Select
                                value={app.status}
                                fullWidth
                                size="small"
                                onChange={(e) => statusMutation.mutate(e.target.value)}
                                sx={{ mb: 2.5, borderRadius: '7px', fontSize: 13.5, fontWeight: 500, color: '#0f172a' }}
                            >
                                <MenuItem value="pending">Pending</MenuItem>
                                <MenuItem value="approved">Approved</MenuItem>
                                <MenuItem value="rejected">Rejected</MenuItem>
                            </Select>

                            <Box sx={{ pt: 2, borderTop: '1px solid #f1f5f9' }}>
                                <Typography sx={{ fontSize: 11, fontWeight: 600, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.06em', mb: 0.75 }}>
                                    Submitted
                                </Typography>
                                <Typography sx={{ fontSize: 13.5, color: '#0f172a', fontWeight: 500 }}>
                                    {new Date(app.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
                                </Typography>
                                <Typography sx={{ fontSize: 12, color: '#64748b', mt: 0.25 }}>
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
