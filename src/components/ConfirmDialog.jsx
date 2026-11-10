import { Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button, Box } from '@mui/material';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';

export default function ConfirmDialog({ open, title = 'Confirm', message, onConfirm, onClose, loading }) {
    return (
        <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
            <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <Box sx={{
                    width: 32, height: 32, borderRadius: '7px',
                    bgcolor: '#fee2e2', display: 'flex', alignItems: 'center', justifyContent: 'center',
                    flexShrink: 0,
                }}>
                    <WarningAmberIcon sx={{ fontSize: 17, color: '#dc2626' }} />
                </Box>
                {title}
            </DialogTitle>
            <DialogContent>
                <DialogContentText sx={{ fontSize: 13.5, color: '#475569' }}>{message}</DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} disabled={loading} variant="outlined" color="inherit"
                    sx={{ color: '#374151', borderColor: '#e2e8f0', '&:hover': { borderColor: '#94a3b8', bgcolor: '#f8fafc' } }}>
                    Cancel
                </Button>
                <Button onClick={onConfirm} color="error" variant="contained" disabled={loading}
                    sx={{ minWidth: 80, bgcolor: '#dc2626', '&:hover': { bgcolor: '#b91c1c' } }}>
                    {loading ? 'Deleting...' : 'Delete'}
                </Button>
            </DialogActions>
        </Dialog>
    );
}
