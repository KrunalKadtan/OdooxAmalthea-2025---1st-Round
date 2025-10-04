import React, { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, Select, MenuItem, FormControl, InputLabel, Box, Typography } from '@mui/material';
import axios from 'axios';

function ExpenseForm({ onClose, onSubmit }) {
  const [formData, setFormData] = useState({
    amount: '',
    currency: 'USD',
    category: 'OTHER',
    description: '',
    date: new Date().toISOString().split('T')[0],
    vendor_name: '',
  });
  const [image, setImage] = useState(null);
  const [scanning, setScanning] = useState(false);

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setImage(file);
    setScanning(true);

    const isDemoMode = localStorage.getItem('demo_mode');
    
    if (isDemoMode) {
      // Demo OCR - simulate extraction
      setTimeout(() => {
        setFormData({
          ...formData,
          amount: '125.50',
          date: new Date().toISOString().split('T')[0],
          vendor_name: 'Demo Store Inc.',
        });
        setScanning(false);
      }, 1500);
      return;
    }

    const formDataObj = new FormData();
    formDataObj.append('image', file);

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL || 'http://localhost:8000'}/api/expenses/ocr_scan/`,
        formDataObj
      );
      setFormData({
        ...formData,
        amount: response.data.amount || formData.amount,
        date: response.data.date || formData.date,
        vendor_name: response.data.vendor_name || formData.vendor_name,
      });
    } catch (error) {
      console.error('OCR failed:', error);
    } finally {
      setScanning(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const isDemoMode = localStorage.getItem('demo_mode');
    
    if (isDemoMode) {
      onSubmit(formData);
      return;
    }

    try {
      const submitData = new FormData();
      Object.keys(formData).forEach(key => submitData.append(key, formData[key]));
      if (image) submitData.append('receipt_image', image);

      await axios.post(`${process.env.REACT_APP_API_URL || 'http://localhost:8000'}/api/expenses/`, submitData);
      onSubmit();
    } catch (error) {
      console.error('Error submitting expense:', error);
      onSubmit(formData);
    }
  };

  return (
    <Dialog open onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Submit Expense</DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent>
          <Box sx={{ mb: 2 }}>
            <Button variant="outlined" component="label">
              Upload Receipt (OCR)
              <input type="file" hidden accept="image/*" onChange={handleImageUpload} />
            </Button>
            {scanning && <Typography sx={{ mt: 1 }}>Scanning receipt...</Typography>}
          </Box>

          <TextField
            margin="dense"
            label="Amount"
            type="number"
            fullWidth
            required
            value={formData.amount}
            onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
          />
          <TextField
            margin="dense"
            label="Currency"
            fullWidth
            value={formData.currency}
            onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
          />
          <FormControl fullWidth margin="dense">
            <InputLabel>Category</InputLabel>
            <Select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            >
              <MenuItem value="TRAVEL">Travel</MenuItem>
              <MenuItem value="FOOD">Food</MenuItem>
              <MenuItem value="ACCOMMODATION">Accommodation</MenuItem>
              <MenuItem value="SUPPLIES">Supplies</MenuItem>
              <MenuItem value="OTHER">Other</MenuItem>
            </Select>
          </FormControl>
          <TextField
            margin="dense"
            label="Description"
            fullWidth
            multiline
            rows={3}
            required
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          />
          <TextField
            margin="dense"
            label="Date"
            type="date"
            fullWidth
            required
            value={formData.date}
            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
          />
          <TextField
            margin="dense"
            label="Vendor Name"
            fullWidth
            value={formData.vendor_name}
            onChange={(e) => setFormData({ ...formData, vendor_name: e.target.value })}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancel</Button>
          <Button type="submit" variant="contained">Submit</Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}

export default ExpenseForm;
