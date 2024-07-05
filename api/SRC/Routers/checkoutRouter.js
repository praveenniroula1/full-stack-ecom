// checkoutRouter.js

import express from 'express';
import Stripe from 'stripe';
import { auth } from '../Auth/auth.js';
import { insertOrder } from '../models/orderModel.js';

const router = express.Router();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

router.post('/create-session', auth, async (req, res) => {
  try {
    const { items } = req.body;

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: items.map((item) => ({
        price_data: {
          currency: 'aud',
          product_data: {
            name: item.product.name,
            description: item.product.description,
          },
          unit_amount: item.product.price * 100,
        },
        quantity: item.quantity,
      })),
      mode: 'payment',
      success_url: 'http://localhost:3000/success?session_id={CHECKOUT_SESSION_ID}',
      cancel_url: 'http://localhost:3000/cancel',
      metadata: { userId: req.user.userId, products: JSON.stringify(items) },
    });

    res.json({ sessionId: session.id });
  } catch (error) {
    console.error('Error creating checkout session:', error);
    res.status(500).json({ error: error.message });
  }
});

router.post('/create-order', async (req, res) => {
  try {
    const { session_id } = req.body;

    const session = await stripe.checkout.sessions.retrieve(session_id);

    if (session.payment_status === 'paid') {
      const userId = session.metadata.userId;
      const products = JSON.parse(session.metadata.products);

      const newOrder = await insertOrder({
        user: userId,
        products: products.map((item) => ({ product: item.product })),
        paymentStatus: 'paid',
      });

      res.status(201).json({
        success: true,
        message: 'Order created successfully',
        order: newOrder,
      });
    } else {
      res.status(400).json({
        success: false,
        message: 'Payment not successful',
      });
    }
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

export default router;
