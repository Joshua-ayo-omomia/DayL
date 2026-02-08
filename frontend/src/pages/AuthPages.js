import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card';
import { Navbar } from '../components/Layout';
import { toast } from 'sonner';
import { Loader2, ArrowRight } from 'lucide-react';

export function LoginPage() {
    const { login } = useAuth();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({ email: '', password: '' });

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.email || !formData.password) {
            toast.error('Please fill in all fields');
            return;
        }

        setLoading(true);
        try {
            const user = await login(formData.email, formData.password);
            toast.success('Welcome back!');
            
            if (user.role === 'admin' || user.role === 'super_admin') {
                navigate('/admin');
            } else if (!user.onboarding_completed) {
                navigate('/onboarding');
            } else {
                navigate('/dashboard');
            }
        } catch (error) {
            const message = error.response?.data?.detail || 'Login failed';
            toast.error(message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-background">
            <Navbar />
            <div className="min-h-screen flex items-center justify-center pt-16 px-4">
                <Card className="w-full max-w-md border-border/40 bg-card/80">
                    <CardHeader className="text-center">
                        <CardTitle className="font-display text-2xl">Welcome Back</CardTitle>
                        <CardDescription>Sign in to your Day Learning account</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    value={formData.email}
                                    onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                                    placeholder="you@example.com"
                                    className="mt-1.5"
                                    data-testid="login-email"
                                />
                            </div>
                            <div>
                                <Label htmlFor="password">Password</Label>
                                <Input
                                    id="password"
                                    type="password"
                                    value={formData.password}
                                    onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                                    placeholder="••••••••"
                                    className="mt-1.5"
                                    data-testid="login-password"
                                />
                            </div>
                            <Button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-teal hover:bg-teal-light"
                                data-testid="login-submit"
                            >
                                {loading ? (
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                ) : (
                                    <>
                                        Sign In
                                        <ArrowRight className="w-4 h-4 ml-2" />
                                    </>
                                )}
                            </Button>
                        </form>
                        <div className="mt-6 text-center text-sm text-muted-foreground">
                            New to Day Learning?{' '}
                            <Link to="/apply" className="text-teal hover:underline">
                                Apply Now
                            </Link>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

export function RegisterPage() {
    const { register } = useAuth();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const invitationCode = searchParams.get('code') || '';
    
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        invitationCode: invitationCode
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!formData.name || !formData.email || !formData.password) {
            toast.error('Please fill in all required fields');
            return;
        }
        
        if (formData.password !== formData.confirmPassword) {
            toast.error('Passwords do not match');
            return;
        }
        
        if (formData.password.length < 6) {
            toast.error('Password must be at least 6 characters');
            return;
        }

        setLoading(true);
        try {
            await register(formData.name, formData.email, formData.password, formData.invitationCode);
            toast.success('Account created successfully!');
            navigate('/onboarding');
        } catch (error) {
            const message = error.response?.data?.detail || 'Registration failed';
            toast.error(message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-background">
            <Navbar />
            <div className="min-h-screen flex items-center justify-center pt-16 px-4 pb-8">
                <Card className="w-full max-w-md border-border/40 bg-card/80">
                    <CardHeader className="text-center">
                        <CardTitle className="font-display text-2xl">Create Account</CardTitle>
                        <CardDescription>
                            {invitationCode 
                                ? "You've been invited! Create your account to get started."
                                : "Set up your Day Learning account"
                            }
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <Label htmlFor="name">Full Name *</Label>
                                <Input
                                    id="name"
                                    value={formData.name}
                                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                                    placeholder="John Doe"
                                    className="mt-1.5"
                                    data-testid="register-name"
                                />
                            </div>
                            <div>
                                <Label htmlFor="email">Email *</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    value={formData.email}
                                    onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                                    placeholder="you@example.com"
                                    className="mt-1.5"
                                    data-testid="register-email"
                                />
                            </div>
                            <div>
                                <Label htmlFor="password">Password *</Label>
                                <Input
                                    id="password"
                                    type="password"
                                    value={formData.password}
                                    onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                                    placeholder="••••••••"
                                    className="mt-1.5"
                                    data-testid="register-password"
                                />
                            </div>
                            <div>
                                <Label htmlFor="confirmPassword">Confirm Password *</Label>
                                <Input
                                    id="confirmPassword"
                                    type="password"
                                    value={formData.confirmPassword}
                                    onChange={(e) => setFormData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                                    placeholder="••••••••"
                                    className="mt-1.5"
                                    data-testid="register-confirm-password"
                                />
                            </div>
                            <div>
                                <Label htmlFor="invitationCode">Invitation Code {!invitationCode && '(Optional)'}</Label>
                                <Input
                                    id="invitationCode"
                                    value={formData.invitationCode}
                                    onChange={(e) => setFormData(prev => ({ ...prev, invitationCode: e.target.value }))}
                                    placeholder="XXXXXXXX"
                                    className="mt-1.5"
                                    data-testid="register-invitation-code"
                                />
                                <p className="text-xs text-muted-foreground mt-1">
                                    If you've been accepted, enter your invitation code from the email
                                </p>
                            </div>
                            <Button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-teal hover:bg-teal-light"
                                data-testid="register-submit"
                            >
                                {loading ? (
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                ) : (
                                    <>
                                        Create Account
                                        <ArrowRight className="w-4 h-4 ml-2" />
                                    </>
                                )}
                            </Button>
                        </form>
                        <div className="mt-6 text-center text-sm text-muted-foreground">
                            Already have an account?{' '}
                            <Link to="/login" className="text-teal hover:underline">
                                Sign In
                            </Link>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
