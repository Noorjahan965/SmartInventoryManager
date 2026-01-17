import { Pencil, Trash2, X } from "lucide-react";
import { useEffect, useState } from "react";

const ViewStockModal = ({ selectedProduct, setSelectedProduct, onClose }) => {

    const [stockItems, setStockItems] = useState(JSON.parse(localStorage.getItem('Stock')) || []);

    const removeItem = (_id) => {
        const prod = JSON.parse(localStorage.getItem('Stock'));
        let i = 0;
        for(i=0; i<prod.length; i++) {
            if(prod[i]._id == _id) {
                break;
            }
        }
        if(i == prod.length) return;
        prod.splice(i, 1);
        localStorage.setItem('Stock', JSON.stringify(prod));
        setStockItems(prod);
    }

    useEffect(() => {
        setStockItems(JSON.parse(localStorage.getItem('Stock')) || []);
    }, [selectedProduct]);

    const handleAdd = async () => {
        const authorName = localStorage.getItem('UserName')
        const stockProducts = JSON.parse(localStorage.getItem('Stock')) || [];
        if(stockProducts.length === 0) {
            alert('No products');
            return;
        }
        let stock = {
            authorName: localStorage.getItem('UserName'),
            product: stockProducts
        }
        const token = localStorage.getItem('Token');
        try {
            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/stock/add-stock`, {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(stock)
            })
            const data = await response.json();
            localStorage.removeItem('Stock')
            setStockItems([]);
            alert('Stock added');
        }
        catch(err) {
            console.log(err);
        }
    }

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex justify-center items-center z-40">
      <div className="bg-white max-md:w-[95%] md:w-[90%] max-w-2xl rounded-lg shadow-lg px-2 py-3 md:p-5 space-y-4 animate-scaleIn border border-gray-200">

        {/* Header */}
        <div className="flex justify-between items-center border-b pb-2">
          <h2 className="text-xl font-bold text-gray-800 tracking-wide">
            Stock Added Today
          </h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-800 cursor-pointer">
            <X size={22} />
          </button>
        </div>

        {/* Table */}
        <table className="w-full text-sm">
          <thead className="bg-gray-100">
            <tr className="grid grid-cols-5 border-b font-semibold">
              <td className="py-2 px-2">Sno</td>
              <td className="py-2 px-2">Name</td>
              <td className="py-2 px-2 text-right">Qty</td>
              <td className="py-2 px-2 text-right">CP(₹)</td>
              <td className="py-2 px-2 text-center">Actions</td>
            </tr>
          </thead>

          <tbody className="block max-h-[45vh] overflow-y-auto divide-y divide-gray-200">
            {stockItems.map((p) => (
              <tr key={p._id} className="grid grid-cols-5">
                <td className="py-2 px-2">{p.sno}</td>
                <td className="py-2 px-2">{p.productName}</td>
                <td className="py-2 px-2 text-right">{p.qty}</td>
                <td className="py-2 px-2 text-right">₹{p.cp}</td>
                <td className="py-2 px-2 text-center">
                  <div className="flex items-center justify-center gap-2">
                    <button onClick={() => {
                            setSelectedProduct(p);
                            
                        }} className="text-blue-600 hover:text-blue-800 cursor-pointer">
                      <Pencil size={18} />
                    </button>
                    <button onClick={() => removeItem(p._id)} className="text-red-600 hover:text-red-800 cursor-pointer">
                      <Trash2 size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}

            {stockItems.length === 0 && (
              <tr className="grid grid-cols-1">
                <td className="col-span-5 text-center text-slate-500 py-6 italic">
                  No stock added yet...
                </td>
              </tr>
            )}
          </tbody>

          {/* Footer Total */}
          <tfoot className="border-t font-bold">
            <tr className="grid grid-cols-5">
              <td className="py-3 px-2 col-span-4 text-lg">Total CP</td>
              <td className="py-3 px-2 text-right text-lg">
                ₹{stockItems.reduce((t, p) => t + Number(p.cp) * Number(p.qty), 0)}
              </td>
            </tr>
          </tfoot>

        </table>

        {/* Footer Actions */}
        <div className="pt-2 flex justify-end gap-4">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 text-gray-900 rounded hover:bg-gray-400 font-semibold cursor-pointer"
          >
            Close
          </button>
          <button
            onClick={() => handleAdd()}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-800 rounded font-semibold text-white cursor-pointer"
          >
            Add
          </button>
        </div>

      </div>
    </div>
  );
};

export default ViewStockModal;
