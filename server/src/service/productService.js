import Product from "../model/productModel.js";

const generateUniqueSno = async () => {
  while (true) {
    const sno = Math.floor(10000000 + Math.random() * 90000000); // 8 digits
    const exists = await Product.findOne({ sno });

    if (!exists) return sno;
  }
};

export const getProductService = async (sno) => {
  try {
    const product = await Product.findOne({ sno });

    if (!product) {
      return { status: 404, message: "Product not found" };
    }

    return {
      status: 200,
      message: "Product fetched successfully",
      data: product,
    };
  } catch (err) {
    return { status: 500, message: err.message };
  }
};

export const getAllProductsService = async ({
  search = "",
  location = "",
  qty = "none",
  cp = "none",
  sp = "none",
  page = 1,
  limit = 250,
}) => {
  try {
    const filter = {};

    // Combined search: sno OR productName
    if (search) {
      filter.$or = [
        { productName: { $regex: search, $options: "i" } },
        {
          $expr: {
            $regexMatch: {
              input: { $toString: "$sno" },
              regex: search,
              options: "i",
            },
          },
        },
      ];
    }

    if (location) {
      filter.location = location;
    }

    const sort = {};
    if (qty !== "none") sort.currentQuantity = qty === "asc" ? 1 : -1;
    if (cp !== "none") sort.cp = cp === "asc" ? 1 : -1;
    if (sp !== "none") sort.sp = sp === "asc" ? 1 : -1;

    const products = await Product.find(filter)
      .sort(sort)
      .skip((page - 1) * limit)
      .limit(Number(limit));

    const total = await Product.countDocuments(filter);

    return {
      status: 200,
      message: "Get all products.",
      data: {
        data: products,
        total,
        page: Number(page),
        totalPages: Math.ceil(total / limit),
      },
    };
  } catch (err) {
    return { status: 500, message: err.message };
  }
};

export const addProductService = async (productData) => {
  try {
    const sno = await generateUniqueSno();

    const newProduct = new Product({
      sno,
      productName: productData.productName,
      description: productData.description || "",
      currentQuantity: productData.currentQuantity,
      cp: productData.cp,
      sp: productData.sp,
      minQuantity: productData.minQuantity,
      location: productData.location,
      variant: productData.variant || [],
    });

    const saved = await newProduct.save();

    return {
      status: 201,
      message: "Product added successfully",
      data: saved,
    };
  } catch (err) {
    return { status: 500, message: err.message };
  }
};

export const updateProductService = async (_id, productData) => {
  delete productData._id;
  try {
    const updated = await Product.findByIdAndUpdate(
      _id,
      {
        ...productData,
        lastModified: Date.now(),
      },
      { new: true } // return updated product
    );

    if (!updated) {
      return { status: 404, message: "Product not found" };
    }

    return {
      status: 200,
      message: "Product updated successfully",
      data: updated,
    };
  } catch (err) {
    return { status: 500, message: err.message };
  }
};

export const deleteProductService = async (_id) => {
  try {
    const deleted = await Product.findByIdAndDelete(_id);

    if (!deleted) {
      return { status: 404, message: "Product not found" };
    }

    return {
      status: 200,
      message: "Product deleted successfully",
      data: deleted,
    };
  } catch (err) {
    return { status: 500, message: err.message };
  }
};

export const getProductByIdService = async (_id) => {
  try {
    const product = await Product.findById(_id);

    if (!product) {
      return { status: 404, message: "Product not found" };
    }

    return {
      status: 200,
      message: "Product fetched successfully",
      data: product,
    };
  } catch (err) {
    return { status: 500, message: err.message };
  }
};

export const getLowStockProductsService = async () => {
  try {
    const products = await Product.find({
      $expr: { $lte: ["$currentQuantity", "$minQuantity"] },
    }).sort({ currentQuantity: 1 });

    return {
      status: 200,
      message: "Low stock products fetched",
      data: products,
    };
  } catch (err) {
    return { status: 500, message: err.message };
  }
};
