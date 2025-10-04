import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Container, Box, TextField, Button, Typography, Alert, Paper, Chip } from '@mui/material';
import { useAuth } from '../context/AuthContext';

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(username, password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Invalid credentials');
    }
  };

  const handleDemoLogin = (role) => {
    setUsername(role);
    setPassword('demo');
    setTimeout(() => {
      login(role, 'demo').then(() => navigate('/dashboard')).catch(err => setError(err.message));
    }, 100);
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 8, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Typography variant="h4" gutterBottom>Expense Manager</Typography>
        <Typography variant="h6" gutterBottom>Login</Typography>
        
        <Paper sx={{ p: 2, mb: 2, width: '100%', bgcolor: '#e3f2fd' }}>
          <Typography variant="subtitle2" gutterBottom>Demo Mode - Quick Login:</Typography>
          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
            <Chip label="Admin" color="primary" onClick={() => handleDemoLogin('admin')} clickable />
            <Chip label="Manager" color="secondary" onClick={() => handleDemoLogin('manager')} clickable />
            <Chip label="Employee" color="default" onClick={() => handleDemoLogin('employee')} clickable />
          </Box>
        </Paper>

        {error && <Alert severity="error" sx={{ width: '100%', mb: 2 }}>{error}</Alert>}
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1, width: '100%' }}>
          <TextField
            margin="normal"
            required
            fullWidth
            label="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="admin, manager, or employee"
          />
          <TextField
            margin="normal"
            required
            fullWidth
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Any password in demo mode"
          />
          <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
            Login
          </Button>
          <Link to="/signup">Don't have an account? Sign up</Link>
        </Box>
      </Box>
    </Container>
  );
}

export default Login;
