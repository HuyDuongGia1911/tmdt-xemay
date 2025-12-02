// src/api/brand.js
import api from '../lib/axios';

// Lấy toàn bộ brand (public)
export function getBrands() {
    return api.get('/api/brands');
}

// Lấy chi tiết 1 brand (admin only)
export function getBrand(id) {
    return api.get(`/api/admin/brands/${id}`);
}

// Tạo brand (admin)
export function createBrand(payload) {
    return api.post('/api/admin/brands', payload);
}

// Cập nhật brand (admin)
export function updateBrand(id, payload) {
    return api.put(`/api/admin/brands/${id}`, payload);
}

// Xóa brand (admin)
export function deleteBrand(id) {
    return api.delete(`/api/admin/brands/${id}`);
}

// Upload logo bằng file
export function uploadBrandLogo(id, file) {
    const formData = new FormData();
    formData.append('logo', file);

    return api.post(`/api/admin/brands/${id}/logo-upload`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
    });
}

// Set logo bằng URL
export function setBrandLogoUrl(id, url) {
    return api.post(`/api/admin/brands/${id}/logo-url`, { url });
}
