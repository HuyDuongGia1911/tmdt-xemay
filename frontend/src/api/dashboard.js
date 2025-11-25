import http from './http'; // axios instance có baseURL + interceptor Bearer từ localStorage

// SELLER
export const getSellerOverview = (range = '30d') =>
    http.get('/dashboard/seller/overview', { params: { range } });

export const getSellerOrders = (params = {}) =>
    http.get('/dashboard/seller/orders', { params });

export const getSellerMotorcycles = (params = {}) =>
    http.get('/dashboard/seller/motorcycles', { params });

export const patchSellerMotorcycle = (id, payload) =>
    http.patch(`/dashboard/seller/motorcycles/${id}`, payload);
// SELLER IMAGES 
// ==========================
export const getMotorcycleImages = (motorcycleId) =>
    http.get(`/motorcycles/${motorcycleId}/images`);

export const uploadMotorcycleImage = (motorcycleId, file) => {
    const form = new FormData();
    form.append('image', file);

    return http.post(`/motorcycles/${motorcycleId}/images`, form, {
        headers: { 'Content-Type': 'multipart/form-data' },
    });
};
export function uploadMotorcycleImageByUrl(id, url) {
    return http.post(`/motorcycles/${id}/images/link`, { url });
}

export const deleteMotorcycleImage = (motorcycleId, imageId) =>
    http.delete(`/motorcycles/${motorcycleId}/images/${imageId}`);

export const setMotorcycleThumbnail = (motorcycleId, imageId) =>
    http.patch(`/motorcycles/${motorcycleId}/images/${imageId}/thumbnail`);
// ADMIN
export const getAdminOverview = (range = '30d') =>
    http.get('/dashboard/admin/overview', { params: { range } });

export const getAdminOrders = (params = {}) =>
    http.get('/dashboard/admin/orders', { params });

export const getAdminUsers = (params = {}) =>
    http.get('/dashboard/admin/users', { params });

export const getAdminPayments = (params = {}) =>
    http.get('/dashboard/admin/payments', { params });
