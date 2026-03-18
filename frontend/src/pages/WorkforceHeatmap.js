import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { EnterpriseSidebar } from "./EnterpriseDashboard";
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";

const COLORS = { rising: "#3B82F6", stable: "#6B7280", at_risk: "#EF4444" };

export default function WorkforceHeatmap() {
    const { api, user } = useAuth();
    const navigate = useNavigate();
    const [workers, setWorkers] = useState([]);
    const [summary, setSummary] = useState({});
    const [filters, setFilters] = useState({ countries: [], departments: [] });
    const [country, setCountry] = useState("");
    const [department, setDepartment] = useState("");
    const [category, setCategory] = useState("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const load = async () => {
            try {
                const eid = user?.enterprise_id;
                if (!eid) return;
                const params = new URLSearchParams();
                if (country) params.set("country", country);
                if (department) params.set("department", department);
                if (category) params.set("category", category);
                const res = await api.get(`/enterprise/${eid}/heatmap?${params}`);
                setWorkers(res.data.workers || []);
                setSummary(res.data.summary || {});
                setFilters(res.data.filters || {});
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        load();
    }, [api, user, country, department, category]);

    const chartData = useMemo(() =>
        workers.map(w => ({
            x: w.displacement_direction_score || 5,
            y: w.sa_score || 3,
            name: w.name,
            role: w.role_title,
            department: w.department,
            country: w.country,
            category: w.displacement_category,
            id: w.id,
        })), [workers]);

    const CustomTooltip = ({ active, payload }) => {
        if (active && payload?.length) {
            const d = payload[0].payload;
            return (
                <div className="bg-card border border-border/40 p-3 shadow-xl text-xs space-y-1">
                    <p className="text-white font-semibold">{d.name}</p>
                    <p className="text-gray-400">{d.role}</p>
                    <p className="text-gray-500">{d.department} - {d.country}</p>
                    <p className="text-gray-400">Score: {d.x}</p>
                </div>
            );
        }
        return null;
    };

    return (
        <div className="flex">
            <EnterpriseSidebar current="/enterprise/heatmap" />
            <main className="ml-56 flex-1 p-8 min-h-screen" data-testid="workforce-heatmap">
                <div className="max-w-6xl space-y-6">
                    <div>
                        <h1 className="text-2xl font-display font-bold text-white">Workforce Heatmap</h1>
                        <p className="text-sm text-gray-500 mt-1">All {summary.total || 587} workers visualized by displacement direction and capability</p>
                    </div>

                    {/* Filters */}
                    <div className="flex flex-wrap gap-3" data-testid="heatmap-filters">
                        <select value={country} onChange={e => setCountry(e.target.value)}
                            className="bg-card border border-border text-sm text-gray-300 px-3 py-2 focus:border-white focus:outline-none" data-testid="filter-country">
                            <option value="">All Countries</option>
                            {filters.countries?.map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                        <select value={department} onChange={e => setDepartment(e.target.value)}
                            className="bg-card border border-border text-sm text-gray-300 px-3 py-2 focus:border-white focus:outline-none" data-testid="filter-department">
                            <option value="">All Departments</option>
                            {filters.departments?.map(d => <option key={d} value={d}>{d}</option>)}
                        </select>
                        <select value={category} onChange={e => setCategory(e.target.value)}
                            className="bg-card border border-border text-sm text-gray-300 px-3 py-2 focus:border-white focus:outline-none" data-testid="filter-category">
                            <option value="">All Categories</option>
                            <option value="rising">Rising</option>
                            <option value="stable">Stable</option>
                            <option value="at_risk">At Risk</option>
                        </select>
                        {(country || department || category) && (
                            <button onClick={() => { setCountry(""); setDepartment(""); setCategory(""); }}
                                className="text-xs text-gray-500 hover:text-white transition-colors px-3 py-2">Clear Filters</button>
                        )}
                    </div>

                    {/* Summary Bar */}
                    <div className="bg-card border border-border/40 p-4 flex items-center justify-between" data-testid="heatmap-summary">
                        <span className="text-sm text-gray-400">Showing <span className="text-white font-semibold">{summary.showing || 0}</span> of {summary.total || 0} workers</span>
                        <div className="flex gap-6 text-xs">
                            <span><span className="text-blue-400 font-semibold">{summary.rising || 0}</span> Rising</span>
                            <span><span className="text-gray-400 font-semibold">{summary.stable || 0}</span> Stable</span>
                            <span><span className="text-red-400 font-semibold">{summary.at_risk || 0}</span> At Risk</span>
                        </div>
                    </div>

                    {/* Chart */}
                    <div className="bg-card border border-border/40 p-6" data-testid="heatmap-chart">
                        {loading ? (
                            <div className="h-96 flex items-center justify-center"><div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin" /></div>
                        ) : (
                            <ResponsiveContainer width="100%" height={500}>
                                <ScatterChart margin={{ top: 20, right: 20, bottom: 40, left: 20 }}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#1E1E1E" />
                                    <XAxis type="number" dataKey="x" domain={[0, 10]} name="Displacement Score"
                                        tick={{ fill: '#6B7280', fontSize: 11 }} label={{ value: 'Displacement Direction Score', position: 'bottom', fill: '#6B7280', fontSize: 11, offset: 20 }} />
                                    <YAxis type="number" dataKey="y" domain={[1, 5]} name="Capability Score"
                                        tick={{ fill: '#6B7280', fontSize: 11 }} label={{ value: 'Capability Score (SA)', angle: -90, position: 'left', fill: '#6B7280', fontSize: 11 }} />
                                    <Tooltip content={<CustomTooltip />} />
                                    <Scatter data={chartData} onClick={(d) => navigate(`/enterprise/worker/${d.id}`)}>
                                        {chartData.map((entry, i) => (
                                            <Cell key={i} fill={COLORS[entry.category] || COLORS.stable} fillOpacity={0.7} cursor="pointer" r={4} />
                                        ))}
                                    </Scatter>
                                </ScatterChart>
                            </ResponsiveContainer>
                        )}
                        <div className="flex justify-center gap-6 mt-4 text-xs">
                            <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-blue-500" /> Rising (7-10)</span>
                            <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-gray-500" /> Stable (4-6.9)</span>
                            <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-red-500" /> At Risk (1-3.9)</span>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
