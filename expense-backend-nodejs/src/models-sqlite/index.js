const User = require('./User');
const Company = require('./Company');
const Expense = require('./Expense');

// Define associations
Company.hasMany(User, { foreignKey: 'companyId', as: 'users' });
User.belongsTo(Company, { foreignKey: 'companyId', as: 'company' });

User.hasMany(User, { foreignKey: 'managerId', as: 'teamMembers' });
User.belongsTo(User, { foreignKey: 'managerId', as: 'manager' });

Company.hasMany(Expense, { foreignKey: 'companyId', as: 'expenses' });
Expense.belongsTo(Company, { foreignKey: 'companyId', as: 'company' });

User.hasMany(Expense, { foreignKey: 'employeeId', as: 'expenses' });
Expense.belongsTo(User, { foreignKey: 'employeeId', as: 'employee' });

User.hasMany(Expense, { foreignKey: 'reviewedById', as: 'reviewedExpenses' });
Expense.belongsTo(User, { foreignKey: 'reviewedById', as: 'reviewedBy' });

module.exports = {
  User,
  Company,
  Expense
};