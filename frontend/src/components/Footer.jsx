import { FaMotorcycle, FaPhoneAlt, FaEnvelope, FaMapMarkerAlt } from "react-icons/fa";

export default function Footer() {
    return (
        <footer className="bg-white border-t mt-8 py-10">
            <div className="max-w-6xl mx-auto px-4 space-y-8">

                {/* ===== LOGO + TÊN SHOP ===== */}
                <div className="flex items-center gap-3">
                    <FaMotorcycle className="text-blue-600" size={32} />
                    <div>
                        <h2 className="text-xl font-bold text-gray-800">Xe Máy Shop</h2>
                        <p className="text-gray-500 text-sm">
                            Nơi mua bán xe máy chất lượng với giá tốt nhất.
                        </p>
                    </div>
                </div>

                {/* ===== THÔNG TIN LIÊN HỆ ===== */}
                <div className="space-y-3 text-gray-700">
                    <div className="flex items-center gap-2">
                        <FaPhoneAlt className="text-blue-500" />
                        <span>0123 456 789</span>
                    </div>

                    <div className="flex items-center gap-2">
                        <FaEnvelope className="text-blue-500" />
                        <span>contact@xemayshop.com</span>
                    </div>

                    <div className="flex items-center gap-2">
                        <FaMapMarkerAlt className="text-blue-500" />
                        <span>123 Đường ABC, TP.HCM</span>
                    </div>
                </div>

                {/* ===== COPYRIGHT ===== */}
                <div className="pt-4 text-center text-gray-500 text-sm border-t">
                    © {new Date().getFullYear()} Xe Máy Shop — All rights reserved.
                </div>

            </div>
        </footer>
    );
}
