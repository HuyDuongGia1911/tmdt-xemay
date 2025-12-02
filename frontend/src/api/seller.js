// src/api/seller.js
import api from '../lib/axios';

export function getSellerProfile() {
    return api.get('/api/seller/profile');
}

export function updateSellerProfile(payload) {
    return api.put('/api/seller/profile', payload);
}
// Upload file logo
export function uploadSellerLogo(file) {
    const fd = new FormData();
    fd.append('logo', file);
    return api.post('/api/seller/profile/logo-upload', fd, {
        headers: { 'Content-Type': 'multipart/form-data' }
    });
}

// Đặt logo bằng URL
export function setSellerLogoUrl(url) {
    return api.post('/api/seller/profile/logo-url', { url });
}

// Xóa logo
export function deleteSellerLogo() {
    return api.delete('/api/seller/profile/logo');
}