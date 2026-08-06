const Product = require('../models/Product');

const getProducts = async (req, res) => {
  const products = await Product.find().populate('user', 'name email');
  res.json(products);
};

const createProduct = async (req, res) => {
  const { title, description, price } = req.body;

  if (!title || !description || typeof price !== 'number') {
    return res.status(400).json({ message: 'Please provide title, description, and price' });
  }

  const product = await Product.create({
    title,
    description,
    price,
    user: req.user.id
  });

  res.status(201).json(product);
};

const getProductById = async (req, res) => {
  const product = await Product.findById(req.params.id).populate('user', 'name email');

  if (!product) {
    return res.status(404).json({ message: 'Product not found' });
  }

  res.json(product);
};

const updateProduct = async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    return res.status(404).json({ message: 'Product not found' });
  }

  if (product.user.toString() !== req.user.id) {
    return res.status(403).json({ message: 'Not authorized to update this product' });
  }

  const { title, description, price } = req.body;

  product.title = title || product.title;
  product.description = description || product.description;
  product.price = typeof price === 'number' ? price : product.price;

  const updatedProduct = await product.save();
  res.json(updatedProduct);
};

const deleteProduct = async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    return res.status(404).json({ message: 'Product not found' });
  }

  if (product.user.toString() !== req.user.id) {
    return res.status(403).json({ message: 'Not authorized to delete this product' });
  }

  await product.remove();
  res.json({ message: 'Product removed' });
};

module.exports = {
  getProducts,
  createProduct,
  getProductById,
  updateProduct,
  deleteProduct
};
