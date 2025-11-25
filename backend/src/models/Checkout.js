import mongoose from 'mongoose';

const checkoutSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    sessionId: { type: String, required: true, unique: true }, // For guest users
    email: { type: String }, // Not required initially, will be added when user fills form
    shippingAddress: {
      firstName: String,
      lastName: String,
      company: String,
      address: String,
      apartment: String,
      city: String,
      state: String,
      postalCode: String,
      country: String,
      phone: String
    },
    orderNotes: String,
    status: { 
      type: String, 
      enum: ['draft', 'completed', 'abandoned'], 
      default: 'draft' 
    },
    expiresAt: { type: Date, default: () => Date.now() + 24 * 60 * 60 * 1000 } // 24 hours
  },
  { timestamps: true }
);

// Auto-delete expired checkouts
checkoutSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export default mongoose.model('Checkout', checkoutSchema);
