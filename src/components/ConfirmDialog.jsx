import { Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button, Box } from '@mui/material';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';

export default function ConfirmDialog({ open, title = 'Confirm', message, onConfirm, onClose, loading }) {
    return (
        <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
            <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <Box sx={{
                    width: 32, height: 32, borderRadius: '8px',
                    bgcolor: '#fee2e2', display: 'flex', alignItems: 'center', justifyContent: 'center',
                    flexShrink: 0,
                }}>
                    <WarningAmberIcon sx={{ fontSize: 18, color: '#dc2626' }} />
                </Box>
                {title}
            </DialogTitle>
            <DialogContent>
                <DialogContentText sx={{ fontSize: 14, color: '#6b7280' }}>{message}</DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} disabled={loading} variant="outlined" color="inherit"
                    sx={{ color: '#374151', borderColor: '#e5e7eb', '&:hover': { borderColor: '#d1d5db', bgcolor: '#f9fafb' } }}>
                    Cancel
                </Button>
                <Button onClick={onConfirm} color="error" variant="contained" disabled={loading}
                    sx={{ minWidth: 80 }}>
                    {loading ? 'Deleting...' : 'Delete'}
                </Button>
            </DialogActions>
        </Dialog>
    );
}
