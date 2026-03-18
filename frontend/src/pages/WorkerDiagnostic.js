import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { EnterpriseSidebar } from "./EnterpriseDashboard";
import { ArrowLeft, ChevronRight } from "lucide-react";

const FLAG = { "Jamaica": "JM", "Canada": "CA", "USA": "US", "Barbados": "BB", "Trinidad and Tobago": "TT", "Curacao": "CW" };
const DIR_COLOR = { rising: "text-blue-400 bg-blue-500/10 border-blue-500/20", stable: "text-gray-400 bg-gray-500/10 border-gray-500/20", at_risk: "text-red-400 bg-red-500/10 border-red-500/20" };
const DIR_LABEL = { rising: "Rising / Specializing", stable: "Stable", at_risk: "At Risk / Commoditizing" };
const TASK_COLOR = { rising: "bg-blue-500", stable: "bg-gray-500", commoditizing: "bg-red-500" };

export default function WorkerDiagnostic() {
    const { workerId } = useParams();
    const { api, user } = useAuth();
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const load = async () => {
            try {
                const eid = user?.enterprise_id;
                if (!eid) return;
                const res = await api.get(`/enterprise/${eid}/workers/${workerId}`);
                setData(res.data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        load();
    }, [api, user, workerId]);

    if (loading) {
        return (
            <div className="flex">
                <EnterpriseSidebar current="" />
                <main className="ml-56 flex-1 p-8">
                    <div className="animate-pulse space-y-6">
                        <div className="h-8 bg-card rounded w-1/3" />
                        <div className="h-32 bg-card rounded" />
                    </div>
                </main>
            </div>
        );
    }

    const w = data?.worker || {};
    const cohort = data?.cohort;
    const gaugePercent = ((w.displacement_direction_score || 5) / 10) * 100;

    return (
        <div className="flex">
            <EnterpriseSidebar current="" />
            <main className="ml-56 flex-1 p-8 min-h-screen" data-testid="worker-diagnostic">
                <div className="max-w-5xl space-y-8">
                    <Link to="/enterprise/heatmap" className="flex items-center gap-1 text-xs text-gray-500 hover:text-white transition-colors" data-testid="back-to-heatmap">
                        <ArrowLeft className="w-3 h-3" /> Back to Heatmap
                    </Link>

                    {/* Header */}
                    <div>
                        <h1 className="text-3xl font-display font-bold text-white" data-testid="worker-name">{w.name}</h1>
                        <div className="flex flex-wrap items-center gap-3 mt-2 text-sm text-gray-400">
                            <span>{w.role_title}</span>
                            <span className="text-gray-700">|</span>
                            <span>{w.department}</span>
                            <span className="text-gray-700">|</span>
                            <span>{w.country}</span>
                            {w.manager_name && <><span className="text-gray-700">|</span><span className="text-gray-600">Manager: {w.manager_name}</span></>}
                        </div>
                    </div>

                    {/* Score Cards */}
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4" data-testid="score-cards">
                        <div className="bg-card border border-border/40 p-4">
                            <p className="text-xs text-gray-600 mb-2">Self-Assessment</p>
                            <p className="text-2xl font-bold text-white">{w.sa_score?.toFixed(2) || "-"}</p>
                            <div className="w-full h-1.5 bg-gray-800 mt-2 rounded-full overflow-hidden">
                                <div className="h-full bg-white rounded-full progress-bar" style={{ width: `${((w.sa_score || 0) / 5) * 100}%` }} />
                            </div>
                            <p className="text-xs text-gray-600 mt-1">/ 5.0</p>
                        </div>
                        <div className="bg-card border border-border/40 p-4">
                            <p className="text-xs text-gray-600 mb-2">Manager Validation</p>
                            <p className="text-2xl font-bold text-white">{w.mv_score?.toFixed(2) || "Pending"}</p>
                            {w.mv_score && (
                                <div className="w-full h-1.5 bg-gray-800 mt-2 rounded-full overflow-hidden">
                                    <div className="h-full bg-white rounded-full progress-bar" style={{ width: `${((w.mv_score || 0) / 5) * 100}%` }} />
                                </div>
                            )}
                            <p className="text-xs text-gray-600 mt-1">{w.mv_score ? "/ 5.0" : ""}</p>
                        </div>
                        <div className="bg-card border border-border/40 p-4">
                            <p className="text-xs text-gray-600 mb-2">Self-Awareness Gap</p>
                            <p className="text-2xl font-bold text-white">{w.self_awareness_gap != null ? w.self_awareness_gap.toFixed(2) : "-"}</p>
                            <span className={`inline-block text-xs px-2 py-0.5 mt-2 ${w.self_awareness_label === "Humble" ? "text-green-400 bg-green-500/10" : w.self_awareness_label === "Over-estimates" ? "text-amber-400 bg-amber-500/10" : "text-gray-400 bg-gray-500/10"}`}>
                                {w.self_awareness_label || "Pending"}
                            </span>
                        </div>
                        <div className="bg-card border border-border/40 p-4">
                            <p className="text-xs text-gray-600 mb-2">Displacement Direction</p>
                            <p className="text-2xl font-bold text-white">{w.displacement_direction_score || "-"}</p>
                            <span className={`inline-block text-xs px-2 py-0.5 mt-2 border ${DIR_COLOR[w.displacement_category] || DIR_COLOR.stable}`}>
                                {DIR_LABEL[w.displacement_category] || "Unknown"}
                            </span>
                        </div>
                    </div>

                    {/* Displacement Gauge */}
                    <div className="bg-card border border-border/40 p-6" data-testid="displacement-gauge">
                        <h2 className="text-sm font-semibold text-white mb-4 font-body">Displacement Direction</h2>
                        <div className="relative h-6 bg-gradient-to-r from-red-500/30 via-gray-500/30 to-blue-500/30 rounded-full overflow-hidden">
                            <div className="absolute top-0 h-full w-3 bg-white rounded-full shadow-lg transform -translate-x-1/2 transition-all duration-500"
                                style={{ left: `${gaugePercent}%` }} />
                        </div>
                        <div className="flex justify-between text-xs text-gray-600 mt-2">
                            <span>Commoditizing</span>
                            <span>Stable</span>
                            <span>Specializing</span>
                        </div>
                        {w.displacement_interpretation && (
                            <p className="text-sm text-gray-400 mt-4 leading-relaxed">{w.displacement_interpretation}</p>
                        )}
                    </div>

                    {/* Task Decomposition */}
                    {w.tasks && w.tasks.length > 0 && (
                        <div className="bg-card border border-border/40 p-6" data-testid="task-decomposition">
                            <h2 className="text-sm font-semibold text-white mb-4 font-body">Role Task Analysis</h2>
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm">
                                    <thead>
                                        <tr className="text-xs text-gray-600 border-b border-border/40">
                                            <th className="text-left pb-2 font-normal">Task</th>
                                            <th className="text-left pb-2 font-normal">AI Impact</th>
                                            <th className="text-left pb-2 font-normal">Direction</th>
                                            <th className="text-left pb-2 font-normal">Description</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {w.tasks.map((t, i) => (
                                            <tr key={i} className="border-b border-border/20 last:border-0">
                                                <td className="py-3 text-white pr-4">{t.name}</td>
                                                <td className="py-3 text-gray-400 pr-4 text-xs">{t.ai_impact?.replace(/_/g, " ")}</td>
                                                <td className="py-3 pr-4">
                                                    <span className="flex items-center gap-1.5">
                                                        <span className={`w-2 h-2 rounded-full ${TASK_COLOR[t.direction] || "bg-gray-500"}`} />
                                                        <span className="text-xs text-gray-400 capitalize">{t.direction}</span>
                                                    </span>
                                                </td>
                                                <td className="py-3 text-xs text-gray-500">{t.description}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {/* Pathway Recommendation */}
                    <div className="bg-card border border-border/40 p-6" data-testid="pathway-recommendation">
                        <h2 className="text-sm font-semibold text-white mb-3 font-body">Pathway Recommendation</h2>
                        <span className={`inline-block text-xs px-3 py-1 mb-3 border capitalize ${w.pathway_type === "acceleration" ? "text-blue-400 border-blue-500/20" : w.pathway_type === "reallocation" ? "text-red-400 border-red-500/20" : "text-gray-400 border-gray-500/20"}`}>
                            {w.pathway_type || "Upskilling"}
                        </span>
                        <p className="text-sm text-gray-400 leading-relaxed">{w.pathway_recommendation}</p>
                    </div>

                    {/* Manager Feedback */}
                    {w.mv_status === "completed" && w.manager_top_quote && w.manager_top_quote !== "Pending manager validation." && (
                        <div className="bg-card border border-border/40 p-6" data-testid="manager-feedback">
                            <h2 className="text-sm font-semibold text-white mb-3 font-body">Manager Feedback</h2>
                            {w.builder_classification && (
                                <span className="inline-block text-xs px-3 py-1 mb-3 bg-white/10 text-white">{w.builder_classification}</span>
                            )}
                            <blockquote className="text-sm text-gray-400 italic border-l-2 border-white/20 pl-4 mb-3">"{w.manager_top_quote}"</blockquote>
                            {w.manager_development_note && (
                                <p className="text-xs text-gray-500"><span className="text-gray-400">Development recommendation:</span> {w.manager_development_note}</p>
                            )}
                        </div>
                    )}

                    {/* Cohort Assignment */}
                    <div className="bg-card border border-border/40 p-4">
                        {cohort ? (
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-gray-400">Assigned to <span className="text-white">{cohort.name}</span> ({cohort.start_date} - {cohort.end_date})</span>
                                <Link to="/enterprise/cohorts" className="text-xs text-gray-500 hover:text-white flex items-center gap-1">View Cohort <ChevronRight className="w-3 h-3" /></Link>
                            </div>
                        ) : (
                            <span className="text-sm text-gray-500">Not yet assigned to a cohort</span>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
}
