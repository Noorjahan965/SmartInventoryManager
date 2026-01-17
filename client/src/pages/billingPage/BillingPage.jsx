import { useState, useEffect } from "react";
import { FiSearch, FiUser, FiPhone, FiMail, FiCreditCard, FiCheckCircle } from "react-icons/fi";
import { IoMdBarcode } from "react-icons/io";
import { Pencil, Trash2, RefreshCcw, CheckCircle, X } from "lucide-react";

import BarCodeScanner from "../../component/barcode/BarCodeScanner";
import QuantityModel from "../../component/billingPageComponent/QuantityModel";
import ResetModal from "../../component/billingPageComponent/ResetModal";
import SubmitModal from "../../component/billingPageComponent/SubmitModal";

const BillingPage = () => {
    const token = localStorage.getItem("Token");
    const [customerName, setCustomerName] = useState('');
    const [mobileNo, setMobileNo] = useState('');
    const [email, setEmail] = useState('');
    const [paymentType, setPaymentType] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [showScanner, setShowScanner] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [cartProduct, setCartProduct] = useState(JSON.parse(localStorage.getItem('Bill')) || []);
    const [showResetModal, setShowResetModal] = useState(false);
    const [showSubmitModal, setShowSubmitModal] = useState(false);
    
    // New State for Success Popup
    const [showSuccessPopup, setShowSuccessPopup] = useState(false);

    const fetchProducts = async () => {
        try {
            setLoading(true);
            setError("");
            const query = new URLSearchParams({ search: searchTerm.trim() }).toString();
            const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/product/all?${query}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            const data = await res.json();
            if (data.status === "FAILED") { setError(data.message); setProducts([]); }
            else { setProducts(data.data.data); }
        } catch (err) { setError("Unable to fetch products."); setProducts([]); } 
        finally { setLoading(false); }
    };

    useEffect(() => { fetchProducts(); }, [searchTerm]);

    const updateCart = () => { setCartProduct(JSON.parse(localStorage.getItem('Bill')) || []); }
    
    const removeItem = (_id) => {
        const prod = JSON.parse(localStorage.getItem('Bill')) || [];
        const filtered = prod.filter(item => item._id !== _id);
        localStorage.setItem('Bill', JSON.stringify(filtered));
        setCartProduct(filtered);
    }

    const handleDrop = (e) => {
        e.preventDefault();
        const json = e.dataTransfer.getData("application/json");
        if (!json) return;
        const obj = JSON.parse(json);
        setSelectedProduct({...obj, qty: 1});
    }

    const resetBillData = () => {
        setCustomerName(''); setMobileNo(''); setEmail(''); setPaymentType('');
    }

    const submitBill = async () => {
        if(!customerName.trim() || !mobileNo || !paymentType) {
            alert("Please fill customer details"); return;
        }
        let bill = {
            authorName: localStorage.getItem('UserName'),
            customerName, mobileNo, email,
            modeOfPayment: paymentType,
            product: cartProduct
        }
        try {
            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/stock/bill`, {
                method: 'POST',
                headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
                body: JSON.stringify(bill)
            });
            if (response.ok) {
                localStorage.removeItem('Bill');
                setCartProduct([]);
                // Show custom success popup instead of alert
                setShowSubmitModal(false);
                setShowSuccessPopup(true);
                // Note: resetBillData() is called when closing the success popup to keep the name visible in the success msg
            }
        } catch(err) { console.error(err); }
    }

    const closeSuccessPopup = () => {
        setShowSuccessPopup(false);
        resetBillData();
    }

    return (
        <div className="max-w-7xl mx-auto p-3 sm:p-6 space-y-6 relative">
            {/* Header */}
            <div className="flex justify-between items-center border-b border-slate-200 pb-4">
                <h3 className="text-2xl font-black text-slate-800 tracking-tight italic uppercase">Billing</h3>
                <div className="text-right">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none">Invoice data</p>
                    <p className="text-sm font-bold text-slate-700">{new Date().toLocaleDateString()}</p>
                </div>
            </div>

            {/* Customer Information Section */}
            <div className="bg-white shadow-sm border border-slate-200 rounded-2xl p-4 sm:p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 items-end">
                    <div className="space-y-1">
                        <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">Customer Name</label>
                        <input value={customerName} onChange={(e) => setCustomerName(e.target.value)} className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition text-sm font-semibold" placeholder="Enter Name" />
                    </div>
                    <div className="space-y-1">
                        <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">Mobile</label>
                        <input type="number" value={mobileNo} onChange={(e) => setMobileNo(e.target.value)} className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition text-sm font-semibold" placeholder="Phone Number" />
                    </div>
                    <div className="space-y-1">
                        <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">Payment</label>
                        <select value={paymentType} onChange={(e) => setPaymentType(e.target.value)} className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition text-sm font-semibold appearance-none">
                            <option value="">Select</option>
                            <option value="CASH">Cash</option>
                            <option value="UPI">UPI / Card</option>
                        </select>
                    </div>
                    <div className="space-y-1 lg:col-span-1">
                        <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">Email</label>
                        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none text-sm font-semibold" placeholder="Optional" />
                    </div>
                    <button onClick={resetBillData} className="w-full bg-slate-100 text-slate-600 font-bold py-2 rounded-xl hover:bg-slate-200 transition flex items-center justify-center gap-2 border border-slate-200 text-sm">
                        <RefreshCcw size={14} /> Clear
                    </button>
                </div>
            </div>

            {/* Main Billing Section */}
            <div className="flex flex-col lg:flex-row gap-6">
                
                {/* 1. PRODUCT SEARCH SIDE */}
                <div className="w-full lg:w-[40%] space-y-4">
                    <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm h-full flex flex-col">
                        <div className="flex justify-between items-center mb-4">
                            <h4 className="font-bold text-slate-800 text-xs uppercase tracking-widest">Products</h4>
                            <button onClick={() => setShowScanner(true)} className="p-2 bg-slate-800 text-white rounded-lg hover:bg-slate-700 transition shadow-lg shadow-indigo-100 cursor-pointer">
                                <IoMdBarcode size={20} />
                            </button>
                        </div>
                        
                        <div className="relative mb-4">
                            <FiSearch className="absolute left-3 top-3 text-slate-400" />
                            <input value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-indigo-500 text-sm font-medium" placeholder="Search item..." />
                        </div>

                        <div className="space-y-3 overflow-y-auto max-h-[50vh] pr-2 custom-scrollbar">
                            {products.map((p) => (
                                <div 
                                    key={p._id} 
                                    className="p-3 rounded-xl border border-slate-100 bg-slate-50/50 hover:border-indigo-400 transition cursor-move group relative"
                                    draggable
                                    onDragStart={(e) => e.dataTransfer.setData("application/json", JSON.stringify(p))}
                                >
                                    <div className="flex justify-between items-center">
                                        <div className="max-w-[70%]">
                                            <p className="text-[9px] font-black text-indigo-600 uppercase leading-none mb-1">{p.sno}</p>
                                            <p className="font-bold text-slate-800 text-sm truncate">{p.productName}</p>
                                            <p className="text-sm font-black text-slate-900 mt-1">₹{p.sp}</p>
                                        </div>
                                        <button onClick={() => setSelectedProduct({...p, qty: 1})} className="bg-white text-indigo-600 border border-indigo-100 px-3 py-1.5 rounded-lg font-bold text-[10px] hover:bg-indigo-600 hover:text-white transition cursor-pointer">
                                            ADD
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* 2. CART SIDE */}
                <div className="w-full lg:w-[60%]">
                    <div 
                        onDrop={handleDrop}
                        onDragOver={(e) => e.preventDefault()}
                        className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col min-h-125"
                    >
                        <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/30">
                            <h4 className="font-bold text-slate-800 text-xs uppercase tracking-widest">Bill Summary</h4>
                            <span className="text-[10px] font-bold text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full">{cartProduct.length} Items</span>
                        </div>

                        {/* Desktop View Table */}
                        <div className="hidden sm:block grow overflow-y-auto">
                            <table className="w-full text-left">
                                <thead className="bg-slate-50 text-[10px] font-black uppercase text-slate-400 border-b">
                                    <tr>
                                        <th className="px-6 py-3">Product</th>
                                        <th className="px-4 py-3 text-center">Qty</th>
                                        <th className="px-4 py-3 text-right">Price</th>
                                        <th className="px-4 py-3 text-right">Total</th>
                                        <th className="px-6 py-3 text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {cartProduct.map((p) => (
                                        <tr key={p._id} className="text-sm hover:bg-slate-50/50">
                                            <td className="px-6 py-4 font-bold text-slate-700">{p.productName}</td>
                                            <td className="px-4 py-4 text-center font-semibold">{p.qty}</td>
                                            <td className="px-4 py-4 text-right">₹{p.sp}</td>
                                            <td className="px-4 py-4 text-right font-black">₹{p.total}</td>
                                            <td className="px-6 py-4 text-right">
                                                <div className="flex justify-end gap-2">
                                                    <button onClick={() => setSelectedProduct(p)} className="text-blue-500 p-1.5 hover:bg-blue-50 rounded-lg cursor-pointer"><Pencil size={14} /></button>
                                                    <button onClick={() => removeItem(p._id)} className="text-red-500 p-1.5 hover:bg-red-50 rounded-lg cursor-pointer"><Trash2 size={14} /></button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                    {cartProduct.length === 0 && (
                                        <tr><td colSpan="5" className="text-center py-24 text-slate-300 text-xs italic">Drag product cards here or click "ADD"</td></tr>
                                    )}
                                </tbody>
                            </table>
                        </div>

                        {/* Mobile View List */}
                        <div className="sm:hidden grow space-y-3 p-4">
                            {cartProduct.map((p) => (
                                <div key={p._id} className="bg-slate-50 p-4 rounded-xl border border-slate-100 flex justify-between items-center shadow-sm">
                                    <div>
                                        <p className="font-bold text-slate-800 text-sm">{p.productName}</p>
                                        <p className="text-[10px] text-slate-500 font-bold uppercase">{p.qty} PCS × ₹{p.sp}</p>
                                        <p className="font-black text-indigo-600 mt-1">₹{p.total}</p>
                                    </div>
                                    <div className="flex gap-2">
                                        <button onClick={() => setSelectedProduct(p)} className="bg-white p-2 rounded-lg border border-slate-200 text-blue-500"><Pencil size={16} /></button>
                                        <button onClick={() => removeItem(p._id)} className="bg-white p-2 rounded-lg border border-slate-200 text-red-500"><Trash2 size={16} /></button>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Summary & Checkout */}
                        <div className="p-6 bg-slate-900 text-white rounded-t-[2.5rem] shadow-2xl shadow-slate-900">
                            <div className="flex justify-between items-center mb-6 px-2">
                                <span className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">Net Payable Amount</span>
                                <span className="text-4xl font-black text-white">₹{cartProduct.reduce((total, p) => total + Number(p.sp) * Number(p.qty), 0)}</span>
                            </div>
                            <div className="flex gap-3">
                                <button onClick={() => setShowResetModal(true)} className="flex-1 py-4 rounded-2xl border border-slate-700 font-bold text-xs uppercase tracking-widest hover:bg-slate-800 transition cursor-pointer">Reset</button>
                                <button onClick={() => setShowSubmitModal(true)} className="flex-2 py-4 bg-indigo-600 rounded-2xl font-black text-xs tracking-widest hover:bg-indigo-500 transition flex items-center justify-center gap-2 shadow-xl shadow-indigo-900/50 cursor-pointer">
                                    <CheckCircle size={16} /> GENERATE BILL
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* CUSTOM SUCCESS MODAL */}
            {showSuccessPopup && (
                <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-100 p-4">
                    <div className="bg-white rounded-4xl max-w-sm w-full p-8 text-center shadow-2xl animate-in zoom-in duration-300">
                        <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                            <FiCheckCircle size={48} />
                        </div>
                        <h2 className="text-2xl font-black text-slate-800 mb-2">Bill Generated!</h2>
                        <p className="text-slate-500 text-sm mb-6 leading-relaxed">
                            Invoice for <span className="font-bold text-slate-800">{customerName}</span> has been saved successfully to the system.
                        </p>
                        <button 
                            onClick={closeSuccessPopup} 
                            className="w-full py-4 bg-slate-900 text-white rounded-2xl font-bold text-sm hover:bg-slate-800 transition shadow-lg"
                        >
                            Close & New Bill
                        </button>
                    </div>
                </div>
            )}

            {/* Existing Component Modals */}
            {showScanner && <BarCodeScanner onDetected={handleScan} onClose={() => setShowScanner(false)} />}
            {selectedProduct && <QuantityModel product={selectedProduct} updateCart={updateCart} onCancel={() => setSelectedProduct(null)} />}
            {showResetModal && <ResetModal onConfirm={() => { localStorage.removeItem('Bill'); setCartProduct([]); setShowResetModal(false); }} onCancel={() => setShowResetModal(false)} />}
            {showSubmitModal && <SubmitModal onConfirm={submitBill} onCancel={() => setShowSubmitModal(false)} />}
        </div>
    );
}

export default BillingPage;