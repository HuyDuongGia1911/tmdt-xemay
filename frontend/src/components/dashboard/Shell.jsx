import React from 'react';
import { NavLink } from 'react-router-dom';

export default function Shell({ children }) {
    return (
        <div className="min-h-screen flex bg-gray-50">
            <aside className="w-64 bg-white border-r">
                <div className="p-4 font-bold text-xl">Dashboard</div>
                <nav className="px-2 space-y-1">
                    <div className="px-2 text-xs text-gray-500 uppercase">Seller</div>
                    <NavLink to="/dashboard/seller" className="block px-4 py-2 hover:bg-gray-100">Overview</NavLink>
                    <NavLink to="/dashboard/seller/orders" className="block px-4 py-2 hover:bg-gray-100">Orders</NavLink>
                    <NavLink to="/dashboard/seller/products" className="block px-4 py-2 hover:bg-gray-100">Products</NavLink>

                    <div className="px-2 mt-4 text-xs text-gray-500 uppercase">Admin</div>
                    <NavLink to="/dashboard/admin" className="block px-4 py-2 hover:bg-gray-100">Overview</NavLink>
                    <NavLink to="/dashboard/admin/orders" className="block px-4 py-2 hover:bg-gray-100">Orders</NavLink>
                    <NavLink to="/dashboard/admin/users" className="block px-4 py-2 hover:bg-gray-100">Users</NavLink>
                    <NavLink to="/dashboard/admin/payments" className="block px-4 py-2 hover:bg-gray-100">Payments</NavLink>
                </nav>
            </aside>
            <main className="flex-1 p-6">{children}</main>
        </div>
    );
}
