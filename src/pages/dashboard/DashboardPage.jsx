import { Box, Typography, CircularProgress, Chip } from '@mui/material';
import PeopleIcon from '@mui/icons-material/People';
import StoreIcon from '@mui/icons-material/Store';
import WorkIcon from '@mui/icons-material/Work';
import PhoneAndroidIcon from '@mui/icons-material/PhoneAndroid';
import { useQuery } from '@tanstack/react-query';
import { getDashboardStats } from '../../api/services';

const STATUS_CHIP = {
    approved: { label: 'Approved', sx: { bgcolor: '#dcfce7', color: '#16a34a' } },
    rejected: { label: 'Rejected', sx: { bgcolor: '#fee2e2', color: '#dc2626' } },
    pending: { label: 'Pending', sx: { bgcolor: '#f3f4f6', color: '#6b7280' } },
};

const TYPE_CHIP = {
    candidate: { sx: { bgcolor: '#dbeafe', color: '#2563eb' } },
    salon: { sx: { bgcolor: '#fef3c7', color: '#d97706' } },
};

function StatCard({ title, value, sub, icon: Icon, iconBg, iconColor }) {
    return (
        <Box sx={{
            bgcolor: '#fff', borderRadius: '12px',
            border: '1px solid #e5e7eb',
            p: 2.5,
            display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between',
        }}>
            <Box>
                <Typography sx={{ fontSize: 12, fontWeight: 600, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.05em', mb: 1 }}>
                    {title}
                </Typography>
                <Typography sx={{ fontSize: 28, fontWeight: 700, color: '#111827', lineHeight: 1 }}>
                    {value ?? '—'}
                </Typography>
                {sub && (
                    <Typography sx={{ fontSize: 12, color: '#9ca3af', mt: 0.75 }}>{sub}</Typography>
                )}
            </Box>
            <Box sx={{
                width: 40, height: 40, borderRadius: '10px',
                bgcolor: iconBg, display: 'flex', alignItems: 'center', justifyContent: 'center',
                flexShrink: 0,
            }}>
                <Icon sx={{ fontSize: 20, color: iconColor }} />
            </Box>
        </Box>
    );
}

export default function DashboardPage() {
    const { data, isLoading } = useQuery({ queryKey: ['dashboard'], queryFn: getDashboardStats });
    const s = data?.data?.data;

    if (isLoading) return (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 300 }}>
            <CircularProgress size={28} sx={{ color: '#9ca3af' }} />
        </Box>
    );

    const stats = [
        {
            title: 'Candidate Applications',
            value: s?.applications?.totalCandidates,
            sub: `${s?.applications?.pendingCandidates ?? 0} pending review`,
            icon: PeopleIcon, iconBg: '#dbeafe', iconColor: '#2563eb',
        },
        {
            title: 'Salon Applications',
            value: s?.applications?.totalSalons,
            sub: `${s?.applications?.pendingSalons ?? 0} pending review`,
            icon: StoreIcon, iconBg: '#fef3c7', iconColor: '#d97706',
        },
        {
            title: 'Active Jobs',
            value: s?.jobs?.active,
            sub: `${s?.jobs?.total ?? 0} total jobs`,
            icon: WorkIcon, iconBg: '#dcfce7', iconColor: '#16a34a',
        },
        {
            title: 'Mobile Devices',
            value: s?.devices?.total,
            sub: 'Registered devices',
            icon: PhoneAndroidIcon, iconBg: '#f3f4f6', iconColor: '#6b7280',
        },
    ];

    return (
        <Box>
            <Box sx={{ mb: 3 }}>
                <Typography variant="h5">Dashboard</Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                    Overview of your platform activity
                </Typography>
            </Box>

            {/* Stats grid */}
            <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 2, mb: 4 }}>
                {stats.map((s) => <StatCard key={s.title} {...s} />)}
            </Box>

            {/* Recent applications */}
            <Box sx={{ bgcolor: '#fff', borderRadius: '12px', border: '1px solid #e5e7eb', overflow: 'hidden' }}>
                <Box sx={{ px: 3, py: 2, borderBottom: '1px solid #f3f4f6' }}>
                    <Typography sx={{ fontWeight: 600, fontSize: 14 }}>Recent Applications</Typography>
                </Box>

                {!s?.recentApplications?.length ? (
                    <Box sx={{ py: 6, textAlign: 'center' }}>
                        <Typography sx={{ color: '#9ca3af', fontSize: 14 }}>No recent applications</Typography>
                    </Box>
                ) : (
                    <Box>
                        {s.recentApplications.map((app, i) => {
                            const statusCfg = STATUS_CHIP[app.status] || STATUS_CHIP.pending;
                            const typeCfg = TYPE_CHIP[app.type] || TYPE_CHIP.candidate;
                            return (
                                <Box
                                    key={app._id}
                                    sx={{
                                        px: 3, py: 1.75,
                                        display: 'flex', alignItems: 'center', gap: 2,
                                        borderBottom: i < s.recentApplications.length - 1 ? '1px solid #f3f4f6' : 'none',
                                        '&:hover': { bgcolor: '#fafafa' },
                                    }}
                                >
                                    <Chip
                                        label={app.type}
                                        size="small"
                                        sx={{ ...typeCfg.sx, minWidth: 72, textTransform: 'capitalize' }}
                                    />
                                    <Typography sx={{ flexGrow: 1, fontSize: 13.5, color: '#374151', fontWeight: 500 }}>
                                        {app.name || app.salonName || '—'}
                                    </Typography>
                                    <Typography sx={{ fontSize: 13, color: '#9ca3af' }}>
                                        {app.speciality || '—'}
                                    </Typography>
                                    <Chip label={statusCfg.label} size="small" sx={statusCfg.sx} />
                                    <Typography sx={{ fontSize: 12, color: '#9ca3af', minWidth: 80, textAlign: 'right' }}>
                                        {new Date(app.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                                    </Typography>
                                </Box>
                            );
                        })}
                    </Box>
                )}
            </Box>
        </Box>
    );
}
