import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '../components/ui/dialog';
import { Navbar, Footer } from '../components/Layout';
import { toast } from 'sonner';
import ProtectedVideoPlayer from '../components/ProtectedVideoPlayer';
import { 
    Play, 
    CheckCircle2, 
    ArrowLeft,
    ArrowRight,
    ExternalLink,
    FileText,
    Upload,
    Loader2,
    BookOpen,
    ShieldCheck
} from 'lucide-react';
import { motion } from 'framer-motion';

export default function ModulePage() {
    const { moduleId } = useParams();
    const { api } = useAuth();
    const navigate = useNavigate();
    
    const [loading, setLoading] = useState(true);
    const [module, setModule] = useState(null);
    const [progress, setProgress] = useState(null);
    const [submission, setSubmission] = useState(null);
    const [submissionDialogOpen, setSubmissionDialogOpen] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [completing, setCompleting] = useState(false);
    
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        project_url: '',
        notes: '',
        screenshots: []
    });

    useEffect(() => {
        fetchData();
    }, [moduleId]);

    const fetchData = async () => {
        try {
            const [moduleRes, progressRes, submissionsRes] = await Promise.all([
                api.get(`/modules/${moduleId}`),
                api.get('/progress'),
                api.get('/submissions')
            ]);

            setModule(moduleRes.data);
            
            const moduleProgress = progressRes.data.find(p => p.module_id === moduleId);
            setProgress(moduleProgress);
            
            if (moduleProgress?.status === 'locked') {
                toast.error('This module is locked');
                navigate('/dashboard');
                return;
            }
            
            // Mark as in progress if available
            if (moduleProgress?.status === 'available') {
                await api.post(`/progress/${moduleId}/start`);
            }
            
            const moduleSubmission = submissionsRes.data.find(s => s.module_id === moduleId);
            setSubmission(moduleSubmission);
            
            setFormData(prev => ({
                ...prev,
                title: `${moduleRes.data.title} - Project Submission`
            }));
        } catch (error) {
            console.error('Failed to fetch module:', error);
            toast.error('Failed to load module');
            navigate('/dashboard');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmitProject = async (e) => {
        e.preventDefault();
        
        if (!formData.title || !formData.description || !formData.project_url) {
            toast.error('Please fill in all required fields');
            return;
        }

        setSubmitting(true);
        try {
            const submitData = new FormData();
            submitData.append('module_id', moduleId);
            submitData.append('title', formData.title);
            submitData.append('description', formData.description);
            submitData.append('project_url', formData.project_url);
            submitData.append('notes', formData.notes || '');
            
            for (const file of formData.screenshots) {
                submitData.append('screenshots', file);
            }

            await api.post('/submissions', submitData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            toast.success('Project submitted successfully!');
            setSubmissionDialogOpen(false);
            fetchData();
        } catch (error) {
            toast.error(error.response?.data?.detail || 'Failed to submit project');
        } finally {
            setSubmitting(false);
        }
    };

    const handleCompleteModule = async () => {
        if (module?.has_assessment && (!submission || submission.status !== 'pass')) {
            toast.error('You need to pass the assessment before completing this module');
            return;
        }

        setCompleting(true);
        try {
            await api.post(`/progress/${moduleId}/complete`);
            toast.success('Module completed!');
            navigate('/dashboard');
        } catch (error) {
            toast.error(error.response?.data?.detail || 'Failed to complete module');
        } finally {
            setCompleting(false);
        }
    };

    const handleFileChange = (e) => {
        const files = Array.from(e.target.files || []);
        if (files.length > 3) {
            toast.error('Maximum 3 screenshots allowed');
            return;
        }
        setFormData(prev => ({ ...prev, screenshots: files }));
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-teal" />
            </div>
        );
    }

    const canComplete = !module?.has_assessment || (submission && submission.status === 'pass');
    const isCompleted = progress?.status === 'completed';

    return (
        <div className="min-h-screen bg-background">
            <Navbar />
            
            <div className="pt-24 pb-16 px-4 md:px-8">
                <div className="max-w-4xl mx-auto">
                    {/* Back Button */}
                    <Button variant="ghost" asChild className="mb-6">
                        <Link to="/dashboard">
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Back to Dashboard
                        </Link>
                    </Button>

                    {/* Module Header */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mb-8"
                    >
                        <div className="flex items-center gap-2 mb-2">
                            <span className="text-sm text-muted-foreground">Module {module?.order}</span>
                            {isCompleted && (
                                <Badge className="bg-teal/20 text-teal border-0">Completed</Badge>
                            )}
                            {module?.has_assessment && (
                                <Badge variant="outline">Has Assessment</Badge>
                            )}
                        </div>
                        <h1 className="font-display text-3xl md:text-4xl font-bold mb-4">{module?.title}</h1>
                        <p className="text-muted-foreground">{module?.description}</p>
                    </motion.div>

                    {/* Video Player */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="mb-8"
                    >
                        <div className="mb-2 flex items-center gap-2 text-xs text-muted-foreground">
                            <ShieldCheck className="w-4 h-4 text-teal" />
                            <span>Protected content - Screen recording is disabled</span>
                        </div>
                        {module?.video_url ? (
                            <ProtectedVideoPlayer 
                                videoUrl={module.video_url} 
                                moduleTitle={module.title}
                            />
                        ) : (
                            <Card className="border-border/40 bg-card/80 overflow-hidden">
                                <div className="aspect-video bg-black flex items-center justify-center">
                                    <Play className="w-16 h-16 text-muted-foreground" />
                                </div>
                            </Card>
                        )}
                    </motion.div>

                    {/* Resources */}
                    {module?.resources?.length > 0 && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="mb-8"
                        >
                            <h2 className="font-display text-xl font-semibold mb-4 flex items-center gap-2">
                                <BookOpen className="w-5 h-5 text-teal" />
                                Resources
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {module.resources.map((resource, index) => (
                                    <Card key={index} className="border-border/40 bg-card/80 hover:border-teal/50 transition-colors">
                                        <CardContent className="p-4">
                                            <a 
                                                href={resource.url} 
                                                target="_blank" 
                                                rel="noopener noreferrer"
                                                className="flex items-center justify-between group"
                                            >
                                                <div className="flex items-center gap-3">
                                                    <FileText className="w-5 h-5 text-teal" />
                                                    <span className="group-hover:text-teal transition-colors">{resource.title}</span>
                                                </div>
                                                <ExternalLink className="w-4 h-4 text-muted-foreground group-hover:text-teal transition-colors" />
                                            </a>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        </motion.div>
                    )}

                    {/* Assessment Section */}
                    {module?.has_assessment && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                            className="mb-8"
                        >
                            <Card className="border-amber/30 bg-amber/5">
                                <CardHeader>
                                    <CardTitle className="font-display flex items-center gap-2">
                                        <FileText className="w-5 h-5 text-amber" />
                                        Assessment Required
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-muted-foreground mb-4">{module.assessment_prompt}</p>
                                    
                                    {submission ? (
                                        <div className="p-4 rounded-lg bg-background/50">
                                            <div className="flex items-center justify-between mb-2">
                                                <span className="font-medium">Your Submission</span>
                                                <Badge variant={
                                                    submission.status === 'pass' ? 'default' :
                                                    submission.status === 'pending' ? 'secondary' :
                                                    submission.status === 'needs_work' ? 'outline' : 'destructive'
                                                } className={submission.status === 'pass' ? 'bg-teal' : ''}>
                                                    {submission.status === 'pass' ? 'Passed' :
                                                     submission.status === 'pending' ? 'Pending Review' :
                                                     submission.status === 'needs_work' ? 'Needs Work' : 'Failed'}
                                                </Badge>
                                            </div>
                                            <p className="text-sm text-muted-foreground">{submission.title}</p>
                                            <a 
                                                href={submission.project_url} 
                                                target="_blank" 
                                                rel="noopener noreferrer"
                                                className="text-sm text-teal hover:underline flex items-center gap-1 mt-2"
                                            >
                                                View Project <ExternalLink className="w-3 h-3" />
                                            </a>
                                            {submission.admin_feedback && (
                                                <div className="mt-4 p-3 rounded bg-muted/50">
                                                    <p className="text-xs text-muted-foreground mb-1">Feedback:</p>
                                                    <p className="text-sm">{submission.admin_feedback}</p>
                                                </div>
                                            )}
                                            {(submission.status === 'needs_work' || submission.status === 'fail') && (
                                                <Dialog open={submissionDialogOpen} onOpenChange={setSubmissionDialogOpen}>
                                                    <DialogTrigger asChild>
                                                        <Button className="mt-4 bg-amber hover:bg-amber-light text-background">
                                                            Resubmit Project
                                                        </Button>
                                                    </DialogTrigger>
                                                    <DialogContent className="max-w-lg">
                                                        <DialogHeader>
                                                            <DialogTitle className="font-display">Submit Your Project</DialogTitle>
                                                        </DialogHeader>
                                                        <form onSubmit={handleSubmitProject} className="space-y-4">
                                                            <div>
                                                                <Label>Project Title *</Label>
                                                                <Input
                                                                    value={formData.title}
                                                                    onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                                                                    className="mt-1.5"
                                                                    data-testid="submission-title"
                                                                />
                                                            </div>
                                                            <div>
                                                                <Label>Description *</Label>
                                                                <Textarea
                                                                    value={formData.description}
                                                                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                                                                    placeholder="Describe what you built and how it works..."
                                                                    className="mt-1.5 min-h-[100px]"
                                                                    data-testid="submission-description"
                                                                />
                                                            </div>
                                                            <div>
                                                                <Label>Project URL (GitHub/Live Link) *</Label>
                                                                <Input
                                                                    value={formData.project_url}
                                                                    onChange={(e) => setFormData(prev => ({ ...prev, project_url: e.target.value }))}
                                                                    placeholder="https://github.com/..."
                                                                    className="mt-1.5"
                                                                    data-testid="submission-url"
                                                                />
                                                            </div>
                                                            <div>
                                                                <Label>Screenshots (Optional, max 3)</Label>
                                                                <div className="mt-1.5">
                                                                    <label className="flex items-center justify-center w-full h-20 border-2 border-dashed border-input rounded-lg cursor-pointer hover:border-teal/50 transition-colors">
                                                                        <div className="flex items-center gap-2">
                                                                            <Upload className="w-5 h-5 text-muted-foreground" />
                                                                            <span className="text-sm text-muted-foreground">
                                                                                {formData.screenshots.length > 0 
                                                                                    ? `${formData.screenshots.length} file(s) selected`
                                                                                    : 'Upload screenshots'
                                                                                }
                                                                            </span>
                                                                        </div>
                                                                        <input
                                                                            type="file"
                                                                            className="hidden"
                                                                            accept="image/*"
                                                                            multiple
                                                                            onChange={handleFileChange}
                                                                        />
                                                                    </label>
                                                                </div>
                                                            </div>
                                                            <div>
                                                                <Label>Additional Notes</Label>
                                                                <Textarea
                                                                    value={formData.notes}
                                                                    onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                                                                    placeholder="Anything else you want us to know..."
                                                                    className="mt-1.5"
                                                                />
                                                            </div>
                                                            <DialogFooter>
                                                                <Button type="submit" disabled={submitting} className="bg-teal hover:bg-teal-light">
                                                                    {submitting ? (
                                                                        <Loader2 className="w-4 h-4 animate-spin" />
                                                                    ) : (
                                                                        'Submit Project'
                                                                    )}
                                                                </Button>
                                                            </DialogFooter>
                                                        </form>
                                                    </DialogContent>
                                                </Dialog>
                                            )}
                                        </div>
                                    ) : (
                                        <Dialog open={submissionDialogOpen} onOpenChange={setSubmissionDialogOpen}>
                                            <DialogTrigger asChild>
                                                <Button className="bg-amber hover:bg-amber-light text-background" data-testid="submit-assessment-btn">
                                                    Submit Your Project
                                                </Button>
                                            </DialogTrigger>
                                            <DialogContent className="max-w-lg">
                                                <DialogHeader>
                                                    <DialogTitle className="font-display">Submit Your Project</DialogTitle>
                                                </DialogHeader>
                                                <form onSubmit={handleSubmitProject} className="space-y-4">
                                                    <div>
                                                        <Label>Project Title *</Label>
                                                        <Input
                                                            value={formData.title}
                                                            onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                                                            className="mt-1.5"
                                                            data-testid="submission-title"
                                                        />
                                                    </div>
                                                    <div>
                                                        <Label>Description *</Label>
                                                        <Textarea
                                                            value={formData.description}
                                                            onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                                                            placeholder="Describe what you built and how it works..."
                                                            className="mt-1.5 min-h-[100px]"
                                                            data-testid="submission-description"
                                                        />
                                                    </div>
                                                    <div>
                                                        <Label>Project URL (GitHub/Live Link) *</Label>
                                                        <Input
                                                            value={formData.project_url}
                                                            onChange={(e) => setFormData(prev => ({ ...prev, project_url: e.target.value }))}
                                                            placeholder="https://github.com/..."
                                                            className="mt-1.5"
                                                            data-testid="submission-url"
                                                        />
                                                    </div>
                                                    <div>
                                                        <Label>Screenshots (Optional, max 3)</Label>
                                                        <div className="mt-1.5">
                                                            <label className="flex items-center justify-center w-full h-20 border-2 border-dashed border-input rounded-lg cursor-pointer hover:border-teal/50 transition-colors">
                                                                <div className="flex items-center gap-2">
                                                                    <Upload className="w-5 h-5 text-muted-foreground" />
                                                                    <span className="text-sm text-muted-foreground">
                                                                        {formData.screenshots.length > 0 
                                                                            ? `${formData.screenshots.length} file(s) selected`
                                                                            : 'Upload screenshots'
                                                                        }
                                                                    </span>
                                                                </div>
                                                                <input
                                                                    type="file"
                                                                    className="hidden"
                                                                    accept="image/*"
                                                                    multiple
                                                                    onChange={handleFileChange}
                                                                />
                                                            </label>
                                                        </div>
                                                    </div>
                                                    <div>
                                                        <Label>Additional Notes</Label>
                                                        <Textarea
                                                            value={formData.notes}
                                                            onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                                                            placeholder="Anything else you want us to know..."
                                                            className="mt-1.5"
                                                        />
                                                    </div>
                                                    <DialogFooter>
                                                        <Button type="submit" disabled={submitting} className="bg-teal hover:bg-teal-light">
                                                            {submitting ? (
                                                                <Loader2 className="w-4 h-4 animate-spin" />
                                                            ) : (
                                                                'Submit Project'
                                                            )}
                                                        </Button>
                                                    </DialogFooter>
                                                </form>
                                            </DialogContent>
                                        </Dialog>
                                    )}
                                </CardContent>
                            </Card>
                        </motion.div>
                    )}

                    {/* Complete Module */}
                    {!isCompleted && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4 }}
                            className="flex justify-end"
                        >
                            <Button
                                onClick={handleCompleteModule}
                                disabled={!canComplete || completing}
                                className="bg-teal hover:bg-teal-light glow"
                                data-testid="complete-module-btn"
                            >
                                {completing ? (
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                ) : (
                                    <>
                                        <CheckCircle2 className="w-4 h-4 mr-2" />
                                        {canComplete ? 'Mark as Complete' : 'Complete Assessment First'}
                                    </>
                                )}
                            </Button>
                        </motion.div>
                    )}
                </div>
            </div>

            <Footer />
        </div>
    );
}
