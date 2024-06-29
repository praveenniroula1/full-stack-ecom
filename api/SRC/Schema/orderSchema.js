import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    products: [
      {
        product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
      },
    ],
    paymentStatus: { type: String, enum: ['pending', 'paid'], default: 'pending' },
    orderDate: { type: Date, default: Date.now },
    deliveryStatus: { type: String, enum: ['Pending', 'In Progress', 'Delivered'], default: 'Pending' },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model('Order', orderSchema);
