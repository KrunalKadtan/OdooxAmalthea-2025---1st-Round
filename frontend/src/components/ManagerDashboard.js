import React, { useState, useEffect } from 'react';
import { Box, Typography, Card, CardContent, Button, Chip, Grid, TextField, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import axios from 'axios';

const demoExpenses = [
  { id: 1, employee_name: 'Alice Smith', amount: 150.00, currency: 'USD', category: 'TRAVEL', description: 'Taxi to client meeting', date: '2025-01-08', status: 'PENDING', converted_amount: { amount: 150.00, currency: 'USD' } },
  { id: 2, employee_name: 'Bob Johnson', amount: 45.50, currency: 'USD', category: 'FOOD', description: 'Team lunch', date: '2025-01-09', status: 'PENDING', converted_amount: { amount: 45.50, currency: 'USD' } },
  { id: 3, employee_name: 'Alice Smith', amount: 89.99, currency: 'EUR', category: 'SUPPLIES', description: 'Office supplies', date: '2025-01-07', status: 'PENDING', converted_amount: { amount: 95.23, currency: 'USD' } },
  { id: 4, employee_name: 'Carol Williams', amount: 200.00, currency: 'USD', category: 'ACCOMMODATION', description: 'Hotel for conference', date: '2025-01-05', status: 'APPROVED', converted_amount: { amount: 200.00, currency: 'USD' } },
  { id: 5, employee_name: 'Bob Johnson', amount: 75.00, currency: 'USD', category: 'TRAVEL', description: 'Parking fees', date: '2025-01-06', status: 'REJECTED', rejection_comment: 'Please provide receipt', converted_amount: { amount: 75.00, currency: 'USD' } },
];

function ManagerDashboard() {
  const [expenses, setExpenses] = useState(demoExpenses);
  const [rejectDialog, setRejectDialog] = useState({ open: false, expenseId: null, comment: '' });

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

  const handleApprove = async (id) => {
    const isDemoMode = localStorage.getItem('demo_mode');
    
    if (isDemoMode) {
      setExpenses(expenses.map(exp => 
        exp.id === id ? { ...exp, status: 'APPROVED' } : exp
      ));
      return;
    }

    try {
      await axios.post(`${process.env.REACT_APP_API_URL || 'http://localhost:8000'}/api/expenses/${id}/approve/`);
      fetchExpenses();
    } catch (error) {
      console.error('Error approving expense:', error);
    }
  };

  const handleReject = async () => {
    const isDemoMode = localStorage.getItem('demo_mode');
    
    if (isDemoMode) {
      setExpenses(expenses.map(exp => 
        exp.id === rejectDialog.expenseId 
          ? { ...exp, status: 'REJECTED', rejection_comment: rejectDialog.comment } 
          : exp
      ));
      setRejectDialog({ open: false, expenseId: null, comment: '' });
      return;
    }

    try {
      await axios.post(
        `${process.env.REACT_APP_API_URL || 'http://localhost:8000'}/api/expenses/${rejectDialog.expenseId}/reject/`,
        { comment: rejectDialog.comment }
      );
      setRejectDialog({ open: false, expenseId: null, comment: '' });
      fetchExpenses();
    } catch (error) {
      console.error('Error rejecting expense:', error);
    }
  };

  const pendingExpenses = expenses.filter(e => e.status === 'PENDING');

  return (
    <Box>
      <Typography variant="h4" gutterBottom>Team Expenses - Approval Queue</Typography>
      
      <Grid container spacing={2}>
        {pendingExpenses.map((expense) => (
          <Grid item xs={12} md={6} key={expense.id}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="h6">{expense.employee_name}</Typography>
                  <Chip label={expense.status} />
                </Box>
                <Typography>Category: {expense.category}</Typography>
                <Typography>Amount: {expense.amount} {expense.currency}</Typography>
                {expense.converted_amount && (
                  <Typography color="primary">
                    Converted: {expense.converted_amount.amount} {expense.converted_amount.currency}
                  </Typography>
                )}
                <Typography>Date: {expense.date}</Typography>
                <Typography>Description: {expense.description}</Typography>
                <Box sx={{ mt: 2, display: 'flex', gap: 1 }}>
                  <Button variant="contained" color="success" onClick={() => handleApprove(expense.id)}>
                    Approve
                  </Button>
                  <Button 
                    variant="contained" 
                    color="error" 
                    onClick={() => setRejectDialog({ open: true, expenseId: expense.id, comment: '' })}
                  >
                    Reject
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Dialog open={rejectDialog.open} onClose={() => setRejectDialog({ ...rejectDialog, open: false })}>
        <DialogTitle>Reject Expense</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Rejection Comment"
            fullWidth
            multiline
            rows={4}
            value={rejectDialog.comment}
            onChange={(e) => setRejectDialog({ ...rejectDialog, comment: e.target.value })}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setRejectDialog({ ...rejectDialog, open: false })}>Cancel</Button>
          <Button onClick={handleReject} color="error">Reject</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default ManagerDashboard;
