import { useState } from 'react';
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

const W = 232;

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

    return (
        <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: '#f9fafb' }}>
            <Drawer
                variant="permanent"
                sx={{
                    width: W,
                    flexShrink: 0,
                    '& .MuiDrawer-paper': {
                        width: W,
                        boxSizing: 'border-box',
                        bgcolor: '#111827',
                        border: 'none',
                        display: 'flex',
                        flexDirection: 'column',
                    },
                }}
            >
                {/* Logo */}
                <Box sx={{ px: 3, pt: 3, pb: 2.5 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                        <Box sx={{
                            width: 32, height: 32, borderRadius: '8px',
                            bgcolor: '#dc2626',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            flexShrink: 0,
                        }}>
                            <Typography sx={{ color: '#fff', fontWeight: 800, fontSize: 16, lineHeight: 1 }}>J</Typography>
                        </Box>
                        <Box>
                            <Typography sx={{ color: '#fff', fontWeight: 700, fontSize: 13, lineHeight: 1.2 }}>
                                Job Salon & Spa
                            </Typography>
                            <Typography sx={{ color: '#6b7280', fontSize: 11, lineHeight: 1.4 }}>
                                Admin Portal
                            </Typography>
                        </Box>
                    </Box>
                </Box>

                <Divider sx={{ borderColor: '#1f2937', mx: 2 }} />

                {/* Nav */}
                <List sx={{ px: 1.5, pt: 1.5, flexGrow: 1 }}>
                    {NAV.map(({ label, icon: Icon, path }) => {
                        const active = isActive(path);
                        return (
                            <ListItemButton
                                key={path}
                                onClick={() => navigate(path)}
                                sx={{
                                    borderRadius: '8px',
                                    mb: 0.5,
                                    px: 1.5,
                                    py: 1,
                                    bgcolor: active ? '#1f2937' : 'transparent',
                                    '&:hover': { bgcolor: active ? '#1f2937' : '#1a2332' },
                                    position: 'relative',
                                }}
                            >
                                {active && (
                                    <Box sx={{
                                        position: 'absolute', left: 0, top: '50%',
                                        transform: 'translateY(-50%)',
                                        width: 3, height: 18, borderRadius: '0 2px 2px 0',
                                        bgcolor: '#dc2626',
                                    }} />
                                )}
                                <ListItemIcon sx={{ minWidth: 34, color: active ? '#fff' : '#9ca3af' }}>
                                    <Icon sx={{ fontSize: 18 }} />
                                </ListItemIcon>
                                <ListItemText
                                    primary={label}
                                    primaryTypographyProps={{
                                        fontSize: 13.5,
                                        fontWeight: active ? 600 : 400,
                                        color: active ? '#fff' : '#9ca3af',
                                    }}
                                />
                            </ListItemButton>
                        );
                    })}
                </List>

                {/* User */}
                <Divider sx={{ borderColor: '#1f2937', mx: 2 }} />
                <Box sx={{ px: 2, py: 2, display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    <Avatar sx={{ width: 32, height: 32, bgcolor: '#374151', fontSize: 13, fontWeight: 700 }}>
                        {admin?.name?.[0]?.toUpperCase() || 'A'}
                    </Avatar>
                    <Box sx={{ flexGrow: 1, minWidth: 0 }}>
                        <Typography sx={{ color: '#e5e7eb', fontSize: 13, fontWeight: 600, lineHeight: 1.3 }} noWrap>
                            {admin?.name || 'Admin'}
                        </Typography>
                        <Typography sx={{ color: '#6b7280', fontSize: 11, lineHeight: 1.4 }} noWrap>
                            {admin?.role || 'Administrator'}
                        </Typography>
                    </Box>
                    <Tooltip title="Sign out">
                        <IconButton size="small" onClick={handleLogout} sx={{ color: '#6b7280', '&:hover': { color: '#e5e7eb', bgcolor: '#1f2937' } }}>
                            <LogoutIcon sx={{ fontSize: 16 }} />
                        </IconButton>
                    </Tooltip>
                </Box>
            </Drawer>

            {/* Main */}
            <Box component="main" sx={{ flexGrow: 1, minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
                {/* Top bar */}
                <Box sx={{
                    height: 56, px: 3,
                    display: 'flex', alignItems: 'center',
                    bgcolor: '#fff',
                    borderBottom: '1px solid #e5e7eb',
                    position: 'sticky', top: 0, zIndex: 10,
                }}>
                    <Typography sx={{ fontSize: 13, color: '#9ca3af' }}>
                        {NAV.find(n => isActive(n.path))?.label || 'Dashboard'}
                    </Typography>
                </Box>

                <Box sx={{ flexGrow: 1, p: 3 }}>
                    <Outlet />
                </Box>
            </Box>
        </Box>
    );
}
