import { Link } from 'react-router-dom'

export default function CartSummary({ subtotal }) {
    return (
        <div className="bg-white p-4 rounded-xl shadow-sm">
            <div className="flex items-center justify-between">
                <div className="text-gray-600">Tạm tính</div>
                <div className="text-lg font-semibold">{subtotal.toLocaleString()} đ</div>
            </div>
            <Link to="/checkout" className="mt-4 block text-center bg-black text-white py-2 rounded-lg">
                Tiến hành đặt hàng
            </Link>
        </div>
    )
}
