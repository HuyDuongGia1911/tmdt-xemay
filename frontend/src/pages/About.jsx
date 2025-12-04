import {
    Bike,
    Phone,
    Mail,
    MapPin,
    ShieldCheck,
    Star,
    HeartHandshake,
} from "lucide-react";

export default function About() {
    return (
        <div className="w-full">

            {/* ================= HERO ================= */}
            <div
                className="w-full h-[300px] bg-cover bg-center relative"
                style={{
                    backgroundImage:
                        "url('https://images.wallpaperscraft.com/image/single/motorcyclist_biker_helmet_193993_1600x900.jpg')",
                }}
            >
                <div className="absolute inset-0 bg-black/40"></div>

                <div className="absolute inset-0 flex flex-col items-center justify-center text-white text-center px-4">
                    <h1 className="text-4xl font-extrabold drop-shadow-lg">
                        THÔNG TIN VỀ CHÚNG TÔI
                    </h1>
                    <p className="mt-2 text-lg opacity-90">
                        XE MÁY GIA HU – UY TÍN TẠO NÊN THƯƠNG HIỆU
                    </p>
                </div>
            </div>

            {/* ================= GIỚI THIỆU FULL WIDTH ================= */}
            <div className="w-full py-10 bg-gray-50">

                {/* Card full width nhưng vẫn đẹp */}
                <div className="
        w-[100%] md:w-[95%] mx-auto 
        bg-white rounded-3xl shadow-2xl overflow-hidden 
        grid md:grid-cols-2
    ">

                    {/* LEFT TEXT */}
                    <div className="p-20 flex flex-col justify-center">
                        <h2 className="text-4xl font-extrabold text-gray-800 mb-4">
                            XE MÁY GIA HU
                        </h2>

                        <p className="text-gray-600 leading-relaxed text-lg">
                            Chúng tôi tự hào mang đến cho khách hàng những mẫu xe máy
                            chất lượng, giá cả minh bạch và dịch vụ tận tâm. Với nhiều
                            năm kinh nghiệm trong lĩnh vực mua bán xe máy trên khắp đất nước, xe máy GIA HU luôn đặt
                            <strong> “Uy tín – Chất lượng – Hài lòng” </strong>
                            lên hàng đầu.
                        </p>
                    </div>

                    {/* RIGHT IMAGE */}
                    <div className="h-full">
                        <img
                            src="https://theme158-motorcycle.myshopify.com/cdn/shop/t/4/assets/slide3_image.jpg?v=180781110525084404771662036860"
                            className="w-full h-full object-cover"
                            alt="Xe máy"
                        />
                    </div>

                </div>
            </div>


            {/* ================= STATS ================= */}
            <div className="bg-white py-12">
                <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-10 text-center px-6">

                    <div>
                        <h3 className="text-4xl font-extrabold text-blue-600">10+</h3>
                        <p className="text-gray-600">Năm kinh nghiệm</p>
                    </div>

                    <div>
                        <h3 className="text-4xl font-extrabold text-blue-600">5000+</h3>
                        <p className="text-gray-600">Khách hàng</p>
                    </div>

                    <div>
                        <h3 className="text-4xl font-extrabold text-blue-600">800+</h3>
                        <p className="text-gray-600">Mẫu xe</p>
                    </div>

                    <div>
                        <h3 className="text-4xl font-extrabold text-blue-600">99%</h3>
                        <p className="text-gray-600">Hài lòng</p>
                    </div>

                </div>
            </div>

            {/* ================= GIÁ TRỊ CỐT LÕI ================= */}
            <div className="bg-gray-50 py-16">
                <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">
                    Giá Trị Cốt Lõi
                </h2>

                <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-3 gap-10 text-center">

                    <div className="p-6 bg-white shadow rounded-2xl">
                        <ShieldCheck size={40} className="mx-auto text-blue-500" />
                        <h3 className="text-xl font-bold mt-4">
                            Chất Lượng Hàng Đầu
                        </h3>
                        <p className="text-gray-600 mt-2">
                            Xe được kiểm định kỹ lưỡng, đảm bảo an toàn & chất lượng.
                        </p>
                    </div>

                    <div className="p-6 bg-white shadow rounded-2xl">
                        <Star size={40} className="mx-auto text-yellow-500" />
                        <h3 className="text-xl font-bold mt-4">Giá Cả Minh Bạch</h3>
                        <p className="text-gray-600 mt-2">
                            Không phí ẩn – không đội giá – luôn minh bạch.
                        </p>
                    </div>

                    <div className="p-6 bg-white shadow rounded-2xl">
                        <HeartHandshake size={40} className="mx-auto text-green-500" />
                        <h3 className="text-xl font-bold mt-4">Hỗ Trợ Tận Tâm</h3>
                        <p className="text-gray-600 mt-2">
                            Luôn đồng hành trước – trong – sau khi mua xe.
                        </p>
                    </div>

                </div>
            </div>

            {/* ================= VÌ SAO CHỌN CHÚNG TÔI (BLOCK PREMIUM) ================= */}
            <div className="w-full py-10 bg-white">

                <div className="
        w-[95%] md:w-[90%] mx-auto
        bg-white rounded-3xl shadow-2xl overflow-hidden
        grid md:grid-cols-2 gap-0
    ">

                    {/* LEFT TEXT */}
                    <div className="py-16 px-14 flex flex-col justify-center">
                        <h2 className="text-4xl font-extrabold text-gray-800 mb-8">
                            Vì Sao Chọn Chúng Tôi?
                        </h2>

                        <ul className="space-y-6 text-gray-700 text-xl">
                            <li className="flex items-start gap-4">
                                <span className="text-blue-500">
                                    <svg width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M20 6L9 17l-5-5" stroke="currentColor" strokeWidth="3" fill="none" strokeLinecap="round" />
                                    </svg>
                                </span>
                                100% xe chính hãng, nguồn gốc rõ ràng.
                            </li>

                            <li className="flex items-start gap-4">
                                <span className="text-blue-500">
                                    <svg width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M20 6L9 17l-5-5" stroke="currentColor" strokeWidth="3" fill="none" strokeLinecap="round" />
                                    </svg>
                                </span>
                                Chính sách bảo hành rõ ràng & chu đáo.
                            </li>

                            <li className="flex items-start gap-4">
                                <span className="text-blue-500">
                                    <svg width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M20 6L9 17l-5-5" stroke="currentColor" strokeWidth="3" fill="none" strokeLinecap="round" />
                                    </svg>
                                </span>
                                Giao xe tận nơi trên toàn quốc.
                            </li>

                            <li className="flex items-start gap-4">
                                <span className="text-blue-500">
                                    <svg width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M20 6L9 17l-5-5" stroke="currentColor" strokeWidth="3" fill="none" strokeLinecap="round" />
                                    </svg>
                                </span>
                                Hỗ trợ trả góp với nhiều ngân hàng liên kết.
                            </li>
                        </ul>
                    </div>

                    {/* RIGHT IMAGE */}
                    <div className="h-full">
                        <img
                            src="/why-choose-us.png"
                            className="w-full h-full object-cover"
                            alt="why choose us"
                        />
                    </div>

                </div>

            </div>

            {/* ================= LIÊN HỆ NHANH ================= */}
            <div className="bg-gray-50 py-16">
                <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row gap-10">

                    <div className="flex-1 bg-white p-8 rounded-2xl shadow">
                        <h3 className="text-2xl font-bold mb-6 flex items-center gap-2">
                            <Bike className="text-blue-500" /> Xe Máy GIA HU
                        </h3>

                        <p className="text-gray-600 mb-6">
                            Nơi bạn tìm thấy những mẫu xe chất lượng với giá tốt nhất.
                        </p>

                        <div className="space-y-4 text-gray-700">
                            <p className="flex items-center gap-3">
                                <Phone className="text-blue-500" /> 0123 456 789
                            </p>
                            <p className="flex items-center gap-3">
                                <Mail className="text-blue-500" /> contact@xemayshop.com
                            </p>
                            <p className="flex items-center gap-3">
                                <MapPin className="text-blue-500" /> 123 Đường ABC, TP.HCM
                            </p>
                        </div>
                    </div>

                    <div className="flex-1">
                        <iframe
                            className="w-full h-full min-h-[300px] rounded-2xl shadow"
                            src="https://maps.google.com/maps?q=Ho%20Chi%20Minh&t=&z=13&ie=UTF8&iwloc=&output=embed"
                            style={{ border: 0 }}
                            allowFullScreen=""
                            loading="lazy"
                        ></iframe>
                    </div>

                </div>
            </div>

        </div>
    );
}
