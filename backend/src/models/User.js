const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: 6,
  },
  role: {
    type: String,
    enum: ['user', 'admin', 'superadmin'],
    default: 'user',
  },
  isBlocked: {
    type: Boolean,
    default: false,
  },
}, { timestamps: true });

// --- FIXED MIDDLEWARE ---
// 1. Changed to a regular function(next) to keep 'this' context
// 2. Added 'next' as a parameter so it can be called
userSchema.pre('save', async function (next) {
  // If password isn't being changed (like when blocking a user), skip hashing
  if (!this.isModified('password')) {
    return; // This was the line causing your 500 error!
  }

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
  } catch (err) {
    next(err);
  }
});

// Compare password method
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);