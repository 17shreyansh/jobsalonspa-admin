import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import {
    Box, Drawer, List, ListItemButton, ListItemIcon, ListItemText,
    Typography, Avatar, Divider, Tooltip, IconButton,
} from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import WorkIcon from '@mui/icons-material/Work';
import CategoryIcon from '@mui/icons-material/Category';
import PeopleIcon from '@mui/icons-material/People';
import StoreIcon from '@mui/icons-material/Store';
import ContactsIcon from '@mui/icons-material/Contacts';
import LogoutIcon from '@mui/icons-material/Logout';
import useAuthStore from '../store/authStore';

const W = 236;

const NAV = [
    { label: 'Dashboard', icon: DashboardIcon, path: '/' },
    { label: 'Jobs', icon: WorkIcon, path: '/jobs' },
    { label: 'Categories', icon: CategoryIcon, path: '/categories' },
    { label: 'Candidates', icon: PeopleIcon, path: '/applications/candidate' },
    { label: 'Salons', icon: StoreIcon, path: '/applications/salon' },
    { label: 'Contacts', icon: ContactsIcon, path: '/contacts' },
];

export default function Layout() {
    const navigate = useNavigate();
    const location = useLocation();
    const { admin, logout } = useAuthStore();

    const handleLogout = () => { logout(); navigate('/login'); };

    const isActive = (path) => {
        if (path === '/') return location.pathname === '/';
        return location.pathname.startsWith(path);
    };

    const currentPage = NAV.find(n => isActive(n.path))?.label || 'Dashboard';

    return (
        <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: '#f4f6f9' }}>
            <Drawer
                variant="permanent"
                sx={{
                    width: W,
                    flexShrink: 0,
                    '& .MuiDrawer-paper': {
                        width: W,
                        boxSizing: 'border-box',
                        bgcolor: '#0f172a',
                        border: 'none',
                        display: 'flex',
                        flexDirection: 'column',
                    },
                }}
            >
                {/* Brand */}
                <Box sx={{ px: 2.5, pt: 2.5, pb: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                        <Box sx={{
                            width: 34, height: 34, borderRadius: '8px',
                            bgcolor: '#2563eb',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            flexShrink: 0,
                        }}>
                            <Typography sx={{ color: '#fff', fontWeight: 800, fontSize: 16, lineHeight: 1 }}>J</Typography>
                        </Box>
                        <Box>
                            <Typography sx={{ color: '#f1f5f9', fontWeight: 700, fontSize: 13, lineHeight: 1.3 }}>
                                Job Salon & Spa
                            </Typography>
                            <Typography sx={{ color: '#64748b', fontSize: 11, lineHeight: 1.4 }}>
                                Admin Portal
                            </Typography>
                        </Box>
                    </Box>
                </Box>

                <Divider sx={{ borderColor: '#1e293b' }} />

                {/* Nav */}
                <List sx={{ px: 1.5, pt: 1.5, flexGrow: 1 }}>
                    {NAV.map(({ label, icon: Icon, path }) => {
                        const active = isActive(path);
                        return (
                            <ListItemButton
                                key={path}
                                onClick={() => navigate(path)}
                                sx={{
                                    borderRadius: '6px',
                                    mb: 0.5,
                                    px: 1.5,
                                    py: 0.9,
                                    bgcolor: active ? '#1e3a5f' : 'transparent',
                                    '&:hover': { bgcolor: active ? '#1e3a5f' : '#1e293b' },
                                    transition: 'background 0.12s',
                                    position: 'relative',
                                }}
                            >
                                {active && (
                                    <Box sx={{
                                        position: 'absolute', left: 0, top: '50%',
                                        transform: 'translateY(-50%)',
                                        width: 3, height: 20, borderRadius: '0 3px 3px 0',
                                        bgcolor: '#2563eb',
                                    }} />
                                )}
                                <ListItemIcon sx={{ minWidth: 32, color: active ? '#60a5fa' : '#94a3b8' }}>
                                    <Icon sx={{ fontSize: 17 }} />
                                </ListItemIcon>
                                <ListItemText
                                    primary={label}
                                    sx={{
                                        '& .MuiListItemText-primary': {
                                            fontSize: 13.5,
                                            fontWeight: active ? 600 : 400,
                                            color: active ? '#60a5fa' : '#fff',
                                        }
                                    }}
                                />
                            </ListItemButton>
                        );
                    })}
                </List>

                {/* User */}
                <Divider sx={{ borderColor: '#1e293b' }} />
                <Box sx={{ px: 2, py: 1.75, display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    <Avatar sx={{ width: 30, height: 30, bgcolor: '#1e3a5f', fontSize: 12, fontWeight: 700, color: '#60a5fa' }}>
                        {admin?.name?.[0]?.toUpperCase() || 'A'}
                    </Avatar>
                    <Box sx={{ flexGrow: 1, minWidth: 0 }}>
                        <Typography sx={{ color: '#f1f5f9', fontSize: 13, fontWeight: 600, lineHeight: 1.3 }} noWrap>
                            {admin?.name || 'Admin'}
                        </Typography>
                        <Typography sx={{ color: '#64748b', fontSize: 11, lineHeight: 1.4 }} noWrap>
                            {admin?.role || 'Administrator'}
                        </Typography>
                    </Box>
                    <Tooltip title="Sign out">
                        <IconButton size="small" onClick={handleLogout}
                            sx={{ color: '#475569', '&:hover': { color: '#f1f5f9', bgcolor: '#1e293b' } }}>
                            <LogoutIcon sx={{ fontSize: 15 }} />
                        </IconButton>
                    </Tooltip>
                </Box>
            </Drawer>

            {/* Main content */}
            <Box component="main" sx={{ flexGrow: 1, minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
                {/* Topbar */}
                <Box sx={{
                    height: 56, px: 3,
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    bgcolor: '#fff',
                    borderBottom: '1px solid #e2e8f0',
                    position: 'sticky', top: 0, zIndex: 10,
                }}>
                    <Typography sx={{ fontSize: 15, fontWeight: 700, color: '#0f172a' }}>
                        {currentPage}
                    </Typography>
                    <Typography sx={{ fontSize: 12, color: '#94a3b8' }}>
                        {admin?.email || ''}
                    </Typography>
                </Box>

                <Box sx={{ flexGrow: 1, p: 3 }}>
                    <Outlet />
                </Box>
            </Box>
        </Box>
    );
}
