import mongoose from 'mongoose';

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    description: { type: String },
    images: [{ type: String }],
    price: { type: Number, required: true },
    sizes: [{ type: String }],
    colors: [{ type: String }],
    stock: { type: Number, default: 0 },
    category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' },
    type: { 
      type: String, 
      required: true, 
      enum: ['Polo Collar T-shirt', 'Classic Round Neck', 'Dual Hoodie', 'Dragen Hoodie', 'Flower Hoodie', 'Pattern Hoodie'] 
    }
  },
  { timestamps: true }
);

export default mongoose.model('Product', productSchema);
