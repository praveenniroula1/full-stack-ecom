import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  price: {
    type: Number,
    required: true,
    min: 0,
  },
  description: {
    type: String,
    required: true,
    trim: true,
  },
  images: [
    {
      type: String,
    },
  ],
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    default:"6660599f5fa21f0dd54d3a09",
    // required: true,
  }
}, {
  timestamps: true, // This will add createdAt and updatedAt fields automatically
});

export default mongoose.model('Product', productSchema);
