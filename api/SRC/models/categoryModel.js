
import Category from '../Schema/categorySchema.js';

export const createCategory = async (categoryData) => {
  try {
    const newCategory = new Category(categoryData);
    const savedCategory = await newCategory.save();
    return savedCategory;
  } catch (error) {
    throw new Error('Error creating category');
  }
};

export const getAllCategories = async () => {
  try {
    const categories = await Category.find({});
    return categories;
  } catch (error) {
    throw new Error('Error getting categories');
  }
};

export const getCategoryById = async (categoryId) => {
  try {
    const category = await Category.findById(categoryId);
    return category;
  } catch (error) {
    throw new Error('Error getting category by ID');
  }
};

export const updateCategory = async (categoryId, updatedData) => {
  try {
    const updatedCategory = await Category.findByIdAndUpdate(categoryId, updatedData, { new: true });
    return updatedCategory;
  } catch (error) {
    throw new Error('Error updating category');
  }
};

export const deleteCategory = async (categoryId) => {
  try {
    await Category.findByIdAndDelete(categoryId);
    return true;
  } catch (error) {
    throw new Error('Error deleting category');
  }
};
