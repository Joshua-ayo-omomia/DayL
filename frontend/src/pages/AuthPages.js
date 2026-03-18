import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { toast } from "sonner";
import { Eye, EyeOff } from "lucide-react";

export const LoginPage = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const userData = await login(email, password);
            toast.success("Welcome back!");
            if (userData.role === "enterprise_admin" || userData.role === "super_admin") {
                navigate("/enterprise");
            } else if (userData.role === "participant" || userData.role === "mentor") {
                navigate("/learn");
            } else {
                navigate("/");
            }
        } catch {
            toast.error("Invalid credentials");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-background flex items-center justify-center px-4">
            <div className="w-full max-w-sm space-y-8">
                <div>
                    <Link to="/" className="text-2xl font-bold text-white font-body" data-testid="login-logo">Realloc</Link>
                    <p className="text-xs text-gray-500 mt-1">Enterprise Workforce Intelligence</p>
                </div>
                <form onSubmit={handleSubmit} className="space-y-4" data-testid="login-form">
                    <div>
                        <label className="text-xs text-gray-400 mb-1 block">Email</label>
                        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                            className="w-full bg-card border border-border px-3 py-2.5 text-sm text-white focus:border-white focus:outline-none transition-colors"
                            required data-testid="login-email" />
                    </div>
                    <div>
                        <label className="text-xs text-gray-400 mb-1 block">Password</label>
                        <div className="relative">
                            <input type={showPassword ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)}
                                className="w-full bg-card border border-border px-3 py-2.5 text-sm text-white focus:border-white focus:outline-none transition-colors pr-10"
                                required data-testid="login-password" />
                            <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white">
                                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </button>
                        </div>
                    </div>
                    <button type="submit" disabled={loading}
                        className="w-full bg-white text-black py-2.5 text-sm font-semibold hover:bg-gray-300 disabled:opacity-50 transition-colors"
                        data-testid="login-submit">
                        {loading ? "Signing in..." : "Sign In"}
                    </button>
                </form>
                <p className="text-xs text-gray-600 text-center">
                    Need access? <Link to="/register" className="text-gray-400 hover:text-white transition-colors">Register</Link>
                </p>
            </div>
        </div>
    );
};

export const RegisterPage = () => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [accessCode, setAccessCode] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const { register } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await register(name, email, password, accessCode);
            toast.success("Account created");
            navigate("/learn");
        } catch (err) {
            toast.error(err.response?.data?.detail || "Registration failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-background flex items-center justify-center px-4">
            <div className="w-full max-w-sm space-y-8">
                <div>
                    <Link to="/" className="text-2xl font-bold text-white font-body" data-testid="register-logo">Realloc</Link>
                    <p className="text-xs text-gray-500 mt-1">Enterprise Workforce Intelligence</p>
                </div>
                <form onSubmit={handleSubmit} className="space-y-4" data-testid="register-form">
                    <div>
                        <label className="text-xs text-gray-400 mb-1 block">Full Name</label>
                        <input type="text" value={name} onChange={(e) => setName(e.target.value)}
                            className="w-full bg-card border border-border px-3 py-2.5 text-sm text-white focus:border-white focus:outline-none transition-colors"
                            required data-testid="register-name" />
                    </div>
                    <div>
                        <label className="text-xs text-gray-400 mb-1 block">Email</label>
                        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                            className="w-full bg-card border border-border px-3 py-2.5 text-sm text-white focus:border-white focus:outline-none transition-colors"
                            required data-testid="register-email" />
                    </div>
                    <div>
                        <label className="text-xs text-gray-400 mb-1 block">Password</label>
                        <div className="relative">
                            <input type={showPassword ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)}
                                className="w-full bg-card border border-border px-3 py-2.5 text-sm text-white focus:border-white focus:outline-none transition-colors pr-10"
                                required data-testid="register-password" />
                            <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white">
                                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </button>
                        </div>
                    </div>
                    <div>
                        <label className="text-xs text-gray-400 mb-1 block">Enterprise Access Code <span className="text-gray-600">(optional)</span></label>
                        <input type="text" value={accessCode} onChange={(e) => setAccessCode(e.target.value)}
                            className="w-full bg-card border border-border px-3 py-2.5 text-sm text-white focus:border-white focus:outline-none transition-colors"
                            data-testid="register-access-code" />
                    </div>
                    <button type="submit" disabled={loading}
                        className="w-full bg-white text-black py-2.5 text-sm font-semibold hover:bg-gray-300 disabled:opacity-50 transition-colors"
                        data-testid="register-submit">
                        {loading ? "Creating account..." : "Create Account"}
                    </button>
                </form>
                <p className="text-xs text-gray-600 text-center">
                    Already have an account? <Link to="/login" className="text-gray-400 hover:text-white transition-colors">Sign in</Link>
                </p>
            </div>
        </div>
    );
};
