import express from 'express';
import Category from '../models/Category.js';
import { auth, adminAuth } from '../middleware/auth.js';

const router = express.Router();

// Get all categories
router.get('/', async (req, res) => {
  try {
    const { gender, active } = req.query;
    
    const filter = {};
    if (gender && gender !== 'all') filter.gender = gender;
    if (active !== undefined) filter.isActive = active === 'true';

    const categories = await Category.find(filter).sort({ name: 1 });
    res.json(categories);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get single category
router.get('/:id', async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }

    res.json(category);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Create category (Admin only)
router.post('/', adminAuth, async (req, res) => {
  try {
    const { name, gender, description } = req.body;

    // Check if category already exists for this gender
    const existingCategory = await Category.findOne({ 
      name: { $regex: new RegExp(`^${name}$`, 'i') }, 
      gender 
    });

    if (existingCategory) {
      return res.status(400).json({ 
        message: `Category "${name}" already exists for ${gender}` 
      });
    }

    const category = new Category({
      name,
      gender,
      description
    });

    await category.save();
    res.status(201).json(category);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: 'Category already exists' });
    }
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Update category (Admin only)
router.put('/:id', adminAuth, async (req, res) => {
  try {
    const { name, gender, description, isActive } = req.body;

    // Check if another category with same name and gender exists
    if (name && gender) {
      const existingCategory = await Category.findOne({ 
        name: { $regex: new RegExp(`^${name}$`, 'i') }, 
        gender,
        _id: { $ne: req.params.id }
      });

      if (existingCategory) {
        return res.status(400).json({ 
          message: `Category "${name}" already exists for ${gender}` 
        });
      }
    }

    const category = await Category.findByIdAndUpdate(
      req.params.id,
      { name, gender, description, isActive },
      { new: true, runValidators: true }
    );
    
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }

    res.json(category);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Delete category (Admin only)
router.delete('/:id', adminAuth, async (req, res) => {
  try {
    const category = await Category.findByIdAndDelete(req.params.id);
    
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }

    res.json({ message: 'Category deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

export default router;