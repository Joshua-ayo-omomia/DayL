import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { motion } from "framer-motion";
import { ArrowRight, Globe, Users, BarChart3, Zap, Target, TrendingUp, Shield, ChevronRight } from "lucide-react";

const fadeUp = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } };

export default function LandingPage() {
    const { user, isEnterprise, isParticipant } = useAuth();

    return (
        <div className="min-h-screen bg-background text-foreground font-body">
            {/* Navbar */}
            <nav className="fixed top-0 w-full z-50 glass border-b border-border/40">
                <div className="max-w-7xl mx-auto px-4 md:px-8 flex items-center justify-between h-16">
                    <Link to="/" className="text-xl font-bold text-white tracking-tight font-body" data-testid="nav-logo">
                        Realloc
                    </Link>
                    <div className="flex items-center gap-4">
                        {user ? (
                            <Link
                                to={isEnterprise ? "/enterprise" : "/learn"}
                                className="bg-white text-black px-5 py-2 text-sm font-medium hover:bg-gray-300 transition-colors"
                                data-testid="nav-dashboard-link"
                            >
                                Dashboard
                            </Link>
                        ) : (
                            <>
                                <Link to="/login" className="text-sm text-gray-300 hover:text-white transition-colors" data-testid="nav-login">Login</Link>
                                <Link to="/login" className="bg-white text-black px-5 py-2 text-sm font-medium hover:bg-gray-300 transition-colors" data-testid="nav-request-demo">
                                    Request Demo
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            </nav>

            {/* Hero */}
            <section className="pt-32 pb-20 px-4 md:px-8 relative grain">
                <div className="max-w-7xl mx-auto grid lg:grid-cols-5 gap-12 items-start">
                    <motion.div className="lg:col-span-3 space-y-8" initial="hidden" animate="visible" variants={fadeUp} transition={{ duration: 0.6 }}>
                        <span className="inline-block text-xs font-medium text-gray-400 border border-gray-700 px-3 py-1 tracking-wider uppercase" data-testid="hero-badge">
                            Enterprise Workforce Intelligence
                        </span>
                        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-display font-bold leading-tight text-white" data-testid="hero-headline">
                            Workforce Reallocation Infrastructure for the AI Era
                        </h1>
                        <p className="text-base md:text-lg text-gray-400 max-w-2xl leading-relaxed">
                            AI is restructuring work at the task level. Realloc diagnoses which roles are rising and which are declining, then builds personalized reallocation programs for every worker. Deployed across 587 employees in 6 countries.
                        </p>
                        <div className="flex flex-wrap gap-4">
                            <Link to="/login" className="inline-flex items-center gap-2 bg-white text-black px-6 py-3 text-sm font-semibold hover:bg-gray-300 transition-colors" data-testid="hero-request-demo">
                                Request Demo <ArrowRight className="w-4 h-4" />
                            </Link>
                            <a href="#how-it-works" className="inline-flex items-center gap-2 border border-gray-600 text-gray-300 px-6 py-3 text-sm font-medium hover:border-white hover:text-white transition-colors" data-testid="hero-learn-more">
                                Learn More
                            </a>
                        </div>
                        <div className="flex gap-8 pt-4 border-t border-border/40">
                            <div><span className="text-2xl font-bold text-white">587</span><p className="text-xs text-gray-500 mt-1">Workers Assessed</p></div>
                            <div><span className="text-2xl font-bold text-white">6</span><p className="text-xs text-gray-500 mt-1">Countries</p></div>
                            <div><span className="text-2xl font-bold text-white">$200K</span><p className="text-xs text-gray-500 mt-1">Enterprise Contract</p></div>
                        </div>
                    </motion.div>

                    {/* Side Card */}
                    <motion.div className="lg:col-span-2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3, duration: 0.6 }}>
                        <div className="bg-card border border-border/40 p-6 space-y-5 veneer-card" data-testid="platform-overview-card">
                            <h3 className="text-lg font-display font-semibold text-white">How Realloc Works</h3>
                            {[
                                { num: "1", title: "Diagnose", status: "Active", desc: "Workforce displacement analysis" },
                                { num: "2", title: "Reallocate", status: "Active", desc: "Builder core identification and cohort design" },
                                { num: "3", title: "Equip", status: "Launching April", desc: "AI-powered training with expert mentors" },
                                { num: "4", title: "Compound", status: "Continuous", desc: "Outcome data improves every future assessment" },
                            ].map((step) => (
                                <div key={step.num} className="flex items-start gap-3 group">
                                    <span className="text-sm font-mono text-gray-500 mt-0.5">{step.num}.</span>
                                    <div className="flex-1">
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm font-semibold text-white">{step.title}</span>
                                            <span className="text-xs text-gray-500">{step.status}</span>
                                        </div>
                                        <p className="text-xs text-gray-500 mt-0.5">{step.desc}</p>
                                    </div>
                                </div>
                            ))}
                            <div className="pt-3 border-t border-border/40">
                                <p className="text-xs text-gray-600">Enterprise workforce intelligence</p>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* How It Works */}
            <section id="how-it-works" className="py-20 px-4 md:px-8 border-t border-border/20">
                <div className="max-w-7xl mx-auto">
                    <h2 className="text-base md:text-lg font-display font-semibold text-white mb-12">How It Works</h2>
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {[
                            { icon: Target, title: "Diagnose", desc: "Decompose every role into tasks. Classify each task against AI capability. Produce a displacement direction score for every worker." },
                            { icon: Users, title: "Reallocate", desc: "Identify the builder core. Sort workers into cohorts. Generate personalized reallocation pathways based on diagnostic data." },
                            { icon: Zap, title: "Equip", desc: "Deliver AI-powered training through the Realloc platform. Expert mentors from Meta, NVIDIA, and OpenAI provide guidance and quality control." },
                            { icon: TrendingUp, title: "Compound", desc: "Every deployment generates outcome data. Link training results to displacement predictions. Each cycle improves accuracy for the next enterprise." },
                        ].map((item, i) => (
                            <motion.div key={item.title} className="bg-card border border-border/40 p-6 veneer-card group" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} transition={{ delay: i * 0.1 }}>
                                <item.icon className="w-5 h-5 text-gray-400 mb-4 group-hover:text-white transition-colors" />
                                <h3 className="text-sm font-semibold text-white mb-2 font-body">{item.title}</h3>
                                <p className="text-xs text-gray-500 leading-relaxed">{item.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Trusted By */}
            <section className="py-20 px-4 md:px-8 border-t border-border/20">
                <div className="max-w-7xl mx-auto">
                    <h2 className="text-base md:text-lg font-display font-semibold text-white mb-4">Trusted By Enterprise</h2>
                    <p className="text-sm text-gray-400 max-w-3xl leading-relaxed mb-8">
                        Sagicor Financial Company deployed Realloc across 587 technology employees in Jamaica, Canada, USA, Barbados, Trinidad and Tobago, and Curacao.
                    </p>
                    <p className="text-sm text-gray-500">One platform. One founder. Six countries. $200K contract.</p>
                    <div className="flex flex-wrap gap-4 mt-8">
                        {["Jamaica", "Canada", "USA", "Barbados", "Trinidad and Tobago", "Curacao"].map(c => (
                            <div key={c} className="flex items-center gap-2 bg-card border border-border/40 px-4 py-2">
                                <Globe className="w-3 h-3 text-gray-500" />
                                <span className="text-xs text-gray-400">{c}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* The Realloc Difference */}
            <section className="py-20 px-4 md:px-8 border-t border-border/20">
                <div className="max-w-7xl mx-auto">
                    <h2 className="text-base md:text-lg font-display font-semibold text-white mb-6">The Realloc Difference</h2>
                    <div className="max-w-3xl space-y-4">
                        <p className="text-sm text-gray-400 leading-relaxed">
                            Every workforce platform asks: what skills does this person have? Realloc asks: what will happen to this person's role as AI advances?
                        </p>
                        <p className="text-sm text-gray-500 leading-relaxed">
                            We diagnose the direction of automation impact at the task level. When AI automates expertise, the role commoditizes. When AI automates routine, the role specializes. Same technology. Opposite outcomes. Different interventions.
                        </p>
                    </div>
                </div>
            </section>

            {/* About */}
            <section className="py-20 px-4 md:px-8 border-t border-border/20">
                <div className="max-w-7xl mx-auto">
                    <h2 className="text-base md:text-lg font-display font-semibold text-white mb-4">Built from Real Enterprise Deployment</h2>
                    <p className="text-sm text-gray-400 max-w-3xl leading-relaxed">
                        Realloc emerged from a live engagement assessing 587 technology workers at one of the Caribbean's largest financial institutions. The diagnostic framework, the cohort design, and the training methodology were all built and validated in production before becoming a platform.
                    </p>
                </div>
            </section>

            {/* Final CTA */}
            <section className="py-20 px-4 md:px-8 border-t border-border/20">
                <div className="max-w-7xl mx-auto text-center">
                    <h2 className="text-2xl md:text-3xl font-display font-bold text-white mb-6">See Realloc in Action</h2>
                    <Link to="/login" className="inline-flex items-center gap-2 bg-white text-black px-8 py-3 text-sm font-semibold hover:bg-gray-300 transition-colors" data-testid="cta-request-demo">
                        Request Demo <ChevronRight className="w-4 h-4" />
                    </Link>
                </div>
            </section>

            {/* Footer */}
            <footer className="py-12 px-4 md:px-8 border-t border-border/20">
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                    <div>
                        <span className="text-lg font-bold text-white font-body">Realloc</span>
                        <p className="text-xs text-gray-600 mt-1">Workforce reallocation infrastructure for the AI era</p>
                    </div>
                    <p className="text-xs text-gray-700">A THCO Company</p>
                </div>
            </footer>
        </div>
    );
}
