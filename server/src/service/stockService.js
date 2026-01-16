import mongoose from "mongoose";

import Product from "../model/productModel.js";
import Log from "../model/logModel.js";
import Record from "../model/recordModel.js";

const modifyQuantity = async (productId, type, qty) => {
  try {
    await Product.findByIdAndUpdate(productId, {
      $inc: { currentQuantity: type === "ADD" ? qty : -qty }
    });
  } catch (err) {
    console.error("Modify Quantity Error:", err.message);
  }
};

export const createBillService = async ({
  authorName,
  customerName,
  mobileNo,
  email,
  modeOfPayment,
  product
}) => {
  const ist = new Date().toLocaleString("sv-SE", {
    timeZone: "Asia/Kolkata",
    hour12: false
  });

  // must be let, not const
  let totalCp = 0;
  let totalSp = 0;

  product.forEach((p) => {
    totalCp += Number(p.cp) * Number(p.qty);
    totalSp += Number(p.sp) * Number(p.qty);
  });

  try {
    const newLog = new Log({
      author: authorName,
      customerName,
      mobileNo,
      email: email || "",
      isPaid: false,
      modeOfPayment,
      isBill: true,
      totalCp,
      totalSp,
      dateAndTime: ist,
    });

    const savedLog = await newLog.save();

    // Use for...of so await works properly
    for (const p of product) {
      const objectId = new mongoose.Types.ObjectId(p._id);

      const newRecord = new Record({
        logId: savedLog._id,
        productId: objectId,
        sno: p.sno,
        productName: p.productName,
        quantity: p.qty,
        cp: p.cp,
        sp: p.sp,
      });

      await modifyQuantity(objectId, "SUB", p.qty);
      await newRecord.save();
    }

    return {
      status: 201,
      message: "Bill created successfully",
      data: savedLog,
    };
  } catch (err) {
    return { status: 500, message: err.message };
  }
};
