import productSchema from "../Schema/productSchema.js";

// Function to search for products
export const searchProducts = async (query) => {
  try {
    // Search for products by name, description, or category using regex
    const products = await productSchema.find({
      $or: [
        { name: { $regex: query, $options: 'i' } }, // Case-insensitive search for name
        { description: { $regex: query, $options: 'i' } }, // Case-insensitive search for description
        { category: { $regex: query, $options: 'i' } }, // Case-insensitive search for category
      ]
    });
    return products;
  } catch (error) {
    throw new Error("Error searching for products");
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
    throw new Error("Error getting product by ID");
  }
};

// Function to get all products with pagination
export const getAllProducts = async (page = 1, limit = 10) => {
  try {
    const skip = (page - 1) * limit;
    const products = await productSchema.find()
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
    throw new Error("Error getting all products");
  }
};

// Function to get the last 8 added products
export const getFeaturedProducts = async () => {
  try {
    const products = await productSchema.find()
      .sort({ createdAt: -1 })
      .limit(8);
    return products;
  } catch (error) {
    throw new Error("Error getting featured products");
  }
};

// Function to update a product by ID
export const updateProductById = async (productId, updateData) => {
  try {
    const updatedProduct = await productSchema.findByIdAndUpdate(productId, updateData, { new: true, runValidators: true });
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
