import Category from '../models/Category.js';

export const listCategories = async (req, res) => {
  const cats = await Category.find();
  res.json(cats);
};

export const createCategory = async (req, res) => {
  const c = await Category.create(req.body);
  res.status(201).json(c);
};

export const updateCategory = async (req, res) => {
  const c = await Category.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!c) return res.status(404).json({ message: 'Category not found' });
  res.json(c);
};

export const deleteCategory = async (req, res) => {
  const c = await Category.findByIdAndDelete(req.params.id);
  if (!c) return res.status(404).json({ message: 'Category not found' });
  res.json({ message: 'Deleted' });
};
