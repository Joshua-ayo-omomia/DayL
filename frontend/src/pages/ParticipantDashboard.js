import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Bell, LogOut, BookOpen, MessageSquare, User, Clock, CheckCircle, ClipboardCheck, UserCheck, Video, Shield, ChevronRight, ArrowRight } from "lucide-react";

const STATUS_STYLE = { completed: "bg-green-500/10 text-green-400 border-green-500/20", in_progress: "bg-white/10 text-white border-white/20", available: "bg-gray-500/10 text-gray-400 border-gray-500/20", locked: "bg-gray-800 text-gray-600 border-gray-700" };

function Reveal({ children, delay = 0, className = "" }) {
    const ref = useRef(null);
    const inView = useInView(ref, { once: true, margin: "-60px" });
    return (
        <motion.div ref={ref} className={className}
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}>
            {children}
        </motion.div>
    );
}

export default function ParticipantDashboard() {
    const { api, user, logout } = useAuth();
    const navigate = useNavigate();
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [notifications, setNotifications] = useState([]);
    const [showNotifs, setShowNotifs] = useState(false);

    useEffect(() => {
        const load = async () => {
            try {
                const [dashRes, notifRes] = await Promise.all([
                    api.get("/learn/dashboard"),
                    api.get("/notifications").catch(() => ({ data: { notifications: [] } }))
                ]);
                setData(dashRes.data);
                setNotifications(notifRes.data.notifications || []);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        load();
    }, [api]);

    if (loading) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    const worker = data?.worker;
    const domains = data?.domains || [];
    const mentor = data?.mentor;
    const nextSession = data?.next_session;
    const activity = data?.activity || [];
    const submissions = data?.submissions || [];
    const unreadNotifs = notifications.filter(n => !n.read).length;

    const passedSubmissions = submissions.filter(s => s.status === "pass").length;
    const pendingSubmissions = submissions.filter(s => s.status === "pending").length;

    return (
        <div className="min-h-screen bg-background" data-testid="participant-dashboard">
            {/* Top Nav */}
            <nav className="fixed top-0 w-full z-50 glass border-b border-white/5">
                <div className="max-w-6xl mx-auto px-4 md:px-8 flex items-center justify-between h-14">
                    <Link to="/" className="text-lg font-bold text-white">Realloc</Link>
                    <div className="flex items-center gap-4">
                        <Link to="/community" className="text-xs text-gray-500 hover:text-white transition-colors duration-200 flex items-center gap-1" data-testid="nav-community">
                            <MessageSquare className="w-3.5 h-3.5" /> Community
                        </Link>
                        <Link to="/learn/mentor" className="text-xs text-gray-500 hover:text-white transition-colors duration-200 flex items-center gap-1" data-testid="nav-mentor">
                            <User className="w-3.5 h-3.5" /> My Mentor
                        </Link>
                        <div className="relative">
                            <button onClick={() => setShowNotifs(!showNotifs)} className="text-gray-500 hover:text-white transition-colors relative" data-testid="participant-notif-bell">
                                <Bell className="w-4 h-4" />
                                {unreadNotifs > 0 && <span className="absolute -top-1 -right-1 w-4 h-4 bg-white text-black text-xs flex items-center justify-center rounded-full font-bold">{unreadNotifs}</span>}
                            </button>
                            {showNotifs && notifications.length > 0 && (
                                <div className="absolute top-8 right-0 w-72 bg-card border border-white/10 shadow-xl p-3 space-y-2 z-50 backdrop-blur-xl">
                                    {notifications.map(n => (
                                        <div key={n.id} className="text-xs text-gray-400 py-1.5 border-b border-white/5 last:border-0">{n.content}</div>
                                    ))}
                                </div>
                            )}
                        </div>
                        <button onClick={() => { logout(); navigate("/"); }} className="text-gray-600 hover:text-white transition-colors" data-testid="participant-logout">
                            <LogOut className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            </nav>

            <main className="pt-20 pb-16 px-4 md:px-8 max-w-6xl mx-auto">
                <div className="space-y-10">
                    {/* Diagnostic Summary */}
                    {worker && (
                        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                            className="relative bg-card/80 backdrop-blur-sm border border-white/5 p-6 overflow-hidden" data-testid="diagnostic-summary">
                            {/* Subtle glow */}
                            <div className="absolute top-0 right-0 w-64 h-64 bg-white/[0.02] rounded-full blur-[80px] pointer-events-none" />
                            <div className="relative">
                                <div className="flex items-start justify-between">
                                    <div>
                                        <h1 className="text-2xl font-display font-bold text-white">{user?.name}</h1>
                                        <p className="text-sm text-gray-500 mt-1">{worker.role_title}</p>
                                    </div>
                                    <div className="text-right">
                                        <span className={`inline-block text-xs px-3 py-1.5 border ${worker.displacement_category === "rising" ? "text-blue-400 border-blue-500/20 bg-blue-500/5" : worker.displacement_category === "at_risk" ? "text-red-400 border-red-500/20 bg-red-500/5" : "text-gray-400 border-gray-500/20 bg-gray-500/5"}`}>
                                            {worker.displacement_direction_score} / 10
                                        </span>
                                    </div>
                                </div>
                                <p className="text-sm text-gray-400 mt-4 leading-relaxed max-w-3xl">{worker.displacement_interpretation}</p>
                                <div className="mt-5">
                                    <div className="relative h-2 bg-gradient-to-r from-red-500/15 via-gray-500/15 to-blue-500/15 rounded-full overflow-hidden">
                                        <motion.div className="absolute top-0 h-full w-2.5 bg-white rounded-full shadow-lg shadow-white/20"
                                            initial={{ left: "50%" }}
                                            animate={{ left: `${((worker.displacement_direction_score || 5) / 10) * 100}%` }}
                                            transition={{ duration: 1, delay: 0.5, ease: "easeOut" }}
                                            style={{ transform: "translateX(-50%)" }} />
                                    </div>
                                    <div className="flex justify-between text-xs text-gray-700 mt-1.5">
                                        <span>Commoditizing</span><span>Stable</span><span>Specializing</span>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {/* Program Section */}
                    <div>
                        <Reveal>
                            <h2 className="text-lg font-display font-semibold text-white mb-1">
                                Your Program: {user?.personalized_track_name || "AI Training"}
                            </h2>
                            <p className="text-sm text-gray-500 mb-6">
                                Built from your Technology Capability Assessment results.
                            </p>
                        </Reveal>

                        <div className="grid md:grid-cols-2 gap-4" data-testid="domain-cards">
                            {domains.map((d, i) => {
                                const progress = d.tasks_total > 0 ? (d.tasks_completed / d.tasks_total) * 100 : 0;
                                const status = d.tasks_completed === d.tasks_total && d.tasks_total > 0 ? "completed" : d.tasks_completed > 0 ? "in_progress" : "available";
                                return (
                                    <Reveal key={d.id} delay={i * 0.08}>
                                        <Link to={`/learn/domain/${d.id}/task/${d.id}`}
                                            className="group block relative bg-card/50 backdrop-blur-sm border border-white/5 p-5 hover:border-white/15 transition-all duration-300"
                                            data-testid={`domain-card-${i}`}>
                                            <div className="absolute inset-0 bg-gradient-to-b from-white/[0.01] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                            <div className="relative">
                                                <div className="flex items-center justify-between mb-2">
                                                    <span className="text-xs text-gray-700 font-mono">Domain {d.order}</span>
                                                    <span className={`text-xs px-2 py-0.5 border capitalize ${STATUS_STYLE[status]}`}>{status.replace("_", " ")}</span>
                                                </div>
                                                <h3 className="text-sm font-semibold text-white mb-1">{d.title}</h3>
                                                <p className="text-xs text-gray-600 mb-4">Weight: {d.weight_pct}% - {d.task_count || d.tasks_total} tasks</p>
                                                <div className="flex justify-between text-xs mb-1.5">
                                                    <span className="text-gray-600">{d.tasks_completed} of {d.tasks_total} completed</span>
                                                    <span className="text-gray-500 font-mono">{Math.round(progress)}%</span>
                                                </div>
                                                <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                                                    <motion.div className="h-full bg-white rounded-full"
                                                        initial={{ width: 0 }}
                                                        animate={{ width: `${progress}%` }}
                                                        transition={{ duration: 1, delay: 0.3 + i * 0.1, ease: "easeOut" }} />
                                                </div>
                                            </div>
                                        </Link>
                                    </Reveal>
                                );
                            })}
                        </div>
                    </div>

                    {/* Quick Stats + Upcoming + Activity */}
                    <div className="grid lg:grid-cols-3 gap-6">
                        <Reveal>
                            <div className="bg-card/50 backdrop-blur-sm border border-white/5 p-5 space-y-4">
                                <h3 className="text-sm font-semibold text-white">Progress</h3>
                                <div className="space-y-3 text-sm">
                                    <div className="flex items-center justify-between">
                                        <span className="text-gray-500 flex items-center gap-2"><BookOpen className="w-3.5 h-3.5" /> Submissions</span>
                                        <span className="text-white font-mono">{submissions.length}</span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-gray-500 flex items-center gap-2"><CheckCircle className="w-3.5 h-3.5" /> Passed</span>
                                        <span className="text-white font-mono">{passedSubmissions}</span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-gray-500 flex items-center gap-2"><Clock className="w-3.5 h-3.5" /> Pending Review</span>
                                        <span className="text-white font-mono">{pendingSubmissions}</span>
                                    </div>
                                </div>
                            </div>
                        </Reveal>

                        <Reveal delay={0.1}>
                            <div className="bg-card/50 backdrop-blur-sm border border-white/5 p-5 space-y-3">
                                <h3 className="text-sm font-semibold text-white">Upcoming</h3>
                                {mentor && nextSession ? (
                                    <div className="text-xs text-gray-400 space-y-2">
                                        <p className="text-white text-sm">Next Mentor Session</p>
                                        <p>{nextSession.date} at {nextSession.time} {nextSession.timezone}</p>
                                        <p className="text-gray-600">{mentor.name}, {mentor.credential}</p>
                                        {nextSession.meeting_url && (
                                            <a href={nextSession.meeting_url} target="_blank" rel="noopener noreferrer"
                                                className="inline-flex items-center gap-1 text-gray-400 hover:text-white transition-colors">
                                                <Video className="w-3 h-3" /> Join Meeting
                                            </a>
                                        )}
                                    </div>
                                ) : (
                                    <p className="text-xs text-gray-600">No upcoming sessions</p>
                                )}
                            </div>
                        </Reveal>

                        <Reveal delay={0.2}>
                            <div className="bg-card/50 backdrop-blur-sm border border-white/5 p-5 space-y-3">
                                <h3 className="text-sm font-semibold text-white">Cohort Activity</h3>
                                <div className="space-y-2 max-h-48 overflow-y-auto">
                                    {activity.slice(0, 8).map(a => (
                                        <div key={a.id} className="text-xs text-gray-600 py-1.5 border-b border-white/5 last:border-0">
                                            <span className="text-gray-400">{a.actor_name}</span> {a.content}
                                        </div>
                                    ))}
                                    {activity.length === 0 && <p className="text-xs text-gray-600">No recent activity</p>}
                                </div>
                            </div>
                        </Reveal>
                    </div>

                    {/* ── Connect with Your Team / Mentor Section ── */}
                    <Reveal>
                        <div className="relative overflow-hidden" data-testid="mentor-connection-section">
                            <div className="absolute inset-0 pointer-events-none">
                                <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
                            </div>

                            <div className="pt-10 space-y-8">
                                <div>
                                    <span className="text-xs text-gray-600 tracking-widest uppercase mb-3 block">Your Expert Team</span>
                                    <h2 className="text-lg font-display font-semibold text-white mb-2">Connect with Your AI Mentor</h2>
                                    <p className="text-sm text-gray-500 max-w-2xl">
                                        Your mentor is assigned based on your diagnostic results and growth path. Every session, every review, and every piece of feedback is personalized to accelerate your development.
                                    </p>
                                </div>

                                {/* Mentor Flow Steps */}
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-3" data-testid="mentor-flow-steps">
                                    {[
                                        { icon: ClipboardCheck, title: "Assessment Complete", desc: "Your diagnostic data powers every decision", done: true },
                                        { icon: UserCheck, title: "Mentor Matched", desc: mentor ? `${mentor.name}` : "Being assigned", done: !!mentor },
                                        { icon: Video, title: "Weekly Sessions", desc: nextSession ? `Next: ${nextSession.date}` : "Schedule pending", done: !!nextSession },
                                        { icon: Shield, title: "Project Reviews", desc: `${passedSubmissions} passed, ${pendingSubmissions} pending`, done: passedSubmissions > 0 },
                                    ].map((step, i) => (
                                        <motion.div key={step.title}
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: 0.1 + i * 0.1 }}
                                            className={`relative bg-card/50 backdrop-blur-sm border p-4 transition-all duration-300 ${step.done ? "border-white/10" : "border-white/5"}`}>
                                            <div className="flex items-center gap-2 mb-2">
                                                <div className={`w-7 h-7 flex items-center justify-center border ${step.done ? "border-white/20 bg-white/[0.04]" : "border-white/5"}`}>
                                                    <step.icon className={`w-3.5 h-3.5 ${step.done ? "text-white" : "text-gray-600"}`} />
                                                </div>
                                                {step.done && <CheckCircle className="w-3 h-3 text-green-400" />}
                                            </div>
                                            <h4 className="text-xs font-semibold text-white mb-0.5">{step.title}</h4>
                                            <p className="text-xs text-gray-600">{step.desc}</p>
                                            {/* Connector */}
                                            {i < 3 && <div className="hidden md:block absolute top-1/2 -right-1.5 z-10"><ChevronRight className="w-3 h-3 text-gray-700" /></div>}
                                        </motion.div>
                                    ))}
                                </div>

                                {/* Assigned Mentor Card */}
                                {mentor && (
                                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
                                        className="relative bg-card/50 backdrop-blur-sm border border-white/5 p-6 group hover:border-white/15 transition-all duration-300"
                                        data-testid="assigned-mentor-card">
                                        <div className="absolute inset-0 bg-gradient-to-r from-white/[0.01] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                        <div className="relative flex items-start gap-5">
                                            <div className="w-14 h-14 bg-white/[0.04] border border-white/10 rounded-full flex items-center justify-center flex-shrink-0 group-hover:border-white/25 transition-colors duration-300">
                                                <span className="text-xl font-bold text-gray-400 group-hover:text-white transition-colors duration-300">{mentor.name?.charAt(0)}</span>
                                            </div>
                                            <div className="flex-1">
                                                <div className="flex items-center justify-between">
                                                    <div>
                                                        <h3 className="text-base font-semibold text-white">{mentor.name}</h3>
                                                        <p className="text-xs text-gray-400">{mentor.credential}</p>
                                                    </div>
                                                    <Link to="/learn/mentor" className="flex items-center gap-1 text-xs text-gray-500 hover:text-white transition-colors duration-200" data-testid="view-mentor-link">
                                                        View Profile <ArrowRight className="w-3 h-3" />
                                                    </Link>
                                                </div>
                                                <p className="text-xs text-gray-500 mt-1">{mentor.specialization}</p>
                                                {mentor.mentoring_approach && (
                                                    <p className="text-xs text-gray-500 italic mt-3 border-l border-white/10 pl-3">"{mentor.mentoring_approach}"</p>
                                                )}
                                            </div>
                                        </div>
                                    </motion.div>
                                )}

                                {!mentor && (
                                    <div className="bg-card/50 backdrop-blur-sm border border-white/5 p-6 text-center">
                                        <p className="text-sm text-gray-500">Your mentor will be assigned when your cohort begins. You will receive a notification when matched.</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </Reveal>
                </div>
            </main>
        </div>
    );
}
