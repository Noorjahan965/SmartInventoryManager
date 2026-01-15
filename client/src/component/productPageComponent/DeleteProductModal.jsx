import { IoClose } from "react-icons/io5";

const DeleteProductModal = ({ id, onCancel, fetchProducts }) => {

  const token = localStorage.getItem('Token');

  const deleteProductDb = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/product`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ _id: id })
      });

      const data = await response.json();
      if(response.status === 200) {
        fetchProducts();
        onCancel();
      }
    }
    catch(err) {
    }
  }


  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-60 flex justify-center items-center">
      <div className="bg-white w-87.5 max-w-[90%] rounded-xl shadow-xl border border-slate-200 overflow-hidden animate-fadeIn">

        {/* Header */}
        <div className="flex justify-between items-center px-4 py-3 bg-red-100 border-b border-red-300">
          <h3 className="font-semibold text-lg text-red-700">Are you sure?</h3>
          <button
            onClick={onCancel}
            className="text-slate-700 hover:text-red-600 transition cursor-pointer"
          >
            <IoClose size={22} />
          </button>
        </div>

        {/* Body */}
        <div className="px-4 py-5 text-slate-700 leading-relaxed">
          Do you really want to proceed?
        </div>

        {/* Buttons */}
        <div className="flex justify-end gap-3 px-4 py-3 bg-slate-100 border-t border-slate-300">
          <button
            onClick={onCancel}
            className="px-4 py-2 rounded-md bg-slate-300 hover:bg-slate-400 transition text-sm font-medium cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={() => deleteProductDb()}
            className="px-4 py-2 rounded-md bg-red-600 hover:bg-red-700 text-white transition text-sm font-medium cursor-pointer"
          >
            Confirm
          </button>
        </div>

      </div>
    </div>
  );
};

export default DeleteProductModal;
