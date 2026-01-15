import { IoClose } from "react-icons/io5";
import BarCode from "./BarCode";

const BarCodePopup = ({ value, productName, setSelectedBarcode }) => {
  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex justify-center items-center">
      {/* CARD */}
      <div className="bg-white w-[350px] max-w-[90%] rounded-xl shadow-xl border border-slate-200 overflow-hidden animate-fadeIn">
        
        {/* HEADER */}
        <div className="flex justify-between items-center px-4 py-3 bg-slate-100 border-b border-slate-300">
          <h3 className="font-semibold text-lg text-slate-800">Product Barcode</h3>
          <button
            onClick={() => setSelectedBarcode(null)}
            className="text-slate-700 hover:text-red-600 transition"
          >
            <IoClose size={22} className="cursor-pointer" />
          </button>
        </div>

        {/* DETAILS */}
        <div className="px-4 py-3 space-y-1 text-slate-700">
          <p><b>Product:</b> {productName}</p>
          <p><b>S.No:</b> {value}</p>
        </div>

        {/* BARCODE */}
        <div className="px-4 py-3 flex justify-center border-t border-slate-200">
          <BarCode value={value} width={2} height={50} />
        </div>
        <p className="text-center mb-1.5">{value}</p>

        {/* ACTIONS */}
        <div className="flex justify-end gap-3 px-4 py-3 bg-slate-100 border-t border-slate-300">
          <button
            onClick={() => setSelectedBarcode(null)}
            className="px-4 py-2 rounded-md bg-slate-300 hover:bg-slate-400 transition text-sm font-medium cursor-pointer"
          >
            Close
          </button>
          <button
            className="px-4 py-2 rounded-md bg-blue-600 hover:bg-blue-800 text-white transition text-sm font-medium cursor-pointer"
          >
            Print
          </button>
        </div>
      </div>
    </div>
  );
};

export default BarCodePopup;
