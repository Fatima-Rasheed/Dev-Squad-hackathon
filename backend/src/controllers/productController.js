const Product = require('../models/Product');

const getProducts = async (req, res) => {
  try {
    const {
      category,
      flavor,
      minPrice,
      maxPrice,
      minRating,
      sortBy,
      page = 1,
      limit = 10,
    } = req.query;

    const filter = { isActive: true };

    if (category) filter.category = category;
    if (flavor) filter.flavor = { $regex: flavor, $options: 'i' };
    if (minRating) filter.rating = { $gte: Number(minRating) };

    if (minPrice || maxPrice) {
      filter['variants.price'] = {};
      if (minPrice) filter['variants.price'].$gte = Number(minPrice);
      if (maxPrice) filter['variants.price'].$lte = Number(maxPrice);
    }

    let sortOption = {};
    if (sortBy === 'price-low') sortOption = { 'variants.0.price': 1 };
    else if (sortBy === 'price-high') sortOption = { 'variants.0.price': -1 };
    else if (sortBy === 'rating') sortOption = { rating: -1 };
    else if (sortBy === 'newest') sortOption = { createdAt: -1 };
    else sortOption = { createdAt: -1 };

    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    const total = await Product.countDocuments(filter);
    const products = await Product.find(filter)
      .sort(sortOption)
      .skip(skip)
      .limit(limitNum);

    res.json({
      products,
      currentPage: pageNum,
      totalPages: Math.ceil(total / limitNum),
      totalProducts: total,
      limit: limitNum,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product || !product.isActive) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createProduct = async (req, res) => {
  try {
    const product = await Product.create(req.body);
    res.status(201).json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      { isActive: false },
      { new: true }
    );
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json({ message: 'Product removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
};