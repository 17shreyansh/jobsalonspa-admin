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
    palette: { primary: { main: '#1a1a2e' }, secondary: { main: '#e94560' } },
    typography: { fontFamily: '"Inter", "Roboto", sans-serif' },
    components: {
        MuiButton: { styleOverrides: { root: { textTransform: 'none', borderRadius: 8 } } },
        MuiCard: { styleOverrides: { root: { borderRadius: 12 } } },
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
                <Toaster position="top-right" />
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
