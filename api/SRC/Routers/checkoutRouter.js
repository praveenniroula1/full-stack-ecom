// checkoutRouter.js

import express from 'express';
import Stripe from 'stripe';

const router = express.Router();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

router.use(express.json()); // Middleware to parse JSON bodies

router.post('/create-session', async (req, res) => {
  try {
    const { items } = req.body;

    // Create a Stripe Checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: items.map(item => ({
        price_data: {
          currency: 'usd',
          product_data: {
            name: item.product.name,
            description: item.product.description,
          },
          unit_amount: item.product.price * 100, // Convert price to cents
        },
        quantity: item.quantity,
      })),
      mode: 'payment',
      success_url: 'http://localhost:3000/success', // Redirect URL after successful payment
      cancel_url: 'http://localhost:3000/cancel', // Redirect URL after cancelled payment
    });

    res.json({ sessionId: session.id });
  } catch (error) {
    console.error('Error creating checkout session:', error);
    res.status(500).json({ error: error.message });
  }
});



export default router;
