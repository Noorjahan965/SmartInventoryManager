import { useState, useEffect } from "react";
import { FiSearch } from "react-icons/fi";
import { IoMdBarcode } from "react-icons/io";
import { Pencil, Trash2 } from "lucide-react";

import BarCodeScanner from "../../component/barcode/BarCodeScanner";
import QuantityModel from "../../component/billingPageComponent/QuantityModel";

import ResetModal from "../../component/billingPageComponent/ResetModal";

const BillingPage = () => {

    const token = localStorage.getItem("Token");
    const [searchTerm, setSearchTerm] = useState('');
    const [products, setProducts] = useState([]);

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const [showScanner, setShowScanner] = useState(false);

    const [selectedProduct, setSelectedProduct] = useState(null);

    const [cartProduct, setCartProduct] = useState(JSON.parse(localStorage.getItem('Bill')) || []);

    const [showResetModal, setShowResetModal] = useState(false);
    const [showSubmitModal, setShowSubmitModal] = useState(true);

    const fetchProducts = async () => {
        try {
            setLoading(true);
            setError("");

            const query = new URLSearchParams({
                search: searchTerm.trim()
            }).toString();

            const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/product/all?${query}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            const data = await res.json();
            if (data.status === "FAILED") {
                setError(data.message);
                setProducts([]);
            }
            else {
                setProducts(data.data.data);
            }
        } 
        catch (err) {
            setError("Unable to fetch products.");
            setProducts([]);
        } 
        finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, [searchTerm]);

    const handleScan = async (code) => {
        try {
            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/product?sno=${code}`, {
                method: 'GET',
                headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
                }
            });

            const data = await response.json();
            setProducts([data.data]);
        }
        catch(err) {

        }
    };

    const updateCart = () => {
        setCartProduct(JSON.parse(localStorage.getItem('Bill')) || []);
    }
    const removeItem = (_id) => {
        const prod = JSON.parse(localStorage.getItem('Bill'));
        let i = 0;
        for(i=0; i<prod.length; i++) {
            if(prod[i]._id == _id) {
                break;
            }
        }
        if(i == prod.length) return;
        prod.splice(i, 1);
        localStorage.setItem('Bill', JSON.stringify(prod));
        setCartProduct(prod);
    }

    const handleDrop = (e) => {
        e.preventDefault();
        const json = e.dataTransfer.getData("application/json");
        const obj = JSON.parse(json);
        setSelectedProduct({...obj, qty: 1});
    }

    return(
        <div className="p-3 pt-2">

            <div className="flex flex-wrap justify-between items-center gap-3">
                <h3 className="text-3xl font-bold text-slate-900">Billing</h3>
                <p><span className="font-bold">Invoice Date:</span> {new Date().toLocaleDateString()}</p>
            </div>

            <form className="flex flex-wrap items-end gap-4 bg-white shadow p-6 rounded">
                {/* Customer Name */}
                <div className="flex flex-col">
                    <label className="font-semibold">Customer Name</label>
                    <input type="text" placeholder="Enter name" className="border p-2 rounded w-64" />
                </div>

                {/* Mobile No */}
                <div className="flex flex-col">
                    <label className="font-semibold">Mobile No</label>
                    <input type="tel" placeholder="9876543210" className="border p-2 rounded w-48" />
                </div>

                {/* Email */}
                <div className="flex flex-col">
                    <label className="font-semibold">Email</label>
                    <input type="email" placeholder="customer@example.com" className="border p-2 rounded w-64" />
                </div>

                {/* Payment Type */}
                <div className="flex flex-col">
                    <label className="font-semibold">Payment Type</label>
                    <select className="border p-2 rounded w-48">
                        <option disabled value="">Select</option>
                        <option value="cash">Cash</option>
                        <option value="upi">UPI</option>
                    </select>
                </div>
                <div>
                    <button type="button" className="bg-blue-600 text-white px-4 py-2 rounded w-full font-semibold hover:bg-blue-800 cursor-pointer" >Reset</button>
                </div>
            </form>

            <div className="flex min-h-[65dvh]">
                {/* Products */}
                <div className="bg-white w-[40%] p-4 rounded-lg shadow-lg space-y-4">
                {/* Title */}
                <h4 className="text-xl font-bold text-slate-800">Products</h4>

                {/* Search Bar + Barcode */}
                <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2 bg-white border border-slate-300 px-3 py-2 rounded-lg w-full shadow-sm">
                    <FiSearch className="text-slate-500" />
                    <input
                        type="text"
                        placeholder="Product Name / Sno"
                        className="w-full bg-transparent outline-none text-slate-900"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    </div>

                    <IoMdBarcode
                        onClick={() => setShowScanner(true)}
                        size={32}
                        className="cursor-pointer text-slate-700 hover:scale-110 transition"
                    />
                </div>

                {loading && <p className="text-blue-600 font-semibold">Loading products...</p>}
                {error && <p className="text-red-600 font-semibold">{error}</p>}

                {/* Product List */}
                <div className="space-y-3 overflow-y-auto max-h-[60vh] pr-1">

                    {
                        products.map((p) => (
                            <div 
                                key={p._id}
                                className="rounded-lg border border-slate-200 p-3 shadow-sm hover:shadow-md transition"
                                draggable
                                onDragStart={(e) => e.dataTransfer.setData("application/json", JSON.stringify(p))}
                            >
                                <div className="flex justify-between items-start gap-2">
                                    <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-md text-slate-700">
                                        <p><span className="font-bold text-slate-800">Sno:</span> {p.sno}</p>
                                        <p><span className="font-bold text-slate-800">Name:</span> {p.productName}</p>
                                        <p><span className="font-bold text-slate-800">Price:</span> ₹{p.sp}</p>
                                        <p><span className="font-bold text-slate-800">Qty:</span> {p.currentQuantity}</p>
                                        <p><span className="font-bold text-slate-800">Location:</span> {p.location}</p>
                                        <p className="col-span-2 line-clamp-1"><span className="font-bold text-slate-800">Desc:</span> {p.description}</p>
                                        {
                                            p.variant && (<p className="col-span-2 line-clamp-1"><span className="font-bold text-slate-800">Variant:</span> {p.variant}</p>)
                                        }
                                    </div>
                                    <button onClick={() => {
                                        setSelectedProduct({...p, qty: 1})
                                    }} className="bg-blue-600 text-white px-3 py-1 rounded-md text-sm font-semibold hover:bg-blue-700">
                                        ADD
                                    </button>
                                </div>
                            </div>
                        ))
                    }
                    

                </div>
                </div>


                {/* Cart */}
                <div
                    onDrop={handleDrop}
                    onDragOver={(e) => e.preventDefault()}
                    className="bg-white w-[60%] p-4 rounded-lg shadow-lg space-y-4 border border-gray-300"
                >
                    <h4 className="text-xl font-bold text-slate-800 text-center border-b pb-2 tracking-wider">
                        Cart & Billing
                    </h4>

<table className="w-full text-sm">
  <thead className="bg-gray-200">
    <tr className="grid grid-cols-6 border-b font-semibold">
      <td className="py-3 px-2">Sno</td>
      <td className="py-3 px-2">Name</td>
      <td className="py-3 px-2 text-right">Qty</td>
      <td className="py-3 px-2 text-right">Price(₹)</td>
      <td className="py-3 px-2 text-right">Total</td>
      <td className="py-3 px-2 text-center">Actions</td>
    </tr>
  </thead>

  <tbody className="block max-h-[45vh] overflow-y-auto divide-y divide-gray-200">
    {cartProduct.map((p) => (
      <tr key={p._id} className="grid grid-cols-6">
        <td className="py-3 px-2">{p.sno}</td>
        <td className="py-3 px-2">{p.productName}</td>
        <td className="py-3 px-2 text-right">{p.qty}</td>
        <td className="py-3 px-2 text-right">₹{p.sp}</td>
        <td className="py-3 px-2 text-right">{p.total}</td>
        <td className="py-3 px-2 text-center">
          <div className="flex items-center justify-center gap-2">
            <button onClick={() => setSelectedProduct(p)} className="text-blue-600 hover:text-blue-800">
              <Pencil size={18} />
            </button>
            <button onClick={() => removeItem(p._id)} className="text-red-600 hover:text-red-800">
              <Trash2 size={18} />
            </button>
          </div>
        </td>
      </tr>
    ))}

    {cartProduct.length === 0 && (
      <tr className="grid grid-cols-1">
        <td className="col-span-6 text-center text-slate-500 py-6 italic">
          Nothing here yet... scan or select a product to continue 😊
        </td>
      </tr>
    )}
  </tbody>

    <tfoot className="border-t font-bold">
        <tr className="grid grid-cols-6">
            <td className="py-3 px-2 text-left col-span-5 text-lg">
            Total
            </td>
            <td className="py-3 px-2 text-right text-lg">
            ₹{cartProduct.reduce((total, p) => total + Number(p.sp) * Number(p.qty), 0)}
            </td>
        </tr>
    </tfoot>

</table>



                    <div className="flex justify-between pt-2 border-t border-gray-300">
                        <button onClick={() => setShowResetModal(true)} className="px-3 py-2 bg-red-500 text-white rounded hover:bg-red-600 font-bold">
                            Reset Cart
                        </button>
                        <button className="px-3 py-2 bg-green-600 text-white rounded hover:bg-green-700 font-bold">
                            Submit Bill
                        </button>
                    </div>
                </div>

            </div>

            {showScanner && (
                <BarCodeScanner
                    onDetected={handleScan}
                    onClose={() => setShowScanner(false)}
                />
            )}

            {selectedProduct && (
                <QuantityModel 
                    product={selectedProduct}
                    updateCart={updateCart}
                    onCancel={() => setSelectedProduct(null)}
                />
            )}

            {
                showResetModal && (
                    <ResetModal onConfirm={() => {
                        localStorage.removeItem('Bill');
                        setCartProduct([]);
                        setShowResetModal(false);
                    }} onCancel={() => setShowResetModal(false)} />
                )
            }
        </div>
    );
}

export default BillingPage;