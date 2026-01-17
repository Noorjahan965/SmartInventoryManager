import mongoose from "mongoose";

const recordSchema = new mongoose.Schema({
    logId: { type: mongoose.Schema.Types.ObjectId, ref: "Log", required: true },
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    sno: { type: Number, required: true },
    productName: { type: String, required: true },
    quantity: { type: Number, required: true },
    cp: { type: Number, required: true },
    sp: { type: Number },
}, { timestamps: true });

const Record = mongoose.model("Record", recordSchema);
export default Record;