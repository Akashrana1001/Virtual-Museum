import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || '/api';

const api = axios.create({
    baseURL: API_URL,
    headers: { 'Content-Type': 'application/json' },
});

// Add auth token to requests
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Auth
export const authAPI = {
    register: (data) => api.post('/auth/register', data),
    login: (data) => api.post('/auth/login', data),
    getMe: () => api.get('/auth/me'),
};

// Artworks
export const artworkAPI = {
    getAll: (params) => api.get('/artworks', { params }),
    getById: (id) => api.get(`/artworks/${id}`),
    getByRoom: (room) => api.get(`/artworks/room/${room}`),
    create: (data) => api.post('/artworks', data),
    update: (id, data) => api.put(`/artworks/${id}`, data),
    delete: (id) => api.delete(`/artworks/${id}`),
    approve: (id, status) => api.patch(`/artworks/${id}/approve`, { status }),
    rate: (id, value) => api.post(`/artworks/${id}/rate`, { value }),
    getPending: () => api.get('/artworks/pending'),
};

// Comments
export const commentAPI = {
    getByArtwork: (artworkId) => api.get(`/comments/${artworkId}`),
    create: (artworkId, text) => api.post(`/comments/${artworkId}`, { text }),
    delete: (id) => api.delete(`/comments/${id}`),
};

// Users
export const userAPI = {
    getProfile: (id) => api.get(`/users/profile/${id}`),
    updateProfile: (data) => api.put('/users/profile', data),
    getArtists: () => api.get('/users/artists'),
    follow: (id) => api.post(`/users/follow/${id}`),
    toggleFavorite: (artworkId) => api.post(`/users/favorite/${artworkId}`),
};

// Events
export const eventAPI = {
    getAll: (params) => api.get('/events', { params }),
    getById: (id) => api.get(`/events/${id}`),
    create: (data) => api.post('/events', data),
    update: (id, data) => api.put(`/events/${id}`, data),
    delete: (id) => api.delete(`/events/${id}`),
    rsvp: (id) => api.post(`/events/${id}/rsvp`),
};

// Upload
export const uploadAPI = {
    uploadImage: (formData) => api.post('/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
    }),
};

export default api;
