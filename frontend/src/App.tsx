import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Index from "./pages/Index";
import Login from "./pages/Login";
import MovieDetails from "./pages/MovieDetails";
import SeatSelection from "./pages/SeatSelection";
import Checkout from "./pages/Checkout";
import NotFound from "./pages/NotFound";
import SignUp from "./pages/SignUp";
import Movies from "./pages/Movies";
import Theaters from "./pages/Theaters";
import Booking from "./pages/Booking";
import Profile from "./pages/Profile";
import AdminDashboard from "./pages/AdminDashboard";

// Create a new function to protect routes
const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
  if (!isLoggedIn) {
    return <Navigate to="/login" />;
  }
  return children;
};

const queryClient = new QueryClient();

const App = () => {
  const [isLoading, setIsLoading] = useState(true);

  // Check for authentication on initial load
  useEffect(() => {
    // This gives a small delay to prevent flickering between routes
    setTimeout(() => {
      setIsLoading(false);
    }, 500);
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/" element={
              <ProtectedRoute>
                <Index />
              </ProtectedRoute>
            } />
            <Route path="/movie/:id" element={
              <ProtectedRoute>
                <MovieDetails />
              </ProtectedRoute>
            } />
            <Route path="/seats/:id" element={
              <ProtectedRoute>
                <SeatSelection />
              </ProtectedRoute>
            } />
            <Route path="/checkout/:id" element={
              <ProtectedRoute>
                <Checkout />
              </ProtectedRoute>
            } />
            <Route path="/movies" element={
              <ProtectedRoute>
                <Movies />
              </ProtectedRoute>
            } />
            <Route path="/theaters" element={
              <ProtectedRoute>
                <Theaters />
              </ProtectedRoute>
            } />
            <Route path="/booking/:showtimeId" element={
              <ProtectedRoute>
                <Booking />
              </ProtectedRoute>
            } />
            <Route path="/profile" element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            } />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
