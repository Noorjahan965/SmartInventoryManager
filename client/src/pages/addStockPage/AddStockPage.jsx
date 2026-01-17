import { useState, useEffect } from "react";
import { FiSearch } from "react-icons/fi";
import { IoMdBarcode } from "react-icons/io";

import BarCodeScanner from "../../component/barcode/BarCodeScanner";
import AddQuantityModel from "../../component/addStockComponent/AddQuantityModel";
import ViewStockModal from "../../component/addStockComponent/ViewStockModal";

const AddStockPage = () => {

    const [searchTerm, setSearchTerm] = useState('');
    const [products, setProducts] = useState([]);

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const [showScanner, setShowScanner] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);

    const [viewStockModal, setViewStockModal] = useState(false);
    
    const token = localStorage.getItem("Token");
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
            } else {
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
        console.log(code);
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
            setSelectedProduct(data.data);
        }
        catch(err) {
console.log(err.message)
        }
    };

    return (
        <div className="p-6 pt-3 space-y-5">
            {/* Header */}
            <div className="flex flex-wrap justify-between items-center gap-3">
                <h2 className="text-3xl font-bold text-slate-900">Add Stock</h2>
                <button onClick={() => setViewStockModal(true)} className="flex items-center gap-2 bg-blue-600 hover:bg-blue-800 cursor-pointer text-white font-semibold px-4 py-2 rounded-lg transition" >
                    View Stocks
                </button>
            </div>
        
            <div className="flex items-center gap-5">
                {/* Search */}
                <div className="flex items-center gap-2 bg-white border border-slate-400 px-3 py-2 rounded-lg w-full max-w-md shadow-sm">
                <FiSearch className="text-slate-600" />
                <input
                    type="text"
                    placeholder="Product Name / Sno"
                    className="w-full bg-transparent outline-none text-slate-900"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                </div>
                <IoMdBarcode onClick={() => setShowScanner(true)} size={30} className="cursor-pointer hover:scale-110 transition" />
            </div>

            {loading && <p className="text-blue-600 font-semibold">Loading products...</p>}
            {error && <p className="text-red-600 font-semibold">{error}</p>}

            {/* Product Listing */}
            <div className="bg-white rounded-lg shadow-lg p-4 space-y-3 max-h-[70vh] overflow-y-auto">

                {products.map((p) => (
                <div
                    key={p.sno}
                    className="rounded-lg border border-slate-200 p-3 shadow-sm hover:shadow-md transition"
                >
                    <div className="flex justify-between items-center gap-3">
                    <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-sm text-slate-700">
                        <p><span className="font-bold">Sno:</span> {p.sno}</p>
                        <p><span className="font-bold">Name:</span> {p.productName}</p>
                        <p><span className="font-bold">Current Qty:</span> {p.currentQuantity}</p>
                        <p><span className="font-bold">CP:</span> ₹{p.cp}</p>
                        <p><span className="font-bold">SP:</span> ₹{p.sp}</p>
                    </div>

                    <button 
                        onClick={() => setSelectedProduct(p)}
                        className="bg-green-600 text-white px-3 py-1 rounded-md text-sm font-semibold hover:bg-green-700"
                    >
                        Add Qty
                    </button>
                    </div>
                </div>
                ))}

            </div>

            {showScanner && (
                <BarCodeScanner
                    onDetected={handleScan}
                    onClose={() => setShowScanner(false)}
                />
            )}

            {selectedProduct && (
                <AddQuantityModel 
                    product={selectedProduct}
                    onCancel={() => setSelectedProduct(null)}
                />
            )}

            {viewStockModal && (
                <ViewStockModal onClose={() => setViewStockModal(false)} selectedProduct={selectedProduct} setSelectedProduct={setSelectedProduct} />
            )}

        </div>
    );
};

export default AddStockPage;
