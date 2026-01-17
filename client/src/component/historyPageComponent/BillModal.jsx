import { useState, useEffect } from "react";

const BillModal = ({ bill, onCancel }) => {
  const [records, setRecords] = useState([]);

  const fetchRecords = async () => {
    try {
      const token = localStorage.getItem("Token");

      const res = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/stock/records?logId=${bill._id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await res.json();
      setRecords(data.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchRecords();
  }, []);

  const totalCp = bill.totalCp;
  const totalSp = bill.totalSp;
  const profit = totalSp - totalCp;

  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-start pt-10 px-4 z-50">
      <div className="bg-white w-full max-w-2xl rounded-xl shadow-lg border p-6 flex flex-col space-y-6 animate-scaleIn">

        {/* STORE HEADER */}
        <div className="text-center border-b pb-3">
          <h1 className="text-2xl font-bold text-slate-900">Lulu Mobiles & Services</h1>
          <p className="text-sm text-slate-600">123 Cheranmahadevi Road, Bazzar</p>
          <p className="text-sm text-slate-600">Pettai, Tirunelveli</p>
          <p className="text-sm text-slate-600">Phone: +91 8925369388</p>
          <p className="text-sm text-left text-slate-500 mt-2"><span className="font-bold text-black">Invoice ID:</span> #{bill._id.toUpperCase()}</p>
        </div>

        {/* CUSTOMER + BILL INFO */}
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="space-y-1">
            <p><span className="font-semibold">Customer:</span> {bill.customerName}</p>
            <p><span className="font-semibold">Mobile:</span> {bill.mobileNo}</p>
            <p><span className="font-semibold">Email:</span> {bill.email || "N/A"}</p>
          </div>
          <div className="space-y-1 text-right">
            <p><span className="font-semibold">Date:</span> {bill.dateAndTime.split(" ")[0]}</p>
            <p><span className="font-semibold">Time:</span> {bill.dateAndTime.split(" ")[1]}</p>
            <p><span className="font-semibold">Payment:</span> {bill.modeOfPayment}</p>
            <p>
              <span className="font-semibold">Status:</span>{" "}
              {bill.isPaid ? (
                <span className="text-green-600 font-bold">PAID</span>
              ) : (
                <span className="text-red-600 font-bold">UNPAID</span>
              )}
            </p>
          </div>
        </div>

        {/* LINE ITEMS */}
        <div className="border rounded-lg">
          <table className="w-full text-sm">
            <thead className="bg-gray-100 border-b">
              <tr className="grid grid-cols-5 font-semibold">
                <td className="py-2 px-2">Product</td>
                <td className="py-2 px-2 text-center">Qty</td>
                <td className="py-2 px-2 text-right">CP</td>
                <td className="py-2 px-2 text-right">SP</td>
                <td className="py-2 px-2 text-right">Total</td>
              </tr>
            </thead>

            <tbody className="block max-h-[40vh] overflow-y-auto divide-y divide-gray-200">
              {records.map((rec) => (
                <tr key={rec._id} className="grid grid-cols-5">
                  <td className="py-2 px-2">{rec.productName}</td>
                  <td className="py-2 px-2 text-center">{rec.quantity}</td>
                  <td className="py-2 px-2 text-right">₹{rec.cp}</td>
                  <td className="py-2 px-2 text-right">₹{rec.sp}</td>
                  <td className="py-2 px-2 text-right">
                    ₹{rec.quantity * rec.sp}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* TOTALS */}
        <div className="flex justify-between space-y-1 border-t pt-3">
          <p><span className="font-semibold">Total CP:</span> ₹{totalCp}</p>
          <p><span className="font-semibold">Total SP:</span> ₹{totalSp}</p>
          <p className="font-semibold">
            Profit:{" "}
            <span
              className={profit >= 0 ? "text-green-600" : "text-red-600"}
            >
              ₹{profit}
            </span>
          </p>
        </div>

        {/* FOOTER BUTTONS */}
        <div className="flex justify-end pt-2">
          <button
            onClick={onCancel}
            className="px-4 py-2 rounded-md bg-red-500 text-white hover:bg-red-600 font-semibold"
          >
            Close
          </button>
        </div>

        {/* THANK YOU FOOTER */}
        <p className="text-center text-sm text-slate-500 mt-2">
          Thank you for your purchase!
        </p>
      </div>
    </div>
  );
};

export default BillModal;
