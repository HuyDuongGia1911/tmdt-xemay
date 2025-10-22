import { Link, NavLink } from 'react-router-dom'

export default function Navbar() {
    const navItemClass = ({ isActive }) =>
        "px-3 py-2 rounded-lg text-sm font-medium " +
        (isActive ? "bg-gray-900 text-white" : "text-gray-700 hover:bg-gray-200")

    return (
        <header className="bg-white shadow">
            <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
                <Link to="/" className="font-bold text-lg">Xe Máy Shop</Link>
                <nav className="flex items-center gap-2">
                    <NavLink to="/" className={navItemClass} end>Trang chủ</NavLink>
                </nav>
            </div>
        </header>
    )
}
