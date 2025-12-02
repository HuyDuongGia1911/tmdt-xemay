import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Shell from '../Shell';
import api from '../../../lib/axios';
import { getSellerMotorcycle } from '../../../api/dashboard';

function slugify(str) {
    return str
        .toString()
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');
}

export default function SellerProductEdit() {
    const navigate = useNavigate();
    const { id } = useParams();

    const [form, setForm] = useState({
        name: '',
        slug: '',
        brand_id: '',
        price: '',
        condition: 'new',
        category_id: '',
        status: 'draft',
        year: '',
        description: '',
        color_id: '',
        engine_cc: '',
        power_hp: '',
        torque_nm: '',
        weight_kg: '',
    });

    const [categories, setCategories] = useState([]);
    const [brands, setBrands] = useState([]);
    const [colors, setColors] = useState([]);

    const [loadingCategories, setLoadingCategories] = useState(true);
    const [loadingBrands, setLoadingBrands] = useState(true);
    const [loadingColors, setLoadingColors] = useState(true);
    const [loadingProduct, setLoadingProduct] = useState(true);

    const [catError, setCatError] = useState(null);
    const [brandError, setBrandError] = useState(null);
    const [colorError, setColorError] = useState(null);
    const [productError, setProductError] = useState(null);

    const [errors, setErrors] = useState({});
    const [generalError, setGeneralError] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [slugManuallyEdited, setSlugManuallyEdited] = useState(false);
    // modal thêm màu mới
    const [isColorModalOpen, setIsColorModalOpen] = useState(false);
    const [newColorName, setNewColorName] = useState('');
    const [newColorCode, setNewColorCode] = useState('#ff0000');
    const [newColorNameEdited, setNewColorNameEdited] = useState(false);
    const [creatingColor, setCreatingColor] = useState(false);
    const [createColorError, setCreateColorError] = useState('');
    // Load categories
    useEffect(() => {
        async function loadCategories() {
            setLoadingCategories(true);
            setCatError(null);
            try {
                const res = await api.get('/api/categories', {
                    params: { per_page: 100 },
                });
                const raw = res.data;
                const data = Array.isArray(raw) ? raw : raw?.data || [];
                setCategories(data);
            } catch (e) {
                setCatError(e?.response?.data?.message || e.message);
            } finally {
                setLoadingCategories(false);
            }
        }
        loadCategories();
    }, []);

    // Load brands
    useEffect(() => {
        async function loadBrands() {
            setLoadingBrands(true);
            setBrandError(null);
            try {
                const res = await api.get('/api/brands');
                setBrands(res.data || []);
            } catch (e) {
                setBrandError(e?.response?.data?.message || e.message);
            } finally {
                setLoadingBrands(false);
            }
        }
        loadBrands();
    }, []);

    // Load colors
    useEffect(() => {
        async function loadColors() {
            setLoadingColors(true);
            setColorError(null);
            try {
                const res = await api.get('/api/colors');
                setColors(res.data || []);
            } catch (e) {
                setColorError(e?.response?.data?.message || e.message);
            } finally {
                setLoadingColors(false);
            }
        }
        loadColors();
    }, []);

    // Load product
    useEffect(() => {
        async function loadProduct() {
            setLoadingProduct(true);
            setProductError(null);
            try {
                const res = await getSellerMotorcycle(id);
                const mc = res.data;

                setForm({
                    name: mc.name || '',
                    slug: mc.slug || '',
                    brand_id: mc.brand_id || '',
                    price: mc.price ?? '',
                    condition: mc.condition || 'new',
                    category_id: mc.category_id || '',
                    status: mc.status || 'draft',
                    year: mc.spec?.year || '',
                    description: mc.description || '',
                    color_id: mc.color_id || '',
                    engine_cc: mc.spec?.engine_cc || '',
                    power_hp: mc.spec?.power_hp || '',
                    torque_nm: mc.spec?.torque_nm || '',
                    weight_kg: mc.spec?.weight_kg || '',
                });
            } catch (e) {
                setProductError(e?.response?.data?.message || e.message);
            } finally {
                setLoadingProduct(false);
            }
        }
        loadProduct();
    }, [id]);

    function handleChange(e) {
        const { name, value } = e.target;

        setForm(prev => {
            let next = { ...prev, [name]: value };

            if (name === 'name' && !slugManuallyEdited) {
                next.slug = slugify(value);
            }

            return next;
        });
    }

    function handleSlugChange(e) {
        setSlugManuallyEdited(true);
        setForm(prev => ({ ...prev, slug: e.target.value }));
    }

    function handleColorSelect(e) {
        const { value } = e.target;

        if (value === '__new') {
            // mở modal tạo màu mới
            setCreateColorError('');
            setNewColorCode('#ff0000');
            setNewColorName('');
            setNewColorNameEdited(false);
            setIsColorModalOpen(true);
            return;
        }

        setForm(prev => ({ ...prev, color_id: value }));
    }

    async function handleSubmit(e) {
        e.preventDefault();
        setSubmitting(true);
        setGeneralError('');
        setErrors({});

        const payload = {
            name: form.name,
            slug: form.slug || null,
            brand_id: form.brand_id || null,
            price: form.price ? Number(form.price) : 0,
            condition: form.condition,
            category_id: form.category_id || null,
            status: form.status || 'draft',
            year: form.year ? Number(form.year) : null,
            description: form.description,
            color_id: form.color_id || null,
            engine_cc: form.engine_cc ? Number(form.engine_cc) : null,
            power_hp: form.power_hp ? Number(form.power_hp) : null,
            torque_nm: form.torque_nm ? Number(form.torque_nm) : null,
            weight_kg: form.weight_kg ? Number(form.weight_kg) : null,
        };

        try {
            await api.put(`/api/motorcycles/${id}`, payload);
            navigate('/dashboard/seller/products');
        } catch (e) {
            if (e.response?.status === 422) {
                setErrors(e.response.data.errors || {});
            } else {
                setGeneralError(e?.response?.data?.message || e.message);
            }
        } finally {
            setSubmitting(false);
        }
    }
    async function handleCreateColor(e) {
        e.preventDefault();
        setCreatingColor(true);
        setCreateColorError('');

        const name = newColorName.trim() || `Màu ${newColorCode}`;
        const code = newColorCode;

        try {
            const res = await api.post('/api/colors', { name, code });
            const color = res.data;

            // thêm vào list
            setColors(prev => {
                const exists = prev.some(c => c.id === color.id);
                return exists ? prev : [...prev, color];
            });

            // chọn màu
            setForm(prev => ({
                ...prev,
                color_id: color.id,
            }));

            setIsColorModalOpen(false);
        } catch (err) {
            if (err.response?.status === 422) {
                const errs = err.response.data.errors || {};
                const msg = Object.values(errs).flat().join(' ') || 'Dữ liệu không hợp lệ.';
                setCreateColorError(msg);
            } else {
                setCreateColorError(err?.response?.data?.message || err.message);
            }
        } finally {
            setCreatingColor(false);
        }
    }

    function handleCancel() {
        navigate('/dashboard/seller/products');
    }

    if (loadingProduct) {
        return (
            <Shell>
                <div className="text-sm text-gray-600">Đang tải sản phẩm...</div>
            </Shell>
        );
    }

    if (productError) {
        return (
            <Shell>
                <div className="text-sm text-red-600">
                    Lỗi tải sản phẩm: {productError}
                </div>
            </Shell>
        );
    }

    return (
        <Shell>
            <div className="max-w-4xl mx-auto">
                <div className="mb-6">
                    <h1 className="text-2xl font-semibold">Chỉnh sửa sản phẩm</h1>
                    <p className="text-sm text-gray-500 mt-1">
                        Cập nhật thông tin sản phẩm. Ảnh quản lý riêng tại màn hình danh sách.
                    </p>
                </div>

                <form className="space-y-6" onSubmit={handleSubmit}>
                    {/* GRID FORM */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                        {/* Name */}
                        <div>
                            <label className="block text-sm font-medium">Tên sản phẩm *</label>
                            <input
                                name="name"
                                className="border px-3 py-2 rounded-lg w-full text-sm"
                                value={form.name}
                                onChange={handleChange}
                            />
                            {errors.name && (
                                <p className="text-xs text-red-600">{errors.name[0]}</p>
                            )}
                        </div>

                        {/* Slug */}
                        <div>
                            <label className="block text-sm font-medium">Slug</label>
                            <input
                                name="slug"
                                className="border px-3 py-2 rounded-lg w-full text-sm"
                                value={form.slug}
                                onChange={handleSlugChange}
                            />
                            {errors.slug && (
                                <p className="text-xs text-red-600">{errors.slug[0]}</p>
                            )}
                        </div>

                        {/* Category */}
                        <div>
                            <label className="block text-sm font-medium">
                                Loại xe (Danh mục) *
                            </label>
                            <select
                                name="category_id"
                                className="border px-3 py-2 rounded-lg w-full text-sm"
                                value={form.category_id || ''}
                                onChange={handleChange}
                                disabled={loadingCategories}
                            >
                                <option value="">Chọn danh mục...</option>
                                {categories.map(cat => (
                                    <option key={cat.id} value={cat.id}>
                                        {cat.name}
                                    </option>
                                ))}
                            </select>
                            {errors.category_id && (
                                <p className="text-xs text-red-600">
                                    {errors.category_id[0]}
                                </p>
                            )}
                        </div>

                        {/* Brand */}
                        <div>
                            <label className="block text-sm font-medium">Thương hiệu *</label>
                            <select
                                name="brand_id"
                                className="border px-3 py-2 rounded-lg w-full text-sm"
                                value={form.brand_id || ''}
                                onChange={handleChange}
                                disabled={loadingBrands}
                            >
                                <option value="">Chọn thương hiệu...</option>
                                {brands.map(b => (
                                    <option key={b.id} value={b.id}>
                                        {b.name}
                                    </option>
                                ))}
                            </select>
                            {errors.brand_id && (
                                <p className="text-xs text-red-600">{errors.brand_id[0]}</p>
                            )}
                        </div>

                        {/* Price */}
                        <div>
                            <label className="block text-sm font-medium">Giá (VND) *</label>
                            <input
                                name="price"
                                type="number"
                                className="border px-3 py-2 rounded-lg w-full text-sm"
                                value={form.price}
                                onChange={handleChange}
                            />
                            {errors.price && (
                                <p className="text-xs text-red-600">{errors.price[0]}</p>
                            )}
                        </div>

                        {/* Condition */}
                        <div>
                            <label className="block text-sm font-medium">Tình trạng *</label>
                            <select
                                name="condition"
                                className="border px-3 py-2 rounded-lg w-full text-sm"
                                value={form.condition}
                                onChange={handleChange}
                            >
                                <option value="new">Xe mới</option>
                                <option value="used">Xe cũ</option>
                            </select>
                        </div>

                        {/* Year */}
                        <div>
                            <label className="block text-sm font-medium">Năm sản xuất</label>
                            <input
                                name="year"
                                type="number"
                                className="border px-3 py-2 rounded-lg w-full text-sm"
                                value={form.year}
                                onChange={handleChange}
                            />
                            {errors.year && (
                                <p className="text-xs text-red-600">{errors.year[0]}</p>
                            )}
                        </div>

                        {/* Color */}
                        <div>
                            <label className="block text-sm font-medium">Màu sắc</label>
                            <select
                                name="color_id"
                                className="border px-3 py-2 rounded-lg w-full text-sm"
                                value={form.color_id || ''}
                                onChange={handleColorSelect}
                                disabled={loadingColors}
                            >
                                <option value="">Chọn màu...</option>
                                {colors.map(c => (
                                    <option key={c.id} value={c.id}>
                                        {c.name} ({c.code})
                                    </option>
                                ))}
                                <option value="__new">+ Thêm màu mới…</option>
                            </select>


                            {form.color_id && (
                                <div className="mt-1 flex items-center gap-2 text-xs text-gray-600">
                                    <span>Xem trước:</span>
                                    {(() => {
                                        const sel = colors.find(
                                            c => String(c.id) === String(form.color_id)
                                        );
                                        const code = sel?.code || '#fff';
                                        return (
                                            <span className="inline-flex items-center gap-1">
                                                <span
                                                    className="w-5 h-5 rounded-full border"
                                                    style={{ backgroundColor: code }}
                                                />
                                                <span>{sel?.name}</span>
                                            </span>
                                        );
                                    })()}
                                </div>
                            )}
                        </div>

                        {/* Status */}
                        <div>
                            <label className="block text-sm font-medium">Trạng thái *</label>
                            <select
                                name="status"
                                className="border px-3 py-2 rounded-lg w-full text-sm"
                                value={form.status}
                                onChange={handleChange}
                            >
                                <option value="draft">Nháp</option>
                                <option value="active">Hiển thị</option>
                            </select>
                        </div>
                    </div>

                    {/* DESCRIPTION */}
                    <div>
                        <label className="block text-sm font-medium">Mô tả</label>
                        <textarea
                            name="description"
                            rows={4}
                            className="border px-3 py-2 rounded-lg w-full text-sm"
                            value={form.description}
                            onChange={handleChange}
                        />
                    </div>

                    {/* SPEC */}
                    <div>
                        <h2 className="text-md font-semibold mb-2">Thông số kỹ thuật</h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium">Động cơ (cc)</label>
                                <input
                                    name="engine_cc"
                                    type="number"
                                    className="border px-3 py-2 rounded-lg w-full text-sm"
                                    value={form.engine_cc}
                                    onChange={handleChange}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium">Công suất (hp)</label>
                                <input
                                    name="power_hp"
                                    type="number"
                                    className="border px-3 py-2 rounded-lg w-full text-sm"
                                    value={form.power_hp}
                                    onChange={handleChange}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium">Mô-men xoắn (Nm)</label>
                                <input
                                    name="torque_nm"
                                    type="number"
                                    className="border px-3 py-2 rounded-lg w-full text-sm"
                                    value={form.torque_nm}
                                    onChange={handleChange}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium">Khối lượng (kg)</label>
                                <input
                                    name="weight_kg"
                                    type="number"
                                    className="border px-3 py-2 rounded-lg w-full text-sm"
                                    value={form.weight_kg}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>
                    </div>

                    {/* ACTIONS */}
                    <div className="flex justify-end gap-3">
                        <button
                            type="button"
                            className="px-4 py-2 border rounded-lg text-sm hover:bg-gray-50"
                            onClick={handleCancel}
                            disabled={submitting}
                        >
                            Hủy
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 bg-black text-white rounded-lg text-sm hover:opacity-90 disabled:opacity-60"
                            disabled={submitting}
                        >
                            {submitting ? 'Đang lưu...' : 'Cập nhật'}
                        </button>
                    </div>

                    {generalError && (
                        <p className="text-red-600 text-sm mt-2">{generalError}</p>
                    )}
                </form>
            </div>
            {isColorModalOpen && (
                <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl shadow-lg w-full max-w-md p-5">
                        <h2 className="text-lg font-semibold mb-3">Thêm màu mới</h2>

                        <form onSubmit={handleCreateColor} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Chọn màu</label>
                                <div className="mt-1 flex items-center gap-3">
                                    <input
                                        type="color"
                                        value={newColorCode}
                                        onChange={(e) => {
                                            setNewColorCode(e.target.value);
                                            if (!newColorNameEdited) {
                                                setNewColorName(`Màu ${e.target.value}`);
                                            }
                                        }}
                                        className="w-10 h-10 border rounded cursor-pointer"
                                    />
                                    <span className="text-sm text-gray-600">Mã: {newColorCode}</span>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700">Tên màu</label>
                                <input
                                    type="text"
                                    className="mt-1 border px-3 py-2 rounded-lg w-full text-sm"
                                    placeholder="VD: Đỏ nhám, Xanh dương đậm..."
                                    value={newColorName}
                                    onChange={(e) => {
                                        setNewColorNameEdited(true);
                                        setNewColorName(e.target.value);
                                    }}
                                />
                                <p className="mt-1 text-xs text-gray-400">
                                    Mặc định gợi ý theo mã màu, bạn có thể sửa lại.
                                </p>
                            </div>

                            {createColorError && (
                                <p className="text-sm text-red-600">{createColorError}</p>
                            )}

                            <div className="pt-2 flex justify-end gap-3">
                                <button
                                    type="button"
                                    className="px-4 py-2 rounded-lg border text-sm hover:bg-gray-50"
                                    onClick={() => !creatingColor && setIsColorModalOpen(false)}
                                    disabled={creatingColor}
                                >
                                    Hủy
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 rounded-lg bg-black text-white text-sm hover:opacity-90 disabled:opacity-60"
                                    disabled={creatingColor}
                                >
                                    {creatingColor ? 'Đang tạo...' : 'Lưu màu mới'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

        </Shell>
    );
}
