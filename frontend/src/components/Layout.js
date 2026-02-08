import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '../components/ui/dropdown-menu';
import { Menu, X, User, LogOut, LayoutDashboard, Settings, Users, FileText, BarChart3 } from 'lucide-react';

export const Navbar = () => {
    const { user, logout, isAdmin } = useAuth();
    const navigate = useNavigate();
    const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-border/40">
            <div className="max-w-7xl mx-auto px-4 md:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <Link to="/" className="flex items-center gap-2 group">
                        <div className="w-8 h-8 rounded-lg bg-teal flex items-center justify-center">
                            <span className="font-display font-bold text-white text-lg">D</span>
                        </div>
                        <span className="font-display font-semibold text-lg text-foreground group-hover:text-teal transition-colors">
                            Day Learning
                        </span>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center gap-6">
                        {user ? (
                            <>
                                {isAdmin && (
                                    <Link to="/admin" className="text-muted-foreground hover:text-foreground transition-colors text-sm">
                                        Admin Dashboard
                                    </Link>
                                )}
                                {user.role === 'student' && (
                                    <Link to="/dashboard" className="text-muted-foreground hover:text-foreground transition-colors text-sm">
                                        My Dashboard
                                    </Link>
                                )}
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" className="flex items-center gap-2">
                                            <div className="w-8 h-8 rounded-full bg-teal/20 flex items-center justify-center">
                                                <User className="w-4 h-4 text-teal" />
                                            </div>
                                            <span className="text-sm">{user.name}</span>
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end" className="w-56">
                                        <div className="px-2 py-1.5">
                                            <p className="text-sm font-medium">{user.name}</p>
                                            <p className="text-xs text-muted-foreground">{user.email}</p>
                                        </div>
                                        <DropdownMenuSeparator />
                                        {user.role === 'student' && (
                                            <DropdownMenuItem onClick={() => navigate('/dashboard')}>
                                                <LayoutDashboard className="w-4 h-4 mr-2" />
                                                Dashboard
                                            </DropdownMenuItem>
                                        )}
                                        {isAdmin && (
                                            <>
                                                <DropdownMenuItem onClick={() => navigate('/admin')}>
                                                    <LayoutDashboard className="w-4 h-4 mr-2" />
                                                    Admin Dashboard
                                                </DropdownMenuItem>
                                                <DropdownMenuItem onClick={() => navigate('/admin/applications')}>
                                                    <FileText className="w-4 h-4 mr-2" />
                                                    Applications
                                                </DropdownMenuItem>
                                                <DropdownMenuItem onClick={() => navigate('/admin/students')}>
                                                    <Users className="w-4 h-4 mr-2" />
                                                    Students
                                                </DropdownMenuItem>
                                                <DropdownMenuItem onClick={() => navigate('/admin/analytics')}>
                                                    <BarChart3 className="w-4 h-4 mr-2" />
                                                    Analytics
                                                </DropdownMenuItem>
                                            </>
                                        )}
                                        <DropdownMenuSeparator />
                                        <DropdownMenuItem onClick={handleLogout} className="text-coral">
                                            <LogOut className="w-4 h-4 mr-2" />
                                            Logout
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </>
                        ) : (
                            <>
                                <Link to="/login" className="text-muted-foreground hover:text-foreground transition-colors text-sm">
                                    Login
                                </Link>
                                <Button asChild className="bg-teal hover:bg-teal-light text-white glow-hover">
                                    <Link to="/apply">Apply Now</Link>
                                </Button>
                            </>
                        )}
                    </div>

                    {/* Mobile menu button */}
                    <button
                        className="md:hidden p-2"
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        data-testid="mobile-menu-toggle"
                    >
                        {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                    </button>
                </div>

                {/* Mobile Navigation */}
                {mobileMenuOpen && (
                    <div className="md:hidden py-4 border-t border-border/40 animate-fade-in">
                        <div className="flex flex-col gap-4">
                            {user ? (
                                <>
                                    <div className="px-2 py-2 border-b border-border/40">
                                        <p className="font-medium">{user.name}</p>
                                        <p className="text-sm text-muted-foreground">{user.email}</p>
                                    </div>
                                    {user.role === 'student' && (
                                        <Link
                                            to="/dashboard"
                                            className="px-2 py-2 text-foreground hover:text-teal transition-colors"
                                            onClick={() => setMobileMenuOpen(false)}
                                        >
                                            My Dashboard
                                        </Link>
                                    )}
                                    {isAdmin && (
                                        <Link
                                            to="/admin"
                                            className="px-2 py-2 text-foreground hover:text-teal transition-colors"
                                            onClick={() => setMobileMenuOpen(false)}
                                        >
                                            Admin Dashboard
                                        </Link>
                                    )}
                                    <button
                                        onClick={handleLogout}
                                        className="px-2 py-2 text-left text-coral hover:text-coral/80 transition-colors"
                                    >
                                        Logout
                                    </button>
                                </>
                            ) : (
                                <>
                                    <Link
                                        to="/login"
                                        className="px-2 py-2 text-foreground hover:text-teal transition-colors"
                                        onClick={() => setMobileMenuOpen(false)}
                                    >
                                        Login
                                    </Link>
                                    <Link
                                        to="/apply"
                                        className="px-2 py-2 text-teal font-medium"
                                        onClick={() => setMobileMenuOpen(false)}
                                    >
                                        Apply Now
                                    </Link>
                                </>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </nav>
    );
};

export const Footer = () => {
    return (
        <footer className="border-t border-border/40 bg-card/50">
            <div className="max-w-7xl mx-auto px-4 md:px-8 py-12">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    {/* Brand */}
                    <div className="md:col-span-2">
                        <div className="flex items-center gap-2 mb-4">
                            <div className="w-8 h-8 rounded-lg bg-teal flex items-center justify-center">
                                <span className="font-display font-bold text-white text-lg">D</span>
                            </div>
                            <span className="font-display font-semibold text-lg">Day Learning</span>
                        </div>
                        <p className="text-muted-foreground text-sm leading-relaxed max-w-md">
                            Day Learning trains experienced professionals to become AI-powered experts.
                            Named after Thomas Day, whose exceptional craftsmanship set the standard we aspire to.
                        </p>
                    </div>

                    {/* Links */}
                    <div>
                        <h4 className="font-display font-semibold mb-4">Platform</h4>
                        <ul className="space-y-2">
                            <li>
                                <Link to="/apply" className="text-muted-foreground hover:text-teal transition-colors text-sm">
                                    Apply Now
                                </Link>
                            </li>
                            <li>
                                <Link to="/login" className="text-muted-foreground hover:text-teal transition-colors text-sm">
                                    Login
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* THCO */}
                    <div>
                        <h4 className="font-display font-semibold mb-4">THCO</h4>
                        <p className="text-muted-foreground text-sm">
                            Day Learning is part of THCO.
                        </p>
                        <p className="text-muted-foreground text-sm mt-2">
                            Human insight. Amplified.
                        </p>
                    </div>
                </div>

                <div className="border-t border-border/40 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-muted-foreground text-sm">
                        © {new Date().getFullYear()} Day Learning by THCO. All rights reserved.
                    </p>
                    <p className="text-muted-foreground text-xs">
                        "Learn AI. Work On Real Things. Get Hired."
                    </p>
                </div>
            </div>
        </footer>
    );
};
