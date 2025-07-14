import mongoose from 'mongoose';

const paymentSettingsSchema = new mongoose.Schema({
  codEnabled: {
    type: Boolean,
    default: true
  },
  qrEnabled: {
    type: Boolean,
    default: true
  },
  upiId: {
    type: String,
    default: 'yourupi@bank',
    trim: true
  },
  businessName: {
    type: String,
    default: 'AS Shreads',
    trim: true
  },
  whatsappNumber: {
    type: String,
    default: '+919876543210',
    trim: true
  },
  qrCodeUrl: {
    type: String
  },
  paymentInstructions: {
    type: String,
    default: 'Scan QR and pay the exact amount. Send payment screenshot to our WhatsApp number.',
    trim: true
  }
}, {
  timestamps: true
});

// Add error handling for save operations
paymentSettingsSchema.post('save', function(error, doc, next) {
  if (error) {
    console.error('PaymentSettings save error:', error);
  }
  next(error);
});

export default mongoose.model('PaymentSettings', paymentSettingsSchema);