const mongoose = require('mongoose');
const User = require('./models/User');

mongoose.connect('mongodb://localhost/nextgenevent')
  .then(async () => {
    console.log('MongoDB connected');
    
    const user = await User.findOne({ email: 'ashiq99199@gmail.com' });
    console.log('User data:', {
      id: user._id,
      email: user.email,
      password: user.password,
      authProvider: user.authProvider,
      passwordLength: user.password ? user.password.length : 0,
      passwordStartsWith: user.password ? user.password.substring(0, 10) : 'N/A'
    });
    
    // Test password comparison
    const inputPassword = '123';
    console.log('Direct comparison:', user.password === inputPassword);
    
    // Test bcrypt comparison if it's hashed
    const bcrypt = require('bcrypt');
    if (user.password && user.password.startsWith('$2')) {
      console.log('Bcrypt comparison:', await bcrypt.compare(inputPassword, user.password));
    } else {
      console.log('Password is plain text');
    }
    
    process.exit(0);
  })
  .catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });