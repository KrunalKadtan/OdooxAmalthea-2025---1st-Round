import React, { useState, useEffect } from 'react';
import { Box, Button, Typography, Card, CardContent, Chip, Grid } from '@mui/material';
import axios from 'axios';
import ExpenseForm from './ExpenseForm';

const demoExpenses = [
  { id: 1, category: 'TRAVEL', amount: 150.00, currency: 'USD', date: '2025-01-08', description: 'Taxi to client meeting', status: 'PENDING' },
  { id: 2, category: 'FOOD', amount: 45.50, currency: 'USD', date: '2025-01-09', description: 'Team lunch', status: 'PENDING' },
  { id: 3, category: 'SUPPLIES', amount: 89.99, currency: 'EUR', date: '2025-01-07', description: 'Office supplies', status: 'APPROVED' },
  { id: 4, category: 'ACCOMMODATION', amount: 200.00, currency: 'USD', date: '2025-01-05', description: 'Hotel for conference', status: 'APPROVED' },
  { id: 5, category: 'TRAVEL', amount: 75.00, currency: 'USD', date: '2025-01-06', description: 'Parking fees', status: 'REJECTED', rejection_comment: 'Please provide receipt' },
];

function EmployeeDashboard() {
  const [expenses, setExpenses] = useState(demoExpenses);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    const isDemoMode = localStorage.getItem('demo_mode');
    if (!isDemoMode) {
      fetchExpenses();
    }
  }, []);

  const fetchExpenses = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL || 'http://localhost:8000'}/api/expenses/`);
      setExpenses(response.data);
    } catch (error) {
      console.log('Using demo data');
    }
  };

  const handleExpenseSubmit = (newExpense) => {
    const isDemoMode = localStorage.getItem('demo_mode');
    
    if (isDemoMode && newExpense) {
      setExpenses([{ id: expenses.length + 1, ...newExpense, status: 'PENDING' }, ...expenses]);
    } else {
      fetchExpenses();
    }
    setShowForm(false);
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4">My Expenses</Typography>
        <Button variant="contained" onClick={() => setShowForm(true)}>Submit Expense</Button>
      </Box>

      {showForm && <ExpenseForm onClose={() => setShowForm(false)} onSubmit={handleExpenseSubmit} />}

      <Grid container spacing={2}>
        {expenses.map((expense) => (
          <Grid item xs={12} md={6} key={expense.id}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="h6">{expense.category}</Typography>
                  <Chip 
                    label={expense.status} 
                    color={expense.status === 'APPROVED' ? 'success' : expense.status === 'REJECTED' ? 'error' : 'default'}
                  />
                </Box>
                <Typography>Amount: {expense.amount} {expense.currency}</Typography>
                <Typography>Date: {expense.date}</Typography>
                <Typography>Description: {expense.description}</Typography>
                {expense.rejection_comment && (
                  <Typography color="error" sx={{ mt: 1 }}>
                    Rejection: {expense.rejection_comment}
                  </Typography>
                )}
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}

export default EmployeeDashboard;
