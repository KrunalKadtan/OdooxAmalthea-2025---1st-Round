import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '../ui/dialog';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/custom-select';

interface NewWorkflowModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateWorkflow: (workflow: {
    name: string;
    description: string;
    type: 'standard' | 'high_value' | 'emergency' | 'custom';
  }) => void;
}

export default function NewWorkflowModal({ isOpen, onClose, onCreateWorkflow }: NewWorkflowModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    type: 'standard' as 'standard' | 'high_value' | 'emergency' | 'custom'
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.name.trim()) {
      onCreateWorkflow(formData);
      setFormData({ name: '', description: '', type: 'standard' });
      onClose();
    }
  };

  const handleClose = () => {
    setFormData({ name: '', description: '', type: 'standard' });
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Create New Workflow</DialogTitle>
          <DialogDescription>
            Set up a new approval workflow for expense management.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="workflow-name">Workflow Name *</Label>
            <Input
              id="workflow-name"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              placeholder="e.g., Travel Expenses, High-Value Purchases"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="workflow-type">Workflow Type</Label>
            <Select 
              value={formData.type} 
              onValueChange={(value: 'standard' | 'high_value' | 'emergency' | 'custom') => 
                setFormData(prev => ({ ...prev, type: value }))
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="standard">Standard Approval</SelectItem>
                <SelectItem value="high_value">High-Value Expenses</SelectItem>
                <SelectItem value="emergency">Emergency Expenses</SelectItem>
                <SelectItem value="custom">Custom Workflow</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="workflow-description">Description</Label>
            <Textarea
              id="workflow-description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Describe when this workflow should be used..."
              rows={3}
            />
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button type="submit">
              Create Workflow
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}