export default function CheckoutForm({ value, onChange, onSubmit, submitting }) {
    const v = value
    function handleField(path, val) {
        const next = { ...v }
        const [a, b] = path.split('.')
        if (b) next[a] = { ...(next[a] || {}), [b]: val }
        else next[a] = val
        onChange(next)
    }
    return (
        <form onSubmit={(e) => { e.preventDefault(); onSubmit() }} className="space-y-3 bg-white p-4 rounded-xl">
            <div className="font-semibold">Địa chỉ giao hàng</div>
            <div className="grid md:grid-cols-2 gap-3">
                <input className="border rounded px-3 py-2" placeholder="Họ tên" value={v.address.full_name}
                    onChange={(e) => handleField('address.full_name', e.target.value)} required />
                <input className="border rounded px-3 py-2" placeholder="Số điện thoại" value={v.address.phone}
                    onChange={(e) => handleField('address.phone', e.target.value)} required />
                <input className="border rounded px-3 py-2 md:col-span-2" placeholder="Địa chỉ" value={v.address.line1}
                    onChange={(e) => handleField('address.line1', e.target.value)} required />
                <input className="border rounded px-3 py-2" placeholder="Phường/Xã" value={v.address.line2}
                    onChange={(e) => handleField('address.line2', e.target.value)} />
                <input className="border rounded px-3 py-2" placeholder="Quận/Huyện" value={v.address.district}
                    onChange={(e) => handleField('address.district', e.target.value)} />
                <input className="border rounded px-3 py-2" placeholder="Tỉnh/Thành phố" value={v.address.city}
                    onChange={(e) => handleField('address.city', e.target.value)} required />
                <input className="border rounded px-3 py-2" placeholder="Mã bưu chính" value={v.address.postal_code}
                    onChange={(e) => handleField('address.postal_code', e.target.value)} />
            </div>

            <div className="pt-2 font-semibold">Phương thức thanh toán</div>
            <div className="flex items-center gap-4">
                <label className="flex items-center gap-2">
                    <input type="radio" name="pm" value="momo" checked={v.payment_method === 'momo'}
                        onChange={() => handleField('payment_method', 'momo')} /> MoMo
                </label>
                <label className="flex items-center gap-2">
                    <input type="radio" name="pm" value="vnpay" checked={v.payment_method === 'vnpay'}
                        onChange={() => handleField('payment_method', 'vnpay')} /> VNPAY
                </label>
            </div>

            <button disabled={submitting} className="mt-3 w-full bg-black text-white py-2 rounded-lg">
                {submitting ? 'Đang xử lý...' : 'Đặt hàng & Thanh toán'}
            </button>
        </form>
    )
}
