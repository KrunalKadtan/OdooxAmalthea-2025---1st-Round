import React, { useState, useEffect } from 'react';
import { Box, Typography, Button, Card, CardContent, Grid, TextField, Select, MenuItem, FormControl, InputLabel, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import axios from 'axios';

const demoUsers = [
  { id: 1, username: 'admin', email: 'admin@demo.com', first_name: 'Admin', last_name: 'User', role: 'ADMIN', company_name: 'Demo Company' },
  { id: 2, username: 'manager1', email: 'manager1@demo.com', first_name: 'John', last_name: 'Manager', role: 'MANAGER', company_name: 'Demo Company' },
  { id: 3, username: 'manager2', email: 'manager2@demo.com', first_name: 'Sarah', last_name: 'Manager', role: 'MANAGER', company_name: 'Demo Company' },
  { id: 4, username: 'emp1', email: 'emp1@demo.com', first_name: 'Alice', last_name: 'Smith', role: 'EMPLOYEE', company_name: 'Demo Company', manager_name: 'John Manager' },
  { id: 5, username: 'emp2', email: 'emp2@demo.com', first_name: 'Bob', last_name: 'Johnson', role: 'EMPLOYEE', company_name: 'Demo Company', manager_name: 'John Manager' },
  { id: 6, username: 'emp3', email: 'emp3@demo.com', first_name: 'Carol', last_name: 'Williams', role: 'EMPLOYEE', company_name: 'Demo Company', manager_name: 'Sarah Manager' },
];

function AdminDashboard() {
  const [users, setUsers] = useState(demoUsers);
  const [managers, setManagers] = useState(demoUsers.filter(u => u.role === 'MANAGER'));
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    first_name: '',
    last_name: '',
    role: 'EMPLOYEE',
    manager: '',
  });

  useEffect(() => {
    const isDemoMode = localStorage.getItem('demo_mode');
    if (!isDemoMode) {
      fetchUsers();
    }
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL || 'http://localhost:8000'}/api/users/`);
      setUsers(response.data);
      setManagers(response.data.filter(u => u.role === 'MANAGER'));
    } catch (error) {
      console.log('Using demo data');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const isDemoMode = localStorage.getItem('demo_mode');
    
    if (isDemoMode) {
      const newUser = {
        id: users.length + 1,
        ...formData,
        company_name: 'Demo Company',
        manager_name: managers.find(m => m.id === formData.manager)?.first_name + ' ' + managers.find(m => m.id === formData.manager)?.last_name,
      };
      setUsers([...users, newUser]);
      setShowForm(false);
      setFormData({ username: '', email: '', first_name: '', last_name: '', role: 'EMPLOYEE', manager: '' });
      return;
    }

    try {
      await axios.post(`${process.env.REACT_APP_API_URL || 'http://localhost:8000'}/api/users/`, formData);
      setShowForm(false);
      setFormData({ username: '', email: '', first_name: '', last_name: '', role: 'EMPLOYEE', manager: '' });
      fetchUsers();
    } catch (error) {
      console.error('Error creating user:', error);
    }
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4">User Management</Typography>
        <Button variant="contained" onClick={() => setShowForm(true)}>Add User</Button>
      </Box>

      <Grid container spacing={2}>
        {users.map((user) => (
          <Grid item xs={12} md={4} key={user.id}>
            <Card>
              <CardContent>
                <Typography variant="h6">{user.first_name} {user.last_name}</Typography>
                <Typography>Username: {user.username}</Typography>
                <Typography>Email: {user.email}</Typography>
                <Typography>Role: {user.role}</Typography>
                {user.manager_name && <Typography>Manager: {user.manager_name}</Typography>}
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Dialog open={showForm} onClose={() => setShowForm(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Add New User</DialogTitle>
        <form onSubmit={handleSubmit}>
          <DialogContent>
            <TextField
              margin="dense"
              label="Username"
              fullWidth
              required
              value={formData.username}
              onChange={(e) => setFormData({ ...formData, username: e.target.value })}
            />
            <TextField
              margin="dense"
              label="Email"
              type="email"
              fullWidth
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
            <TextField
              margin="dense"
              label="First Name"
              fullWidth
              required
              value={formData.first_name}
              onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
            />
            <TextField
              margin="dense"
              label="Last Name"
              fullWidth
              required
              value={formData.last_name}
              onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
            />
            <FormControl fullWidth margin="dense">
              <InputLabel>Role</InputLabel>
              <Select
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
              >
                <MenuItem value="EMPLOYEE">Employee</MenuItem>
                <MenuItem value="MANAGER">Manager</MenuItem>
                <MenuItem value="ADMIN">Admin</MenuItem>
              </Select>
            </FormControl>
            {formData.role === 'EMPLOYEE' && (
              <FormControl fullWidth margin="dense">
                <InputLabel>Manager</InputLabel>
                <Select
                  value={formData.manager}
                  onChange={(e) => setFormData({ ...formData, manager: e.target.value })}
                >
                  {managers.map((m) => (
                    <MenuItem key={m.id} value={m.id}>{m.first_name} {m.last_name}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setShowForm(false)}>Cancel</Button>
            <Button type="submit" variant="contained">Create User</Button>
          </DialogActions>
        </form>
      </Dialog>
    </Box>
  );
}

export default AdminDashboard;
