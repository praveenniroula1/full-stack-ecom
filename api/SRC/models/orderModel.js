import Order from '../Schema/orderSchema.js';

// Function to insert a new order
export const insertOrder = async (obj) => {
  try {
    const newOrder = await new Order(obj).save();
    return newOrder;
  } catch (error) {
    console.error("Error inserting order:", error);
    throw new Error("Error inserting order");
  }
};

// Function to get all orders
export const getAllOrder = async () => {
  try {
    const orders = await Order.find();
    return orders;
  } catch (error) {
    throw new Error("Error getting orders");
  }
};
