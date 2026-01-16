import { useState, useEffect } from "react";

const QuantityModel = ({ product, updateCart, onCancel }) => {

    const [qty, setQty] = useState(product.qty || 1);

    const [mode, setMode] = useState('ADD');
    const [lowStock, setLowStock] = useState(false);

    const handleAdd = () => {
        let billProducts = JSON.parse(localStorage.getItem('Bill')) || [];

        let i = 0;
        for(i = 0; i < billProducts.length; i++) {
            if(billProducts[i].sno == product.sno) {
                billProducts[i].qty = Number(qty);
                billProducts[i].total = Number(qty) * Number(billProducts[i].sp);
                break;
            }
        }
        if(i === billProducts.length) {
            const p = {
                _id: product._id,
                sno: product.sno,
                productName: product.productName,
                currentQuantity: product.currentQuantity,
                qty: Number(qty),
                sp: product.sp,
                total: Number(qty) * Number(product.sp)
            }
            billProducts.push(p);
        }
        localStorage.setItem('Bill', JSON.stringify(billProducts));
        updateCart();
        onCancel();
    }

    useEffect(() => {
        let billProducts = JSON.parse(localStorage.getItem('Bill')) || [];

        let i = 0;
        for(i = 0; i < billProducts.length; i++) {
            if(billProducts[i].sno == product.sno) {
                setQty(Number(billProducts[i].qty));
                setMode('EDIT');
                break;
            }
        }
    }, []);

    useEffect(() => {
        if(product.currentQuantity < qty) setLowStock(true);
        else setLowStock(false);
    }, [qty]);

    return (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex justify-center items-center z-50">
        <div className="bg-white w-[90%] max-w-sm rounded-lg shadow-lg p-5 space-y-4 animate-scaleIn">
            
            <h2 className="text-lg font-semibold text-gray-800 text-center">
                {mode === 'ADD' ? 'Add' : 'Edit'} Product to Bill
            </h2>

            {/* Product info */}
            <div className="space-y-1 text-gray-700 text-sm border p-3 rounded bg-gray-50">
            <p><span className="font-semibold">Sno:</span> {product?.sno || "-"}</p>
            <p><span className="font-semibold">Name:</span> {product?.productName || "-"}</p>
            <p><span className="font-semibold">Price:</span> ₹{product?.sp || "-"}</p>
            <p><span className="font-semibold">Available:</span> {product?.currentQuantity || "-"}pcs</p>
            </div>

            {/* Quantity Input */}
            <div className="space-y-1">
            <label className="text-sm font-medium text-gray-600">Enter Quantity</label>
            <input
                type="number"
                min={1}
                value={qty}
                onChange={(e) => setQty(e.target.value)}
                className={`w-full border px-3 py-2 rounded-md outline-none focus:ring-2 ${lowStock ? 'focus:ring-red-600' : 'focus:ring-blue-600'}`}
                id="qtyInput"
            />
            { lowStock && <p className="text-red-500 font-semibold text-sm pl-1">Low Stock</p> }
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-3 pt-2">
                <button onClick={onCancel} className="px-3 py-2 rounded bg-gray-300 hover:bg-gray-400 text-sm" >
                    Cancel
                </button>
                <button onClick={() => handleAdd()} disabled={lowStock} className={`px-3 py-2 rounded text-sm text-white ${lowStock ? "bg-red-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"}`} >
                    {mode === 'ADD' ? 'Add' : 'Edit'}
                </button>
            </div>
        </div>
        </div>
    );
};

export default QuantityModel;
