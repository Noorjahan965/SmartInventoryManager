import { useState, useEffect } from "react";
import { FiSearch } from "react-icons/fi";
import { IoMdBarcode } from "react-icons/io";

import BarCode from "../../component/barcode/BarCode";
import BarCodePopup from "../../component/barcode/BarCodePopup";
import BarCodeScanner from "../../component/barcode/BarCodeScanner";

import { locations } from "../../constants/metaData";

const ViewProductsPage = () => {
    const [products, setProducts] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedBarcode, setSelectedBarcode] = useState(null);
    const [selectedProductName, setSelectedProductName] = useState("");

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const [filters, setFilters] = useState({
        qty: "none",
        cp: "none",
        sp: "none",
        location: "",
    });

    const [showScanner, setShowScanner] = useState(false);

    const fetchProducts = async () => {
        try {
            setLoading(true);
            setError("");

            const query = new URLSearchParams({
                search: searchTerm.trim(),
                location: filters.location,
                qty: filters.qty,
                cp: filters.cp,
                sp: filters.sp,
            }).toString();

            const token = localStorage.getItem("Token");

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
        } catch (err) {
            setError("Unable to fetch products.");
            setProducts([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, [searchTerm, filters]);

    const handleScan = async (code) => {
        try {
            const token = localStorage.getItem("Token");
            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/product?sno=${code}`, {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                }
            });

            const data = await response.json();
            setProducts([data.data]);
        } catch (err) {
            console.error("Scan failed");
        }
    };

    return (
        <div className="relative z-0 p-6 pt-3 space-y-5">
            {/* Header */}
            <div className="flex flex-wrap justify-between items-center gap-3">
                <h2 className="text-3xl font-bold text-slate-900">View Inventory</h2>
            </div>

            <div className="flex items-center gap-5">
                {/* Search */}
                <div className="flex items-center gap-2 bg-white border border-slate-400 px-3 py-2 rounded-lg w-full max-w-md shadow-sm">
                    <FiSearch className="text-slate-600" />
                    <input
                        type="text"
                        placeholder="Search products..."
                        className="w-full bg-transparent outline-none text-slate-900"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <IoMdBarcode onClick={() => setShowScanner(true)} size={30} className="cursor-pointer hover:scale-110 transition" />
            </div>

            {/* Filters */}
            <div className="flex flex-wrap gap-4 items-center">
                <select
                    className="border px-3 py-2 rounded-lg bg-white border-slate-400 text-slate-900 cursor-pointer text-sm"
                    value={filters.qty}
                    onChange={(e) => setFilters({ ...filters, qty: e.target.value })}
                >
                    <option value="none">Qty Sort</option>
                    <option value="asc">Low → High</option>
                    <option value="desc">High → Low</option>
                </select>

                <select
                    className="border px-3 py-2 rounded-lg bg-white border-slate-400 text-slate-900 cursor-pointer text-sm"
                    value={filters.location}
                    onChange={(e) => setFilters({ ...filters, location: e.target.value })}
                >
                    {locations.map((loc) => (
                        <option key={loc} value={loc}>
                            {loc === "" ? "All Locations" : loc}
                        </option>
                    ))}
                </select>

                <button onClick={() => {
                    setFilters({ qty: "none", cp: "none", sp: "none", location: "" });
                    setSearchTerm('');
                }} className="bg-blue-600 hover:bg-blue-800 cursor-pointer text-white text-sm font-semibold px-4 py-2 rounded-md transition-all">
                    Reset
                </button>
            </div>

            {/* Loading / Error */}
            {loading && <p className="text-blue-600 font-semibold italic">Updating list...</p>}
            {error && <p className="text-red-600 font-semibold">{error}</p>}

            {/* Table */}
            <div className="overflow-x-auto overflow-y-auto max-h-[70vh] rounded-xl shadow-lg border border-slate-300">
                <table className="min-w-full text-left text-sm">
                    <thead className="bg-slate-100 text-slate-800 font-semibold sticky top-0 z-10">
                        <tr>
                            <th className="px-4 py-3">S.No</th>
                            <th className="px-4 py-3">Product Name</th>
                            <th className="px-4 py-3">Description</th>
                            <th className="px-4 py-3">Qty</th>
                            <th className="px-4 py-3">Price (SP)</th>
                            <th className="px-4 py-3">Location</th>
                            <th className="px-4 py-3">Variant</th>
                            <th className="px-4 py-3">Barcode</th>
                        </tr>
                    </thead>

                    <tbody className="text-slate-800 bg-white">
                        {!loading && products.length === 0 && (
                            <tr>
                                <td colSpan="8" className="text-center py-10 text-slate-500">
                                    No products found in inventory.
                                </td>
                            </tr>
                        )}

                        {products.map((p) => (
                            <tr key={p.sno} className="border-b hover:bg-slate-50 transition">
                                <td className="px-4 py-3 font-medium text-slate-500">{p.sno}</td>
                                <td className="px-4 py-3 font-semibold">{p.productName}</td>
                                <td className="px-4 py-3 text-slate-600">{p.description || "-"}</td>
                                <td className="px-4 py-3">
                                    <span className={`px-2 py-1 rounded text-xs font-bold ${p.currentQuantity <= p.minQuantity ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'}`}>
                                        {p.currentQuantity}
                                    </span>
                                </td>
                                <td className="px-4 py-3 font-medium text-blue-700">${p.sp}</td>
                                <td className="px-4 py-3">{p.location}</td>
                                <td className="px-4 py-3">
                                    <div className="flex gap-1 flex-wrap">
                                        {p.variant?.length ? p.variant.map((v, i) => (
                                            <span key={i} className="bg-slate-200 px-1.5 py-0.5 rounded text-[11px]">{v}</span>
                                        )) : "-"}
                                    </div>
                                </td>
                                <td className="px-4 py-3">
                                    <button
                                        onClick={() => {
                                            setSelectedBarcode(p.sno);
                                            setSelectedProductName(p.productName);
                                        }}
                                        className="cursor-pointer hover:opacity-70 transition"
                                    >
                                        <BarCode value={p.sno} width={1} height={20} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Modals for Barcode/Scanner */}
            {selectedBarcode && (
                <BarCodePopup
                    value={selectedBarcode}
                    productName={selectedProductName}
                    setSelectedBarcode={setSelectedBarcode}
                />
            )}

            {showScanner && (
                <BarCodeScanner
                    onDetected={handleScan}
                    onClose={() => setShowScanner(false)}
                />
            )}
        </div>
    );
};

export default ViewProductsPage;