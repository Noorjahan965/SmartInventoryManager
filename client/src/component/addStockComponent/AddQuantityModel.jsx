import { useState, useEffect } from "react";

const AddQuantityModel = ({ product, onCancel }) => {

    const [qty, setQty] = useState(product.qty || 1);

    const [mode, setMode] = useState('ADD');

    const handleAdd = () => {
        let stockProducts = JSON.parse(localStorage.getItem('Stock')) || [];

        let i = 0;
        for(i = 0; i < stockProducts.length; i++) {
            if(stockProducts[i].sno == product.sno) {
                stockProducts[i].qty = Number(qty);
                break;
            }
        }
        if(i === stockProducts.length) {
            const p = {
                _id: product._id,
                sno: product.sno,
                productName: product.productName,
                qty: Number(qty),
                cp: product.cp,
            }
            stockProducts.push(p);
        }
        localStorage.setItem('Stock', JSON.stringify(stockProducts));
        onCancel();
    }

    useEffect(() => {
        let stockProducts = JSON.parse(localStorage.getItem('Stock')) || [];

        let i = 0;
        for(i = 0; i < stockProducts.length; i++) {
            if(stockProducts[i].sno == product.sno) {
                setQty(Number(stockProducts[i].qty));
                setMode('EDIT');
                break;
            }
        }
    }, []);

    return (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex justify-center items-center z-50">
        <div className="bg-white w-[90%] max-w-sm rounded-lg shadow-lg p-5 space-y-4 animate-scaleIn">
            
            <h2 className="text-lg font-semibold text-gray-800 text-center">
                {mode === 'ADD' ? 'Add' : 'Edit'} Product to Add Stock
            </h2>

            {/* Product info */}
            <div className="space-y-1 text-gray-700 text-sm border p-3 rounded bg-gray-50">
            <p><span className="font-semibold">Sno:</span> {product?.sno || "-"}</p>
            <p><span className="font-semibold">Name:</span> {product?.productName || "-"}</p>
            <p><span className="font-semibold">Price:</span> ₹{product?.cp || "-"}</p>
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
                className='w-full border px-3 py-2 rounded-md outline-none focus:ring-2 focus:ring-blue-600'
                id="qtyInput"
            />
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-3 pt-2">
                <button onClick={onCancel} className="px-3 py-2 rounded bg-gray-300 hover:bg-gray-400 text-sm" >
                    Cancel
                </button>
                <button onClick={() => handleAdd()} className='px-3 py-2 rounded text-sm text-white bg-blue-600 hover:bg-blue-700' >
                    {mode === 'ADD' ? 'Add' : 'Edit'}
                </button>
            </div>
        </div>
        </div>
    )
}

export default AddQuantityModel