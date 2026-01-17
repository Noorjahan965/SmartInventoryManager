const ResetModal = ({ onConfirm, onCancel }) => {

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white w-[80%] md:w-full max-w-sm rounded-lg shadow-lg p-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-3">Reset Cart</h2>

        <p className="text-gray-600 mb-6">
          Are you sure you want to reset the cart?  
          This action cannot be undone.
        </p>

        <div className="flex justify-end gap-3">
          <button
            onClick={onCancel}
            className="px-4 py-2 rounded border transition cursor-pointer border-gray-300 text-gray-700 hover:bg-gray-100"
          >
            Cancel
          </button>

          <button
            onClick={onConfirm}
            className="px-4 py-2 rounded bg-red-500 hover:bg-red-700 transition cursor-pointer text-white"
          >
            Yes, Reset
          </button>
        </div>
      </div>
    </div>
  );
};

export default ResetModal;
