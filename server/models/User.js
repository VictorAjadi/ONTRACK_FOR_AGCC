const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const customError = require("../Utils/customError");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please enter your name."],
    maxLength: 30,
    minLength: 5,
  },
  email: {
    type: String,
    required: [true, "Please enter your email address."],
    unique: [true, "A user with this email exists."],
    validate: [validator.isEmail, "Invalid email address."]
  },
  password: {
    type: String,
    required: [true, "Please enter your password."],
    minLength: 8,
    select: false
  },
  isActive: {
    type: Boolean,
    default: true,
    select: false
  },
  confirmPassword: {
    type: String,
    required: [true, "Please enter your confirm password."],
    validate: {
      validator: function(value) {
        return value === this.password;
      },
      message: "Password & confirm password do not match."
    }
  },
  role: {
    type: String,
    enum: ["admin", "user"],
    default: "user"
  },
  photo: String,
  loginAt: {
    type: [String],
    required: [true]
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  mobileNumber: {
    type: Number,
    maxLength: 14,
    minLength: 11
  },
  barcode: String,
  residentials: {
    type: String,
    required: [true, "Please enter your residentials"]
  },
  worker: {
    type: String,
    required: [true, "Please select if you are a worker"]
  },
  department: {
    type: String,
    required: [true, "Please enter the department you are in church"]
  },
  isPasswordChangedAt: Date,
  passwordResetToken: String,
  passwordResetTokenExpiresIn: Date
});

/* userSchema.methods.createPasswordResetToken = function() {
  const resetToken = crypto.randomBytes(32).toString('hex');
  this.passwordResetToken = crypto.createHash('sha256').update(resetToken).digest('hex');
  this.passwordResetTokenExpiresIn = Date.now() + 5 * 60 * 1000;
  return resetToken;
}; */

userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  this.confirmPassword = undefined;
  next();
});

userSchema.pre(/^find/, function(next) {
  this.find({ isActive: { $ne: false } });
  next();
});

userSchema.methods.compareJwtExpireTimeToWhenPasswordWasChanged = function(jwtTimestamp) {
  if (this.isPasswordChangedAt) {
    this.isPasswordChangedAt = this.isPasswordChangedAt.getTime() / 1000;
    return this.isPasswordChangedAt > jwtTimestamp;
  }
  return false;
};

userSchema.methods.comparePasswordInDB = async function(plainPassword, hashedPassword) {
  return await bcrypt.compare(plainPassword, hashedPassword);
};

const User = mongoose.model('User', userSchema);

module.exports = User;
