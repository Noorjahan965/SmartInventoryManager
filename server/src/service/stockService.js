import mongoose from "mongoose";

import Product from "../model/productModel.js";
import Log from "../model/logModel.js";
import Record from "../model/recordModel.js";

const modifyQuantity = async (productId, type, qty) => {
  try {
    await Product.findByIdAndUpdate(productId, {
      $inc: { currentQuantity: type === "ADD" ? qty : -qty },
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
  product,
}) => {
  const ist = new Date().toLocaleString("sv-SE", {
    timeZone: "Asia/Kolkata",
    hour12: false,
  });

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

export const addStockService = async ({ authorName, product }) => {
  const ist = new Date().toLocaleString("sv-SE", {
    timeZone: "Asia/Kolkata",
    hour12: false,
  });

  let totalCp = 0;
  product.forEach((p) => {
    totalCp += Number(p.cp) * Number(p.qty);
  });

  try {
    const newLog = new Log({
      author: authorName,
      isBill: false,
      totalCp,
      dateAndTime: ist,
    });

    const savedLog = await newLog.save();

    for (const p of product) {
      const objectId = new mongoose.Types.ObjectId(p._id);

      const newRecord = new Record({
        logId: savedLog._id,
        productId: objectId,
        sno: p.sno,
        productName: p.productName,
        quantity: p.qty,
        cp: p.cp,
      });

      await modifyQuantity(objectId, "ADD", p.qty);
      await newRecord.save();
    }

    return {
      status: 201,
      message: "Stock Added successfully",
      data: savedLog,
    };
  } catch (err) {
    return { status: 500, message: err.message };
  }
};

export const getLogsService = async ({ isBill, date }) => {
  try {
    if (typeof isBill === "undefined") {
      return { status: 400, message: "isBill is required" };
    }

    const query = { isBill };

    if (date) {
      query.dateAndTime = { $regex: `^${date}` };
    }

    const logs = await Log.find(query).sort({ dateAndTime: -1 }).limit(50);

    return {
      status: 200,
      message: "Logs fetched successfully",
      data: logs,
    };
  } catch (err) {
    return { status: 500, message: err.message };
  }
};

export const getRecordsService = async ({ logId }) => {
  try {
    if (!logId) {
      return { status: 400, message: "logId is required" };
    }

    const records = await Record.find({ logId }).sort({ createdAt: -1 });

    return {
      status: 200,
      message: "Records fetched successfully",
      data: records,
    };
  } catch (error) {
    return { status: 500, message: error.message };
  }
};

export const getDashboardStatsService = async () => {
  try {
    const totalProducts = await Product.countDocuments();
    const totalBills = await Log.countDocuments({ isBill: true });
    const totalStockEntries = await Log.countDocuments({ isBill: false });

    return {
      status: 200,
      message: "Dashboard stats fetched",
      data: {
        totalProducts,
        totalBills,
        totalStockEntries,
      },
    };
  } catch (err) {
    return { status: 500, message: err.message };
  }
};


export const updatePaidStatusService = async ({ logId }) => {
  try {
    const updatedLog = await Log.findByIdAndUpdate(
      logId,                     // no need to wrap in ObjectId; Mongoose accepts string
      { isPaid: true },
      { new: true }              // return updated doc instead of old one
    );

    if (updatedLog) {
      return { status: 200, message: 'Paid status updated successfully' };
    }

    return { status: 404, message: 'Bill not found' };
  } catch (err) {
    return { status: 500, message: err.message };
  }
};
