import Cart from '../Schema/cartSchema.js';

// Function to add an item to the cart
export const addToCart = async (itemData, user) => {
  try {
    // Extract the userId from the user object
    const userId = user.userId;

    // Create a new cart item using the cartItemSchema
    const newCartItem = new Cart({
      user: userId, // Pass the userId instead of the entire user object
      items: [{
        productId: itemData.productId,
        quantity: itemData.quantity
      }]
    });

    // Save the new cart item to the database
    await newCartItem.save();

    return newCartItem;
  } catch (error) {
    throw new Error('Error adding item to cart');
  }
};
// Function to update a cart item
export const updateCartItem = async (cartItemId, updateData, user) => {
  try {
    const updatedCartItem = await Cart.findOneAndUpdate(
      { _id: cartItemId, user: user._id },
      updateData,
      { new: true }
    );

    return updatedCartItem;
  } catch (error) {
    throw new Error('Error updating cart item');
  }
};

// Function to remove a cart item
export const removeCartItem = async (cartItemId, user) => {
  try {
    const deletedCartItem = await Cart.findOneAndDelete({ _id: cartItemId, user: user._id });
    return deletedCartItem ? true : false;
  } catch (error) {
    throw new Error('Error removing cart item');
  }
};

// Function to get all items in the cart for a specific user
export const getCartItems = async (user) => {
  try {
    const cartItems = await Cart.find({ user: user._id }).populate('productId');
    return cartItems;
  } catch (error) {
    throw new Error('Error getting cart items');
  }
};
