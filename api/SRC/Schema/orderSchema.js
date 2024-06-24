// models/orderSchema.js
import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    products: [
      {
        product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
        quantity: { type: Number, required: true },
        price: { type: Number, required: true },
      },
    ],
    paymentStatus: { type: Boolean, required: true },
    orderDate: { type: Date, default: Date.now },
    deliveryStatus: { type: String, default: 'Pending' },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model('Order', orderSchema);
