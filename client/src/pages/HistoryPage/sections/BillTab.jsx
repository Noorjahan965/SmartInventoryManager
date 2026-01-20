import { useEffect, useState } from "react";

import BillModal from "../../../component/historyPageComponent/BillModal";

function PaidConfirmModal({ sp, show, onConfirm, onCancel }) {
  if (!show) return null;

  const [discount, setDiscount] = useState("");
  const [discountPercent, setDiscountPercent] = useState(0);

  const handleConfirm = (finalAmount) => {
    onConfirm(finalAmount); // send discount back to parent
    setDiscount("");     // reset when closed
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-999">
      <div className="bg-white w-[90%] max-w-xs rounded-xl shadow-xl border border-green-300 p-5 animate-scaleIn">
        
        {/* Icon */}
        <div className="flex justify-center mb-3">
          <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
            <span className="text-green-600 text-2xl">💰</span>
          </div>
        </div>

        {/* Title */}
        <h2 className="text-center text-green-600 font-bold text-lg mb-1">
          Mark as Paid?
        </h2>

        {/* Message */}
        <p className="text-center text-slate-700 text-sm mb-3">
          Did the customer complete payment?
        </p>

		<p className="text-left"><span className="font-bold">Cost</span>: ₹{sp}</p>
		<p className="text-left"><span className="font-bold">Discount</span>: {discountPercent}%</p>
		<p className="text-left"><span className="font-bold">Final price</span>: ₹{sp-discount}</p>

        {/* Discount Input */}
        <div className="mb-4">
          <label className="text-sm font-semibold text-slate-700">Discount (optional)</label>
          <input
            type="number"
            value={discount}
            onChange={(e) => {
				setDiscount(e.target.value)
				setDiscountPercent(Math.round((100-(sp-e.target.value)/sp*100)*100)/100)
			}}
            className="mt-1 w-full border border-slate-300 rounded-lg px-2 py-1.5 text-sm outline-none focus:ring-2 focus:ring-green-400"
            placeholder="₹0"
            min="0"
          />
        </div>

        {/* Buttons */}
        <div className="flex gap-3 mt-3">
          <button
            onClick={onCancel}
            className="w-1/2 bg-slate-400 cursor-pointer text-white text-sm py-2 rounded-lg font-semibold hover:bg-slate-500 active:scale-95 transition"
          >
            No
          </button>

          <button
            onClick={() => {
				const finalAmount = sp - Number(discount);
				console.log("Final: "+finalAmount);
				handleConfirm(finalAmount);
			}}
            className="w-1/2 bg-green-600 cursor-pointer text-white text-sm py-2 rounded-lg font-semibold hover:bg-green-700 active:scale-95 transition"
          >
            Yes
          </button>
        </div>
      </div>

      <style>{`
        .animate-scaleIn {
          animation: scaleIn .2s ease-out;
        }
        @keyframes scaleIn {
          from { transform: scale(.9); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
      `}</style>
    </div>
  );
}



const LogEntiry = ({ log, setBillModal }) => {
	const profit = Number(log.paidAmount) - Number(log.totalCp);

	const [paidStatus, setPaidStatus] = useState(log.isPaid);
	const [payConfirmModal, setPayConfirmModal] = useState(false);

	const updatePaidStatus = async (finalAmount) => {

		if(paidStatus) return;

		const token = localStorage.getItem('Token');
		try {
			const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/stock/paid-status`, {
				method: 'PUT',
				headers: {
						Authorization: `Bearer ${token}`,
						'content-type': 'Application/json'
					},
				body: JSON.stringify({ 
					logId: log._id,
					paidAmount: finalAmount
				})
			})
			const data = await res.json();
			if(res.status === 200) {
				setPayConfirmModal(false);
				setPaidStatus(true);
			}
		}
		catch(err) {

		}
	}

	return (
		<tr key={log._id} className="grid grid-cols-11">
			<td className="py-2 px-2">{log.customerName || "-"}</td>
			<td className="py-2 px-2">{log.mobileNo || "-"}</td>
			<td className="py-2 px-2">{log.author}</td>
			<td className="py-2 px-2 text-right">₹{log.totalCp}</td>
			<td className="py-2 px-2 text-right">₹{log.totalSp}</td>
			<td
				className={`py-2 px-2 text-right font-semibold ${profit >= 0 ? "text-green-600" : "text-red-600"
					}`}
			>
				₹{profit}
			</td>
			<td className="py-2 px-2 text-center">{log.modeOfPayment}</td>
			<td className="flex justify-center items-center">
				<button onClick={() => setPayConfirmModal(true)} className={`${paidStatus ? 'bg-green-200 text-green-500' : 'bg-red-200 text-red-600'} px-3 py-1 cursor-pointer rounded-lg`}>{paidStatus ? "YES" : "NO"}</button>
			</td>
			<td className="p-2 text-center">{log.isPaid ? log.paidAmount : '-'}</td>
			<td className="py-2 px-2 text-right">
				{log.dateAndTime.split(" ")[1]}
			</td>
			<td className="py-2 px-2 text-center">
				<button
					className="text-blue-600 hover:text-blue-800 font-semibold cursor-pointer transition"
					onClick={() => setBillModal(log)}
				>
					View
				</button>
				<PaidConfirmModal sp={log.totalSp} show={payConfirmModal} onConfirm={(finalAmount) => updatePaidStatus(finalAmount)} onCancel={() => setPayConfirmModal(false)} />
			</td>
		</tr>
	);
}

const BillTab = () => {

	const [currentDate, setCurrentDate] = useState("");
	const [logs, setLogs] = useState([]);
	const [loading, setLoading] = useState(false);

	const [billModal, setBillModal] = useState(null);

	
	const fetchBills = async () => {
		const token = localStorage.getItem("Token");
		try {
			setLoading(true);
			const res = await fetch(
				`${import.meta.env.VITE_BACKEND_URL}/api/stock/logs?isBill=true&date=${currentDate}`,
				{
					headers: {
						Authorization: `Bearer ${token}`,
					},
				}
			);

			const data = await res.json();
			if (data?.data) setLogs(data.data);
		} catch (err) {
			console.error(err);
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		fetchBills();
	}, [currentDate]);

	return (
		<div className="space-y-5">
			{/* Filters */}
			<div className="flex flex-wrap items-center justify-between bg-white p-4 rounded-lg shadow-md border">
				<h3 className="text-xl font-bold text-slate-800">Bill History</h3>

				<input
					type="date"
					value={currentDate}
					onChange={(e) => setCurrentDate(e.target.value)}
					className="border px-3 py-2 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 outline-none"
				/>
			</div>

			{/* Data */}
			<div className="bg-white rounded-lg shadow-md p-4 border overflow-hidden">
				{loading ? (
					<p className="text-center text-slate-500 py-8 animate-pulse">
						Loading bills...
					</p>
				) : logs.length === 0 ? (
					<p className="text-center text-slate-500 py-8 italic">
						No bills found for selected date.
					</p>
				) : (
					<div className="overflow-x-auto">
					<table className="w-full text-sm min-w-250">
						<thead className="bg-gray-200 sticky top-0">
							<tr className="grid grid-cols-11 border-b font-semibold">
								<td className="py-2 px-2">Name</td>
								<td className="py-2 px-2">Mobile</td>
								<td className="py-2 px-2">Author</td>
								<td className="py-2 px-2 text-right">CP (₹)</td>
								<td className="py-2 px-2 text-right">SP (₹)</td>
								<td className="py-2 px-2 text-right">Profit (₹)</td>
								<td className="py-2 px-2 text-center">Mode</td>
								<td className="py-2 px-2 text-center">Paid</td>
								<td className="py-2 px-2 text-center">Paid Amount</td>
								<td className="py-2 px-2 text-right">Time</td>
								<td className="py-2 px-2 text-center">View</td>
							</tr>
						</thead>

						<tbody className="block max-h-[50vh] overflow-y-auto divide-y divide-gray-200">
							{logs.map((log) => {
								return <LogEntiry key={log._id} log={log} setBillModal={setBillModal} />
							})}
						</tbody>
					</table>
					</div>
				)}
			</div>

			{billModal &&
				<BillModal bill={billModal} onCancel={() => setBillModal(null)} />
			}

		</div>
	);
};

export default BillTab;
