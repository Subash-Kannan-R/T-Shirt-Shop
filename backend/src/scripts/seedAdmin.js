import dotenv from 'dotenv';
import { connectDB } from '../config/db.js';
import User from '../models/User.js';

dotenv.config();

const run = async () => {
  try {
    await connectDB();
    const email = process.env.ADMIN_EMAIL || 'admin@example.com';
    const password = process.env.ADMIN_PASSWORD || 'Admin@123';
    const name = process.env.ADMIN_NAME || 'Super Admin';

    let user = await User.findOne({ email });
    if (!user) {
      user = await User.create({ name, email, password, role: 'admin' });
      console.log('Admin user created:', email);
    } else if (user.role !== 'admin') {
      user.role = 'admin';
      await user.save();
      console.log('Existing user promoted to admin:', email);
    } else {
      console.log('Admin already exists:', email);
    }
    process.exit(0);
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
};

run();
