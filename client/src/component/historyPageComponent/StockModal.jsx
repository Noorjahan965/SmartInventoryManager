import { useState, useEffect } from "react";

const StockModal = ({ stock, onCancel }) => {
	const [records, setRecords] = useState([]);

	const fetchRecords = async () => {
		try {
			const token = localStorage.getItem("Token");

			const res = await fetch(
				`${import.meta.env.VITE_BACKEND_URL}/api/stock/records?logId=${stock._id}`,
				{
					headers: {
						Authorization: `Bearer ${token}`,
					},
				}
			);

			const data = await res.json();
			if (data?.data) setRecords(data.data);
		} catch (err) {
			console.error(err);
		}
	};

	useEffect(() => {
		fetchRecords();
	}, []);

	// Calculate total CP
	const totalCp = records.reduce((sum, r) => sum + r.cp * r.quantity, 0);

	return (
		<div className="fixed inset-0 bg-black/50 flex justify-center items-start pt-10 px-4 z-50">
			<div className="bg-white w-full max-w-2xl rounded-xl shadow-lg border p-6 flex flex-col space-y-6 animate-scaleIn">

				{/* STORE HEADER */}
				<div className="text-center border-b pb-3">
					<h1 className="text-2xl font-bold text-slate-900">Lulu Mobiles & Services</h1>
					<p className="text-sm text-slate-600">92 Cheranmahadevi Road</p>
					<p className="text-sm text-slate-600">Pettai, Tirunelveli - 627004</p>
					<p className="text-sm text-slate-600">Phone: +91 9629105384, +91 9790525384</p>
					<p className="text-xs text-left text-slate-500"><span className="text-black font-bold">Stock Log ID:</span> #{stock._id.toUpperCase()}</p>
				</div>

				{/* STOCK META INFO */}
				<div className="grid grid-cols-2 gap-4 text-sm">
					<div className="space-y-1">
						<p><span className="font-semibold">Added By:</span> {stock.author}</p>
					</div>
					<div className="space-y-1 text-right">
						<p><span className="font-semibold">Date:</span> {stock.dateAndTime.split(" ")[0]}</p>
						<p><span className="font-semibold">Time:</span> {stock.dateAndTime.split(" ")[1]}</p>
					</div>
				</div>

				{/* LINE ITEMS */}
				<div className="overflow-x-auto border rounded-lg">
					<table className="w-full text-sm min-w-125">
						<thead className="bg-gray-100 border-b">
							<tr className="grid grid-cols-5 font-semibold">
								<td className="py-2 px-2">Sno</td>
								<td className="py-2 px-2">Product</td>
								<td className="py-2 px-2 text-center">Quantity</td>
								<td className="py-2 px-2 text-right">CP (₹)</td>
								<td className="py-2 px-2 text-right">Total CP</td>
							</tr>
						</thead>

						<tbody className="block max-h-[40vh] overflow-y-auto divide-y divide-gray-200">
							{records.map((rec) => (
								<tr key={rec._id} className="grid grid-cols-5">
									<td className="py-2 px-2">{rec.sno}</td>
									<td className="py-2 px-2">{rec.productName}</td>
									<td className="py-2 px-2 text-center">{rec.quantity}</td>
									<td className="py-2 px-2 text-right">₹{rec.cp}</td>
									<td className="py-2 px-2 text-right">₹{rec.cp * rec.quantity}</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>

				{/* TOTAL CP */}
				<div className="text-right space-y-1 border-t pt-3 text-lg font-semibold">
					Total CP: ₹{totalCp}
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

				<p className="text-center text-sm text-slate-500 mt-2">
					Stock added successfully!
				</p>
			</div>
		</div>
	);
};

export default StockModal;
