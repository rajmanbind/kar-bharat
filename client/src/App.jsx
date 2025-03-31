import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "next-themes";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import React from "react"; // Add explicit React import
import Header from "./components/Header";
import Index from "./pages/Index";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import RegisterPageTwo from "./pages/RegisterPageTwo";
import ProfilePage from "./pages/ProfilePage";
import CustomerPage from "./pages/CustomerPage";
import WorkerPage from "./pages/WorkerPage";
import BrokerPage from "./pages/BrokerPage";
import NotFound from "./pages/NotFound";
import useUserStore from "./store/useUserStore";
import useAuthStore from "./store/useAuthStore";

// Create QueryClient as a constant outside of component
const queryClient = new QueryClient();

// Protected route component
const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user } = useUserStore();
  const { token } = useAuthStore();

  if (!user || !token) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.type)) {
    // Redirect to the appropriate dashboard based on user type
    if (user.type === "customer") {
      return <Navigate to="/customer" replace />;
    } else if (user.type === "worker") {
      return <Navigate to="/worker" replace />;
    } else if (user.type === "broker") {
      return <Navigate to="/broker" replace />;
    }
  }

  return children;
};

// Define App as a function component explicitly with React.FC type
const App= () => {
  const { user } = useUserStore();
  // const { token } = useAuthStore();
 return <QueryClientProvider client={queryClient}>
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <TooltipProvider>
        {/* <Toaster /> */}
        <Sonner />
        <BrowserRouter>
          <Header />
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path={`/complete-profile`} element={<RegisterPageTwo />} />
            {/* <Route path={`/complete-profile?role=${user.userType}`} element={<RegisterPageTwo />} /> */}

            <Route
              path="/profile"
              element={
                <ProtectedRoute allowedRoles={["customer", "worker", "broker"]}>
                  <ProfilePage />
                </ProtectedRoute>
              }
            />

            <Route
              path="/customer"
              element={
                <ProtectedRoute allowedRoles={["customer"]}>
                  <CustomerPage />
                </ProtectedRoute>
              }
            />

            <Route
              path="/worker"
              element={
                <ProtectedRoute allowedRoles={["worker"]}>
                  <WorkerPage />
                </ProtectedRoute>
              }
            />

            <Route
              path="/broker"
              element={
                <ProtectedRoute allowedRoles={["broker"]}>
                  <BrokerPage />
                </ProtectedRoute>
              }
            />

            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
}

export default App;
