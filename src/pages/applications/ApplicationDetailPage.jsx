import { useParams, useNavigate } from 'react-router-dom';
import {
    Box, Typography, Card, CardContent, Chip, Button, Grid,
    CircularProgress, Divider, MenuItem, Select, FormControl, InputLabel,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { getApplication, updateApplicationStatus } from '../../api/services';

const Field = ({ label, value }) => (
    <Box sx={{ mb: 1.5 }}>
        <Typography variant="caption" color="text.secondary" display="block">{label}</Typography>
        <Typography variant="body2" fontWeight={500}>{value || '—'}</Typography>
    </Box>
);

export default function ApplicationDetailPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const qc = useQueryClient();

    const { data, isLoading } = useQuery({
        queryKey: ['application', id],
        queryFn: () => getApplication(id),
    });

    const app = data?.data?.data?.application;

    const statusMutation = useMutation({
        mutationFn: (status) => updateApplicationStatus(id, status),
        onSuccess: () => { toast.success('Status updated'); qc.invalidateQueries({ queryKey: ['application', id] }); },
    });

    if (isLoading) return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 8 }}><CircularProgress /></Box>;
    if (!app) return <Typography>Application not found.</Typography>;

    const backPath = app.type === 'candidate' ? '/applications/candidate' : '/applications/salon';

    return (
        <Box>
            <Button startIcon={<ArrowBackIcon />} onClick={() => navigate(backPath)} sx={{ mb: 2 }}>
                Back to {app.type === 'candidate' ? 'Candidate' : 'Salon'} Applications
            </Button>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                <Typography variant="h5" fontWeight={700}>Application Details</Typography>
                <Chip label={app.type} color={app.type === 'candidate' ? 'primary' : 'secondary'} />
            </Box>

            <Grid container spacing={2}>
                <Grid item xs={12} md={8}>
                    <Card elevation={0} variant="outlined" sx={{ borderRadius: 2 }}>
                        <CardContent>
                            {app.type === 'candidate' ? (
                                <>
                                    <Typography variant="subtitle1" fontWeight={600} mb={2}>Candidate Information</Typography>
                                    <Grid container spacing={1}>
                                        <Grid item xs={6}><Field label="Name" value={app.name} /></Grid>
                                        <Grid item xs={6}><Field label="Phone" value={app.phone} /></Grid>
                                        <Grid item xs={6}><Field label="WhatsApp" value={app.whatsapp} /></Grid>
                                        <Grid item xs={6}><Field label="Gender" value={app.gender} /></Grid>
                                        <Grid item xs={6}><Field label="Speciality" value={app.speciality} /></Grid>
                                        <Grid item xs={6}><Field label="Experience" value={app.experience} /></Grid>
                                        <Grid item xs={6}><Field label="Age" value={app.age} /></Grid>
                                        <Grid item xs={6}><Field label="Education" value={app.education} /></Grid>
                                        <Grid item xs={6}><Field label="Hometown" value={app.hometown} /></Grid>
                                        <Grid item xs={6}><Field label="State" value={app.state} /></Grid>
                                        <Grid item xs={6}><Field label="Current City" value={app.currentCity} /></Grid>
                                        <Grid item xs={6}><Field label="Preferred City" value={app.preferredCity} /></Grid>
                                        <Grid item xs={6}><Field label="Current Salary" value={app.currentSalary} /></Grid>
                                        <Grid item xs={6}><Field label="Expected Salary" value={app.expectedSalary} /></Grid>
                                        <Grid item xs={6}><Field label="Diploma" value={app.diploma} /></Grid>
                                        <Grid item xs={6}><Field label="Job Status" value={app.jobStatus} /></Grid>
                                        <Grid item xs={6}><Field label="Home Service" value={app.remark} /></Grid>
                                    </Grid>
                                    {app.photoPath && (
                                        <Box mt={2}>
                                            <Typography variant="caption" color="text.secondary">Photo</Typography>
                                            <Box mt={1}>
                                                <img
                                                    src={`${import.meta.env.VITE_API_URL.replace('/api/v1', '')}/uploads/photos/${app.photoPath}`}
                                                    alt="Candidate"
                                                    style={{ width: 120, height: 120, objectFit: 'cover', borderRadius: 8 }}
                                                />
                                            </Box>
                                        </Box>
                                    )}
                                </>
                            ) : (
                                <>
                                    <Typography variant="subtitle1" fontWeight={600} mb={2}>Salon Information</Typography>
                                    <Grid container spacing={1}>
                                        <Grid item xs={6}><Field label="Salon Name" value={app.salonName} /></Grid>
                                        <Grid item xs={6}><Field label="Phone" value={app.phoneNumber} /></Grid>
                                        <Grid item xs={6}><Field label="WhatsApp" value={app.whatsappNumber} /></Grid>
                                        <Grid item xs={6}><Field label="Address" value={app.salonAddress} /></Grid>
                                        <Grid item xs={6}><Field label="Location" value={app.salonLocation} /></Grid>
                                        <Grid item xs={6}><Field label="Speciality Required" value={app.speciality} /></Grid>
                                        <Grid item xs={6}><Field label="Salary Offered" value={app.salary} /></Grid>
                                        <Grid item xs={6}><Field label="Timings" value={app.inTime && app.outTime ? `${app.inTime} – ${app.outTime}` : null} /></Grid>
                                        <Grid item xs={6}><Field label="Diploma Required" value={app.diplomaRequired} /></Grid>
                                        <Grid item xs={6}><Field label="Accommodation" value={app.accommodation} /></Grid>
                                        <Grid item xs={6}><Field label="Food Included" value={app.food} /></Grid>
                                        <Grid item xs={12}><Field label="Query" value={app.anyQuery} /></Grid>
                                    </Grid>
                                </>
                            )}
                        </CardContent>
                    </Card>
                </Grid>

                <Grid item xs={12} md={4}>
                    <Card elevation={0} variant="outlined" sx={{ borderRadius: 2 }}>
                        <CardContent>
                            <Typography variant="subtitle1" fontWeight={600} mb={2}>Application Status</Typography>
                            <FormControl fullWidth size="small">
                                <InputLabel>Status</InputLabel>
                                <Select value={app.status} label="Status"
                                    onChange={(e) => statusMutation.mutate(e.target.value)}>
                                    <MenuItem value="pending">Pending</MenuItem>
                                    <MenuItem value="approved">Approved</MenuItem>
                                    <MenuItem value="rejected">Rejected</MenuItem>
                                </Select>
                            </FormControl>
                            <Divider sx={{ my: 2 }} />
                            <Field label="Submitted" value={new Date(app.createdAt).toLocaleString()} />
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </Box>
    );
}
