import Product from '../models/Product.js';

export const listProducts = async (req, res) => {
  try {
    const { category, type, size, status, price } = req.query;
    let query = {};

    // If category slug is provided, find the category and filter by it
    if (category) {
      const Category = (await import('../models/Category.js')).default;
      const cat = await Category.findOne({ slug: category });
      if (cat) {
        query.category = cat._id;
      }
    }

    // If type is provided, filter by it
    if (type) {
      query.type = type;
    }

    // If size is provided, filter by it (products that have this size)
    if (size) {
      query.sizes = size;
    }

    // If price range is provided, filter by it
    if (price) {
      const [minStr, maxStr] = price.split('-');
      const min = parseInt(minStr);
      const max = parseInt(maxStr);
      if (!isNaN(min) && !isNaN(max)) {
        query.price = { $gte: min, $lte: max };
      }
    }

    // If status is provided, filter by it
    if (status) {
      if (status === 'instock') {
        query.stock = { $gt: 0 };
      }
      // For 'onsale' and 'featured', we don't have these fields yet
      // so we'll just ignore them for now
    }

    const products = await Product.find(query).populate('category');
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message || 'Failed to fetch products' });
  }
};

export const getProduct = async (req, res) => {
  const p = await Product.findById(req.params.id).populate('category');
  if (!p) return res.status(404).json({ message: 'Product not found' });
  res.json(p);
};

export const createProduct = async (req, res) => {
  const p = await Product.create(req.body);
  res.status(201).json(p);
};

export const updateProduct = async (req, res) => {
  const p = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!p) return res.status(404).json({ message: 'Product not found' });
  res.json(p);
};

export const deleteProduct = async (req, res) => {
  const p = await Product.findByIdAndDelete(req.params.id);
  if (!p) return res.status(404).json({ message: 'Product not found' });
  res.json({ message: 'Deleted' });
};
