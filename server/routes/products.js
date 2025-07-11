import express from 'express';
import Product from '../models/Product.js';
import Image from '../models/Image.js';
import Category from '../models/Category.js';
import { auth, adminAuth } from '../middleware/auth.js';

const router = express.Router();

// Get all products with filtering and pagination
router.get('/', async (req, res) => {
  try {
    const {
      page = 1,
      limit = 12,
      category,
      gender,
      minPrice,
      maxPrice,
      size,
      color,
      search,
      sortBy = 'createdAt',
      sortOrder = 'desc',
      featured
    } = req.query;

    // Build filter object
    const filter = { isActive: true };
    
    if (category && category !== 'All' && category !== '') filter.category = category;
    if (gender && gender !== 'All' && gender !== '') filter.gender = gender;
    if (size && size !== 'All' && size !== '') filter.sizes = { $in: [size] };
    if (color && color !== 'All' && color !== '') filter.colors = { $in: [color] };
    if (featured === 'true') filter.featured = true;
    
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }
    
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { category: { $regex: search, $options: 'i' } },
        { tags: { $in: [new RegExp(search, 'i')] } }
      ];
    }

    // Sort options
    const sortOptions = {};
    if (sortBy === 'price-low') {
      sortOptions.price = 1;
    } else if (sortBy === 'price-high') {
      sortOptions.price = -1;
    } else if (sortBy === 'rating') {
      sortOptions.rating = -1;
    } else {
      sortOptions.createdAt = -1; // newest first
    }

    const products = await Product.find(filter)
      .sort(sortOptions)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .populate('reviews.user', 'name')
      .populate('images');

    const total = await Product.countDocuments(filter);

    res.json({
      products,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get single product
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate('reviews.user', 'name')
      .populate('images');
    
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.json(product);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Create product (Admin only)
router.post('/', adminAuth, async (req, res) => {
  try {
    console.log('Creating product with data:', req.body);
    console.log('User:', req.user?.email);
    
    const productData = { ...req.body };
    
    // Validate required fields
    if (!productData.name || !productData.description || !productData.price || !productData.category) {
      return res.status(400).json({ 
        message: 'Missing required fields: name, description, price, and category are required' 
      });
    }

    // Validate that the category exists in the database
    const categoryExists = await Category.findOne({ 
      name: productData.category,
      isActive: true 
    });
    
    if (!categoryExists) {
      return res.status(400).json({ 
        message: `Category "${productData.category}" does not exist or is inactive. Please create the category first.` 
      });
    }
    // Validate price
    if (isNaN(productData.price) || productData.price <= 0) {
      return res.status(400).json({ 
        message: 'Price must be a valid positive number' 
      });
    }

    // Validate sizes array
    if (!productData.sizes || !Array.isArray(productData.sizes) || productData.sizes.length === 0) {
      return res.status(400).json({ 
        message: 'At least one size must be selected' 
      });
    }

    // Validate colors array
    if (!productData.colors || !Array.isArray(productData.colors) || productData.colors.length === 0) {
      return res.status(400).json({ 
        message: 'At least one color must be selected' 
      });
    }

    // Validate images array
    if (!productData.images || !Array.isArray(productData.images) || productData.images.length === 0) {
      return res.status(400).json({ 
        message: 'At least one image must be uploaded' 
      });
    }

    // Validate stock object
    if (!productData.stock || typeof productData.stock !== 'object') {
      return res.status(400).json({ 
        message: 'Stock information is required for all sizes' 
      });
    }

    // Ensure stock is provided for all sizes
    for (const size of productData.sizes) {
      if (!(size in productData.stock)) {
        productData.stock[size] = 0;
      }
    }

    console.log('Validated product data:', productData);
    
    const product = new Product(productData);
    await product.save();
    
    console.log('Product created with ID:', product._id);
    
    // Update image references with product ID
    if (productData.images && productData.images.length > 0) {
      try {
        const updateResult = await Image.updateMany(
          { _id: { $in: productData.images } },
          { productId: product._id }
        );
        console.log('Updated image references:', updateResult);
      } catch (imageError) {
        console.error('Error updating image references:', imageError);
        // Don't fail the product creation if image update fails
      }
    }
    
    await product.populate('images');
    console.log('Product creation successful');
    res.status(201).json(product);
  } catch (error) {
    console.error('Product creation error:', error);
    
    // Handle validation errors
    if (error.name === 'ValidationError') {
      const validationErrors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({ 
        message: 'Validation error', 
        errors: validationErrors 
      });
    }
    
    // Handle duplicate key errors
    if (error.code === 11000) {
      return res.status(400).json({ 
        message: 'Product with this SKU already exists' 
      });
    }
    
    res.status(500).json({ 
      message: 'Server error creating product', 
      error: error.message,
      details: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});

// Update product (Admin only)
router.put('/:id', adminAuth, async (req, res) => {
  try {
    const productData = { ...req.body };
    
    // Get current product to handle image changes
    const currentProduct = await Product.findById(req.params.id);
    if (!currentProduct) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    // Update image references
    if (productData.images) {
      // Remove product reference from old images
      await Image.updateMany(
        { productId: req.params.id },
        { productId: null }
      );
      
      // Add product reference to new images
      if (productData.images.length > 0) {
        await Image.updateMany(
          { _id: { $in: productData.images } },
          { productId: req.params.id }
        );
      }
    }
    
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      productData,
      { new: true, runValidators: true }
    ).populate('images');
    
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.json(product);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Delete product (Admin only)
router.delete('/:id', adminAuth, async (req, res) => {
  try {
    // Get product to find associated images
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    // Delete associated images
    if (product.images && product.images.length > 0) {
      await Image.deleteMany({ _id: { $in: product.images } });
    }
    
    // Delete the product
    const product = await Product.findByIdAndDelete(req.params.id);
    
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Add review
router.post('/:id/reviews', auth, async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const product = await Product.findById(req.params.id);
    
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Check if user already reviewed
    const existingReview = product.reviews.find(
      review => review.user.toString() === req.user._id.toString()
    );

    if (existingReview) {
      return res.status(400).json({ message: 'You have already reviewed this product' });
    }

    product.reviews.push({
      user: req.user._id,
      rating,
      comment
    });

    // Update average rating
    product.rating = product.calculateAverageRating();
    await product.save();

    res.status(201).json({ message: 'Review added successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

export default router;