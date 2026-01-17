export default function SuccessModal({ show, message, onClose }) {
  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-999">
      <div className="bg-white w-[85%] max-w-xs rounded-xl shadow-xl border border-green-300 p-5 animate-scaleIn">

        {/* Icon */}
        <div className="flex justify-center mb-3">
          <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
            <span className="text-green-600 text-2xl">✔️</span>
          </div>
        </div>

        {/* Title */}
        <h2 className="text-center text-green-600 font-bold text-lg mb-1">
          Success!
        </h2>

        {/* Message */}
        <p className="text-center text-slate-700 text-sm">{message}</p>

        {/* Button */}
        <button
          onClick={onClose}
          className="mt-5 w-full bg-green-500 cursor-pointer text-white text-sm py-2 rounded-lg font-semibold hover:bg-green-600 active:scale-95 transition"
        >
          OK
        </button>
      </div>

      {/* Animation */}
      <style>{`
        .animate-scaleIn {
          animation: scaleIn 0.2s ease-out;
        }
        @keyframes scaleIn {
          from {transform: scale(0.9); opacity: 0;}
          to {transform: scale(1); opacity: 1;}
        }
      `}</style>
    </div>
  );
}
