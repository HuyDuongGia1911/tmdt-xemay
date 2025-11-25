import React, { useEffect, useState } from 'react';
import Shell from '../Shell';
import { getSellerProfile, updateSellerProfile } from '../../../api/seller';
import { useAuth } from '../../../contexts/AuthContext';

export default function SellerProfile() {
    const { fetchMe } = useAuth();

    const [form, setForm] = useState({
        shop_name: '',
        phone: '',
        address: '',
        logo_url: '',
    });

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);

    useEffect(() => {
        async function load() {
            setError(null);
            try {
                const res = await getSellerProfile();
                const data = res.data || {};
                setForm({
                    shop_name: data.shop_name || '',
                    phone: data.phone || '',
                    address: data.address || '',
                    logo_url: data.logo_url || '',
                });
            } catch (e) {
                setError(e?.response?.data?.message || 'Không lấy được thông tin cửa hàng');
            } finally {
                setLoading(false);
            }
        }
        load();
    }, []);

    function handleChange(e) {
        setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
    }

    async function handleSubmit(e) {
        e.preventDefault();
        setSaving(true);
        setError(null);
        setSuccess(null);

        try {
            await updateSellerProfile(form);
            await fetchMe(); // đồng bộ lại seller trong AuthContext
            setSuccess('Cập nhật cửa hàng thành công!');
        } catch (err) {
            setError(err?.response?.data?.message || 'Có lỗi xảy ra');
        } finally {
            setSaving(false);
        }
    }

    return (
        <Shell>
            <div className="max-w-xl">
                <h1 className="text-2xl font-bold mb-4">Thông tin cửa hàng</h1>

                {loading && <div>Đang tải...</div>}

                {!loading && (
                    <>
                        {error && <div className="mb-3 text-red-600">{error}</div>}
                        {success && <div className="mb-3 text-green-600">{success}</div>}

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block font-medium mb-1">Tên cửa hàng</label>
                                <input
                                    type="text"
                                    name="shop_name"
                                    required
                                    value={form.shop_name}
                                    onChange={handleChange}
                                    className="border px-3 py-2 rounded w-full"
                                />
                            </div>

                            <div>
                                <label className="block font-medium mb-1">Số điện thoại</label>
                                <input
                                    type="text"
                                    name="phone"
                                    required
                                    value={form.phone}
                                    onChange={handleChange}
                                    className="border px-3 py-2 rounded w-full"
                                />
                            </div>

                            <div>
                                <label className="block font-medium mb-1">Địa chỉ</label>
                                <input
                                    type="text"
                                    name="address"
                                    required
                                    value={form.address}
                                    onChange={handleChange}
                                    className="border px-3 py-2 rounded w-full"
                                />
                            </div>

                            <div>
                                <label className="block font-medium mb-1">
                                    Logo URL (tùy chọn)
                                </label>
                                <input
                                    type="text"
                                    name="logo_url"
                                    value={form.logo_url}
                                    onChange={handleChange}
                                    placeholder="https://example.com/logo.png"
                                    className="border px-3 py-2 rounded w-full"
                                />
                            </div>

                            <button
                                disabled={saving}
                                className="px-4 py-2 bg-black text-white rounded hover:opacity-90 disabled:opacity-50"
                            >
                                {saving ? 'Đang lưu...' : 'Lưu thay đổi'}
                            </button>
                        </form>
                    </>
                )}
            </div>
        </Shell>
    );
}
