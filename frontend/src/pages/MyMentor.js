import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { ArrowLeft, Calendar, Video, Clock, CheckCircle, AlertCircle } from "lucide-react";

const STATUS_COLOR = { pass: "text-green-400", pending: "text-amber-400", needs_work: "text-red-400" };

export default function MyMentor() {
    const { api } = useAuth();
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const load = async () => {
            try {
                const res = await api.get("/learn/mentor");
                setData(res.data);
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

    const mentor = data?.mentor;
    const sessions = data?.sessions || [];
    const reviews = data?.reviews || [];

    return (
        <div className="min-h-screen bg-background" data-testid="my-mentor-page">
            <nav className="fixed top-0 w-full z-50 glass border-b border-border/40">
                <div className="max-w-6xl mx-auto px-4 md:px-8 flex items-center justify-between h-14">
                    <Link to="/" className="text-lg font-bold text-white font-body">Realloc</Link>
                    <Link to="/learn" className="text-xs text-gray-500 hover:text-white transition-colors flex items-center gap-1">
                        <ArrowLeft className="w-3 h-3" /> Back to Dashboard
                    </Link>
                </div>
            </nav>

            <main className="pt-20 pb-12 px-4 md:px-8 max-w-4xl mx-auto space-y-8">
                <h1 className="text-2xl font-display font-bold text-white">My Mentor</h1>

                {mentor ? (
                    <>
                        {/* Mentor Profile */}
                        <div className="bg-card border border-border/40 p-6" data-testid="mentor-profile">
                            <div className="flex items-start gap-4">
                                <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center flex-shrink-0">
                                    <span className="text-2xl text-gray-400 font-bold">{mentor.name?.charAt(0)}</span>
                                </div>
                                <div>
                                    <h2 className="text-xl font-semibold text-white">{mentor.name}</h2>
                                    <p className="text-sm text-gray-400">{mentor.credential}</p>
                                    <p className="text-xs text-gray-500 mt-1">{mentor.specialization}</p>
                                    <p className="text-sm text-gray-400 mt-3 leading-relaxed">{mentor.bio}</p>
                                    <p className="text-xs text-gray-500 italic mt-3 border-l-2 border-white/10 pl-3">"{mentor.mentoring_approach}"</p>
                                </div>
                            </div>
                        </div>

                        {/* Sessions */}
                        <div className="bg-card border border-border/40 p-6" data-testid="session-schedule">
                            <h2 className="text-sm font-semibold text-white mb-4 font-body">Session Schedule</h2>
                            <div className="space-y-3">
                                {sessions.length === 0 && <p className="text-xs text-gray-600">No sessions scheduled</p>}
                                {sessions.map(s => (
                                    <div key={s.id} className="flex items-start gap-3 py-3 border-b border-border/20 last:border-0">
                                        <div className={`w-8 h-8 rounded flex items-center justify-center flex-shrink-0 ${s.status === "completed" ? "bg-green-500/10" : "bg-white/10"}`}>
                                            {s.status === "completed" ? <CheckCircle className="w-4 h-4 text-green-400" /> : <Calendar className="w-4 h-4 text-white" />}
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2">
                                                <span className="text-sm text-white">{s.date}</span>
                                                <span className="text-xs text-gray-500">{s.time} {s.timezone}</span>
                                                <span className={`text-xs capitalize ${s.status === "completed" ? "text-green-400" : "text-amber-400"}`}>{s.status}</span>
                                            </div>
                                            {s.notes && <p className="text-xs text-gray-500 mt-1 leading-relaxed">{s.notes}</p>}
                                            {s.status === "scheduled" && s.meeting_url && (
                                                <a href={s.meeting_url} target="_blank" rel="noopener noreferrer"
                                                    className="inline-flex items-center gap-1 text-xs text-gray-400 hover:text-white mt-1">
                                                    <Video className="w-3 h-3" /> Join Meeting
                                                </a>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Review History */}
                        <div className="bg-card border border-border/40 p-6" data-testid="review-history">
                            <h2 className="text-sm font-semibold text-white mb-4 font-body">Review History</h2>
                            <div className="space-y-3">
                                {reviews.length === 0 && <p className="text-xs text-gray-600">No reviews yet</p>}
                                {reviews.map(r => (
                                    <div key={r.id} className="py-3 border-b border-border/20 last:border-0">
                                        <div className="flex items-center justify-between mb-1">
                                            <span className="text-sm text-white">{r.title}</span>
                                            <span className={`text-xs capitalize flex items-center gap-1 ${STATUS_COLOR[r.status] || "text-gray-400"}`}>
                                                {r.status === "pass" ? <CheckCircle className="w-3 h-3" /> : <AlertCircle className="w-3 h-3" />}
                                                {r.status?.replace("_", " ")}
                                            </span>
                                        </div>
                                        {r.admin_feedback && <p className="text-xs text-gray-500 mt-1 leading-relaxed">{r.admin_feedback?.substring(0, 150)}...</p>}
                                        <p className="text-xs text-gray-700 mt-1">Cycle {r.review_cycle}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </>
                ) : (
                    <div className="bg-card border border-border/40 p-8 text-center">
                        <p className="text-sm text-gray-500">No mentor assigned yet. Your mentor will be assigned when your cohort begins.</p>
                    </div>
                )}
            </main>
        </div>
    );
}
