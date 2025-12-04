import { Bike, Phone, Mail, MapPin, Send, Clock } from "lucide-react";
import { useState } from "react";
import { FaTruckLoading } from "react-icons/fa";
import api from "../lib/axios";
export default function Contact() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            await api.post("/api/contact", {
                name,
                email,
                message
            });

            alert("🎉 Gửi liên hệ thành công! Chúng tôi sẽ phản hồi sớm nhất.");

            // Reset form
            setName("");
            setEmail("");
            setMessage("");
        } catch (error) {
            console.error(error);
            alert("❌ Có lỗi xảy ra, vui lòng thử lại!");
        } finally {
            setLoading(false);
        }
    };


    return (
        <div className="w-full">

            {/* ================= HERO ================= */}
            <div
                className="w-full h-[320px] bg-cover bg-center relative"
                style={{
                    backgroundImage:
                        "url('https://images.wallpaperscraft.com/image/single/motorcyclist_bike_motorcycle_188065_1600x900.jpg"
                }}
            >
                {/* Overlay đậm */}
                <div className="absolute inset-0 bg-black/60"></div>

                {/* Thêm padding top lớn hơn để tránh header đè lên */}
                <div className="absolute inset-0 flex flex-col items-center justify-center text-white pt-36">
                    <h1 className="text-4xl font-extrabold drop-shadow-2xl">
                        Liên Hệ Chúng Tôi
                    </h1>
                    <p className="mt-2 text-lg opacity-100 drop-shadow-lg">
                        Hỗ trợ nhanh chóng – Tư vấn tận tâm
                    </p>
                </div>
            </div>


            {/* ================= CONTACT CONTENT ================= */}
            <div className="max-w-6xl mx-auto px-6 py-16 grid md:grid-cols-2 gap-20">

                {/* ================= INFORMATION ================= */}
                <div className="space-y-6">
                    <h2 className="text-3xl font-bold">XE MÁY GIA HU</h2>
                    <p className="text-gray-600 leading-relaxed">
                        Nếu bạn có bất kỳ thắc mắc nào về sản phẩm, chính sách hoặc dịch vụ,
                        đừng ngần ngại liên hệ với chúng tôi. Đội ngũ tư vấn luôn sẵn sàng hỗ trợ.
                    </p>

                    <div className="space-y-4 text-gray-700 text-lg">
                        <p className="flex items-center gap-3">
                            <Phone className="text-blue-500" /> 0123 456 789
                        </p>
                        <p className="flex items-center gap-3">
                            <Mail className="text-blue-500" /> contact@xemayshop.com
                        </p>
                        <p className="flex items-center gap-3">
                            <MapPin className="text-blue-500" /> 123 Đường ABC, TP.HCM
                        </p>
                        <p className="flex items-center gap-3">
                            <Clock className="text-blue-500" /> 08:00 – 21:00 (Hằng ngày)
                        </p>
                    </div>

                    {/* MAP */}
                    <iframe
                        className="w-full h-[260px] rounded-2xl shadow"
                        src="https://maps.google.com/maps?q=Ho%20Chi%20Minh&t=&z=13&ie=UTF8&iwloc=&output=embed"
                        style={{ border: 0 }}
                        allowFullScreen=""
                        loading="lazy"
                    ></iframe>
                </div>


                {/* ================= CONTACT FORM ================= */}
                <div className="bg-white shadow-lg p-10 rounded-2xl">
                    <h3 className="text-2xl font-bold mb-6">Gửi tin nhắn cho chúng tôi</h3>

                    <form className="space-y-5" onSubmit={handleSubmit}>

                        {/* Họ và tên */}
                        <div>
                            <label className="block mb-1 font-medium text-gray-700">Họ và tên</label>
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="w-full border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Nhập họ tên của bạn"
                                required
                            />
                        </div>

                        {/* Email */}
                        <div>
                            <label className="block mb-1 font-medium text-gray-700">Email</label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="you@example.com"
                                required
                            />
                        </div>

                        {/* Tin nhắn */}
                        <div>
                            <label className="block mb-1 font-medium text-gray-700">Tin nhắn</label>
                            <textarea
                                rows="4"
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                className="w-full border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Nội dung cần hỗ trợ..."
                                required
                            ></textarea>
                        </div>

                        {/* Submit */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="
                    w-full bg-blue-500 hover:bg-blue-600 
                    text-white font-bold text-lg 
                    rounded-xl py-3 transition flex 
                    items-center justify-center gap-2
                    disabled:opacity-60 disabled:cursor-not-allowed
                "
                        >
                            <Send size={20} />
                            {loading ? "Đang gửi..." : "Gửi Tin Nhắn"}
                        </button>
                    </form>
                </div>

            </div>
        </div>
    );
}
