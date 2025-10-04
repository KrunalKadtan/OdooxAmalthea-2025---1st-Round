import React, { useState } from 'react';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/custom-select';
import { Checkbox } from '../ui/checkbox';
import { Badge } from '../ui/badge';
import { Plus, Trash2, ArrowDown, Settings } from 'lucide-react';
import NewWorkflowModal from './NewWorkflowModal';

interface ApprovalStep {
  id: string;
  type: 'role' | 'user';
  value: string;
  order: number;
}

interface WorkflowRule {
  id: string;
  name: string;
  type: 'percentage' | 'specific_approver' | 'hybrid';
  percentageThreshold?: number;
  specificApprover?: string;
  hybridCondition?: 'AND' | 'OR';
  isActive: boolean;
}

const mockWorkflows = [
  {
    id: '1',
    name: 'Standard Approval',
    steps: [
      { id: '1', type: 'role' as const, value: 'Manager', order: 1 },
      { id: '2', type: 'role' as const, value: 'Finance', order: 2 }
    ],
    rules: []
  },
  {
    id: '2',
    name: 'High-Value Expenses',
    steps: [
      { id: '3', type: 'role' as const, value: 'Manager', order: 1 },
      { id: '4', type: 'role' as const, value: 'Finance', order: 2 },
      { id: '5', type: 'role' as const, value: 'Director', order: 3 }
    ],
    rules: [
      {
        id: '1',
        name: '60% Approval Rule',
        type: 'percentage' as const,
        percentageThreshold: 60,
        isActive: true
      }
    ]
  }
];

const availableRoles = ['Manager', 'Finance', 'Director', 'CEO', 'CFO'];
const availableUsers = ['John Smith (CFO)', 'Sarah Johnson (Director)', 'Mike Brown (Finance Manager)'];

export default function WorkflowConfiguration() {
  const [workflows, setWorkflows] = useState(mockWorkflows);
  const [selectedWorkflow, setSelectedWorkflow] = useState(mockWorkflows[0]);
  const [steps, setSteps] = useState<ApprovalStep[]>(selectedWorkflow.steps);
  const [rules, setRules] = useState<WorkflowRule[]>(selectedWorkflow.rules);
  const [showNewWorkflowModal, setShowNewWorkflowModal] = useState(false);

  // Step management
  const addStep = () => {
    const newStep: ApprovalStep = {
      id: `step_${Date.now()}`,
      type: 'role',
      value: '',
      order: steps.length + 1
    };
    setSteps([...steps, newStep]);
  };

  const updateStep = (stepId: string, field: keyof ApprovalStep, value: any) => {
    setSteps(steps.map(step => 
      step.id === stepId ? { ...step, [field]: value } : step
    ));
  };

  const removeStep = (stepId: string) => {
    setSteps(steps.filter(step => step.id !== stepId));
  };

  // Rule management
  const addRule = () => {
    const newRule: WorkflowRule = {
      id: `rule_${Date.now()}`,
      name: '',
      type: 'percentage',
      percentageThreshold: 60,
      isActive: true
    };
    setRules([...rules, newRule]);
  };

  const updateRule = (ruleId: string, field: keyof WorkflowRule, value: any) => {
    setRules(rules.map(rule => 
      rule.id === ruleId ? { ...rule, [field]: value } : rule
    ));
  };

  const removeRule = (ruleId: string) => {
    setRules(rules.filter(rule => rule.id !== ruleId));
  };

  const saveWorkflow = () => {
    // In a real app, this would save to the backend
    const updatedWorkflow = {
      ...selectedWorkflow,
      steps,
      rules
    };
    
    setWorkflows(workflows.map(w => 
      w.id === selectedWorkflow.id ? updatedWorkflow : w
    ));
    
    alert('Workflow saved successfully!');
  };

  const createNewWorkflow = (workflowData: {
    name: string;
    description: string;
    type: 'standard' | 'high_value' | 'emergency' | 'custom';
  }) => {
    const newWorkflow = {
      id: `workflow_${Date.now()}`,
      name: workflowData.name,
      steps: [],
      rules: []
    };
    
    setWorkflows([...workflows, newWorkflow]);
    setSelectedWorkflow(newWorkflow);
    setSteps([]);
    setRules([]);
    alert('New workflow created successfully!');
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold text-gray-900">Approval Workflow Configuration</h2>
        <p className="text-gray-600">Design complex approval chains and conditional rules</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Workflow Selector */}
        <Card>
          <CardHeader>
            <CardTitle>Select Workflow</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {workflows.map((workflow) => (
              <div
                key={workflow.id}
                className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                  selectedWorkflow.id === workflow.id
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => {
                  setSelectedWorkflow(workflow);
                  setSteps(workflow.steps);
                  setRules(workflow.rules);
                }}
              >
                <div className="font-medium">{workflow.name}</div>
                <div className="text-sm text-gray-500">
                  {workflow.steps.length} steps, {workflow.rules.length} rules
                </div>
              </div>
            ))}
            <Button 
              className="w-full" 
              variant="outline"
              onClick={() => setShowNewWorkflowModal(true)}
            >
              <Plus className="h-4 w-4 mr-2" />
              New Workflow
            </Button>
          </CardContent>
        </Card>

        {/* Approval Steps Configuration */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Approval Sequence
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {steps.map((step, index) => (
              <div key={step.id} className="space-y-3 p-3 border rounded-lg">
                <div className="flex items-center justify-between">
                  <span className="font-medium">Step {index + 1}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeStep(step.id)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
                
                <div className="space-y-2">
                  <Label>Approver Type</Label>
                  <Select 
                    value={step.type} 
                    onValueChange={(value: 'role' | 'user') => updateStep(step.id, 'type', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="role">Role</SelectItem>
                      <SelectItem value="user">Specific User</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>{step.type === 'role' ? 'Role' : 'User'}</Label>
                  <Select 
                    value={step.value} 
                    onValueChange={(value) => updateStep(step.id, 'value', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder={`Select ${step.type}`} />
                    </SelectTrigger>
                    <SelectContent>
                      {(step.type === 'role' ? availableRoles : availableUsers).map((option) => (
                        <SelectItem key={option} value={option}>
                          {option}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {index < steps.length - 1 && (
                  <div className="flex justify-center">
                    <ArrowDown className="h-4 w-4 text-gray-400" />
                  </div>
                )}
              </div>
            ))}
            
            <Button onClick={addStep} variant="outline" className="w-full">
              <Plus className="h-4 w-4 mr-2" />
              Add Step
            </Button>
          </CardContent>
        </Card>

        {/* Conditional Rules */}
        <Card>
          <CardHeader>
            <CardTitle>Conditional Rules</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {rules.map((rule) => (
              <div key={rule.id} className="space-y-3 p-3 border rounded-lg">
                <div className="flex items-center justify-between">
                  <Input
                    placeholder="Rule name"
                    value={rule.name}
                    onChange={(e) => updateRule(rule.id, 'name', e.target.value)}
                    className="flex-1 mr-2"
                  />
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeRule(rule.id)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>

                <div className="space-y-2">
                  <Label>Rule Type</Label>
                  <Select 
                    value={rule.type} 
                    onValueChange={(value: 'percentage' | 'specific_approver' | 'hybrid') => 
                      updateRule(rule.id, 'type', value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="percentage">Percentage Approval</SelectItem>
                      <SelectItem value="specific_approver">Specific Approver</SelectItem>
                      <SelectItem value="hybrid">Hybrid Rule</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {rule.type === 'percentage' && (
                  <div className="space-y-2">
                    <Label>Approval Percentage</Label>
                    <div className="flex items-center gap-2">
                      <Input
                        type="number"
                        min="1"
                        max="100"
                        value={rule.percentageThreshold || 60}
                        onChange={(e) => updateRule(rule.id, 'percentageThreshold', parseInt(e.target.value))}
                        className="w-20"
                      />
                      <span>%</span>
                    </div>
                  </div>
                )}

                {rule.type === 'specific_approver' && (
                  <div className="space-y-2">
                    <Label>Specific Approver</Label>
                    <Select 
                      value={rule.specificApprover || ''} 
                      onValueChange={(value) => updateRule(rule.id, 'specificApprover', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select approver" />
                      </SelectTrigger>
                      <SelectContent>
                        {availableUsers.map((user) => (
                          <SelectItem key={user} value={user}>
                            {user}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}

                {rule.type === 'hybrid' && (
                  <div className="space-y-3">
                    <div className="space-y-2">
                      <Label>Percentage Threshold</Label>
                      <div className="flex items-center gap-2">
                        <Input
                          type="number"
                          min="1"
                          max="100"
                          value={rule.percentageThreshold || 60}
                          onChange={(e) => updateRule(rule.id, 'percentageThreshold', parseInt(e.target.value))}
                          className="w-20"
                        />
                        <span>%</span>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Condition</Label>
                      <Select 
                        value={rule.hybridCondition || 'OR'} 
                        onValueChange={(value: 'AND' | 'OR') => updateRule(rule.id, 'hybridCondition', value)}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="OR">OR</SelectItem>
                          <SelectItem value="AND">AND</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label>Specific Approver</Label>
                      <Select 
                        value={rule.specificApprover || ''} 
                        onValueChange={(value) => updateRule(rule.id, 'specificApprover', value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select approver" />
                        </SelectTrigger>
                        <SelectContent>
                          {availableUsers.map((user) => (
                            <SelectItem key={user} value={user}>
                              {user}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                )}

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id={`active-${rule.id}`}
                    checked={rule.isActive}
                    onCheckedChange={(checked) => updateRule(rule.id, 'isActive', checked)}
                  />
                  <Label htmlFor={`active-${rule.id}`}>Active</Label>
                </div>
              </div>
            ))}
            
            <Button onClick={addRule} variant="outline" className="w-full">
              <Plus className="h-4 w-4 mr-2" />
              Add Rule
            </Button>
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-end">
        <Button onClick={saveWorkflow} className="px-6">
          Save Workflow Configuration
        </Button>
      </div>

      <NewWorkflowModal
        isOpen={showNewWorkflowModal}
        onClose={() => setShowNewWorkflowModal(false)}
        onCreateWorkflow={createNewWorkflow}
      />
    </div>
  );
}