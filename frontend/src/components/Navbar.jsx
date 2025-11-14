import { Link, NavLink } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

export default function Navbar() {
    const { user, logout } = useAuth()

    const navItemClass = ({ isActive }) =>
        "px-3 py-2 rounded-lg text-sm font-medium " +
        (isActive ? "bg-gray-900 text-white" : "text-gray-700 hover:bg-gray-200")

    return (
        <header className="bg-white shadow">
            <div className="w-full px-4 h-14 flex items-center justify-between">
                <Link to="/" className="font-bold text-lg">Xe Máy Shop</Link>

                <nav className="flex items-center gap-2">
                    <NavLink to="/" className={navItemClass} end>Trang chủ</NavLink>
                    <NavLink to="/catalog" className={navItemClass}>Catalog</NavLink>
                    <NavLink to="/cart" className={navItemClass}>Giỏ hàng</NavLink>
                    {/* Nếu đã đăng nhập */}
                    {user ? (
                        <>
                            <NavLink to="/profile" className={navItemClass}>Hồ sơ</NavLink>

                            {/* Chỉ seller/admin mới thấy Dashboard */}
                            {(user.role === 'seller' || user.role === 'admin') && (
                                <NavLink to="/dashboard" className={navItemClass}>Dashboard</NavLink>
                            )}

                            <button
                                onClick={logout}
                                className="px-3 py-2 rounded-lg text-sm font-medium bg-red-600 text-white"
                            >
                                Đăng xuất
                            </button>
                        </>
                    ) : (
                        <>

                            <NavLink to="/login" className={navItemClass}>Đăng nhập</NavLink>
                            <NavLink to="/register" className={navItemClass}>Đăng ký</NavLink>

                        </>
                    )}
                </nav>
            </div>
        </header>
    )
}
