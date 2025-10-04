import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '../ui/dialog';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/custom-select';
import { User } from './UserManagement';

interface AddUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddUser: (userData: {
    fullName: string;
    email: string;
    role: 'employee' | 'manager' | 'admin';
    managerId?: string;
    country: string;
  }) => void;
  existingUsers: User[];
}

const countries = [
  { code: 'US', name: 'United States' },
  { code: 'UK', name: 'United Kingdom' },
  { code: 'CA', name: 'Canada' },
  { code: 'DE', name: 'Germany' },
  { code: 'FR', name: 'France' },
  { code: 'JP', name: 'Japan' },
  { code: 'AU', name: 'Australia' },
  { code: 'IN', name: 'India' }
];

const availableManagers = [
  { id: '2', name: 'Jane Manager' },
  { id: '3', name: 'Bob Admin' }
];

export default function AddUserModal({ isOpen, onClose, onAddUser }: AddUserModalProps) {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    role: 'employee' as 'employee' | 'manager' | 'admin',
    managerId: '',
    country: 'US'
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.fullName.trim() && formData.email.trim()) {
      onAddUser({
        ...formData,
        managerId: formData.role === 'employee' ? formData.managerId : undefined
      });
      setFormData({
        fullName: '',
        email: '',
        role: 'employee',
        managerId: '',
        country: 'US'
      });
      onClose();
    }
  };

  const handleClose = () => {
    setFormData({
      fullName: '',
      email: '',
      role: 'employee',
      managerId: '',
      country: 'US'
    });
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-2xl">
        <DialogHeader>
          <DialogTitle>Add New User</DialogTitle>
          <DialogDescription>
            Create a new user account for your organization.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Personal Information Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="user-name">Full Name *</Label>
              <Input
                id="user-name"
                value={formData.fullName}
                onChange={(e) => setFormData(prev => ({ ...prev, fullName: e.target.value }))}
                placeholder="John Doe"
                required
                className="h-9"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="user-email">Email *</Label>
              <Input
                id="user-email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                placeholder="john.doe@company.com"
                required
                className="h-9"
              />
            </div>
          </div>

          {/* Role and Manager Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="user-role">Role</Label>
              <Select 
                value={formData.role} 
                onValueChange={(value) => 
                  setFormData(prev => ({ 
                    ...prev, 
                    role: value as 'employee' | 'manager' | 'admin',
                    managerId: value !== 'employee' ? '' : prev.managerId
                  }))
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="employee">Employee</SelectItem>
                  <SelectItem value="manager">Manager</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="user-manager">Manager</Label>
              <Select 
                value={formData.managerId} 
                onValueChange={(value) => setFormData(prev => ({ ...prev, managerId: value }))}
                disabled={formData.role !== 'employee'}
              >
                <SelectTrigger className={formData.role !== 'employee' ? 'opacity-50' : ''}>
                  <SelectValue placeholder={formData.role === 'employee' ? "Select a manager" : "Not applicable"} />
                </SelectTrigger>
                <SelectContent>
                  {availableManagers.map((manager) => (
                    <SelectItem key={manager.id} value={manager.id}>
                      {manager.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {formData.role !== 'employee' && (
                <p className="text-xs text-muted-foreground">
                  Only employees need a manager assignment
                </p>
              )}
            </div>
          </div>

          {/* Country Section */}
          <div className="space-y-2">
            <Label htmlFor="user-country">Country</Label>
            <Select 
              value={formData.country} 
              onValueChange={(value) => setFormData(prev => ({ ...prev, country: value }))}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {countries.map((country) => (
                  <SelectItem key={country.code} value={country.code}>
                    {country.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button type="submit">
              Add User
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}