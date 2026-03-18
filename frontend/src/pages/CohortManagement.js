import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { EnterpriseSidebar } from "./EnterpriseDashboard";
import { MapPin, Calendar, Users } from "lucide-react";

const STATUS_STYLE = { active: "text-green-400 bg-green-500/10", planned: "text-gray-400 bg-gray-500/10", completed: "text-blue-400 bg-blue-500/10" };

export default function CohortManagement() {
    const { api, user } = useAuth();
    const [cohorts, setCohorts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const load = async () => {
            try {
                const eid = user?.enterprise_id;
                if (!eid) return;
                const res = await api.get(`/enterprise/${eid}/cohorts`);
                setCohorts(res.data.cohorts || []);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        load();
    }, [api, user]);

    return (
        <div className="flex">
            <EnterpriseSidebar current="/enterprise/cohorts" />
            <main className="ml-56 flex-1 p-8 min-h-screen" data-testid="cohort-management">
                <div className="max-w-5xl space-y-8">
                    <div>
                        <h1 className="text-2xl font-display font-bold text-white">Cohort Management</h1>
                        <p className="text-sm text-gray-500 mt-1">Manage training cohorts</p>
                    </div>

                    {loading ? (
                        <div className="flex items-center justify-center py-12"><div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin" /></div>
                    ) : (
                        <div className="grid md:grid-cols-2 gap-6">
                            {cohorts.map(c => (
                                <div key={c.id} className="bg-card border border-border/40 p-6 veneer-card" data-testid={`cohort-${c.name?.toLowerCase().replace(/\s/g, '-')}`}>
                                    <div className="flex items-center justify-between mb-4">
                                        <h3 className="text-lg font-semibold text-white">{c.name}</h3>
                                        <span className={`text-xs px-2 py-0.5 capitalize ${STATUS_STYLE[c.status] || STATUS_STYLE.planned}`}>{c.status}</span>
                                    </div>
                                    <div className="space-y-2 text-sm">
                                        <div className="flex items-center gap-2 text-gray-400">
                                            <Users className="w-3.5 h-3.5 text-gray-600" />
                                            {c.participant_count || c.participant_ids?.length || 0} participants
                                        </div>
                                        <div className="flex items-center gap-2 text-gray-400">
                                            <Calendar className="w-3.5 h-3.5 text-gray-600" />
                                            {c.start_date} - {c.end_date}
                                        </div>
                                        <div className="flex items-center gap-2 text-gray-400">
                                            <MapPin className="w-3.5 h-3.5 text-gray-600" />
                                            {c.location || "TBD"}
                                        </div>
                                    </div>
                                    {c.status === "active" && (
                                        <div className="mt-4">
                                            <div className="flex justify-between text-xs mb-1">
                                                <span className="text-gray-600">Week {c.current_week} of {c.total_weeks}</span>
                                                <span className="text-gray-500">{Math.round((c.current_week / c.total_weeks) * 100)}%</span>
                                            </div>
                                            <div className="h-1.5 bg-gray-800 rounded-full overflow-hidden">
                                                <div className="h-full bg-white rounded-full progress-bar" style={{ width: `${Math.max(2, (c.current_week / c.total_weeks) * 100)}%` }} />
                                            </div>
                                        </div>
                                    )}
                                    {c.mentors?.length > 0 && (
                                        <div className="mt-4 pt-3 border-t border-border/20">
                                            <p className="text-xs text-gray-600 mb-1">Mentors</p>
                                            {c.mentors.map(m => (
                                                <p key={m.name} className="text-xs text-gray-400">{m.name} - <span className="text-gray-600">{m.credential}</span></p>
                                            ))}
                                        </div>
                                    )}
                                    {c.business_outcomes?.projected_cost_savings_annual && (
                                        <div className="mt-4 pt-3 border-t border-border/20 grid grid-cols-3 gap-2 text-center text-xs">
                                            <div>
                                                <p className="text-white font-semibold">${(c.business_outcomes.projected_cost_savings_annual).toLocaleString()}</p>
                                                <p className="text-gray-600">Savings/yr</p>
                                            </div>
                                            <div>
                                                <p className="text-white font-semibold">{c.business_outcomes.projected_hours_reclaimed_weekly}</p>
                                                <p className="text-gray-600">Hrs/wk</p>
                                            </div>
                                            <div>
                                                <p className="text-white font-semibold">{c.business_outcomes.projected_speed_improvement_pct}%</p>
                                                <p className="text-gray-600">Speed</p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}
