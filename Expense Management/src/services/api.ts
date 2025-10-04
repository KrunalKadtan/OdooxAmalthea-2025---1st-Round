// API Configuration and Services for Node.js Backend
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
}

interface LoginResponse {
  accessToken: string;
  user: {
    id: string;
    username: string;
    email: string;
    firstName: string;
    lastName: string;
    fullName: string;
    role: string;
    company: any;
  };
}

interface User {
  id: string;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  fullName: string;
  role: string;
  company: any;
}

interface Expense {
  _id: string;
  employee: any;
  amount: number;
  currency: string;
  category: string;
  description: string;
  date: string;
  vendorName?: string;
  status: string;
  receipt?: any;
  rejectionReason?: string;
  reviewedBy?: any;
  reviewedAt?: string;
  createdAt: string;
  updatedAt: string;
}

class ApiService {
  private baseURL: string;
  private token: string | null;

  constructor() {
    this.baseURL = API_BASE_URL;
    this.token = localStorage.getItem('access_token');
  }

  // Helper method to get headers
  private getHeaders(includeAuth = true): Record<string, string> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };
    
    if (includeAuth && this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }
    
    return headers;
  }

  // Helper method to get headers for file upload
  private getFileHeaders(includeAuth = true): Record<string, string> {
    const headers: Record<string, string> = {};
    
    if (includeAuth && this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }
    
    return headers;
  }

  // Helper method to handle responses
  private async handleResponse<T = any>(response: Response): Promise<T> {
    if (!response.ok) {
      const error = await response.json().catch(() => ({ 
        success: false, 
        message: 'Network error' 
      }));
      throw new Error(error.message || `HTTP error! status: ${response.status}`);
    }
    
    const result: ApiResponse<T> = await response.json();
    return result.data || result as T;
  }

  // Authentication Methods
  async login(username: string, password: string): Promise<LoginResponse> {
    const response = await fetch(`${this.baseURL}/auth/login`, {
      method: 'POST',
      headers: this.getHeaders(false),
      body: JSON.stringify({ username, password }),
    });
    
    const data = await this.handleResponse<LoginResponse>(response);
    
    // Store token
    localStorage.setItem('access_token', data.accessToken);
    this.token = data.accessToken;
    
    return data;
  }

  async register(userData: {
    username: string;
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    companyName?: string;
    country?: string;
    role?: string;
  }): Promise<LoginResponse> {
    const response = await fetch(`${this.baseURL}/auth/register`, {
      method: 'POST',
      headers: this.getHeaders(false),
      body: JSON.stringify(userData),
    });
    
    const data = await this.handleResponse<LoginResponse>(response);
    
    // Store token
    localStorage.setItem('access_token', data.accessToken);
    this.token = data.accessToken;
    
    return data;
  }

  logout(): void {
    localStorage.removeItem('access_token');
    this.token = null;
  }

  // User Methods
  async getCurrentUser(): Promise<User> {
    const response = await fetch(`${this.baseURL}/auth/profile`, {
      headers: this.getHeaders(),
    });
    
    return this.handleResponse<User>(response);
  }

  async updateProfile(userData: {
    firstName?: string;
    lastName?: string;
    email?: string;
  }): Promise<User> {
    const response = await fetch(`${this.baseURL}/auth/profile`, {
      method: 'PUT',
      headers: this.getHeaders(),
      body: JSON.stringify(userData),
    });
    
    return this.handleResponse<User>(response);
  }

  async changePassword(currentPassword: string, newPassword: string): Promise<void> {
    const response = await fetch(`${this.baseURL}/auth/change-password`, {
      method: 'PUT',
      headers: this.getHeaders(),
      body: JSON.stringify({ currentPassword, newPassword }),
    });
    
    await this.handleResponse(response);
  }

  // Expense Methods
  async getExpenses(filters: {
    status?: string;
    category?: string;
    startDate?: string;
    endDate?: string;
    page?: number;
    limit?: number;
  } = {}): Promise<{
    expenses: Expense[];
    pagination: {
      currentPage: number;
      totalPages: number;
      totalCount: number;
      hasNextPage: boolean;
      hasPrevPage: boolean;
    };
  }> {
    const params = new URLSearchParams();
    Object.keys(filters).forEach(key => {
      const value = filters[key as keyof typeof filters];
      if (value !== undefined && value !== null) {
        params.append(key, value.toString());
      }
    });
    
    const url = `${this.baseURL}/expenses${params.toString() ? '?' + params.toString() : ''}`;
    const response = await fetch(url, {
      headers: this.getHeaders(),
    });
    
    return this.handleResponse(response);
  }

  async getExpenseById(id: string): Promise<Expense> {
    const response = await fetch(`${this.baseURL}/expenses/${id}`, {
      headers: this.getHeaders(),
    });
    
    return this.handleResponse<Expense>(response);
  }

  async createExpense(expenseData: {
    amount: number;
    currency?: string;
    category: string;
    description: string;
    date: string;
    vendorName?: string;
  }, receiptFile?: File): Promise<Expense> {
    const formData = new FormData();
    
    // Add expense data
    Object.keys(expenseData).forEach(key => {
      const value = expenseData[key as keyof typeof expenseData];
      if (value !== undefined && value !== null) {
        formData.append(key, value.toString());
      }
    });
    
    // Add receipt file if provided
    if (receiptFile) {
      formData.append('receipt', receiptFile);
    }
    
    const response = await fetch(`${this.baseURL}/expenses`, {
      method: 'POST',
      headers: this.getFileHeaders(),
      body: formData,
    });
    
    return this.handleResponse<Expense>(response);
  }

  async updateExpense(id: string, expenseData: {
    amount?: number;
    currency?: string;
    category?: string;
    description?: string;
    date?: string;
    vendorName?: string;
  }, receiptFile?: File): Promise<Expense> {
    const formData = new FormData();
    
    // Add expense data
    Object.keys(expenseData).forEach(key => {
      const value = expenseData[key as keyof typeof expenseData];
      if (value !== undefined && value !== null) {
        formData.append(key, value.toString());
      }
    });
    
    // Add receipt file if provided
    if (receiptFile) {
      formData.append('receipt', receiptFile);
    }
    
    const response = await fetch(`${this.baseURL}/expenses/${id}`, {
      method: 'PUT',
      headers: this.getFileHeaders(),
      body: formData,
    });
    
    return this.handleResponse<Expense>(response);
  }

  async deleteExpense(id: string): Promise<void> {
    const response = await fetch(`${this.baseURL}/expenses/${id}`, {
      method: 'DELETE',
      headers: this.getHeaders(),
    });
    
    await this.handleResponse(response);
  }

  async approveExpense(id: string, comment?: string): Promise<Expense> {
    const response = await fetch(`${this.baseURL}/expenses/${id}/approve`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify({ comment }),
    });
    
    return this.handleResponse<Expense>(response);
  }

  async rejectExpense(id: string, reason: string): Promise<Expense> {
    const response = await fetch(`${this.baseURL}/expenses/${id}/reject`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify({ reason }),
    });
    
    return this.handleResponse<Expense>(response);
  }

  async getExpenseStats(): Promise<{
    totalExpenses: number;
    pendingExpenses: number;
    approvedExpenses: number;
    rejectedExpenses: number;
    totalAmount: number;
    monthlyStats: Array<{
      _id: { year: number; month: number };
      count: number;
      amount: number;
    }>;
  }> {
    const response = await fetch(`${this.baseURL}/expenses/stats`, {
      headers: this.getHeaders(),
    });
    
    return this.handleResponse(response);
  }

  // User Management Methods (Admin only)
  async getUsers(): Promise<User[]> {
    const response = await fetch(`${this.baseURL}/users`, {
      headers: this.getHeaders(),
    });
    
    return this.handleResponse<User[]>(response);
  }

  async getTeamMembers(): Promise<User[]> {
    const response = await fetch(`${this.baseURL}/users/team`, {
      headers: this.getHeaders(),
    });
    
    return this.handleResponse<User[]>(response);
  }

  async createUser(userData: {
    username: string;
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    role?: string;
    managerId?: string;
  }): Promise<User> {
    const response = await fetch(`${this.baseURL}/users`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(userData),
    });
    
    return this.handleResponse<User>(response);
  }

  async updateUser(id: string, userData: {
    firstName?: string;
    lastName?: string;
    email?: string;
    role?: string;
    managerId?: string;
    isActive?: boolean;
  }): Promise<User> {
    const response = await fetch(`${this.baseURL}/users/${id}`, {
      method: 'PUT',
      headers: this.getHeaders(),
      body: JSON.stringify(userData),
    });
    
    return this.handleResponse<User>(response);
  }

  async deleteUser(id: string): Promise<void> {
    const response = await fetch(`${this.baseURL}/users/${id}`, {
      method: 'DELETE',
      headers: this.getHeaders(),
    });
    
    await this.handleResponse(response);
  }

  // Test connection
  async testConnection(): Promise<{ success: boolean; message: string }> {
    const response = await fetch(`${this.baseURL}/test`, {
      headers: this.getHeaders(false),
    });
    
    return this.handleResponse(response);
  }
}

// Create and export a singleton instance
const apiService = new ApiService();
export default apiService;