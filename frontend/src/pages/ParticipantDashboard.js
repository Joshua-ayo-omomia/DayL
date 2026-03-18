import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Bell, LogOut, BookOpen, MessageSquare, User, BarChart3, Clock, CheckCircle, AlertCircle } from "lucide-react";

const STATUS_STYLE = { completed: "bg-green-500/10 text-green-400 border-green-500/20", in_progress: "bg-white/10 text-white border-white/20", available: "bg-gray-500/10 text-gray-400 border-gray-500/20", locked: "bg-gray-800 text-gray-600 border-gray-700" };

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

    const totalTasks = domains.reduce((sum, d) => sum + (d.tasks_total || 0), 0);
    const completedTasks = domains.reduce((sum, d) => sum + (d.tasks_completed || 0), 0);
    const pendingSubmissions = submissions.filter(s => s.status === "pending").length;
    const passedSubmissions = submissions.filter(s => s.status === "pass").length;

    return (
        <div className="min-h-screen bg-background" data-testid="participant-dashboard">
            {/* Top Nav */}
            <nav className="fixed top-0 w-full z-50 glass border-b border-border/40">
                <div className="max-w-6xl mx-auto px-4 md:px-8 flex items-center justify-between h-14">
                    <Link to="/" className="text-lg font-bold text-white font-body">Realloc</Link>
                    <div className="flex items-center gap-4">
                        <Link to="/community" className="text-xs text-gray-500 hover:text-white transition-colors flex items-center gap-1" data-testid="nav-community">
                            <MessageSquare className="w-3.5 h-3.5" /> Community
                        </Link>
                        <Link to="/learn/mentor" className="text-xs text-gray-500 hover:text-white transition-colors flex items-center gap-1" data-testid="nav-mentor">
                            <User className="w-3.5 h-3.5" /> My Mentor
                        </Link>
                        <div className="relative">
                            <button onClick={() => setShowNotifs(!showNotifs)} className="text-gray-500 hover:text-white transition-colors relative" data-testid="participant-notif-bell">
                                <Bell className="w-4 h-4" />
                                {unreadNotifs > 0 && <span className="absolute -top-1 -right-1 w-4 h-4 bg-white text-black text-xs flex items-center justify-center rounded-full font-bold">{unreadNotifs}</span>}
                            </button>
                            {showNotifs && notifications.length > 0 && (
                                <div className="absolute top-8 right-0 w-72 bg-card border border-border/40 shadow-xl p-3 space-y-2 z-50">
                                    {notifications.map(n => (
                                        <div key={n.id} className="text-xs text-gray-400 py-1 border-b border-border/20 last:border-0">{n.content}</div>
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

            <main className="pt-20 pb-12 px-4 md:px-8 max-w-6xl mx-auto">
                <div className="space-y-8">
                    {/* Diagnostic Summary */}
                    {worker && (
                        <div className="bg-card border border-border/40 p-6" data-testid="diagnostic-summary">
                            <div className="flex items-start justify-between">
                                <div>
                                    <h1 className="text-2xl font-display font-bold text-white">{user?.name}</h1>
                                    <p className="text-sm text-gray-500 mt-1">{worker.role_title}</p>
                                </div>
                                <div className="text-right">
                                    <span className={`inline-block text-xs px-3 py-1 border ${worker.displacement_category === "rising" ? "text-blue-400 border-blue-500/20 bg-blue-500/5" : worker.displacement_category === "at_risk" ? "text-red-400 border-red-500/20 bg-red-500/5" : "text-gray-400 border-gray-500/20 bg-gray-500/5"}`}>
                                        {worker.displacement_direction_score} / 10
                                    </span>
                                </div>
                            </div>
                            <p className="text-sm text-gray-400 mt-4 leading-relaxed">{worker.displacement_interpretation}</p>
                            {/* Mini gauge */}
                            <div className="mt-4">
                                <div className="relative h-2 bg-gradient-to-r from-red-500/20 via-gray-500/20 to-blue-500/20 rounded-full overflow-hidden">
                                    <div className="absolute top-0 h-full w-2 bg-white rounded-full shadow-lg transform -translate-x-1/2"
                                        style={{ left: `${((worker.displacement_direction_score || 5) / 10) * 100}%` }} />
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Program */}
                    <div>
                        <h2 className="text-base font-display font-semibold text-white mb-1">
                            Your Program: {user?.personalized_track_name || "AI Training"}
                        </h2>
                        <p className="text-sm text-gray-500 mb-6">
                            This program was built from your Technology Capability Assessment results.
                        </p>

                        <div className="grid md:grid-cols-2 gap-4" data-testid="domain-cards">
                            {domains.map((d, i) => {
                                const progress = d.tasks_total > 0 ? (d.tasks_completed / d.tasks_total) * 100 : 0;
                                const status = d.tasks_completed === d.tasks_total && d.tasks_total > 0 ? "completed" : d.tasks_completed > 0 ? "in_progress" : "available";
                                return (
                                    <Link key={d.id} to={`/learn/domain/${d.id}/task/${d.id}`}
                                        className="bg-card border border-border/40 p-5 veneer-card group block hover:border-white/20 transition-colors"
                                        data-testid={`domain-card-${i}`}>
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="text-xs text-gray-600 font-mono">Domain {d.order}</span>
                                            <span className={`text-xs px-2 py-0.5 border capitalize ${STATUS_STYLE[status]}`}>{status.replace("_", " ")}</span>
                                        </div>
                                        <h3 className="text-sm font-semibold text-white mb-1 font-body">{d.title}</h3>
                                        <p className="text-xs text-gray-600 mb-3">Weight: {d.weight_pct}% - {d.task_count || d.tasks_total} tasks</p>
                                        <div className="flex justify-between text-xs mb-1">
                                            <span className="text-gray-600">{d.tasks_completed} of {d.tasks_total} completed</span>
                                            <span className="text-gray-500">{Math.round(progress)}%</span>
                                        </div>
                                        <div className="h-1 bg-gray-800 rounded-full overflow-hidden">
                                            <div className="h-full bg-white rounded-full progress-bar" style={{ width: `${progress}%` }} />
                                        </div>
                                    </Link>
                                );
                            })}
                        </div>
                    </div>

                    {/* Quick Stats + Sidebar */}
                    <div className="grid lg:grid-cols-3 gap-6">
                        {/* Stats */}
                        <div className="bg-card border border-border/40 p-5 space-y-4">
                            <h3 className="text-sm font-semibold text-white font-body">Progress</h3>
                            <div className="space-y-3 text-sm">
                                <div className="flex items-center justify-between">
                                    <span className="text-gray-400 flex items-center gap-2"><BookOpen className="w-3.5 h-3.5" /> Submissions</span>
                                    <span className="text-white">{submissions.length}</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-gray-400 flex items-center gap-2"><CheckCircle className="w-3.5 h-3.5" /> Passed</span>
                                    <span className="text-white">{passedSubmissions}</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-gray-400 flex items-center gap-2"><Clock className="w-3.5 h-3.5" /> Pending Review</span>
                                    <span className="text-white">{pendingSubmissions}</span>
                                </div>
                            </div>
                        </div>

                        {/* Upcoming */}
                        <div className="bg-card border border-border/40 p-5 space-y-3">
                            <h3 className="text-sm font-semibold text-white font-body">Upcoming</h3>
                            {mentor && nextSession && (
                                <div className="text-xs text-gray-400">
                                    <p className="text-white text-sm">Next Mentor Session</p>
                                    <p className="mt-1">{nextSession.date} at {nextSession.time} {nextSession.timezone}</p>
                                    <p className="text-gray-600 mt-0.5">{mentor.name}, {mentor.credential}</p>
                                </div>
                            )}
                            {!nextSession && <p className="text-xs text-gray-600">No upcoming sessions</p>}
                        </div>

                        {/* Activity Feed */}
                        <div className="bg-card border border-border/40 p-5 space-y-3">
                            <h3 className="text-sm font-semibold text-white font-body">Cohort Activity</h3>
                            <div className="space-y-2 max-h-48 overflow-y-auto">
                                {activity.slice(0, 8).map(a => (
                                    <div key={a.id} className="text-xs text-gray-500 py-1 border-b border-border/10 last:border-0">
                                        <span className="text-gray-400">{a.actor_name}</span> {a.content}
                                    </div>
                                ))}
                                {activity.length === 0 && <p className="text-xs text-gray-600">No recent activity</p>}
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
