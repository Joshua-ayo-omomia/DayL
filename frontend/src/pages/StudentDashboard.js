import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Progress } from '../components/ui/progress';
import { Badge } from '../components/ui/badge';
import { Navbar, Footer } from '../components/Layout';
import { toast } from 'sonner';
import { 
    Play, 
    Lock, 
    CheckCircle2, 
    Clock,
    ArrowRight,
    Award,
    BookOpen,
    Loader2,
    FileText,
    Cpu
} from 'lucide-react';
import { motion } from 'framer-motion';

export default function StudentDashboard() {
    const { user, api } = useAuth();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [track, setTrack] = useState(null);
    const [modules, setModules] = useState([]);
    const [progress, setProgress] = useState([]);
    const [submissions, setSubmissions] = useState([]);
    const [certificate, setCertificate] = useState(null);

    useEffect(() => {
        if (user && !user.onboarding_completed) {
            navigate('/onboarding');
            return;
        }
        fetchData();
    }, [user]);

    const fetchData = async () => {
        try {
            const [tracksRes, modulesRes, progressRes, submissionsRes, certsRes] = await Promise.all([
                api.get('/tracks'),
                api.get('/modules'),
                api.get('/progress'),
                api.get('/submissions'),
                api.get('/certificates')
            ]);

            const activeTrack = tracksRes.data.find(t => t.is_active);
            setTrack(activeTrack);
            
            if (activeTrack) {
                setModules(modulesRes.data.filter(m => m.track_id === activeTrack.id));
            }
            
            setProgress(progressRes.data);
            setSubmissions(submissionsRes.data);
            setCertificate(certsRes.data[0] || null);
        } catch (error) {
            console.error('Failed to fetch data:', error);
            toast.error('Failed to load dashboard data');
        } finally {
            setLoading(false);
        }
    };

    const getModuleStatus = (moduleId) => {
        const prog = progress.find(p => p.module_id === moduleId);
        return prog?.status || 'locked';
    };

    const completedModules = progress.filter(p => p.status === 'completed').length;
    const totalModules = modules.length;
    const progressPercent = totalModules > 0 ? (completedModules / totalModules) * 100 : 0;

    const allModulesCompleted = completedModules === totalModules && totalModules > 0;

    const handleGenerateCertificate = async () => {
        try {
            const response = await api.post('/certificates/generate');
            setCertificate(response.data);
            toast.success('Certificate generated!');
        } catch (error) {
            toast.error(error.response?.data?.detail || 'Failed to generate certificate');
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-teal" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background" data-testid="student-dashboard">
            <Navbar />
            
            <div className="pt-24 pb-16 px-4 md:px-8">
                <div className="max-w-6xl mx-auto">
                    {/* Header */}
                    <div className="mb-8">
                        <h1 className="font-display text-3xl md:text-4xl font-bold mb-2">
                            Welcome back, <span className="text-teal">{user?.name}</span>
                        </h1>
                        <p className="text-muted-foreground">Continue your AI engineering journey</p>
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                        {/* Current Track */}
                        <Card className="border-border/40 bg-card/80 col-span-1 md:col-span-2">
                            <CardContent className="p-6">
                                <div className="flex items-start justify-between mb-4">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-xl bg-teal/20 flex items-center justify-center">
                                            <Cpu className="w-6 h-6 text-teal" />
                                        </div>
                                        <div>
                                            <h3 className="font-display font-semibold text-lg">{track?.name || 'AI Engineer'}</h3>
                                            <p className="text-sm text-muted-foreground">Current Track</p>
                                        </div>
                                    </div>
                                    <Badge variant={allModulesCompleted ? 'default' : 'secondary'} className={allModulesCompleted ? 'bg-teal' : ''}>
                                        {allModulesCompleted ? 'Completed' : 'In Progress'}
                                    </Badge>
                                </div>
                                <div className="space-y-2">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-muted-foreground">Overall Progress</span>
                                        <span className="font-medium">{completedModules} of {totalModules} modules</span>
                                    </div>
                                    <Progress value={progressPercent} className="h-2" />
                                </div>
                            </CardContent>
                        </Card>

                        {/* Quick Stats */}
                        <Card className="border-border/40 bg-card/80">
                            <CardContent className="p-6">
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <FileText className="w-4 h-4 text-amber" />
                                            <span className="text-sm">Submissions</span>
                                        </div>
                                        <span className="font-semibold">{submissions.length}</span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <CheckCircle2 className="w-4 h-4 text-teal" />
                                            <span className="text-sm">Passed</span>
                                        </div>
                                        <span className="font-semibold">{submissions.filter(s => s.status === 'pass').length}</span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <Clock className="w-4 h-4 text-muted-foreground" />
                                            <span className="text-sm">Pending</span>
                                        </div>
                                        <span className="font-semibold">{submissions.filter(s => s.status === 'pending').length}</span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Certificate CTA */}
                    {allModulesCompleted && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="mb-8"
                        >
                            <Card className="border-teal/30 bg-teal/5">
                                <CardContent className="p-6">
                                    <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 rounded-xl bg-amber/20 flex items-center justify-center">
                                                <Award className="w-6 h-6 text-amber" />
                                            </div>
                                            <div>
                                                <h3 className="font-display font-semibold">Congratulations!</h3>
                                                <p className="text-sm text-muted-foreground">You've completed all modules</p>
                                            </div>
                                        </div>
                                        {certificate ? (
                                            <Button asChild className="bg-amber hover:bg-amber-light text-background">
                                                <a href={`${process.env.REACT_APP_BACKEND_URL}${certificate.certificate_url}`} target="_blank" rel="noopener noreferrer">
                                                    <Award className="w-4 h-4 mr-2" />
                                                    View Certificate
                                                </a>
                                            </Button>
                                        ) : (
                                            <Button onClick={handleGenerateCertificate} className="bg-amber hover:bg-amber-light text-background">
                                                <Award className="w-4 h-4 mr-2" />
                                                Generate Certificate
                                            </Button>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>
                    )}

                    {/* Modules */}
                    <div className="mb-8">
                        <h2 className="font-display text-xl font-semibold mb-4">Training Modules</h2>
                        <div className="space-y-4">
                            {modules.map((module, index) => {
                                const status = getModuleStatus(module.id);
                                const isLocked = status === 'locked';
                                const isCompleted = status === 'completed';
                                const isAvailable = status === 'available' || status === 'in_progress';

                                return (
                                    <motion.div
                                        key={module.id}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: index * 0.1 }}
                                    >
                                        <Card className={`border-border/40 transition-colors ${isCompleted ? 'bg-teal/5 border-teal/30' : isLocked ? 'opacity-60' : 'bg-card/80 hover:border-teal/50'}`}>
                                            <CardContent className="p-6">
                                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                                    <div className="flex items-start gap-4">
                                                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${
                                                            isCompleted ? 'bg-teal/20' : isLocked ? 'bg-muted' : 'bg-teal/10'
                                                        }`}>
                                                            {isCompleted ? (
                                                                <CheckCircle2 className="w-6 h-6 text-teal" />
                                                            ) : isLocked ? (
                                                                <Lock className="w-6 h-6 text-muted-foreground" />
                                                            ) : (
                                                                <Play className="w-6 h-6 text-teal" />
                                                            )}
                                                        </div>
                                                        <div>
                                                            <div className="flex items-center gap-2 mb-1">
                                                                <span className="text-xs text-muted-foreground">Module {module.order}</span>
                                                                {module.has_assessment && (
                                                                    <Badge variant="outline" className="text-xs">Has Assessment</Badge>
                                                                )}
                                                            </div>
                                                            <h3 className="font-display font-semibold">{module.title}</h3>
                                                            <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                                                                {module.description}
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-2 ml-16 md:ml-0">
                                                        {isCompleted && (
                                                            <Badge className="bg-teal/20 text-teal border-0">Completed</Badge>
                                                        )}
                                                        {isLocked ? (
                                                            <Badge variant="secondary">Locked</Badge>
                                                        ) : (
                                                            <Button
                                                                asChild
                                                                variant={isCompleted ? 'outline' : 'default'}
                                                                className={!isCompleted ? 'bg-teal hover:bg-teal-light' : ''}
                                                                data-testid={`module-btn-${module.id}`}
                                                            >
                                                                <Link to={`/module/${module.id}`}>
                                                                    {isCompleted ? 'Review' : 'Continue'}
                                                                    <ArrowRight className="w-4 h-4 ml-2" />
                                                                </Link>
                                                            </Button>
                                                        )}
                                                    </div>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    </motion.div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Recent Submissions */}
                    {submissions.length > 0 && (
                        <div>
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="font-display text-xl font-semibold">Recent Submissions</h2>
                                <Button variant="ghost" asChild className="text-teal">
                                    <Link to="/submissions">View All</Link>
                                </Button>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {submissions.slice(0, 4).map((submission) => (
                                    <Card key={submission.id} className="border-border/40 bg-card/80">
                                        <CardContent className="p-4">
                                            <div className="flex items-start justify-between">
                                                <div>
                                                    <h4 className="font-medium">{submission.title}</h4>
                                                    <p className="text-xs text-muted-foreground mt-1">
                                                        {new Date(submission.created_at).toLocaleDateString()}
                                                    </p>
                                                </div>
                                                <Badge variant={
                                                    submission.status === 'pass' ? 'default' :
                                                    submission.status === 'pending' ? 'secondary' :
                                                    submission.status === 'needs_work' ? 'outline' : 'destructive'
                                                } className={submission.status === 'pass' ? 'bg-teal' : ''}>
                                                    {submission.status === 'pass' ? 'Passed' :
                                                     submission.status === 'pending' ? 'Pending' :
                                                     submission.status === 'needs_work' ? 'Needs Work' : 'Failed'}
                                                </Badge>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <Footer />
        </div>
    );
}
