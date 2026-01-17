import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";

import BillTab from "./sections/BillTab";
import StockTab from "./sections/StockTab";

const HistoryPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const tabParam = searchParams.get("tab") || "bill";

  const [tab, setTab] = useState(tabParam);

  useEffect(() => {
    setSearchParams({ tab });
  }, [tab]);

  useEffect(() => {
    const param = searchParams.get("tab") || "bill";
    if (param !== tab) setTab(param);
  }, [searchParams]);

  return (
    <div className="p-6 pt-4 space-y-8">

      {/* Header */}
      <div className="flex flex-wrap justify-between items-center gap-3">
        <h2 className="text-3xl font-extrabold tracking-tight text-slate-900">
          History & Records
        </h2>
        <p className="text-sm text-gray-500">View all past billing & stock updates</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-3 border-b pb-1">
        {[
          { id: "bill", label: "Billing History" },
          { id: "stock", label: "Stock History" },
        ].map((item) => (
          <button
            key={item.id}
            onClick={() => setTab(item.id)}
            className={`
              px-4 py-2 rounded-t-md font-semibold 
              transition duration-200 border-b-2 
              ${tab === item.id
                ? "text-blue-600 border-blue-600 bg-blue-100/40"
                : "text-gray-500 border-transparent hover:text-blue-600 hover:bg-gray-100"
              }
            `}
          >
            {item.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="animate-fadeIn">
        {tab === "bill" && <BillTab />}
        {tab === "stock" && <StockTab />}
      </div>
    </div>
  );
};

export default HistoryPage;
