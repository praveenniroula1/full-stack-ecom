import express from 'express';
import { insertOrder, getAllOrder } from '../models/orderModel.js';
import { auth } from '../Auth/auth.js';

const router = express.Router();

router.post('/', auth, async (req, res) => {
  try {
    const { user, body: data } = req;
    const products = data.products.map((item) => ({ product: item.product }));

    const newOrder = await insertOrder({
      user: user.userId,
      products: products,
      paymentStatus: 'paid',
    });

    res.status(201).json({
      success: true,
      message: 'Order created successfully',
      order: newOrder,
    });
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

router.get('/', auth, async (req, res) => {
  try {
    const orders = await getAllOrder();
    res.status(200).json({
      success: true,
      message: 'Orders retrieved successfully',
      orders: orders,
    });
  } catch (error) {
    console.error('Error retrieving orders:', error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

export default router;
