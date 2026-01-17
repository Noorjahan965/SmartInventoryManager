import { useState, useEffect } from "react";
import { FiPlus, FiEdit, FiTrash2, FiSearch } from "react-icons/fi";
import { IoMdBarcode } from "react-icons/io";

import ProductFormModal from "../../component/productPageComponent/ProductFormModal";
import DeleteProductModal from "../../component/productPageComponent/DeleteProductModal";
import BarCode from "../../component/barcode/BarCode";
import BarCodePopup from "../../component/barcode/BarCodePopup";
import BarCodeScanner from "../../component/barcode/BarCodeScanner";

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

	const [deleteProductModal, setDeleteProductModal] = useState(false);
	const [deleteSelectedId, setDeleteSelectedId] = useState('');

	const [showScanner, setShowScanner] = useState(false);

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
		catch (err) {
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
		catch (err) {
		}
	}

	useEffect(() => {
		fetchProducts();
	}, [searchTerm, filters]);

	const handleScan = async (code) => {
		try {
			const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/product?sno=${code}`, {
				method: 'GET',
				headers: {
					Authorization: `Bearer ${token}`,
					"Content-Type": "application/json",
				}
			});

			const data = await response.json();
			setProducts([data.data]);
		}
		catch (err) {

		}
	};

	return (
		<div className="max-md:p-0 p-6 pt-3 space-y-5">
			{/* Header */}
			<div className="flex flex-wrap justify-between items-center gap-3">
				<h2 className="text-xl md:text-3xl font-bold text-slate-900">Product Management</h2>
				<button
					onClick={() => setShowModal(true)}
					className="flex items-center gap-2 bg-blue-600 hover:bg-blue-800 cursor-pointer text-white font-semibold px-2 py-1 max-md:text-sm md:px-4 md:py-2 rounded-lg transition"
				>
					<FiPlus size={18} />
					Add Product
				</button>
			</div>

			<div className="flex items-center gap-5">
				{/* Search */}
				<div className="flex items-center gap-2 bg-white border border-slate-400 px-3 py-2 rounded-lg w-full max-w-md shadow-sm">
					<FiSearch className="text-slate-600" />
					<input
						type="text"
						placeholder="Product Name / Sno"
						className="w-full bg-transparent outline-none text-slate-900"
						value={searchTerm}
						onChange={(e) => setSearchTerm(e.target.value)}
					/>
				</div>
				<IoMdBarcode onClick={() => setShowScanner(true)} size={30} className="cursor-pointer hover:scale-110 transition" />
			</div>

			{/* Filters */}
			<div className="flex flex-wrap gap-4 items-center">
				<select
					className="border px-3 py-2 rounded-lg bg-white border-slate-400 text-slate-900 cursor-pointer"
					value={filters.qty}
					onChange={(e) => setFilters({ ...filters, qty: e.target.value })}
				>
					<option value="none">Qty Sort</option>
					<option value="asc">Low → High</option>
					<option value="desc">High → Low</option>
				</select>

				<select
					className="border px-3 py-2 rounded-lg bg-white border-slate-400 text-slate-900 cursor-pointer"
					value={filters.cp}
					onChange={(e) => setFilters({ ...filters, cp: e.target.value })}
				>
					<option value="none">CP Sort</option>
					<option value="asc">Low → High</option>
					<option value="desc">High → Low</option>
				</select>

				<select
					className="border px-3 py-2 rounded-lg bg-white border-slate-400 text-slate-900 cursor-pointer"
					value={filters.sp}
					onChange={(e) => setFilters({ ...filters, sp: e.target.value })}
				>
					<option value="none">SP Sort</option>
					<option value="asc">Low → High</option>
					<option value="desc">High → Low</option>
				</select>

				<select
					className="border px-3 py-2 rounded-lg bg-white border-slate-400 text-slate-900 cursor-pointer"
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
<div className="overflow-x-auto overflow-y-auto max-h-[70vh] rounded-xl shadow-lg border border-slate-300">
	<table className="min-w-full text-left text-xs sm:text-sm">
		<thead className="bg-slate-100 text-slate-800 font-semibold sticky top-0 z-20">
			<tr>
				<th className="px-2 py-2 sm:px-4 sm:py-3">S.No</th>
				<th className="px-2 py-2 sm:px-4 sm:py-3">Product Name</th>
				<th className="px-2 py-2 sm:px-4 sm:py-3">Description</th>
				<th className="px-2 py-2 sm:px-4 sm:py-3">Qty</th>
				<th className="px-2 py-2 sm:px-4 sm:py-3">CP</th>
				<th className="px-2 py-2 sm:px-4 sm:py-3">SP</th>
				<th className="px-2 py-2 sm:px-4 sm:py-3">Min Qty</th>
				<th className="px-2 py-2 sm:px-4 sm:py-3">Location</th>
				<th className="px-2 py-2 sm:px-4 sm:py-3">Variant</th>
				<th className="px-2 py-2 sm:px-4 sm:py-3">Barcode</th>
				<th className="px-2 py-2 sm:px-4 sm:py-3 text-center">Actions</th>
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
				<tr key={p.sno} className="border-b hover:bg-slate-50 transition">
					<td className="px-2 py-2 sm:px-4 sm:py-3">{p.sno}</td>
					<td className="px-2 py-2 sm:px-4 sm:py-3">{p.productName}</td>
					<td className="px-2 py-2 sm:px-4 sm:py-3">{p.description}</td>
					<td className="px-2 py-2 sm:px-4 sm:py-3">{p.currentQuantity}</td>
					<td className="px-2 py-2 sm:px-4 sm:py-3">{p.cp}</td>
					<td className="px-2 py-2 sm:px-4 sm:py-3">{p.sp}</td>
					<td className="px-2 py-2 sm:px-4 sm:py-3">{p.minQuantity}</td>
					<td className="px-2 py-2 sm:px-4 sm:py-3">{p.location}</td>
					<td className="px-2 py-2 sm:px-4 sm:py-3">
						{p.variant?.length ? p.variant.join(", ") : "-"}
					</td>

					{/* Barcode */}
					<td className="px-2 py-2 sm:px-4 sm:py-3 cursor-pointer">
						<button
							onClick={() => {
								setSelectedBarcode(p.sno);
								setSelectedProductName(p.productName);
							}}
						>
							<BarCode value={p.sno} width={1} height={16} className="sm:h-5!" />
						</button>
					</td>

					<td className="px-2 py-2 sm:px-4 sm:py-3">
						<div className="flex justify-center gap-2 sm:gap-4">
							<button
								onClick={() => {
									setEditProduct(p);
									setShowModal(true);
								}}
								className="text-green-600 hover:scale-110 transition cursor-pointer"
							>
								<FiEdit size={18} className="sm:h-5! sm:w-5!" />
							</button>

							<button
								onClick={() => {
									setDeleteSelectedId(p._id);
									setDeleteProductModal(true);
								}}
								className="text-red-600 hover:scale-110 transition cursor-pointer"
							>
								<FiTrash2 size={18} className="sm:h-4.5! sm:w-4.5!" />
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

			{
				deleteProductModal && <DeleteProductModal id={deleteSelectedId} onCancel={() => setDeleteProductModal(false)} fetchProducts={fetchProducts} />
			}

			{showScanner && (
				<BarCodeScanner
					onDetected={handleScan}
					onClose={() => setShowScanner(false)}
				/>
			)}

		</div>
	);
};

export default ProductManagementPage;