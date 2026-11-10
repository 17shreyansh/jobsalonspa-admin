import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Button, TextField, Typography, CircularProgress, InputAdornment, IconButton } from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import toast from 'react-hot-toast';
import { login } from '../../api/services';
import useAuthStore from '../../store/authStore';

export default function LoginPage() {
    const navigate = useNavigate();
    const setAuth = useAuthStore((s) => s.setAuth);
    const [form, setForm] = useState({ email: '', password: '' });
    const [loading, setLoading] = useState(false);
    const [showPw, setShowPw] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const { data } = await login(form);
            setAuth(data.data.admin, data.data.accessToken, data.data.refreshToken);
            navigate('/');
        } catch (err) {
            toast.error(err.response?.data?.message || 'Invalid credentials');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box sx={{ minHeight: '100vh', display: 'flex' }}>
            {/* Left panel — dark brand */}
            <Box sx={{
                width: 420, flexShrink: 0,
                bgcolor: '#0f172a',
                display: { xs: 'none', md: 'flex' },
                flexDirection: 'column',
                justifyContent: 'space-between',
                p: 5,
                borderRight: '1px solid #1e293b',
            }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    <Box sx={{
                        width: 36, height: 36, borderRadius: '8px',
                        bgcolor: '#2563eb',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                        <Typography sx={{ color: '#fff', fontWeight: 800, fontSize: 18 }}>J</Typography>
                    </Box>
                    <Typography sx={{ color: '#f1f5f9', fontWeight: 700, fontSize: 15 }}>
                        Job Salon & Spa
                    </Typography>
                </Box>

                <Box>
                    <Typography sx={{ color: '#f1f5f9', fontSize: 24, fontWeight: 700, lineHeight: 1.4, mb: 2 }}>
                        Recruitment Management Platform
                    </Typography>
                    <Typography sx={{ color: '#64748b', fontSize: 14, lineHeight: 1.8 }}>
                        Review applications, manage job listings, handle categories, and monitor your network from a single dashboard.
                    </Typography>

                    <Box sx={{ mt: 4, display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                        {['Manage candidate & salon applications', 'Post and control job listings', 'Track platform activity in real time'].map((t) => (
                            <Box key={t} sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                                <Box sx={{ width: 6, height: 6, borderRadius: '50%', bgcolor: '#2563eb', flexShrink: 0 }} />
                                <Typography sx={{ color: '#94a3b8', fontSize: 13.5 }}>{t}</Typography>
                            </Box>
                        ))}
                    </Box>
                </Box>

                <Typography sx={{ color: '#334155', fontSize: 12 }}>
                    © {new Date().getFullYear()} Job Salon & Spa. All rights reserved.
                </Typography>
            </Box>

            {/* Right panel — login form */}
            <Box sx={{
                flexGrow: 1,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                bgcolor: '#f4f6f9', p: 3,
            }}>
                <Box sx={{ width: '100%', maxWidth: 380 }}>
                    <Box sx={{ mb: 3.5 }}>
                        <Typography sx={{ fontSize: 22, fontWeight: 700, color: '#0f172a', mb: 0.5 }}>
                            Sign in
                        </Typography>
                        <Typography sx={{ fontSize: 14, color: '#64748b' }}>
                            Enter your admin credentials to continue
                        </Typography>
                    </Box>

                    <Box sx={{
                        bgcolor: '#fff',
                        borderRadius: '10px',
                        p: 3,
                        border: '1px solid #e2e8f0',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
                    }}>
                        <form onSubmit={handleSubmit}>
                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
                                <Box>
                                    <Typography sx={{ fontSize: 13, fontWeight: 600, mb: 0.75, color: '#374151' }}>
                                        Email address
                                    </Typography>
                                    <TextField
                                        type="email" fullWidth required
                                        placeholder="admin@example.com"
                                        value={form.email}
                                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                                    />
                                </Box>

                                <Box>
                                    <Typography sx={{ fontSize: 13, fontWeight: 600, mb: 0.75, color: '#374151' }}>
                                        Password
                                    </Typography>
                                    <TextField
                                        type={showPw ? 'text' : 'password'}
                                        fullWidth required
                                        placeholder="Enter your password"
                                        value={form.password}
                                        onChange={(e) => setForm({ ...form, password: e.target.value })}
                                        InputProps={{
                                            endAdornment: (
                                                <InputAdornment position="end">
                                                    <IconButton size="small" onClick={() => setShowPw(!showPw)} edge="end">
                                                        {showPw ? <VisibilityOffIcon fontSize="small" /> : <VisibilityIcon fontSize="small" />}
                                                    </IconButton>
                                                </InputAdornment>
                                            ),
                                        }}
                                    />
                                </Box>

                                <Button
                                    type="submit" variant="contained" fullWidth size="large"
                                    disabled={loading}
                                    sx={{ mt: 0.5, py: 1.25, fontSize: 14 }}
                                >
                                    {loading ? <CircularProgress size={20} color="inherit" /> : 'Sign in'}
                                </Button>
                            </Box>
                        </form>
                    </Box>
                </Box>
            </Box>
        </Box>
    );
}
