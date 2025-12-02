import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Shell from '../Shell';
import api from '../../../lib/axios';

function slugify(str) {
    return str
        .toString()
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');
}

export default function SellerProductCreate() {
    const navigate = useNavigate();

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

    const [catError, setCatError] = useState(null);
    const [brandError, setBrandError] = useState(null);
    const [colorError, setColorError] = useState(null);

    const [errors, setErrors] = useState({});
    const [generalError, setGeneralError] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [slugManuallyEdited, setSlugManuallyEdited] = useState(false);

    // modal tạo màu mới
    const [isColorModalOpen, setIsColorModalOpen] = useState(false);
    const [newColorName, setNewColorName] = useState('');
    const [newColorCode, setNewColorCode] = useState('#ff0000');
    const [newColorNameEdited, setNewColorNameEdited] = useState(false);
    const [creatingColor, setCreatingColor] = useState(false);
    const [createColorError, setCreateColorError] = useState('');

    // Load categories
    useEffect(() => {
        let cancelled = false;

        async function loadCategories() {
            setLoadingCategories(true);
            setCatError(null);
            try {
                const res = await api.get('/api/categories', {
                    params: { per_page: 100 },
                });
                const raw = res.data;
                const data = Array.isArray(raw) ? raw : raw?.data || [];
                if (!cancelled) {
                    setCategories(data);
                }
            } catch (e) {
                if (!cancelled) {
                    setCatError(e?.response?.data?.message || e.message);
                }
            } finally {
                if (!cancelled) {
                    setLoadingCategories(false);
                }
            }
        }

        loadCategories();
        return () => {
            cancelled = true;
        };
    }, []);

    // Load brands
    useEffect(() => {
        let cancelled = false;

        async function loadBrands() {
            setLoadingBrands(true);
            setBrandError(null);
            try {
                const res = await api.get('/api/brands');
                if (!cancelled) {
                    setBrands(res.data || []);
                }
            } catch (e) {
                if (!cancelled) {
                    setBrandError(e?.response?.data?.message || e.message);
                }
            } finally {
                if (!cancelled) {
                    setLoadingBrands(false);
                }
            }
        }

        loadBrands();
        return () => {
            cancelled = true;
        };
    }, []);

    // Load colors
    useEffect(() => {
        let cancelled = false;

        async function loadColors() {
            setLoadingColors(true);
            setColorError(null);
            try {
                const res = await api.get('/api/colors');
                if (!cancelled) {
                    setColors(res.data || []);
                }
            } catch (e) {
                if (!cancelled) {
                    setColorError(e?.response?.data?.message || e.message);
                }
            } finally {
                if (!cancelled) {
                    setLoadingColors(false);
                }
            }
        }

        loadColors();
        return () => {
            cancelled = true;
        };
    }, []);

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
        const value = e.target.value;
        setSlugManuallyEdited(true);
        setForm(prev => ({
            ...prev,
            slug: value,
        }));
    }

    async function handleSubmit(e) {
        e.preventDefault();
        setSubmitting(true);
        setErrors({});
        setGeneralError('');

        const payload = {
            name: form.name,
            slug: form.slug || null,
            brand_id: form.brand_id || null,
            price: form.price ? Number(form.price) : 0,
            condition: form.condition,
            category_id: form.category_id || null,
            status: form.status || 'draft',

            year: form.year ? Number(form.year) : null,
            description: form.description || null,

            color_id: form.color_id || null,

            engine_cc: form.engine_cc ? Number(form.engine_cc) : null,
            power_hp: form.power_hp ? Number(form.power_hp) : null,
            torque_nm: form.torque_nm ? Number(form.torque_nm) : null,
            weight_kg: form.weight_kg ? Number(form.weight_kg) : null,
        };

        try {
            await api.post('/api/motorcycles', payload);
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

            // thêm vào list colors
            setColors(prev => {
                const exists = prev.some(c => c.id === color.id);
                return exists ? prev : [...prev, color];
            });

            // chọn màu này cho form
            setForm(prev => ({
                ...prev,
                color_id: color.id,
            }));

            setIsColorModalOpen(false);
        } catch (err) {
            if (err.response?.status === 422) {
                const errs = err.response.data.errors || {};
                const msg =
                    Object.values(errs)
                        .flat()
                        .join(' ') || 'Dữ liệu không hợp lệ.';
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
    function handleNewColorCodeChange(e) {
        const value = e.target.value;
        setNewColorCode(value);

        // nếu user chưa sửa tên thủ công, tự gợi ý tên
        if (!newColorNameEdited) {
            setNewColorName(`Màu ${value}`);
        }
    }

    function handleColorSelect(e) {
        const { value } = e.target;

        // nếu người dùng chọn "+ Thêm màu mới..."
        if (value === '__new') {
            setCreateColorError('');
            setNewColorCode('#ff0000');
            setNewColorName('');
            setNewColorNameEdited(false);
            setIsColorModalOpen(true);
            return;
        }

        // còn lại dùng logic chung
        handleChange(e);
    }


    return (
        <Shell>
            <div className="max-w-4xl mx-auto">
                <div className="mb-6">
                    <h1 className="text-2xl font-semibold">Thêm sản phẩm mới</h1>
                    <p className="text-sm text-gray-500 mt-1">
                        Tạo sản phẩm mới cho cửa hàng. Bạn có thể thêm hình ảnh sau khi lưu.
                    </p>
                </div>

                <form
                    onSubmit={handleSubmit}
                    className="bg-white rounded-xl shadow-sm border px-6 py-5 space-y-5"
                >
                    {generalError && (
                        <div className="text-sm text-red-600">
                            {generalError}
                        </div>
                    )}

                    {/* Tên & Slug */}
                    <div className="grid md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">
                                Tên sản phẩm <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                name="name"
                                className="mt-1 border px-3 py-2 rounded-lg w-full text-sm"
                                placeholder="VD: Honda Vision 110cc 2024..."
                                value={form.name}
                                onChange={handleChange}
                            />
                            {errors.name && (
                                <p className="mt-1 text-xs text-red-600">
                                    {errors.name[0]}
                                </p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">
                                Slug
                            </label>
                            <input
                                type="text"
                                name="slug"
                                className="mt-1 border px-3 py-2 rounded-lg w-full text-sm"
                                placeholder="honda-vision-110-2024"
                                value={form.slug}
                                onChange={handleSlugChange}
                            />
                            <p className="mt-1 text-xs text-gray-400">
                                Tự sinh từ tên, bạn vẫn có thể chỉnh sửa.
                            </p>
                            {errors.slug && (
                                <p className="mt-1 text-xs text-red-600">
                                    {errors.slug[0]}
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Danh mục & Thương hiệu */}
                    <div className="grid md:grid-cols-2 gap-4">
                        {/* Category */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700">
                                Loại xe (Danh mục) <span className="text-red-500">*</span>
                            </label>
                            <select
                                name="category_id"
                                className="mt-1 border px-3 py-2 rounded-lg w-full text-sm"
                                value={form.category_id}
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
                            {catError && (
                                <p className="mt-1 text-xs text-red-600">
                                    Lỗi tải danh mục: {catError}
                                </p>
                            )}
                            {errors.category_id && (
                                <p className="mt-1 text-xs text-red-600">
                                    {errors.category_id[0]}
                                </p>
                            )}
                        </div>

                        {/* Brand */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700">
                                Thương hiệu <span className="text-red-500">*</span>
                            </label>
                            <select
                                name="brand_id"
                                className="mt-1 border px-3 py-2 rounded-lg w-full text-sm"
                                value={form.brand_id}
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
                            {brandError && (
                                <p className="mt-1 text-xs text-red-600">
                                    Lỗi tải thương hiệu: {brandError}
                                </p>
                            )}
                            {errors.brand_id && (
                                <p className="mt-1 text-xs text-red-600">
                                    {errors.brand_id[0]}
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Giá & Tình trạng */}
                    <div className="grid md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">
                                Giá (VNĐ) <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="number"
                                name="price"
                                className="mt-1 border px-3 py-2 rounded-lg w-full text-sm"
                                placeholder="VD: 30000000"
                                value={form.price}
                                onChange={handleChange}
                                min={0}
                            />
                            {errors.price && (
                                <p className="mt-1 text-xs text-red-600">
                                    {errors.price[0]}
                                </p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">
                                Tình trạng <span className="text-red-500">*</span>
                            </label>
                            <select
                                name="condition"
                                className="mt-1 border px-3 py-2 rounded-lg w-full text-sm"
                                value={form.condition}
                                onChange={handleChange}
                            >
                                <option value="new">Xe mới</option>
                                <option value="used">Xe cũ</option>
                            </select>
                            {errors.condition && (
                                <p className="mt-1 text-xs text-red-600">
                                    {errors.condition[0]}
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Năm & Màu */}
                    <div className="grid md:grid-cols-3 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">
                                Năm sản xuất
                            </label>
                            <input
                                type="number"
                                name="year"
                                className="mt-1 border px-3 py-2 rounded-lg w-full text-sm"
                                placeholder="VD: 2024"
                                value={form.year}
                                onChange={handleChange}
                                min={1950}
                                max={2100}
                            />
                            {errors.year && (
                                <p className="mt-1 text-xs text-red-600">
                                    {errors.year[0]}
                                </p>
                            )}
                        </div>

                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700">
                                Màu sắc
                            </label>
                            <select
                                name="color_id"
                                className="mt-1 border px-3 py-2 rounded-lg w-full text-sm"
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

                            {colorError && (
                                <p className="mt-1 text-xs text-red-600">
                                    Lỗi tải màu: {colorError}
                                </p>
                            )}
                            {errors.color_id && (
                                <p className="mt-1 text-xs text-red-600">
                                    {errors.color_id[0]}
                                </p>
                            )}

                            {form.color_id && (
                                <div className="mt-2 flex items-center gap-2 text-xs text-gray-600">
                                    <span>Xem trước màu:</span>
                                    {(() => {
                                        const sel = colors.find(
                                            c => String(c.id) === String(form.color_id)
                                        );
                                        const code = sel?.code || '#ffffff';
                                        return (
                                            <span className="inline-flex items-center gap-1">
                                                <span
                                                    className="w-5 h-5 rounded-full border"
                                                    style={{ backgroundColor: code }}
                                                />
                                                <span>{sel?.name} ({code})</span>
                                            </span>
                                        );
                                    })()}
                                </div>
                            )}
                        </div>

                    </div>

                    {/* Mô tả */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            Mô tả
                        </label>
                        <textarea
                            name="description"
                            className="mt-1 border px-3 py-2 rounded-lg w-full text-sm min-h-[120px]"
                            placeholder="Mô tả chi tiết về xe, ưu điểm, tình trạng, khuyến mãi..."
                            value={form.description}
                            onChange={handleChange}
                        />
                        {errors.description && (
                            <p className="mt-1 text-xs text-red-600">
                                {errors.description[0]}
                            </p>
                        )}
                    </div>

                    {/* Thông số kỹ thuật */}
                    <div className="border-t pt-4">
                        <h2 className="text-sm font-semibold text-gray-700 mb-3">
                            Thông số kỹ thuật
                        </h2>
                        <div className="grid md:grid-cols-4 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">
                                    Dung tích (cc)
                                </label>
                                <input
                                    type="number"
                                    name="engine_cc"
                                    className="mt-1 border px-3 py-2 rounded-lg w-full text-sm"
                                    placeholder="VD: 110"
                                    value={form.engine_cc}
                                    onChange={handleChange}
                                    min={0}
                                />
                                {errors.engine_cc && (
                                    <p className="mt-1 text-xs text-red-600">
                                        {errors.engine_cc[0]}
                                    </p>
                                )}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">
                                    Công suất (HP)
                                </label>
                                <input
                                    type="number"
                                    name="power_hp"
                                    className="mt-1 border px-3 py-2 rounded-lg w-full text-sm"
                                    placeholder="VD: 12"
                                    value={form.power_hp}
                                    onChange={handleChange}
                                    min={0}
                                />
                                {errors.power_hp && (
                                    <p className="mt-1 text-xs text-red-600">
                                        {errors.power_hp[0]}
                                    </p>
                                )}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">
                                    Mô-men xoắn (Nm)
                                </label>
                                <input
                                    type="number"
                                    name="torque_nm"
                                    className="mt-1 border px-3 py-2 rounded-lg w-full text-sm"
                                    placeholder="VD: 11"
                                    value={form.torque_nm}
                                    onChange={handleChange}
                                    min={0}
                                />
                                {errors.torque_nm && (
                                    <p className="mt-1 text-xs text-red-600">
                                        {errors.torque_nm[0]}
                                    </p>
                                )}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">
                                    Khối lượng (kg)
                                </label>
                                <input
                                    type="number"
                                    name="weight_kg"
                                    className="mt-1 border px-3 py-2 rounded-lg w-full text-sm"
                                    placeholder="VD: 100"
                                    value={form.weight_kg}
                                    onChange={handleChange}
                                    min={0}
                                />
                                {errors.weight_kg && (
                                    <p className="mt-1 text-xs text-red-600">
                                        {errors.weight_kg[0]}
                                    </p>
                                )}
                            </div>
                        </div>
                        <p className="mt-2 text-[11px] text-gray-400">
                            Các thông số này sẽ được lưu vào bảng <code>specs</code> và liên kết 1-1 với xe.
                        </p>
                    </div>

                    {/* Trạng thái */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            Trạng thái hiển thị
                        </label>
                        <div className="mt-1 flex gap-4 text-sm">
                            <label className="inline-flex items-center gap-2">
                                <input
                                    type="radio"
                                    name="status"
                                    value="draft"
                                    checked={form.status === 'draft'}
                                    onChange={handleChange}
                                />
                                <span>Nháp (draft)</span>
                            </label>
                            <label className="inline-flex items-center gap-2">
                                <input
                                    type="radio"
                                    name="status"
                                    value="active"
                                    checked={form.status === 'active'}
                                    onChange={handleChange}
                                />
                                <span>Hiển thị (active)</span>
                            </label>
                        </div>
                        {errors.status && (
                            <p className="mt-1 text-xs text-red-600">
                                {errors.status[0]}
                            </p>
                        )}
                    </div>

                    {/* Actions */}
                    <div className="pt-3 flex justify-end gap-3">
                        <button
                            type="button"
                            onClick={handleCancel}
                            className="px-4 py-2 rounded-lg border text-sm hover:bg-gray-50"
                            disabled={submitting}
                        >
                            Hủy
                        </button>
                        <button
                            type="submit"
                            disabled={submitting}
                            className="px-4 py-2 rounded-lg bg-black text-white text-sm hover:opacity-90 disabled:opacity-60"
                        >
                            {submitting ? 'Đang lưu...' : 'Lưu sản phẩm'}
                        </button>
                    </div>
                </form>
            </div>
            {isColorModalOpen && (
                <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl shadow-lg w-full max-w-md p-5">
                        <h2 className="text-lg font-semibold mb-3">
                            Thêm màu mới
                        </h2>

                        <form onSubmit={handleCreateColor} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">
                                    Chọn màu
                                </label>
                                <div className="mt-1 flex items-center gap-3">
                                    <input
                                        type="color"
                                        value={newColorCode}
                                        onChange={handleNewColorCodeChange}
                                        className="w-10 h-10 border rounded cursor-pointer"
                                    />
                                    <span className="text-sm text-gray-600">
                                        Mã: {newColorCode}
                                    </span>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700">
                                    Tên màu
                                </label>
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
                                <p className="text-sm text-red-600">
                                    {createColorError}
                                </p>
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
