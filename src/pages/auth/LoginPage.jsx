import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Button, TextField, Typography, Paper, CircularProgress } from '@mui/material';
import toast from 'react-hot-toast';
import { login } from '../../api/services';
import useAuthStore from '../../store/authStore';

export default function LoginPage() {
    const navigate = useNavigate();
    const setAuth = useAuthStore((s) => s.setAuth);
    const [form, setForm] = useState({ email: '', password: '' });
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const { data } = await login(form);
            setAuth(data.data.admin, data.data.accessToken, data.data.refreshToken);
            navigate('/');
        } catch (err) {
            toast.error(err.response?.data?.message || 'Login failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: '#f5f5f5' }}>
            <Paper elevation={3} sx={{ p: 4, width: 380 }}>
                <Typography variant="h5" fontWeight={700} mb={1}>Job Salon & Spa</Typography>
                <Typography variant="body2" color="text.secondary" mb={3}>Admin Panel</Typography>
                <form onSubmit={handleSubmit}>
                    <TextField
                        label="Email" type="email" fullWidth required
                        value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })}
                        sx={{ mb: 2 }}
                    />
                    <TextField
                        label="Password" type="password" fullWidth required
                        value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })}
                        sx={{ mb: 3 }}
                    />
                    <Button type="submit" variant="contained" fullWidth size="large" disabled={loading}>
                        {loading ? <CircularProgress size={22} color="inherit" /> : 'Sign In'}
                    </Button>
                </form>
            </Paper>
        </Box>
    );
}
