import { Box, Typography, CircularProgress, Chip } from '@mui/material';
import PeopleIcon from '@mui/icons-material/People';
import StoreIcon from '@mui/icons-material/Store';
import WorkIcon from '@mui/icons-material/Work';
import PhoneAndroidIcon from '@mui/icons-material/PhoneAndroid';
import { useQuery } from '@tanstack/react-query';
import { getDashboardStats } from '../../api/services';

const STATUS_CHIP = {
    approved: { label: 'Approved', sx: { bgcolor: '#dcfce7', color: '#15803d' } },
    rejected: { label: 'Rejected', sx: { bgcolor: '#fee2e2', color: '#b91c1c' } },
    pending:  { label: 'Pending',  sx: { bgcolor: '#fef9c3', color: '#a16207' } },
};

const TYPE_CHIP = {
    candidate: { sx: { bgcolor: '#dbeafe', color: '#1d4ed8' } },
    salon:     { sx: { bgcolor: '#f0fdf4', color: '#15803d' } },
};

function StatCard({ title, value, sub, icon: Icon, iconColor, iconBg }) {
    return (
        <Box sx={{
            bgcolor: '#fff',
            borderRadius: '10px',
            border: '1px solid #e2e8f0',
            p: 2.5,
            display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between',
            boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
        }}>
            <Box>
                <Typography sx={{ fontSize: 11.5, fontWeight: 600, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.06em', mb: 1 }}>
                    {title}
                </Typography>
                <Typography sx={{ fontSize: 28, fontWeight: 700, color: '#0f172a', lineHeight: 1, mb: 0.75 }}>
                    {value ?? '—'}
                </Typography>
                {sub && (
                    <Typography sx={{ fontSize: 12, color: '#64748b' }}>{sub}</Typography>
                )}
            </Box>
            <Box sx={{
                width: 42, height: 42, borderRadius: '8px',
                bgcolor: iconBg,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
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
            <CircularProgress size={26} sx={{ color: '#2563eb' }} />
        </Box>
    );

    const stats = [
        {
            title: 'Candidate Applications',
            value: s?.applications?.totalCandidates,
            sub: `${s?.applications?.pendingCandidates ?? 0} pending review`,
            icon: PeopleIcon, iconBg: '#eff6ff', iconColor: '#2563eb',
        },
        {
            title: 'Salon Applications',
            value: s?.applications?.totalSalons,
            sub: `${s?.applications?.pendingSalons ?? 0} pending review`,
            icon: StoreIcon, iconBg: '#f0fdf4', iconColor: '#16a34a',
        },
        {
            title: 'Active Jobs',
            value: s?.jobs?.active,
            sub: `${s?.jobs?.total ?? 0} total jobs`,
            icon: WorkIcon, iconBg: '#fefce8', iconColor: '#ca8a04',
        },
        {
            title: 'Mobile Devices',
            value: s?.devices?.total,
            sub: 'Registered devices',
            icon: PhoneAndroidIcon, iconBg: '#f8fafc', iconColor: '#475569',
        },
    ];

    return (
        <Box>
            <Box sx={{ mb: 3 }}>
                <Typography variant="h5">Dashboard</Typography>
                <Typography variant="body2" sx={{ mt: 0.5 }}>
                    Platform overview and recent activity
                </Typography>
            </Box>

            <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 2, mb: 3 }}>
                {stats.map((s) => <StatCard key={s.title} {...s} />)}
            </Box>

            {/* Recent applications */}
            <Box sx={{ bgcolor: '#fff', borderRadius: '10px', border: '1px solid #e2e8f0', overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
                <Box sx={{ px: 3, py: 2, borderBottom: '1px solid #f1f5f9' }}>
                    <Typography sx={{ fontWeight: 600, fontSize: 14, color: '#0f172a' }}>Recent Applications</Typography>
                </Box>

                {!s?.recentApplications?.length ? (
                    <Box sx={{ py: 6, textAlign: 'center' }}>
                        <Typography sx={{ color: '#94a3b8', fontSize: 14 }}>No recent applications</Typography>
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
                                        borderBottom: i < s.recentApplications.length - 1 ? '1px solid #f1f5f9' : 'none',
                                        '&:hover': { bgcolor: '#f8fafc' },
                                    }}
                                >
                                    <Chip label={app.type} size="small" sx={{ ...typeCfg.sx, minWidth: 72, textTransform: 'capitalize' }} />
                                    <Typography sx={{ flexGrow: 1, fontSize: 13.5, color: '#0f172a', fontWeight: 500 }}>
                                        {app.name || app.salonName || '—'}
                                    </Typography>
                                    <Typography sx={{ fontSize: 13, color: '#64748b' }}>
                                        {app.speciality || '—'}
                                    </Typography>
                                    <Chip label={statusCfg.label} size="small" sx={statusCfg.sx} />
                                    <Typography sx={{ fontSize: 12, color: '#94a3b8', minWidth: 72, textAlign: 'right' }}>
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
