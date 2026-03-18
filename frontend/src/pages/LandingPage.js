import React, { useRef, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { motion, useInView, useScroll, useTransform } from "framer-motion";
import { ArrowRight, ChevronRight, Cpu, Users, Zap, TrendingUp, Target, Layers, Shield, MessageSquare, Video, ClipboardCheck, UserCheck } from "lucide-react";

/* ── animated counter ── */
function Counter({ value, suffix = "", prefix = "" }) {
    const ref = useRef(null);
    const inView = useInView(ref, { once: true, margin: "-50px" });
    const [count, setCount] = useState(0);

    useEffect(() => {
        if (!inView) return;
        let start = 0;
        const end = typeof value === "number" ? value : parseInt(value, 10) || 0;
        if (end === 0) return;
        const duration = 1800;
        const step = Math.max(1, Math.floor(end / (duration / 16)));
        const timer = setInterval(() => {
            start += step;
            if (start >= end) { setCount(end); clearInterval(timer); }
            else setCount(start);
        }, 16);
        return () => clearInterval(timer);
    }, [inView, value]);

    return <span ref={ref}>{prefix}{count.toLocaleString()}{suffix}</span>;
}

/* ── section wrapper with scroll reveal ── */
function Reveal({ children, delay = 0, className = "" }) {
    const ref = useRef(null);
    const inView = useInView(ref, { once: true, margin: "-80px" });
    return (
        <motion.div ref={ref} className={className}
            initial={{ opacity: 0, y: 40 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}>
            {children}
        </motion.div>
    );
}

export default function LandingPage() {
    const { user, isEnterprise } = useAuth();
    const heroRef = useRef(null);
    const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
    const heroY = useTransform(scrollYProgress, [0, 1], [0, 150]);
    const heroOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

    return (
        <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
            {/* ── Navbar ── */}
            <nav className="fixed top-0 w-full z-50 glass border-b border-white/5">
                <div className="max-w-7xl mx-auto px-4 md:px-8 flex items-center justify-between h-16">
                    <Link to="/" className="text-xl font-bold text-white tracking-tight" data-testid="nav-logo">
                        Realloc
                    </Link>
                    <div className="flex items-center gap-4">
                        {user ? (
                            <Link to={isEnterprise ? "/enterprise" : "/learn"}
                                className="bg-white text-black px-5 py-2 text-sm font-semibold hover:bg-gray-300 transition-all duration-200" data-testid="nav-dashboard-link">
                                Dashboard
                            </Link>
                        ) : (
                            <>
                                <Link to="/login" className="text-sm text-gray-400 hover:text-white transition-colors duration-200" data-testid="nav-login">Login</Link>
                                <Link to="/login" className="bg-white text-black px-5 py-2 text-sm font-semibold hover:bg-gray-300 transition-all duration-200" data-testid="nav-request-demo">
                                    Request Demo
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            </nav>

            {/* ── Hero ── */}
            <section ref={heroRef} className="relative min-h-[100vh] flex items-center justify-center overflow-hidden">
                {/* Animated background orbs */}
                <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-white/[0.02] rounded-full blur-[120px] animate-pulse" style={{ animationDuration: "6s" }} />
                    <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-white/[0.015] rounded-full blur-[100px] animate-pulse" style={{ animationDuration: "8s", animationDelay: "2s" }} />
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-white/[0.01] rounded-full blur-[140px] animate-pulse" style={{ animationDuration: "10s", animationDelay: "4s" }} />
                </div>

                {/* Grid overlay */}
                <div className="absolute inset-0 pointer-events-none opacity-[0.03]"
                    style={{ backgroundImage: "linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)", backgroundSize: "60px 60px" }} />

                <motion.div className="relative z-10 max-w-7xl mx-auto px-4 md:px-8 w-full"
                    style={{ y: heroY, opacity: heroOpacity }}>
                    <div className="grid lg:grid-cols-2 gap-16 items-center">
                        <motion.div className="space-y-8"
                            initial={{ opacity: 0, x: -40 }} animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}>

                            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
                                className="inline-flex items-center gap-2 border border-white/10 bg-white/[0.03] backdrop-blur-sm px-4 py-1.5"
                                data-testid="hero-badge">
                                <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                                <span className="text-xs text-gray-400 tracking-widest uppercase font-medium">Enterprise Workforce Intelligence</span>
                            </motion.div>

                            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-display font-bold leading-[1.1] text-white" data-testid="hero-headline">
                                <motion.span className="block" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3, duration: 0.6 }}>
                                    Workforce
                                </motion.span>
                                <motion.span className="block" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45, duration: 0.6 }}>
                                    Reallocation
                                </motion.span>
                                <motion.span className="block text-gray-500" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6, duration: 0.6 }}>
                                    Infrastructure
                                </motion.span>
                            </h1>

                            <motion.p className="text-base text-gray-500 max-w-lg leading-relaxed"
                                initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }}>
                                AI is restructuring work at the task level. Realloc diagnoses which roles are rising and which are declining, then builds personalized reallocation programs for every worker.
                            </motion.p>

                            <motion.div className="flex flex-wrap gap-4"
                                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1 }}>
                                <Link to="/login" className="group inline-flex items-center gap-2 bg-white text-black px-7 py-3 text-sm font-semibold hover:bg-gray-200 transition-all duration-200" data-testid="hero-request-demo">
                                    Request Demo
                                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
                                </Link>
                                <a href="#how-it-works" className="inline-flex items-center gap-2 border border-white/10 text-gray-400 px-7 py-3 text-sm font-medium hover:border-white/30 hover:text-white transition-all duration-200" data-testid="hero-learn-more">
                                    Learn More
                                </a>
                            </motion.div>
                        </motion.div>

                        {/* Hero right - Animated Stats Dashboard */}
                        <motion.div initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}>
                            <div className="relative">
                                {/* Glow behind card */}
                                <div className="absolute -inset-4 bg-white/[0.03] rounded-2xl blur-xl" />

                                <div className="relative bg-card/80 backdrop-blur-xl border border-white/10 p-8 space-y-6" data-testid="hero-stats-card">
                                    <div className="flex items-center justify-between">
                                        <span className="text-xs text-gray-500 tracking-wider uppercase">Live Metrics</span>
                                        <span className="flex items-center gap-1.5 text-xs text-gray-600">
                                            <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" /> Active
                                        </span>
                                    </div>

                                    <div className="grid grid-cols-3 gap-4">
                                        {[
                                            { val: 587, label: "Workers Assessed", color: "text-white" },
                                            { val: 6, label: "Countries", color: "text-white" },
                                            { val: 73, label: "Completion %", suffix: "%", color: "text-white" },
                                        ].map((s, i) => (
                                            <motion.div key={s.label}
                                                initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
                                                transition={{ delay: 0.8 + i * 0.15 }}
                                                className="text-center">
                                                <p className={`text-2xl font-bold ${s.color} font-mono`}>
                                                    <Counter value={s.val} suffix={s.suffix || ""} />
                                                </p>
                                                <p className="text-xs text-gray-600 mt-1">{s.label}</p>
                                            </motion.div>
                                        ))}
                                    </div>

                                    {/* Mini displacement bar */}
                                    <div className="space-y-2">
                                        <p className="text-xs text-gray-500">Displacement Distribution</p>
                                        <div className="flex h-6 gap-0.5 overflow-hidden">
                                            <motion.div className="bg-blue-500/20 border border-blue-500/30 flex items-center justify-center"
                                                initial={{ width: 0 }} animate={{ width: "32%" }}
                                                transition={{ delay: 1.2, duration: 0.8, ease: "easeOut" }}>
                                                <span className="text-xs text-blue-400 font-mono">32%</span>
                                            </motion.div>
                                            <motion.div className="bg-gray-500/20 border border-gray-500/30 flex items-center justify-center"
                                                initial={{ width: 0 }} animate={{ width: "41%" }}
                                                transition={{ delay: 1.4, duration: 0.8, ease: "easeOut" }}>
                                                <span className="text-xs text-gray-400 font-mono">41%</span>
                                            </motion.div>
                                            <motion.div className="bg-red-500/20 border border-red-500/30 flex items-center justify-center"
                                                initial={{ width: 0 }} animate={{ width: "27%" }}
                                                transition={{ delay: 1.6, duration: 0.8, ease: "easeOut" }}>
                                                <span className="text-xs text-red-400 font-mono">27%</span>
                                            </motion.div>
                                        </div>
                                        <div className="flex justify-between text-xs text-gray-600">
                                            <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-blue-500" /> Rising</span>
                                            <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-gray-500" /> Stable</span>
                                            <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-red-500" /> At Risk</span>
                                        </div>
                                    </div>

                                    {/* Platform steps */}
                                    <div className="space-y-3 pt-2 border-t border-white/5">
                                        {[
                                            { num: "01", title: "Diagnose", status: "Active" },
                                            { num: "02", title: "Reallocate", status: "Active" },
                                            { num: "03", title: "Equip", status: "April 2026" },
                                            { num: "04", title: "Compound", status: "Continuous" },
                                        ].map((step, i) => (
                                            <motion.div key={step.num}
                                                initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
                                                transition={{ delay: 1.0 + i * 0.1 }}
                                                className="flex items-center justify-between group hover:bg-white/[0.02] px-2 py-1.5 -mx-2 transition-colors duration-200 cursor-default">
                                                <div className="flex items-center gap-3">
                                                    <span className="text-xs font-mono text-gray-700">{step.num}</span>
                                                    <span className="text-sm text-gray-300 group-hover:text-white transition-colors duration-200">{step.title}</span>
                                                </div>
                                                <span className="text-xs text-gray-600">{step.status}</span>
                                            </motion.div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </motion.div>

                {/* Scroll indicator */}
                <motion.div className="absolute bottom-8 left-1/2 -translate-x-1/2"
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2 }}>
                    <motion.div animate={{ y: [0, 8, 0] }} transition={{ repeat: Infinity, duration: 2 }}
                        className="w-5 h-8 border border-white/20 rounded-full flex items-start justify-center p-1.5">
                        <div className="w-1 h-1.5 bg-white/40 rounded-full" />
                    </motion.div>
                </motion.div>
            </section>

            {/* ── How It Works ── */}
            <section id="how-it-works" className="py-28 px-4 md:px-8 relative">
                <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
                </div>

                <div className="max-w-7xl mx-auto">
                    <Reveal>
                        <span className="text-xs text-gray-600 tracking-widest uppercase mb-4 block">Process</span>
                        <h2 className="text-2xl md:text-3xl font-display font-bold text-white mb-16">How Realloc Works</h2>
                    </Reveal>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {[
                            { icon: Target, title: "Diagnose", num: "01", desc: "Decompose every role into tasks. Classify each task against AI capability. Produce a displacement direction score for every worker." },
                            { icon: Users, title: "Reallocate", num: "02", desc: "Identify the builder core. Sort workers into cohorts. Generate personalized reallocation pathways based on diagnostic data." },
                            { icon: Zap, title: "Equip", num: "03", desc: "Deliver AI-powered training through the Realloc platform. Expert mentors from the world's leading companies provide guidance and quality control." },
                            { icon: TrendingUp, title: "Compound", num: "04", desc: "Every deployment generates outcome data. Link training results to displacement predictions. Each cycle improves accuracy." },
                        ].map((item, i) => (
                            <Reveal key={item.title} delay={i * 0.1}>
                                <div className="group relative bg-card/50 backdrop-blur-sm border border-white/5 p-6 h-full hover:border-white/15 transition-all duration-500">
                                    {/* Hover glow */}
                                    <div className="absolute inset-0 bg-gradient-to-b from-white/[0.02] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                                    <div className="relative">
                                        <div className="flex items-center justify-between mb-5">
                                            <item.icon className="w-5 h-5 text-gray-600 group-hover:text-white transition-colors duration-300" />
                                            <span className="text-xs font-mono text-gray-700">{item.num}</span>
                                        </div>
                                        <h3 className="text-sm font-semibold text-white mb-3 tracking-wide">{item.title}</h3>
                                        <p className="text-xs text-gray-500 leading-relaxed">{item.desc}</p>
                                    </div>
                                </div>
                            </Reveal>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── Connect with Expert Mentors ── */}
            <section className="py-28 px-4 md:px-8 relative">
                <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
                </div>
                <div className="max-w-7xl mx-auto">
                    <Reveal>
                        <span className="text-xs text-gray-600 tracking-widest uppercase mb-4 block">Mentorship</span>
                        <h2 className="text-2xl md:text-3xl font-display font-bold text-white mb-4">Connect with Your AI Mentor</h2>
                        <p className="text-sm text-gray-500 max-w-2xl mb-16 leading-relaxed">
                            Every participant is matched with a practitioner from the world's leading technology companies. Your mentor is assigned based on your diagnostic results and growth path.
                        </p>
                    </Reveal>

                    {/* Mentor Flow */}
                    <Reveal delay={0.1}>
                        <div className="grid md:grid-cols-4 gap-4 mb-16" data-testid="mentor-flow">
                            {[
                                { icon: ClipboardCheck, title: "Assessment", desc: "Complete your technology capability assessment", step: "Step 1" },
                                { icon: UserCheck, title: "Mentor Match", desc: "Matched to an expert based on your diagnostic and growth area", step: "Step 2" },
                                { icon: Video, title: "Weekly 1-on-1 Sessions", desc: "45-minute video calls every week with personalized guidance", step: "Step 3" },
                                { icon: Shield, title: "Project Reviews", desc: "Every build exercise reviewed to production-quality standards", step: "Step 4" },
                            ].map((item, i) => (
                                <div key={item.title} className="relative">
                                    <motion.div className="bg-card/50 backdrop-blur-sm border border-white/5 p-5 h-full group hover:border-white/15 transition-all duration-500"
                                        whileHover={{ y: -4 }} transition={{ duration: 0.2 }}>
                                        <span className="text-xs text-gray-700 font-mono block mb-3">{item.step}</span>
                                        <div className="w-10 h-10 border border-white/10 flex items-center justify-center mb-4 group-hover:border-white/30 group-hover:bg-white/[0.03] transition-all duration-300">
                                            <item.icon className="w-5 h-5 text-gray-500 group-hover:text-white transition-colors duration-300" />
                                        </div>
                                        <h3 className="text-sm font-semibold text-white mb-1">{item.title}</h3>
                                        <p className="text-xs text-gray-500 leading-relaxed">{item.desc}</p>
                                    </motion.div>
                                    {/* Connector arrow */}
                                    {i < 3 && (
                                        <div className="hidden md:flex absolute top-1/2 -right-2 z-10 -translate-y-1/2">
                                            <ChevronRight className="w-4 h-4 text-gray-700" />
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </Reveal>

                    {/* Mentor Cards */}
                    <div className="grid md:grid-cols-3 gap-6" data-testid="mentor-cards">
                        {[
                            { name: "Marcus Thompson", credential: "Former Meta Engineering Lead", spec: "AI workflow automation and agent architecture", years: 8, approach: "I focus on helping you ship production-quality AI solutions, not just prototypes." },
                            { name: "David Okafor", credential: "Former NVIDIA AI Specialist", spec: "Enterprise AI deployment and GPU-accelerated computing", years: 6, approach: "If it doesn't work in production, it doesn't work. I push you to build things that survive real traffic." },
                            { name: "Sarah Kim", credential: "Former OpenAI Practitioner", spec: "LLM applications and prompt engineering", years: 5, approach: "The best AI solutions come from domain experts who learn to speak AI, not AI experts who learn your domain." },
                        ].map((m, i) => (
                            <Reveal key={m.name} delay={0.1 + i * 0.1}>
                                <motion.div whileHover={{ y: -6 }} transition={{ duration: 0.25 }}
                                    className="group relative bg-card/50 backdrop-blur-sm border border-white/5 p-6 hover:border-white/15 transition-all duration-500"
                                    data-testid={`landing-mentor-${m.name.split(' ')[0].toLowerCase()}`}>
                                    <div className="absolute inset-0 bg-gradient-to-b from-white/[0.02] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                                    <div className="relative">
                                        <div className="w-14 h-14 bg-white/[0.04] border border-white/10 rounded-full flex items-center justify-center mb-4 group-hover:border-white/25 transition-colors duration-300">
                                            <span className="text-xl font-bold text-gray-400 group-hover:text-white transition-colors duration-300">{m.name.charAt(0)}</span>
                                        </div>
                                        <h3 className="text-base font-semibold text-white">{m.name}</h3>
                                        <p className="text-xs text-gray-400 mt-0.5">{m.credential}</p>
                                        <p className="text-xs text-gray-600 mt-1">{m.spec}</p>
                                        <p className="text-xs text-gray-600 mt-1">{m.years} years experience</p>
                                        <p className="text-xs text-gray-500 italic mt-4 border-l border-white/10 pl-3 leading-relaxed">"{m.approach}"</p>
                                    </div>
                                </motion.div>
                            </Reveal>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── The Realloc Difference ── */}
            <section className="py-28 px-4 md:px-8 relative">
                <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
                </div>
                <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
                    <Reveal>
                        <div>
                            <span className="text-xs text-gray-600 tracking-widest uppercase mb-4 block">Approach</span>
                            <h2 className="text-2xl md:text-3xl font-display font-bold text-white mb-6">The Realloc Difference</h2>
                            <div className="space-y-6">
                                <p className="text-sm text-gray-400 leading-relaxed">
                                    Every workforce platform asks: what skills does this person have?
                                </p>
                                <p className="text-base text-white font-medium leading-relaxed">
                                    Realloc asks: what will happen to this person's role as AI advances?
                                </p>
                                <p className="text-sm text-gray-500 leading-relaxed">
                                    We diagnose the direction of automation impact at the task level. When AI automates expertise, the role commoditizes. When AI automates routine, the role specializes. Same technology. Opposite outcomes. Different interventions.
                                </p>
                            </div>
                        </div>
                    </Reveal>

                    <Reveal delay={0.2}>
                        <div className="space-y-4">
                            {[
                                { label: "Rising / Specializing", color: "border-blue-500/30 bg-blue-500/5", text: "text-blue-400", desc: "AI removes routine work. Human expertise becomes more valuable." },
                                { label: "Stable / Monitoring", color: "border-gray-500/30 bg-gray-500/5", text: "text-gray-400", desc: "Displacement direction unclear. Proactive upskilling recommended." },
                                { label: "At Risk / Commoditizing", color: "border-red-500/30 bg-red-500/5", text: "text-red-400", desc: "AI automates core expertise. Reallocation pathway required." },
                            ].map((item, i) => (
                                <motion.div key={item.label}
                                    whileHover={{ x: 8 }} transition={{ duration: 0.2 }}
                                    className={`border ${item.color} p-5 group cursor-default`}>
                                    <h3 className={`text-sm font-semibold ${item.text} mb-1`}>{item.label}</h3>
                                    <p className="text-xs text-gray-500 leading-relaxed">{item.desc}</p>
                                </motion.div>
                            ))}
                        </div>
                    </Reveal>
                </div>
            </section>

            {/* ── Enterprise Deployment ── */}
            <section className="py-28 px-4 md:px-8 relative">
                <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
                </div>
                <div className="max-w-7xl mx-auto">
                    <Reveal>
                        <span className="text-xs text-gray-600 tracking-widest uppercase mb-4 block">Validation</span>
                        <h2 className="text-2xl md:text-3xl font-display font-bold text-white mb-6">Built from Real Enterprise Deployment</h2>
                        <p className="text-sm text-gray-500 max-w-3xl leading-relaxed mb-12">
                            Realloc emerged from a live engagement assessing hundreds of technology workers at one of the largest financial institutions in the region. The diagnostic framework, the cohort design, and the training methodology were all built and validated in production before becoming a platform.
                        </p>
                    </Reveal>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {[
                            { val: 587, label: "Workers Assessed" },
                            { val: 6, label: "Countries Deployed" },
                            { val: 12, label: "Personalized Curricula" },
                            { val: 3, label: "Expert Mentors" },
                        ].map((s, i) => (
                            <Reveal key={s.label} delay={i * 0.08}>
                                <div className="bg-card/50 backdrop-blur-sm border border-white/5 p-6 text-center hover:border-white/15 transition-all duration-300">
                                    <p className="text-3xl font-bold text-white font-mono"><Counter value={s.val} /></p>
                                    <p className="text-xs text-gray-600 mt-2">{s.label}</p>
                                </div>
                            </Reveal>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── CTA ── */}
            <section className="py-28 px-4 md:px-8 relative">
                <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
                </div>
                <div className="max-w-7xl mx-auto text-center">
                    <Reveal>
                        <h2 className="text-3xl md:text-4xl font-display font-bold text-white mb-4">See Realloc in Action</h2>
                        <p className="text-sm text-gray-500 mb-8 max-w-md mx-auto">Diagnose. Reallocate. Equip. The infrastructure your workforce needs for the AI era.</p>
                        <Link to="/login" className="group inline-flex items-center gap-3 bg-white text-black px-8 py-3.5 text-sm font-semibold hover:bg-gray-200 transition-all duration-200" data-testid="cta-request-demo">
                            Request Demo
                            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
                        </Link>
                    </Reveal>
                </div>
            </section>

            {/* ── Footer ── */}
            <footer className="py-12 px-4 md:px-8 border-t border-white/5">
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                    <div>
                        <span className="text-lg font-bold text-white">Realloc</span>
                        <p className="text-xs text-gray-700 mt-1">Workforce reallocation infrastructure for the AI era</p>
                    </div>
                    <p className="text-xs text-gray-800">A THCO Company</p>
                </div>
            </footer>
        </div>
    );
}
