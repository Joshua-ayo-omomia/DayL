import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { ArrowLeft, MessageSquare, ChevronUp, Shield } from "lucide-react";

export default function CommunityHub() {
    const { api, user } = useAuth();
    const [mentors, setMentors] = useState([]);
    const [threads, setThreads] = useState([]);
    const [feed, setFeed] = useState([]);
    const [tab, setTab] = useState("mentors");

    useEffect(() => {
        const load = async () => {
            try {
                const [mentorRes, threadRes, feedRes] = await Promise.all([
                    api.get("/community/hub"),
                    api.get("/community/threads"),
                    api.get("/community/feed"),
                ]);
                setMentors(mentorRes.data.mentors || []);
                setThreads(threadRes.data.threads || []);
                setFeed(feedRes.data.feed || []);
            } catch (err) {
                console.error(err);
            }
        };
        load();
    }, [api]);

    const backLink = user?.role === "enterprise_admin" || user?.role === "super_admin" ? "/enterprise" : "/learn";

    return (
        <div className="min-h-screen bg-background" data-testid="community-hub">
            <nav className="fixed top-0 w-full z-50 glass border-b border-border/40">
                <div className="max-w-6xl mx-auto px-4 md:px-8 flex items-center justify-between h-14">
                    <Link to="/" className="text-lg font-bold text-white font-body">Realloc</Link>
                    <Link to={backLink} className="text-xs text-gray-500 hover:text-white transition-colors flex items-center gap-1">
                        <ArrowLeft className="w-3 h-3" /> Back
                    </Link>
                </div>
            </nav>

            <main className="pt-20 pb-12 px-4 md:px-8 max-w-5xl mx-auto space-y-8">
                <div>
                    <h1 className="text-2xl font-display font-bold text-white">Expert Community</h1>
                    <p className="text-sm text-gray-500 mt-1">Practitioners from the world's leading technology companies, guiding your AI transformation.</p>
                </div>

                {/* Tabs */}
                <div className="flex gap-4 border-b border-border/20">
                    {[
                        { key: "mentors", label: "Mentors" },
                        { key: "discussions", label: "Discussions" },
                        { key: "activity", label: "Activity Feed" },
                    ].map(t => (
                        <button key={t.key} onClick={() => setTab(t.key)}
                            className={`pb-3 text-sm transition-colors ${tab === t.key ? "text-white border-b-2 border-white" : "text-gray-500 hover:text-white"}`}
                            data-testid={`tab-${t.key}`}>
                            {t.label}
                        </button>
                    ))}
                </div>

                {/* Mentors Tab */}
                {tab === "mentors" && (
                    <div className="space-y-6">
                        <div className="grid md:grid-cols-3 gap-4">
                            {mentors.map(m => (
                                <div key={m.id} className="bg-card border border-border/40 p-5 veneer-card" data-testid={`mentor-card-${m.name.split(' ')[0].toLowerCase()}`}>
                                    <div className="w-12 h-12 bg-gray-800 rounded-full mb-4 flex items-center justify-center">
                                        <span className="text-lg text-gray-400 font-bold">{m.name?.charAt(0)}</span>
                                    </div>
                                    <h3 className="text-base font-semibold text-white">{m.name}</h3>
                                    <p className="text-xs text-gray-400 mt-0.5">{m.credential}</p>
                                    <p className="text-xs text-gray-500 mt-1">{m.specialization}</p>
                                    <p className="text-xs text-gray-600 mt-2">{m.years_experience} years experience</p>
                                    <p className="text-sm text-gray-400 mt-3 leading-relaxed">{m.bio}</p>
                                    <p className="text-xs text-gray-500 italic mt-3 border-l-2 border-white/10 pl-3">"{m.mentoring_approach}"</p>
                                    <div className="flex items-center gap-1.5 mt-3">
                                        <span className="w-2 h-2 rounded-full bg-green-500" />
                                        <span className="text-xs text-gray-600">Available</span>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* How Mentorship Works */}
                        <div>
                            <h2 className="text-base font-display font-semibold text-white mb-4">How Mentorship Works</h2>
                            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                                {[
                                    { title: "Weekly Sessions", desc: "45-minute 1-on-1 video sessions every week with your assigned mentor" },
                                    { title: "Project Review", desc: "Every build exercise is reviewed by your mentor with detailed, rigorous feedback" },
                                    { title: "Career Guidance", desc: "Mentors share real-world experience from building AI at the world's leading companies" },
                                    { title: "Quality, Not Completion", desc: "Your mentor won't pass work that isn't production-quality. That's what makes the certification meaningful." },
                                ].map(c => (
                                    <div key={c.title} className="bg-card border border-border/40 p-4">
                                        <h3 className="text-xs font-semibold text-white mb-1 font-body">{c.title}</h3>
                                        <p className="text-xs text-gray-500 leading-relaxed">{c.desc}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {/* Discussions Tab */}
                {tab === "discussions" && (
                    <div className="space-y-4">
                        {threads.map(t => (
                            <div key={t.id} className="bg-card border border-border/40 p-5">
                                <div className="flex items-center gap-2 mb-2">
                                    <span className="text-sm font-semibold text-white">{t.author_name}</span>
                                    <span className="text-xs text-gray-600 capitalize">{t.author_role}</span>
                                    {t.upvotes > 0 && <span className="flex items-center gap-0.5 text-xs text-gray-500 ml-auto"><ChevronUp className="w-3 h-3" />{t.upvotes}</span>}
                                </div>
                                <p className="text-sm text-gray-400 leading-relaxed">{t.content}</p>
                                {t.replies?.length > 0 && (
                                    <div className="mt-3 space-y-2">
                                        {t.replies.map(r => (
                                            <div key={r.id} className="ml-4 p-3 border-l-2 border-white/10">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <span className="text-xs font-semibold text-white">{r.author_name}</span>
                                                    {r.author_credential && (
                                                        <span className="text-xs text-gray-600 flex items-center gap-1"><Shield className="w-3 h-3" />{r.author_credential}</span>
                                                    )}
                                                </div>
                                                <p className="text-xs text-gray-400 leading-relaxed">{r.content}</p>
                                            </div>
                                        ))}
                                    </div>
                                )}
                                <div className="text-xs text-gray-700 mt-2">{t.replies?.length || 0} replies</div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Activity Tab */}
                {tab === "activity" && (
                    <div className="space-y-2">
                        {feed.map(f => (
                            <div key={f.id} className="flex items-start gap-3 py-3 border-b border-border/20">
                                <span className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${f.type === "completion" ? "bg-green-500" : f.type === "feedback" ? "bg-amber-500" : f.type === "milestone" ? "bg-white" : "bg-gray-500"}`} />
                                <div>
                                    <p className="text-sm text-gray-400"><span className="text-white">{f.actor_name}</span> {f.content}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
}
