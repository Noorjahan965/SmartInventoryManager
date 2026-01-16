import mongoose from "mongoose";

const logSchema = mongoose.Schema({
    author: { type: String, required: true },
    customerName: { type: String },
    mobileNo: { type: Number },
    email: { type: String },
    isPaid: { type: Boolean },
    modeOfPayment: { type: String, 
        enum: ['CASH', 'UPI'], 
        required: true 
    },
    isBill: { type: Boolean, required: true },
    totalCp: { type: Number, required: true },
    totalSp: { type: Number },
    dateAndTime: { type: String, required: true }
}, { timestamps: true });

logSchema.index({ dateAndTime: -1 });

const Log = mongoose.model('Log', logSchema);

export default Log;