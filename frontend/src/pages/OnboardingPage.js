import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { Progress } from '../components/ui/progress';
import { Checkbox } from '../components/ui/checkbox';
import { Navbar } from '../components/Layout';
import { toast } from 'sonner';
import { 
    CheckCircle2, 
    Circle, 
    BookOpen, 
    Settings, 
    Users, 
    MessageSquare,
    ArrowRight,
    Loader2,
    ChevronDown,
    ChevronUp
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const onboardingItems = [
    {
        key: 'code_of_conduct',
        title: 'Read the Code of Conduct',
        icon: BookOpen,
        content: `
            <h3 class="font-semibold text-lg mb-4">Day Learning Code of Conduct</h3>
            <p class="mb-4">As a Day Learning participant, you agree to:</p>
            <ul class="space-y-2 list-disc list-inside text-muted-foreground">
                <li><strong class="text-foreground">Be Respectful:</strong> Treat fellow learners, mentors, and staff with respect and professionalism.</li>
                <li><strong class="text-foreground">Act with Integrity:</strong> Submit only your own work. Plagiarism or cheating will result in removal.</li>
                <li><strong class="text-foreground">Stay Committed:</strong> Complete modules on time and communicate if you're facing challenges.</li>
                <li><strong class="text-foreground">Give Back:</strong> Support your fellow learners and contribute to the community.</li>
                <li><strong class="text-foreground">Build Real Things:</strong> Focus on practical, working solutions over theoretical exercises.</li>
            </ul>
            <p class="mt-4 text-sm text-muted-foreground">Violations may result in removal from the program without certification.</p>
        `
    },
    {
        key: 'how_it_works',
        title: 'Read "How This Program Works"',
        icon: Settings,
        content: `
            <h3 class="font-semibold text-lg mb-4">How Day Learning Works</h3>
            <div class="space-y-4 text-muted-foreground">
                <div>
                    <h4 class="font-medium text-foreground">1. Video-Based Learning</h4>
                    <p>Each module includes video lessons hosted on YouTube. Watch at your own pace, but complete them in order.</p>
                </div>
                <div>
                    <h4 class="font-medium text-foreground">2. Project-Based Assessments</h4>
                    <p>At key checkpoints, you'll build real projects. Submit your GitHub repos and live links for review.</p>
                </div>
                <div>
                    <h4 class="font-medium text-foreground">3. Human Review</h4>
                    <p>Our team reviews every submission. You'll get feedback and can resubmit if needed.</p>
                </div>
                <div>
                    <h4 class="font-medium text-foreground">4. Certification</h4>
                    <p>Complete all modules and pass all assessments to receive your Day Learning certificate.</p>
                </div>
            </div>
        `
    },
    {
        key: 'dev_environment',
        title: 'Set Up Your Development Environment',
        icon: Settings,
        content: `
            <h3 class="font-semibold text-lg mb-4">Development Environment Setup</h3>
            <p class="mb-4 text-muted-foreground">Ensure you have the following installed and ready:</p>
            <ul class="space-y-3">
                <li class="flex items-start gap-2">
                    <span class="text-teal">✓</span>
                    <div>
                        <strong>Code Editor</strong>
                        <p class="text-sm text-muted-foreground">VS Code recommended with relevant extensions</p>
                    </div>
                </li>
                <li class="flex items-start gap-2">
                    <span class="text-teal">✓</span>
                    <div>
                        <strong>Git & GitHub</strong>
                        <p class="text-sm text-muted-foreground">For version control and project submissions</p>
                    </div>
                </li>
                <li class="flex items-start gap-2">
                    <span class="text-teal">✓</span>
                    <div>
                        <strong>Node.js & Python</strong>
                        <p class="text-sm text-muted-foreground">Latest LTS versions</p>
                    </div>
                </li>
                <li class="flex items-start gap-2">
                    <span class="text-teal">✓</span>
                    <div>
                        <strong>API Keys</strong>
                        <p class="text-sm text-muted-foreground">You may need OpenAI/Anthropic API keys for projects</p>
                    </div>
                </li>
            </ul>
        `
    },
    {
        key: 'join_community',
        title: 'Join the Day Learning Community',
        icon: Users,
        content: `
            <h3 class="font-semibold text-lg mb-4">Join Our Community</h3>
            <p class="mb-4 text-muted-foreground">Connect with fellow learners and get support:</p>
            <div class="space-y-4">
                <div class="p-4 rounded-lg bg-muted/50">
                    <h4 class="font-medium flex items-center gap-2">
                        <MessageSquare class="w-4 h-4 text-teal" />
                        Community Platform
                    </h4>
                    <p class="text-sm text-muted-foreground mt-1">Join our community channel (link will be provided via email)</p>
                </div>
            </div>
            <p class="mt-4 text-sm text-muted-foreground">The community is where you'll find peer support, ask questions, and collaborate on challenges.</p>
        `
    },
    {
        key: 'confirm_commitment',
        title: 'Confirm Your Commitment',
        icon: CheckCircle2,
        content: `
            <h3 class="font-semibold text-lg mb-4">Confirm Your Commitment</h3>
            <p class="mb-4 text-muted-foreground">By checking this item, you confirm:</p>
            <ul class="space-y-2 text-muted-foreground">
                <li class="flex items-start gap-2">
                    <span class="text-teal">•</span>
                    I will dedicate at least <strong class="text-foreground">5-10 hours per week</strong> to this program
                </li>
                <li class="flex items-start gap-2">
                    <span class="text-teal">•</span>
                    I will complete all modules and assessments to the best of my ability
                </li>
                <li class="flex items-start gap-2">
                    <span class="text-teal">•</span>
                    I understand this is a commitment and will communicate if I face challenges
                </li>
                <li class="flex items-start gap-2">
                    <span class="text-teal">•</span>
                    I am ready to build real, working projects
                </li>
            </ul>
        `
    }
];

export default function OnboardingPage() {
    const { user, api, refreshUser } = useAuth();
    const navigate = useNavigate();
    const [items, setItems] = useState({});
    const [expandedItem, setExpandedItem] = useState(null);
    const [loading, setLoading] = useState({});

    useEffect(() => {
        if (user?.onboarding_items) {
            setItems(user.onboarding_items);
        }
    }, [user]);

    useEffect(() => {
        if (user?.onboarding_completed) {
            navigate('/dashboard');
        }
    }, [user, navigate]);

    const completedCount = Object.values(items).filter(Boolean).length;
    const progress = (completedCount / onboardingItems.length) * 100;

    const handleItemComplete = async (key) => {
        if (items[key]) return;
        
        setLoading(prev => ({ ...prev, [key]: true }));
        try {
            await api.put(`/onboarding/item/${key}`);
            setItems(prev => ({ ...prev, [key]: true }));
            await refreshUser();
            toast.success('Item completed!');
            
            const currentIndex = onboardingItems.findIndex(item => item.key === key);
            if (currentIndex < onboardingItems.length - 1) {
                setExpandedItem(onboardingItems[currentIndex + 1].key);
            }
        } catch (error) {
            toast.error('Failed to update progress');
        } finally {
            setLoading(prev => ({ ...prev, [key]: false }));
        }
    };

    const allCompleted = completedCount === onboardingItems.length;

    return (
        <div className="min-h-screen bg-background">
            <Navbar />
            
            <div className="pt-24 pb-16 px-4 md:px-8">
                <div className="max-w-2xl mx-auto">
                    {/* Header */}
                    <div className="text-center mb-8">
                        <h1 className="font-display text-3xl md:text-4xl font-bold mb-2">
                            Welcome to <span className="text-teal">Day Learning</span>
                        </h1>
                        <p className="text-muted-foreground">
                            Complete these steps before starting your training
                        </p>
                    </div>

                    {/* Progress */}
                    <Card className="mb-8 border-border/40 bg-card/80">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-sm text-muted-foreground">Progress</span>
                                <span className="text-sm font-medium">{completedCount} of {onboardingItems.length}</span>
                            </div>
                            <Progress value={progress} className="h-2" />
                        </CardContent>
                    </Card>

                    {/* Checklist */}
                    <div className="space-y-4">
                        {onboardingItems.map((item, index) => {
                            const isCompleted = items[item.key];
                            const isExpanded = expandedItem === item.key;
                            const Icon = item.icon;

                            return (
                                <Card 
                                    key={item.key} 
                                    className={`border-border/40 transition-colors ${isCompleted ? 'bg-teal/5 border-teal/30' : 'bg-card/80'}`}
                                >
                                    <CardContent className="p-0">
                                        <button
                                            onClick={() => setExpandedItem(isExpanded ? null : item.key)}
                                            className="w-full p-4 flex items-center justify-between text-left"
                                            data-testid={`onboarding-item-${item.key}`}
                                        >
                                            <div className="flex items-center gap-4">
                                                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${isCompleted ? 'bg-teal/20' : 'bg-muted'}`}>
                                                    {isCompleted ? (
                                                        <CheckCircle2 className="w-5 h-5 text-teal" />
                                                    ) : (
                                                        <Icon className="w-5 h-5 text-muted-foreground" />
                                                    )}
                                                </div>
                                                <div>
                                                    <span className={`font-medium ${isCompleted ? 'text-teal' : ''}`}>
                                                        {item.title}
                                                    </span>
                                                </div>
                                            </div>
                                            {isExpanded ? (
                                                <ChevronUp className="w-5 h-5 text-muted-foreground" />
                                            ) : (
                                                <ChevronDown className="w-5 h-5 text-muted-foreground" />
                                            )}
                                        </button>

                                        <AnimatePresence>
                                            {isExpanded && (
                                                <motion.div
                                                    initial={{ height: 0, opacity: 0 }}
                                                    animate={{ height: 'auto', opacity: 1 }}
                                                    exit={{ height: 0, opacity: 0 }}
                                                    transition={{ duration: 0.2 }}
                                                    className="overflow-hidden"
                                                >
                                                    <div className="px-4 pb-4 border-t border-border/40 pt-4">
                                                        <div 
                                                            className="prose prose-sm prose-invert max-w-none"
                                                            dangerouslySetInnerHTML={{ __html: item.content }}
                                                        />
                                                        
                                                        {!isCompleted && (
                                                            <div className="mt-6 flex items-center gap-3">
                                                                <Checkbox
                                                                    checked={isCompleted}
                                                                    disabled={loading[item.key]}
                                                                    onCheckedChange={() => handleItemComplete(item.key)}
                                                                    data-testid={`onboarding-checkbox-${item.key}`}
                                                                />
                                                                <span className="text-sm">
                                                                    I have completed this step
                                                                </span>
                                                                {loading[item.key] && (
                                                                    <Loader2 className="w-4 h-4 animate-spin text-teal" />
                                                                )}
                                                            </div>
                                                        )}
                                                    </div>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </CardContent>
                                </Card>
                            );
                        })}
                    </div>

                    {/* Start Learning Button */}
                    {allCompleted && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="mt-8 text-center"
                        >
                            <Button
                                onClick={() => navigate('/dashboard')}
                                size="lg"
                                className="bg-teal hover:bg-teal-light glow"
                                data-testid="start-learning-btn"
                            >
                                Start Learning
                                <ArrowRight className="w-4 h-4 ml-2" />
                            </Button>
                        </motion.div>
                    )}
                </div>
            </div>
        </div>
    );
}
