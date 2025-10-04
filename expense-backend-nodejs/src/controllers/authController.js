const User = require('../models/User');
const Company = require('../models/Company');
const { generateAuthTokens } = require('../utils/jwt');
const { sendSuccess, sendError } = require('../utils/response');

const register = async (req, res) => {
  try {
    const { username, email, password, firstName, lastName, companyName, country, role = 'employee' } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({
      $or: [{ email }, { username }]
    });

    if (existingUser) {
      return sendError(res, 'User with this email or username already exists', 409);
    }

    // Create or find company
    let company;
    if (companyName) {
      company = await Company.findOne({ name: companyName });
      if (!company) {
        company = await Company.create({
          name: companyName,
          country: country || 'US',
          defaultCurrency: 'USD'
        });
      }
    } else {
      // Default company for demo
      company = await Company.findOne({ name: 'Demo Company' });
      if (!company) {
        company = await Company.create({
          name: 'Demo Company',
          country: 'US',
          defaultCurrency: 'USD'
        });
      }
    }

    // Create user
    const user = await User.create({
      username,
      email,
      password,
      firstName,
      lastName,
      role,
      company: company._id
    });

    // Generate tokens
    const tokens = generateAuthTokens(user);

    sendSuccess(res, 'User registered successfully', tokens, 201);
  } catch (error) {
    console.error('Registration error:', error);
    sendError(res, 'Registration failed', 500);
  }
};

const login = async (req, res) => {
  try {
    const { username, password } = req.body;

    // Find user by username or email
    const user = await User.findOne({
      $or: [{ username }, { email: username }]
    }).select('+password').populate('company');

    if (!user || !user.isActive) {
      return sendError(res, 'Invalid credentials', 401);
    }

    // Check password
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return sendError(res, 'Invalid credentials', 401);
    }

    // Update last login
    await user.updateLastLogin();

    // Generate tokens
    const tokens = generateAuthTokens(user);

    sendSuccess(res, 'Login successful', tokens);
  } catch (error) {
    console.error('Login error:', error);
    sendError(res, 'Login failed', 500);
  }
};

const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
      .populate('company', 'name defaultCurrency country')
      .populate('manager', 'username firstName lastName');

    if (!user) {
      return sendError(res, 'User not found', 404);
    }

    const userProfile = {
      id: user._id,
      username: user.username,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      fullName: user.fullName,
      role: user.role,
      company: user.company,
      manager: user.manager,
      profilePicture: user.profilePicture,
      lastLogin: user.lastLogin,
      createdAt: user.createdAt
    };

    sendSuccess(res, 'Profile retrieved successfully', userProfile);
  } catch (error) {
    console.error('Get profile error:', error);
    sendError(res, 'Failed to retrieve profile', 500);
  }
};

const updateProfile = async (req, res) => {
  try {
    const { firstName, lastName, email } = req.body;
    const userId = req.user.id;

    // Check if email is already taken by another user
    if (email) {
      const existingUser = await User.findOne({ 
        email, 
        _id: { $ne: userId } 
      });
      
      if (existingUser) {
        return sendError(res, 'Email already in use', 409);
      }
    }

    const user = await User.findByIdAndUpdate(
      userId,
      { firstName, lastName, email },
      { new: true, runValidators: true }
    ).populate('company', 'name defaultCurrency country');

    if (!user) {
      return sendError(res, 'User not found', 404);
    }

    const userProfile = {
      id: user._id,
      username: user.username,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      fullName: user.fullName,
      role: user.role,
      company: user.company
    };

    sendSuccess(res, 'Profile updated successfully', userProfile);
  } catch (error) {
    console.error('Update profile error:', error);
    sendError(res, 'Failed to update profile', 500);
  }
};

const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const userId = req.user.id;

    const user = await User.findById(userId).select('+password');
    if (!user) {
      return sendError(res, 'User not found', 404);
    }

    // Verify current password
    const isCurrentPasswordValid = await user.comparePassword(currentPassword);
    if (!isCurrentPasswordValid) {
      return sendError(res, 'Current password is incorrect', 400);
    }

    // Update password
    user.password = newPassword;
    await user.save();

    sendSuccess(res, 'Password changed successfully');
  } catch (error) {
    console.error('Change password error:', error);
    sendError(res, 'Failed to change password', 500);
  }
};

module.exports = {
  register,
  login,
  getProfile,
  updateProfile,
  changePassword
};