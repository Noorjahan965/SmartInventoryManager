import { useEffect, useState } from "react";

import BillModal from "../../../component/historyPageComponent/BillModal";

const BillTab = () => {
  const [currentDate, setCurrentDate] = useState("");
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(false);

  const [billModal, setBillModal] = useState(null);

  const fetchBills = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("Token");

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
      <div className="bg-white rounded-lg shadow-md p-4 border">
        {loading ? (
          <p className="text-center text-slate-500 py-8 animate-pulse">
            Loading bills...
          </p>
        ) : logs.length === 0 ? (
          <p className="text-center text-slate-500 py-8 italic">
            No bills found for selected date.
          </p>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-gray-200 sticky top-0">
              <tr className="grid grid-cols-10 border-b font-semibold">
                <td className="py-2 px-2">Name</td>
                <td className="py-2 px-2">Mobile</td>
                <td className="py-2 px-2">Author</td>
                <td className="py-2 px-2 text-right">CP (₹)</td>
                <td className="py-2 px-2 text-right">SP (₹)</td>
                <td className="py-2 px-2 text-right">Profit (₹)</td>
                <td className="py-2 px-2 text-center">Mode</td>
                <td className="py-2 px-2 text-center">Paid</td>
                <td className="py-2 px-2 text-right">Time</td>
                <td className="py-2 px-2 text-center">View</td>
              </tr>
            </thead>

            <tbody className="block max-h-[50vh] overflow-y-auto divide-y divide-gray-200">
              {logs.map((log) => {
                const profit = Number(log.totalSp) - Number(log.totalCp);
                return (
                  <tr key={log._id} className="grid grid-cols-10">
                    <td className="py-2 px-2">{log.customerName || "-"}</td>
                    <td className="py-2 px-2">{log.mobileNo || "-"}</td>
                    <td className="py-2 px-2">{log.author}</td>
                    <td className="py-2 px-2 text-right">₹{log.totalCp}</td>
                    <td className="py-2 px-2 text-right">₹{log.totalSp}</td>
                    <td
                      className={`py-2 px-2 text-right font-semibold ${
                        profit >= 0 ? "text-green-600" : "text-red-600"
                      }`}
                    >
                      ₹{profit}
                    </td>
                    <td className="py-2 px-2 text-center">{log.modeOfPayment}</td>
                    <td
                      className={`py-2 px-2 text-center font-semibold ${
                        log.isPaid ? "text-green-600" : "text-red-600"
                      }`}
                    >
                      {log.isPaid ? "YES" : "NO"}
                    </td>
                    <td className="py-2 px-2 text-right">
                      {log.dateAndTime.split(" ")[1]}
                    </td>
                    <td className="py-2 px-2 text-center">
                      <button
                        className="text-blue-600 hover:text-blue-800 font-semibold"
                        onClick={() => setBillModal(log)}
                      >
                        View
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      {billModal && 
        <BillModal bill={billModal} onCancel={() => setBillModal(null)} />
      }

    </div>
  );
};

export default BillTab;
