import React from "react";
import "@/App.css";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "./components/ui/sonner";
import { AuthProvider, useAuth } from "./context/AuthContext";

// Pages
import LandingPage from "./pages/LandingPage";
import ApplicationPage from "./pages/ApplicationPage";
import { LoginPage, RegisterPage } from "./pages/AuthPages";
import OnboardingPage from "./pages/OnboardingPage";
import StudentDashboard from "./pages/StudentDashboard";
import ModulePage from "./pages/ModulePage";
import {
    AdminLayout,
    AdminOverview,
    AdminApplications,
    AdminStudents,
    AdminSubmissions,
    AdminContent,
    AdminAnalytics,
} from "./pages/AdminPages";

// Protected Route Component
const ProtectedRoute = ({ children, requireAdmin = false, requireStudent = false }) => {
    const { user, loading, isAdmin } = useAuth();

    if (loading) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <div className="w-8 h-8 border-2 border-teal border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    if (requireAdmin && !isAdmin) {
        return <Navigate to="/dashboard" replace />;
    }

    if (requireStudent && user.role !== "student") {
        return <Navigate to="/admin" replace />;
    }

    return children;
};

// Public Route - redirects authenticated users
const PublicRoute = ({ children }) => {
    const { user, loading, isAdmin } = useAuth();

    if (loading) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <div className="w-8 h-8 border-2 border-teal border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    if (user) {
        if (isAdmin) {
            return <Navigate to="/admin" replace />;
        }
        if (!user.onboarding_completed) {
            return <Navigate to="/onboarding" replace />;
        }
        return <Navigate to="/dashboard" replace />;
    }

    return children;
};

function AppRoutes() {
    return (
        <Routes>
            {/* Public Routes */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/apply" element={<ApplicationPage />} />
            <Route
                path="/login"
                element={
                    <PublicRoute>
                        <LoginPage />
                    </PublicRoute>
                }
            />
            <Route
                path="/register"
                element={
                    <PublicRoute>
                        <RegisterPage />
                    </PublicRoute>
                }
            />

            {/* Student Routes */}
            <Route
                path="/onboarding"
                element={
                    <ProtectedRoute requireStudent>
                        <OnboardingPage />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/dashboard"
                element={
                    <ProtectedRoute requireStudent>
                        <StudentDashboard />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/module/:moduleId"
                element={
                    <ProtectedRoute requireStudent>
                        <ModulePage />
                    </ProtectedRoute>
                }
            />

            {/* Admin Routes */}
            <Route
                path="/admin"
                element={
                    <ProtectedRoute requireAdmin>
                        <AdminLayout />
                    </ProtectedRoute>
                }
            >
                <Route index element={<AdminOverview />} />
                <Route path="applications" element={<AdminApplications />} />
                <Route path="students" element={<AdminStudents />} />
                <Route path="submissions" element={<AdminSubmissions />} />
                <Route path="content" element={<AdminContent />} />
                <Route path="analytics" element={<AdminAnalytics />} />
            </Route>

            {/* Catch all */}
            <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
    );
}

function App() {
    return (
        <BrowserRouter>
            <AuthProvider>
                <AppRoutes />
                <Toaster position="top-right" richColors />
            </AuthProvider>
        </BrowserRouter>
    );
}

export default App;
