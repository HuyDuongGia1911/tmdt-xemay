// import { useEffect, useState } from "react";
// import api from "../lib/axios";

// export default function HeroBanner() {
//     // 3 banner tĩnh
//     const staticBanners = [
//         "https://theme158-motorcycle.myshopify.com/cdn/shop/t/4/assets/slide1_image.jpg?v=135580589246642763421662036860",
//         "https://theme158-motorcycle.myshopify.com/cdn/shop/t/4/assets/slide2_image.jpg?v=38557209526055208911662036860",
//         "https://theme158-motorcycle.myshopify.com/cdn/shop/t/4/assets/slide3_image.jpg?v=180781110525084404771662036860"
//     ];

//     const [categoryImages, setCategoryImages] = useState([]);
//     const [motorcycleImages, setMotorcycleImages] = useState([]);
//     const [currentIndex, setCurrentIndex] = useState(0);
//     const [allSlides, setAllSlides] = useState([]);

//     // ================= LOAD CATEGORY IMAGES =================
//     useEffect(() => {
//         async function loadCategories() {
//             try {
//                 const res = await api.get("/api/categories");
//                 let list = res.data?.data ?? res.data;

//                 const imgs = list
//                     .filter(c => c.icon_url)
//                     .map(c => c.icon_url);

//                 setCategoryImages(imgs);
//             } catch (e) {
//                 console.log("Category load error", e);
//             }
//         }
//         loadCategories();
//     }, []);

//     // ================= LOAD MOTORCYCLE IMAGES =================
//     useEffect(() => {
//         async function loadMotorcycles() {
//             try {
//                 const res = await api.get("/api/motorcycles");
//                 let list = res.data?.data ?? res.data;

//                 const imgs = list
//                     .map(m =>
//                         m.thumbnail_url ||
//                         m.images?.[0]?.url ||
//                         null
//                     )
//                     .filter(Boolean);

//                 setMotorcycleImages(imgs);
//             } catch (e) {
//                 console.log("Motorcycle load error", e);
//             }
//         }
//         loadMotorcycles();
//     }, []);

//     // ================= GỘP TẤT CẢ SLIDE =================
//     useEffect(() => {
//         setAllSlides([
//             ...staticBanners,
//             ...categoryImages,
//             ...motorcycleImages
//         ]);
//     }, [categoryImages, motorcycleImages]);

//     // ================= AUTOPLAY =================
//     useEffect(() => {
//         if (allSlides.length === 0) return;

//         const timer = setInterval(() => {
//             setCurrentIndex(prev => (prev + 1) % allSlides.length);
//         }, 4000);

//         return () => clearInterval(timer);
//     }, [allSlides]);

//     if (allSlides.length === 0) {
//         return (
//             <div className="w-full h-[450px] bg-gray-200 animate-pulse rounded-2xl"></div>
//         );
//     }

//     return (
//         <div className="w-full h-[400px] relative overflow-hidden rounded-2xl shadow-xl">
//             {allSlides.map((img, i) => (
//                 <img
//                     key={i}
//                     src={img}
//                     className="
//                         absolute top-0 left-0 w-full h-full
//                         object-cover transition-opacity duration-700
//                     "
//                     style={{
//                         opacity: i === currentIndex ? 1 : 0
//                     }}
//                 />
//             ))}
//         </div>
//     );
// }



import { useEffect, useState } from "react";

export default function HeroBanner() {

    // 3 banner tĩnh (bạn thay link trực tiếp tại đây)
    const staticBanners = [
        "https://theme158-motorcycle.myshopify.com/cdn/shop/t/4/assets/slide1_image.jpg?v=...",
        "https://theme158-motorcycle.myshopify.com/cdn/shop/t/4/assets/slide2_image.jpg?v=...",
        "https://theme158-motorcycle.myshopify.com/cdn/shop/t/4/assets/slide3_image.jpg?v=180781110525084404771662036860"
    ];

    const [currentIndex, setCurrentIndex] = useState(0);

    // AUTOPLAY
    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentIndex(prev => (prev + 1) % staticBanners.length);
        }, 4000);

        return () => clearInterval(interval);
    }, []);

    return (
        <div className="w-full h-[450px] relative overflow-hidden">

            {staticBanners.map((img, i) => (
                <img
                    key={i}
                    src={img}
                    className="
                        absolute top-0 left-0 w-full h-full 
                        object-cover 
                        transition-opacity duration-700
                    "
                    style={{ opacity: i === currentIndex ? 1 : 0 }}
                />
            ))}

        </div>
    );
}
