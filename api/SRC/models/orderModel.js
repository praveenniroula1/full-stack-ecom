// models/orderModel.js
import orderSchema from '../Schema/orderSchema.js';

// Function to insert a new order
export const insertOrder = async (obj) => {
  try {
    const newOrder = await orderSchema(obj).save();
    return newOrder;
  } catch (error) {
    throw new Error("Error inserting order");
  }
};

// Function to get an order by ID
export const getOrderById = async (orderId) => {
  try {
    const order = await orderSchema.findById(orderId).populate('user products.product');
    return order;
  } catch (error) {
    throw new Error("Error getting order by ID");
  }
};

// Function to get all orders for a user
export const getOrdersByUser = async (userId) => {
  try {
    const orders = await orderSchema.find({ user: userId }).populate('products.product').sort({ orderDate: -1 });
    return orders;
  } catch (error) {
    throw new Error("Error getting orders for user");
  }
};

// Function to update an order by ID
export const updateOrderById = async (orderId, updateData) => {
  try {
    const updatedOrder = await orderSchema.findByIdAndUpdate(orderId, updateData, { new: true, runValidators: true });
    return updatedOrder;
  } catch (error) {
    throw new Error("Error updating order by ID");
  }
};

// Function to delete an order by ID
export const deleteOrderById = async (orderId) => {
  try {
    const deletedOrder = await orderSchema.findByIdAndDelete(orderId);
    return deletedOrder;
  } catch (error) {
    throw new Error("Error deleting order by ID");
  }
};
