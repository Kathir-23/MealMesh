import express from 'express';
import cors from 'cors';
import { protect } from './middleware/auth.js';
import { User, Donation, Contact } from './models/index.js';
import { generateToken, hashPassword, comparePassword } from './utils/auth.js';
import { validateDonation, validateContact } from './middleware/validation.js';
import logger from './utils/logger.js';
import { connectDB } from './db.js';

const app = express();

// Connect to MongoDB at app startup
try {
  await connectDB();
  console.log('Database connected successfully');
} catch (error) {
  console.error('Database connection failed:', error.message);
}

// Error handling middleware (place at the beginning)
app.use((req, res, next) => {
  try {
    next();
  } catch (error) {
    logger.error('Unhandled error in middleware:', error);
    res.status(500).json({ message: 'Server error occurred' });
  }
});

app.use(express.json());

// Updated CORS configuration for all environments
const corsOptions = {
  origin: function (origin, callback) {

    const allowedOrigins = [
      'http://localhost:5173',
      'https://mealmesh.vercel.app'
    ];
    
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, origin);  // Return the specific origin instead of wildcard
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

app.use(cors(corsOptions));

// Make sure OPTIONS requests are handled properly
app.options('*', cors(corsOptions));

app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok', environment: process.env.NODE_ENV });
});

// Auth Routes
app.post('/api/auth/register', async (req, res) => {
  try {
    const { name, email, password, phone, address, type } = req.body;
    
    if (!name || !email || !password || !phone || !address || !type) {
      return res.status(400).json({ 
        message: 'All fields are required',
        requiredFields: ['name', 'email', 'password', 'phone', 'address', 'type']
      });
    }
    
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const hashedPassword = await hashPassword(password);
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      phone,
      address,
      type
    });

    res.status(201).json({
      id: user._id,
      name: user.name,
      email: user.email,
      type: user.type,
      token: generateToken(user)
    });
  } catch (error) {
    logger.error('Registration error:', error);
    res.status(500).json({ message: 'Server error during registration' });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    // Log incoming request
    logger.debug('Login request received:', req.body);
    
    const { email, password, type } = req.body;
    
    if (!email || !password || !type) {
      return res.status(400).json({ message: 'Email, password and type are required' });
    }
    
    const user = await User.findOne({ email, type });

    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    
    const isPasswordMatch = await comparePassword(password, user.password);
    
    if (!isPasswordMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Generate JWT token
    const token = generateToken(user);
    
    // Send user data and token
    res.json({
      id: user._id,
      name: user.name,
      email: user.email,
      type: user.type,
      token
    });
  } catch (error) {
    logger.error('Login error:', error);
    res.status(500).json({ message: 'Server error during login', error: error.message });
  }
});

// Contact Route - Moved outside protected routes
app.post('/api/contact', validateContact, async (req, res) => {
  try {
    const contact = await Contact.create(req.body);
    res.status(201).json(contact);
  } catch (error) {
    logger.error('Contact submission error', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Protected Routes
app.use(protect);

// Donation Routes
app.post('/api/donations', protect, validateDonation, async (req, res) => {
  try {
    if (!req.body.items || !req.body.quantity || !req.body.pickupTime || !req.body.location) {
      return res.status(400).json({ message: 'Missing required fields' });
    }
    
    const donation = await Donation.create({
      ...req.body,
      donor: req.user.id
    });
    res.status(201).json(donation);
  } catch (error) {
    logger.error('Error creating donation:', error);
    res.status(500).json({ message: 'Failed to create donation', error: error.message });
  }
});

app.get('/api/donations', async (req, res) => {
  try {
    const donations = await Donation.find()
      .populate('donor', 'name')
      .populate('organization', 'name');
    res.json(donations);
  } catch (error) {
    logger.error('Error fetching donations:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

app.put('/api/donations/:id/accept', async (req, res) => {
  try {
    const donation = await Donation.findByIdAndUpdate(
      req.params.id,
      {
        status: 'Accepted',
        organization: req.user.id
      },
      { new: true }
    );
    
    if (!donation) {
      return res.status(404).json({ message: 'Donation not found' });
    }
    
    res.json(donation);
  } catch (error) {
    logger.error('Error accepting donation:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

app.put('/api/donations/:id/distribute', async (req, res) => {
  try {
    const donation = await Donation.findByIdAndUpdate(
      req.params.id,
      { 
        status: 'Distributed',
        distribution: req.body
      },
      { new: true }
    );
    
    if (!donation) {
      return res.status(404).json({ message: 'Donation not found' });
    }
    
    res.json(donation);
  } catch (error) {
    logger.error('Error distributing donation:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

app.get('/api/users/:id/stats', async (req, res) => {
  try {
    const userId = req.params.id;
    const totalDonations = await Donation.countDocuments({ donor: userId });
    const activeDonations = await Donation.countDocuments({ donor: userId, status: 'Available' });
    const completedDonations = await Donation.countDocuments({ donor: userId, status: 'Distributed' });

    res.json({ totalDonations, activeDonations, completedDonations });
  } catch (error) {
    logger.error('Error fetching stats:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

app.put('/api/users/:id', async (req, res) => {
  try {
    const { name, phone, address, currentPassword, newPassword } = req.body;
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // If updating password, verify current password
    if (newPassword) {
      const isMatch = await comparePassword(currentPassword, user.password);
      if (!isMatch) {
        return res.status(400).json({ message: 'Current password is incorrect' });
      }
      user.password = await hashPassword(newPassword);
    }

    user.name = name || user.name;
    user.phone = phone || user.phone;
    user.address = address || user.address;

    await user.save();

    res.status(200).json({
      id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      address: user.address,
      type: user.type
    });
  } catch (error) {
    logger.error('Error updating user:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Global error handler (place at the end)
app.use((err, req, res, next) => {
  logger.error('Global error handler:', err);
  res.status(500).json({ 
    message: 'An internal server error occurred',
    error: process.env.NODE_ENV === 'development' ? err.message : 'Server error' 
  });
});

export default app;