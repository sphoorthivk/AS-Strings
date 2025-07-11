import mongoose from 'mongoose';

const mediaSchema = new mongoose.Schema({
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
    type: String, // base64 encoded media data
    required: true
  },
  type: {
    type: String,
    enum: ['image', 'video'],
    required: true
  },
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    default: null,
    index: true
  },
  order: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// Virtual for getting the data URL
mediaSchema.virtual('dataUrl').get(function() {
  return `data:${this.mimetype};base64,${this.data}`;
});

// Ensure virtual fields are serialized
mediaSchema.set('toJSON', { virtuals: true });

export default mongoose.model('Media', mediaSchema);