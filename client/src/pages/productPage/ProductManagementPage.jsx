import { useState, useEffect } from "react";
import { FiPlus, FiEdit, FiTrash2, FiSearch } from "react-icons/fi";

import ProductFormModal from "../../component/productPageComponent/ProductFormModal";
import DeleteProductModal from "../../component/productPageComponent/DeleteProductModal";
import BarCode from "../../component/barcode/BarCode";
import BarCodePopup from "../../component/barcode/BarCodePopup";

import { locations } from "../../constants/metaData";

const ProductManagementPage = () => {
  const token = localStorage.getItem('Token');
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedBarcode, setSelectedBarcode] = useState(null);
  const [selectedProductName, setSelectedProductName] = useState("");

  const [showModal, setShowModal] = useState(false);
  const [editProduct, setEditProduct] = useState(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [filters, setFilters] = useState({
    qty: "none",
    cp: "none",
    sp: "none",
    location: "",
  });

  // Fetch from backend whenever filter/search changes
  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError("");

      const query = new URLSearchParams({
        search: searchTerm.trim(),
        location: filters.location,
        qty: filters.qty,
        cp: filters.cp,
        sp: filters.sp,
      }).toString();

      const token = localStorage.getItem("Token");

      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/product/all?${query}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();
      if (data.status === "FAILED") {
        setError(data.message);
        setProducts([]);
      } else {
        setProducts(data.data.data);
      }
    } catch (err) {
      setError("Unable to fetch products.");
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };
  const addProductDb = async (product) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/product`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(product)
      });

      const data = await response.json();
      setShowModal(false);
      setSelectedBarcode(data.data.sno);
      setSelectedProductName(data.data.productName);
      fetchProducts();
    }
    catch(err) {
      console.log(err.message)
    }
  }

  const updateProductDb = async (product) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/product`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(product)
      });

      const data = await response.json();
      setShowModal(false);
      fetchProducts();
    }
    catch(err) {
      console.log(err.message)
    }
  }

  const deleteProductDb = async (_id) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/product`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ _id: _id })
      });

      const data = await response.json();
      fetchProducts();
    }
    catch(err) {
      console.log(err.message)
    }
  }

  useEffect(() => {
    fetchProducts();
  }, [searchTerm, filters]);

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-wrap justify-between items-center gap-3">
        <h2 className="text-3xl font-bold text-slate-900">Product Management</h2>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-800 cursor-pointer text-white font-semibold px-4 py-2 rounded-lg transition"
        >
          <FiPlus size={18} />
          Add Product
        </button>
      </div>

      {/* Search */}
      <div className="flex items-center gap-2 bg-white border border-slate-400 px-3 py-2 rounded-lg w-full max-w-md shadow-sm">
        <FiSearch className="text-slate-600" />
        <input
          type="text"
          placeholder="Search products..."
          className="w-full bg-transparent outline-none text-slate-900"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-4 items-center">
        <select
          className="border px-3 py-2 rounded-lg bg-white border-slate-400 text-slate-900"
          value={filters.qty}
          onChange={(e) => setFilters({ ...filters, qty: e.target.value })}
        >
          <option value="none">Qty Sort</option>
          <option value="asc">Low → High</option>
          <option value="desc">High → Low</option>
        </select>

        <select
          className="border px-3 py-2 rounded-lg bg-white border-slate-400 text-slate-900"
          value={filters.cp}
          onChange={(e) => setFilters({ ...filters, cp: e.target.value })}
        >
          <option value="none">CP Sort</option>
          <option value="asc">Low → High</option>
          <option value="desc">High → Low</option>
        </select>

        <select
          className="border px-3 py-2 rounded-lg bg-white border-slate-400 text-slate-900"
          value={filters.sp}
          onChange={(e) => setFilters({ ...filters, sp: e.target.value })}
        >
          <option value="none">SP Sort</option>
          <option value="asc">Low → High</option>
          <option value="desc">High → Low</option>
        </select>

        <select
          className="border px-3 py-2 rounded-lg bg-white border-slate-400 text-slate-900"
          value={filters.location}
          onChange={(e) => setFilters({ ...filters, location: e.target.value })}
        >
          {locations.map((loc) => (
            <option key={loc} value={loc}>
              {loc === "" ? "All Locations" : loc}
            </option>
          ))}
        </select>

        <button onClick={() => {
          setFilters({
            qty: "none",
            cp: "none",
            sp: "none",
            location: "",
          });
          setSearchTerm('');
        }} className="bg-blue-600 hover:bg-blue-800 cursor-pointer text-white font-semibold px-4 py-2 rounded-md transition-all">Reset</button>
      </div>

      {/* Loading / Error */}
      {loading && <p className="text-blue-600 font-semibold">Loading products...</p>}
      {error && <p className="text-red-600 font-semibold">{error}</p>}

      {/* Table */}
      <div className="overflow-x-auto rounded-xl shadow-lg border border-slate-300">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-slate-100 text-slate-800 font-semibold">
            <tr>
              <th className="px-4 py-3">S.No</th>
              <th className="px-4 py-3">Product Name</th>
              <th className="px-4 py-3">Description</th>
              <th className="px-4 py-3">Qty</th>
              <th className="px-4 py-3">CP</th>
              <th className="px-4 py-3">SP</th>
              <th className="px-4 py-3">Min Qty</th>
              <th className="px-4 py-3">Location</th>
              <th className="px-4 py-3">Variant</th>
              <th className="px-4 py-3">Barcode</th>
              <th className="px-4 py-3 text-center">Actions</th>
            </tr>
          </thead>

          <tbody className="text-slate-800">
            {!loading && products.length === 0 && (
              <tr>
                <td colSpan="11" className="text-center py-6 text-slate-600">
                  No products found 😕
                </td>
              </tr>
            )}

            {products.map((p) => (
              <tr
                key={p.sno}
                className="border-b hover:bg-slate-50 transition"
              >
                <td className="px-4 py-3">{p.sno}</td>
                <td className="px-4 py-3">{p.productName}</td>
                <td className="px-4 py-3">{p.description}</td>
                <td className="px-4 py-3">{p.currentQuantity}</td>
                <td className="px-4 py-3">{p.cp}</td>
                <td className="px-4 py-3">{p.sp}</td>
                <td className="px-4 py-3">{p.minQuantity}</td>
                <td className="px-4 py-3">{p.location}</td>
                <td className="px-4 py-3">
                  {p.variant?.length ? p.variant.join(", ") : "-"}
                </td>

                {/* Barcode Button */}
                <td className="px-4 py-3">
                  <button
                    onClick={() => {
                      setSelectedBarcode(p.sno);
                      setSelectedProductName(p.productName);
                    }}
                  >
                    <BarCode value={p.sno} width={1} height={20} />
                  </button>
                </td>

                <td className="px-4 py-3">
                  <div className="flex justify-center gap-4">
                    <button
                      onClick={() => {
                        setEditProduct(p);
                        setShowModal(true);
                      }}
                      className="text-green-600 hover:scale-110 transition"
                    >
                      <FiEdit size={18} />
                    </button>
                    <button onClick={() => deleteProductDb(p._id)} className="text-red-600 hover:scale-110 transition">
                      <FiTrash2 size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Barcode Modal */}
      {selectedBarcode && (
        <BarCodePopup
          value={selectedBarcode}
          productName={selectedProductName}
          setSelectedBarcode={setSelectedBarcode}
        />
      )}

      {/* Add / Edit Product Modal */}
      {showModal && (
        <ProductFormModal
          mode={editProduct ? "edit" : "add"}
          product={editProduct}
          onClose={() => {
            setShowModal(false);
            setEditProduct(null);
          }}
          addProductDb={addProductDb}
          updateProductDb={updateProductDb}
        />
      )}
    </div>
  );
};

export default ProductManagementPage;
