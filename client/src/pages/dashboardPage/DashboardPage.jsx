import { useEffect, useState } from "react";
import {
  FiBox,
  FiTrendingUp,
  FiAlertCircle,
  FiLayers,
  FiDollarSign,
} from "react-icons/fi";
import {
  AreaChart,
  Area,
  XAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const DashboardPage = () => {
  const token = localStorage.getItem("Token");

  const [stats, setStats] = useState({
    totalRevenue: 0,
    totalProfit: 0,
    totalStockValue: 0,
    totalItems: 0,
    lowStock: 0,
    outOfStock: 0,
  });

  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const [productRes, logRes] = await Promise.all([
          fetch(`${import.meta.env.VITE_BACKEND_URL}/api/product/all`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch(`${import.meta.env.VITE_BACKEND_URL}/api/stock/logs?isBill=true`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        const productJson = await productRes.json();
        const logJson = await logRes.json();

        const products = productJson.data.data;
        const logs = logJson.data;

        // 📦 Inventory Metrics
        const totalItems = products.length;
        const lowStock = products.filter(
          (p) => p.currentQuantity > 0 && p.currentQuantity <= p.minQuantity
        ).length;
        const outOfStock = products.filter((p) => p.currentQuantity <= 0).length;
        const totalStockValue = products.reduce(
          (acc, p) => acc + p.currentQuantity * p.cp,
          0
        );

        // 💰 Financial Metrics
        const totalRevenue = logs.reduce((acc, l) => acc + (l.totalSp || 0), 0);
        const totalCost = logs.reduce((acc, l) => acc + (l.totalCp || 0), 0);
        const totalProfit = totalRevenue - totalCost;

        setStats({
          totalRevenue,
          totalProfit,
          totalStockValue,
          totalItems,
          lowStock,
          outOfStock,
        });

        // 📊 Chart Data (Last 10 Bills)
        const chart = logs.slice(-10).map((l) => ({
          date: l.dateAndTime.split(",")[0],
          revenue: l.totalSp,
          profit: l.totalSp - l.totalCp,
        }));

        setChartData(chart);
      } catch (err) {
        setError("Failed to load dashboard data");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, [token]);

  if (loading)
    return (
      <div className="h-screen flex items-center justify-center text-indigo-600 font-black animate-pulse">
        LULU LOADING...
      </div>
    );

  if (error)
    return (
      <div className="h-screen flex items-center justify-center text-red-500 font-bold">
        {error}
      </div>
    );

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-8 space-y-8 bg-[#f8fafc] min-h-screen">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight italic">
            LULU ANALYTICS
          </h1>
          <p className="text-slate-400 font-bold text-xs uppercase tracking-[0.3em]">
            Premium Inventory Intelligence
          </p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Revenue */}
        <div className="bg-indigo-600 p-6 rounded-[2.5rem] text-white shadow-2xl shadow-indigo-200 flex flex-col justify-between h-44">
          <div className="flex justify-between items-start">
            <FiTrendingUp size={28} className="opacity-50" />
            <span className="text-[10px] font-black bg-white/20 px-2 py-1 rounded-lg">
              LIVE
            </span>
          </div>
          <div>
            <p className="text-indigo-200 font-bold text-[10px] uppercase">
              Total Revenue
            </p>
            <h2 className="text-3xl font-black">
              ₹{stats.totalRevenue.toLocaleString()}
            </h2>
          </div>
        </div>

        {/* Profit */}
        <div className="bg-white p-6 rounded-[2.5rem] border border-slate-200 shadow-sm flex flex-col justify-between h-44">
          <div className="bg-emerald-100 text-emerald-600 w-10 h-10 rounded-2xl flex items-center justify-center shadow-inner">
            <FiDollarSign size={20} />
          </div>
          <div>
            <p className="text-slate-400 font-bold text-[10px] uppercase">
              Net Profit
            </p>
            <h2 className="text-3xl font-black text-slate-800">
              ₹{stats.totalProfit.toLocaleString()}
            </h2>
          </div>
        </div>

        {/* Stock Value */}
        <div className="bg-white p-6 rounded-[2.5rem] border border-slate-200 shadow-sm flex flex-col justify-between h-44">
          <div className="bg-blue-100 text-blue-600 w-10 h-10 rounded-2xl flex items-center justify-center">
            <FiLayers size={20} />
          </div>
          <div>
            <p className="text-slate-400 font-bold text-[10px] uppercase">
              Asset Value
            </p>
            <h2 className="text-3xl font-black text-slate-800">
              ₹{stats.totalStockValue.toLocaleString()}
            </h2>
          </div>
        </div>

        {/* Total Items */}
        <div className="bg-white p-6 rounded-[2.5rem] border border-slate-200 shadow-sm flex flex-col justify-between h-44">
          <div className="bg-purple-100 text-purple-600 w-10 h-10 rounded-2xl flex items-center justify-center">
            <FiBox size={20} />
          </div>
          <div>
            <p className="text-slate-400 font-bold text-[10px] uppercase">
              Total SKUs
            </p>
            <h2 className="text-3xl font-black text-slate-800">
              {stats.totalItems}
            </h2>
          </div>
        </div>
      </div>

      {/* Charts + Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Revenue Graph */}
        <div className="lg:col-span-2 bg-white p-8 rounded-[3rem] border border-slate-200 shadow-sm">
          <div className="flex justify-between items-center mb-8">
            <h3 className="font-black text-slate-800 text-sm uppercase">
              Financial Performance
            </h3>
            <div className="flex gap-4">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 bg-indigo-500 rounded-full"></span>
                <span className="text-[10px] font-bold text-slate-400">
                  REV
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 bg-emerald-400 rounded-full"></span>
                <span className="text-[10px] font-bold text-slate-400">
                  PROFIT
                </span>
              </div>
            </div>
          </div>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.1} />
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="date" hide />
                <Tooltip
                  contentStyle={{
                    borderRadius: "15px",
                    border: "none",
                    boxShadow:
                      "0 10px 15px -3px rgb(0 0 0 / 0.1)",
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke="#6366f1"
                  strokeWidth={4}
                  fillOpacity={1}
                  fill="url(#colorRev)"
                />
                <Area
                  type="monotone"
                  dataKey="profit"
                  stroke="#10b981"
                  strokeWidth={3}
                  fill="transparent"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Stock Health */}
        <div className="space-y-6">
          {/* Out of Stock */}
          <div className="bg-rose-50 border border-rose-100 p-8 rounded-[2.5rem] relative overflow-hidden">
            <FiAlertCircle className="absolute right-[-5%] top-[-5%] text-rose-500/10 text-8xl" />
            <p className="text-rose-400 font-black text-[10px] uppercase tracking-widest mb-1">
              Stock Critical
            </p>
            <h4 className="text-4xl font-black text-rose-600">
              {stats.outOfStock}
            </h4>
            <p className="text-rose-500 text-xs font-bold mt-1">
              Items currently out of stock
            </p>
          </div>

          {/* Low Stock */}
          <div className="bg-orange-50 border border-orange-100 p-8 rounded-[2.5rem]">
            <p className="text-orange-400 font-black text-[10px] uppercase tracking-widest mb-1">
              Reorder Required
            </p>
            <h4 className="text-4xl font-black text-orange-600">
              {stats.lowStock}
            </h4>
            <p className="text-orange-500 text-xs font-bold mt-1">
              Items below minimum qty
            </p>
          </div>

          {/* Inventory Health */}
          <div className="bg-slate-900 p-8 rounded-[2.5rem] text-white">
            <div className="flex justify-between items-end mb-4">
              <p className="text-[10px] font-black text-slate-500 uppercase">
                Inventory Health
              </p>
              <p className="text-xl font-black">
                {stats.totalItems
                  ? Math.round(
                      ((stats.totalItems - stats.outOfStock) /
                        stats.totalItems) *
                        100
                    )
                  : 0}
                %
              </p>
            </div>
            <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
              <div
                className="bg-indigo-500 h-full transition-all duration-1000"
                style={{
                  width: `${
                    stats.totalItems
                      ? ((stats.totalItems - stats.outOfStock) /
                          stats.totalItems) *
                        100
                      : 0
                  }%`,
                }}
              ></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
