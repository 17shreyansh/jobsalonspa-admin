import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';
import { createTheme, ThemeProvider, CssBaseline } from '@mui/material';
import useAuthStore from './store/authStore';
import Layout from './components/Layout';
import LoginPage from './pages/auth/LoginPage';
import DashboardPage from './pages/dashboard/DashboardPage';
import CategoriesPage from './pages/categories/CategoriesPage';
import JobsPage from './pages/jobs/JobsPage';
import ApplicationsPage from './pages/applications/ApplicationsPage';
import ApplicationDetailPage from './pages/applications/ApplicationDetailPage';
import ContactsPage from './pages/contacts/ContactsPage';
import ContactListPage from './pages/contacts/ContactListPage';

const qc = new QueryClient({ defaultOptions: { queries: { retry: 1, staleTime: 30000 } } });

const theme = createTheme({
    palette: {
        mode: 'light',
        primary: { main: '#2563eb', light: '#3b82f6', dark: '#1d4ed8', contrastText: '#fff' },
        secondary: { main: '#0f172a', contrastText: '#fff' },
        background: { default: '#f4f6f9', paper: '#ffffff' },
        text: { primary: '#0f172a', secondary: '#475569' },
        divider: '#e2e8f0',
        success: { main: '#16a34a', light: '#dcfce7', contrastText: '#fff' },
        error: { main: '#dc2626', light: '#fee2e2', contrastText: '#fff' },
        warning: { main: '#d97706', light: '#fef3c7', contrastText: '#fff' },
        info: { main: '#0284c7', light: '#e0f2fe', contrastText: '#fff' },
    },
    typography: {
        fontFamily: "'Inter', 'Segoe UI', system-ui, sans-serif",
        h5: { fontWeight: 700, fontSize: '1.2rem', letterSpacing: '-0.2px' },
        h6: { fontWeight: 600 },
        body2: { fontSize: '0.875rem' },
        caption: { fontSize: '0.75rem' },
    },
    shape: { borderRadius: 8 },
    shadows: [
        'none',
        '0 1px 3px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04)',
        '0 2px 6px rgba(0,0,0,0.07), 0 1px 3px rgba(0,0,0,0.04)',
        '0 4px 12px rgba(0,0,0,0.08)',
        '0 8px 24px rgba(0,0,0,0.1)',
        ...Array(20).fill('none'),
    ],
    components: {
        MuiCssBaseline: {
            styleOverrides: {
                body: {
                    backgroundColor: '#f4f6f9',
                    color: '#0f172a',
                    fontSize: 14,
                    lineHeight: 1.5,
                },
            },
        },
        MuiButton: {
            styleOverrides: {
                root: { textTransform: 'none', fontWeight: 600, borderRadius: 7, letterSpacing: 0, fontSize: 13.5 },
                containedPrimary: {
                    backgroundColor: '#2563eb',
                    '&:hover': { backgroundColor: '#1d4ed8', boxShadow: '0 2px 8px rgba(37,99,235,0.3)' },
                },
                sizeMedium: { padding: '7px 16px' },
                sizeLarge: { padding: '10px 20px' },
            },
        },
        MuiPaper: {
            styleOverrides: {
                outlined: { borderColor: '#e2e8f0' },
                root: { backgroundImage: 'none' },
            },
        },
        MuiTableCell: {
            styleOverrides: {
                root: {
                    borderColor: '#f1f5f9',
                    padding: '12px 16px',
                    color: '#0f172a',
                    fontSize: '0.8475rem',
                },
                head: {
                    fontWeight: 600,
                    fontSize: '0.72rem',
                    textTransform: 'uppercase',
                    letterSpacing: '0.06em',
                    color: '#64748b',
                    backgroundColor: '#f8fafc',
                    borderBottom: '1px solid #e2e8f0',
                },
                body: {
                    color: '#0f172a',
                },
            },
        },
        MuiTableRow: {
            styleOverrides: {
                root: { '&:last-child td': { borderBottom: 0 } },
            },
        },
        MuiChip: {
            styleOverrides: {
                root: { fontWeight: 600, fontSize: '0.72rem', borderRadius: 5, height: 22 },
            },
        },
        MuiTextField: {
            defaultProps: { size: 'small' },
            styleOverrides: {
                root: {
                    '& .MuiOutlinedInput-root': {
                        borderRadius: 7,
                        backgroundColor: '#fff',
                        fontSize: 13.5,
                        color: '#0f172a',
                        '& input': { color: '#0f172a' },
                        '& textarea': { color: '#0f172a' },
                        '& fieldset': { borderColor: '#cbd5e1' },
                        '&:hover fieldset': { borderColor: '#94a3b8' },
                        '&.Mui-focused fieldset': { borderColor: '#2563eb', borderWidth: 1.5 },
                    },
                    '& .MuiInputBase-input': { color: '#0f172a' },
                    '& .MuiInputBase-input::placeholder': { color: '#94a3b8', opacity: 1 },
                },
            },
        },
        MuiOutlinedInput: {
            styleOverrides: {
                root: {
                    color: '#0f172a',
                    backgroundColor: '#fff',
                    borderRadius: 7,
                    '& input': { color: '#0f172a' },
                    '& textarea': { color: '#0f172a' },
                    '& fieldset': { borderColor: '#cbd5e1' },
                    '&:hover fieldset': { borderColor: '#94a3b8' },
                    '&.Mui-focused fieldset': { borderColor: '#2563eb', borderWidth: 1.5 },
                },
            },
        },
        MuiSelect: {
            styleOverrides: {
                outlined: { borderRadius: 7, fontSize: 13.5, color: '#0f172a' },
                icon: { color: '#64748b' },
            },
        },
        MuiMenuItem: {
            styleOverrides: {
                root: { fontSize: 13.5, color: '#0f172a' },
            },
        },
        MuiDialog: {
            styleOverrides: {
                paper: { borderRadius: 12, boxShadow: '0 20px 60px rgba(0,0,0,0.15)', border: '1px solid #e2e8f0' },
            },
        },
        MuiDialogTitle: {
            styleOverrides: {
                root: { fontWeight: 700, fontSize: '0.95rem', padding: '20px 24px 12px', color: '#0f172a' },
            },
        },
        MuiDialogContent: {
            styleOverrides: { root: { padding: '8px 24px 16px' } },
        },
        MuiDialogActions: {
            styleOverrides: { root: { padding: '12px 24px 20px', gap: 8 } },
        },
        MuiSwitch: {
            styleOverrides: {
                root: { padding: 6 },
                thumb: { width: 14, height: 14 },
                track: { borderRadius: 10 },
                switchBase: {
                    '&.Mui-checked': { color: '#2563eb' },
                    '&.Mui-checked + .MuiSwitch-track': { backgroundColor: '#2563eb' },
                },
            },
        },
        MuiIconButton: {
            styleOverrides: {
                root: { borderRadius: 7 },
                sizeSmall: { padding: 5 },
            },
        },
        MuiListItemButton: {
            styleOverrides: { root: { borderRadius: 6 } },
        },
        MuiTooltip: {
            styleOverrides: {
                tooltip: { fontSize: '0.72rem', borderRadius: 5, backgroundColor: '#1e293b', padding: '5px 10px' },
            },
        },
        MuiDivider: {
            styleOverrides: { root: { borderColor: '#e2e8f0' } },
        },
    },
});

const Guard = ({ children }) => {
    const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
    return isAuthenticated ? children : <Navigate to="/login" replace />;
};

export default function App() {
    return (
        <QueryClientProvider client={qc}>
            <ThemeProvider theme={theme}>
                <CssBaseline />
                <Toaster
                    position="top-right"
                    toastOptions={{
                        style: { borderRadius: 8, fontSize: 13.5, fontWeight: 500, color: '#0f172a', border: '1px solid #e2e8f0' },
                        success: { iconTheme: { primary: '#16a34a', secondary: '#fff' } },
                        error: { iconTheme: { primary: '#dc2626', secondary: '#fff' } },
                    }}
                />
                <BrowserRouter>
                    <Routes>
                        <Route path="/login" element={<LoginPage />} />
                        <Route path="/" element={<Guard><Layout /></Guard>}>
                            <Route index element={<DashboardPage />} />
                            <Route path="categories" element={<CategoriesPage />} />
                            <Route path="jobs" element={<JobsPage />} />
                            <Route path="applications/candidate" element={<ApplicationsPage type="candidate" />} />
                            <Route path="applications/salon" element={<ApplicationsPage type="salon" />} />
                            <Route path="applications/:id" element={<ApplicationDetailPage />} />
                            <Route path="contacts" element={<ContactsPage />} />
                            <Route path="contacts/:ownerId" element={<ContactListPage />} />
                        </Route>
                        <Route path="*" element={<Navigate to="/" replace />} />
                    </Routes>
                </BrowserRouter>
            </ThemeProvider>
        </QueryClientProvider>
    );
}
