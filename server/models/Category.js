import mongoose from 'mongoose';

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    unique: true
  },
  gender: {
    type: String,
    required: true,
    enum: ['men', 'women', 'unisex']
  },
  description: {
    type: String,
    trim: true
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Ensure unique category name per gender
categorySchema.index({ name: 1, gender: 1 }, { unique: true });

export default mongoose.model('Category', categorySchema);