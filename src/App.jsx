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
        primary: { main: '#111827', light: '#374151', contrastText: '#fff' },
        secondary: { main: '#dc2626', contrastText: '#fff' },
        background: { default: '#f9fafb', paper: '#ffffff' },
        text: { primary: '#111827', secondary: '#6b7280' },
        divider: '#e5e7eb',
        success: { main: '#16a34a', light: '#dcfce7', contrastText: '#fff' },
        error: { main: '#dc2626', light: '#fee2e2', contrastText: '#fff' },
        warning: { main: '#d97706', light: '#fef3c7', contrastText: '#fff' },
        info: { main: '#2563eb', light: '#dbeafe', contrastText: '#fff' },
    },
    typography: {
        fontFamily: "'Inter', 'Segoe UI', system-ui, sans-serif",
        h4: { fontWeight: 700, letterSpacing: '-0.5px' },
        h5: { fontWeight: 700, letterSpacing: '-0.3px' },
        h6: { fontWeight: 600 },
        subtitle1: { fontWeight: 600 },
        subtitle2: { fontWeight: 600, color: '#6b7280' },
        body2: { fontSize: '0.875rem' },
        caption: { fontSize: '0.75rem', color: '#9ca3af' },
    },
    shape: { borderRadius: 10 },
    shadows: [
        'none',
        '0 1px 2px rgba(0,0,0,0.05)',
        '0 1px 3px rgba(0,0,0,0.08), 0 1px 2px rgba(0,0,0,0.04)',
        '0 4px 6px -1px rgba(0,0,0,0.07), 0 2px 4px -1px rgba(0,0,0,0.04)',
        '0 10px 15px -3px rgba(0,0,0,0.07), 0 4px 6px -2px rgba(0,0,0,0.04)',
        ...Array(20).fill('none'),
    ],
    components: {
        MuiButton: {
            styleOverrides: {
                root: { textTransform: 'none', fontWeight: 600, borderRadius: 8, letterSpacing: 0 },
                containedPrimary: { backgroundColor: '#111827', '&:hover': { backgroundColor: '#1f2937' } },
                sizeMedium: { padding: '7px 16px' },
            },
        },
        MuiCard: {
            styleOverrides: {
                root: { borderRadius: 12, boxShadow: '0 1px 3px rgba(0,0,0,0.08), 0 1px 2px rgba(0,0,0,0.04)' },
            },
        },
        MuiPaper: {
            styleOverrides: {
                outlined: { borderColor: '#e5e7eb' },
            },
        },
        MuiTableCell: {
            styleOverrides: {
                root: { borderColor: '#f3f4f6', padding: '10px 16px' },
                head: { fontWeight: 600, fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: '#6b7280', backgroundColor: '#f9fafb' },
            },
        },
        MuiTableRow: {
            styleOverrides: {
                root: { '&:last-child td': { borderBottom: 0 } },
            },
        },
        MuiChip: {
            styleOverrides: {
                root: { fontWeight: 600, fontSize: '0.72rem', borderRadius: 6 },
            },
        },
        MuiTextField: {
            defaultProps: { size: 'small' },
            styleOverrides: {
                root: {
                    '& .MuiOutlinedInput-root': {
                        borderRadius: 8,
                        '& fieldset': { borderColor: '#e5e7eb' },
                        '&:hover fieldset': { borderColor: '#d1d5db' },
                    },
                },
            },
        },
        MuiSelect: {
            styleOverrides: {
                outlined: { borderRadius: 8 },
            },
        },
        MuiDialog: {
            styleOverrides: {
                paper: { borderRadius: 14, boxShadow: '0 20px 60px rgba(0,0,0,0.15)' },
            },
        },
        MuiDialogTitle: {
            styleOverrides: {
                root: { fontWeight: 700, fontSize: '1rem', padding: '20px 24px 12px' },
            },
        },
        MuiDialogContent: {
            styleOverrides: {
                root: { padding: '8px 24px 16px' },
            },
        },
        MuiDialogActions: {
            styleOverrides: {
                root: { padding: '12px 24px 20px', gap: 8 },
            },
        },
        MuiSwitch: {
            styleOverrides: {
                root: { padding: 6 },
                thumb: { width: 14, height: 14 },
                track: { borderRadius: 10 },
            },
        },
        MuiIconButton: {
            styleOverrides: {
                root: { borderRadius: 8 },
                sizeSmall: { padding: 6 },
            },
        },
        MuiListItemButton: {
            styleOverrides: {
                root: { borderRadius: 8 },
            },
        },
        MuiTooltip: {
            styleOverrides: {
                tooltip: { fontSize: '0.75rem', borderRadius: 6 },
            },
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
                        style: { borderRadius: 10, fontSize: 14, fontWeight: 500 },
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
