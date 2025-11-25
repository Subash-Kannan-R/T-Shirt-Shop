import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true },
    phone: { type: String },
    profilePhoto: { type: String }, // URL to profile photo
    role: { type: String, enum: ['customer', 'admin'], default: 'customer' },
    shippingAddress: {
      email: String,
      firstName: String,
      lastName: String,
      companyName: String,
      country: String,
      streetAddress: String,
      apartment: String,
      city: String,
      state: String,
      pinCode: String,
      phone: String,
    },
    resetPasswordToken: { type: String },
    resetPasswordExpires: { type: Date },
    resetOtp: { type: String },
    resetOtpExpires: { type: Date }
  },
  { timestamps: true }
);

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

userSchema.methods.matchPassword = async function (entered) {
  return bcrypt.compare(entered, this.password);
};

export default mongoose.model('User', userSchema);
