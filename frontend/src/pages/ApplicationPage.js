import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Checkbox } from '../components/ui/checkbox';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card';
import { Navbar, Footer } from '../components/Layout';
import { toast } from 'sonner';
import { Upload, CheckCircle2, ArrowRight, ArrowLeft, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';

const API_URL = `${process.env.REACT_APP_BACKEND_URL}/api`;

const steps = [
    { id: 1, title: 'Personal Info', description: 'Basic details' },
    { id: 2, title: 'Experience', description: 'Your background' },
    { id: 3, title: 'Motivation', description: 'Why Day Learning' },
];

export default function ApplicationPage() {
    const navigate = useNavigate();
    const [currentStep, setCurrentStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    
    const [formData, setFormData] = useState({
        full_name: '',
        email: '',
        phone: '',
        linkedin_url: '',
        brief: '',
        why_join: '',
        experience_years: '',
        skill_area: '',
        commitment: false,
        resume: null
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e) => {
        const file = e.target.files?.[0];
        if (file) {
            const validTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
            if (!validTypes.includes(file.type)) {
                toast.error('Please upload a PDF or DOCX file');
                return;
            }
            if (file.size > 5 * 1024 * 1024) {
                toast.error('File size must be less than 5MB');
                return;
            }
            setFormData(prev => ({ ...prev, resume: file }));
        }
    };

    const validateStep = () => {
        if (currentStep === 1) {
            if (!formData.full_name || !formData.email) {
                toast.error('Please fill in all required fields');
                return false;
            }
            if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
                toast.error('Please enter a valid email address');
                return false;
            }
        }
        if (currentStep === 2) {
            if (!formData.experience_years || !formData.skill_area) {
                toast.error('Please select your experience and skill area');
                return false;
            }
            if (!formData.resume && !formData.brief) {
                toast.error('Please upload a resume or write a brief about yourself');
                return false;
            }
        }
        if (currentStep === 3) {
            if (!formData.why_join) {
                toast.error('Please tell us why you want to join');
                return false;
            }
            if (!formData.commitment) {
                toast.error('Please confirm your commitment to the program');
                return false;
            }
        }
        return true;
    };

    const nextStep = () => {
        if (validateStep()) {
            setCurrentStep(prev => Math.min(prev + 1, 3));
        }
    };

    const prevStep = () => {
        setCurrentStep(prev => Math.max(prev - 1, 1));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateStep()) return;

        setLoading(true);
        try {
            const submitData = new FormData();
            submitData.append('full_name', formData.full_name);
            submitData.append('email', formData.email);
            submitData.append('phone', formData.phone || '');
            submitData.append('linkedin_url', formData.linkedin_url || '');
            submitData.append('brief', formData.brief || '');
            submitData.append('why_join', formData.why_join);
            submitData.append('experience_years', formData.experience_years);
            submitData.append('skill_area', formData.skill_area);
            submitData.append('commitment', formData.commitment.toString());
            
            if (formData.resume) {
                submitData.append('resume', formData.resume);
            }

            await axios.post(`${API_URL}/applications`, submitData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            setSubmitted(true);
            toast.success('Application submitted successfully!');
        } catch (error) {
            const message = error.response?.data?.detail || 'Failed to submit application';
            toast.error(message);
        } finally {
            setLoading(false);
        }
    };

    if (submitted) {
        return (
            <div className="min-h-screen bg-background">
                <Navbar />
                <div className="min-h-screen flex items-center justify-center pt-16 px-4">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="max-w-md w-full text-center"
                    >
                        <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-teal/20 flex items-center justify-center">
                            <CheckCircle2 className="w-10 h-10 text-teal" />
                        </div>
                        <h1 className="font-display text-3xl font-bold mb-4">Application Submitted!</h1>
                        <p className="text-muted-foreground mb-8">
                            Thanks for applying to Day Learning! We'll review your application and get back to you within 48 hours.
                        </p>
                        <Button onClick={() => navigate('/')} variant="outline">
                            Back to Home
                        </Button>
                    </motion.div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background">
            <Navbar />
            
            <div className="pt-24 pb-16 px-4 md:px-8">
                <div className="max-w-2xl mx-auto">
                    {/* Header */}
                    <div className="text-center mb-8">
                        <h1 className="font-display text-3xl md:text-4xl font-bold mb-2">
                            Apply to <span className="text-teal">Day Learning</span>
                        </h1>
                        <p className="text-muted-foreground">
                            AI Engineer Track • First Cohort
                        </p>
                    </div>

                    {/* Progress Steps */}
                    <div className="flex items-center justify-center mb-8">
                        {steps.map((step, index) => (
                            <React.Fragment key={step.id}>
                                <div className="flex flex-col items-center">
                                    <div className={`
                                        w-10 h-10 rounded-full flex items-center justify-center font-medium text-sm
                                        ${currentStep >= step.id 
                                            ? 'bg-teal text-white' 
                                            : 'bg-muted text-muted-foreground'
                                        }
                                    `}>
                                        {currentStep > step.id ? <CheckCircle2 className="w-5 h-5" /> : step.id}
                                    </div>
                                    <span className="text-xs mt-2 text-muted-foreground hidden sm:block">{step.title}</span>
                                </div>
                                {index < steps.length - 1 && (
                                    <div className={`
                                        w-12 md:w-24 h-0.5 mx-2
                                        ${currentStep > step.id ? 'bg-teal' : 'bg-muted'}
                                    `} />
                                )}
                            </React.Fragment>
                        ))}
                    </div>

                    {/* Form Card */}
                    <Card className="border-border/40 bg-card/80">
                        <CardHeader>
                            <CardTitle className="font-display">{steps[currentStep - 1].title}</CardTitle>
                            <CardDescription>{steps[currentStep - 1].description}</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <AnimatePresence mode="wait">
                                    {currentStep === 1 && (
                                        <motion.div
                                            key="step1"
                                            initial={{ opacity: 0, x: 20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            exit={{ opacity: 0, x: -20 }}
                                            className="space-y-4"
                                        >
                                            <div>
                                                <Label htmlFor="full_name">Full Name *</Label>
                                                <Input
                                                    id="full_name"
                                                    name="full_name"
                                                    value={formData.full_name}
                                                    onChange={handleInputChange}
                                                    placeholder="John Doe"
                                                    className="mt-1.5"
                                                    data-testid="input-full-name"
                                                />
                                            </div>
                                            <div>
                                                <Label htmlFor="email">Email Address *</Label>
                                                <Input
                                                    id="email"
                                                    name="email"
                                                    type="email"
                                                    value={formData.email}
                                                    onChange={handleInputChange}
                                                    placeholder="john@example.com"
                                                    className="mt-1.5"
                                                    data-testid="input-email"
                                                />
                                            </div>
                                            <div>
                                                <Label htmlFor="phone">Phone Number (Optional)</Label>
                                                <Input
                                                    id="phone"
                                                    name="phone"
                                                    value={formData.phone}
                                                    onChange={handleInputChange}
                                                    placeholder="+1 234 567 8900"
                                                    className="mt-1.5"
                                                />
                                            </div>
                                            <div>
                                                <Label htmlFor="linkedin_url">LinkedIn URL (Optional)</Label>
                                                <Input
                                                    id="linkedin_url"
                                                    name="linkedin_url"
                                                    value={formData.linkedin_url}
                                                    onChange={handleInputChange}
                                                    placeholder="https://linkedin.com/in/johndoe"
                                                    className="mt-1.5"
                                                />
                                            </div>
                                        </motion.div>
                                    )}

                                    {currentStep === 2 && (
                                        <motion.div
                                            key="step2"
                                            initial={{ opacity: 0, x: 20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            exit={{ opacity: 0, x: -20 }}
                                            className="space-y-4"
                                        >
                                            <div>
                                                <Label>Years of Professional Experience *</Label>
                                                <Select
                                                    value={formData.experience_years}
                                                    onValueChange={(value) => setFormData(prev => ({ ...prev, experience_years: value }))}
                                                >
                                                    <SelectTrigger className="mt-1.5" data-testid="select-experience">
                                                        <SelectValue placeholder="Select experience" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="1-2">1-2 years</SelectItem>
                                                        <SelectItem value="3-5">3-5 years</SelectItem>
                                                        <SelectItem value="6-10">6-10 years</SelectItem>
                                                        <SelectItem value="10+">10+ years</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                            <div>
                                                <Label>Primary Skill Area *</Label>
                                                <Select
                                                    value={formData.skill_area}
                                                    onValueChange={(value) => setFormData(prev => ({ ...prev, skill_area: value }))}
                                                >
                                                    <SelectTrigger className="mt-1.5" data-testid="select-skill">
                                                        <SelectValue placeholder="Select skill area" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="Frontend">Frontend</SelectItem>
                                                        <SelectItem value="Backend">Backend</SelectItem>
                                                        <SelectItem value="Full Stack">Full Stack</SelectItem>
                                                        <SelectItem value="Mobile">Mobile</SelectItem>
                                                        <SelectItem value="DevOps">DevOps</SelectItem>
                                                        <SelectItem value="Data Engineering">Data Engineering</SelectItem>
                                                        <SelectItem value="Other">Other</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                            <div>
                                                <Label htmlFor="resume">Resume/CV (PDF or DOCX)</Label>
                                                <div className="mt-1.5">
                                                    <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-input rounded-lg cursor-pointer hover:border-teal/50 transition-colors">
                                                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                                            <Upload className="w-8 h-8 mb-2 text-muted-foreground" />
                                                            {formData.resume ? (
                                                                <p className="text-sm text-teal">{formData.resume.name}</p>
                                                            ) : (
                                                                <p className="text-sm text-muted-foreground">Click to upload resume</p>
                                                            )}
                                                        </div>
                                                        <input
                                                            type="file"
                                                            className="hidden"
                                                            accept=".pdf,.docx"
                                                            onChange={handleFileChange}
                                                            data-testid="input-resume"
                                                        />
                                                    </label>
                                                </div>
                                            </div>
                                            <div>
                                                <Label htmlFor="brief">Or write about yourself and your experience</Label>
                                                <Textarea
                                                    id="brief"
                                                    name="brief"
                                                    value={formData.brief}
                                                    onChange={handleInputChange}
                                                    placeholder="Tell us about your professional background, projects you've worked on, and technologies you're proficient in..."
                                                    className="mt-1.5 min-h-[120px]"
                                                    data-testid="input-brief"
                                                />
                                                <p className="text-xs text-muted-foreground mt-1">
                                                    Either resume or brief is required
                                                </p>
                                            </div>
                                        </motion.div>
                                    )}

                                    {currentStep === 3 && (
                                        <motion.div
                                            key="step3"
                                            initial={{ opacity: 0, x: 20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            exit={{ opacity: 0, x: -20 }}
                                            className="space-y-4"
                                        >
                                            <div>
                                                <Label htmlFor="why_join">Why do you want to join Day Learning? *</Label>
                                                <Textarea
                                                    id="why_join"
                                                    name="why_join"
                                                    value={formData.why_join}
                                                    onChange={handleInputChange}
                                                    placeholder="What draws you to AI engineering? What do you hope to build? How will this help your career?"
                                                    className="mt-1.5 min-h-[150px]"
                                                    data-testid="input-why-join"
                                                />
                                            </div>
                                            <div className="flex items-start space-x-3 pt-4">
                                                <Checkbox
                                                    id="commitment"
                                                    checked={formData.commitment}
                                                    onCheckedChange={(checked) => setFormData(prev => ({ ...prev, commitment: checked }))}
                                                    data-testid="checkbox-commitment"
                                                />
                                                <div className="space-y-1">
                                                    <Label htmlFor="commitment" className="cursor-pointer">
                                                        I am ready to commit to this program *
                                                    </Label>
                                                    <p className="text-xs text-muted-foreground">
                                                        I understand this requires dedicated time and effort to complete all modules and assessments.
                                                    </p>
                                                </div>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>

                                {/* Navigation */}
                                <div className="flex justify-between pt-4 border-t border-border/40">
                                    {currentStep > 1 ? (
                                        <Button type="button" variant="outline" onClick={prevStep}>
                                            <ArrowLeft className="w-4 h-4 mr-2" />
                                            Previous
                                        </Button>
                                    ) : (
                                        <div />
                                    )}
                                    
                                    {currentStep < 3 ? (
                                        <Button type="button" onClick={nextStep} className="bg-teal hover:bg-teal-light">
                                            Next
                                            <ArrowRight className="w-4 h-4 ml-2" />
                                        </Button>
                                    ) : (
                                        <Button 
                                            type="submit" 
                                            disabled={loading}
                                            className="bg-teal hover:bg-teal-light glow"
                                            data-testid="submit-application"
                                        >
                                            {loading ? (
                                                <>
                                                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                                    Submitting...
                                                </>
                                            ) : (
                                                <>
                                                    Submit Application
                                                    <ArrowRight className="w-4 h-4 ml-2" />
                                                </>
                                            )}
                                        </Button>
                                    )}
                                </div>
                            </form>
                        </CardContent>
                    </Card>
                </div>
            </div>
            
            <Footer />
        </div>
    );
}
