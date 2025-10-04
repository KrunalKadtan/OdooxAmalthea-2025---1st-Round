const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { authenticate, authorize } = require('../middleware/auth');
const { sendSuccess, sendError } = require('../utils/response');

// All routes require authentication
router.use(authenticate);

// Get all users (admin only)
router.get('/', authorize('admin'), async (req, res) => {
  try {
    const companyId = req.user.company._id;
    const users = await User.find({ company: companyId })
      .populate('company', 'name')
      .populate('manager', 'username firstName lastName')
      .select('-password');

    sendSuccess(res, 'Users retrieved successfully', users);
  } catch (error) {
    console.error('Get users error:', error);
    sendError(res, 'Failed to retrieve users', 500);
  }
});

// Get team members (manager only)
router.get('/team', authorize('manager'), async (req, res) => {
  try {
    const managerId = req.user.id;
    const teamMembers = await User.find({ manager: managerId })
      .select('-password')
      .populate('company', 'name');

    sendSuccess(res, 'Team members retrieved successfully', teamMembers);
  } catch (error) {
    console.error('Get team members error:', error);
    sendError(res, 'Failed to retrieve team members', 500);
  }
});

// Create user (admin only)
router.post('/', authorize('admin'), async (req, res) => {
  try {
    const { username, email, password, firstName, lastName, role, managerId } = req.body;
    const companyId = req.user.company._id;

    // Check if user already exists
    const existingUser = await User.findOne({
      $or: [{ email }, { username }]
    });

    if (existingUser) {
      return sendError(res, 'User with this email or username already exists', 409);
    }

    // Validate manager if provided
    let manager = null;
    if (managerId) {
      manager = await User.findOne({ _id: managerId, company: companyId, role: 'manager' });
      if (!manager) {
        return sendError(res, 'Invalid manager ID', 400);
      }
    }

    const user = await User.create({
      username,
      email,
      password,
      firstName,
      lastName,
      role: role || 'employee',
      company: companyId,
      manager: managerId || null
    });

    const userResponse = await User.findById(user._id)
      .populate('company', 'name')
      .populate('manager', 'username firstName lastName')
      .select('-password');

    sendSuccess(res, 'User created successfully', userResponse, 201);
  } catch (error) {
    console.error('Create user error:', error);
    sendError(res, 'Failed to create user', 500);
  }
});

// Update user (admin only)
router.put('/:id', authorize('admin'), async (req, res) => {
  try {
    const { id } = req.params;
    const { firstName, lastName, email, role, managerId, isActive } = req.body;
    const companyId = req.user.company._id;

    // Check if user exists and belongs to same company
    const user = await User.findOne({ _id: id, company: companyId });
    if (!user) {
      return sendError(res, 'User not found', 404);
    }

    // Check if email is already taken by another user
    if (email && email !== user.email) {
      const existingUser = await User.findOne({ 
        email, 
        _id: { $ne: id } 
      });
      
      if (existingUser) {
        return sendError(res, 'Email already in use', 409);
      }
    }

    // Validate manager if provided
    if (managerId && managerId !== user.manager?.toString()) {
      const manager = await User.findOne({ 
        _id: managerId, 
        company: companyId, 
        role: 'manager' 
      });
      if (!manager) {
        return sendError(res, 'Invalid manager ID', 400);
      }
    }

    const updatedUser = await User.findByIdAndUpdate(
      id,
      { firstName, lastName, email, role, manager: managerId, isActive },
      { new: true, runValidators: true }
    ).populate('company', 'name')
     .populate('manager', 'username firstName lastName')
     .select('-password');

    sendSuccess(res, 'User updated successfully', updatedUser);
  } catch (error) {
    console.error('Update user error:', error);
    sendError(res, 'Failed to update user', 500);
  }
});

// Delete user (admin only)
router.delete('/:id', authorize('admin'), async (req, res) => {
  try {
    const { id } = req.params;
    const companyId = req.user.company._id;

    // Check if user exists and belongs to same company
    const user = await User.findOne({ _id: id, company: companyId });
    if (!user) {
      return sendError(res, 'User not found', 404);
    }

    // Don't allow deleting the last admin
    if (user.role === 'admin') {
      const adminCount = await User.countDocuments({ 
        company: companyId, 
        role: 'admin',
        isActive: true 
      });
      
      if (adminCount <= 1) {
        return sendError(res, 'Cannot delete the last admin user', 400);
      }
    }

    // Soft delete by setting isActive to false
    await User.findByIdAndUpdate(id, { isActive: false });

    sendSuccess(res, 'User deleted successfully');
  } catch (error) {
    console.error('Delete user error:', error);
    sendError(res, 'Failed to delete user', 500);
  }
});

module.exports = router;