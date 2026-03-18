import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { EnterpriseSidebar } from "./EnterpriseDashboard";
import { ScatterChart, Scatter, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { ChevronRight } from "lucide-react";

const GAP_STYLE = { "Humble": "text-white bg-white/10", "Aligned": "text-gray-400 bg-gray-500/10", "Over-estimates": "text-amber-400 bg-amber-500/10", "Pending": "text-gray-500 bg-gray-800" };

export default function BuilderCore() {
    const { api, user } = useAuth();
    const [candidates, setCandidates] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const load = async () => {
            try {
                const eid = user?.enterprise_id;
                if (!eid) return;
                const res = await api.get(`/enterprise/${eid}/builder-core`);
                setCandidates(res.data.candidates || []);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        load();
    }, [api, user]);

    const scatterData = candidates.filter(c => c.mv_score).map(c => ({
        x: c.mv_score || 3,
        y: c.sa_score || 3,
        name: c.name,
        category: c.displacement_category,
        id: c.id,
    }));

    return (
        <div className="flex">
            <EnterpriseSidebar current="/enterprise/builder-core" />
            <main className="ml-56 flex-1 p-8 min-h-screen" data-testid="builder-core-page">
                <div className="max-w-5xl space-y-8">
                    <div>
                        <h1 className="text-2xl font-display font-bold text-white">Builder Core</h1>
                        <p className="text-sm text-gray-500 mt-1">Top candidates for cohort selection</p>
                    </div>

                    {/* Selection Criteria */}
                    <div className="grid md:grid-cols-3 gap-4">
                        {[
                            { title: "Manager Validation", desc: "Prioritized individuals whose direct managers rated them highest and classified them as Core Builders." },
                            { title: "Self-Awareness", desc: "Prioritized candidates who demonstrate accurate or humble self-assessment, as this predicts stronger training outcomes." },
                            { title: "Strategic Role Relevance", desc: "Prioritized roles on the critical path of AI deployment: data analytics, infrastructure, application modernization, enterprise risk." },
                        ].map(c => (
                            <div key={c.title} className="bg-card border border-border/40 p-4">
                                <h3 className="text-xs font-semibold text-white mb-1 font-body">{c.title}</h3>
                                <p className="text-xs text-gray-500 leading-relaxed">{c.desc}</p>
                            </div>
                        ))}
                    </div>

                    {/* Mini Scatter Plot */}
                    {scatterData.length > 0 && (
                        <div className="bg-card border border-border/40 p-4" data-testid="builder-scatter">
                            <h2 className="text-xs font-semibold text-gray-400 mb-3 font-body">Capability vs Engagement</h2>
                            <ResponsiveContainer width="100%" height={200}>
                                <ScatterChart margin={{ top: 10, right: 10, bottom: 10, left: 10 }}>
                                    <XAxis type="number" dataKey="x" domain={[2, 5]} tick={{ fill: '#6B7280', fontSize: 10 }} name="MV Score" />
                                    <YAxis type="number" dataKey="y" domain={[2, 5]} tick={{ fill: '#6B7280', fontSize: 10 }} name="SA Score" />
                                    <Tooltip content={({ active, payload }) => {
                                        if (active && payload?.length) {
                                            return <div className="bg-card border border-border/40 p-2 text-xs text-white">{payload[0].payload.name}</div>;
                                        }
                                        return null;
                                    }} />
                                    <Scatter data={scatterData}>
                                        {scatterData.map((e, i) => (
                                            <Cell key={i} fill={e.category === "rising" ? "#3B82F6" : e.category === "at_risk" ? "#EF4444" : "#6B7280"} r={6} />
                                        ))}
                                    </Scatter>
                                </ScatterChart>
                            </ResponsiveContainer>
                        </div>
                    )}

                    {/* Candidate List */}
                    <div className="space-y-4" data-testid="builder-list">
                        {loading ? (
                            <div className="flex items-center justify-center py-12"><div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin" /></div>
                        ) : (
                            candidates.map((c, i) => (
                                <div key={c.id} className="bg-card border border-border/40 p-5 veneer-card group" data-testid={`builder-card-${i}`}>
                                    <div className="flex items-start justify-between">
                                        <div className="flex gap-4">
                                            <span className="text-lg font-bold text-gray-700 font-mono">#{i + 1}</span>
                                            <div>
                                                <h3 className="text-base font-semibold text-white">{c.name}</h3>
                                                <p className="text-xs text-gray-500 mt-0.5">{c.role_title} - {c.department}</p>
                                                <p className="text-xs text-gray-600">{c.country}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <span className={`text-xs px-2 py-0.5 ${GAP_STYLE[c.self_awareness_label] || GAP_STYLE.Pending}`}>
                                                {c.self_awareness_label || "Pending"}
                                            </span>
                                            {c.builder_classification && (
                                                <span className="text-xs px-2 py-0.5 bg-white/10 text-white border border-white/20">
                                                    {c.builder_classification}
                                                </span>
                                            )}
                                        </div>
                                    </div>

                                    {/* Score bars */}
                                    <div className="grid grid-cols-2 gap-4 mt-4">
                                        <div>
                                            <div className="flex justify-between text-xs mb-1">
                                                <span className="text-gray-600">Self-Assessment</span>
                                                <span className="text-gray-400">{c.sa_score?.toFixed(2)}</span>
                                            </div>
                                            <div className="h-1.5 bg-gray-800 rounded-full overflow-hidden">
                                                <div className="h-full bg-white/60 rounded-full progress-bar" style={{ width: `${((c.sa_score || 0) / 5) * 100}%` }} />
                                            </div>
                                        </div>
                                        <div>
                                            <div className="flex justify-between text-xs mb-1">
                                                <span className="text-gray-600">Manager Validation</span>
                                                <span className="text-gray-400">{c.mv_score?.toFixed(2) || "Pending"}</span>
                                            </div>
                                            <div className="h-1.5 bg-gray-800 rounded-full overflow-hidden">
                                                {c.mv_score && <div className="h-full bg-white rounded-full progress-bar" style={{ width: `${((c.mv_score || 0) / 5) * 100}%` }} />}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Quote and link */}
                                    {c.manager_top_quote && c.manager_top_quote !== "Pending manager validation." && (
                                        <p className="text-xs text-gray-500 italic mt-3 border-l-2 border-white/10 pl-3">"{c.manager_top_quote}"</p>
                                    )}
                                    <div className="flex justify-end mt-3">
                                        <Link to={`/enterprise/worker/${c.id}`} className="text-xs text-gray-500 hover:text-white transition-colors flex items-center gap-1">
                                            View Full Diagnostic <ChevronRight className="w-3 h-3" />
                                        </Link>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
}
