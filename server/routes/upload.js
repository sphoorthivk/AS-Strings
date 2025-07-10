import express from 'express';
import { upload } from '../middleware/upload.js';
import { adminAuth } from '../middleware/auth.js';
import Image from '../models/Image.js';

const router = express.Router();

// Upload multiple images
router.post('/images', adminAuth, upload.array('images', 10), async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: 'No images uploaded' });
    }

    const savedImages = [];

    for (const file of req.files) {
      // Convert buffer to base64
      const base64Data = file.buffer.toString('base64');
      
      // Create image document
      const image = new Image({
        filename: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        originalName: file.originalname,
        mimetype: file.mimetype,
        size: file.size,
        data: base64Data,
        productId: null // Will be set when product is created/updated
      });

      const savedImage = await image.save();
      savedImages.push(savedImage._id);
    }
    
    res.json({
      message: 'Images uploaded successfully',
      images: savedImages
    });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ message: 'Error uploading images', error: error.message });
  }
});

// Get image by ID
router.get('/images/:id', async (req, res) => {
  try {
    const image = await Image.findById(req.params.id);
    
    if (!image) {
      return res.status(404).json({ message: 'Image not found' });
    }

    // Set appropriate headers
    res.set({
      'Content-Type': image.mimetype,
      'Content-Length': image.size,
      'Cache-Control': 'public, max-age=31536000' // Cache for 1 year
    });

    // Send the base64 decoded image
    const imageBuffer = Buffer.from(image.data, 'base64');
    res.send(imageBuffer);
  } catch (error) {
    console.error('Get image error:', error);
    res.status(500).json({ message: 'Error retrieving image', error: error.message });
  }
});

// Delete image
router.delete('/images/:id', adminAuth, async (req, res) => {
  try {
    const image = await Image.findByIdAndDelete(req.params.id);
    
    if (!image) {
      return res.status(404).json({ message: 'Image not found' });
    }
    
    res.json({ message: 'Image deleted successfully' });
  } catch (error) {
    console.error('Delete error:', error);
    res.status(500).json({ message: 'Error deleting image', error: error.message });
  }
});

// Get all images (admin only)
router.get('/images', adminAuth, async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    
    const images = await Image.find()
      .select('-data') // Exclude base64 data for listing
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Image.countDocuments();

    res.json({
      images,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    console.error('Get images error:', error);
    res.status(500).json({ message: 'Error retrieving images', error: error.message });
  }
});

export default router;