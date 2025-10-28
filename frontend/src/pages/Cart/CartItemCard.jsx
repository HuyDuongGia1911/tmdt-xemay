export default function CartItemCard({ item, onUpdateQty, onRemove }) {
    const { motorcycle, qty, unit_price, subtotal } = item
    return (
        <div className="flex items-center justify-between bg-white p-4 rounded-xl shadow-sm">
            <div>
                <div className="font-medium">{motorcycle.name}</div>
                <div className="text-sm text-gray-500">Đơn giá: {unit_price.toLocaleString()} đ</div>
            </div>
            <div className="flex items-center gap-2">
                <button className="px-3 py-1 bg-gray-200 rounded"
                    onClick={() => onUpdateQty(item.id, Math.max(1, qty - 1))}>-</button>
                <input
                    type="number"
                    className="w-16 border rounded px-2 py-1"
                    value={qty}
                    min={1}
                    onChange={(e) => onUpdateQty(item.id, Math.max(1, parseInt(e.target.value || '1', 10)))}
                />
                <button className="px-3 py-1 bg-gray-200 rounded"
                    onClick={() => onUpdateQty(item.id, qty + 1)}>+</button>
                <div className="w-36 text-right font-semibold">{subtotal.toLocaleString()} đ</div>
                <button className="ml-3 px-3 py-1 bg-red-600 text-white rounded"
                    onClick={() => onRemove(item.id)}>Xoá</button>
            </div>
        </div>
    )
}
