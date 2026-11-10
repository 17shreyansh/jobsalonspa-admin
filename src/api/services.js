import api from './client';

// Auth
export const login = (data) => api.post('/auth/login', data);
export const refreshToken = (data) => api.post('/auth/refresh', data);
export const getMe = () => api.get('/auth/me');

// Dashboard
export const getDashboardStats = () => api.get('/dashboard/stats');

// Categories
export const getCategories = (params) => api.get('/categories', { params });
export const getActiveCategories = () => api.get('/categories/active');
export const createCategory = (data) => api.post('/categories', data);
export const updateCategory = (id, data) => api.put(`/categories/${id}`, data);
export const toggleCategoryStatus = (id) => api.patch(`/categories/${id}/status`);
export const deleteCategory = (id) => api.delete(`/categories/${id}`);

// Jobs
export const getJobs = (params) => api.get('/jobs', { params });
export const getJob = (id) => api.get(`/jobs/${id}`);
export const createJob = (data) => api.post('/jobs', data);
export const updateJob = (id, data) => api.put(`/jobs/${id}`, data);
export const toggleJobStatus = (id) => api.patch(`/jobs/${id}/status`);
export const deleteJob = (id) => api.delete(`/jobs/${id}`);

// Applications
export const getApplications = (params) => api.get('/applications', { params });
export const getApplication = (id) => api.get(`/applications/${id}`);
export const updateApplicationStatus = (id, status) =>
    api.patch(`/applications/${id}/status`, { status });
export const deleteApplication = (id) => api.delete(`/applications/${id}`);

// Contacts
export const getContactOwners = (params) => api.get('/contacts/owners', { params });
export const getOwnerContacts = (ownerId, params) =>
    api.get(`/contacts/owners/${ownerId}/contacts`, { params });
export const deleteContactOwner = (id) => api.delete(`/contacts/owners/${id}`);
export const deleteContact = (id) => api.delete(`/contacts/${id}`);
