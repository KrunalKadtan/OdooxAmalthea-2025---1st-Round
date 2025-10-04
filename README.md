# 💼 Expense Management System - Full Stack

A modern, responsive expense management system with a React TypeScript frontend and Node.js backend with MongoDB database. Complete with authentication, role-based access, and real-time expense management.

## 🏗️ Architecture

### Frontend
- **React 18** with TypeScript
- **Tailwind CSS** for styling
- **Vite** for build tooling
- **Custom UI Components** with dark mode support

### Backend
- **Node.js** with Express.js
- **MongoDB** with Mongoose ODM
- **JWT Authentication**
- **File Upload** for receipts
- **Role-based Authorization**

## ✨ Features

### 🔐 Authentication & Authorization
- JWT-based authentication
- Role-based access control (Employee, Manager, Admin)
- Secure password hashing with bcrypt
- Token-based session management

### 💰 Expense Management
- Create, read, update, delete expenses
- Receipt upload and storage
- Expense categorization
- Multi-currency support
- Date-based filtering

### 👥 User Management
- User registration and profile management
- Team hierarchy (Manager-Employee relationships)
- Company-based user isolation
- Admin user management interface

### 📊 Dashboard & Analytics
- Role-specific dashboards
- Expense statistics and charts
- Approval workflows
- Real-time status updates

### 🎨 Modern UI/UX
- Responsive design for all devices
- Dark/light mode toggle
- Custom components (dropdowns, date pickers, tables)
- Smooth animations and transitions

## 🚀 Quick Start

### Prerequisites
- **Node.js** 16+ 
- **MongoDB** (local installation or MongoDB Atlas)
- **npm** or **yarn**

### Option 1: Automated Setup (Windows)
```bash
# Start both frontend and backend
start-fullstack.bat
```

### Option 2: Manual Setup

#### Backend Setup
```bash
cd expense-backend-nodejs
npm install
npm run seed    # Populate database with test data
npm run dev     # Start development server
```

#### Frontend Setup
```bash
cd "Expense Management"
npm install
npm run dev     # Start development server
```

## 🌐 Access URLs

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:8000/api
- **Health Check**: http://localhost:8000/health

## 👤 Test Credentials

| Role | Username | Password |
|------|----------|----------|
| Admin | `admin` | `admin123` |
| Manager | `manager` | `manager123` |
| Employee | `employee` | `employee123` |
| Employee 2 | `sarah` | `sarah123` |

## 📁 Project Structure

```
├── expense-backend-nodejs/          # Node.js Backend
│   ├── src/
│   │   ├── controllers/            # Route controllers
│   │   ├── models/                 # MongoDB models
│   │   ├── routes/                 # API routes
│   │   ├── middleware/             # Custom middleware
│   │   ├── utils/                  # Utility functions
│   │   ├── config/                 # Configuration files
│   │   └── server.js              # Main server file
│   ├── uploads/                    # Receipt uploads
│   └── package.json
│
├── Expense Management/              # React Frontend
│   ├── src/
│   │   ├── components/            # React components
│   │   ├── services/              # API services
│   │   ├── hooks/                 # Custom hooks
│   │   └── ...
│   └── package.json
│
├── start-fullstack.bat            # Start both servers
└── README.md
```

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get user profile
- `PUT /api/auth/profile` - Update profile
- `PUT /api/auth/change-password` - Change password

### Expenses
- `GET /api/expenses` - List expenses (with filters)
- `POST /api/expenses` - Create expense (with receipt upload)
- `GET /api/expenses/:id` - Get expense details
- `PUT /api/expenses/:id` - Update expense
- `DELETE /api/expenses/:id` - Delete expense
- `POST /api/expenses/:id/approve` - Approve expense
- `POST /api/expenses/:id/reject` - Reject expense
- `GET /api/expenses/stats` - Get expense statistics

### Users (Admin only)
- `GET /api/users` - List all users
- `POST /api/users` - Create user
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user
- `GET /api/users/team` - Get team members (Manager)

## 🎯 Features by Role

### 👨‍💼 Employee
- Submit expenses with receipt upload
- View personal expense history
- Track approval status
- Edit pending expenses
- Dashboard with personal statistics

### 👩‍💼 Manager
- All employee features
- Review team member expenses
- Approve/reject with comments
- View team statistics
- Manage team member expenses

### 🔧 Admin
- All manager features
- User management (create, update, delete)
- Company-wide analytics
- System configuration
- Access to all expenses

## 🛠️ Technology Stack

### Frontend
- React 18 + TypeScript
- Tailwind CSS + Custom Components
- Vite (Build tool)
- Radix UI (Accessible components)
- Lucide React (Icons)
- React Router DOM (Routing)

### Backend
- Node.js + Express.js
- MongoDB + Mongoose
- JWT (Authentication)
- Multer (File uploads)
- Bcrypt (Password hashing)
- Helmet (Security)
- CORS (Cross-origin requests)

## 🔒 Security Features

- JWT token-based authentication
- Password hashing with bcrypt
- Rate limiting on API endpoints
- CORS protection
- Input validation and sanitization
- File upload restrictions
- Role-based access control

## 📱 Responsive Design

Fully responsive design that works on:
- Desktop computers (1920px+)
- Laptops (1024px+)
- Tablets (768px+)
- Mobile devices (320px+)

## 🚀 Deployment

### Backend Deployment
- Deploy to Heroku, Railway, or DigitalOcean
- Use MongoDB Atlas for production database
- Set environment variables for production

### Frontend Deployment
- Deploy to Vercel, Netlify, or AWS S3
- Update API URL in environment variables
- Build with `npm run build`

## 🔧 Development

### Available Scripts

#### Backend
- `npm run dev` - Start development server with nodemon
- `npm start` - Start production server
- `npm run seed` - Seed database with test data

#### Frontend
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📝 License

This project is for demonstration purposes. Feel free to use it as a reference for your own projects.

---

**Note**: This is a complete full-stack application with real backend API and database integration. Perfect for learning modern web development practices!