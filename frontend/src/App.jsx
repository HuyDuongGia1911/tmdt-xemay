import { Routes, Route } from 'react-router-dom'
import MainLayout from './layouts/MainLayout'
import Home from './pages/Home'
import NotFound from './pages/NotFound'

import Login from './pages/Login'
import Register from './pages/Register'
import Profile from './pages/Profile'

import ProtectedRoute from './components/ProtectedRoute'
import RoleRoute from './components/RoleRoute'

import Catalog from './pages/Catalog'
import MotorcycleDetail from './pages/MotorcycleDetail'
import CartPage from './pages/Cart/CartPage'
import CheckoutPage from './pages/Checkout/CheckoutPage'
import PaymentResult from './pages/PaymentResult'

import SellerOverview from "./components/dashboard/seller/Overview"
import SellerOrders from "./components/dashboard/seller/Orders"
import SellerProducts from "./components/dashboard/seller/Products"

import AdminOverview from "./components/dashboard/admin/Overview"
import AdminOrders from './components/dashboard/admin/Orders'
import AdminUsers from './components/dashboard/admin/Users'
import AdminPayments from './components/dashboard/admin/Payments'

import SellerSetup from './components/dashboard/seller/SellerSetup'
import RequireSeller from './components/RequireSeller'
import SellerProfile from './components/dashboard/seller/SellerProfile'
export default function App() {
  return (
    <Routes>
      {/* HOME — FULL WIDTH */}
      <Route
        path="/"
        element={
          <MainLayout wide>
            <Home />
          </MainLayout>
        }
      />

      {/* CATALOG / PRODUCT — GIỚI HẠN WIDTH */}
      <Route
        path="/catalog"
        element={
          <MainLayout>
            <Catalog />
          </MainLayout>
        }
      />

      <Route
        path="/motorcycles/:slug"
        element={
          <MainLayout>
            <MotorcycleDetail />
          </MainLayout>
        }
      />

      {/* AUTH */}
      <Route
        path="/login"
        element={
          <MainLayout>
            <Login />
          </MainLayout>
        }
      />

      <Route
        path="/register"
        element={
          <MainLayout>
            <Register />
          </MainLayout>
        }
      />

      {/* PROFILE */}
      <Route
        path="/profile"
        element={
          <MainLayout>
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          </MainLayout>
        }
      />

      {/* CART / CHECKOUT */}
      <Route
        path="/cart"
        element={
          <MainLayout>
            <RoleRoute roles={['buyer']}>
              <CartPage />
            </RoleRoute>
          </MainLayout>
        }
      />

      <Route
        path="/checkout"
        element={
          <MainLayout>
            <RoleRoute roles={['buyer']}>
              <CheckoutPage />
            </RoleRoute>
          </MainLayout>
        }
      />

      <Route
        path="/payment-result"
        element={
          <MainLayout>
            <RoleRoute roles={['buyer']}>
              <PaymentResult />
            </RoleRoute>
          </MainLayout>
        }
      />

      {/* SELLER DASHBOARD */}
      <Route
        path="/dashboard/seller"
        element={
          <MainLayout>
            <RoleRoute roles={['seller', 'admin']}>
              <RequireSeller>
                <SellerOverview />
              </RequireSeller>
            </RoleRoute>
          </MainLayout>
        }
      />


      <Route
        path="/dashboard/seller/orders"
        element={
          <MainLayout>
            <RoleRoute roles={['seller', 'admin']}>
              <RequireSeller>
                <SellerOrders />
              </RequireSeller>
            </RoleRoute>
          </MainLayout>
        }
      />

      <Route
        path="/dashboard/seller/products"
        element={
          <MainLayout>
            <RoleRoute roles={['seller', 'admin']}>
              <RequireSeller>
                <SellerProducts />
              </RequireSeller>
            </RoleRoute>
          </MainLayout>
        }
      />

      <Route
        path="/dashboard/seller/profile"
        element={
          <MainLayout>
            <RoleRoute roles={['seller', 'admin']}>
              <RequireSeller>
                <SellerProfile />
              </RequireSeller>
            </RoleRoute>
          </MainLayout>
        }
      />
      {/* ADMIN DASHBOARD */}
      <Route
        path="/dashboard/admin"
        element={
          <MainLayout>
            <RoleRoute roles={['admin']}>
              <AdminOverview />
            </RoleRoute>
          </MainLayout>
        }
      />

      <Route
        path="/dashboard/admin/orders"
        element={
          <MainLayout>
            <RoleRoute roles={['admin']}>
              <AdminOrders />
            </RoleRoute>
          </MainLayout>
        }
      />

      <Route
        path="/dashboard/admin/users"
        element={
          <MainLayout>
            <RoleRoute roles={['admin']}>
              <AdminUsers />
            </RoleRoute>
          </MainLayout>
        }
      />

      <Route
        path="/dashboard/admin/payments"
        element={
          <MainLayout>
            <RoleRoute roles={['admin']}>
              <AdminPayments />
            </RoleRoute>
          </MainLayout>
        }
      />
      {/* SELLER SETUP — KHÔNG REQUIRE SELLER */}
      <Route
        path="/dashboard/seller/setup"
        element={
          <MainLayout>
            <ProtectedRoute>
              <SellerSetup />
            </ProtectedRoute>
          </MainLayout>
        }
      />
      {/* 404 */}
      <Route
        path="*"
        element={
          <MainLayout>
            <NotFound />
          </MainLayout>
        }
      />
    </Routes>
  )
}
