import express from 'express';
import PaymentSettings from '../models/PaymentSettings.js';
import { adminAuth } from '../middleware/auth.js';

const router = express.Router();

// Get payment settings (public)
router.get('/', async (req, res) => {
  try {
    let settings = await PaymentSettings.findOne();
    
    if (!settings) {
      // Create default settings if none exist
      settings = new PaymentSettings();
      await settings.save();
    }
    
    res.json(settings);
  } catch (error) {
    console.error('Error fetching payment settings:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Update payment settings (Admin only)
router.put('/', adminAuth, async (req, res) => {
  try {
    const {
      codEnabled,
      qrEnabled,
      upiId,
      businessName,
      whatsappNumber,
      qrCodeUrl,
      paymentInstructions
    } = req.body;

    let settings = await PaymentSettings.findOne();
    
    if (!settings) {
      settings = new PaymentSettings();
    }

    // Update settings
    if (codEnabled !== undefined) settings.codEnabled = codEnabled;
    if (qrEnabled !== undefined) settings.qrEnabled = qrEnabled;
    if (upiId) settings.upiId = upiId;
    if (businessName) settings.businessName = businessName;
    if (whatsappNumber) settings.whatsappNumber = whatsappNumber;
    if (qrCodeUrl !== undefined) settings.qrCodeUrl = qrCodeUrl;
    if (paymentInstructions) settings.paymentInstructions = paymentInstructions;

    await settings.save();
    
    res.json(settings);
  } catch (error) {
    console.error('Error updating payment settings:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

export default router;