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
            {/* Left panel */}
            <Box sx={{
                width: 420, flexShrink: 0,
                bgcolor: '#111827',
                display: { xs: 'none', md: 'flex' },
                flexDirection: 'column',
                justifyContent: 'space-between',
                p: 5,
            }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    <Box sx={{
                        width: 36, height: 36, borderRadius: '10px',
                        bgcolor: '#dc2626',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                        <Typography sx={{ color: '#fff', fontWeight: 800, fontSize: 18 }}>J</Typography>
                    </Box>
                    <Typography sx={{ color: '#fff', fontWeight: 700, fontSize: 15 }}>
                        Job Salon & Spa
                    </Typography>
                </Box>

                <Box>
                    <Typography sx={{ color: '#fff', fontSize: 28, fontWeight: 700, lineHeight: 1.3, mb: 2 }}>
                        Manage your salon recruitment platform
                    </Typography>
                    <Typography sx={{ color: '#6b7280', fontSize: 14, lineHeight: 1.7 }}>
                        Review applications, post jobs, manage categories, and track your network — all in one place.
                    </Typography>
                </Box>

                <Typography sx={{ color: '#374151', fontSize: 12 }}>
                    © {new Date().getFullYear()} Job Salon & Spa
                </Typography>
            </Box>

            {/* Right panel */}
            <Box sx={{
                flexGrow: 1,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                bgcolor: '#f9fafb', p: 3,
            }}>
                <Box sx={{ width: '100%', maxWidth: 380 }}>
                    <Box sx={{ mb: 4 }}>
                        <Typography variant="h5" sx={{ mb: 0.5 }}>Sign in</Typography>
                        <Typography variant="body2" color="text.secondary">
                            Enter your credentials to access the admin panel
                        </Typography>
                    </Box>

                    <form onSubmit={handleSubmit}>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                            <Box>
                                <Typography sx={{ fontSize: 13, fontWeight: 500, mb: 0.75, color: '#374151' }}>
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
                                <Typography sx={{ fontSize: 13, fontWeight: 500, mb: 0.75, color: '#374151' }}>
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
                                sx={{ mt: 1, py: 1.25, fontSize: 14 }}
                            >
                                {loading ? <CircularProgress size={20} color="inherit" /> : 'Sign in'}
                            </Button>
                        </Box>
                    </form>
                </Box>
            </Box>
        </Box>
    );
}
