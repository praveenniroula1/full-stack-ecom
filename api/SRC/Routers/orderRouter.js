// Routers/orderRouter.js
import express from "express";
import {
  insertOrder,
  getOrderById,
  getOrdersByUser,
  updateOrderById,
  deleteOrderById,
  getAllOrder,
} from "../models/orderModel.js";
import { auth } from "../Auth/auth.js";
const router = express.Router();

// Route to create a new order
// / Route to create a new order
router.post("/", auth, async (req, res) => {
  try {
    const { user, body: data } = req;
   
    const products = data.products.map((item) => ({ product: item.product }));

    const newOrder = await insertOrder({
      user: user.userId, 
      products: products,
    });

    res.status(201).json({
      success: true,
      message: "Order created successfully",
      order: newOrder,
    });
  } catch (error) {
    console.error("Error inserting order:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});


// Route to get all orders
router.get("/",auth,  async (req, res) => {
  try {
    const orders = await getAllOrder();
    res.status(200).json({
      success: true,
      message: "Orders retrieved successfully",
      orders: orders,
    });
  } catch (error) {
    console.error("Error retrieving orders:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

export default router;
