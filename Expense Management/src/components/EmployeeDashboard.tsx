import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Input } from './ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/custom-select';
import { 
  Plus, 
  LogOut, 
  DollarSign, 
  Clock, 
  CheckCircle, 
  XCircle, 
  Search, 
  Filter,
  Calendar,
  TrendingUp,
  FileText,
  Eye,
  Sparkles,
  Settings
} from 'lucide-react';
import { ThemeToggle } from './ThemeToggle';
import ExpenseSubmissionModal from './ExpenseSubmissionModal';

interface Expense {
  id: string;
  description: string;
  category: string;
  amount: number;
  currency: string;
  date: string;
  status: 'pending' | 'approved_manager' | 'approved' | 'rejected';
  submissionDate: string;
  rejectionReason?: string;
}

// Mock expense data
const mockExpenses: Expense[] = [
  {
    id: '1',
    description: 'Client dinner at downtown restaurant',
    category: 'Meals',
    amount: 125.50,
    currency: 'USD',
    date: '2024-01-15',
    status: 'approved',
    submissionDate: '2024-01-16'
  },
  {
    id: '2',
    description: 'Flight to Chicago for conference',
    category: 'Travel',
    amount: 450.00,
    currency: 'USD',
    date: '2024-01-20',
    status: 'approved_manager',
    submissionDate: '2024-01-21'
  },
  {
    id: '3',
    description: 'Office supplies - notebooks and pens',
    category: 'Supplies',
    amount: 35.75,
    currency: 'USD',
    date: '2024-01-25',
    status: 'pending',
    submissionDate: '2024-01-26'
  },
  {
    id: '4',
    description: 'Taxi to airport',
    category: 'Travel',
    amount: 28.00,
    currency: 'USD',
    date: '2024-01-22',
    status: 'rejected',
    submissionDate: '2024-01-23',
    rejectionReason: 'Receipt not clear enough to verify amount'
  }
];

const getStatusBadge = (status: string) => {
  switch (status) {
    case 'pending':
      return (
        <Badge className="bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400 border-amber-200 dark:border-amber-800">
          <Clock className="h-3 w-3 mr-1" />
          Pending
        </Badge>
      );
    case 'approved_manager':
      return (
        <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400 border-blue-200 dark:border-blue-800">
          <CheckCircle className="h-3 w-3 mr-1" />
          Manager Approved
        </Badge>
      );
    case 'approved':
      return (
        <Badge className="bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800">
          <CheckCircle className="h-3 w-3 mr-1" />
          Approved
        </Badge>
      );
    case 'rejected':
      return (
        <Badge className="bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400 border-red-200 dark:border-red-800">
          <XCircle className="h-3 w-3 mr-1" />
          Rejected
        </Badge>
      );
    default:
      return <Badge variant="outline">{status}</Badge>;
  }
};

const getCategoryIcon = (category: string) => {
  switch (category.toLowerCase()) {
    case "travel":
      return "✈️";
    case "meals":
      return "🍽️";
    case "supplies":
      return "📝";
    case "software":
      return "💻";
    case "equipment":
      return "🖥️";
    case "training":
      return "📚";
    case "entertainment":
      return "🎭";
    default:
      return "📄";
  }
};

export default function EmployeeDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [expenses, setExpenses] = useState(mockExpenses);
  const [showSubmissionModal, setShowSubmissionModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");

  const filteredExpenses = expenses.filter((expense) => {
    const matchesSearch = expense.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         expense.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || expense.status === statusFilter;
    const matchesCategory = categoryFilter === "all" || expense.category === categoryFilter;
    return matchesSearch && matchesStatus && matchesCategory;
  });

  const pendingExpenses = expenses.filter(e => e.status === 'pending');
  const approvedExpenses = expenses.filter(e => e.status === 'approved' || e.status === 'approved_manager');
  const rejectedExpenses = expenses.filter(e => e.status === 'rejected');
  const totalAmount = expenses.reduce((sum, expense) => sum + expense.amount, 0);
  const categories = [...new Set(expenses.map(e => e.category))];

  const handleAddExpense = (newExpense: Omit<Expense, 'id' | 'submissionDate' | 'status'>) => {
    const expense: Expense = {
      ...newExpense,
      id: `exp_${Date.now()}`,
      submissionDate: new Date().toISOString().split('T')[0],
      status: 'pending'
    };
    setExpenses([expense, ...expenses]);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50/50 via-white to-purple-50/50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-lg border-b border-gray-200 dark:border-gray-700 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Employee Dashboard
                </h1>
                <p className="text-sm text-muted-foreground">Welcome back, {user?.fullName}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="outline" onClick={() => navigate('/settings')} className="flex items-center gap-2 hover:bg-blue-50 hover:border-blue-200 hover:text-blue-600 dark:hover:bg-blue-950/20 dark:hover:border-blue-800 dark:hover:text-blue-400">
                <Settings className="h-4 w-4" />
                Settings
              </Button>
              <ThemeToggle />
              <Button variant="outline" onClick={logout} className="flex items-center gap-2 hover:bg-red-50 hover:border-red-200 hover:text-red-600 dark:hover:bg-red-950/20 dark:hover:border-red-800 dark:hover:text-red-400">
                <LogOut className="h-4 w-4" />
                Log Out
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="border-l-4 border-l-blue-500 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 hover:shadow-lg transition-all duration-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-blue-700 dark:text-blue-400">Total Expenses</p>
                  <p className="text-2xl font-bold text-blue-900 dark:text-blue-300">${totalAmount.toFixed(2)}</p>
                  <p className="text-sm text-blue-600 dark:text-blue-500">{expenses.length} submissions</p>
                </div>
                <DollarSign className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-amber-500 bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/20 dark:to-orange-950/20 hover:shadow-lg transition-all duration-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-amber-700 dark:text-amber-400">Pending</p>
                  <p className="text-2xl font-bold text-amber-900 dark:text-amber-300">{pendingExpenses.length}</p>
                  <p className="text-sm text-amber-600 dark:text-amber-500">Awaiting approval</p>
                </div>
                <Clock className="h-8 w-8 text-amber-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-emerald-500 bg-gradient-to-br from-emerald-50 to-green-50 dark:from-emerald-950/20 dark:to-green-950/20 hover:shadow-lg transition-all duration-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-emerald-700 dark:text-emerald-400">Approved</p>
                  <p className="text-2xl font-bold text-emerald-900 dark:text-emerald-300">{approvedExpenses.length}</p>
                  <p className="text-sm text-emerald-600 dark:text-emerald-500">Ready for payment</p>
                </div>
                <CheckCircle className="h-8 w-8 text-emerald-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-red-500 bg-gradient-to-br from-red-50 to-pink-50 dark:from-red-950/20 dark:to-pink-950/20 hover:shadow-lg transition-all duration-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-red-700 dark:text-red-400">Rejected</p>
                  <p className="text-2xl font-bold text-red-900 dark:text-red-300">{rejectedExpenses.length}</p>
                  <p className="text-sm text-red-600 dark:text-red-500">Need revision</p>
                </div>
                <XCircle className="h-8 w-8 text-red-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Action */}
        <Card className="bg-gradient-to-r from-blue-600 to-purple-600 text-white border-0 shadow-xl hover:shadow-2xl transition-all duration-200">
          <CardContent className="p-8">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
              <div className="text-center sm:text-left">
                <h3 className="text-2xl font-bold mb-2">Submit New Expense</h3>
                <p className="text-blue-100 text-lg">Quick and easy expense submission with OCR receipt scanning</p>
              </div>
              <Button 
                onClick={() => setShowSubmissionModal(true)}
                size="lg"
                className="bg-white text-blue-600 hover:bg-blue-50 font-semibold px-8 py-4 text-lg shadow-lg hover:shadow-xl transition-all duration-200"
              >
                <Plus className="h-5 w-5 mr-2" />
                Add Expense
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Filters */}
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input
                    placeholder="Search expenses..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full sm:w-[180px]">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="approved">Approved</SelectItem>
                  <SelectItem value="approved_manager">Manager Approved</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-full sm:w-[180px]">
                  <SelectValue placeholder="Filter by category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories.map(category => (
                    <SelectItem key={category} value={category}>{category}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Expense History */}
        <Card className="shadow-xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-xl">
              <FileText className="h-5 w-5 text-blue-500" />
              Your Expense History
              <Badge variant="secondary">{filteredExpenses.length}</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {filteredExpenses.length > 0 ? (
              <div className="space-y-4">
                {filteredExpenses.map((expense) => (
                  <Card key={expense.id} className="hover:shadow-md transition-all duration-200 border-l-4 border-l-gray-200 dark:border-l-gray-700 hover:border-l-blue-400">
                    <CardContent className="p-6">
                      <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <span className="text-2xl">{getCategoryIcon(expense.category)}</span>
                            <div>
                              <h4 className="font-semibold text-lg">{expense.description}</h4>
                              <p className="text-sm text-muted-foreground">{expense.category}</p>
                            </div>
                          </div>
                          {expense.rejectionReason && (
                            <div className="bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 rounded-lg p-3 mb-3">
                              <div className="flex items-center gap-2 mb-1">
                                <XCircle className="h-4 w-4 text-red-600 dark:text-red-400" />
                                <span className="text-sm font-medium text-red-800 dark:text-red-300">Rejection Reason:</span>
                              </div>
                              <p className="text-sm text-red-700 dark:text-red-400">{expense.rejectionReason}</p>
                            </div>
                          )}
                          <div className="flex items-center gap-4">
                            {getStatusBadge(expense.status)}
                            <span className="text-sm text-muted-foreground flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              {new Date(expense.date).toLocaleDateString()}
                            </span>
                            <span className="text-sm text-muted-foreground">
                              Submitted: {new Date(expense.submissionDate).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                        <div className="flex flex-col items-end gap-2">
                          <div className="text-right">
                            <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                              {expense.currency} {expense.amount.toFixed(2)}
                            </p>
                          </div>
                          <Button variant="ghost" size="sm">
                            <Eye className="h-4 w-4 mr-1" />
                            View Details
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <div className="mx-auto w-24 h-24 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-4">
                  <Search className="h-12 w-12 text-gray-400" />
                </div>
                <h3 className="text-lg font-semibold mb-2">No expenses found</h3>
                <p className="text-muted-foreground">Try adjusting your search or filter criteria.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Expense Submission Modal */}
      <ExpenseSubmissionModal
        isOpen={showSubmissionModal}
        onClose={() => setShowSubmissionModal(false)}
        onSubmit={handleAddExpense}
      />
    </div>
  );
}