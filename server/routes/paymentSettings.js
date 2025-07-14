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
    console.log('=== PAYMENT SETTINGS UPDATE SERVER ===');
    console.log('Request body:', JSON.stringify(req.body, null, 2));
    console.log('User:', req.user?.email);
    console.log('User role:', req.user?.role);
    
    const {
      codEnabled,
      qrEnabled,
      upiId,
      businessName,
      whatsappNumber,
      qrCodeUrl,
      paymentInstructions
    } = req.body;

    console.log('Extracted fields:', {
      codEnabled,
      qrEnabled,
      upiId,
      businessName,
      whatsappNumber,
      qrCodeUrl: qrCodeUrl ? 'Present' : 'Not present',
      paymentInstructions
    });
    
    let settings = await PaymentSettings.findOne();
    console.log('Current settings from DB:', settings);
    
    if (!settings) {
      console.log('No existing settings found, creating new ones');
      settings = new PaymentSettings();
    }

    // Update settings
    if (codEnabled !== undefined) settings.codEnabled = codEnabled;
    if (qrEnabled !== undefined) settings.qrEnabled = qrEnabled;
    if (upiId !== undefined) settings.upiId = upiId.trim();
    if (businessName !== undefined) settings.businessName = businessName.trim();
    if (whatsappNumber !== undefined) settings.whatsappNumber = whatsappNumber.trim();
    if (qrCodeUrl !== undefined) settings.qrCodeUrl = qrCodeUrl;
    if (paymentInstructions !== undefined) settings.paymentInstructions = paymentInstructions.trim();

    await settings.save();
    console.log('Payment settings saved successfully');
    console.log('Updated settings:', JSON.stringify(settings.toObject(), null, 2));
    console.log('=== END PAYMENT SETTINGS UPDATE SERVER ===');
    
    res.json(settings);
  } catch (error) {
    console.error('=== PAYMENT SETTINGS SERVER ERROR ===');
    console.error('Error details:', error);
    console.error('Error stack:', error.stack);
    console.error('=== END SERVER ERROR ===');
    
    res.status(500).json({ 
      message: 'Server error updating payment settings', 
      error: error.message,
      details: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});

export default router;