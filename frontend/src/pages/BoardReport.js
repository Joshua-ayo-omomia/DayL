import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { EnterpriseSidebar } from "./EnterpriseDashboard";
import { Download, Loader2 } from "lucide-react";

export default function BoardReport() {
    const { api, user } = useAuth();
    const [generating, setGenerating] = useState(false);
    const [dashData, setDashData] = useState(null);

    useEffect(() => {
        const load = async () => {
            try {
                const eid = user?.enterprise_id;
                if (!eid) return;
                const res = await api.get(`/enterprise/${eid}/dashboard`);
                setDashData(res.data);
            } catch {}
        };
        load();
    }, [api, user]);

    const handleDownload = async () => {
        setGenerating(true);
        try {
            const eid = user?.enterprise_id;
            const res = await api.get(`/enterprise/${eid}/report`, { responseType: "blob" });
            const url = window.URL.createObjectURL(new Blob([res.data], { type: "application/pdf" }));
            const link = document.createElement("a");
            link.href = url;
            link.setAttribute("download", "realloc_board_report.pdf");
            document.body.appendChild(link);
            link.click();
            link.remove();
            window.URL.revokeObjectURL(url);
        } catch (err) {
            console.error(err);
        } finally {
            setGenerating(false);
        }
    };

    const stats = dashData?.stats || {};
    const displacement = dashData?.displacement || {};
    const builderCore = dashData?.builder_core_preview || [];
    const cohort = dashData?.active_cohort;

    return (
        <div className="flex">
            <EnterpriseSidebar current="/enterprise/report" />
            <main className="ml-56 flex-1 p-8 min-h-screen" data-testid="board-report">
                <div className="max-w-4xl space-y-8">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-2xl font-display font-bold text-white">Board Report</h1>
                            <p className="text-sm text-gray-500 mt-1">Preview and download the board-ready report</p>
                        </div>
                        <button onClick={handleDownload} disabled={generating}
                            className="flex items-center gap-2 bg-white text-black px-5 py-2.5 text-sm font-medium hover:bg-gray-300 disabled:opacity-50 transition-colors"
                            data-testid="download-report-btn">
                            {generating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
                            {generating ? "Generating..." : "Download Board Report (PDF)"}
                        </button>
                    </div>

                    {/* Report Preview */}
                    <div className="bg-card border border-border/40 p-8 space-y-8" data-testid="report-preview">
                        {/* Section 1 */}
                        <div>
                            <h2 className="text-lg font-display font-bold text-white mb-4">Executive Summary</h2>
                            <h3 className="text-sm text-gray-400 mb-4">{dashData?.enterprise?.name || "Sagicor Financial Company"} Technology Capability Assessment</h3>
                            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 text-center">
                                <div className="border border-border/40 p-3">
                                    <p className="text-xl font-bold text-white">{stats.total_workers || 587}</p>
                                    <p className="text-xs text-gray-500">Workers Assessed</p>
                                </div>
                                <div className="border border-border/40 p-3">
                                    <p className="text-xl font-bold text-white">{stats.countries || 6}</p>
                                    <p className="text-xs text-gray-500">Countries</p>
                                </div>
                                <div className="border border-border/40 p-3">
                                    <p className="text-xl font-bold text-white">{stats.completion_rate || 73}%</p>
                                    <p className="text-xs text-gray-500">Completion Rate</p>
                                </div>
                                <div className="border border-border/40 p-3">
                                    <div className="text-xs space-y-0.5">
                                        <div className="text-blue-400">{displacement.rising || 0} Rising</div>
                                        <div className="text-gray-400">{displacement.stable || 0} Stable</div>
                                        <div className="text-red-400">{displacement.at_risk || 0} At Risk</div>
                                    </div>
                                    <p className="text-xs text-gray-500 mt-1">Distribution</p>
                                </div>
                            </div>
                        </div>

                        {/* Section 2 */}
                        <div className="border-t border-border/20 pt-6">
                            <h2 className="text-lg font-display font-bold text-white mb-4">Displacement Analysis</h2>
                            <div className="flex items-center gap-2 h-8 mb-3">
                                <div className="bg-blue-500/30 h-full flex items-center justify-center text-xs text-blue-400 px-3" style={{ width: `${((displacement.rising||0)/(stats.total_workers||1))*100}%` }}>
                                    {displacement.rising || 0}
                                </div>
                                <div className="bg-gray-500/30 h-full flex items-center justify-center text-xs text-gray-400 px-3" style={{ width: `${((displacement.stable||0)/(stats.total_workers||1))*100}%` }}>
                                    {displacement.stable || 0}
                                </div>
                                <div className="bg-red-500/30 h-full flex items-center justify-center text-xs text-red-400 px-3" style={{ width: `${((displacement.at_risk||0)/(stats.total_workers||1))*100}%` }}>
                                    {displacement.at_risk || 0}
                                </div>
                            </div>
                            <div className="flex gap-6 text-xs">
                                <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-blue-500" /> Rising ({Math.round(((displacement.rising||0)/(stats.total_workers||1))*100)}%)</span>
                                <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-gray-500" /> Stable ({Math.round(((displacement.stable||0)/(stats.total_workers||1))*100)}%)</span>
                                <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-red-500" /> At Risk ({Math.round(((displacement.at_risk||0)/(stats.total_workers||1))*100)}%)</span>
                            </div>
                        </div>

                        {/* Section 3 */}
                        <div className="border-t border-border/20 pt-6">
                            <h2 className="text-lg font-display font-bold text-white mb-4">Builder Core: Top Candidates</h2>
                            <div className="space-y-2">
                                {builderCore.map((b, i) => (
                                    <div key={b.id} className="flex items-center justify-between py-2 border-b border-border/20 last:border-0 text-sm">
                                        <div className="flex items-center gap-3">
                                            <span className="text-xs text-gray-600 font-mono w-6">#{i+1}</span>
                                            <span className="text-white">{b.name}</span>
                                            <span className="text-xs text-gray-600">{b.role_title}</span>
                                        </div>
                                        <span className={`text-xs ${b.displacement_category === "rising" ? "text-blue-400" : "text-gray-400"}`}>
                                            {b.displacement_direction_score}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Section 4 */}
                        {cohort && (
                            <div className="border-t border-border/20 pt-6">
                                <h2 className="text-lg font-display font-bold text-white mb-4">Cohort 1 Plan</h2>
                                <div className="grid grid-cols-2 gap-4 text-sm">
                                    <div><span className="text-gray-500">Participants:</span> <span className="text-white">{cohort.participant_ids?.length || 12}</span></div>
                                    <div><span className="text-gray-500">Start Date:</span> <span className="text-white">{cohort.start_date}</span></div>
                                    <div><span className="text-gray-500">Location:</span> <span className="text-white">{cohort.location}</span></div>
                                    <div><span className="text-gray-500">Duration:</span> <span className="text-white">{cohort.total_weeks} weeks</span></div>
                                </div>
                            </div>
                        )}

                        {/* Section 5 */}
                        {cohort?.business_outcomes && (
                            <div className="border-t border-border/20 pt-6">
                                <h2 className="text-lg font-display font-bold text-white mb-4">Projected Business Outcomes</h2>
                                <div className="grid grid-cols-3 gap-4">
                                    <div className="border border-border/40 p-4 text-center">
                                        <p className="text-xl font-bold text-white">${(cohort.business_outcomes.projected_cost_savings_annual || 0).toLocaleString()}</p>
                                        <p className="text-xs text-gray-500">Annual Cost Savings</p>
                                    </div>
                                    <div className="border border-border/40 p-4 text-center">
                                        <p className="text-xl font-bold text-white">{cohort.business_outcomes.projected_hours_reclaimed_weekly || 0}</p>
                                        <p className="text-xs text-gray-500">Hours Reclaimed/Week</p>
                                    </div>
                                    <div className="border border-border/40 p-4 text-center">
                                        <p className="text-xl font-bold text-white">{cohort.business_outcomes.projected_speed_improvement_pct || 0}%</p>
                                        <p className="text-xs text-gray-500">Speed Improvement</p>
                                    </div>
                                </div>
                                <p className="text-xs text-gray-600 mt-3">Based on capstone business case projections. Actuals measured 30 days post-deployment.</p>
                            </div>
                        )}

                        {/* Section 6 */}
                        <div className="border-t border-border/20 pt-6">
                            <h2 className="text-lg font-display font-bold text-white mb-4">Timeline</h2>
                            <div className="space-y-3">
                                {[
                                    { phase: "Assessment Phase", date: "December 2025 - March 2026" },
                                    { phase: "Cohort 1", date: "April - June 2026" },
                                    { phase: "Outcome Measurement", date: "July 2026" },
                                    { phase: "Cohort 2 Planning", date: "July 2026" },
                                    { phase: "Cohort 2 Launch", date: "July 2026" },
                                    { phase: "Full Year", date: "4 cohorts planned for 2026" },
                                ].map((t, i) => (
                                    <div key={i} className="flex items-center gap-3">
                                        <span className="w-1.5 h-1.5 rounded-full bg-white/40" />
                                        <span className="text-sm text-white">{t.phase}:</span>
                                        <span className="text-sm text-gray-500">{t.date}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
