import dotenv from 'dotenv';
import { connectDB } from '../config/db.js';
import Product from '../models/Product.js';

dotenv.config();

const addTypeToProducts = async () => {
  try {
    await connectDB();
    console.log('Connected to database');

    // Get all products
    const products = await Product.find({});
    console.log(`Found ${products.length} products to update`);

    let updated = 0;
    let skipped = 0;

    for (const product of products) {
      let type = null;

      // Determine type based on product name
      if (product.name.includes('Polo Collar')) {
        type = 'Polo Collar T-shirt';
      } else if (product.name.includes('Classic Round Neck')) {
        type = 'Classic Round Neck';
      } else if (product.name.includes('Dual Hoodie')) {
        type = 'Dual Hoodie';
      } else if (product.name.includes('Dragen Hoodie')) {
        type = 'Dragen Hoodie';
      } else if (product.name.includes('Flower Hoodie')) {
        type = 'Flower Hoodie';
      } else if (product.name.includes('Pattern Hoodie')) {
        type = 'Pattern Hoodie';
      }

      if (type) {
        product.type = type;
        await product.save();
        updated++;
        console.log(`Updated: ${product.name} -> ${type}`);
      } else {
        skipped++;
        console.log(`Skipped (no matching type): ${product.name}`);
      }
    }

    console.log('\n=== Migration Summary ===');
    console.log(`Total products: ${products.length}`);
    console.log(`Updated: ${updated}`);
    console.log(`Skipped: ${skipped}`);
    console.log('Migration completed successfully!');

    process.exit(0);
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  }
};

addTypeToProducts();
