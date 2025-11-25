import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from '../../../lib/axios'
import { useAuth } from "../../../contexts/AuthContext";
export default function SellerSetup() {
    const navigate = useNavigate();
    const { fetchMe } = useAuth();
    const [form, setForm] = useState({
        shop_name: "",
        phone: "",
        address: "",
        logo_url: "",
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);

    function handleChange(e) {
        setForm({ ...form, [e.target.name]: e.target.value });
    }

    async function handleSubmit(e) {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setSuccess(null);

        try {
            await api.post("api/seller/setup", form);
            await fetchMe()
            setSuccess("Tạo cửa hàng thành công!");
            setTimeout(() => navigate("/dashboard/seller"), 900);
        } catch (err) {
            setError(err?.response?.data?.message || "Có lỗi xảy ra");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="max-w-xl mx-auto mt-10 p-6 bg-white rounded-xl shadow">
            <h1 className="text-2xl font-bold mb-4">Tạo cửa hàng</h1>

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
                    disabled={loading}
                    className="px-4 py-2 bg-black text-white rounded hover:opacity-90 disabled:opacity-50"
                >
                    {loading ? "Đang tạo..." : "Tạo cửa hàng"}
                </button>
            </form>
        </div>
    );
}
