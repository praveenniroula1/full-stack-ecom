import productSchema from "../Schema/productSchema.js";

// Function to search for products
export const searchProducts = async (query) => {
  try {
    const regex = new RegExp(query, "i"); // "i" for case-insensitive

    const searchResults = await productSchema.find({
      $or: [{ name: { $regex: regex } }, { description: { $regex: regex } }],
    });

    return searchResults;
  } catch (error) {
    throw error;
  }
};

// Function to insert a new product
export const insertProduct = async (obj) => {
  try {
    const saveProduct = await productSchema(obj).save();
    return saveProduct;
  } catch (error) {
    throw new Error("Error inserting product");
  }
};

// Function to get a product by ID
export const getProductById = async (productId) => {
  try {
    const product = await productSchema.findById(productId);
    return product;
  } catch (error) {
    console.log(error);
  }
};

// Function to get all products with pagination
export const getAllProducts = async (page = 1, limit = 10) => {
  try {
    const skip = (page - 1) * limit;
    const products = await productSchema
      .find()
      .sort({ createdAt: -1 }) // Sort by creation date, newest first
      .skip(skip)
      .limit(limit);

    const total = await productSchema.countDocuments();
    return {
      products,
      total,
      page,
      pages: Math.ceil(total / limit),
    };
  } catch (error) {
console.log(error)  }
};

// Function to get the last 8 added products
export const getFeaturedProducts = async () => {
  try {
    const products = await productSchema
      .find()
      .sort({ createdAt: -1 })
      .limit(6);
    return products;
  } catch (error) {
console.log(error)  }
};

// Function to update a product by ID
export const updateProductById = async (productId, updateData) => {
  try {
    const updatedProduct = await productSchema.findByIdAndUpdate(
      productId,
      updateData,
      { new: true, runValidators: true }
    );
    return updatedProduct;
  } catch (error) {
    throw new Error("Error updating product by ID");
  }
};

// Function to delete a product by ID
export const deleteProductById = async (productId) => {
  try {
    const deletedProduct = await productSchema.findByIdAndDelete(productId);
    return deletedProduct;
  } catch (error) {
    throw new Error("Error deleting product by ID");
  }
};
