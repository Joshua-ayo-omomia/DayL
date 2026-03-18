import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { motion } from "framer-motion";
import { BarChart3, Globe, Users, TrendingUp, Bell, LogOut, Map, Star, Layers, FileText, ChevronRight, DollarSign, ShieldCheck, Activity } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

const NAV_ITEMS = [
    { to: "/enterprise", icon: BarChart3, label: "Dashboard" },
    { to: "/enterprise/heatmap", icon: Map, label: "Workforce Heatmap" },
    { to: "/enterprise/builder-core", icon: Star, label: "Builder Core" },
    { to: "/enterprise/cohorts", icon: Layers, label: "Cohorts" },
    { to: "/enterprise/report", icon: FileText, label: "Board Report" },
];

export const EnterpriseSidebar = ({ current }) => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [notifications, setNotifications] = useState([]);
    const [showNotifs, setShowNotifs] = useState(false);
    const { api } = useAuth();

    useEffect(() => {
        api.get("/notifications").then(r => setNotifications(r.data.notifications || [])).catch(() => {});
    }, []);

    const unread = notifications.filter(n => !n.read).length;

    return (
        <aside className="w-56 min-h-screen bg-card border-r border-border/40 flex flex-col fixed left-0 top-0" data-testid="enterprise-sidebar">
            <div className="p-5 border-b border-border/40">
                <Link to="/" className="text-lg font-bold text-white font-body">Realloc</Link>
                <p className="text-xs text-gray-600 mt-0.5">Enterprise</p>
            </div>
            <nav className="flex-1 py-4 space-y-1 px-2">
                {NAV_ITEMS.map(item => (
                    <Link key={item.to} to={item.to}
                        className={`flex items-center gap-3 px-3 py-2 text-sm rounded transition-colors ${current === item.to ? "bg-white/10 text-white" : "text-gray-500 hover:text-white hover:bg-white/5"}`}
                        data-testid={`nav-${item.label.toLowerCase().replace(/\s/g, '-')}`}>
                        <item.icon className="w-4 h-4" />
                        {item.label}
                    </Link>
                ))}
            </nav>
            <div className="p-4 border-t border-border/40 space-y-3">
                <div className="relative">
                    <button onClick={() => setShowNotifs(!showNotifs)} className="flex items-center gap-2 text-xs text-gray-500 hover:text-white transition-colors w-full" data-testid="notification-bell">
                        <Bell className="w-4 h-4" />
                        Notifications
                        {unread > 0 && <span className="ml-auto bg-white text-black text-xs w-5 h-5 flex items-center justify-center rounded-full font-bold">{unread}</span>}
                    </button>
                    {showNotifs && notifications.length > 0 && (
                        <div className="absolute bottom-8 left-0 w-72 bg-card border border-border/40 shadow-xl p-3 space-y-2 z-50">
                            {notifications.map(n => (
                                <div key={n.id} className="text-xs text-gray-400 py-1 border-b border-border/20 last:border-0">{n.content}</div>
                            ))}
                        </div>
                    )}
                </div>
                <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-600 truncate">{user?.name}</span>
                    <button onClick={() => { logout(); navigate("/"); }} className="text-gray-600 hover:text-white transition-colors" data-testid="logout-btn">
                        <LogOut className="w-4 h-4" />
                    </button>
                </div>
            </div>
        </aside>
    );
};

export default function EnterpriseDashboard() {
    const { api, user } = useAuth();
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [enterpriseId, setEnterpriseId] = useState(null);

    useEffect(() => {
        const fetchEnterprise = async () => {
            try {
                const analytics = await api.get("/admin/analytics");
                // Get enterprise ID from first enterprise
                const eid = user?.enterprise_id;
                if (!eid) {
                    // Fallback: find the enterprise
                    const res = await api.get("/health");
                    // Try to get from workers
                }
                // For demo, we'll get all enterprise IDs from a simple approach
                // Fetch heatmap to get the enterprise data
            } catch {}
        };

        const loadDashboard = async () => {
            try {
                // Get enterprise_id - try from user first, then from any available enterprise
                let eid = user?.enterprise_id;
                if (!eid) {
                    // Fetch from analytics or heatmap
                    const resp = await api.get("/admin/analytics");
                    if (resp.data) {
                        // We need the enterprise id, let's get it
                    }
                }
                if (eid) {
                    const res = await api.get(`/enterprise/${eid}/dashboard`);
                    setData(res.data);
                    setEnterpriseId(eid);
                }
            } catch (err) {
                console.error("Dashboard load error:", err);
            } finally {
                setLoading(false);
            }
        };
        loadDashboard();
    }, [api, user]);

    if (loading) {
        return (
            <div className="flex">
                <EnterpriseSidebar current="/enterprise" />
                <main className="ml-56 flex-1 p-8">
                    <div className="animate-pulse space-y-6">
                        <div className="h-8 bg-card rounded w-1/3" />
                        <div className="grid grid-cols-4 gap-4">{[1,2,3,4].map(i => <div key={i} className="h-24 bg-card rounded" />)}</div>
                    </div>
                </main>
            </div>
        );
    }

    const stats = data?.stats || {};
    const displacement = data?.displacement || {};
    const builderPreview = data?.builder_core_preview || [];
    const activeCohort = data?.active_cohort;

    return (
        <div className="flex">
            <EnterpriseSidebar current="/enterprise" />
            <main className="ml-56 flex-1 p-8 min-h-screen" data-testid="enterprise-dashboard">
                <div className="max-w-6xl space-y-8">
                    <div>
                        <h1 className="text-2xl font-display font-bold text-white">Enterprise Dashboard</h1>
                        <p className="text-sm text-gray-500 mt-1">{data?.enterprise?.name || "Sagicor Financial Company"}</p>
                    </div>

                    {/* Stat Cards */}
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                        {[
                            { label: "Workers Assessed", value: stats.total_workers || 0, icon: Users },
                            { label: "Countries", value: stats.countries || 0, icon: Globe },
                            { label: "Active Cohorts", value: stats.active_cohorts || 0, icon: Layers },
                            { label: "Assessment Completion", value: `${stats.completion_rate || 0}%`, icon: TrendingUp },
                        ].map((s, i) => (
                            <motion.div key={s.label} className="bg-card border border-border/40 p-5 veneer-card"
                                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                                data-testid={`stat-${s.label.toLowerCase().replace(/\s/g, '-')}`}>
                                <s.icon className="w-4 h-4 text-gray-600 mb-3" />
                                <p className="text-2xl font-bold text-white">{s.value}</p>
                                <p className="text-xs text-gray-500 mt-1">{s.label}</p>
                            </motion.div>
                        ))}
                    </div>

                    {/* Displacement Distribution */}
                    <div className="bg-card border border-border/40 p-6" data-testid="displacement-distribution">
                        <h2 className="text-sm font-semibold text-white mb-4 font-body">Displacement Distribution</h2>
                        <div className="grid grid-cols-3 gap-4">
                            <div className="text-center p-4 border border-blue-500/20 bg-blue-500/5">
                                <p className="text-3xl font-bold text-blue-400">{displacement.rising || 0}</p>
                                <p className="text-xs text-blue-400/70 mt-1">Rising</p>
                                <p className="text-xs text-gray-600 mt-1">Roles specializing. AI removes routine work.</p>
                            </div>
                            <div className="text-center p-4 border border-gray-500/20 bg-gray-500/5">
                                <p className="text-3xl font-bold text-gray-400">{displacement.stable || 0}</p>
                                <p className="text-xs text-gray-400/70 mt-1">Stable</p>
                                <p className="text-xs text-gray-600 mt-1">Monitoring required. Displacement direction unclear.</p>
                            </div>
                            <div className="text-center p-4 border border-red-500/20 bg-red-500/5">
                                <p className="text-3xl font-bold text-red-400">{displacement.at_risk || 0}</p>
                                <p className="text-xs text-red-400/70 mt-1">At Risk</p>
                                <p className="text-xs text-gray-600 mt-1">Roles commoditizing. AI automates expertise.</p>
                            </div>
                        </div>
                    </div>

                    {/* ROI Projection + Risk Reduction side-by-side */}
                    <div className="grid lg:grid-cols-2 gap-6">
                        {/* ROI Panel */}
                        <div className="bg-card border border-border/40 p-6" data-testid="roi-panel">
                            <div className="flex items-center gap-2 mb-4">
                                <DollarSign className="w-4 h-4 text-gray-600" />
                                <h2 className="text-sm font-semibold text-white font-body">ROI Projection</h2>
                            </div>
                            {data?.roi_data && (
                                <div className="space-y-4">
                                    <div className="grid grid-cols-2 gap-3">
                                        <div className="p-3 border border-green-500/20 bg-green-500/5">
                                            <p className="text-xs text-gray-500 mb-1">Cost to Retrain</p>
                                            <p className="text-lg font-bold text-green-400">${(data.roi_data.cost_to_retrain || 0).toLocaleString()}</p>
                                            <p className="text-xs text-gray-600">{data.roi_data.workers_in_training} workers x ${(data.roi_data.retrain_cost_per_worker || 0).toLocaleString()}</p>
                                        </div>
                                        <div className="p-3 border border-red-500/20 bg-red-500/5">
                                            <p className="text-xs text-gray-500 mb-1">Cost to Replace</p>
                                            <p className="text-lg font-bold text-red-400">${(data.roi_data.cost_to_replace || 0).toLocaleString()}</p>
                                            <p className="text-xs text-gray-600">{data.roi_data.workers_in_training} workers x ${(data.roi_data.external_hire_cost || 0).toLocaleString()}</p>
                                        </div>
                                    </div>
                                    <div className="p-4 border border-white/10 bg-white/[0.02]">
                                        <p className="text-xs text-gray-500 mb-1">Projected Annual Savings</p>
                                        <p className="text-2xl font-bold text-white">${(data.roi_data.projected_annual_savings || 0).toLocaleString()}</p>
                                        <p className="text-xs text-gray-600 mt-1">vs. external hiring and onboarding</p>
                                    </div>
                                    {data.roi_data.business_outcomes?.projected_hours_reclaimed_weekly && (
                                        <div className="flex gap-3">
                                            <div className="flex-1 text-center p-2 border border-white/5">
                                                <p className="text-sm font-bold text-white">{data.roi_data.business_outcomes.projected_hours_reclaimed_weekly}h</p>
                                                <p className="text-xs text-gray-600">Hours Reclaimed / Week</p>
                                            </div>
                                            <div className="flex-1 text-center p-2 border border-white/5">
                                                <p className="text-sm font-bold text-white">{data.roi_data.business_outcomes.projected_speed_improvement_pct}%</p>
                                                <p className="text-xs text-gray-600">Speed Improvement</p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* Risk Reduction Timeline */}
                        <div className="bg-card border border-border/40 p-6" data-testid="risk-timeline">
                            <div className="flex items-center gap-2 mb-4">
                                <ShieldCheck className="w-4 h-4 text-gray-600" />
                                <h2 className="text-sm font-semibold text-white font-body">Risk Reduction Trend</h2>
                            </div>
                            {data?.risk_timeline && (
                                <div className="space-y-4">
                                    <ResponsiveContainer width="100%" height={180}>
                                        <AreaChart data={data.risk_timeline}>
                                            <defs>
                                                <linearGradient id="riskRed" x1="0" y1="0" x2="0" y2="1">
                                                    <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3} />
                                                    <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                                                </linearGradient>
                                                <linearGradient id="riskBlue" x1="0" y1="0" x2="0" y2="1">
                                                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                                                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                                                </linearGradient>
                                            </defs>
                                            <XAxis dataKey="month" tick={{ fill: "#4b5563", fontSize: 10 }} axisLine={false} tickLine={false} />
                                            <YAxis tick={{ fill: "#4b5563", fontSize: 10 }} axisLine={false} tickLine={false} domain={[0, 50]} />
                                            <Tooltip contentStyle={{ background: "#1a1a2e", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 4, fontSize: 12 }} />
                                            <Area type="monotone" dataKey="at_risk_pct" name="At Risk %" stroke="#ef4444" fill="url(#riskRed)" strokeWidth={2} />
                                            <Area type="monotone" dataKey="rising_pct" name="Rising %" stroke="#3b82f6" fill="url(#riskBlue)" strokeWidth={2} />
                                        </AreaChart>
                                    </ResponsiveContainer>
                                    <div className="flex justify-between px-2">
                                        <div className="flex items-center gap-2 text-xs">
                                            <span className="w-2 h-2 rounded-full bg-red-500" /> <span className="text-gray-500">At Risk</span>
                                            <span className="text-red-400 font-mono">{data.risk_timeline[0]?.at_risk_pct}% → {data.risk_timeline[data.risk_timeline.length - 1]?.at_risk_pct}%</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-xs">
                                            <span className="w-2 h-2 rounded-full bg-blue-500" /> <span className="text-gray-500">Rising</span>
                                            <span className="text-blue-400 font-mono">{data.risk_timeline[0]?.rising_pct}% → {data.risk_timeline[data.risk_timeline.length - 1]?.rising_pct}%</span>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Live Upskilling Progress Tracker */}
                    {data?.upskilling_progress?.length > 0 && (
                        <div className="bg-card border border-border/40 p-6" data-testid="upskilling-tracker">
                            <div className="flex items-center justify-between mb-5">
                                <div className="flex items-center gap-2">
                                    <Activity className="w-4 h-4 text-gray-600" />
                                    <h2 className="text-sm font-semibold text-white font-body">Live Upskilling Progress</h2>
                                    <span className="flex items-center gap-1 text-xs text-gray-600 ml-2">
                                        <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" /> Real-time
                                    </span>
                                </div>
                                <Link to="/enterprise/builder-core" className="text-xs text-gray-500 hover:text-white transition-colors flex items-center gap-1">
                                    View Full Builder Core <ChevronRight className="w-3 h-3" />
                                </Link>
                            </div>
                            <div className="space-y-3">
                                {data.upskilling_progress.map((p, i) => (
                                    <motion.div key={p.worker_id}
                                        initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}
                                        className="flex items-center gap-4 py-3 border-b border-border/20 last:border-0">
                                        <div className="flex-shrink-0 w-8 h-8 bg-white/[0.04] border border-white/10 rounded-full flex items-center justify-center">
                                            <span className="text-xs font-bold text-gray-400">{p.name?.charAt(0)}</span>
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2">
                                                <Link to={`/enterprise/worker/${p.worker_id}`} className="text-sm text-white hover:underline truncate">{p.name}</Link>
                                                <span className={`text-xs px-1.5 py-0.5 flex-shrink-0 ${p.displacement_category === "rising" ? "text-blue-400 bg-blue-500/10" : p.displacement_category === "at_risk" ? "text-red-400 bg-red-500/10" : "text-gray-400 bg-gray-500/10"}`}>
                                                    {p.displacement_category}
                                                </span>
                                            </div>
                                            <p className="text-xs text-gray-600 truncate">{p.track_name} — {p.current_domain}</p>
                                        </div>
                                        <div className="flex-shrink-0 w-32">
                                            <div className="flex justify-between text-xs mb-1">
                                                <span className="text-gray-600">{p.completed_tasks}/{p.total_tasks} tasks</span>
                                                <span className="text-white font-mono">{p.completion_pct}%</span>
                                            </div>
                                            <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                                                <motion.div className="h-full bg-white rounded-full"
                                                    initial={{ width: 0 }} animate={{ width: `${p.completion_pct}%` }}
                                                    transition={{ duration: 1, delay: 0.3 + i * 0.1, ease: "easeOut" }} />
                                            </div>
                                        </div>
                                        <div className="flex-shrink-0 text-right">
                                            <p className="text-xs text-gray-400">{p.passed} <span className="text-gray-600">passed</span></p>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Two panels */}
                    <div className="grid lg:grid-cols-2 gap-6">
                        {/* Builder Core Preview */}
                        <div className="bg-card border border-border/40 p-6" data-testid="builder-core-preview">
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-sm font-semibold text-white font-body">Builder Core Preview</h2>
                                <Link to="/enterprise/builder-core" className="text-xs text-gray-500 hover:text-white transition-colors flex items-center gap-1">
                                    View Full Builder Core <ChevronRight className="w-3 h-3" />
                                </Link>
                            </div>
                            <div className="space-y-3">
                                {builderPreview.map((w, i) => (
                                    <Link key={w.id} to={`/enterprise/worker/${w.id}`} className="flex items-center justify-between py-2 border-b border-border/20 last:border-0 hover:bg-white/5 px-2 -mx-2 transition-colors">
                                        <div>
                                            <p className="text-sm text-white">{w.name}</p>
                                            <p className="text-xs text-gray-600">{w.role_title} - {w.country}</p>
                                        </div>
                                        <div className="text-right">
                                            <span className={`text-xs px-2 py-0.5 ${w.displacement_category === "rising" ? "text-blue-400 bg-blue-500/10" : w.displacement_category === "at_risk" ? "text-red-400 bg-red-500/10" : "text-gray-400 bg-gray-500/10"}`}>
                                                {w.displacement_direction_score}
                                            </span>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </div>

                        {/* Active Cohort */}
                        <div className="bg-card border border-border/40 p-6" data-testid="active-cohort">
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-sm font-semibold text-white font-body">Active Cohort</h2>
                                <Link to="/enterprise/cohorts" className="text-xs text-gray-500 hover:text-white transition-colors flex items-center gap-1">
                                    View Cohorts <ChevronRight className="w-3 h-3" />
                                </Link>
                            </div>
                            {activeCohort ? (
                                <div className="space-y-3">
                                    <div className="flex items-center gap-3">
                                        <span className="text-lg font-bold text-white">{activeCohort.name}</span>
                                        <span className="text-xs bg-green-500/10 text-green-400 px-2 py-0.5">Active</span>
                                    </div>
                                    <div className="grid grid-cols-2 gap-3 text-xs">
                                        <div><span className="text-gray-600">Participants:</span> <span className="text-white">{activeCohort.participant_ids?.length || 0}</span></div>
                                        <div><span className="text-gray-600">Week:</span> <span className="text-white">{activeCohort.current_week} (Pre-Launch)</span></div>
                                        <div><span className="text-gray-600">Location:</span> <span className="text-white">{activeCohort.location}</span></div>
                                        <div><span className="text-gray-600">Start:</span> <span className="text-white">{activeCohort.start_date}</span></div>
                                    </div>
                                </div>
                            ) : (
                                <p className="text-xs text-gray-600">No active cohort</p>
                            )}
                        </div>
                    </div>

                    {/* Quick Actions */}
                    <div className="flex flex-wrap gap-3">
                        <Link to="/enterprise/report" className="flex items-center gap-2 bg-white text-black px-5 py-2.5 text-sm font-medium hover:bg-gray-300 transition-colors" data-testid="quick-generate-report">
                            <FileText className="w-4 h-4" /> Generate Board Report
                        </Link>
                        <Link to="/enterprise/heatmap" className="flex items-center gap-2 border border-border text-gray-300 px-5 py-2.5 text-sm font-medium hover:border-white hover:text-white transition-colors" data-testid="quick-heatmap">
                            <Map className="w-4 h-4" /> View Workforce Heatmap
                        </Link>
                        <Link to="/enterprise/cohorts" className="flex items-center gap-2 border border-border text-gray-300 px-5 py-2.5 text-sm font-medium hover:border-white hover:text-white transition-colors" data-testid="quick-cohorts">
                            <Layers className="w-4 h-4" /> Manage Cohorts
                        </Link>
                    </div>
                </div>
            </main>
        </div>
    );
}
