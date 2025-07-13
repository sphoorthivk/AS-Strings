import express from 'express';
import Product from '../models/Product.js';
import Media from '../models/Media.js';
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
      .populate('media')
      .lean();

    const total = await Product.countDocuments(filter);

    console.log('=== PRODUCTS LIST FETCH DEBUG ===');
    console.log('Found products:', products.length);
    products.forEach((product, index) => {
      if (index < 3) { // Only log first 3 products to avoid spam
        console.log(`Product ${index}: ${product.name}`);
        console.log(`  Accessories:`, product.accessories || []);
        console.log(`  Accessories type:`, typeof product.accessories);
        console.log(`  Accessories is array:`, Array.isArray(product.accessories));
        console.log(`  Accessories length:`, product.accessories ? product.accessories.length : 0);
        console.log(`  Raw accessories data:`, JSON.stringify(product.accessories || []));
      }
    });
    console.log('=== END PRODUCTS LIST FETCH DEBUG ===');
    
    // Ensure accessories field exists for all products
    const processedProducts = products.map(product => ({
      ...product,
      accessories: product.accessories || []
    }));
    
    res.json({
      products: processedProducts,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    console.error('Error in products list route:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get single product
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate('reviews.user', 'name')
      .populate('media')
      .lean();
    
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    console.log('=== PRODUCT FETCH DEBUG ===');
    console.log('Product ID:', product._id);
    console.log('Product name:', product.name);
    console.log('Raw product accessories:', product.accessories || []);
    console.log('Accessories type:', typeof product.accessories);
    console.log('Accessories is array:', Array.isArray(product.accessories));
    console.log('Accessories length:', product.accessories ? product.accessories.length : 0);
    console.log('Full product object keys:', Object.keys(product));
    console.log('Complete accessories data:', JSON.stringify(product.accessories || [], null, 2));
    
    if (product.accessories && Array.isArray(product.accessories)) {
      console.log('Accessories found and properly formatted:', product.accessories);
    } else {
      console.log('Accessories not found or not an array, setting to empty array');
      product.accessories = [];
    }
    
    console.log('Sending product to frontend:', {
      productId: product._id,
      productName: product.name,
      accessories: product.accessories || [],
      accessoriesCount: product.accessories ? product.accessories.length : 0,
      fullAccessoriesData: JSON.stringify(product.accessories || [])
    });
    console.log('=== END PRODUCT FETCH DEBUG ===');
    
    // Ensure accessories field exists
    const processedProduct = {
      ...product,
      accessories: product.accessories || []
    };
    
    res.json(processedProduct);
  } catch (error) {
    console.error('Error fetching product:', error);
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

    // Validate media array
    if (!productData.media || !Array.isArray(productData.media) || productData.media.length === 0) {
      return res.status(400).json({ 
        message: 'At least one media file must be uploaded' 
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

    // Validate and process accessories
    if (!productData.accessories) {
      productData.accessories = [];
    } else if (!Array.isArray(productData.accessories)) {
      return res.status(400).json({ 
        message: 'Accessories must be an array' 
      });
    } else {
      // Validate each accessory
      for (const accessory of productData.accessories) {
        if (!accessory.id || !accessory.name || typeof accessory.price !== 'number') {
          return res.status(400).json({ 
            message: 'Each accessory must have id, name, and price' 
          });
        }
        if (accessory.price < 0) {
          return res.status(400).json({ 
            message: 'Accessory price cannot be negative' 
          });
        }
      }
    }
    console.log('Validated product data:', productData);
    console.log('Accessories being saved:', productData.accessories);
    
    const product = new Product(productData);
    await product.save();
    
    console.log('Product created with ID:', product._id);
    console.log('Product accessories saved:', product.accessories || []);
    console.log('Accessories count:', product.accessories ? product.accessories.length : 0);
    
    // Update media references with product ID
    if (productData.media && productData.media.length > 0) {
      try {
        const updateResult = await Media.updateMany(
          { _id: { $in: productData.media } },
          { productId: product._id }
        );
        console.log('Updated media references:', updateResult);
      } catch (mediaError) {
        console.error('Error updating media references:', mediaError);
        // Don't fail the product creation if media update fails
      }
    }
    
    await product.populate('media');
    console.log('Final product with populated media and accessories:', {
      id: product._id,
      name: product.name,
      accessories: product.accessories || [],
      media: product.media
    });
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
    
    // Get current product to handle media changes
    const currentProduct = await Product.findById(req.params.id);
    if (!currentProduct) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    // Update media references
    if (productData.media) {
      // Remove product reference from old media
      await Media.updateMany(
        { productId: req.params.id },
        { productId: null }
      );
      
      // Add product reference to new media
      if (productData.media.length > 0) {
        await Media.updateMany(
          { _id: { $in: productData.media } },
          { productId: req.params.id }
        );
      }
    }
    
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      productData,
      { new: true, runValidators: true }
    ).populate('media');
    
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
    // Get product to find associated media
    const products = await Product.findById(req.params.id);
    if (!products) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    // Delete associated media
    if (products.media && products.media.length > 0) {
      await Media.deleteMany({ _id: { $in: products.media } });
    }
    
    // Delete the product
    const products1 = await Product.findByIdAndDelete(req.params.id);
    
    if (!products1) {
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