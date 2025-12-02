import { Link, NavLink } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

import { FaUser, FaShoppingCart } from "react-icons/fa";
import { FiLogOut } from "react-icons/fi";
import { RxExit } from "react-icons/rx";
export default function Navbar() {
    const { user, logout } = useAuth();

    const displayName = user ? user.name.toUpperCase() : "KHÁCH";

    const iconBlock = `
    group
    w-12 h-12 flex items-center justify-center 
    rounded-lg cursor-pointer 
    bg-[#404950] 
    text-white 
    hover:bg-white
    transition
`;
    const iconBlockClass = `
    group
    w-12 h-12 flex items-center justify-center 
    rounded-lg cursor-pointer 
    bg-[#404950]
    text-white 
    hover:bg-white
    transition
`;

    return (
        <header className="bg-[#404950] shadow-lg border-b border-black/20">
            <div className="relative w-full max-w-[1600px] mx-auto h-24 px-10 flex items-center text-white">

                {/* LEFT — GREETING */}
                <div className="text-lg font-bold tracking-wide flex-1">
                    XIN CHÀO, {displayName}
                </div>

                {/* CENTER — LOGO */}
                <Link
                    to="/"
                    className="
                        absolute left-1/2 top-1/2 
                        -translate-x-1/2 -translate-y-1/2
                        flex items-center gap-4 select-none
                    "
                >
                    <div className="h-20 w-20 overflow-hidden flex items-center justify-center">
                        <img
                            src="/logo.png"
                            alt="logo"
                            className="h-full w-full object-cover scale-[1.85]"
                        />
                    </div>

                    <div className="leading-tight text-left">
                        <div className="text-3xl font-extrabold text-white tracking-wide">
                            XE MÁY
                        </div>
                        <div className="text-xl font-bold text-gray-300 tracking-wide">
                            GIA HU
                        </div>
                    </div>
                </Link>

                {/* RIGHT — ICONS */}
                <div className="flex items-center gap-4 text-lg flex-1 justify-end">

                    {/* PROFILE */}
                    <NavLink to={user ? "/profile" : "/login"} className={iconBlock}>
                        <FaUser className="text-2xl group-hover:text-[#404950]" />
                    </NavLink>

                    {/* CART */}
                    <NavLink to="/cart" className={iconBlock}>
                        <FaShoppingCart className="text-2xl group-hover:text-[#404950]" />
                    </NavLink>

                    {/* LOGOUT */}
                    {user && (
                        <button
                            onClick={logout}
                            className={iconBlockClass + " !p-0 !m-0 !border-0 !outline-none"}
                        >
                            <RxExit className="text-2xl group-hover:text-[#404950]" />
                        </button>

                    )}
                    {/* DASHBOARD */}
                    {(user?.role === "seller" || user?.role === "admin") && (
                        <NavLink
                            to={user.role === "admin" ? "/dashboard/admin" : "/dashboard/seller"}
                            className="
                                bg-white text-black font-semibold 
                                px-5 py-2 rounded-lg 
                                text-base 
                                hover:bg-gray-200 
                                transition
                            "
                        >
                            Dashboard
                        </NavLink>
                    )}


                </div>
            </div>
        </header>
    );
}
