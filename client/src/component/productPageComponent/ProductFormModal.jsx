import { IoClose } from "react-icons/io5";
import { useState, useEffect } from "react";

const ProductFormModal = ({ mode = "add", product = {}, onClose, addProductDb, updateProductDb }) => {

  const [form, setForm] = useState({
    sno: "",               // auto generated
    _id: "",
    productName: "",
    description: "",
    currentQuantity: "",
    cp: "",
    sp: "",
    minQuantity: "",
    location: "",
    variant: ""
  });

  useEffect(() => {
    if (mode === "edit" && product) {
      setForm({
        _id: product._id,
        sno: product.sno,
        productName: product.productName,
        description: product.description || "",
        currentQuantity: product.currentQuantity,
        cp: product.cp,
        sp: product.sp,
        minQuantity: product.minQuantity,
        location: product.location,
        variant: product.variant?.join(", ") || ""
      });
    }
  }, [mode, product]);

  const handleChange = (key, val) => {
    setForm((prev) => ({ ...prev, [key]: val }));
  };

  const submitForm = () => {
    const data = { ...form };

    // backend generates sno — remove it when adding
    if (mode === "add") {
      delete data.sno;
      delete data._id;
    }

    if (mode === 'add') {
      addProductDb(data);
    }
    else {
      updateProductDb(data);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex justify-center items-center">
      <div className="bg-white w-112.5 max-w-[95%] rounded-xl shadow-xl border border-slate-200 overflow-hidden">
        
        {/* HEADER */}
        <div className="flex justify-between items-center px-4 py-3 bg-slate-100 border-b border-slate-300">
          <h3 className="font-semibold text-lg text-slate-800">
            {mode === "edit" ? "Edit Product" : "Add Product"}
          </h3>
          <button onClick={onClose} className="text-slate-700 hover:text-red-600 transition">
            <IoClose size={22} />
          </button>
        </div>

        {/* FORM */}
        <div className="px-4 py-4 space-y-3 max-h-[60vh] overflow-y-auto">
          
          {/* SNO — read only only in EDIT */}
          {mode === "edit" && (
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">
                Serial No
              </label>
              <input
                type="text"
                value={form.sno}
                readOnly
                className="w-full border border-slate-400 bg-slate-100 rounded-md px-3 py-2 text-slate-500 cursor-not-allowed"
              />
            </div>
          )}

          {/* OTHER FIELDS */}
          {[
            ["productName", "Product Name"],
            ["description", "Description"],
            ["currentQuantity", "Quantity"],
            ["cp", "Cost Price"],
            ["sp", "Selling Price"],
            ["minQuantity", "Min Qty"],
            ["location", "Location"]
          ].map(([key, label]) => (
            <div key={key}>
              <label className="block text-sm font-semibold text-slate-700 mb-1">
                {label}
              </label>
              <input
                type="text"
                value={form[key]}
                onChange={(e) => handleChange(key, e.target.value)}
                className="w-full border border-slate-400 rounded-md px-3 py-2 outline-none focus:border-blue-500"
              />
            </div>
          ))}

          {/* Variant */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">
              Variant (comma separated)
            </label>
            <input
              type="text"
              value={form.variant}
              onChange={(e) => handleChange("variant", e.target.value)}
              placeholder="ex: 64GB, Black"
              className="w-full border border-slate-400 rounded-md px-3 py-2 outline-none focus:border-blue-500"
            />
          </div>
        </div>

        {/* ACTIONS */}
        <div className="flex justify-end gap-3 px-4 py-3 bg-slate-100 border-t border-slate-300">
          <button onClick={onClose} className="px-4 py-2 rounded-md bg-slate-300 hover:bg-slate-400 transition text-sm font-medium">
            Cancel
          </button>
          <button onClick={submitForm} className="px-4 py-2 rounded-md bg-blue-600 hover:bg-blue-700 text-white transition text-sm font-medium">
            {mode === "edit" ? "Update" : "Add"}
          </button>
        </div>

      </div>
    </div>
  );
};

export default ProductFormModal;
