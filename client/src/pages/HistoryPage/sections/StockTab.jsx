import { useEffect, useState } from "react";

import StockModal from "../../../component/historyPageComponent/StockModal";

const StockTab = () => {
	const [currentDate, setCurrentDate] = useState("");
	const [logs, setLogs] = useState([]);
	const [loading, setLoading] = useState(false);

	const [stockModal, setStockModal] = useState(null);

	const fetchAddStock = async () => {
		try {
			setLoading(true);
			const token = localStorage.getItem("Token");

			const res = await fetch(
				`${import.meta.env.VITE_BACKEND_URL}/api/stock/logs?isBill=false&date=${currentDate}`,
				{
					headers: {
						Authorization: `Bearer ${token}`,
					},
				}
			);

			const data = await res.json();
			if (data?.data) setLogs(data.data);
		} catch (err) {
			console.log(err.message);
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		fetchAddStock();
	}, [currentDate]);

	return (
		<div className="space-y-5">
			{/* FILTER */}
			<div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-4 shadow-md border rounded-lg">
				<h3 className="text-xl font-bold text-slate-800">Stock History</h3>

				<input
					type="date"
					value={currentDate}
					onChange={(e) => setCurrentDate(e.target.value)}
					className="border px-3 py-2 rounded-md shadow focus:ring-2 focus:ring-blue-500 outline-none"
				/>
			</div>

			{/* RESULTS */}
			<div className="space-y-4">
				{loading ? (
					<p className="text-center text-slate-500 py-10 animate-pulse">
						Loading stock logs...
					</p>
				) : logs.length === 0 ? (
					<p className="text-center text-slate-500 italic py-10">
						No stock added on this date.
					</p>
				) : (
					logs.map((log) => {
						const [date, time] = log.dateAndTime.split(" ");
						return (
							<div
								key={log._id}
								className="bg-white border shadow-sm rounded-xl p-4 flex flex-col gap-1 hover:shadow-lg transition"
							>
								<div className="flex justify-between items-center">
									<h4 className="font-semibold text-slate-800 text-lg">
										{log.author}
									</h4>

									<button
										className="text-blue-600 font-semibold hover:text-blue-800 transition cursor-pointer"
										onClick={() => setStockModal(log)}
									>
										View
									</button>
								</div>

								<p className="text-sm text-slate-600">
									Added stock on <span className="font-medium">{date}</span> at{" "}
									<span className="font-medium">{time}</span>
								</p>

								<p className="text-sm font-semibold text-green-700">
									Total Cost Price: ₹{log.totalCp}
								</p>
							</div>
						);
					})
				)}
			</div>

			{stockModal &&
				<StockModal stock={stockModal} onCancel={() => setStockModal(null)} />
			}

		</div>
	);
};

export default StockTab;
