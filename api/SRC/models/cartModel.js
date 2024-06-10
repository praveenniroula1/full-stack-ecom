import Cart from '../Schema/cartSchema.js';

// Function to add an item to the cart
export const addToCart = async (itemData, user) => {
  try {
    const userId = user._id;

    let cart = await Cart.findOne({ user: userId });

    if (!cart) {
      cart = new Cart({ user: userId, items: [] });
    }

    const cartItemIndex = cart.items.findIndex(item => item.productId.toString() === itemData.productId);

    if (cartItemIndex > -1) {
      cart.items[cartItemIndex].quantity += itemData.quantity;
    } else {
      cart.items.push({ productId: itemData.productId, quantity: itemData.quantity });
    }

    const updatedCart = await cart.save();
    return updatedCart;
  } catch (error) {
    throw new Error('Error adding item to cart');
  }
};

// Function to update a cart item
export const updateCartItem = async (cartItemId, updateData, user) => {
  try {
    const cart = await Cart.findOne({ 'items._id': cartItemId, user: user._id });

    if (!cart) {
      throw new Error('Cart item not found');
    }

    const cartItem = cart.items.id(cartItemId);
    cartItem.quantity = updateData.quantity;

    await cart.save();
    return cart;
  } catch (error) {
    throw new Error('Error updating cart item');
  }
};

// Function to remove a cart item
export const removeCartItem = async (cartItemId, user) => {
  try {
    const cart = await Cart.findOne({ user: user._id });
    
    if (!cart) {
      throw new Error('Cart not found');
    }

    const cartItem = cart.items.id(cartItemId);
    cartItem.remove();
    
    await cart.save();
    return true;
  } catch (error) {
    throw new Error('Error removing cart item');
  }
};

// Function to get all items in the cart for a specific user
export const getCartItems = async (user) => {
  try {
    const cart = await Cart.findOne({ user: user._id }).populate('items.productId');
    return cart;
  } catch (error) {
    throw new Error('Error getting cart items');
  }
};
