const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const session = require("express-session");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
require("dotenv").config();

const app = express();

// Middleware - CORS configuration for production
// Middleware - CORS configuration for production
app.use(cors({
  origin: [
    'https://nextgen-events-platform.onrender.com',
    'http://localhost:3000', // For local development
    'http://localhost:5173'  // For Vite dev server
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Debug middleware to log all requests
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  if (req.body && Object.keys(req.body).length > 0) {
    console.log('Request Body:', req.body);
  }
  next();
});

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Session configuration
app.use(session({
  secret: process.env.SESSION_SECRET || 'your-session-secret',
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false } // Set to true in production with HTTPS
}));

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// File upload setup
const uploadDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname))
});
const upload = multer({ storage });

// Database connection with better options
console.log("MONGO_URI:", process.env.MONGO_URI ? "Loaded" : "NOT LOADED");
mongoose.connect(process.env.MONGO_URI, {
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000,
  maxPoolSize: 10
})
  .then(() => console.log("MongoDB connected successfully"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Check MongoDB connection state
const checkDBConnection = () => {
  const state = mongoose.connection.readyState;
  const states = {
    0: 'disconnected',
    1: 'connected',
    2: 'connecting',
    3: 'disconnecting'
  };
  return states[state] || 'unknown';
};

// Test endpoint
app.get('/api/test', (req, res) => {
  console.log('Test endpoint hit!');
  res.json({ 
    message: 'Backend is working!', 
    timestamp: new Date(),
    dbStatus: checkDBConnection()
  });
});

// Database health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    database: checkDBConnection(),
    timestamp: new Date()
  });
});

// Debug endpoint to check users
app.get('/api/debug/users', async (req, res) => {
  try {
    const users = await User.find({}, 'name email authProvider').limit(10);
    res.json({ count: users.length, users });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Models
const User = require('./models/User');
const Event = require('./models/Event');
const Comment = require('./models/Comment');

// Passport Google Strategy - Temporarily disabled
/* passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "/api/auth/google/callback"
  },
  async (accessToken, refreshToken, profile, done) => {
    try {
      let user = await User.findOne({ googleId: profile.id });
      
      if (user) {
        return done(null, user);
      } else {
        // Check if user exists with same email
        let existingUser = await User.findOne({ email: profile.emails[0].value });
        
        if (existingUser) {
          // Link Google account to existing user
          existingUser.googleId = profile.id;
          existingUser.authProvider = 'google';
          existingUser.isEmailVerified = true;
          existingUser.profileImageUrl = profile.photos[0].value;
          await existingUser.save();
          return done(null, existingUser);
        } else {
          // Create new user
          const newUser = new User({
            googleId: profile.id,
            name: profile.displayName,
            email: profile.emails[0].value,
            profileImageUrl: profile.photos[0].value,
            authProvider: 'google',
            isEmailVerified: true
          });
          
          await newUser.save();
          return done(null, newUser);
        }
      }
    } catch (error) {
      return done(error, null);
    }
  }
)); */

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

// Contact form
app.post('/api/contact', async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;
    
    console.log('Contact form submission:', { name, email, subject });
    
    res.json({ 
      success: true, 
      message: 'Message received successfully! We will get back to you soon.' 
    });
  } catch (error) {
    console.error('Contact form error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to submit message.' 
    });
  }
});

// Google Auth Routes
app.get('/api/auth/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

app.get('/api/auth/google/callback',
  passport.authenticate('google', { failureRedirect: '/login' }),
  (req, res) => {
    // Successful authentication
    const token = jwt.sign(
      { userId: req.user._id, email: req.user.email },
      process.env.JWT_SECRET || 'your-jwt-secret',
      { expiresIn: '7d' }
    );
    
    // Redirect to frontend with token (check which port is running)
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5174';
    res.redirect(`${frontendUrl}/auth/callback?token=${token}&user=${encodeURIComponent(JSON.stringify(req.user))}`);
  }
);

// User authentication
app.post('/api/signup', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists with this email" });
    }
    
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);
    
    const newUser = new User({ 
      name, 
      email, 
      password: hashedPassword,
      authProvider: 'local'
    });
    await newUser.save();
    
    const token = jwt.sign(
      { userId: newUser._id, email: newUser.email },
      process.env.JWT_SECRET || 'your-jwt-secret',
      { expiresIn: '7d' }
    );
    
    res.status(201).json({ 
      message: "Signup successful", 
      user: { ...newUser.toObject(), password: undefined },
      token 
    });
  } catch (error) {
    res.status(500).json({ message: "Signup failed", error: error.message });
  }
});

app.post('/api/signin', async (req, res) => {
  console.log('=== SIGNIN ROUTE HIT ===');
  console.log('Request body:', req.body);
  console.log('Request headers:', req.headers);
  
  try {
    const { email, password } = req.body;
    console.log('Login attempt for:', email);
    
    if (!email || !password) {
      console.log('Missing credentials - email:', !!email, 'password:', !!password);
      return res.status(400).json({ message: "Email and password are required" });
    }
    
    const user = await User.findOne({ email });
    console.log('User found:', user ? 'Yes' : 'No');
    if (user) {
      console.log('User details:', { 
        id: user._id, 
        email: user.email, 
        authProvider: user.authProvider,
        hasPassword: !!user.password,
        passwordType: user.password?.startsWith('$2') ? 'hashed' : 'plain'
      });
    }

    if (!user) return res.status(404).json({ message: "User not found" });
    
    // Check if user signed up with Google
    if (user.authProvider === 'google') {
      return res.status(400).json({ 
        message: "Please sign in with Google",
        useGoogleAuth: true 
      });
    }
    
    // Check password - support both old plain text and new hashed passwords
    let isPasswordValid = false;
    
    console.log('Password comparison details:');
    console.log('- Input password:', password);
    console.log('- Stored password:', user.password);
    console.log('- Stored password length:', user.password.length);
    console.log('- Is hashed?', user.password.startsWith('$2b$') || user.password.startsWith('$2a$'));
    
    if (user.password.startsWith('$2b$') || user.password.startsWith('$2a$')) {
      // New hashed password
      console.log('Using bcrypt comparison...');
      isPasswordValid = await bcrypt.compare(password, user.password);
      console.log('Bcrypt result:', isPasswordValid);
    } else {
      // Old plain text password (for backward compatibility)
      console.log('Using plain text comparison...');
      isPasswordValid = user.password === password;
      console.log('Plain text result:', isPasswordValid);
      
      // If login successful with plain text, hash it for future
      if (isPasswordValid) {
        console.log('Converting plain text to hash...');
        user.password = await bcrypt.hash(password, 12);
        await user.save();
        console.log('Password hashed and saved');
      }
    }
    
    console.log('Final password validation result:', isPasswordValid);
    
    if (!isPasswordValid) return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.JWT_SECRET || 'your-jwt-secret',
      { expiresIn: '7d' }
    );

    res.json({ 
      message: "Login successful", 
      user: { ...user.toObject(), password: undefined },
      token 
    });
  } catch (error) {
    res.status(500).json({ message: "Signin failed", error: error.message });
  }
});

app.put('/api/users/:id', upload.single('profileImage'), async (req, res) => {
  try {
    const { id } = req.params;
    const { name } = req.body;

    const user = await User.findById(id);
    if (!user) return res.status(404).json({ message: "User not found" });

    if (name) user.name = name;
    if (req.file) user.profileImageUrl = `/uploads/${req.file.filename}`;

    await user.save();
    res.json({ message: "Profile updated successfully", user });
  } catch (error) {
    res.status(500).json({ message: "Failed to update profile", error: error.message });
  }
});

// Event routes
function isValidURL(string) {
  try {
    const url = new URL(string);
    return url.protocol === 'http:' || url.protocol === 'https:';
  } catch (_) {
    return false;
  }
}

app.post('/api/events', upload.single('banner'), async (req, res) => {
  try {
    const { title, date, venue, description, userEmail, bannerUrl, category, maxAttendees, price, tags } = req.body;
    
    let imageUrl = null;
    
    if (req.file) {
      imageUrl = `/uploads/${req.file.filename}`;
    } else if (bannerUrl && bannerUrl.trim()) {
      const trimmedUrl = bannerUrl.trim();
      if (isValidURL(trimmedUrl)) {
        imageUrl = trimmedUrl;
      } else {
        return res.status(400).json({ 
          message: "Invalid image URL format",
          error: "Please provide a valid HTTP/HTTPS URL"
        });
      }
    }

    const newEvent = new Event({ 
      title, 
      date, 
      venue, 
      description, 
      userEmail,
      imageUrl,
      category: category || 'Other',
      maxAttendees: maxAttendees ? parseInt(maxAttendees) : null,
      price: price ? parseFloat(price) : 0,
      tags: tags ? JSON.parse(tags) : []
    });
    
    await newEvent.save();
    
    res.status(201).json({ 
      message: "Event added successfully",
      event: newEvent
    });
  } catch (error) {
    res.status(500).json({ 
      message: "Failed to create event", 
      error: error.message
    });
  }
});

app.get('/api/events', async (req, res) => {
  try {
    const { userEmail } = req.query;
    const filter = userEmail ? { userEmail } : {};
    const events = await Event.find(filter);
    
    const processedEvents = events.map(event => {
      const eventObj = event.toObject();
      
      if (eventObj.imageUrl && eventObj.imageUrl.startsWith('/uploads/')) {
        eventObj.fullImageUrl = `http://localhost:${PORT}${eventObj.imageUrl}`;
      } else if (eventObj.imageUrl) {
        eventObj.fullImageUrl = eventObj.imageUrl;
      }
      
      return eventObj;
    });
    
    res.json(processedEvents);
  } catch (error) {
    res.status(500).json({ message: "Fetching events failed", error: error.message });
  }
});

app.get('/api/events/:id', async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ message: "Event not found" });
    
    const eventObj = event.toObject();
    if (eventObj.imageUrl && eventObj.imageUrl.startsWith('/uploads/')) {
      eventObj.fullImageUrl = `http://localhost:${PORT}${eventObj.imageUrl}`;
    } else if (eventObj.imageUrl) {
      eventObj.fullImageUrl = eventObj.imageUrl;
    }
    
    res.json(eventObj);
  } catch (error) {
    res.status(500).json({ message: "Error fetching event", error: error.message });
  }
});

app.put("/api/events/:id", upload.single('banner'), async (req, res) => {
  try {
    const { id } = req.params;
    const { title, date, venue, description, bannerUrl } = req.body;

    const existingEvent = await Event.findById(id);
    if (!existingEvent) return res.status(404).json({ message: "Event not found" });

    const updatedData = { title, date, venue, description };

    if (req.file) {
      updatedData.imageUrl = `/uploads/${req.file.filename}`;
    } else if (bannerUrl && bannerUrl.trim()) {
      const trimmedUrl = bannerUrl.trim();
      if (isValidURL(trimmedUrl)) {
        updatedData.imageUrl = trimmedUrl;
      } else {
        return res.status(400).json({ 
          message: "Invalid image URL provided"
        });
      }
    }

    const updatedEvent = await Event.findByIdAndUpdate(id, updatedData, {
      new: true,
      runValidators: true,
    });
    
    res.json(updatedEvent);
  } catch (error) {
    res.status(500).json({ message: "Failed to update event", error: error.message });
  }
});

app.delete('/api/events/:id', async (req, res) => {
  try {
    const deletedEvent = await Event.findByIdAndDelete(req.params.id);
    if (!deletedEvent) return res.status(404).json({ message: "Event not found" });
    
    res.json({ message: "Event deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// Event Registration Routes
app.post('/api/events/:id/register', async (req, res) => {
  try {
    const { id } = req.params;
    const { userId, userEmail } = req.body;

    const event = await Event.findById(id);
    if (!event) return res.status(404).json({ message: "Event not found" });

    // Check if user is already registered
    const isAlreadyRegistered = event.registeredUsers.some(
      user => user.userId.toString() === userId
    );

    if (isAlreadyRegistered) {
      return res.status(400).json({ message: "Already registered for this event" });
    }

    // Check if event is full
    if (event.maxAttendees && event.currentAttendees >= event.maxAttendees) {
      return res.status(400).json({ message: "Event is full" });
    }

    // Register user
    event.registeredUsers.push({ userId });
    event.currentAttendees = event.registeredUsers.length;
    await event.save();

    res.json({ message: "Successfully registered for event", event });
  } catch (error) {
    res.status(500).json({ message: "Registration failed", error: error.message });
  }
});

app.delete('/api/events/:id/unregister', async (req, res) => {
  try {
    const { id } = req.params;
    const { userId } = req.body;

    const event = await Event.findById(id);
    if (!event) return res.status(404).json({ message: "Event not found" });

    event.registeredUsers = event.registeredUsers.filter(
      user => user.userId.toString() !== userId
    );
    event.currentAttendees = event.registeredUsers.length;
    await event.save();

    res.json({ message: "Successfully unregistered from event", event });
  } catch (error) {
    res.status(500).json({ message: "Unregistration failed", error: error.message });
  }
});

// Comment Routes
app.post('/api/events/:id/comments', async (req, res) => {
  try {
    const { id } = req.params;
    const { userId, userName, userEmail, rating, comment, isAnonymous } = req.body;

    const event = await Event.findById(id);
    if (!event) return res.status(404).json({ message: "Event not found" });

    const newComment = new Comment({
      eventId: id,
      userId,
      userName: isAnonymous ? 'Anonymous User' : userName,
      userEmail,
      rating,
      comment,
      isAnonymous
    });

    await newComment.save();
    
    // Populate user info for response
    const populatedComment = await Comment.findById(newComment._id).populate('userId', 'name profileImageUrl');
    
    res.status(201).json({ message: "Comment added successfully", comment: populatedComment });
  } catch (error) {
    res.status(500).json({ message: "Failed to add comment", error: error.message });
  }
});

app.get('/api/events/:id/comments', async (req, res) => {
  try {
    const { id } = req.params;
    const comments = await Comment.find({ eventId: id })
      .populate('userId', 'name profileImageUrl')
      .sort({ createdAt: -1 });

    res.json(comments);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch comments", error: error.message });
  }
});



// Get user's registered events
app.get('/api/users/:id/registered-events', async (req, res) => {
  try {
    const { id } = req.params;
    const events = await Event.find({ 
      'registeredUsers.userId': id 
    }).populate('registeredUsers.userId', 'name email');

    res.json(events);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch registered events", error: error.message });
  }
});

// Test route for debugging
app.get('/api/test-forgot', (req, res) => {
  res.json({ message: "Forgot password route working!" });
});

// Forgot Password - Request Reset
app.post('/api/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;
    
    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found with this email" });
    }

    // Check if user signed up with Google
    if (user.authProvider === 'google') {
      return res.status(400).json({ 
        message: "Please sign in with Google. Password reset not available for Google accounts." 
      });
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetTokenExpiry = new Date(Date.now() + 3600000); // 1 hour

    // Save to database
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = resetTokenExpiry;
    await user.save();

    // For now, return the reset token (in production, send via email)
    res.json({ 
      message: "Password reset token generated",
      resetToken: resetToken, // Remove this in production
      resetUrl: `http://localhost:3000/reset-password/${resetToken}`
    });

  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Reset Password
app.post('/api/reset-password/:token', async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    if (!password) {
      return res.status(400).json({ message: "Password is required" });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters" });
    }

    // Find user with valid reset token
    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({ message: "Invalid or expired reset token" });
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Update user
    user.password = hashedPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    res.json({ message: "Password reset successful" });

  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});