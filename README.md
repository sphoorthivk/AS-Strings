# FashionHub - E-Commerce Platform

A modern, full-stack e-commerce platform built with React, TypeScript, Node.js, and MongoDB. Features a complete shopping experience with admin dashboard, wishlist functionality, and comprehensive order management.

## 🚀 Features

### Customer Features
- **Product Browsing**: Browse products by category, gender, and filters
- **Search & Filter**: Advanced search with sorting and filtering options
- **Product Details**: Detailed product pages with image gallery and reviews
- **Shopping Cart**: Add/remove items, quantity management, and persistent cart
- **Wishlist**: Save favorite items with guest and authenticated user support
- **User Authentication**: Register, login, and profile management
- **Order Management**: Place orders, track status, and view order history
- **Responsive Design**: Mobile-first design that works on all devices

### Admin Features
- **Dashboard**: Comprehensive analytics and business insights
- **Product Management**: CRUD operations for products with image upload
- **Category Management**: Organize products with dynamic categories
- **Order Management**: View, update, and track customer orders
- **User Management**: Manage customer accounts and admin users
- **Delivery Zones**: Configure shipping rates by location
- **Analytics**: Detailed reports and performance metrics
- **Settings**: Configure application settings and preferences

## 🛠 Tech Stack

### Frontend
- **React 18** with TypeScript
- **Tailwind CSS** for styling
- **React Router** for navigation
- **Context API** for state management
- **Axios** for API calls
- **Lucide React** for icons
- **Recharts** for analytics visualization

### Backend
- **Node.js** with Express
- **MongoDB** with Mongoose
- **JWT** for authentication
- **Bcrypt** for password hashing
- **Multer** for file uploads
- **CORS** for cross-origin requests

## 📦 Installation

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or cloud)
- npm or yarn

### Setup Instructions

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd fashionhub
   ```

2. **Install dependencies**
   ```bash
   # Install frontend dependencies
   npm install

   # Install backend dependencies
   cd server
   npm install
   ```

3. **Environment Configuration**
   ```bash
   # Copy environment file
   cd server
   cp .env.example .env
   
   # Edit .env with your configuration
   nano .env
   ```

4. **Database Setup**
   ```bash
   # Start MongoDB (if running locally)
   mongod
   
   # Seed sample data
   cd server
   npm run seed
   ```

5. **Start the application**
   ```bash
   # Start backend server (from server directory)
   npm run dev:server
   
   # Start frontend (from root directory)
   npm run dev
   
   # Or start both concurrently
   npm run dev:full
   ```

## 🔧 Configuration

### Environment Variables

Create a `.env` file in the `server` directory with the following variables:

```env
MONGODB_URI=mongodb://localhost:27017/fashionhub
JWT_SECRET=your-super-secret-jwt-key-here
PORT=5000
NODE_ENV=development
```

### Default Admin Account
After seeding the database, you can login with:
- **Email**: admin@example.com
- **Password**: admin123

### Sample Customer Account
- **Email**: customer@example.com
- **Password**: customer123

## 📱 Usage

### Customer Workflow
1. Browse products on the homepage
2. Use search and filters to find specific items
3. Add items to cart or wishlist
4. Register/login for checkout
5. Complete purchase with shipping details
6. Track order status in account dashboard

### Admin Workflow
1. Login with admin credentials
2. Access admin dashboard from header menu
3. Manage products, categories, and orders
4. View analytics and generate reports
5. Configure settings and delivery zones

## 🎨 Design Features

- **Modern UI/UX**: Clean, intuitive interface with smooth animations
- **Responsive Design**: Optimized for desktop, tablet, and mobile
- **Dark/Light Theme**: Consistent color scheme throughout
- **Micro-interactions**: Hover effects, transitions, and loading states
- **Accessibility**: Proper ARIA labels and keyboard navigation

## 🔐 Security Features

- **JWT Authentication**: Secure token-based authentication
- **Password Hashing**: Bcrypt for secure password storage
- **Input Validation**: Server-side validation for all inputs
- **CORS Protection**: Configured for secure cross-origin requests
- **Admin Authorization**: Role-based access control

## 📊 Analytics & Reporting

- **Sales Analytics**: Revenue, orders, and conversion tracking
- **Product Performance**: Best sellers and inventory insights
- **Customer Analytics**: User behavior and lifetime value
- **Custom Reports**: Exportable reports in multiple formats

## 🚚 Delivery & Shipping

- **Zone-based Shipping**: Configure rates by geographic location
- **Free Shipping**: Automatic free shipping for orders over threshold
- **Order Tracking**: Real-time order status updates
- **Multiple Payment Methods**: COD and digital payment support

## 🛡 Error Handling

- **Global Error Handling**: Comprehensive error catching and logging
- **User-friendly Messages**: Clear error messages for users
- **Validation Feedback**: Real-time form validation
- **Fallback UI**: Graceful degradation for failed requests

## 📈 Performance Optimizations

- **Image Optimization**: Efficient image loading and caching
- **Code Splitting**: Lazy loading for better performance
- **API Optimization**: Efficient database queries and pagination
- **Caching**: Strategic caching for improved response times

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Check the documentation
- Review the code comments for implementation details

## 🔮 Future Enhancements

- **Multi-vendor Support**: Allow multiple sellers
- **Advanced Analytics**: Machine learning insights
- **Mobile App**: React Native mobile application
- **Payment Gateway**: Integration with Stripe/PayPal
- **Inventory Management**: Advanced stock management
- **Email Notifications**: Automated email campaigns
- **Social Features**: Reviews, ratings, and social sharing
- **Internationalization**: Multi-language support

---

Built with ❤️ using modern web technologies for a complete e-commerce experience.