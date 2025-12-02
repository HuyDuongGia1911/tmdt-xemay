

import { useEffect, useState } from 'react'
import api from '../lib/axios'
import HeroBanner from '../components/HeroBanner'
import FeaturedSlider from "../components/FeaturedSlider";

import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/navigation'

export default function Home() {
    const [categories, setCategories] = useState([])
    const [brands, setBrands] = useState([])

    const [loadingCat, setLoadingCat] = useState(false)
    const [loadingBrand, setLoadingBrand] = useState(false)

    const [errorCat, setErrorCat] = useState('')
    const [errorBrand, setErrorBrand] = useState('')

    // featured products
    const [featured, setFeatured] = useState([])
    const [loadingFeatured, setLoadingFeatured] = useState(false)
    const [errorFeatured, setErrorFeatured] = useState('')

    // ================= LOAD CATEGORIES =================
    useEffect(() => {
        let mounted = true

        async function loadCategories() {
            try {
                setLoadingCat(true)
                const res = await api.get('/api/categories', {
                    params: { page: 1, per_page: 20 }
                })
                const list = res.data?.data ?? res.data
                if (mounted) setCategories(list)
            } catch (e) {
                setErrorCat(e?.response?.data?.message || e.message)
            } finally {
                if (mounted) setLoadingCat(false)
            }
        }

        loadCategories()
        return () => (mounted = false)
    }, [])

    // ================= LOAD BRANDS =================
    useEffect(() => {
        let mounted = true
        async function loadBrands() {
            try {
                setLoadingBrand(true)
                const res = await api.get('/api/brands')
                if (mounted) setBrands(res.data)
            } catch (e) {
                setErrorBrand(e?.response?.data?.message || e.message)
            } finally {
                if (mounted) setLoadingBrand(false)
            }
        }
        loadBrands()
        return () => (mounted = false)
    }, [])

    // ================= LOAD FEATURED MOTORCYCLES =================
    useEffect(() => {
        let mounted = true

        async function loadFeatured() {
            try {
                setLoadingFeatured(true)
                const res = await api.get('/api/motorcycles/featured', {
                    params: { limit: 20 }
                })
                const list = res.data?.data ?? res.data
                if (mounted) setFeatured(list)
            } catch (e) {
                setErrorFeatured(e?.response?.data?.message || e.message)
            } finally {
                if (mounted) setLoadingFeatured(false)
            }
        }

        loadFeatured()
        return () => (mounted = false)
    }, [])

    // helper lấy hình sản phẩm (tùy theo Resource của bạn)
    const getMotoImage = (m) =>
        m.thumbnail_url ||
        m.image_url ||
        m.main_image ||
        m.first_image_url ||
        m.image ||
        'https://via.placeholder.com/400x300?text=Motorcycle'

    return (
        <div className="space-y-12">



            {/* spacer để tránh đè lên slider */}


            {/* ================= KHỐI NỀN XÁM FULL WIDTH ================= */}
            <div className="w-full bg-[#f7f7f7] py-10">
                {/*================= HERO + SEARCH FLOATING =================*/}
                <div className="w-full relative">
                    {/* Hero full block, không nền xanh */}
                    <HeroBanner />

                    {/* SEARCH BAR NỔI */}
                    <div
                        className="
                        absolute left-1/2 -translate-x-1/2 
                        -bottom-10 
                        w-[95%] md:w-[75%] 
                        bg-white shadow-xl rounded-2xl 
                        px-6 py-4 md:px-8 md:py-5
                        flex items-center gap-3 md:gap-4
                        z-20
                    "
                    >
                        {/* ===== Dropdown DANH MỤC ===== */}
                        <div className="relative group">
                            <button
                                className="
                                flex items-center gap-2 
                                font-bold text-gray-700
                            "
                            >
                                Danh mục
                                <span>▼</span>
                            </button>

                            {/* DROPDOWN LIST */}
                            <div
                                className="
                                absolute left-0 top-full mt-2 
                                w-48 bg-white border rounded-xl shadow-lg 
                                opacity-0 invisible group-hover:opacity-100 group-hover:visible 
                                transition-all duration-150
                                z-30
                            "
                            >
                                {categories.slice(0, 10).map(cat => (
                                    <button
                                        key={cat.id}
                                        className="
                                        block w-full text-left px-4 py-2 
                                        hover:bg-gray-100 text-gray-700
                                    "
                                    >
                                        {cat.name}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* ===== SEARCH INPUT ===== */}
                        <input
                            type="text"
                            placeholder="Tìm xe máy..."
                            className="
                            flex-1 bg-gray-100 rounded-xl 
                            py-3 md:py-3.5 text-lg
                            outline-none text-gray-700
                            focus:ring-2 focus:ring-blue-500
                        "
                        />

                        {/* ===== SEARCH BUTTON ===== */}
                        <button
                            className="
                            bg-blue-400 text-gray-900 font-bold
                            px-6 md:px-8 py-3 text-lg rounded-xl
                            hover:bg-blue-500 
                            transition active:scale-95
                        "
                        >
                            Tìm kiếm
                        </button>
                    </div>
                </div>
                <div className="h-16"></div>
                <div className="mb-16">
                    <FeaturedSlider />
                </div>
                {/* ================= KHỐI TRẮNG GIỚI HẠN MAX-W ================= */}
                <div className="w-full max-w-[1600px] mx-auto px-6 md:px-10 space-y-10">

                    {/* ================= DANH MỤC ================= */}
                    <div className="bg-white rounded-3xl p-8 shadow-sm">
                        <h2 className="text-center text-[22px] font-bold uppercase tracking-wide text-gray-500 mb-8">
                            Danh mục
                        </h2>

                        <ul
                            className="
                                grid
                                grid-cols-2
                                sm:grid-cols-3
                                md:grid-cols-4
                                lg:grid-cols-6
                                gap-x-6 gap-y-10
                            "
                        >
                            {categories.slice(0, 11).map(c => {
                                const icon = c.icon_url ? c.icon_url :
                                    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTjAXpPSul7CNYqsfqljR-8t29uxZVSJwn9pg&s';

                                const isNew = (() => {
                                    const now = new Date();
                                    const limit = 7;
                                    let cD = c.created_at ? (now - new Date(c.created_at)) / 86400000 : 99;
                                    let uD = c.updated_at ? (now - new Date(c.updated_at)) / 86400000 : 99;
                                    return cD <= limit || uD <= limit;
                                })();

                                return (
                                    <li key={c.id} className="flex flex-col items-center text-center cursor-pointer relative group">
                                        {isNew && (
                                            <span className="absolute top-0 right-2 bg-red-500 text-white text-[10px] px-2 py-0.5 rounded-full shadow">
                                                Mới
                                            </span>
                                        )}

                                        <div className="w-24 h-24 md:w-28 md:h-28 flex items-center justify-center mb-3">
                                            <img src={icon} className="w-full h-full object-contain group-hover:scale-110 transition" />
                                        </div>
                                        <div className="text-sm md:text-base font-medium text-gray-500">{c.name}</div>
                                    </li>
                                );
                            })}

                            {/* NÚT TẤT CẢ DANH MỤC */}
                            <li className="flex flex-col items-center text-center cursor-pointer group">
                                <div className="w-24 h-24 md:w-28 md:h-28 flex items-center justify-center mb-3">
                                    <img
                                        src="https://www.shutterstock.com/image-vector/category-symbols-featuring-square-grids-600nw-2614452525.jpg"
                                        className="w-full h-full object-contain group-hover:scale-110 transition"
                                    />
                                </div>
                                <div className="text-sm md:text-base font-bold text-gray-500">Tất cả danh mục</div>
                            </li>
                        </ul>
                    </div>

                    {/* ================= HÃNG ================= */}
                    <div className="bg-white rounded-3xl p-8 shadow-sm">
                        <h2 className="text-center text-[22px] font-bold uppercase tracking-wide text-gray-500 mb-8">
                            Hãng
                        </h2>

                        <ul
                            className="
                                grid
                                grid-cols-2
                                sm:grid-cols-3
                                md:grid-cols-4
                                lg:grid-cols-6
                                gap-x-6 gap-y-10
                            "
                        >
                            {brands.slice(0, 11).map(b => {

                                const logo = b.logo_url ??
                                    "https://www.shutterstock.com/image-vector/category-symbols-featuring-square-grids-600nw-2614452525.jpg";

                                const isNew = (() => {
                                    const now = new Date();
                                    const limit = 7;
                                    let cD = b.created_at ? (now - new Date(b.created_at)) / 86400000 : 99;
                                    let uD = b.updated_at ? (now - new Date(b.updated_at)) / 86400000 : 99;
                                    return cD <= limit || uD <= limit;
                                })();

                                return (
                                    <li key={b.id} className="flex flex-col items-center text-center cursor-pointer relative group">
                                        {isNew && (
                                            <span className="absolute top-0 right-2 bg-red-500 text-white text-[10px] px-2 py-0.5 rounded-full shadow">
                                                Mới
                                            </span>
                                        )}

                                        <div className="w-28 h-28 flex items-center justify-center mb-3">
                                            <img src={logo} className="w-full h-full object-contain group-hover:scale-110 transition" />
                                        </div>

                                        <div className="text-sm md:text-base font-medium text-gray-500">{b.name}</div>
                                    </li>
                                );
                            })}

                            {/* NÚT TẤT CẢ HÃNG */}
                            <li className="flex flex-col items-center text-center cursor-pointer group">
                                <div className="w-28 h-28 flex items-center justify-center mb-3">
                                    <img
                                        src="https://www.shutterstock.com/image-vector/category-symbols-featuring-square-grids-600nw-2614452525.jpg"
                                        className="w-full h-full object-contain group-hover:scale-110 transition"
                                    />
                                </div>
                                <div className="text-sm md:text-base font-bold text-gray-500">Tất cả hãng</div>
                            </li>

                        </ul>
                    </div>

                </div>
            </div>
        </div>
    )
}
