import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useNavigate,
} from "react-router-dom";
import { AuthProvider, useAuth } from "./components/AuthContext";
import { ThemeProvider } from "./components/ThemeContext";
import { SettingsProvider } from "./components/SettingsContext";
import LoginPage from "./components/LoginPage";
import SignupPage from "./components/SignupPage";
import EmployeeDashboard from "./components/EmployeeDashboard";
import ManagerDashboard from "./components/ManagerDashboard";
import AdminDashboard from "./components/AdminDashboard";
import Settings from "./components/Settings";
import { Toaster } from "./components/ui/sonner";

function SettingsWrapper() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleBack = () => {
    // Navigate back to the appropriate dashboard based on user role
    navigate(`/${user?.role || "employee"}`);
  };

  return <Settings onBack={handleBack} />;
}

function AppRoutes() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center mb-4 mx-auto">
            <div className="animate-spin rounded-full h-8 w-8 border-2 border-white/30 border-t-white"></div>
          </div>
          <h2 className="text-xl font-semibold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Loading ExpenseFlow...
          </h2>
          <p className="text-muted-foreground mt-2">
            Please wait while we prepare your dashboard
          </p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    );
  }

  // Redirect based on role
  const defaultPath = `/${user.role}`;
  return (
    <Routes>
      <Route
        path="/employee"
        element={
          user.role === "employee" ? (
            <EmployeeDashboard />
          ) : (
            <Navigate to={defaultPath} replace />
          )
        }
      />
      <Route
        path="/manager"
        element={
          user.role === "manager" ? (
            <ManagerDashboard />
          ) : (
            <Navigate to={defaultPath} replace />
          )
        }
      />
      <Route
        path="/admin"
        element={
          user.role === "admin" ? (
            <AdminDashboard />
          ) : (
            <Navigate to={defaultPath} replace />
          )
        }
      />
      <Route path="/settings" element={<SettingsWrapper />} />
      <Route path="*" element={<Navigate to={defaultPath} replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <Router>
      <ThemeProvider>
        <AuthProvider>
          <SettingsProvider>
            <div className="min-h-screen bg-background text-foreground antialiased">
              <AppRoutes />
              <Toaster
                richColors
                position="top-right"
                toastOptions={{
                  style: {
                    background: "hsl(var(--background))",
                    color: "hsl(var(--foreground))",
                    border: "1px solid hsl(var(--border))",
                  },
                }}
              />
            </div>
          </SettingsProvider>
        </AuthProvider>
      </ThemeProvider>
    </Router>
  );
}
