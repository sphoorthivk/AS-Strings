import express from 'express';
import { upload } from '../middleware/upload.js';
import { adminAuth } from '../middleware/auth.js';
import Media from '../models/Media.js';

const router = express.Router();

// Upload multiple media files (images and videos)
router.post('/media', adminAuth, upload.array('media', 10), async (req, res) => {
  try {
    console.log('Media upload request received');
    console.log('Files:', req.files?.length || 0);
    console.log('User:', req.user?.email);
    
    if (!req.files || req.files.length === 0) {
      console.log('No media files uploaded');
      return res.status(400).json({ message: 'No media files uploaded' });
    }

    const savedMedia = [];

    for (const file of req.files) {
      try {
        console.log(`Processing file: ${file.originalname}, size: ${file.size}`);
        
        // Validate file size (10MB limit for videos, 5MB for images)
        const maxSize = file.mimetype.startsWith('video/') ? 10 * 1024 * 1024 : 5 * 1024 * 1024;
        if (file.size > maxSize) {
        if (file.size > maxSize) {
          console.log(`File too large: ${file.originalname}`);
          const maxSizeMB = file.mimetype.startsWith('video/') ? '10MB' : '5MB';
          return res.status(400).json({ 
            message: `File ${file.originalname} is too large. Maximum size is ${maxSizeMB}.` 
          });
          });
        }

        // Validate file type
        if (!file.mimetype.startsWith('image/') && !file.mimetype.startsWith('video/')) {
          console.log(`Invalid file type: ${file.mimetype}`);
          return res.status(400).json({ 
            message: `File ${file.originalname} is not a valid image or video.` 
          });
        }

        // Convert buffer to base64
        const base64Data = file.buffer.toString('base64');
        
        // Determine media type
        const mediaType = file.mimetype.startsWith('image/') ? 'image' : 'video';
        
        // Create media document
        const media = new Media({
        
        // Create media document
        const media = new Media({
          filename: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          originalName: file.originalname,
          mimetype: file.mimetype,
          size: file.size,
          data: base64Data,
          type: mediaType,
          type: mediaType,
          productId: null // Will be set when product is created/updated
        });

        const savedMediaItem = await media.save();
        console.log(`Media saved with ID: ${savedMediaItem._id}`);
        savedMedia.push(savedMediaItem._id);
      } catch (fileError) {
        console.error(`Error processing file ${file.originalname}:`, fileError);
        return res.status(500).json({ 
          message: `Error processing file ${file.originalname}`, 
          error: fileError.message 
        });
      }
    }
    
    console.log(`Successfully uploaded ${savedMedia.length} media files`);
    res.json({
      message: 'Media files uploaded successfully',
      media: savedMedia
    });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ 
      message: 'Error uploading media files', 
      error: error.message,
      details: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});

// Get media by ID
router.get('/media/:id', async (req, res) => {
  try {
    console.log(`Fetching media: ${req.params.id}`);
    
    const media = await Media.findById(req.params.id);
    
    if (!media) {
      console.log(`Media not found: ${req.params.id}`);
      return res.status(404).json({ message: 'Media not found' });
    }

    // Set appropriate headers
    res.set({
      'Content-Type': media.mimetype,
      'Content-Length': media.size,
      'Cache-Control': 'public, max-age=31536000' // Cache for 1 year
    });

    // Send the base64 decoded media
    const mediaBuffer = Buffer.from(media.data, 'base64');
    res.send(mediaBuffer);
  } catch (error) {
    console.error('Get media error:', error);
    res.status(500).json({ 
      message: 'Error retrieving media', 
      error: error.message 
    });
  }
});

// Delete media
router.delete('/media/:id', adminAuth, async (req, res) => {
  try {
    console.log(`Deleting media: ${req.params.id}`);
    
    const media = await Media.findByIdAndDelete(req.params.id);
    
    if (!media) {
      console.log(`Media not found for deletion: ${req.params.id}`);
      return res.status(404).json({ message: 'Media not found' });
    }
    
    console.log(`Media deleted successfully: ${req.params.id}`);
    res.json({ message: 'Media deleted successfully' });
  } catch (error) {
    console.error('Delete error:', error);
    res.status(500).json({ 
      message: 'Error deleting media', 
      error: error.message 
    });
  }
});

// Get all media (admin only)
router.get('/media', adminAuth, async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    
    const mediaFiles = await Media.find()
      .select('-data') // Exclude base64 data for listing
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Media.countDocuments();

    res.json({
      media: mediaFiles,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    console.error('Get media error:', error);
    res.status(500).json({ 
      message: 'Error retrieving media files', 
      error: error.message 
    });
  }
});

export default router;