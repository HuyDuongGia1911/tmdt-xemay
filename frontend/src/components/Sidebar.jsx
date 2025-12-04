import React, { useEffect, useState } from "react";
import api from "../lib/axios";
import { useSearchParams } from "react-router-dom";

export default function Sidebar() {
    const [categories, setCategories] = useState([]);
    const [brands, setBrands] = useState([]);

    const [searchParams, setSearchParams] = useSearchParams();

    const activeCategory = searchParams.get("category_id") || "";
    const activeBrand = searchParams.get("brand_id") || "";

    useEffect(() => {
        loadData();
    }, []);

    async function loadData() {
        try {
            const c = await api.get("/api/categories");
            setCategories(c.data?.data || c.data);

            const b = await api.get("/api/brands");
            setBrands(b.data?.data || b.data);
        } catch (err) {
            console.error("Sidebar load error:", err);
        }
    }

    function setCategory(id) {
        const next = new URLSearchParams(searchParams);

        if (id === "all") {
            next.delete("category_id");
        } else {
            next.set("category_id", id);
        }
        next.set("page", "1");
        setSearchParams(next);
    }

    function setBrand(id) {
        const next = new URLSearchParams(searchParams);

        if (id === "all") {
            next.delete("brand_id");
        } else {
            next.set("brand_id", id);
        }
        next.set("page", "1");
        setSearchParams(next);
    }

    return (
        <div className="flex flex-col gap-6">

            {/* COLLECTION */}
            <div className="bg-white p-4 rounded-xl shadow border border-gray-200">
                <h2 className="text-xl font-semibold mb-4">Danh mục</h2>

                <ul className="space-y-2">
                    {/* ALL */}
                    <li
                        className={`cursor-pointer ${activeCategory === "" ? "font-bold text-black" : "text-gray-700"
                            }`}
                        onClick={() => setCategory("all")}
                    >
                        Tất cả
                    </li>

                    {categories.map((c) => (
                        <li
                            key={c.id}
                            className={`cursor-pointer ${activeCategory == c.id
                                    ? "font-bold text-black"
                                    : "text-gray-700"
                                }`}
                            onClick={() => setCategory(c.id)}
                        >
                            {c.name}
                        </li>
                    ))}
                </ul>
            </div>

            {/* BRANDS */}
            <div className="bg-white p-4 rounded-xl shadow border border-gray-200">
                <h2 className="text-xl font-semibold mb-4">Hãng xe</h2>

                <ul className="space-y-2">
                    {/* ALL */}
                    <li
                        className={`cursor-pointer ${activeBrand === "" ? "font-bold text-black" : "text-gray-700"
                            }`}
                        onClick={() => setBrand("all")}
                    >
                        Tất cả
                    </li>

                    {brands.map((b) => (
                        <li
                            key={b.id}
                            className={`cursor-pointer ${activeBrand == b.id
                                    ? "font-bold text-black"
                                    : "text-gray-700"
                                }`}
                            onClick={() => setBrand(b.id)}
                        >
                            {b.name}
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}
