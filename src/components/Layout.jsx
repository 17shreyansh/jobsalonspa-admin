import { useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import {
    Box, Drawer, List, ListItemButton, ListItemIcon, ListItemText,
    AppBar, Toolbar, Typography, IconButton, Avatar, Divider, Tooltip,
} from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import WorkIcon from '@mui/icons-material/Work';
import CategoryIcon from '@mui/icons-material/Category';
import PeopleIcon from '@mui/icons-material/People';
import StoreIcon from '@mui/icons-material/Store';
import ContactsIcon from '@mui/icons-material/Contacts';
import LogoutIcon from '@mui/icons-material/Logout';
import useAuthStore from '../store/authStore';

const DRAWER_WIDTH = 240;

const NAV = [
    { label: 'Dashboard', icon: <DashboardIcon />, path: '/' },
    { label: 'Jobs', icon: <WorkIcon />, path: '/jobs' },
    { label: 'Categories', icon: <CategoryIcon />, path: '/categories' },
    { label: 'Candidate Applications', icon: <PeopleIcon />, path: '/applications/candidate' },
    { label: 'Salon Applications', icon: <StoreIcon />, path: '/applications/salon' },
    { label: 'Contacts', icon: <ContactsIcon />, path: '/contacts' },
];

export default function Layout() {
    const navigate = useNavigate();
    const location = useLocation();
    const { admin, logout } = useAuthStore();

    const handleLogout = () => { logout(); navigate('/login'); };

    return (
        <Box sx={{ display: 'flex' }}>
            <AppBar position="fixed" sx={{ zIndex: (t) => t.zIndex.drawer + 1, bgcolor: '#1a1a2e' }}>
                <Toolbar>
                    <Typography variant="h6" fontWeight={700} sx={{ flexGrow: 1 }}>
                        Job Salon & Spa
                    </Typography>
                    <Typography variant="body2" sx={{ mr: 2, color: 'rgba(255,255,255,0.7)' }}>
                        {admin?.name}
                    </Typography>
                    <Tooltip title="Logout">
                        <IconButton color="inherit" onClick={handleLogout}>
                            <LogoutIcon />
                        </IconButton>
                    </Tooltip>
                </Toolbar>
            </AppBar>

            <Drawer
                variant="permanent"
                sx={{
                    width: DRAWER_WIDTH,
                    '& .MuiDrawer-paper': { width: DRAWER_WIDTH, boxSizing: 'border-box', bgcolor: '#16213e', color: '#fff' },
                }}
            >
                <Toolbar />
                <Box sx={{ p: 2, display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    <Avatar sx={{ bgcolor: '#e94560', width: 36, height: 36 }}>
                        {admin?.name?.[0] || 'A'}
                    </Avatar>
                    <Box>
                        <Typography variant="body2" fontWeight={600}>{admin?.name}</Typography>
                        <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.5)' }}>{admin?.role}</Typography>
                    </Box>
                </Box>
                <Divider sx={{ borderColor: 'rgba(255,255,255,0.1)' }} />
                <List sx={{ pt: 1 }}>
                    {NAV.map(({ label, icon, path }) => (
                        <ListItemButton
                            key={path}
                            selected={location.pathname === path}
                            onClick={() => navigate(path)}
                            sx={{
                                mx: 1, borderRadius: 1, mb: 0.5,
                                '&.Mui-selected': { bgcolor: '#e94560', '&:hover': { bgcolor: '#c73652' } },
                                '&:hover': { bgcolor: 'rgba(255,255,255,0.08)' },
                                color: '#fff',
                            }}
                        >
                            <ListItemIcon sx={{ color: 'inherit', minWidth: 36 }}>{icon}</ListItemIcon>
                            <ListItemText primary={label} primaryTypographyProps={{ fontSize: 14 }} />
                        </ListItemButton>
                    ))}
                </List>
            </Drawer>

            <Box component="main" sx={{ flexGrow: 1, p: 3, bgcolor: '#f8f9fa', minHeight: '100vh' }}>
                <Toolbar />
                <Outlet />
            </Box>
        </Box>
    );
}
