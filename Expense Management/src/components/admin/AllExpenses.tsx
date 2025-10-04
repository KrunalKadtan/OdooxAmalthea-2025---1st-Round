import React, { useState } from 'react';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Input } from '../ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/custom-select';
import { Badge } from '../ui/badge';
import { Search, Filter, Download, Shield } from 'lucide-react';

interface Expense {
  id: string;
  employeeName: string;
  description: string;
  category: string;
  amount: number;
  currency: string;
  convertedAmount: number;
  date: string;
  status: 'pending' | 'approved_manager' | 'approved' | 'rejected';
  submissionDate: string;
  rejectionReason?: string;
  workflowStep?: string;
}

const mockAllExpenses: Expense[] = [
  {
    id: '1',
    employeeName: 'John Employee',
    description: 'Client dinner at downtown restaurant',
    category: 'Meals',
    amount: 125.50,
    currency: 'USD',
    convertedAmount: 125.50,
    date: '2024-01-15',
    status: 'approved',
    submissionDate: '2024-01-16'
  },
  {
    id: '2',
    employeeName: 'Sarah Developer',
    description: 'Hotel stay in San Francisco',
    category: 'Travel',
    amount: 250.00,
    currency: 'USD',
    convertedAmount: 250.00,
    date: '2024-01-28',
    status: 'pending',
    submissionDate: '2024-01-29',
    workflowStep: 'Manager Approval'
  },
  {
    id: '3',
    employeeName: 'Mike Designer',
    description: 'Software license renewal',
    category: 'Software',
    amount: 99.00,
    currency: 'USD',
    convertedAmount: 99.00,
    date: '2024-01-27',
    status: 'approved_manager',
    submissionDate: '2024-01-28',
    workflowStep: 'Finance Approval'
  },
  {
    id: '4',
    employeeName: 'Jane Manager',
    description: 'Conference registration',
    category: 'Training',
    amount: 350.00,
    currency: 'USD',
    convertedAmount: 350.00,
    date: '2024-01-20',
    status: 'approved',
    submissionDate: '2024-01-21'
  },
  {
    id: '5',
    employeeName: 'Bob Admin',
    description: 'Taxi to client office',
    category: 'Travel',
    amount: 25.00,
    currency: 'USD',
    convertedAmount: 25.00,
    date: '2024-01-15',
    status: 'rejected',
    submissionDate: '2024-01-16',
    rejectionReason: 'Distance not justified for business purposes'
  }
];

const getStatusBadge = (status: string) => {
  switch (status) {
    case 'pending':
      return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">Pending</Badge>;
    case 'approved_manager':
      return <Badge variant="secondary" className="bg-blue-100 text-blue-800">Approved by Manager</Badge>;
    case 'approved':
      return <Badge variant="secondary" className="bg-green-100 text-green-800">Approved</Badge>;
    case 'rejected':
      return <Badge variant="destructive">Rejected</Badge>;
    default:
      return <Badge variant="secondary">{status}</Badge>;
  }
};

export default function AllExpenses() {
  const [expenses, setExpenses] = useState(mockAllExpenses);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');

  const filteredExpenses = expenses.filter(expense => {
    const matchesSearch = expense.employeeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         expense.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || expense.status === statusFilter;
    const matchesCategory = categoryFilter === 'all' || expense.category === categoryFilter;
    
    return matchesSearch && matchesStatus && matchesCategory;
  });

  const categories = Array.from(new Set(expenses.map(e => e.category)));

  const handleOverrideApproval = (expenseId: string) => {
    setExpenses(expenses.map(expense => 
      expense.id === expenseId 
        ? { ...expense, status: 'approved' as const, workflowStep: undefined }
        : expense
    ));
  };

  const handleExport = () => {
    // In a real app, this would generate and download a CSV/Excel file
    alert('Expense report exported successfully!');
  };

  const totalAmount = filteredExpenses.reduce((sum, expense) => sum + expense.convertedAmount, 0);
  const pendingCount = filteredExpenses.filter(e => e.status === 'pending').length;
  const approvedCount = filteredExpenses.filter(e => e.status === 'approved').length;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-semibold text-gray-900">All Expenses</h2>
          <p className="text-gray-600">Complete oversight of all company expenses</p>
        </div>
        <Button onClick={handleExport} className="flex items-center gap-2">
          <Download className="h-4 w-4" />
          Export Report
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-sm text-gray-600">Total Expenses</div>
            <div className="text-xl font-semibold">
              ${totalAmount.toFixed(2)}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-sm text-gray-600">Total Count</div>
            <div className="text-xl font-semibold">{filteredExpenses.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-sm text-gray-600">Pending</div>
            <div className="text-xl font-semibold text-yellow-600">{pendingCount}</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-sm text-gray-600">Approved</div>
            <div className="text-xl font-semibold text-green-600">{approvedCount}</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filters & Search
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Search</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search employee or description..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Status</label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="approved_manager">Approved by Manager</SelectItem>
                  <SelectItem value="approved">Approved</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Category</label>
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-end">
              <Button 
                variant="outline" 
                onClick={() => {
                  setSearchTerm('');
                  setStatusFilter('all');
                  setCategoryFilter('all');
                }}
                className="w-full"
              >
                Clear Filters
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Expenses Table */}
      <Card>
        <CardHeader>
          <CardTitle>Expense Details ({filteredExpenses.length} items)</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Employee</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Workflow</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredExpenses.map((expense) => (
                <TableRow key={expense.id}>
                  <TableCell className="font-medium">{expense.employeeName}</TableCell>
                  <TableCell>
                    <div>
                      <div>{expense.description}</div>
                      {expense.rejectionReason && (
                        <div className="text-sm text-red-600 mt-1">
                          Reason: {expense.rejectionReason}
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>{expense.category}</TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium">
                        ${expense.convertedAmount.toFixed(2)}
                      </div>
                      {expense.currency !== 'USD' && (
                        <div className="text-sm text-gray-500">
                          {expense.currency} {expense.amount.toFixed(2)}
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>{expense.date}</TableCell>
                  <TableCell>{getStatusBadge(expense.status)}</TableCell>
                  <TableCell>
                    {expense.workflowStep && (
                      <Badge variant="outline">{expense.workflowStep}</Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    {expense.status === 'pending' && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleOverrideApproval(expense.id)}
                        className="flex items-center gap-1 text-blue-600 hover:text-blue-700"
                      >
                        <Shield className="h-3 w-3" />
                        Override Approval
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          
          {filteredExpenses.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              No expenses found matching your criteria
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}