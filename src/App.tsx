
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Index from "./pages/Index";
import LoginPage from "./pages/LoginPage";
import CustomerPage from "./pages/CustomerPage";
import WorkerPage from "./pages/WorkerPage";
import BrokerPage from "./pages/BrokerPage";
import NotFound from "./pages/NotFound";
import useAuthStore from "./store/useAuthStore";

const queryClient = new QueryClient();

// Protected route component
const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user } = useAuthStore();
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  if (allowedRoles && !allowedRoles.includes(user.type)) {
    // Redirect to the appropriate dashboard based on user type
    if (user.type === 'customer') {
      return <Navigate to="/customer" replace />;
    } else if (user.type === 'worker') {
      return <Navigate to="/worker" replace />;
    } else if (user.type === 'broker') {
      return <Navigate to="/broker" replace />;
    }
  }
  
  return children;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/login" element={<LoginPage />} />
          
          <Route 
            path="/customer" 
            element={
              <ProtectedRoute allowedRoles={['customer']}>
                <CustomerPage />
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/worker" 
            element={
              <ProtectedRoute allowedRoles={['worker']}>
                <WorkerPage />
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/broker" 
            element={
              <ProtectedRoute allowedRoles={['broker']}>
                <BrokerPage />
              </ProtectedRoute>
            } 
          />
          
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
