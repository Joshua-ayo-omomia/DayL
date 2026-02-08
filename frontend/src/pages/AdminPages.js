import React, { useState, useEffect } from 'react';
import { Link, useNavigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '../components/ui/dialog';
import { Textarea } from '../components/ui/textarea';
import { Label } from '../components/ui/label';
import { Navbar } from '../components/Layout';
import { toast } from 'sonner';
import { 
    LayoutDashboard,
    FileText,
    Users,
    BookOpen,
    BarChart3,
    Settings,
    Loader2,
    CheckCircle2,
    XCircle,
    Eye,
    BrainCircuit,
    ArrowRight,
    Clock,
    ExternalLink,
    ChevronRight
} from 'lucide-react';
import { motion } from 'framer-motion';

const adminNavItems = [
    { path: '/admin', icon: LayoutDashboard, label: 'Overview', exact: true },
    { path: '/admin/applications', icon: FileText, label: 'Applications' },
    { path: '/admin/students', icon: Users, label: 'Students' },
    { path: '/admin/submissions', icon: BookOpen, label: 'Submissions' },
    { path: '/admin/content', icon: BookOpen, label: 'Content' },
    { path: '/admin/analytics', icon: BarChart3, label: 'Analytics' },
];

export function AdminLayout() {
    const { user, isAdmin } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        if (!isAdmin) {
            navigate('/');
            toast.error('Admin access required');
        }
    }, [isAdmin, navigate]);

    if (!isAdmin) return null;

    return (
        <div className="min-h-screen bg-background">
            <Navbar />
            
            <div className="flex pt-16">
                {/* Sidebar */}
                <aside className="hidden lg:block w-64 min-h-[calc(100vh-4rem)] border-r border-border/40 bg-card/30 p-4">
                    <nav className="space-y-1">
                        {adminNavItems.map((item) => {
                            const isActive = item.exact 
                                ? location.pathname === item.path
                                : location.pathname.startsWith(item.path);
                            
                            return (
                                <Link
                                    key={item.path}
                                    to={item.path}
                                    className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                                        isActive 
                                            ? 'bg-teal/10 text-teal' 
                                            : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                                    }`}
                                >
                                    <item.icon className="w-5 h-5" />
                                    <span className="text-sm font-medium">{item.label}</span>
                                </Link>
                            );
                        })}
                    </nav>
                </aside>

                {/* Mobile Nav */}
                <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-card border-t border-border/40 p-2">
                    <nav className="flex justify-around">
                        {adminNavItems.slice(0, 5).map((item) => {
                            const isActive = item.exact 
                                ? location.pathname === item.path
                                : location.pathname.startsWith(item.path);
                            
                            return (
                                <Link
                                    key={item.path}
                                    to={item.path}
                                    className={`flex flex-col items-center p-2 rounded-lg ${
                                        isActive ? 'text-teal' : 'text-muted-foreground'
                                    }`}
                                >
                                    <item.icon className="w-5 h-5" />
                                    <span className="text-xs mt-1">{item.label}</span>
                                </Link>
                            );
                        })}
                    </nav>
                </div>

                {/* Main Content */}
                <main className="flex-1 p-4 md:p-8 pb-24 lg:pb-8">
                    <div className="max-w-6xl mx-auto">
                        <Outlet />
                    </div>
                </main>
            </div>
        </div>
    );
}

export function AdminOverview() {
    const { api } = useAuth();
    const [loading, setLoading] = useState(true);
    const [analytics, setAnalytics] = useState(null);

    useEffect(() => {
        fetchAnalytics();
    }, []);

    const fetchAnalytics = async () => {
        try {
            const response = await api.get('/admin/analytics');
            setAnalytics(response.data);
        } catch (error) {
            toast.error('Failed to load analytics');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <Loader2 className="w-8 h-8 animate-spin text-teal" />
            </div>
        );
    }

    return (
        <div data-testid="admin-overview">
            <h1 className="font-display text-2xl md:text-3xl font-bold mb-6">Admin Dashboard</h1>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                <Card className="border-border/40 bg-card/80">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-muted-foreground">Total Applications</p>
                                <p className="text-3xl font-bold">{analytics?.applications?.total || 0}</p>
                            </div>
                            <FileText className="w-8 h-8 text-teal/50" />
                        </div>
                    </CardContent>
                </Card>
                
                <Card className="border-border/40 bg-card/80">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-muted-foreground">Active Students</p>
                                <p className="text-3xl font-bold">{analytics?.students?.total || 0}</p>
                            </div>
                            <Users className="w-8 h-8 text-amber/50" />
                        </div>
                    </CardContent>
                </Card>
                
                <Card className="border-border/40 bg-card/80">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-muted-foreground">Pending Reviews</p>
                                <p className="text-3xl font-bold">{analytics?.submissions?.pending || 0}</p>
                            </div>
                            <Clock className="w-8 h-8 text-coral/50" />
                        </div>
                    </CardContent>
                </Card>
                
                <Card className="border-border/40 bg-card/80">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-muted-foreground">Certificates</p>
                                <p className="text-3xl font-bold">{analytics?.certificates?.total || 0}</p>
                            </div>
                            <CheckCircle2 className="w-8 h-8 text-teal/50" />
                        </div>
                    </CardContent>
                </Card>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="border-border/40 bg-card/80">
                    <CardHeader>
                        <CardTitle className="font-display text-lg">Quick Actions</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                        <Link 
                            to="/admin/applications"
                            className="flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
                        >
                            <span>Review Applications</span>
                            <Badge>{analytics?.applications?.pending || 0} pending</Badge>
                        </Link>
                        <Link 
                            to="/admin/submissions"
                            className="flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
                        >
                            <span>Grade Submissions</span>
                            <Badge>{analytics?.submissions?.pending || 0} pending</Badge>
                        </Link>
                    </CardContent>
                </Card>

                <Card className="border-border/40 bg-card/80">
                    <CardHeader>
                        <CardTitle className="font-display text-lg">Performance</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div>
                            <div className="flex justify-between text-sm mb-1">
                                <span className="text-muted-foreground">Approval Rate</span>
                                <span>{analytics?.applications?.approval_rate || 0}%</span>
                            </div>
                            <div className="h-2 bg-muted rounded-full overflow-hidden">
                                <div 
                                    className="h-full bg-teal rounded-full"
                                    style={{ width: `${analytics?.applications?.approval_rate || 0}%` }}
                                />
                            </div>
                        </div>
                        <div>
                            <div className="flex justify-between text-sm mb-1">
                                <span className="text-muted-foreground">Onboarding Rate</span>
                                <span>{analytics?.students?.onboarding_rate || 0}%</span>
                            </div>
                            <div className="h-2 bg-muted rounded-full overflow-hidden">
                                <div 
                                    className="h-full bg-amber rounded-full"
                                    style={{ width: `${analytics?.students?.onboarding_rate || 0}%` }}
                                />
                            </div>
                        </div>
                        <div>
                            <div className="flex justify-between text-sm mb-1">
                                <span className="text-muted-foreground">Pass Rate</span>
                                <span>{analytics?.submissions?.pass_rate || 0}%</span>
                            </div>
                            <div className="h-2 bg-muted rounded-full overflow-hidden">
                                <div 
                                    className="h-full bg-teal rounded-full"
                                    style={{ width: `${analytics?.submissions?.pass_rate || 0}%` }}
                                />
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

export function AdminApplications() {
    const { api } = useAuth();
    const [loading, setLoading] = useState(true);
    const [applications, setApplications] = useState([]);
    const [selectedApp, setSelectedApp] = useState(null);
    const [screening, setScreening] = useState({});
    const [actionLoading, setActionLoading] = useState({});

    useEffect(() => {
        fetchApplications();
    }, []);

    const fetchApplications = async () => {
        try {
            const response = await api.get('/applications');
            setApplications(response.data);
        } catch (error) {
            toast.error('Failed to load applications');
        } finally {
            setLoading(false);
        }
    };

    const handleScreen = async (appId) => {
        setScreening(prev => ({ ...prev, [appId]: true }));
        try {
            const response = await api.post(`/applications/${appId}/screen`);
            toast.success('AI screening completed');
            fetchApplications();
        } catch (error) {
            toast.error(error.response?.data?.detail || 'Screening failed');
        } finally {
            setScreening(prev => ({ ...prev, [appId]: false }));
        }
    };

    const handleApprove = async (appId) => {
        setActionLoading(prev => ({ ...prev, [appId]: 'approve' }));
        try {
            await api.post(`/applications/${appId}/approve`);
            toast.success('Application approved');
            fetchApplications();
        } catch (error) {
            toast.error('Failed to approve');
        } finally {
            setActionLoading(prev => ({ ...prev, [appId]: null }));
        }
    };

    const handleReject = async (appId) => {
        setActionLoading(prev => ({ ...prev, [appId]: 'reject' }));
        try {
            await api.post(`/applications/${appId}/reject`);
            toast.success('Application rejected');
            fetchApplications();
        } catch (error) {
            toast.error('Failed to reject');
        } finally {
            setActionLoading(prev => ({ ...prev, [appId]: null }));
        }
    };

    const getStatusBadge = (status) => {
        const variants = {
            pending_review: { label: 'Pending', variant: 'secondary' },
            under_ai_review: { label: 'AI Reviewing', variant: 'outline' },
            ai_reviewed: { label: 'AI Reviewed', variant: 'default' },
            approved: { label: 'Approved', variant: 'default', className: 'bg-teal' },
            rejected: { label: 'Rejected', variant: 'destructive' }
        };
        const config = variants[status] || variants.pending_review;
        return <Badge variant={config.variant} className={config.className}>{config.label}</Badge>;
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <Loader2 className="w-8 h-8 animate-spin text-teal" />
            </div>
        );
    }

    return (
        <div data-testid="admin-applications">
            <div className="flex items-center justify-between mb-6">
                <h1 className="font-display text-2xl md:text-3xl font-bold">Applications</h1>
                <Badge variant="outline">{applications.length} total</Badge>
            </div>

            <div className="space-y-4">
                {applications.length === 0 ? (
                    <Card className="border-border/40 bg-card/80">
                        <CardContent className="p-8 text-center">
                            <FileText className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                            <p className="text-muted-foreground">No applications yet</p>
                        </CardContent>
                    </Card>
                ) : (
                    applications.map((app) => (
                        <Card key={app.id} className="border-border/40 bg-card/80">
                            <CardContent className="p-4 md:p-6">
                                <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-2">
                                            <h3 className="font-semibold">{app.full_name}</h3>
                                            {getStatusBadge(app.status)}
                                        </div>
                                        <p className="text-sm text-muted-foreground">{app.email}</p>
                                        <div className="flex flex-wrap gap-2 mt-2">
                                            <Badge variant="outline">{app.experience_years} years</Badge>
                                            <Badge variant="outline">{app.skill_area}</Badge>
                                            {app.resume_url && (
                                                <a 
                                                    href={`${process.env.REACT_APP_BACKEND_URL}${app.resume_url}`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="inline-flex items-center gap-1 px-2 py-1 text-xs bg-teal/20 text-teal rounded hover:bg-teal/30 transition-colors"
                                                >
                                                    <FileText className="w-3 h-3" />
                                                    Download Resume
                                                </a>
                                            )}
                                        </div>
                                        
                                        {app.status === 'approved' && app.invitation_code && (
                                            <div className="mt-3 p-2 rounded bg-teal/10 border border-teal/30">
                                                <p className="text-xs text-muted-foreground">Invitation Code:</p>
                                                <p className="font-mono text-teal font-semibold">{app.invitation_code}</p>
                                                <p className="text-xs text-muted-foreground mt-1">
                                                    Register link: {window.location.origin}/register?code={app.invitation_code}
                                                </p>
                                            </div>
                                        )}
                                        
                                        {app.ai_screening_result && (
                                            <div className="mt-4 p-3 rounded-lg bg-muted/50">
                                                <div className="flex items-center gap-2 mb-2">
                                                    <BrainCircuit className="w-4 h-4 text-teal" />
                                                    <span className="text-sm font-medium">AI Screening Result</span>
                                                    <Badge variant={
                                                        app.ai_screening_result.decision === 'approve' ? 'default' :
                                                        app.ai_screening_result.decision === 'maybe' ? 'secondary' : 'destructive'
                                                    } className={app.ai_screening_result.decision === 'approve' ? 'bg-teal' : ''}>
                                                        {app.ai_screening_result.decision} ({app.ai_screening_result.confidence}%)
                                                    </Badge>
                                                </div>
                                                <p className="text-sm text-muted-foreground">{app.ai_screening_result.reasoning}</p>
                                                
                                                {app.ai_screening_result.resume_analysis && (
                                                    <div className="mt-2">
                                                        <span className="text-xs text-blue-400">Resume Analysis:</span>
                                                        <p className="text-xs text-muted-foreground">{app.ai_screening_result.resume_analysis}</p>
                                                    </div>
                                                )}
                                                
                                                {app.ai_screening_result.consistency_check && (
                                                    <div className="mt-2">
                                                        <span className="text-xs text-purple-400">Consistency Check:</span>
                                                        <p className="text-xs text-muted-foreground">{app.ai_screening_result.consistency_check}</p>
                                                    </div>
                                                )}
                                                
                                                {app.ai_screening_result.strengths?.length > 0 && (
                                                    <div className="mt-2">
                                                        <span className="text-xs text-teal">Strengths:</span>
                                                        <p className="text-xs text-muted-foreground">{app.ai_screening_result.strengths.join(', ')}</p>
                                                    </div>
                                                )}
                                                {app.ai_screening_result.concerns?.length > 0 && (
                                                    <div className="mt-1">
                                                        <span className="text-xs text-amber">Concerns:</span>
                                                        <p className="text-xs text-muted-foreground">{app.ai_screening_result.concerns.join(', ')}</p>
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </div>

                                    <div className="flex flex-wrap gap-2">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => setSelectedApp(app)}
                                            data-testid={`view-app-${app.id}`}
                                        >
                                            <Eye className="w-4 h-4 mr-1" />
                                            View
                                        </Button>
                                        
                                        {app.status !== 'approved' && app.status !== 'rejected' && (
                                            <>
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => handleScreen(app.id)}
                                                    disabled={screening[app.id]}
                                                    data-testid={`screen-app-${app.id}`}
                                                >
                                                    {screening[app.id] ? (
                                                        <Loader2 className="w-4 h-4 animate-spin" />
                                                    ) : (
                                                        <>
                                                            <BrainCircuit className="w-4 h-4 mr-1" />
                                                            AI Screen
                                                        </>
                                                    )}
                                                </Button>
                                                <Button
                                                    size="sm"
                                                    onClick={() => handleApprove(app.id)}
                                                    disabled={actionLoading[app.id]}
                                                    className="bg-teal hover:bg-teal-light"
                                                    data-testid={`approve-app-${app.id}`}
                                                >
                                                    {actionLoading[app.id] === 'approve' ? (
                                                        <Loader2 className="w-4 h-4 animate-spin" />
                                                    ) : (
                                                        <>
                                                            <CheckCircle2 className="w-4 h-4 mr-1" />
                                                            Approve
                                                        </>
                                                    )}
                                                </Button>
                                                <Button
                                                    variant="destructive"
                                                    size="sm"
                                                    onClick={() => handleReject(app.id)}
                                                    disabled={actionLoading[app.id]}
                                                    data-testid={`reject-app-${app.id}`}
                                                >
                                                    {actionLoading[app.id] === 'reject' ? (
                                                        <Loader2 className="w-4 h-4 animate-spin" />
                                                    ) : (
                                                        <>
                                                            <XCircle className="w-4 h-4 mr-1" />
                                                            Reject
                                                        </>
                                                    )}
                                                </Button>
                                            </>
                                        )}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))
                )}
            </div>

            {/* Application Detail Dialog */}
            <Dialog open={!!selectedApp} onOpenChange={() => setSelectedApp(null)}>
                <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle className="font-display">Application Details</DialogTitle>
                    </DialogHeader>
                    {selectedApp && (
                        <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <Label className="text-muted-foreground">Full Name</Label>
                                    <p className="font-medium">{selectedApp.full_name}</p>
                                </div>
                                <div>
                                    <Label className="text-muted-foreground">Email</Label>
                                    <p className="font-medium">{selectedApp.email}</p>
                                </div>
                                <div>
                                    <Label className="text-muted-foreground">Phone</Label>
                                    <p className="font-medium">{selectedApp.phone || 'Not provided'}</p>
                                </div>
                                <div>
                                    <Label className="text-muted-foreground">LinkedIn</Label>
                                    {selectedApp.linkedin_url ? (
                                        <a href={selectedApp.linkedin_url} target="_blank" rel="noopener noreferrer" className="text-teal hover:underline flex items-center gap-1">
                                            View Profile <ExternalLink className="w-3 h-3" />
                                        </a>
                                    ) : (
                                        <p className="font-medium">Not provided</p>
                                    )}
                                </div>
                                <div>
                                    <Label className="text-muted-foreground">Experience</Label>
                                    <p className="font-medium">{selectedApp.experience_years} years</p>
                                </div>
                                <div>
                                    <Label className="text-muted-foreground">Skill Area</Label>
                                    <p className="font-medium">{selectedApp.skill_area}</p>
                                </div>
                            </div>
                            
                            {selectedApp.resume_url && (
                                <div>
                                    <Label className="text-muted-foreground">Resume</Label>
                                    <a 
                                        href={`${process.env.REACT_APP_BACKEND_URL}${selectedApp.resume_url}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-teal hover:underline flex items-center gap-1"
                                    >
                                        Download Resume <ExternalLink className="w-3 h-3" />
                                    </a>
                                </div>
                            )}
                            
                            {selectedApp.brief && (
                                <div>
                                    <Label className="text-muted-foreground">Brief/Background</Label>
                                    <p className="text-sm mt-1 p-3 bg-muted/50 rounded-lg">{selectedApp.brief}</p>
                                </div>
                            )}
                            
                            <div>
                                <Label className="text-muted-foreground">Why They Want to Join</Label>
                                <p className="text-sm mt-1 p-3 bg-muted/50 rounded-lg">{selectedApp.why_join}</p>
                            </div>

                            {selectedApp.invitation_code && (
                                <div className="p-4 rounded-lg bg-teal/10 border border-teal/30">
                                    <Label className="text-teal font-medium">Approved - Invitation Details</Label>
                                    <div className="mt-2 space-y-2">
                                        <div>
                                            <p className="text-xs text-muted-foreground">Invitation Code:</p>
                                            <p className="font-mono text-lg text-teal font-semibold">{selectedApp.invitation_code}</p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-muted-foreground">Registration Link:</p>
                                            <p className="font-mono text-sm text-teal break-all">
                                                {window.location.origin}/register?code={selectedApp.invitation_code}
                                            </p>
                                        </div>
                                        <p className="text-xs text-muted-foreground mt-2">
                                            Share this link with the applicant so they can create their account.
                                        </p>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    );
}

export function AdminStudents() {
    const { api } = useAuth();
    const [loading, setLoading] = useState(true);
    const [students, setStudents] = useState([]);

    useEffect(() => {
        fetchStudents();
    }, []);

    const fetchStudents = async () => {
        try {
            const response = await api.get('/admin/students');
            setStudents(response.data);
        } catch (error) {
            toast.error('Failed to load students');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <Loader2 className="w-8 h-8 animate-spin text-teal" />
            </div>
        );
    }

    return (
        <div data-testid="admin-students">
            <div className="flex items-center justify-between mb-6">
                <h1 className="font-display text-2xl md:text-3xl font-bold">Students</h1>
                <Badge variant="outline">{students.length} enrolled</Badge>
            </div>

            <div className="space-y-4">
                {students.length === 0 ? (
                    <Card className="border-border/40 bg-card/80">
                        <CardContent className="p-8 text-center">
                            <Users className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                            <p className="text-muted-foreground">No students enrolled yet</p>
                        </CardContent>
                    </Card>
                ) : (
                    students.map((student) => (
                        <Card key={student.id} className="border-border/40 bg-card/80">
                            <CardContent className="p-4 md:p-6">
                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                    <div>
                                        <h3 className="font-semibold">{student.name}</h3>
                                        <p className="text-sm text-muted-foreground">{student.email}</p>
                                        <div className="flex items-center gap-2 mt-2">
                                            <Badge variant={student.onboarding_completed ? 'default' : 'secondary'} 
                                                   className={student.onboarding_completed ? 'bg-teal' : ''}>
                                                {student.onboarding_completed ? 'Onboarded' : 'Onboarding'}
                                            </Badge>
                                        </div>
                                    </div>
                                    
                                    <div className="text-right">
                                        <p className="text-sm text-muted-foreground">Progress</p>
                                        <p className="text-lg font-semibold">
                                            {student.progress?.completed || 0} / {student.progress?.total || 0} modules
                                        </p>
                                        <div className="w-32 h-2 bg-muted rounded-full mt-1">
                                            <div 
                                                className="h-full bg-teal rounded-full"
                                                style={{ 
                                                    width: `${student.progress?.total > 0 
                                                        ? (student.progress.completed / student.progress.total) * 100 
                                                        : 0}%` 
                                                }}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))
                )}
            </div>
        </div>
    );
}

export function AdminSubmissions() {
    const { api, user } = useAuth();
    const [loading, setLoading] = useState(true);
    const [submissions, setSubmissions] = useState([]);
    const [selectedSubmission, setSelectedSubmission] = useState(null);
    const [reviewDialogOpen, setReviewDialogOpen] = useState(false);
    const [reviewData, setReviewData] = useState({ status: '', admin_feedback: '' });
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        fetchSubmissions();
    }, []);

    const fetchSubmissions = async () => {
        try {
            const response = await api.get('/submissions');
            setSubmissions(response.data);
        } catch (error) {
            toast.error('Failed to load submissions');
        } finally {
            setLoading(false);
        }
    };

    const handleReview = async () => {
        if (!reviewData.status || !reviewData.admin_feedback) {
            toast.error('Please fill in all fields');
            return;
        }

        setSubmitting(true);
        try {
            await api.post(`/submissions/${selectedSubmission.id}/review`, reviewData);
            toast.success('Review submitted');
            setReviewDialogOpen(false);
            setSelectedSubmission(null);
            setReviewData({ status: '', admin_feedback: '' });
            fetchSubmissions();
        } catch (error) {
            toast.error('Failed to submit review');
        } finally {
            setSubmitting(false);
        }
    };

    const getStatusBadge = (status) => {
        const variants = {
            pending: { label: 'Pending', variant: 'secondary' },
            pass: { label: 'Passed', variant: 'default', className: 'bg-teal' },
            needs_work: { label: 'Needs Work', variant: 'outline' },
            fail: { label: 'Failed', variant: 'destructive' }
        };
        const config = variants[status] || variants.pending;
        return <Badge variant={config.variant} className={config.className}>{config.label}</Badge>;
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <Loader2 className="w-8 h-8 animate-spin text-teal" />
            </div>
        );
    }

    return (
        <div data-testid="admin-submissions">
            <div className="flex items-center justify-between mb-6">
                <h1 className="font-display text-2xl md:text-3xl font-bold">Submissions</h1>
                <Badge variant="outline">{submissions.filter(s => s.status === 'pending').length} pending</Badge>
            </div>

            <div className="space-y-4">
                {submissions.length === 0 ? (
                    <Card className="border-border/40 bg-card/80">
                        <CardContent className="p-8 text-center">
                            <BookOpen className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                            <p className="text-muted-foreground">No submissions yet</p>
                        </CardContent>
                    </Card>
                ) : (
                    submissions.map((submission) => (
                        <Card key={submission.id} className="border-border/40 bg-card/80">
                            <CardContent className="p-4 md:p-6">
                                <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-2">
                                            <h3 className="font-semibold">{submission.title}</h3>
                                            {getStatusBadge(submission.status)}
                                        </div>
                                        <p className="text-sm text-muted-foreground line-clamp-2">{submission.description}</p>
                                        <a 
                                            href={submission.project_url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-sm text-teal hover:underline flex items-center gap-1 mt-2"
                                        >
                                            View Project <ExternalLink className="w-3 h-3" />
                                        </a>
                                        <p className="text-xs text-muted-foreground mt-2">
                                            Submitted: {new Date(submission.created_at).toLocaleDateString()}
                                        </p>
                                    </div>

                                    {submission.status === 'pending' && (
                                        <Button
                                            onClick={() => {
                                                setSelectedSubmission(submission);
                                                setReviewDialogOpen(true);
                                            }}
                                            className="bg-teal hover:bg-teal-light"
                                            data-testid={`review-submission-${submission.id}`}
                                        >
                                            Review
                                        </Button>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    ))
                )}
            </div>

            {/* Review Dialog */}
            <Dialog open={reviewDialogOpen} onOpenChange={setReviewDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle className="font-display">Review Submission</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                        <div>
                            <Label>Decision</Label>
                            <div className="flex gap-2 mt-2">
                                {['pass', 'needs_work', 'fail'].map((status) => (
                                    <Button
                                        key={status}
                                        type="button"
                                        variant={reviewData.status === status ? 'default' : 'outline'}
                                        className={reviewData.status === status && status === 'pass' ? 'bg-teal' : ''}
                                        onClick={() => setReviewData(prev => ({ ...prev, status }))}
                                    >
                                        {status === 'pass' ? 'Pass' : status === 'needs_work' ? 'Needs Work' : 'Fail'}
                                    </Button>
                                ))}
                            </div>
                        </div>
                        <div>
                            <Label>Feedback</Label>
                            <Textarea
                                value={reviewData.admin_feedback}
                                onChange={(e) => setReviewData(prev => ({ ...prev, admin_feedback: e.target.value }))}
                                placeholder="Provide detailed feedback for the student..."
                                className="mt-1.5 min-h-[100px]"
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setReviewDialogOpen(false)}>Cancel</Button>
                        <Button 
                            onClick={handleReview} 
                            disabled={submitting}
                            className="bg-teal hover:bg-teal-light"
                        >
                            {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Submit Review'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}

export function AdminContent() {
    const { api } = useAuth();
    const [loading, setLoading] = useState(true);
    const [modules, setModules] = useState([]);

    useEffect(() => {
        fetchModules();
    }, []);

    const fetchModules = async () => {
        try {
            const response = await api.get('/modules');
            setModules(response.data);
        } catch (error) {
            toast.error('Failed to load modules');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <Loader2 className="w-8 h-8 animate-spin text-teal" />
            </div>
        );
    }

    return (
        <div data-testid="admin-content">
            <div className="flex items-center justify-between mb-6">
                <h1 className="font-display text-2xl md:text-3xl font-bold">Content Management</h1>
                <Badge variant="outline">{modules.length} modules</Badge>
            </div>

            <div className="space-y-4">
                {modules.map((module, index) => (
                    <Card key={module.id} className="border-border/40 bg-card/80">
                        <CardContent className="p-4 md:p-6">
                            <div className="flex items-start justify-between gap-4">
                                <div className="flex items-start gap-4">
                                    <div className="w-10 h-10 rounded-lg bg-teal/20 flex items-center justify-center flex-shrink-0">
                                        <span className="font-semibold text-teal">{module.order}</span>
                                    </div>
                                    <div>
                                        <h3 className="font-semibold">{module.title}</h3>
                                        <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{module.description}</p>
                                        <div className="flex items-center gap-2 mt-2">
                                            {module.has_assessment && (
                                                <Badge variant="outline">Has Assessment</Badge>
                                            )}
                                            <Badge variant={module.is_published ? 'default' : 'secondary'}
                                                   className={module.is_published ? 'bg-teal' : ''}>
                                                {module.is_published ? 'Published' : 'Draft'}
                                            </Badge>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}

export function AdminAnalytics() {
    const { api } = useAuth();
    const [loading, setLoading] = useState(true);
    const [analytics, setAnalytics] = useState(null);

    useEffect(() => {
        fetchAnalytics();
    }, []);

    const fetchAnalytics = async () => {
        try {
            const response = await api.get('/admin/analytics');
            setAnalytics(response.data);
        } catch (error) {
            toast.error('Failed to load analytics');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <Loader2 className="w-8 h-8 animate-spin text-teal" />
            </div>
        );
    }

    return (
        <div data-testid="admin-analytics">
            <h1 className="font-display text-2xl md:text-3xl font-bold mb-6">Analytics</h1>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="border-border/40 bg-card/80">
                    <CardHeader>
                        <CardTitle className="font-display">Applications</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex justify-between">
                            <span className="text-muted-foreground">Total</span>
                            <span className="font-semibold">{analytics?.applications?.total}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-muted-foreground">Approved</span>
                            <span className="font-semibold text-teal">{analytics?.applications?.approved}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-muted-foreground">Rejected</span>
                            <span className="font-semibold text-coral">{analytics?.applications?.rejected}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-muted-foreground">Pending</span>
                            <span className="font-semibold">{analytics?.applications?.pending}</span>
                        </div>
                        <div className="pt-4 border-t border-border/40">
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Approval Rate</span>
                                <span className="font-semibold text-teal">{analytics?.applications?.approval_rate}%</span>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-border/40 bg-card/80">
                    <CardHeader>
                        <CardTitle className="font-display">Students</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex justify-between">
                            <span className="text-muted-foreground">Total Enrolled</span>
                            <span className="font-semibold">{analytics?.students?.total}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-muted-foreground">Completed Onboarding</span>
                            <span className="font-semibold text-teal">{analytics?.students?.onboarded}</span>
                        </div>
                        <div className="pt-4 border-t border-border/40">
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Onboarding Rate</span>
                                <span className="font-semibold text-teal">{analytics?.students?.onboarding_rate}%</span>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-border/40 bg-card/80">
                    <CardHeader>
                        <CardTitle className="font-display">Submissions</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex justify-between">
                            <span className="text-muted-foreground">Total</span>
                            <span className="font-semibold">{analytics?.submissions?.total}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-muted-foreground">Passed</span>
                            <span className="font-semibold text-teal">{analytics?.submissions?.passed}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-muted-foreground">Pending Review</span>
                            <span className="font-semibold text-amber">{analytics?.submissions?.pending}</span>
                        </div>
                        <div className="pt-4 border-t border-border/40">
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Pass Rate</span>
                                <span className="font-semibold text-teal">{analytics?.submissions?.pass_rate}%</span>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-border/40 bg-card/80">
                    <CardHeader>
                        <CardTitle className="font-display">Certificates</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex justify-between">
                            <span className="text-muted-foreground">Issued</span>
                            <span className="font-semibold text-amber">{analytics?.certificates?.total}</span>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
