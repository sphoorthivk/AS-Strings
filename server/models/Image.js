import mongoose from 'mongoose';

const imageSchema = new mongoose.Schema({
  filename: {
    type: String,
    required: true
  },
  originalName: {
    type: String,
    required: true
  },
  mimetype: {
    type: String,
    required: true
  },
  size: {
    type: Number,
    required: true
  },
  data: {
    type: String, // base64 encoded image data
    required: true
  },
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    default: null,
    index: true // Add index for better query performance
  }
}, {
  timestamps: true
});

// Virtual for getting the data URL
imageSchema.virtual('dataUrl').get(function() {
  return `data:${this.mimetype};base64,${this.data}`;
});

// Ensure virtual fields are serialized
imageSchema.set('toJSON', { virtuals: true });

export default mongoose.model('Image', imageSchema);