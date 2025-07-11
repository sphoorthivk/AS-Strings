import express from 'express';
import { upload } from '../middleware/upload.js';
import { adminAuth } from '../middleware/auth.js';
import Image from '../models/Image.js';

const router = express.Router();

// Upload multiple images
router.post('/images', adminAuth, upload.array('images', 10), async (req, res) => {
  try {
    console.log('Upload request received');
    console.log('Files:', req.files?.length || 0);
    console.log('User:', req.user?.email);
    
    if (!req.files || req.files.length === 0) {
      console.log('No files uploaded');
      return res.status(400).json({ message: 'No images uploaded' });
    }

    const savedImages = [];

    for (const file of req.files) {
      try {
        console.log(`Processing file: ${file.originalname}, size: ${file.size}`);
        
        // Validate file size (5MB limit)
        if (file.size > 5 * 1024 * 1024) {
          console.log(`File too large: ${file.originalname}`);
          return res.status(400).json({ 
            message: `File ${file.originalname} is too large. Maximum size is 5MB.` 
          });
        }

        // Validate file type
        if (!file.mimetype.startsWith('image/')) {
          console.log(`Invalid file type: ${file.mimetype}`);
          return res.status(400).json({ 
            message: `File ${file.originalname} is not a valid image.` 
          });
        }

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
        console.log(`Image saved with ID: ${savedImage._id}`);
        savedImages.push(savedImage._id);
      } catch (fileError) {
        console.error(`Error processing file ${file.originalname}:`, fileError);
        return res.status(500).json({ 
          message: `Error processing file ${file.originalname}`, 
          error: fileError.message 
        });
      }
    }
    
    console.log(`Successfully uploaded ${savedImages.length} images`);
    res.json({
      message: 'Images uploaded successfully',
      images: savedImages
    });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ 
      message: 'Error uploading images', 
      error: error.message,
      details: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});

// Get image by ID
router.get('/images/:id', async (req, res) => {
  try {
    console.log(`Fetching image: ${req.params.id}`);
    
    const image = await Image.findById(req.params.id);
    
    if (!image) {
      console.log(`Image not found: ${req.params.id}`);
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
    res.status(500).json({ 
      message: 'Error retrieving image', 
      error: error.message 
    });
  }
});

// Delete image
router.delete('/images/:id', adminAuth, async (req, res) => {
  try {
    console.log(`Deleting image: ${req.params.id}`);
    
    const image = await Image.findByIdAndDelete(req.params.id);
    
    if (!image) {
      console.log(`Image not found for deletion: ${req.params.id}`);
      return res.status(404).json({ message: 'Image not found' });
    }
    
    console.log(`Image deleted successfully: ${req.params.id}`);
    res.json({ message: 'Image deleted successfully' });
  } catch (error) {
    console.error('Delete error:', error);
    res.status(500).json({ 
      message: 'Error deleting image', 
      error: error.message 
    });
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
    res.status(500).json({ 
      message: 'Error retrieving images', 
      error: error.message 
    });
  }
});

export default router;