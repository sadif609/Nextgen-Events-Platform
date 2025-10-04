const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  title: { type: String, required: true },
  date: { type: String, required: true },
  venue: { type: String, required: true },
  description: { type: String, required: true },
  imageUrl: { type: String },
  userEmail: { type: String, required: true },
  category: { 
    type: String, 
    enum: ['Music', 'Tech', 'Sports', 'Business', 'Art', 'Food', 'Education', 'Health', 'Other'], 
    default: 'Other' 
  },
  maxAttendees: { type: Number, default: null },
  currentAttendees: { type: Number, default: 0 },
  registeredUsers: [{ 
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    registeredAt: { type: Date, default: Date.now }
  }],
  price: { type: Number, default: 0 }, // 0 for free events
  status: { type: String, enum: ['active', 'cancelled', 'completed'], default: 'active' },
  tags: [String]
}, {
  timestamps: true
});

module.exports = mongoose.model('Event', eventSchema);