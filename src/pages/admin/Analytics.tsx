import React, { useState, useEffect } from 'react';
import { TrendingUp, DollarSign, ShoppingCart, Users, Calendar, Download } from 'lucide-react';
import { LineChart, Line, AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import AdminLayout from '../../components/admin/AdminLayout';

const Analytics: React.FC = () => {
  const [dateRange, setDateRange] = useState('30d');
  const [loading, setLoading] = useState(false);

  const salesData = [
    { date: '2024-01-01', revenue: 4200, orders: 45, customers: 32 },
    { date: '2024-01-02', revenue: 3800, orders: 38, customers: 28 },
    { date: '2024-01-03', revenue: 5200, orders: 52, customers: 41 },
    { date: '2024-01-04', revenue: 4800, orders: 48, customers: 35 },
    { date: '2024-01-05', revenue: 6100, orders: 61, customers: 48 },
    { date: '2024-01-06', revenue: 5500, orders: 55, customers: 42 },
    { date: '2024-01-07', revenue: 7200, orders: 72, customers: 58 },
  ];

  const categoryData = [
    { name: 'Dresses', value: 35, revenue: 15400, color: '#8B5CF6' },
    { name: 'T-Shirts', value: 25, revenue: 11000, color: '#EC4899' },
    { name: 'Jeans', value: 20, revenue: 8800, color: '#10B981' },
    { name: 'Shoes', value: 15, revenue: 6600, color: '#F59E0B' },
    { name: 'Accessories', value: 5, revenue: 2200, color: '#6B7280' },
  ];

  const topProducts = [
    { name: 'Elegant Summer Dress', sales: 156, revenue: 14040, growth: 12.5 },
    { name: 'Classic Denim Jacket', sales: 134, revenue: 10720, growth: 8.3 },
    { name: 'Casual Cotton T-Shirt', sales: 298, revenue: 7445, growth: 15.2 },
    { name: 'Premium Leather Boots', sales: 89, revenue: 13351, growth: -2.1 },
    { name: 'Floral Print Blouse', sales: 167, revenue: 10013, growth: 6.8 },
  ];

  const customerMetrics = [
    { metric: 'New Customers', value: 245, change: 12.5, period: 'vs last month' },
    { metric: 'Returning Customers', value: 1834, change: 8.2, period: 'vs last month' },
    { metric: 'Customer Lifetime Value', value: 285.50, change: 15.3, period: 'average' },
    { metric: 'Churn Rate', value: 3.2, change: -1.1, period: 'vs last month' },
  ];

  const trafficSources = [
    { source: 'Organic Search', visitors: 4250, percentage: 42.5, color: '#8B5CF6' },
    { source: 'Direct', visitors: 2800, percentage: 28.0, color: '#EC4899' },
    { source: 'Social Media', visitors: 1500, percentage: 15.0, color: '#10B981' },
    { source: 'Email', visitors: 900, percentage: 9.0, color: '#F59E0B' },
    { source: 'Paid Ads', visitors: 550, percentage: 5.5, color: '#6B7280' },
  ];

  const exportData = () => {
    // Simulate data export
    const data = {
      salesData,
      categoryData,
      topProducts,
      customerMetrics,
      trafficSources,
      exportDate: new Date().toISOString()
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `analytics-report-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <AdminLayout>
      <div className="p-6">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Analytics Dashboard</h1>
            <p className="text-gray-600 mt-2">Comprehensive insights into your business performance</p>
          </div>
          <div className="flex items-center space-x-4">
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
            >
              <option value="7d">Last 7 days</option>
              <option value="30d">Last 30 days</option>
              <option value="90d">Last 90 days</option>
              <option value="1y">Last year</option>
            </select>
            <button
              onClick={exportData}
              className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-2 rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all duration-200 flex items-center space-x-2"
            >
              <Download size={20} />
              <span>Export Report</span>
            </button>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                <p className="text-2xl font-bold text-gray-900">$45,230</p>
                <p className="text-sm text-green-600 mt-1">+12.5% vs last month</p>
              </div>
              <div className="p-3 bg-green-50 rounded-lg">
                <DollarSign size={24} className="text-green-600" />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Orders</p>
                <p className="text-2xl font-bold text-gray-900">1,234</p>
                <p className="text-sm text-green-600 mt-1">+8.2% vs last month</p>
              </div>
              <div className="p-3 bg-blue-50 rounded-lg">
                <ShoppingCart size={24} className="text-blue-600" />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Conversion Rate</p>
                <p className="text-2xl font-bold text-gray-900">3.2%</p>
                <p className="text-sm text-green-600 mt-1">+0.5% vs last month</p>
              </div>
              <div className="p-3 bg-purple-50 rounded-lg">
                <TrendingUp size={24} className="text-purple-600" />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Avg Order Value</p>
                <p className="text-2xl font-bold text-gray-900">$89.50</p>
                <p className="text-sm text-green-600 mt-1">+5.1% vs last month</p>
              </div>
              <div className="p-3 bg-yellow-50 rounded-lg">
                <Calendar size={24} className="text-yellow-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Revenue Trend */}
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Revenue Trend</h3>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={salesData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" tickFormatter={(value) => new Date(value).toLocaleDateString()} />
                <YAxis />
                <Tooltip 
                  labelFormatter={(value) => new Date(value).toLocaleDateString()}
                  formatter={(value) => [`$${value}`, 'Revenue']}
                />
                <Area type="monotone" dataKey="revenue" stroke="#8B5CF6" fill="#8B5CF6" fillOpacity={0.3} />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Sales by Category */}
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Sales by Category</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={120}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [`${value}%`, 'Share']} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Orders and Customers Trend */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Orders & Customer Acquisition</h3>
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={salesData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" tickFormatter={(value) => new Date(value).toLocaleDateString()} />
              <YAxis yAxisId="left" />
              <YAxis yAxisId="right" orientation="right" />
              <Tooltip 
                labelFormatter={(value) => new Date(value).toLocaleDateString()}
              />
              <Legend />
              <Line yAxisId="left" type="monotone" dataKey="orders" stroke="#EC4899" strokeWidth={2} name="Orders" />
              <Line yAxisId="right" type="monotone" dataKey="customers" stroke="#10B981" strokeWidth={2} name="New Customers" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Top Products */}
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Top Performing Products</h3>
            <div className="space-y-4">
              {topProducts.map((product, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900">{product.name}</h4>
                    <p className="text-sm text-gray-600">{product.sales} sales</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-900">${product.revenue.toLocaleString()}</p>
                    <p className={`text-sm ${product.growth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {product.growth >= 0 ? '+' : ''}{product.growth}%
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Traffic Sources */}
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Traffic Sources</h3>
            <div className="space-y-4">
              {trafficSources.map((source, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div 
                      className="w-4 h-4 rounded-full" 
                      style={{ backgroundColor: source.color }}
                    />
                    <span className="font-medium text-gray-900">{source.source}</span>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-900">{source.visitors.toLocaleString()}</p>
                    <p className="text-sm text-gray-600">{source.percentage}%</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Customer Metrics */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Customer Metrics</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {customerMetrics.map((metric, index) => (
              <div key={index} className="text-center">
                <p className="text-sm font-medium text-gray-600 mb-2">{metric.metric}</p>
                <p className="text-2xl font-bold text-gray-900">
                  {metric.metric.includes('Value') ? '$' : ''}
                  {metric.value}
                  {metric.metric.includes('Rate') ? '%' : ''}
                </p>
                <p className={`text-sm mt-1 ${metric.change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {metric.change >= 0 ? '+' : ''}{metric.change}% {metric.period}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default Analytics;