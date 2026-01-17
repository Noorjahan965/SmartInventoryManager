import { IoClose } from "react-icons/io5";
import { useState, useEffect } from "react";
import { locations } from "../../constants/metaData";

const ProductFormModal = ({ mode = "add", product = {}, onClose, addProductDb, updateProductDb }) => {

  const [form, setForm] = useState({
    sno: "",
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

  const [errors, setErrors] = useState({});

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
    setErrors((prev) => ({ ...prev, [key]: "" })); // clear error
  };

  const validate = () => {
    let newErrors = {};

    if (!form.productName.trim()) newErrors.productName = "Product name is required";
    if (!form.currentQuantity) newErrors.currentQuantity = "Quantity is required";
    if (!form.cp) newErrors.cp = "Cost Price is required";
    if (!form.sp) newErrors.sp = "Selling Price is required";
    if (!form.minQuantity) newErrors.minQuantity = "Min quantity is required";
    if (!form.location) newErrors.location = "Location is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const submitForm = () => {
    if (!validate()) return;

    const data = {
      ...form,
      currentQuantity: Number(form.currentQuantity),
      cp: Number(form.cp),
      sp: Number(form.sp),
      minQuantity: Number(form.minQuantity),
      variant: form.variant ? form.variant.split(",").map(v => v.trim()) : []
    };

    if (mode === "add") {
      delete data.sno;
      delete data._id;
      addProductDb(data);
    } else {
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
          <button onClick={onClose} className="text-slate-700 hover:text-red-600 cursor-pointer transition">
            <IoClose size={22} />
          </button>
        </div>

        {/* FORM */}
        <div className="px-4 py-4 space-y-3 max-h-[60vh] overflow-y-auto">
          
          {/* SNO */}
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

          {/* PRODUCT NAME */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">
              Product Name *
            </label>
            <input
              type="text"
              value={form.productName}
              onChange={(e) => handleChange("productName", e.target.value)}
              className="w-full border border-slate-400 rounded-md px-3 py-2 outline-none focus:border-blue-500"
            />
            {errors.productName && <p className="text-red-500 text-xs">{errors.productName}</p>}
          </div>

          {/* DESCRIPTION */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">
              Description
            </label>
            <input
              type="text"
              value={form.description}
              onChange={(e) => handleChange("description", e.target.value)}
              className="w-full border border-slate-400 rounded-md px-3 py-2 outline-none focus:border-blue-500"
            />
          </div>

          {/* NUMBER FIELDS */}
          {[
            ["currentQuantity", "Quantity *"],
            ["cp", "Cost Price *"],
            ["sp", "Selling Price *"],
            ["minQuantity", "Min Qty *"]
          ].map(([key, label]) => (
            <div key={key}>
              <label className="block text-sm font-semibold text-slate-700 mb-1">
                {label}
              </label>
              <input
                type="number"
                value={form[key]}
                min={0}
                onChange={(e) => handleChange(key, e.target.value)}
                className="w-full border border-slate-400 rounded-md px-3 py-2 outline-none focus:border-blue-500"
              />
              {errors[key] && <p className="text-red-500 text-xs">{errors[key]}</p>}
            </div>
          ))}

          {/* LOCATION */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">
              Location *
            </label>
            <select
              value={form.location}
              onChange={(e) => handleChange("location", e.target.value)}
              className="cursor-pointer w-full border border-slate-400 rounded-md px-3 py-2 bg-white outline-none focus:border-blue-500"
            >
              {locations.map((loc) => (
                <option key={loc} value={loc}>
                  {loc === "" ? "Select Location" : loc}
                </option>
              ))}
            </select>
            {errors.location && <p className="text-red-500 text-xs">{errors.location}</p>}
          </div>

          {/* VARIANT */}
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
          <button onClick={onClose} className="px-4 py-2 rounded-md bg-slate-300 hover:bg-slate-400 transition text-sm font-medium cursor-pointer">
            Cancel
          </button>
          <button onClick={submitForm} className="px-4 py-2 rounded-md bg-blue-600 hover:bg-blue-800 text-white transition text-sm font-medium cursor-pointer">
            {mode === "edit" ? "Update" : "Add"}
          </button>
        </div>

      </div>
    </div>
  );
};

export default ProductFormModal;