import { useState, useEffect } from "react";
import { FiSearch } from "react-icons/fi";
import { IoMdBarcode } from "react-icons/io";
import { Pencil, Trash2 } from "lucide-react";

import BarCodeScanner from "../../component/barcode/BarCodeScanner";
import QuantityModel from "../../component/billingPageComponent/QuantityModel";

import ResetModal from "../../component/billingPageComponent/ResetModal";
import SubmitModal from "../../component/billingPageComponent/SubmitModal";
import AlertModal from "../../component/message/AlertModal";
import SuccessModal from "../../component/message/SuccessModal";

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

    const [alertModal, setAlertModal] = useState(false);
    const [alertMessage, setAlertMessage] = useState('');
    const [successModal, setSuccessModal] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');

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
            setSelectedProduct(data.data);
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

    const resetBillData = () => {
        setCustomerName('');
        setMobileNo('');
        setEmail('');
        setPaymentType('');
    }

    const submitBill = async () => {
        if(customerName.trim() === '' || mobileNo === '' || paymentType === '') {
            setAlertMessage('Please fill the necessary fields.')
            setAlertModal(true);
            return;
        }
        const billingProduct = JSON.parse(localStorage.getItem('Bill')) || [];
        if(billingProduct.length === 0) {
            setAlertMessage('No products in the card.');
            setAlertModal(true);
            return;
        }
        let bill = {
            authorName: localStorage.getItem('UserName'),
            customerName: customerName,
            mobileNo: mobileNo,
            email: email,
            modeOfPayment: paymentType,
            product: billingProduct
        }
        const token = localStorage.getItem('Token');
        try {
            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/stock/bill`, {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(bill)
            })
            const data = await response.json();
            localStorage.removeItem('Bill')
            setCartProduct([]);
            resetBillData();
            setShowSubmitModal(false);
            if(response.status === 201) {
                setSuccessMessage('Bill Created Successfully.')
                setSuccessModal(true);
            }
        }
        catch(err) {

        }
    }

    return (
  <div className="md:p-3 md:pt-2 max-w-full overflow-hidden">

    {/* Header */}
    <div className="flex flex-wrap justify-between items-center gap-3">
      <h3 className="text-2xl sm:text-3xl font-bold text-slate-900">Billing</h3>
      <p className="text-sm sm:text-base">
        <span className="font-bold">Invoice Date:</span> {new Date().toLocaleDateString()}
      </p>
    </div>

    {/* Customer Form */}
<form className="
  grid grid-cols-2 gap-3 
  sm:flex sm:flex-wrap sm:items-end sm:gap-4 
  bg-white shadow p-3 sm:p-6 rounded w-full
">

  {/* Customer Name */}
  <div className="flex flex-col col-span-2 sm:col-span-1 sm:w-64">
    <label className="font-medium text-xs sm:text-base">Customer Name</label>
    <input
      value={customerName}
      onChange={(e) => setCustomerName(e.target.value)}
      type="text"
      className="border p-1.5 sm:p-2 rounded w-full text-xs sm:text-sm"
      placeholder="Enter name"
    />
  </div>

  {/* Mobile No */}
  <div className="flex flex-col">
    <label className="font-medium text-xs sm:text-base">Mobile No</label>
    <input
      type="number"
      value={mobileNo}
      onChange={(e) => setMobileNo(e.target.value)}
      className="border p-1.5 sm:p-2 rounded w-full text-xs sm:text-sm"
      placeholder="9876543210"
    />
  </div>

  {/* Email */}
  <div className="flex flex-col">
    <label className="font-medium text-xs sm:text-base">Email</label>
    <input
      type="email"
      value={email}
      onChange={(e) => setEmail(e.target.value)}
      className="border p-1.5 sm:p-2 rounded w-full text-xs sm:text-sm"
      placeholder="customer@example.com"
    />
  </div>

  {/* Payment Type */}
  <div className="flex flex-col col-span-2 sm:col-span-1 sm:w-48">
    <label className="font-medium text-xs sm:text-base">Payment Type</label>
    <select
      value={paymentType}
      onChange={(e) => setPaymentType(e.target.value)}
      className="border p-1.5 sm:p-2 rounded w-full cursor-pointer text-xs sm:text-sm"
    >
      <option disabled value="">Select</option>
      <option value="CASH">Cash</option>
      <option value="UPI">UPI</option>
    </select>
  </div>

  {/* Reset Button */}
  <div className="col-span-2 sm:w-auto">
    <button
      onClick={() => resetBillData()}
      type="button"
      className="bg-blue-600 text-white px-3 py-1.5 sm:px-4 sm:py-2 rounded w-full font-medium sm:font-semibold text-xs sm:text-sm hover:bg-blue-800 transition cursor-pointer"
    >
      Reset
    </button>
  </div>

</form>



    {/* Main Split */}
    <div className="flex flex-col lg:flex-row min-h-[65dvh] gap-4">

      {/* Products */}
      <div className="bg-white w-full max-md:max-h-[50dvh] lg:w-[40%] p-3 sm:p-4 rounded-lg shadow-lg space-y-4 overflow-y-auto">
        <h4 className="text-lg sm:text-xl font-bold text-slate-800">Products</h4>

        {/* Search */}
        <div className="flex items-center gap-3 flex-wrap sm:flex-nowrap">
          <div className="flex items-center gap-2 bg-white border border-slate-300 px-3 py-2 rounded-lg md:w-full shadow-sm">
            <FiSearch className="text-slate-500" />
            <input
              type="text"
              placeholder="Product Name / Sno"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-transparent outline-none text-slate-900"
            />
          </div>

          <IoMdBarcode
            onClick={() => setShowScanner(true)}
            size={28}
            className="cursor-pointer text-slate-700 hover:scale-110 transition"
          />
        </div>

        {loading && <p className="text-blue-600 font-semibold">Loading...</p>}
        {error && <p className="text-red-600 font-semibold">{error}</p>}

        <div className="space-y-3 overflow-y-auto max-h-[60vh] pr-1">
          {products.map((p) => (
            <div
              key={p._id}
              draggable
              onDragStart={(e) => e.dataTransfer.setData("application/json", JSON.stringify(p))}
              className="cursor-grab rounded-lg border border-slate-200 p-3 shadow-sm hover:shadow-md transition"
            >
              <div className="flex justify-between items-start gap-2">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1 text-sm sm:text-md text-slate-700">
                  <p><span className="font-bold">Sno:</span> {p.sno}</p>
                  <p><span className="font-bold">Name:</span> {p.productName}</p>
                  <p><span className="font-bold">Price:</span> ₹{p.sp}</p>
                  <p><span className="font-bold">Qty:</span> {p.currentQuantity}</p>
                  <p><span className="font-bold">Location:</span> {p.location}</p>
                  <p className="col-span-2 line-clamp-1"><span className="font-bold">Desc:</span> {p.description}</p>
                  {p.variant && (<p className="col-span-2 line-clamp-1"><span className="font-bold">Variant:</span> {p.variant}</p>)}
                </div>
                <button
                  onClick={() => setSelectedProduct({ ...p, qty: 1 })}
                  className="cursor-pointer bg-blue-600 text-white px-3 py-1 rounded-md text-xs sm:text-sm font-semibold hover:bg-blue-800 transition"
                >
                  ADD
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Cart */}
      <div
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
        className="bg-white w-full lg:w-[60%] p-3 sm:p-4 rounded-lg shadow-lg space-y-4 border border-gray-300"
      >
        <h4 className="text-lg sm:text-xl font-bold text-slate-800 text-center border-b pb-2 tracking-wider">
          Cart & Billing
        </h4>

<table className="w-full text-xs sm:text-sm table-fixed">
  <thead>
    <tr className="grid grid-cols-4 sm:grid-cols-6 border-b font-semibold bg-gray-200">
      <td className="py-2 px-2">Sno</td>
      <td className="py-2 px-2">Name</td>
      <td className="py-2 px-2 text-right">Qty</td>
      <td className="py-2 px-2 text-center">Act</td>

      {/* Desktop only */}
      <td className="py-2 px-2 text-right hidden sm:block">Price</td>
      <td className="py-2 px-2 text-right hidden sm:block">Total</td>
    </tr>
  </thead>

  <tbody className="block max-h-[45vh] overflow-y-auto divide-y divide-gray-200">
    {cartProduct.map((p) => (
      <tr key={p._id} className="grid grid-cols-4 sm:grid-cols-6 items-center">
        <td className="py-2 px-2">{p.sno}</td>
        <td className="py-2 px-2 truncate">{p.productName}</td>
        <td className="py-2 px-2 text-right">{p.qty}</td>

        {/* Desktop-only columns */}
        <td className="py-2 px-2 text-right hidden sm:block">₹{p.sp}</td>
        <td className="py-2 px-2 text-right hidden sm:block">{p.total}</td>

        {/* Actions always visible */}
        <td className="py-2 px-2 text-center flex items-center justify-center gap-2">
          <button onClick={() => setSelectedProduct(p)} className="text-blue-600 hover:text-blue-800">
            <Pencil size={16} />
          </button>
          <button onClick={() => removeItem(p._id)} className="text-red-600 hover:text-red-800">
            <Trash2 size={16} />
          </button>
        </td>
      </tr>
    ))}

    {cartProduct.length === 0 && (
      <tr className="grid grid-cols-1">
        <td className="text-center text-slate-500 py-6 italic">
          Nothing here yet... 😊
        </td>
      </tr>
    )}
  </tbody>

  <tfoot className="border-t font-bold">
    <tr className="grid grid-cols-4 sm:grid-cols-6">
      <td className="py-2 px-2 col-span-3 sm:col-span-5">Total</td>
      <td className="py-2 px-2 text-right">
        ₹{cartProduct.reduce((t, p) => t + p.sp * p.qty, 0)}
      </td>
    </tr>
  </tfoot>
</table>



        <div className="flex flex-wrap justify-between gap-3 pt-2 border-t border-gray-300">
          <button
            onClick={() => setShowResetModal(true)}
            className="px-3 py-2 bg-red-500 text-white cursor-pointer rounded hover:bg-red-700 transition font-bold"
          >
            Reset Cart
          </button>
          <button
            onClick={() => setShowSubmitModal(true)}
            className="px-3 py-2 bg-green-600 cursor-pointer text-white rounded hover:bg-green-800 transition font-bold"
          >
            Submit Bill
          </button>
        </div>
      </div>
    </div>

    {/* Modals */}
    {showScanner && (
      <BarCodeScanner onDetected={handleScan} onClose={() => setShowScanner(false)} />
    )}

    {selectedProduct && (
      <QuantityModel product={selectedProduct} updateCart={updateCart} onCancel={() => setSelectedProduct(null)} />
    )}

    {showResetModal && (
      <ResetModal
        onConfirm={() => {
          localStorage.removeItem('Bill');
          setCartProduct([]);
          setShowResetModal(false);
        }}
        onCancel={() => setShowResetModal(false)}
      />
    )}

    {showSubmitModal && (
      <SubmitModal
        onConfirm={() => submitBill()}
        onCancel={() => setShowSubmitModal(false)}
      />
    )}

    <AlertModal show={alertModal} onClose={() => setAlertModal(false)} message={alertMessage} />
    <SuccessModal show={successModal} onClose={() => setSuccessModal(false)} message={successMessage} />
  </div>
);

}

export default BillingPage;