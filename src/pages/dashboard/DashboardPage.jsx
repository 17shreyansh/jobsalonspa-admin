import { Grid, Card, CardContent, Typography, Box, CircularProgress, Chip } from '@mui/material';
import PeopleIcon from '@mui/icons-material/People';
import StoreIcon from '@mui/icons-material/Store';
import WorkIcon from '@mui/icons-material/Work';
import PhoneAndroidIcon from '@mui/icons-material/PhoneAndroid';
import { useQuery } from '@tanstack/react-query';
import { getDashboardStats } from '../../api/services';

const StatCard = ({ title, value, icon, color, sub }) => (
    <Card elevation={0} variant="outlined" sx={{ borderRadius: 2 }}>
        <CardContent>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <Box>
                    <Typography variant="body2" color="text.secondary" gutterBottom>{title}</Typography>
                    <Typography variant="h4" fontWeight={700}>{value ?? '—'}</Typography>
                    {sub && <Typography variant="caption" color="text.secondary">{sub}</Typography>}
                </Box>
                <Box sx={{ bgcolor: `${color}20`, p: 1.5, borderRadius: 2, color }}>
                    {icon}
                </Box>
            </Box>
        </CardContent>
    </Card>
);

export default function DashboardPage() {
    const { data, isLoading } = useQuery({ queryKey: ['dashboard'], queryFn: getDashboardStats });
    const s = data?.data?.data;

    if (isLoading) return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 8 }}><CircularProgress /></Box>;

    return (
        <Box>
            <Typography variant="h5" fontWeight={700} mb={3}>Dashboard</Typography>
            <Grid container spacing={2} mb={4}>
                <Grid item xs={12} sm={6} md={3}>
                    <StatCard title="Candidate Applications" value={s?.applications?.totalCandidates}
                        icon={<PeopleIcon />} color="#1976d2"
                        sub={`${s?.applications?.pendingCandidates} pending`} />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <StatCard title="Salon Applications" value={s?.applications?.totalSalons}
                        icon={<StoreIcon />} color="#e94560"
                        sub={`${s?.applications?.pendingSalons} pending`} />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <StatCard title="Active Jobs" value={s?.jobs?.active}
                        icon={<WorkIcon />} color="#2e7d32"
                        sub={`${s?.jobs?.total} total`} />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <StatCard title="Mobile Devices" value={s?.devices?.total}
                        icon={<PhoneAndroidIcon />} color="#ed6c02" />
                </Grid>
            </Grid>

            <Typography variant="h6" fontWeight={600} mb={2}>Recent Applications</Typography>
            <Card elevation={0} variant="outlined" sx={{ borderRadius: 2 }}>
                <CardContent sx={{ p: 0 }}>
                    {s?.recentApplications?.map((app) => (
                        <Box key={app._id} sx={{ px: 2, py: 1.5, borderBottom: '1px solid #f0f0f0', display: 'flex', alignItems: 'center', gap: 2 }}>
                            <Chip label={app.type} size="small" color={app.type === 'candidate' ? 'primary' : 'secondary'} />
                            <Typography variant="body2" sx={{ flexGrow: 1 }}>
                                {app.name || app.salonName || '—'} — {app.speciality || '—'}
                            </Typography>
                            <Chip label={app.status} size="small"
                                color={app.status === 'approved' ? 'success' : app.status === 'rejected' ? 'error' : 'default'} />
                            <Typography variant="caption" color="text.secondary">
                                {new Date(app.createdAt).toLocaleDateString()}
                            </Typography>
                        </Box>
                    ))}
                </CardContent>
            </Card>
        </Box>
    );
}
