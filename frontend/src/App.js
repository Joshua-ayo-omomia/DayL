import React from "react";
import "@/App.css";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "./components/ui/sonner";
import { AuthProvider, useAuth } from "./context/AuthContext";

import LandingPage from "./pages/LandingPage";
import { LoginPage, RegisterPage } from "./pages/AuthPages";
import EnterpriseDashboard from "./pages/EnterpriseDashboard";
import WorkforceHeatmap from "./pages/WorkforceHeatmap";
import WorkerDiagnostic from "./pages/WorkerDiagnostic";
import BuilderCore from "./pages/BuilderCore";
import BoardReport from "./pages/BoardReport";
import CohortManagement from "./pages/CohortManagement";
import ParticipantDashboard from "./pages/ParticipantDashboard";
import TaskPage from "./pages/TaskPage";
import CommunityHub from "./pages/CommunityHub";
import MyMentor from "./pages/MyMentor";

const ProtectedRoute = ({ children, allowedRoles }) => {
    const { user, loading } = useAuth();
    if (loading) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }
    if (!user) return <Navigate to="/login" replace />;
    if (allowedRoles && !allowedRoles.includes(user.role)) {
        if (user.role === "enterprise_admin" || user.role === "super_admin") return <Navigate to="/enterprise" replace />;
        if (user.role === "participant") return <Navigate to="/learn" replace />;
        if (user.role === "mentor") return <Navigate to="/learn" replace />;
        return <Navigate to="/" replace />;
    }
    return children;
};

const PublicRoute = ({ children }) => {
    const { user, loading } = useAuth();
    if (loading) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }
    if (user) {
        if (user.role === "enterprise_admin" || user.role === "super_admin") return <Navigate to="/enterprise" replace />;
        if (user.role === "participant") return <Navigate to="/learn" replace />;
        if (user.role === "mentor") return <Navigate to="/learn" replace />;
    }
    return children;
};

function AppRoutes() {
    return (
        <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<PublicRoute><LoginPage /></PublicRoute>} />
            <Route path="/register" element={<PublicRoute><RegisterPage /></PublicRoute>} />

            <Route path="/enterprise" element={<ProtectedRoute allowedRoles={["enterprise_admin", "super_admin"]}><EnterpriseDashboard /></ProtectedRoute>} />
            <Route path="/enterprise/heatmap" element={<ProtectedRoute allowedRoles={["enterprise_admin", "super_admin"]}><WorkforceHeatmap /></ProtectedRoute>} />
            <Route path="/enterprise/worker/:workerId" element={<ProtectedRoute allowedRoles={["enterprise_admin", "super_admin"]}><WorkerDiagnostic /></ProtectedRoute>} />
            <Route path="/enterprise/builder-core" element={<ProtectedRoute allowedRoles={["enterprise_admin", "super_admin"]}><BuilderCore /></ProtectedRoute>} />
            <Route path="/enterprise/cohorts" element={<ProtectedRoute allowedRoles={["enterprise_admin", "super_admin"]}><CohortManagement /></ProtectedRoute>} />
            <Route path="/enterprise/report" element={<ProtectedRoute allowedRoles={["enterprise_admin", "super_admin"]}><BoardReport /></ProtectedRoute>} />

            <Route path="/learn" element={<ProtectedRoute allowedRoles={["participant", "mentor"]}><ParticipantDashboard /></ProtectedRoute>} />
            <Route path="/learn/domain/:domainId/task/:taskId" element={<ProtectedRoute allowedRoles={["participant", "mentor"]}><TaskPage /></ProtectedRoute>} />
            <Route path="/learn/mentor" element={<ProtectedRoute allowedRoles={["participant"]}><MyMentor /></ProtectedRoute>} />
            <Route path="/community" element={<ProtectedRoute allowedRoles={["participant", "mentor", "enterprise_admin", "super_admin"]}><CommunityHub /></ProtectedRoute>} />

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
