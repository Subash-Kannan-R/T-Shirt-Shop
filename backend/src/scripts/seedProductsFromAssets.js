import path from 'path';
import fs from 'fs';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { connectDB } from '../config/db.js';
import Product from '../models/Product.js';
import Category from '../models/Category.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '../../..');

// Assets base dir (folders inside are treated as categories)
const assetsDir = process.env.ASSETS_DIR || path.join(projectRoot, 'Assets');
const apiBase = `http://localhost:${process.env.PORT || 5000}`;

const slugify = (s) => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

const ensureCategory = async (name) => {
  const slug = slugify(name);
  let cat = await Category.findOne({ slug });
  if (!cat) cat = await Category.create({ name, slug });
  return cat;
};

const walkAssets = (dir) => {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  const files = [];
  for (const e of entries) {
    const full = path.join(dir, e.name);
    if (e.isDirectory()) files.push(...walkAssets(full));
    else files.push(full);
  }
  return files;
};

const seedFromAssets = async () => {
  if (!fs.existsSync(assetsDir)) {
    console.warn(`Assets directory not found: ${assetsDir}`);
    return;
  }
  const allFiles = walkAssets(assetsDir).filter(p => /\.(png|jpe?g|webp|gif)$/i.test(p));
  const byFolder = new Map();
  for (const f of allFiles) {
    const rel = path.relative(assetsDir, f);
    const folder = rel.split(path.sep)[0] || 'General';
    if (!byFolder.has(folder)) byFolder.set(folder, []);
    byFolder.get(folder).push(rel);
  }

  for (const [folder, relFiles] of byFolder.entries()) {
    const category = await ensureCategory(folder);
    for (const rel of relFiles) {
      const filename = path.basename(rel, path.extname(rel));
      const name = filename.replace(/[_-]+/g, ' ');
      const slug = slugify(name);
      const imageUrl = `${apiBase}/static/${rel.replace(/\\/g,'/')}`;
      
      // Determine product type based on name
      let type = 'Classic Round Neck'; // default
      if (name.toLowerCase().includes('polo')) {
        type = 'Polo Collar T-shirt';
      } else if (name.toLowerCase().includes('dual') && name.toLowerCase().includes('hoodie')) {
        type = 'Dual Hoodie';
      } else if (name.toLowerCase().includes('dragen') && name.toLowerCase().includes('hoodie')) {
        type = 'Dragen Hoodie';
      } else if (name.toLowerCase().includes('flower') && name.toLowerCase().includes('hoodie')) {
        type = 'Flower Hoodie';
      } else if (name.toLowerCase().includes('pattern') && name.toLowerCase().includes('hoodie')) {
        type = 'Pattern Hoodie';
      } else if (name.toLowerCase().includes('hoodie')) {
        type = 'Pattern Hoodie'; // generic hoodie defaults to Pattern
      }
      
      // If product with same slug exists, skip add but maybe push new image
      let existing = await Product.findOne({ slug });
      if (existing) {
        if (!existing.images?.includes(imageUrl)) {
          existing.images = [...(existing.images || []), imageUrl];
          await existing.save();
        }
        continue;
      }
      await Product.create({
        name,
        slug,
        price: Math.floor(299 + Math.random()*1200),
        stock: Math.floor(Math.random()*50)+5,
        category: category._id,
        images: [imageUrl],
        sizes: ['S','M','L','XL'],
        colors: ['black','white','red','blue'],
        description: `High quality ${name} from ${folder} collection.`,
        type
      });
    }
  }
};

const seedCDN = async () => {
  const category = await ensureCategory('CDN Collection');
  const cdnItems = [
    {
      name: 'Classic Black Tee',
      images: ['https://images.unsplash.com/photo-1520975922203-833a7ba0e83f?q=80&w=1200&auto=format&fit=crop'],
      type: 'Classic Round Neck'
    },
    {
      name: 'White Minimal Hoodie',
      images: ['https://images.unsplash.com/photo-1512436991641-6745cdb1723f?q=80&w=1200&auto=format&fit=crop'],
      type: 'Pattern Hoodie'
    },
    {
      name: 'Streetwear Oversized',
      images: ['https://images.unsplash.com/photo-1516822003754-cca485356ecb?q=80&w=1200&auto=format&fit=crop'],
      type: 'Classic Round Neck'
    }
  ];
  for (const item of cdnItems) {
    const slug = slugify(item.name);
    let existing = await Product.findOne({ slug });
    if (!existing) {
      await Product.create({
        name: item.name,
        slug,
        price: Math.floor(499 + Math.random()*1500),
        stock: 25,
        category: category._id,
        images: item.images,
        sizes: ['S','M','L','XL'],
        colors: ['black','white','gray'],
        description: `${item.name} from CDN seeded set.`,
        type: item.type
      });
    }
  }
};

const run = async () => {
  await connectDB();
  await seedFromAssets();
  await seedCDN();
  console.log('Seeding completed');
  process.exit(0);
};

run().catch(err => { console.error(err); process.exit(1); });
