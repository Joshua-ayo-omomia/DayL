import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { Navbar, Footer } from '../components/Layout';
import { 
    ArrowRight, 
    Cpu, 
    Zap, 
    Rocket, 
    Award,
    ChevronRight,
    Users,
    Code,
    BrainCircuit,
    CheckCircle2,
    TrendingUp,
    Megaphone,
    Palette,
    DollarSign,
    Briefcase,
    Sparkles,
    BadgeCheck
} from 'lucide-react';
import { Badge } from '../components/ui/badge';
import { motion } from 'framer-motion';

const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5 }
};

const staggerContainer = {
    animate: {
        transition: {
            staggerChildren: 0.1
        }
    }
};

export default function LandingPage() {
    return (
        <div className="min-h-screen bg-background">
            <Navbar />
            
            {/* Hero Section */}
            <section className="relative min-h-screen flex items-center pt-16 overflow-hidden">
                {/* Background Image with Overlay */}
                <div className="absolute inset-0 z-0">
                    <img 
                        src="https://images.unsplash.com/photo-1633504885008-f8fed592a06a?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjA2OTV8MHwxfHNlYXJjaHwyfHxBZnJpY2FuJTIwd29tYW4lMjBzb2Z0d2FyZSUyMGVuZ2luZWVyJTIwY29kaW5nJTIwbGFwdG9wfGVufDB8fHx8MTc3MDU4NDU5Nnww&ixlib=rb-4.1.0&q=85"
                        alt="African software engineer"
                        className="w-full h-full object-cover opacity-20"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-background via-background/95 to-background/70" />
                    <div className="absolute inset-0 spiral-bg" />
                </div>

                <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-8 py-20 md:py-32">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                        <motion.div 
                            initial="initial"
                            animate="animate"
                            variants={staggerContainer}
                            className="space-y-8"
                        >
                            <motion.div variants={fadeInUp} className="flex flex-wrap gap-3">
                                <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-teal/10 border border-teal/20 text-teal text-sm">
                                    <Zap className="w-4 h-4" />
                                    AI Engineer Track Now Open
                                </span>
                                <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber/10 border border-amber/20 text-amber text-sm font-semibold">
                                    <Sparkles className="w-4 h-4" />
                                    100% FREE
                                </span>
                            </motion.div>
                            
                            <motion.h1 
                                variants={fadeInUp}
                                className="font-display text-4xl md:text-6xl lg:text-7xl font-bold leading-tight"
                            >
                                Become an
                                <span className="block text-teal">AI-Powered Professional</span>
                            </motion.h1>
                            
                            <motion.p 
                                variants={fadeInUp}
                                className="text-lg md:text-xl text-muted-foreground max-w-lg leading-relaxed"
                            >
                                Day Learning transforms experienced professionals into AI-powered experts. 
                                Engineers, Marketers, Finance, Sales, Brand — we have a track for you. 
                                <span className="text-amber font-semibold"> Completely free.</span>
                            </motion.p>
                            
                            <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row gap-4">
                                <Button asChild size="lg" className="bg-teal hover:bg-teal-light text-white glow group">
                                    <Link to="/apply" data-testid="hero-apply-btn">
                                        Apply Now
                                        <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                    </Link>
                                </Button>
                                <Button asChild variant="outline" size="lg" className="border-border hover:border-teal hover:text-teal">
                                    <a href="#how-it-works">
                                        Learn More
                                        <ChevronRight className="ml-1 w-4 h-4" />
                                    </a>
                                </Button>
                            </motion.div>

                            <motion.div variants={fadeInUp} className="flex items-center gap-8 pt-4">
                                <div className="text-center">
                                    <p className="text-2xl font-bold text-teal">6+</p>
                                    <p className="text-xs text-muted-foreground">Tracks</p>
                                </div>
                                <div className="h-8 w-px bg-border" />
                                <div className="text-center">
                                    <p className="text-2xl font-bold text-amber">100%</p>
                                    <p className="text-xs text-muted-foreground">Project-Based</p>
                                </div>
                                <div className="h-8 w-px bg-border" />
                                <div className="text-center">
                                    <p className="text-2xl font-bold text-teal">FREE</p>
                                    <p className="text-xs text-muted-foreground">Forever</p>
                                </div>
                            </motion.div>
                        </motion.div>

                        <motion.div 
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.6, delay: 0.3 }}
                            className="hidden lg:block"
                        >
                            <div className="relative">
                                <div className="absolute -inset-4 bg-teal/20 rounded-2xl blur-2xl" />
                                <Card className="relative veneer-card border-border/40 bg-card/80 backdrop-blur-sm">
                                    <CardContent className="p-8">
                                        <div className="space-y-6">
                                            <div className="flex items-center justify-between">
                                                <h3 className="font-display font-semibold text-lg">Training Tracks</h3>
                                                <Badge className="bg-amber/20 text-amber border-0">FREE</Badge>
                                            </div>
                                            <div className="space-y-3">
                                                {[
                                                    { icon: Code, name: 'AI Engineer', status: 'Open Now', active: true },
                                                    { icon: DollarSign, name: 'AI Finance Pro', status: 'Coming Soon', active: false },
                                                    { icon: Megaphone, name: 'AI Marketing', status: 'Coming Soon', active: false },
                                                    { icon: Palette, name: 'AI Brand', status: 'Coming Soon', active: false },
                                                    { icon: TrendingUp, name: 'AI Sales', status: 'Coming Soon', active: false },
                                                ].map((track, i) => (
                                                    <div key={i} className={`flex items-center justify-between p-2 rounded-lg ${track.active ? 'bg-teal/10' : ''}`}>
                                                        <div className="flex items-center gap-3">
                                                            <track.icon className={`w-5 h-5 ${track.active ? 'text-teal' : 'text-muted-foreground'}`} />
                                                            <span className={`text-sm ${track.active ? 'font-medium' : 'text-muted-foreground'}`}>{track.name}</span>
                                                        </div>
                                                        <span className={`text-xs ${track.active ? 'text-teal' : 'text-muted-foreground'}`}>{track.status}</span>
                                                    </div>
                                                ))}
                                            </div>
                                            <div className="pt-4 border-t border-border/40">
                                                <p className="text-sm text-muted-foreground">
                                                    For experienced professionals ready to <span className="text-amber">level up with AI</span>
                                                </p>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>
                        </motion.div>
                    </div>
                </div>

                {/* Scroll indicator */}
                <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10">
                    <motion.div 
                        animate={{ y: [0, 8, 0] }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="w-6 h-10 rounded-full border-2 border-muted-foreground/30 flex justify-center pt-2"
                    >
                        <div className="w-1.5 h-1.5 rounded-full bg-teal" />
                    </motion.div>
                </div>
            </section>

            {/* Training Tracks Section */}
            <section id="tracks" className="py-24 md:py-32 bg-card/30 relative overflow-hidden">
                <div className="absolute inset-0 spiral-bg opacity-30" />
                <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-8">
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5 }}
                        className="text-center mb-16"
                    >
                        <Badge className="bg-amber/20 text-amber border-0 mb-4">100% FREE TRAINING</Badge>
                        <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
                            Choose Your <span className="text-teal">Track</span>
                        </h2>
                        <p className="text-muted-foreground max-w-2xl mx-auto">
                            Day Learning offers specialized AI training for professionals across multiple fields. 
                            Each track is designed for people who already have experience and want to amplify their skills with AI.
                        </p>
                    </motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[
                            {
                                icon: Code,
                                title: 'AI Engineer',
                                subtitle: 'For Software Engineers',
                                description: 'Build AI-powered applications, master prompt engineering, and deploy production-ready AI solutions.',
                                status: 'open',
                                color: 'teal'
                            },
                            {
                                icon: DollarSign,
                                title: 'AI Finance Professional',
                                subtitle: 'For Finance Experts',
                                description: 'Leverage AI for financial analysis, automated reporting, risk assessment, and data-driven decision making.',
                                status: 'coming',
                                color: 'amber'
                            },
                            {
                                icon: Megaphone,
                                title: 'AI Marketing Engineer',
                                subtitle: 'For Marketers',
                                description: 'Create AI-powered campaigns, automate content creation, and optimize marketing strategies with AI insights.',
                                status: 'coming',
                                color: 'coral'
                            },
                            {
                                icon: Palette,
                                title: 'AI Brand Engineer',
                                subtitle: 'For Brand Strategists',
                                description: 'Use AI for brand development, visual content creation, and maintaining consistent brand identity at scale.',
                                status: 'coming',
                                color: 'amber'
                            },
                            {
                                icon: TrendingUp,
                                title: 'AI Sales Engineer',
                                subtitle: 'For Sales Professionals',
                                description: 'Enhance sales processes with AI, automate lead scoring, personalize outreach, and predict customer behavior.',
                                status: 'coming',
                                color: 'teal'
                            },
                            {
                                icon: Briefcase,
                                title: 'AI Business Analyst',
                                subtitle: 'For Analysts',
                                description: 'Transform data into insights using AI, automate reporting, and drive strategic business decisions.',
                                status: 'coming',
                                color: 'amber'
                            }
                        ].map((track, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: index * 0.1 }}
                            >
                                <Card className={`h-full veneer-card border-border/40 transition-all duration-300 ${
                                    track.status === 'open' 
                                        ? 'hover:border-teal/50 hover:shadow-[0_0_30px_-10px_rgba(42,157,143,0.3)]' 
                                        : 'opacity-80 hover:opacity-100'
                                }`}>
                                    <CardContent className="p-6">
                                        <div className="flex items-start justify-between mb-4">
                                            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                                                track.status === 'open' ? 'bg-teal/20' : 'bg-muted'
                                            }`}>
                                                <track.icon className={`w-6 h-6 ${
                                                    track.status === 'open' ? 'text-teal' : 'text-muted-foreground'
                                                }`} />
                                            </div>
                                            {track.status === 'open' ? (
                                                <Badge className="bg-teal/20 text-teal border-0">
                                                    <BadgeCheck className="w-3 h-3 mr-1" />
                                                    Open Now
                                                </Badge>
                                            ) : (
                                                <Badge variant="secondary">Coming Soon</Badge>
                                            )}
                                        </div>
                                        <h3 className="font-display font-semibold text-lg mb-1">{track.title}</h3>
                                        <p className="text-sm text-muted-foreground mb-3">{track.subtitle}</p>
                                        <p className="text-sm text-muted-foreground leading-relaxed">{track.description}</p>
                                        
                                        {track.status === 'open' && (
                                            <Button asChild className="w-full mt-4 bg-teal hover:bg-teal-light">
                                                <Link to="/apply">
                                                    Apply Now
                                                    <ArrowRight className="w-4 h-4 ml-2" />
                                                </Link>
                                            </Button>
                                        )}
                                    </CardContent>
                                </Card>
                            </motion.div>
                        ))}
                    </div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: 0.6 }}
                        className="mt-12 text-center"
                    >
                        <p className="text-muted-foreground mb-4">
                            More tracks launching soon. All training is <span className="text-amber font-semibold">completely free</span> — 
                            we invest in you, and you invest your time and effort.
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* What You'll Learn Section */}
            <section className="py-24 md:py-32">
                <div className="max-w-7xl mx-auto px-4 md:px-8">
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5 }}
                        className="text-center mb-16"
                    >
                        <Badge variant="outline" className="mb-4">AI Engineer Track</Badge>
                        <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
                            What You'll <span className="text-teal">Learn</span>
                        </h2>
                        <p className="text-muted-foreground max-w-2xl mx-auto">
                            Master the skills that make you invaluable in the AI-powered future of software development.
                        </p>
                    </motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {[
                            {
                                icon: BrainCircuit,
                                title: 'AI-First Thinking',
                                description: 'Understand how to approach problems with AI as your partner, not just a tool.'
                            },
                            {
                                icon: Zap,
                                title: 'Prompt Engineering',
                                description: 'Master the art of communicating with AI models to get production-quality output.'
                            },
                            {
                                icon: Code,
                                title: 'Build AI Apps',
                                description: 'Create real applications powered by AI, from concept to working product.'
                            },
                            {
                                icon: Rocket,
                                title: 'Ship to Production',
                                description: 'Deploy, monitor, and maintain AI applications in real-world environments.'
                            }
                        ].map((item, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: index * 0.1 }}
                            >
                                <Card className="h-full veneer-card border-border/40 hover:border-teal/50 transition-colors group">
                                    <CardContent className="p-6">
                                        <div className="w-12 h-12 rounded-xl bg-teal/10 flex items-center justify-center mb-4 group-hover:bg-teal/20 transition-colors">
                                            <item.icon className="w-6 h-6 text-teal" />
                                        </div>
                                        <h3 className="font-display font-semibold text-lg mb-2">{item.title}</h3>
                                        <p className="text-muted-foreground text-sm leading-relaxed">{item.description}</p>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Who This Is For Section */}
            <section className="py-24 md:py-32 bg-card/30">
                <div className="max-w-7xl mx-auto px-4 md:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5 }}
                        >
                            <h2 className="font-display text-3xl md:text-4xl font-bold mb-6">
                                Who This Is <span className="text-amber">For</span>
                            </h2>
                            <p className="text-muted-foreground mb-8 leading-relaxed">
                                Day Learning is <strong className="text-foreground">not</strong> for beginners. We're looking for 
                                <strong className="text-foreground"> experienced professionals</strong> across all fields who want to 
                                amplify their existing skills with AI.
                            </p>
                            
                            <div className="space-y-4">
                                {[
                                    'Professionals with 1+ years of experience in their field',
                                    'Engineers, marketers, finance experts, sales pros, brand strategists',
                                    'People who have delivered real work, not just completed courses',
                                    'Self-motivated learners ready to commit time and effort',
                                    'Builders who want practical skills, not just certificates'
                                ].map((item, index) => (
                                    <div key={index} className="flex items-start gap-3">
                                        <CheckCircle2 className="w-5 h-5 text-teal mt-0.5 flex-shrink-0" />
                                        <span className="text-sm">{item}</span>
                                    </div>
                                ))}
                            </div>

                            <div className="mt-8 p-4 rounded-lg bg-amber/10 border border-amber/20">
                                <p className="text-sm text-amber">
                                    <strong>Note:</strong> We use AI to screen applications. Vague submissions without evidence of real work will be rejected.
                                </p>
                            </div>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                            className="relative"
                        >
                            <div className="absolute -inset-4 bg-amber/10 rounded-2xl blur-2xl" />
                            <img 
                                src="https://images.unsplash.com/photo-1573167101669-476636b96cea?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjA3MDB8MHwxfHNlYXJjaHwxfHxBZnJpY2FuJTIwdGVjaCUyMHRlYW0lMjBjb2xsYWJvcmF0aW9uJTIwd2hpdGVib2FyZHxlbnwwfHx8fDE3NzA1ODQ2MDF8MA&ixlib=rb-4.1.0&q=85"
                                alt="Tech team collaboration"
                                className="relative rounded-xl w-full object-cover aspect-[4/3]"
                            />
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* How It Works Section */}
            <section id="how-it-works" className="py-24 md:py-32 bg-card/30">
                <div className="max-w-7xl mx-auto px-4 md:px-8">
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5 }}
                        className="text-center mb-16"
                    >
                        <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
                            How It <span className="text-teal">Works</span>
                        </h2>
                        <p className="text-muted-foreground max-w-2xl mx-auto">
                            A straightforward path from application to certification. No fluff, no filler.
                        </p>
                    </motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {[
                            {
                                step: '01',
                                title: 'Apply',
                                description: 'Submit your application with your background and why you want to join.'
                            },
                            {
                                step: '02',
                                title: 'Get Screened',
                                description: 'Our AI reviews your application for real experience and commitment.'
                            },
                            {
                                step: '03',
                                title: 'Learn',
                                description: 'Complete video-based modules and build real AI-powered projects.'
                            },
                            {
                                step: '04',
                                title: 'Get Certified',
                                description: 'Pass your assessments and receive your Day Learning certificate.'
                            }
                        ].map((item, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: index * 0.1 }}
                                className="relative"
                            >
                                <Card className="h-full border-border/40 bg-background">
                                    <CardContent className="p-6">
                                        <span className="font-display text-5xl font-bold text-teal/20">{item.step}</span>
                                        <h3 className="font-display font-semibold text-lg mt-2 mb-2">{item.title}</h3>
                                        <p className="text-muted-foreground text-sm leading-relaxed">{item.description}</p>
                                    </CardContent>
                                </Card>
                                {index < 3 && (
                                    <div className="hidden lg:block absolute top-1/2 -right-3 transform -translate-y-1/2 z-10">
                                        <ChevronRight className="w-6 h-6 text-teal/40" />
                                    </div>
                                )}
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* About Section */}
            <section className="py-24 md:py-32">
                <div className="max-w-7xl mx-auto px-4 md:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5 }}
                            className="order-2 lg:order-1"
                        >
                            <div className="relative">
                                <div className="absolute -inset-4 bg-teal/10 rounded-2xl blur-2xl" />
                                <img 
                                    src="https://images.unsplash.com/photo-1643324896137-f0928e76202a?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODB8MHwxfHNlYXJjaHwzfHxhYnN0cmFjdCUyMGRpZ2l0YWwlMjBjcmFmdHNtYW5zaGlwJTIwdGV4dHVyZSUyMGRhcmt8ZW58MHx8fHwxNzcwNTg0NTc5fDA&ixlib=rb-4.1.0&q=85"
                                    alt="Abstract craftsmanship"
                                    className="relative rounded-xl w-full object-cover aspect-[4/3]"
                                />
                            </div>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                            className="order-1 lg:order-2"
                        >
                            <h2 className="font-display text-3xl md:text-4xl font-bold mb-6">
                                About <span className="text-teal">Day Learning</span>
                            </h2>
                            <div className="space-y-4 text-muted-foreground leading-relaxed">
                                <p>
                                    Day Learning is named after <strong className="text-foreground">Thomas Day</strong> — 
                                    a Black furniture maker during the slave trade era whose craftsmanship was so exceptional 
                                    he became the biggest employer of labor in North Carolina.
                                </p>
                                <p>
                                    That quality standard is what we want our graduates to carry. We don't just teach AI — 
                                    we train people to build with the kind of excellence that stands out.
                                </p>
                                <p>
                                    Day Learning is part of <strong className="text-foreground">THCO</strong> (Talentco Holding Company). 
                                    Our graduates feed directly into THCO's talent solutions and build divisions, 
                                    creating real pathways to employment.
                                </p>
                            </div>

                            <div className="mt-8 flex items-center gap-4">
                                <div className="flex-1 h-px bg-border" />
                                <span className="text-sm text-muted-foreground italic">Human insight. Amplified.</span>
                                <div className="flex-1 h-px bg-border" />
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-24 md:py-32 bg-card/50 relative overflow-hidden">
                <div className="absolute inset-0 spiral-bg opacity-50" />
                <div className="relative z-10 max-w-3xl mx-auto px-4 md:px-8 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5 }}
                    >
                        <h2 className="font-display text-3xl md:text-5xl font-bold mb-6">
                            Ready to Build Your <span className="text-teal">AI Future</span>?
                        </h2>
                        <p className="text-muted-foreground text-lg mb-8 max-w-xl mx-auto">
                            Join the first cohort of AI Engineers. Limited spots available for qualified applicants.
                        </p>
                        <Button asChild size="lg" className="bg-teal hover:bg-teal-light text-white glow group">
                            <Link to="/apply" data-testid="cta-apply-btn">
                                Start Your Application
                                <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                            </Link>
                        </Button>
                    </motion.div>
                </div>
            </section>

            <Footer />
        </div>
    );
}
