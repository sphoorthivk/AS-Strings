import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  originalPrice: {
    type: Number,
    min: 0
  },
  shippingCost: {
    type: Number,
    default: 0,
    min: 0
  },
  weight: {
    type: Number,
    min: 0
  },
  dimensions: {
    length: Number,
    width: Number,
    height: Number
  },
  sku: {
    type: String,
    unique: true,
    sparse: true
  },
  tags: [{
    type: String,
    trim: true
  }],
  media: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Media'
  }],
  category: {
    type: String,
    required: true
  },
  gender: {
    type: String,
    required: true,
    enum: ['men', 'women', 'unisex']
  },
  sizes: [{
    type: String,
    required: true
  }],
  colors: [{
    type: String,
    required: true
  }],
  stock: {
    type: Map,
    of: Number,
    default: {}
  },
  accessories: [{
    id: {
      type: String,
      required: true
    },
    name: {
      type: String,
      required: true
    },
    price: {
      type: Number,
      required: true,
      min: 0
    }
  }],
  rating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  },
  reviews: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5
    },
    comment: String,
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  isActive: {
    type: Boolean,
    default: true
  },
  featured: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// Generate SKU if not provided
productSchema.pre('save', function(next) {
  if (!this.sku) {
    this.sku = `SKU-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }
  next();
});

// Calculate average rating
productSchema.methods.calculateAverageRating = function() {
  if (this.reviews.length === 0) return 0;
  const sum = this.reviews.reduce((acc, review) => acc + review.rating, 0);
  return (sum / this.reviews.length).toFixed(1);
};

export default mongoose.model('Product', productSchema);