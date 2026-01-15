import { IoClose } from "react-icons/io5";

const DeleteProductModal = ({
  title = "Are you sure?",
  message = "Do you really want to proceed?",
  confirmText = "Confirm",
  cancelText = "Cancel",
  onConfirm,
  onCancel
}) => {
  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-60 flex justify-center items-center">
      <div className="bg-white w-87.5 max-w-[90%] rounded-xl shadow-xl border border-slate-200 overflow-hidden animate-fadeIn">

        {/* Header */}
        <div className="flex justify-between items-center px-4 py-3 bg-red-100 border-b border-red-300">
          <h3 className="font-semibold text-lg text-red-700">{title}</h3>
          <button
            onClick={onCancel}
            className="text-slate-700 hover:text-red-600 transition"
          >
            <IoClose size={22} />
          </button>
        </div>

        {/* Body */}
        <div className="px-4 py-5 text-slate-700 leading-relaxed">
          {message}
        </div>

        {/* Buttons */}
        <div className="flex justify-end gap-3 px-4 py-3 bg-slate-100 border-t border-slate-300">
          <button
            onClick={onCancel}
            className="px-4 py-2 rounded-md bg-slate-300 hover:bg-slate-400 transition text-sm font-medium"
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 rounded-md bg-red-600 hover:bg-red-700 text-white transition text-sm font-medium"
          >
            {confirmText}
          </button>
        </div>

      </div>
    </div>
  );
};

export default DeleteProductModal;
