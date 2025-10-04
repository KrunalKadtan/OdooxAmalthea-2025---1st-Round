const express = require('express');
const router = express.Router();
const { User, Company } = require('../models-sqlite');
const { authenticate, authorize } = require('../middleware/auth-sqlite');
const { sendSuccess, sendError } = require('../utils/response');
const { Op } = require('sequelize');

// All routes require authentication
router.use(authenticate);

// Get all users (admin only)
router.get('/', authorize('admin'), async (req, res) => {
  try {
    const companyId = req.user.company.id;
    const users = await User.findAll({
      where: { companyId },
      include: [
        { model: Company, as: 'company', attributes: ['id', 'name'] },
        { model: User, as: 'manager', attributes: ['id', 'username', 'firstName', 'lastName'] }
      ],
      attributes: { exclude: ['password'] }
    });

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
    const teamMembers = await User.findAll({
      where: { managerId },
      include: [{ model: Company, as: 'company', attributes: ['id', 'name'] }],
      attributes: { exclude: ['password'] }
    });

    sendSuccess(res, 'Team members retrieved successfully', teamMembers);
  } catch (error) {
    console.error('Get team members error:', error);
    sendError(res, 'Failed to retrieve team members', 500);
  }
});

module.exports = router;