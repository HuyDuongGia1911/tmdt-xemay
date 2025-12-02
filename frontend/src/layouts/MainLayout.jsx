import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { NavLink } from 'react-router-dom'

export default function MainLayout({ children, wide = false }) {
    return (
        <div className="min-h-screen bg-gray-50">

            {/* NAVBAR CHÍNH */}
            <Navbar />

            {/* MENU THỨ 2 GIỐNG MẪU MOTORCYCLE */}
            <nav
                className="
        bg-white 
        border-b border-gray-200 
        shadow-sm
        flex justify-center 
        gap-10 
        py-4 
    "
            >
                {[
                    { to: "/", label: "TRANG CHỦ" },
                    { to: "/catalog", label: "SẢN PHẨM" },
                    { to: "/about", label: "THÔNG TIN" },
                    { to: "/contact", label: "LIÊN HỆ" }
                ].map(item => (
                    <NavLink
                        key={item.to}
                        to={item.to}
                        end={item.to === "/"}
                        className={({ isActive }) =>
                            `
                text-lg
                font-bold
                transition
                ${isActive
                                ? "text-black font-bold"
                                : "text-gray-500 hover:text-black"
                            }
            `
                        }
                    >
                        {item.label}
                    </NavLink>
                ))}
            </nav>



            {/* NỘI DUNG TRANG */}
            <main className={wide ? "w-full px-4 py-6" : "max-w-6xl mx-auto px-4 py-6"}>
                {children}
            </main>

            {/* FOOTER */}
            <Footer />

        </div>
    )
}
