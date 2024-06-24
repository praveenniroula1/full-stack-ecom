// Routers/orderRouter.js
import express from 'express';
import { insertOrder, getOrderById, getOrdersByUser, updateOrderById, deleteOrderById } from '../models/orderModel.js';
import { auth } from '../Auth/auth.js';

const router = express.Router();

// Route to create a new order
router.post('/', auth, async (req, res) => {
  try {
    const newOrder = await insertOrder({ ...req.body, user: req.user._id });
    res.status(201).json({
      success: true,
      message: 'Order created successfully',
      order: newOrder,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// Route to get an order by ID
router.get('/:id', auth, async (req, res) => {
  try {
    const order = await getOrderById(req.params.id);
    if (order) {
      res.json(order);
    } else {
      res.status(404).json({
        success: false,
        message: 'Order not found',
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// Route to get all orders for the logged-in user
router.get('/user/:userId', auth, async (req, res) => {
  try {
    const orders = await getOrdersByUser(req.params.userId);
    res.json(orders);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// Route to update an order by ID
router.put('/:id', auth, async (req, res) => {
  try {
    const updatedOrder = await updateOrderById(req.params.id, req.body);
    if (updatedOrder) {
      res.json({
        success: true,
        message: 'Order updated successfully',
        order: updatedOrder,
      });
    } else {
      res.status(404).json({
        success: false,
        message: 'Order not found',
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// Route to delete an order by ID
router.delete('/:id', auth, async (req, res) => {
  try {
    const deletedOrder = await deleteOrderById(req.params.id);
    if (deletedOrder) {
      res.json({
        success: true,
        message: 'Order deleted successfully',
      });
    } else {
      res.status(404).json({
        success: false,
        message: 'Order not found',
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

export default router;
