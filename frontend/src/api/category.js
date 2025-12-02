// src/api/category.js
import api from '../lib/axios';

// Get list (public)
export function getCategories(params = {}) {
    return api.get('/api/categories', { params });
}

// Detail (admin)
export function getCategory(id) {
    return api.get(`/api/categories/${id}`);
}

// Create
export function createCategory(payload) {
    return api.post('/api/categories', payload);
}

// Update
export function updateCategory(id, payload) {
    return api.put(`/api/categories/${id}`, payload);
}

// Delete
export function deleteCategory(id) {
    return api.delete(`/api/categories/${id}`);
}

// Upload icon file
export function uploadCategoryIcon(id, file) {
    const fd = new FormData();
    fd.append('icon', file);
    return api.post(`/api/admin/categories/${id}/icon-upload`, fd, {
        headers: { 'Content-Type': 'multipart/form-data' },
    });
}

// Set icon via URL
export function setCategoryIconUrl(id, url) {
    return api.post(`/api/admin/categories/${id}/icon-url`, { url });
}
