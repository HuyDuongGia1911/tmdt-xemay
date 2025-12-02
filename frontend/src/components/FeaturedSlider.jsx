import { useEffect, useState } from "react";
import api from "../lib/axios";

import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import { addCartItem } from "../api/cart";
import "swiper/css";
import "swiper/css/navigation";

export default function FeaturedSlider() {
    const [featured, setFeatured] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    // Lấy ảnh đúng chuẩn
    const getMotoImage = (m) =>
        m.thumbnail_url ||
        (m.images?.length > 0 ? m.images[0].url : null) ||
        "https://via.placeholder.com/450x300?text=No+Image";

    // Load featured
    useEffect(() => {
        async function loadFeatured() {
            try {
                setLoading(true);
                const res = await api.get("/api/motorcycles/featured", {
                    params: { limit: 20 }
                });

                const list = res.data?.data ?? res.data;
                setFeatured(list);
            } catch (e) {
                setError(e?.response?.data?.message || e.message);
            } finally {
                setLoading(false);
            }
        }

        loadFeatured();
    }, []);

    return (
        <section className="w-full">
            <h2 className="text-center text-[22px] font-bold uppercase tracking-wide text-gray-500">
                Sản phẩm nổi bật
            </h2>

            <div className="mt-8">
                {loading && <div className="text-center text-gray-500">Đang tải...</div>}
                {error && <div className="text-center text-red-500">{error}</div>}

                {!loading && !error && featured.length > 0 && (
                    <Swiper
                        modules={[Navigation]}
                        navigation
                        spaceBetween={30}
                        slidesPerView={1}
                        breakpoints={{
                            640: { slidesPerView: 2 },
                            1024: { slidesPerView: 4 },
                            1280: { slidesPerView: 5 }
                        }}
                        loop={featured.length > 5}
                    >
                        {featured.map((m) => (
                            <SwiperSlide key={m.id}>
                                <div className="bg-white rounded-3xl flex flex-col items-center text-center py-6 px-4 hover:shadow-md transition cursor-pointer">
                                    <div className="w-full h-52 flex items-center justify-center mb-4">
                                        <img
                                            src={getMotoImage(m)}
                                            alt={m.name}
                                            className="max-h-full max-w-full object-contain"
                                        />
                                    </div>

                                    <div className="text-sm font-medium text-gray-500 line-clamp-2">
                                        {m.name}
                                    </div>

                                    {m.price && (
                                        <div className="mt-2 text-base font-semibold text-blue-600">
                                            {m.price.toLocaleString("vi-VN")} ₫
                                        </div>
                                    )}
                                    <button
                                        onClick={async () => {
                                            try {
                                                await addCartItem({ motorcycle_id: m.id, qty: 1 });
                                                alert("Đã thêm vào giỏ hàng!");
                                            } catch (e) {
                                                alert(e?.response?.data?.message || "Không thể thêm vào giỏ");
                                            }
                                        }}
                                        className="
        mt-3 px-4 py-2
        bg-gray-600 
        text-white 
        text-sm 
        font-semibold
        rounded-lg 
        hover:bg-black
        transition
    "
                                    >
                                        THÊM VÀO GIỎ HÀNG
                                    </button>
                                </div>
                            </SwiperSlide>
                        ))}
                    </Swiper>
                )}
            </div>
        </section>
    );
}
