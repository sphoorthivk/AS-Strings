import React, { useState, useEffect } from 'react';
import { Save, QrCode, CreditCard, MessageCircle, Settings } from 'lucide-react';
import AdminLayout from '../../components/admin/AdminLayout';
import { paymentSettingsAPI } from '../../services/api';
import { useToast } from '../../contexts/ToastContext';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const PaymentSettings: React.FC = () => {
  const { showToast } = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [settings, setSettings] = useState({
    codEnabled: true,
    qrEnabled: true,
    upiId: '',
    businessName: '',
    whatsappNumber: '',
    qrCodeUrl: '',
    paymentInstructions: ''
  });

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const response = await paymentSettingsAPI.getSettings();
      setSettings(response.data);
    } catch (error) {
      console.error('Error fetching payment settings:', error);
      showToast('Error loading payment settings', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      await paymentSettingsAPI.updateSettings(settings);
      showToast('Payment settings updated successfully!', 'success');
    } catch (error) {
      console.error('Error updating payment settings:', error);
      showToast('Error updating payment settings', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleInputChange = (field: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [field]: value
    }));
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex justify-center items-center h-64">
          <LoadingSpinner size="large" />
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="p-6">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Payment Settings</h1>
            <p className="text-gray-600 mt-2">Configure payment methods and options</p>
          </div>
          <button
            onClick={handleSave}
            disabled={saving}
            className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all duration-200 flex items-center space-x-2"
          >
            {saving ? <LoadingSpinner size="small" /> : <Save size={20} />}
            <span>Save Settings</span>
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Payment Methods */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
              <Settings className="mr-2" size={24} />
              Payment Methods
            </h2>

            <div className="space-y-6">
              {/* Cash on Delivery */}
              <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                <div className="flex items-center space-x-3">
                  <CreditCard className="text-green-600" size={24} />
                  <div>
                    <h3 className="font-semibold text-gray-800">Cash on Delivery</h3>
                    <p className="text-sm text-gray-600">Allow customers to pay when order arrives</p>
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.codEnabled}
                    onChange={(e) => handleInputChange('codEnabled', e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                </label>
              </div>

              {/* UPI/QR Payment */}
              <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                <div className="flex items-center space-x-3">
                  <QrCode className="text-blue-600" size={24} />
                  <div>
                    <h3 className="font-semibold text-gray-800">UPI/QR Payment</h3>
                    <p className="text-sm text-gray-600">Allow customers to pay via UPI/QR code</p>
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.qrEnabled}
                    onChange={(e) => handleInputChange('qrEnabled', e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                </label>
              </div>
            </div>
          </div>

          {/* UPI Configuration */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
              <QrCode className="mr-2" size={24} />
              UPI Configuration
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  UPI ID *
                </label>
                <input
                  type="text"
                  value={settings.upiId}
                  onChange={(e) => handleInputChange('upiId', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
                  placeholder="yourupi@bank"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Business Name *
                </label>
                <input
                  type="text"
                  value={settings.businessName}
                  onChange={(e) => handleInputChange('businessName', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
                  placeholder="AS Shreads"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  QR Code Image URL
                </label>
                <input
                  type="url"
                  value={settings.qrCodeUrl}
                  onChange={(e) => handleInputChange('qrCodeUrl', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
                  placeholder="https://example.com/qr-code.png"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Upload your QR code image and paste the URL here
                </p>
              </div>
            </div>
          </div>

          {/* WhatsApp Configuration */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
              <MessageCircle className="mr-2" size={24} />
              WhatsApp Configuration
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  WhatsApp Number *
                </label>
                <input
                  type="tel"
                  value={settings.whatsappNumber}
                  onChange={(e) => handleInputChange('whatsappNumber', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
                  placeholder="+919876543210"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Include country code (e.g., +91 for India)
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Payment Instructions
                </label>
                <textarea
                  value={settings.paymentInstructions}
                  onChange={(e) => handleInputChange('paymentInstructions', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
                  rows={4}
                  placeholder="Scan QR and pay the exact amount. Send payment screenshot to our WhatsApp number."
                />
              </div>
            </div>
          </div>

          {/* Preview */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-6">Preview</h2>

            <div className="space-y-4">
              <div className="p-4 bg-gray-50 rounded-lg">
                <h3 className="font-semibold text-gray-800 mb-2">UPI Payment String:</h3>
                <code className="text-sm text-gray-600 break-all">
                  upi://pay?pa={settings.upiId}&pn={encodeURIComponent(settings.businessName)}&am=AMOUNT&cu=INR
                </code>
              </div>

              <div className="p-4 bg-gray-50 rounded-lg">
                <h3 className="font-semibold text-gray-800 mb-2">WhatsApp Link:</h3>
                <code className="text-sm text-gray-600 break-all">
                  https://wa.me/{settings.whatsappNumber.replace(/[^0-9]/g, '')}
                </code>
              </div>

              {settings.qrCodeUrl && (
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h3 className="font-semibold text-gray-800 mb-2">QR Code Preview:</h3>
                  <img
                    src={settings.qrCodeUrl}
                    alt="QR Code Preview"
                    className="w-32 h-32 border border-gray-300 rounded-lg"
                    onError={(e) => {
                      const target = e.currentTarget as HTMLImageElement;
                      target.style.display = 'none';
                    }}
                  />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Status Summary */}
        <div className="mt-6 bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Payment Methods Status</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className={`p-4 rounded-lg border-2 ${
              settings.codEnabled 
                ? 'border-green-200 bg-green-50' 
                : 'border-red-200 bg-red-50'
            }`}>
              <div className="flex items-center space-x-2">
                <CreditCard size={20} className={settings.codEnabled ? 'text-green-600' : 'text-red-600'} />
                <span className={`font-medium ${settings.codEnabled ? 'text-green-800' : 'text-red-800'}`}>
                  Cash on Delivery: {settings.codEnabled ? 'Enabled' : 'Disabled'}
                </span>
              </div>
            </div>

            <div className={`p-4 rounded-lg border-2 ${
              settings.qrEnabled 
                ? 'border-green-200 bg-green-50' 
                : 'border-red-200 bg-red-50'
            }`}>
              <div className="flex items-center space-x-2">
                <QrCode size={20} className={settings.qrEnabled ? 'text-green-600' : 'text-red-600'} />
                <span className={`font-medium ${settings.qrEnabled ? 'text-green-800' : 'text-red-800'}`}>
                  UPI/QR Payment: {settings.qrEnabled ? 'Enabled' : 'Disabled'}
                </span>
              </div>
            </div>
          </div>

          {!settings.codEnabled && !settings.qrEnabled && (
            <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-yellow-800 font-medium">
                ⚠️ Warning: All payment methods are disabled. Customers won't be able to place orders.
              </p>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
};

export default PaymentSettings;