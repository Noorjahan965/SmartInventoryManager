import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
    sno: { type: Number, required: true },
    productName: { type: String, required: true, trim: true },
    description: { type: String, trim: true },
    currentQuantity: { type: Number, required: true },
    cp: { type: Number, required: true},
    sp: { type: Number, required: true},
    minQuantity: { type: Number, required: true },
    location: { type: String, required: true },
    variant: { type: [String] },
    lastModified: { type: Date, default: Date.now }
}, { timestamps: true });

// Useful indexes
productSchema.index({ productName: 1 });
productSchema.index({ currentQuantity: 1 });
productSchema.index({ lastModified: -1 });

const Product = mongoose.model("Product", productSchema);
export default Product;