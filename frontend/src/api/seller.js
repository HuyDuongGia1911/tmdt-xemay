// src/api/seller.js
import api from '../lib/axios';

export function getSellerProfile() {
    return api.get('/api/seller/profile');
}

export function updateSellerProfile(payload) {
    return api.put('/api/seller/profile', payload);
}
