import React, { useState } from 'react';
import { Download, Calendar, TrendingUp, Users, Package, DollarSign, FileText, Filter } from 'lucide-react';
import AdminLayout from '../../components/admin/AdminLayout';

const Reports: React.FC = () => {
  const [dateRange, setDateRange] = useState('30d');
  const [reportType, setReportType] = useState('sales');

  const reportTypes = [
    { value: 'sales', label: 'Sales Report', icon: DollarSign },
    { value: 'products', label: 'Product Performance', icon: Package },
    { value: 'customers', label: 'Customer Analytics', icon: Users },
    { value: 'inventory', label: 'Inventory Report', icon: Package },
    { value: 'financial', label: 'Financial Summary', icon: TrendingUp },
  ];

  const generateReport = (type: string) => {
    // Simulate report generation
    const reportData = {
      type,
      dateRange,
      generatedAt: new Date().toISOString(),
      data: {
        // Mock data based on report type
        ...(type === 'sales' && {
          totalSales: 45230,
          totalOrders: 1234,
          averageOrderValue: 89.50,
          topProducts: ['Product A', 'Product B', 'Product C']
        }),
        ...(type === 'products' && {
          totalProducts: 156,
          topPerforming: ['Product A', 'Product B'],
          lowStock: ['Product X', 'Product Y'],
          outOfStock: ['Product Z']
        }),
        ...(type === 'customers' && {
          totalCustomers: 2890,
          newCustomers: 245,
          returningCustomers: 1834,
          customerLifetimeValue: 285.50
        })
      }
    };

    // Create and download the report
    const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${type}-report-${new Date().toISOString().split('T')[0]}.json`;
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
            <h1 className="text-3xl font-bold text-gray-800">Reports & Analytics</h1>
            <p className="text-gray-600 mt-2">Generate detailed reports for business insights</p>
          </div>
        </div>

        {/* Report Controls */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Report Type</label>
              <select
                value={reportType}
                onChange={(e) => setReportType(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
              >
                {reportTypes.map(type => (
                  <option key={type.value} value={type.value}>{type.label}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Date Range</label>
              <select
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
              >
                <option value="7d">Last 7 days</option>
                <option value="30d">Last 30 days</option>
                <option value="90d">Last 90 days</option>
                <option value="1y">Last year</option>
                <option value="custom">Custom Range</option>
              </select>
            </div>

            <div className="flex items-end">
              <button
                onClick={() => generateReport(reportType)}
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-2 rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all duration-200 flex items-center justify-center space-x-2"
              >
                <Download size={20} />
                <span>Generate Report</span>
              </button>
            </div>
          </div>
        </div>

        {/* Quick Reports */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reportTypes.map((type) => {
            const Icon = type.icon;
            return (
              <div key={type.value} className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="p-3 bg-purple-50 rounded-lg">
                      <Icon size={24} className="text-purple-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800">{type.label}</h3>
                      <p className="text-sm text-gray-600">Generate detailed {type.label.toLowerCase()}</p>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Last updated:</span>
                    <span className="font-medium">2 hours ago</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Data points:</span>
                    <span className="font-medium">1,234</span>
                  </div>
                </div>

                <button
                  onClick={() => generateReport(type.value)}
                  className="w-full mt-4 bg-gray-100 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-200 transition-colors flex items-center justify-center space-x-2"
                >
                  <Download size={16} />
                  <span>Download</span>
                </button>
              </div>
            );
          })}
        </div>

        {/* Recent Reports */}
        <div className="bg-white rounded-lg shadow-md mt-8">
          <div className="p-6 border-b">
            <h3 className="text-lg font-semibold text-gray-800">Recent Reports</h3>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {[
                { name: 'Sales Report - January 2024', type: 'Sales', date: '2024-01-15', size: '2.3 MB' },
                { name: 'Product Performance - Q4 2023', type: 'Products', date: '2024-01-10', size: '1.8 MB' },
                { name: 'Customer Analytics - December 2023', type: 'Customers', date: '2024-01-05', size: '3.1 MB' },
              ].map((report, index) => (
                <div key={index} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <FileText className="text-gray-400" size={20} />
                    <div>
                      <h4 className="font-medium text-gray-800">{report.name}</h4>
                      <p className="text-sm text-gray-600">{report.type} • {report.date} • {report.size}</p>
                    </div>
                  </div>
                  <button className="text-purple-600 hover:text-purple-700 p-2 rounded-lg hover:bg-purple-50 transition-colors">
                    <Download size={16} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default Reports;