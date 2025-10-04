import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Container, Box, TextField, Button, Typography, Alert } from '@mui/material';
import { useAuth } from '../context/AuthContext';

function Signup() {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    first_name: '',
    last_name: '',
    company_name: '',
    country: '',
  });
  const [error, setError] = useState('');
  const { signup } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await signup(formData);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Signup failed');
    }
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 8, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Typography variant="h4" gutterBottom>Create Account</Typography>
        {error && <Alert severity="error" sx={{ width: '100%', mb: 2 }}>{error}</Alert>}
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1, width: '100%' }}>
          <TextField margin="normal" required fullWidth name="username" label="Username" onChange={handleChange} />
          <TextField margin="normal" required fullWidth name="email" label="Email" type="email" onChange={handleChange} />
          <TextField margin="normal" required fullWidth name="password" label="Password" type="password" onChange={handleChange} />
          <TextField margin="normal" required fullWidth name="first_name" label="First Name" onChange={handleChange} />
          <TextField margin="normal" required fullWidth name="last_name" label="Last Name" onChange={handleChange} />
          <TextField margin="normal" required fullWidth name="company_name" label="Company Name" onChange={handleChange} />
          <TextField margin="normal" required fullWidth name="country" label="Country" onChange={handleChange} />
          <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>Sign Up</Button>
          <Link to="/login">Already have an account? Login</Link>
        </Box>
      </Box>
    </Container>
  );
}

export default Signup;
