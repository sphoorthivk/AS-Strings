import mongoose from 'mongoose';
import 'dotenv/config';

import User from './models/User.js';
import Product from './models/Product.js';
import connectDB from './config/database.js';

const seedData = async () => {
  try {
    await connectDB();
    
    // Clear existing data
    await User.deleteMany({});
    await Product.deleteMany({});
    
    // Create admin user
    const adminUser = new User({
      name: 'Admin User',
      email: 'admin@example.com',
      password: 'admin123',
      role: 'admin'
    });
    await adminUser.save();
    
    // Create sample customer
    const customerUser = new User({
      name: 'Customer User',
      email: 'customer@example.com',
      password: 'customer123',
      phone: '+1234567890'
    });
    await customerUser.save();

    // Sample products
    const products = [
      {
        name: 'Elegant Summer Dress',
        description: 'A beautiful flowing summer dress perfect for any occasion. Made with premium cotton blend fabric.',
        price: 89.99,
        originalPrice: 129.99,
        images: ['https://images.pexels.com/photos/1021693/pexels-photo-1021693.jpeg?auto=compress&cs=tinysrgb&w=600'],
        category: 'Dresses',
        gender: 'women',
        sizes: ['S', 'M', 'L', 'XL'],
        colors: ['Red', 'Blue', 'Green'],
        stock: new Map([['S', 10], ['M', 15], ['L', 12], ['XL', 8]]),
        rating: 4.8,
        featured: true
      },
      {
        name: 'Classic Denim Jacket',
        description: 'Timeless denim jacket that never goes out of style. Perfect for layering.',
        price: 79.99,
        originalPrice: 99.99,
        images: ['https://images.pexels.com/photos/1040945/pexels-photo-1040945.jpeg?auto=compress&cs=tinysrgb&w=600'],
        category: 'Jackets',
        gender: 'unisex',
        sizes: ['S', 'M', 'L', 'XL'],
        colors: ['Blue', 'Black'],
        stock: new Map([['S', 8], ['M', 12], ['L', 10], ['XL', 6]]),
        rating: 4.6,
        featured: true
      },
      {
        name: 'Casual Cotton T-Shirt',
        description: 'Comfortable everyday t-shirt made from 100% organic cotton.',
        price: 24.99,
        originalPrice: 34.99,
        images: ['https://images.pexels.com/photos/1192609/pexels-photo-1192609.jpeg?auto=compress&cs=tinysrgb&w=600'],
        category: 'T-Shirts',
        gender: 'men',
        sizes: ['S', 'M', 'L', 'XL'],
        colors: ['White', 'Black', 'Gray'],
        stock: new Map([['S', 20], ['M', 25], ['L', 18], ['XL', 15]]),
        rating: 4.9,
        featured: true
      },
      {
        name: 'Premium Leather Boots',
        description: 'Handcrafted leather boots with superior comfort and durability.',
        price: 149.99,
        originalPrice: 199.99,
        images: ['https://images.pexels.com/photos/1032110/pexels-photo-1032110.jpeg?auto=compress&cs=tinysrgb&w=600'],
        category: 'Shoes',
        gender: 'unisex',
        sizes: ['7', '8', '9', '10', '11'],
        colors: ['Brown', 'Black'],
        stock: new Map([['7', 5], ['8', 8], ['9', 10], ['10', 7], ['11', 4]]),
        rating: 4.7,
        featured: true
      },
      {
        name: 'Floral Print Blouse',
        description: 'Elegant floral blouse perfect for office or casual wear.',
        price: 59.99,
        originalPrice: 79.99,
        images: ['https://images.pexels.com/photos/1536619/pexels-photo-1536619.jpeg?auto=compress&cs=tinysrgb&w=600'],
        category: 'Blouses',
        gender: 'women',
        sizes: ['S', 'M', 'L'],
        colors: ['Floral', 'White'],
        stock: new Map([['S', 12], ['M', 15], ['L', 10]]),
        rating: 4.5
      },
      {
        name: 'Slim Fit Jeans',
        description: 'Modern slim fit jeans with stretch for comfort and style.',
        price: 69.99,
        originalPrice: 89.99,
        images: ['https://images.pexels.com/photos/1598507/pexels-photo-1598507.jpeg?auto=compress&cs=tinysrgb&w=600'],
        category: 'Jeans',
        gender: 'men',
        sizes: ['28', '30', '32', '34', '36'],
        colors: ['Blue', 'Black', 'Gray'],
        stock: new Map([['28', 8], ['30', 12], ['32', 15], ['34', 10], ['36', 6]]),
        rating: 4.4
      }
    ];

    await Product.insertMany(products);
    
    console.log('Sample data seeded successfully!');
    console.log('Admin login: admin@example.com / admin123');
    console.log('Customer login: customer@example.com / customer123');
    
    process.exit(0);
  } catch (error) {
    console.error('Error seeding data:', error);
    process.exit(1);
  }
};

seedData();