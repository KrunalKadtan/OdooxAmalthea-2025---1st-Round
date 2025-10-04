import { useState } from "react";
import { useNavigate } from 'react-router-dom';
import { toast } from "sonner";
import { useAuth } from "./AuthContext";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Input } from "./ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/custom-select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { Textarea } from "./ui/textarea";
import { Label } from "./ui/label";
import { ThemeToggle } from "./ThemeToggle";
import {
  CheckCircle,
  XCircle,
  Clock,
  Eye,
  FileText,
  DollarSign,
  Users,
  TrendingUp,
  Search,
  Filter,
  Calendar,
  MessageSquare,
  Download,
  LogOut,
  Sparkles,
  Settings,
} from "lucide-react";

interface Expense {
  id: string;
  employeeName: string;
  amount: number;
  category: string;
  description: string;
  date: string;
  status: "pending" | "approved_manager" | "approved_finance" | "rejected";
  rejectionReason?: string;
}

const mockTeamHistory: Expense[] = [
  {
    id: "1",
    employeeName: "John Employee",
    amount: 250.0,
    category: "Travel",
    description: "Flight to client meeting in New York",
    date: "2024-01-15",
    status: "pending",
  },
  {
    id: "2",
    employeeName: "Sarah Developer",
    amount: 45.99,
    category: "Meals",
    description: "Team lunch at downtown restaurant",
    date: "2024-01-14",
    status: "approved_manager",
  },
  {
    id: "3",
    employeeName: "Mike Designer",
    amount: 89.5,
    category: "Software",
    description: "Adobe Creative Suite subscription",
    date: "2024-01-13",
    status: "pending",
  },
  {
    id: "4",
    employeeName: "Lisa Analyst",
    amount: 320.0,
    category: "Travel",
    description: "Hotel accommodation for conference",
    date: "2024-01-12",
    status: "approved_manager",
  },
  {
    id: "5",
    employeeName: "Tom Developer",
    amount: 15.75,
    category: "Office Supplies",
    description: "Notebook and pens",
    date: "2024-01-11",
    status: "rejected",
    rejectionReason: "Personal items not covered",
  },
];

const getStatusBadge = (status: string) => {
  switch (status) {
    case "pending":
      return (
        <Badge className="bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400 border-amber-200 dark:border-amber-800">
          <Clock className="h-3 w-3 mr-1" />
          Pending
        </Badge>
      );
    case "approved_manager":
      return (
        <Badge className="bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800">
          <CheckCircle className="h-3 w-3 mr-1" />
          Approved
        </Badge>
      );
    case "approved_finance":
      return (
        <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400 border-blue-200 dark:border-blue-800">
          <CheckCircle className="h-3 w-3 mr-1" />
          Finance Approved
        </Badge>
      );
    case "rejected":
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
    case "software":
      return "💻";
    case "office supplies":
      return "📝";
    default:
      return "📄";
  }
};

export default function ManagerDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [expenses, setExpenses] = useState<Expense[]>(mockTeamHistory);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [rejectionModal, setRejectionModal] = useState({
    isOpen: false,
    expenseId: "",
    employeeName: "",
  });
  const [rejectionReason, setRejectionReason] = useState("");
  const [detailsModal, setDetailsModal] = useState<{
    isOpen: boolean;
    expense: Expense | null;
  }>({ isOpen: false, expense: null });

  const filteredExpenses = expenses.filter((expense) => {
    const matchesSearch =
      expense.employeeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      expense.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || expense.status === statusFilter;
    const matchesCategory =
      categoryFilter === "all" || expense.category === categoryFilter;
    return matchesSearch && matchesStatus && matchesCategory;
  });

  const pendingExpenses = filteredExpenses.filter(
    (e: Expense) => e.status === "pending"
  );
  const approvedExpenses = expenses.filter(
    (e: Expense) => e.status === "approved_manager"
  );
  const totalPendingAmount = pendingExpenses.reduce(
    (sum, expense) => sum + expense.amount,
    0
  );
  const totalApprovedAmount = approvedExpenses.reduce(
    (sum, expense) => sum + expense.amount,
    0
  );

  const handleApprove = (expenseId: string) => {
    setExpenses((prev: Expense[]) =>
      prev.map((expense: Expense) =>
        expense.id === expenseId
          ? { ...expense, status: "approved_manager" as const }
          : expense
      )
    );
    toast.success("Expense approved successfully!");
  };

  const handleReject = () => {
    if (!rejectionReason.trim()) {
      toast.error("Please provide a rejection reason.");
      return;
    }

    setExpenses((prev: Expense[]) =>
      prev.map((expense: Expense) =>
        expense.id === rejectionModal.expenseId
          ? { ...expense, status: "rejected" as const, rejectionReason }
          : expense
      )
    );

    toast.error(`Expense rejected for ${rejectionModal.employeeName}`);
    setRejectionModal({ isOpen: false, expenseId: "", employeeName: "" });
    setRejectionReason("");
  };

  const openRejectionModal = (expenseId: string, employeeName: string) => {
    setRejectionModal({ isOpen: true, expenseId, employeeName });
  };

  const openDetailsModal = (expense: Expense) => {
    setDetailsModal({ isOpen: true, expense });
  };

  const categories = [...new Set(expenses.map((e) => e.category))];

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
                  Manager Dashboard
                </h1>
                <p className="text-sm text-muted-foreground">
                  Welcome back, {user?.fullName}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                onClick={() => navigate('/settings')}
                className="flex items-center gap-2 hover:bg-blue-50 hover:border-blue-200 hover:text-blue-600 dark:hover:bg-blue-950/20 dark:hover:border-blue-800 dark:hover:text-blue-400"
              >
                <Settings className="h-4 w-4" />
                Settings
              </Button>
              <ThemeToggle />
              <Button
                variant="outline"
                onClick={logout}
                className="flex items-center gap-2 hover:bg-red-50 hover:border-red-200 hover:text-red-600 dark:hover:bg-red-950/20 dark:hover:border-red-800 dark:hover:text-red-400"
              >
                <LogOut className="h-4 w-4" />
                Log Out
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="border-l-4 border-l-amber-500 bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/20 dark:to-orange-950/20 hover:shadow-lg transition-all duration-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-amber-700 dark:text-amber-400">
                    Pending Approval
                  </p>
                  <p className="text-2xl font-bold text-amber-900 dark:text-amber-300">
                    {pendingExpenses.length}
                  </p>
                  <p className="text-sm text-amber-600 dark:text-amber-500">
                    ${totalPendingAmount.toFixed(2)}
                  </p>
                </div>
                <Clock className="h-8 w-8 text-amber-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-emerald-500 bg-gradient-to-br from-emerald-50 to-green-50 dark:from-emerald-950/20 dark:to-green-950/20 hover:shadow-lg transition-all duration-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-emerald-700 dark:text-emerald-400">
                    Approved This Month
                  </p>
                  <p className="text-2xl font-bold text-emerald-900 dark:text-emerald-300">
                    {approvedExpenses.length}
                  </p>
                  <p className="text-sm text-emerald-600 dark:text-emerald-500">
                    ${totalApprovedAmount.toFixed(2)}
                  </p>
                </div>
                <CheckCircle className="h-8 w-8 text-emerald-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-blue-500 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 hover:shadow-lg transition-all duration-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-blue-700 dark:text-blue-400">
                    Team Members
                  </p>
                  <p className="text-2xl font-bold text-blue-900 dark:text-blue-300">
                    {new Set(expenses.map((e) => e.employeeName)).size}
                  </p>
                  <p className="text-sm text-blue-600 dark:text-blue-500">
                    Active employees
                  </p>
                </div>
                <Users className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="shadow-lg">
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input
                    placeholder="Search by employee name or description..."
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
                  <SelectItem value="approved_manager">Approved</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-full sm:w-[180px]">
                  <SelectValue placeholder="Filter by category" />
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
          </CardContent>
        </Card>

        <Tabs defaultValue="pending" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="pending" className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Pending Approval ({pendingExpenses.length})
            </TabsTrigger>
            <TabsTrigger value="history" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Team History ({filteredExpenses.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="pending">
            <Card className="shadow-xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-amber-500" />
                  Pending Expenses
                  {pendingExpenses.length > 0 && (
                    <Badge variant="secondary">{pendingExpenses.length}</Badge>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {pendingExpenses.length > 0 ? (
                    pendingExpenses.map((expense: Expense) => (
                      <Card
                        key={expense.id}
                        className="border-l-4 border-l-amber-400 hover:shadow-md transition-all duration-200 bg-gradient-to-r from-amber-50/50 to-transparent dark:from-amber-950/10"
                      >
                        <CardContent className="p-6">
                          <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-2">
                                <span className="text-2xl">
                                  {getCategoryIcon(expense.category)}
                                </span>
                                <div>
                                  <h4 className="font-semibold text-lg">
                                    {expense.employeeName}
                                  </h4>
                                  <p className="text-sm text-muted-foreground">
                                    {expense.category}
                                  </p>
                                </div>
                              </div>
                              <p className="text-gray-700 dark:text-gray-300 mb-3">
                                {expense.description}
                              </p>
                              <div className="flex items-center gap-4">
                                {getStatusBadge(expense.status)}
                                <span className="text-sm text-muted-foreground flex items-center gap-1">
                                  <Calendar className="h-3 w-3" />
                                  {new Date(expense.date).toLocaleDateString()}
                                </span>
                              </div>
                            </div>
                            <div className="flex flex-col items-end gap-4">
                              <div className="text-right">
                                <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                                  ${expense.amount.toFixed(2)}
                                </p>
                              </div>
                              <div className="flex gap-2">
                                <Button
                                  size="sm"
                                  onClick={() => handleApprove(expense.id)}
                                  className="bg-emerald-600 hover:bg-emerald-700 text-white"
                                >
                                  <CheckCircle className="h-4 w-4 mr-1" />
                                  Approve
                                </Button>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() =>
                                    openRejectionModal(
                                      expense.id,
                                      expense.employeeName
                                    )
                                  }
                                  className="border-red-200 text-red-600 hover:bg-red-50 dark:border-red-800 dark:text-red-400 dark:hover:bg-red-950/20"
                                >
                                  <XCircle className="h-4 w-4 mr-1" />
                                  Reject
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => openDetailsModal(expense)}
                                >
                                  <Eye className="h-4 w-4 mr-1" />
                                  Details
                                </Button>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))
                  ) : (
                    <div className="text-center py-16">
                      <div className="mx-auto w-24 h-24 bg-emerald-100 dark:bg-emerald-900/20 rounded-full flex items-center justify-center mb-4">
                        <CheckCircle className="h-12 w-12 text-emerald-600 dark:text-emerald-400" />
                      </div>
                      <h3 className="text-lg font-semibold mb-2">
                        All caught up!
                      </h3>
                      <p className="text-muted-foreground">
                        There are no pending expenses to review.
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="history">
            <Card className="shadow-xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-blue-500" />
                  Team Expense History
                  <Badge variant="secondary">{filteredExpenses.length}</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {filteredExpenses.length > 0 ? (
                    filteredExpenses.map((expense: Expense) => (
                      <Card
                        key={expense.id}
                        className={`hover:shadow-md transition-all duration-200 ${
                          expense.status === "approved_manager"
                            ? "border-l-4 border-l-emerald-400 bg-gradient-to-r from-emerald-50/50 to-transparent dark:from-emerald-950/10"
                            : expense.status === "rejected"
                            ? "border-l-4 border-l-red-400 bg-gradient-to-r from-red-50/50 to-transparent dark:from-red-950/10"
                            : "border-l-4 border-l-gray-200 dark:border-l-gray-700"
                        }`}
                      >
                        <CardContent className="p-6">
                          <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-2">
                                <span className="text-2xl">
                                  {getCategoryIcon(expense.category)}
                                </span>
                                <div>
                                  <h4 className="font-semibold text-lg">
                                    {expense.employeeName}
                                  </h4>
                                  <p className="text-sm text-muted-foreground">
                                    {expense.category}
                                  </p>
                                </div>
                              </div>
                              <p className="text-gray-700 dark:text-gray-300 mb-3">
                                {expense.description}
                              </p>
                              {expense.rejectionReason && (
                                <div className="bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 rounded-lg p-3 mb-3">
                                  <div className="flex items-center gap-2 mb-1">
                                    <MessageSquare className="h-4 w-4 text-red-600 dark:text-red-400" />
                                    <span className="text-sm font-medium text-red-800 dark:text-red-300">
                                      Rejection Reason:
                                    </span>
                                  </div>
                                  <p className="text-sm text-red-700 dark:text-red-400">
                                    {expense.rejectionReason}
                                  </p>
                                </div>
                              )}
                              <div className="flex items-center gap-4">
                                {getStatusBadge(expense.status)}
                                <span className="text-sm text-muted-foreground flex items-center gap-1">
                                  <Calendar className="h-3 w-3" />
                                  {new Date(expense.date).toLocaleDateString()}
                                </span>
                              </div>
                            </div>
                            <div className="flex flex-col items-end gap-4">
                              <div className="text-right">
                                <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                                  ${expense.amount.toFixed(2)}
                                </p>
                              </div>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => openDetailsModal(expense)}
                              >
                                <Eye className="h-4 w-4 mr-1" />
                                View Details
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))
                  ) : (
                    <div className="text-center py-16">
                      <div className="mx-auto w-24 h-24 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-4">
                        <Search className="h-12 w-12 text-gray-400" />
                      </div>
                      <h3 className="text-lg font-semibold mb-2">
                        No expenses found
                      </h3>
                      <p className="text-muted-foreground">
                        Try adjusting your search or filter criteria.
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Rejection Modal */}
        <Dialog
          open={rejectionModal.isOpen}
          onOpenChange={(open) =>
            !open &&
            setRejectionModal({
              isOpen: false,
              expenseId: "",
              employeeName: "",
            })
          }
        >
          <DialogContent className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-2xl">
            <DialogHeader>
              <DialogTitle>Reject Expense</DialogTitle>
              <DialogDescription>
                Please provide a reason for rejecting{" "}
                {rejectionModal.employeeName}'s expense.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="rejection-reason">Rejection Reason</Label>
                <Textarea
                  id="rejection-reason"
                  placeholder="Please explain why this expense is being rejected..."
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  className="mt-2"
                  rows={4}
                />
              </div>
              <div className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  onClick={() =>
                    setRejectionModal({
                      isOpen: false,
                      expenseId: "",
                      employeeName: "",
                    })
                  }
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleReject}
                  className="bg-red-600 hover:bg-red-700 text-white"
                >
                  Reject Expense
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Details Modal */}
        <Dialog
          open={detailsModal.isOpen}
          onOpenChange={(open) =>
            !open && setDetailsModal({ isOpen: false, expense: null })
          }
        >
          <DialogContent className="max-w-2xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-2xl">
            <DialogHeader>
              <DialogTitle>Expense Details</DialogTitle>
            </DialogHeader>
            {detailsModal.expense && (
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">
                      Employee
                    </Label>
                    <p className="text-lg font-semibold">
                      {detailsModal.expense.employeeName}
                    </p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">
                      Amount
                    </Label>
                    <p className="text-lg font-semibold text-green-600">
                      ${detailsModal.expense.amount.toFixed(2)}
                    </p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">
                      Category
                    </Label>
                    <p className="text-lg">
                      {getCategoryIcon(detailsModal.expense.category)}{" "}
                      {detailsModal.expense.category}
                    </p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">
                      Date
                    </Label>
                    <p className="text-lg">
                      {new Date(detailsModal.expense.date).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">
                    Description
                  </Label>
                  <p className="text-lg mt-1">
                    {detailsModal.expense.description}
                  </p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">
                    Status
                  </Label>
                  <div className="mt-1">
                    {getStatusBadge(detailsModal.expense.status)}
                  </div>
                </div>
                {detailsModal.expense.rejectionReason && (
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">
                      Rejection Reason
                    </Label>
                    <div className="bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 rounded-lg p-3 mt-1">
                      <p className="text-red-700 dark:text-red-400">
                        {detailsModal.expense.rejectionReason}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
