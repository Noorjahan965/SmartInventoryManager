const SubmitModal = ({ onConfirm, onCancel }) => {

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white w-full max-w-sm rounded-lg shadow-lg p-6 animate-scaleIn">
        <h2 className="text-lg font-semibold text-gray-800 mb-3">Submit Bill</h2>

        <p className="text-gray-600 mb-6">
          Are you sure you want to submit this bill?
        </p>

        <div className="flex justify-end gap-3">
          <button
            onClick={onCancel}
            className="px-4 py-2 rounded border border-gray-300 text-gray-700 hover:bg-gray-100"
          >
            Cancel
          </button>

          <button
            onClick={onConfirm}
            className="px-4 py-2 rounded bg-green-600 hover:bg-green-700 text-white"
          >
            Yes, Submit
          </button>
        </div>
      </div>
    </div>
  );
};

export default SubmitModal;
