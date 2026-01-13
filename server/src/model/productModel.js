import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
    code: { type: Number, required: true },
    productName: { type: String, required: true },
    size: { type: String },
    category: { type: String, required: true },
    material: { type: String },
    make: { type: String },
    currentQuantity: { type: Number, required: true },
    unit: { type: String, required: true },
    // price: { type: Number, required: true },
    cp: { type: Number, required: true},
    sp: { type: Number, required: true},
    dealer: { type: String},
    minQuantity: { type: Number, required: true },
    lastModified: { type: Date, default: Date.now }
}, { timestamps: true });

// Useful indexes
productSchema.index({ code: 1 });
productSchema.index({ productName: 1 });
productSchema.index({ category: 1 });
productSchema.index({ currentQuantity: 1 });
productSchema.index({ lastModified: -1 });
productSchema.index({ category: 1, productName: 1 });

const Product = mongoose.model("Product", productSchema);
export default Product;