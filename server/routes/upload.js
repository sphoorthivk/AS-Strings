import express from 'express';
import Media from '../models/Media.js';
import { auth, adminAuth } from '../middleware/auth.js';
import { upload, handleMulterError } from '../middleware/upload.js';

const router = express.Router();

// Upload media files (images and videos)
router.post('/media', adminAuth, upload.array('media', 10), async (req, res) => {
  try {
    console.log('Upload request received');
    console.log('Files:', req.files?.length || 0);
    console.log('User:', req.user?.email);

    if (!req.files || req.files.length === 0) {
      console.log('No files uploaded');
      return res.status(400).json({ message: 'No files uploaded' });
    }

    const mediaIds = [];
    const mediaFiles = [];

    for (const file of req.files) {
      console.log('Processing file:', file.originalname, file.mimetype, file.size);
      
      // Convert buffer to base64
      const base64Data = file.buffer.toString('base64');
      
      // Determine media type
      const mediaType = file.mimetype.startsWith('video/') ? 'video' : 'image';
      
      // Create media document
      const media = new Media({
        filename: `${Date.now()}-${file.originalname}`,
        originalName: file.originalname,
        mimetype: file.mimetype,
        size: file.size,
        data: base64Data,
        type: mediaType,
        order: mediaIds.length
      });

      await media.save();
      console.log('Media saved with ID:', media._id);
      
      mediaIds.push(media._id);
      mediaFiles.push({
        _id: media._id,
        filename: media.filename,
        originalName: media.originalName,
        mimetype: media.mimetype,
        size: media.size,
        type: media.type,
        dataUrl: media.dataUrl
      });
    }

    console.log('Upload successful, returning media IDs:', mediaIds);
    res.status(201).json({ 
      message: 'Media uploaded successfully',
      media: mediaIds,
      files: mediaFiles
    });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ 
      message: 'Error uploading media', 
      error: error.message,
      details: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});

// Get media file by ID
router.get('/media/:id', async (req, res) => {
  try {
    const media = await Media.findById(req.params.id);
    
    if (!media) {
      return res.status(404).json({ message: 'Media not found' });
    }

    // Convert base64 back to buffer
    const buffer = Buffer.from(media.data, 'base64');
    
    // Set appropriate headers
    res.set({
      'Content-Type': media.mimetype,
      'Content-Length': buffer.length,
      'Cache-Control': 'public, max-age=31536000', // Cache for 1 year
    });
    
    res.send(buffer);
  } catch (error) {
    console.error('Error serving media:', error);
    res.status(500).json({ message: 'Error serving media' });
  }
});

// Get all media files (admin only)
router.get('/media', adminAuth, async (req, res) => {
  try {
    const { page = 1, limit = 20, type } = req.query;
    
    const filter = {};
    if (type && (type === 'image' || type === 'video')) {
      filter.type = type;
    }

    const media = await Media.find(filter)
      .select('-data') // Exclude base64 data for listing
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Media.countDocuments(filter);

    res.json({
      media,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    console.error('Error fetching media:', error);
    res.status(500).json({ message: 'Error fetching media' });
  }
});

// Delete media file (admin only)
router.delete('/media/:id', adminAuth, async (req, res) => {
  try {
    const media = await Media.findByIdAndDelete(req.params.id);
    
    if (!media) {
      return res.status(404).json({ message: 'Media not found' });
    }

    res.json({ message: 'Media deleted successfully' });
  } catch (error) {
    console.error('Error deleting media:', error);
    res.status(500).json({ message: 'Error deleting media' });
  }
});

// Legacy support for image uploads (redirect to media endpoint)
router.post('/images', adminAuth, upload.array('images', 10), async (req, res) => {
  try {
    // Process as media files
    req.url = '/media';
    return router.handle(req, res);
  } catch (error) {
    console.error('Legacy image upload error:', error);
    res.status(500).json({ message: 'Error uploading images' });
  }
});

// Legacy support for image serving
router.get('/images/:id', async (req, res) => {
  try {
    // Redirect to media endpoint
    req.url = `/media/${req.params.id}`;
    return router.handle(req, res);
  } catch (error) {
    console.error('Legacy image serving error:', error);
    res.status(500).json({ message: 'Error serving image' });
  }
});

// Error handling middleware
router.use(handleMulterError);

export default router;