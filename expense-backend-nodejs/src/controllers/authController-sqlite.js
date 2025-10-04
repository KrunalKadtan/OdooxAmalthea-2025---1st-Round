const { User, Company } = require('../models-sqlite');
const { generateAuthTokens } = require('../utils/jwt');
const { sendSuccess, sendError } = require('../utils/response');

const register = async (req, res) => {
  try {
    const { username, email, password, firstName, lastName, companyName, country, role = 'employee' } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({
      where: {
        [require('sequelize').Op.or]: [
          { email },
          { username }
        ]
      }
    });

    if (existingUser) {
      return sendError(res, 'User with this email or username already exists', 409);
    }

    // Create or find company
    let company;
    if (companyName) {
      [company] = await Company.findOrCreate({
        where: { name: companyName },
        defaults: {
          name: companyName,
          country: country || 'US',
          defaultCurrency: 'USD'
        }
      });
    } else {
      // Default company for demo
      [company] = await Company.findOrCreate({
        where: { name: 'Demo Company' },
        defaults: {
          name: 'Demo Company',
          country: 'US',
          defaultCurrency: 'USD'
        }
      });
    }

    // Create user
    const user = await User.create({
      username,
      email,
      password,
      firstName,
      lastName,
      role,
      companyId: company.id
    });

    // Get user with company info
    const userWithCompany = await User.findByPk(user.id, {
      include: [{ model: Company, as: 'company' }]
    });

    // Generate tokens
    const tokens = generateAuthTokens({
      ...userWithCompany.toJSON(),
      fullName: userWithCompany.getFullName()
    });

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
      where: {
        [require('sequelize').Op.or]: [
          { username },
          { email: username }
        ]
      },
      include: [{ model: Company, as: 'company' }]
    });

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
    const tokens = generateAuthTokens({
      ...user.toJSON(),
      fullName: user.getFullName()
    });

    sendSuccess(res, 'Login successful', tokens);
  } catch (error) {
    console.error('Login error:', error);
    sendError(res, 'Login failed', 500);
  }
};

const getProfile = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, {
      include: [
        { model: Company, as: 'company', attributes: ['id', 'name', 'defaultCurrency', 'country'] },
        { model: User, as: 'manager', attributes: ['id', 'username', 'firstName', 'lastName'] }
      ]
    });

    if (!user) {
      return sendError(res, 'User not found', 404);
    }

    const userProfile = {
      id: user.id,
      username: user.username,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      fullName: user.getFullName(),
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
        where: { 
          email, 
          id: { [require('sequelize').Op.ne]: userId }
        }
      });
      
      if (existingUser) {
        return sendError(res, 'Email already in use', 409);
      }
    }

    const [updatedRowsCount] = await User.update(
      { firstName, lastName, email },
      { 
        where: { id: userId },
        returning: true
      }
    );

    if (updatedRowsCount === 0) {
      return sendError(res, 'User not found', 404);
    }

    const user = await User.findByPk(userId, {
      include: [{ model: Company, as: 'company', attributes: ['id', 'name', 'defaultCurrency', 'country'] }]
    });

    const userProfile = {
      id: user.id,
      username: user.username,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      fullName: user.getFullName(),
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

    const user = await User.findByPk(userId);
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