import productSchema from "../Schema/productSchema.js";

// Function to insert a new product
export const insertProduct = async (obj) => {
  try {
    console.log('Product data:', obj); // Add this line
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

// Function to get all products
export const getAllProducts = async () => {
  try {
    const products = await productSchema.find();
    return products;
  } catch (error) {
    throw new Error("Error getting all products");
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
