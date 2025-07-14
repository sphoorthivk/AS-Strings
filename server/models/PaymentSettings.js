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
    default: 'yourupi@bank'
  },
  businessName: {
    type: String,
    default: 'AS Shreads'
  },
  whatsappNumber: {
    type: String,
    default: '+919876543210'
  },
  qrCodeUrl: {
    type: String,
    default: ''
  },
  paymentInstructions: {
    type: String,
    default: 'Scan QR and pay the exact amount. Send payment screenshot to our WhatsApp number.'
  }
}, {
  timestamps: true
});

export default mongoose.model('PaymentSettings', paymentSettingsSchema);