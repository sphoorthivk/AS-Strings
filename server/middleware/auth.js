import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const auth = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      console.log('No token provided');
      return res.status(401).json({ message: 'No token, authorization denied' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId).select('-password');
    
    if (!user) {
      console.log('User not found for token');
      return res.status(401).json({ message: 'Token is not valid' });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    res.status(401).json({ message: 'Token is not valid' });
  }
};

const adminAuth = async (req, res, next) => {
  try {
    console.log('=== ADMIN AUTH MIDDLEWARE ===');
    console.log('Request URL:', req.url);
    console.log('Request method:', req.method);
    
    await auth(req, res, () => {
      console.log('User authenticated:', req.user?.email);
      console.log('User role:', req.user?.role);
      console.log('User ID:', req.user?._id);
      
      if (req.user.role !== 'admin') {
        console.log('ACCESS DENIED: User is not admin');
        return res.status(403).json({ message: 'Access denied. Admin only.' });
      }
      console.log('Admin access granted');
      console.log('=== END ADMIN AUTH ===');
      next();
    });
  } catch (error) {
    console.error('=== ADMIN AUTH ERROR ===');
    console.error('Error:', error);
    console.error('=== END ADMIN AUTH ERROR ===');
    res.status(401).json({ message: 'Authorization failed' });
  }
};

export { auth, adminAuth };