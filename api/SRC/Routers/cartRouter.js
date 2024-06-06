import express from 'express';
import {
  addToCart,
  updateCartItem,
  removeCartItem,
  getCartItems
} from '../models/cartModel.js';
import { auth } from '../Auth/auth.js';

const router = express.Router();

// Route to add an item to the cart
router.post('/', auth, async (req, res) => {
  try {
    console.log(req.user)
    const cartItem = await addToCart(req.body, req.user); // Assuming req.user contains the logged-in user's information
    console.log(cartItem)
    res.status(201).json(cartItem);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Route to update a cart item (e.g., update quantity)
router.put('/:productId', auth, async (req, res) => {
  try {
    const updatedCartItem = await updateCartItem(req.params.productId, req.body, req.user); // Assuming req.user contains the logged-in user's information
    if (updatedCartItem) {
      res.status(200).json(updatedCartItem);
    } else {
      res.status(404).json({ message: 'Cart item not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Route to remove an item from the cart
router.delete('/:productId', auth, async (req, res) => {
  try {
    const success = await removeCartItem(req.params.productId, req.user); // Assuming req.user contains the logged-in user's information
    if (success) {
      res.status(200).json({ message: 'Cart item removed successfully' });
    } else {
      res.status(404).json({ message: 'Cart item not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Route to get all items in the cart
router.get('/', auth, async (req, res) => {
  try {
    const cartItems = await getCartItems(req.user); // Assuming req.user contains the logged-in user's information
    res.status(200).json(cartItems);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
