import api from '../config/api';

export const expenseService = {
  // Get all expenses for logged-in user
  getExpenses: async () => {
    const response = await api.get('/expenses/');
    return response.data;
  },

  // Get expense statistics
  getStats: async () => {
    const response = await api.get('/expenses/statistics/');
    return response.data;
  },

  // Create new expense
  createExpense: async (expenseData) => {
    const response = await api.post('/expenses/', expenseData);
    return response.data;
  },

  // Get expense categories
  getCategories: async () => {
    const response = await api.get('/categories/');
    return response.data;
  },

  // Update expense
  updateExpense: async (id, expenseData) => {
    const response = await api.put(`/expenses/${id}/`, expenseData);
    return response.data;
  },

  // Delete expense
  deleteExpense: async (id) => {
    const response = await api.delete(`/expenses/${id}/`);
    return response.data;
  },
};
