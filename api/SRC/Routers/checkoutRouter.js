import express from 'express';
import Stripe from 'stripe';
import { insertOrder } from '../models/orderModel.js';

const router = express.Router();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

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

router.get('/success', async (req, res) => {
  const sessionId = req.query.session_id;

  try {
    // Retrieve the session to get the payment status and details
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (session.payment_status === 'paid') {
      const orderDetails = {
        user: session.metadata.userId, // Retrieve user ID from metadata
        products: JSON.parse(session.metadata.items).map(item => ({
          product: item.product._id,
          quantity: item.quantity,
          price: item.product.price,
        })), // Convert items to match schema
        paymentStatus: true,
      };

      // Log the order details to console
      console.log('Order details:', orderDetails);

      // Insert the order into the database
      const newOrder = await insertOrder(orderDetails);

      res.json({ success: true, orderId: newOrder._id }); // Respond with JSON indicating success and order ID
    } else {
      res.json({ success: false, message: 'Payment was not successful.' }); // Respond with JSON indicating payment failure
    }
  } catch (error) {
    console.error('Error handling success URL:', error);
    res.status(500).json({ error: error.message });
  }
});

export default router;
