import { useEffect, useState } from "react"
import { useSearchParams, Link } from "react-router-dom"
import { getOrder } from "../api/order"

export default function PaymentResult() {
    const [params] = useSearchParams()

    const orderId = params.get("extraData")
    const resultCode = params.get("resultCode")
    const message = params.get("message")

    const [loading, setLoading] = useState(true)
    const [order, setOrder] = useState(null)
    const [error, setError] = useState("")

    useEffect(() => {
        async function load() {
            if (!orderId) {
                setError("Không tìm thấy OrderID trong đường dẫn.")
                setLoading(false)
                return
            }

            try {
                const o = await getOrder(orderId)
                setOrder(o)
            } catch (e) {
                setError(e?.response?.data?.message || "Không thể tải đơn hàng.")
            }
            setLoading(false)
        }

        load()
    }, [orderId])

    if (loading) {
        return (
            <div className="max-w-xl mx-auto bg-white p-8 rounded-xl shadow text-center">
                <div>Đang tải kết quả thanh toán...</div>
            </div>
        )
    }

    if (!orderId) {
        return (
            <div className="max-w-xl mx-auto bg-white p-8 rounded-xl shadow text-center">
                <div className="text-red-600 font-semibold">Thiếu thông tin thanh toán.</div>
                <Link to="/" className="mt-4 inline-block text-blue-600 hover:underline">
                    Về trang chủ
                </Link>
            </div>
        )
    }

    const isSuccess = resultCode === "0"

    return (
        <div className="max-w-xl mx-auto bg-white p-8 rounded-xl shadow text-center space-y-6">
            {/* ICON STATUS */}
            <div className="flex justify-center">
                {isSuccess ? (
                    <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-4xl">
                        ✓
                    </div>
                ) : (
                    <div className="w-20 h-20 bg-red-100 text-red-600 rounded-full flex items-center justify-center text-4xl">
                        ✕
                    </div>
                )}
            </div>

            {/* TITLE */}
            <h1 className="text-2xl font-bold">
                {isSuccess ? "Thanh toán thành công!" : "Thanh toán thất bại"}
            </h1>

            {/* MESSAGE */}
            <p className="text-gray-600">{message}</p>

            {/* INFO */}
            {order && (
                <div className="text-left space-y-2 bg-gray-50 p-4 rounded-xl border">
                    <div>Mã đơn: <b>{order.code}</b></div>
                    <div>Trạng thái đơn: <b>{order.status}</b></div>
                    <div>Thanh toán: <b>{order.payment_status}</b></div>
                    <div>Tổng tiền: <b>{Number(order.total_amount).toLocaleString()} đ</b></div>
                </div>
            )}

            {/* BUTTONS */}
            <div className="flex justify-center gap-4 mt-4">
                {order && (
                    <Link
                        to={`/orders/${order.id}`}
                        className="px-5 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition"
                    >
                        Xem đơn hàng
                    </Link>
                )}

                <Link
                    to="/"
                    className="px-5 py-3 bg-gray-200 rounded-xl font-semibold hover:bg-gray-300 transition"
                >
                    Về trang chủ
                </Link>
            </div>
        </div>
    )
}
