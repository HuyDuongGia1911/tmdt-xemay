// import { useState } from 'react'
// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
// import './App.css'

// function App() {
//   const [count, setCount] = useState(0)

//   return (
//     <>
//       <div className="min-h-screen bg-gray-50 p-6">
//         <h1 className="text-2xl font-bold text-red-600">Tailwind OK</h1>
//         <p className="mt-2 text-gray-600">Chữ này dùng utility Tailwind.</p>
//       </div>
//       <div>
//         <a href="https://vite.dev" target="_blank">
//           <img src={viteLogo} className="logo" alt="Vite logo" />
//         </a>
//         <a href="https://react.dev" target="_blank">
//           <img src={reactLogo} className="logo react" alt="React logo" />
//         </a>
//       </div>
//       <h1>Vite + React</h1>
//       <div className="card">
//         <button onClick={() => setCount((count) => count + 1)}>
//           count is {count}
//         </button>
//         <p>
//           Edit <code>src/App.jsx</code> and save to test HMR
//         </p>
//       </div>
//       <p className="read-the-docs">
//         Click on the Vite and React logos to learn more
//       </p>
//     </>
//   )
// }

// export default App


import { Routes, Route } from 'react-router-dom'
import MainLayout from './layouts/MainLayout'
import Home from './pages/Home'
import NotFound from './pages/NotFound'

import Login from './pages/Login'       // <-- thêm
import Register from './pages/Register' // <-- thêm
import Profile from './pages/Profile'   // <-- thêm

import ProtectedRoute from './components/ProtectedRoute' // <-- thêm
import RoleRoute from './components/RoleRoute'           // <-- thêm
import Catalog from './pages/Catalog'
import MotorcycleDetail from './pages/MotorcycleDetail'
import CartPage from './pages/Cart/CartPage'
import CheckoutPage from './pages/Checkout/CheckoutPage'
import PaymentResult from './pages/PaymentResult'
function Protected({ children, role }) {
  const { user, loading } = useAuth()
  if (loading) return <div className="p-6">Đang tải...</div>
  if (!user) return <Navigate to="/login" replace />
  if (role && user.role !== role) return <Navigate to="/" replace />
  return children
}
export default function App() {
  return (
    <MainLayout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/catalog" element={<Catalog />} />
        <Route path="/motorcycles/:slug" element={<MotorcycleDetail />} />
        {/* Auth pages (public) */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Chỉ cần đăng nhập */}
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />

        {/* Buyer: Giỏ hàng */}
        <Route
          path="/cart"
          element={
            <RoleRoute roles={['buyer']}>
              <CartPage />
            </RoleRoute>
          }
        />

        {/* Buyer: Checkout */}
        <Route
          path="/checkout"
          element={
            <RoleRoute roles={['buyer']}>
              <CheckoutPage />
            </RoleRoute>
          }
        />

        {/* Buyer: Xem kết quả thanh toán */}
        <Route
          path="/payment-result"
          element={
            <RoleRoute roles={['buyer']}>
              <PaymentResult />
            </RoleRoute>
          }
        />

        {/* Ví dụ route cho seller hoặc admin */}
        <Route
          path="/dashboard"
          element={
            <RoleRoute roles={['seller', 'admin']}>
              <div className="bg-white p-6 rounded-xl shadow">Dashboard Seller/Admin</div>
            </RoleRoute>
          }
        />

        <Route path="*" element={<NotFound />} />
      </Routes>
    </MainLayout>
  )
}

