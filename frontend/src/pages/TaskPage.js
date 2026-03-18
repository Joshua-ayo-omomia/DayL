import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { ArrowLeft, CheckCircle, Clock, AlertCircle, Send, ChevronUp, MessageSquare, ExternalLink } from "lucide-react";
import { toast } from "sonner";

const STATUS_ICON = { pass: CheckCircle, pending: Clock, needs_work: AlertCircle };
const STATUS_COLOR = { pass: "text-green-400", pending: "text-amber-400", needs_work: "text-red-400" };

export default function TaskPage() {
    const { domainId, taskId } = useParams();
    const { api, user } = useAuth();
    const [taskData, setTaskData] = useState(null);
    const [domainData, setDomainData] = useState(null);
    const [submissions, setSubmissions] = useState([]);
    const [threads, setThreads] = useState([]);
    const [loading, setLoading] = useState(true);
    const [allTasks, setAllTasks] = useState([]);
    const [currentTask, setCurrentTask] = useState(null);

    // Submission form
    const [showForm, setShowForm] = useState(false);
    const [subTitle, setSubTitle] = useState("");
    const [subDesc, setSubDesc] = useState("");
    const [subUrl, setSubUrl] = useState("");
    const [subNotes, setSubNotes] = useState("");
    const [submitting, setSubmitting] = useState(false);

    // Thread form
    const [threadContent, setThreadContent] = useState("");

    useEffect(() => {
        const load = async () => {
            try {
                // First get all tasks for this domain
                const domainRes = await api.get(`/learn/domains/${domainId}/tasks`);
                const tasks = domainRes.data.tasks || [];
                setAllTasks(tasks);
                setDomainData(domainRes.data.domain);

                // Find the current task - use taskId or first task
                let task = tasks.find(t => t.id === taskId);
                if (!task && tasks.length > 0) {
                    task = tasks[0];
                }
                if (task) {
                    setCurrentTask(task);
                    // Get full task details
                    const taskRes = await api.get(`/learn/domains/${domainId}/tasks/${task.id}`);
                    setTaskData(taskRes.data.task);
                    setSubmissions(taskRes.data.submissions || []);
                    setThreads(taskRes.data.threads || []);
                }
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        load();
    }, [api, domainId, taskId]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            await api.post("/submissions", {
                task_id: currentTask.id,
                domain_id: domainId,
                title: subTitle,
                description: subDesc,
                project_url: subUrl,
                notes: subNotes || undefined
            });
            toast.success("Submission created. Your mentor will review within 48 hours.");
            setShowForm(false);
            setSubTitle(""); setSubDesc(""); setSubUrl(""); setSubNotes("");
            // Reload
            const taskRes = await api.get(`/learn/domains/${domainId}/tasks/${currentTask.id}`);
            setSubmissions(taskRes.data.submissions || []);
        } catch (err) {
            toast.error("Failed to submit");
        } finally {
            setSubmitting(false);
        }
    };

    const handleThread = async (e) => {
        e.preventDefault();
        if (!threadContent.trim()) return;
        try {
            await api.post("/community/threads", {
                task_id: currentTask?.id,
                content: threadContent
            });
            setThreadContent("");
            const taskRes = await api.get(`/learn/domains/${domainId}/tasks/${currentTask.id}`);
            setThreads(taskRes.data.threads || []);
            toast.success("Question posted");
        } catch {
            toast.error("Failed to post");
        }
    };

    const switchTask = async (task) => {
        setLoading(true);
        try {
            setCurrentTask(task);
            const taskRes = await api.get(`/learn/domains/${domainId}/tasks/${task.id}`);
            setTaskData(taskRes.data.task);
            setSubmissions(taskRes.data.submissions || []);
            setThreads(taskRes.data.threads || []);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    const task = taskData;

    return (
        <div className="min-h-screen bg-background" data-testid="task-page">
            <nav className="fixed top-0 w-full z-50 glass border-b border-border/40">
                <div className="max-w-6xl mx-auto px-4 md:px-8 flex items-center justify-between h-14">
                    <Link to="/learn" className="text-lg font-bold text-white font-body">Realloc</Link>
                    <Link to="/learn" className="text-xs text-gray-500 hover:text-white transition-colors flex items-center gap-1">
                        <ArrowLeft className="w-3 h-3" /> Back to Dashboard
                    </Link>
                </div>
            </nav>

            <main className="pt-20 pb-12 px-4 md:px-8 max-w-6xl mx-auto">
                <div className="grid lg:grid-cols-4 gap-6">
                    {/* Task Sidebar */}
                    <div className="lg:col-span-1">
                        <div className="bg-card border border-border/40 p-4 sticky top-20">
                            <h3 className="text-xs font-semibold text-gray-400 mb-3 font-body">{domainData?.title || "Domain"}</h3>
                            <div className="space-y-1">
                                {allTasks.map((t, i) => (
                                    <button key={t.id} onClick={() => switchTask(t)}
                                        className={`w-full text-left px-3 py-2 text-xs rounded transition-colors ${currentTask?.id === t.id ? "bg-white/10 text-white" : "text-gray-500 hover:text-white hover:bg-white/5"}`}
                                        data-testid={`task-nav-${i}`}>
                                        <span className="font-mono text-gray-600 mr-2">{i + 1}.</span>
                                        {t.title?.substring(0, 35)}{t.title?.length > 35 ? "..." : ""}
                                        {t.progress_status === "completed" && <CheckCircle className="w-3 h-3 text-green-400 inline ml-1" />}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Main Content */}
                    <div className="lg:col-span-3 space-y-6">
                        {/* Context Banner */}
                        {task?.context_banner && (
                            <div className="bg-white/5 border border-white/10 p-4" data-testid="context-banner">
                                <p className="text-xs text-gray-400 leading-relaxed">{task.context_banner}</p>
                            </div>
                        )}

                        <div>
                            <h1 className="text-xl font-display font-bold text-white" data-testid="task-title">{task?.title}</h1>
                            <p className="text-sm text-gray-500 mt-1">{task?.description}</p>
                        </div>

                        {/* Video */}
                        {task?.video_url && (
                            <div className="bg-card border border-border/40 p-4" data-testid="task-video">
                                <h2 className="text-xs font-semibold text-gray-400 mb-2 font-body">Practitioner Briefing</h2>
                                <div className="aspect-video bg-black rounded overflow-hidden">
                                    <iframe src={task.video_url} className="w-full h-full" frameBorder="0"
                                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen />
                                </div>
                                {task.video_presenter && (
                                    <p className="text-xs text-gray-600 mt-2">Presented by {task.video_presenter}</p>
                                )}
                            </div>
                        )}

                        {/* Resources */}
                        {task?.resources?.length > 0 && (
                            <div className="bg-card border border-border/40 p-4" data-testid="task-resources">
                                <h2 className="text-xs font-semibold text-gray-400 mb-3 font-body">Resources</h2>
                                <div className="space-y-2">
                                    {task.resources.map((r, i) => (
                                        <div key={i} className="flex items-start gap-3 py-2 border-b border-border/20 last:border-0">
                                            <ExternalLink className="w-3.5 h-3.5 text-gray-600 mt-0.5 flex-shrink-0" />
                                            <div>
                                                <a href={r.url} target="_blank" rel="noopener noreferrer" className="text-sm text-gray-300 hover:text-white transition-colors">{r.title}</a>
                                                {r.annotation && <p className="text-xs text-gray-600 mt-0.5">{r.annotation}</p>}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Practical Scenario */}
                        {task?.practical_scenario && (
                            <div className="bg-card border border-border/40 p-5" data-testid="practical-scenario">
                                <h2 className="text-xs font-semibold text-gray-400 mb-3 font-body">Practical Scenario</h2>
                                <p className="text-sm text-gray-400 leading-relaxed">{task.practical_scenario}</p>
                            </div>
                        )}

                        {/* Build Exercise */}
                        {task?.build_exercise && (
                            <div className="bg-card border border-border/40 p-5" data-testid="build-exercise">
                                <h2 className="text-xs font-semibold text-gray-400 mb-3 font-body">Build Exercise</h2>
                                <p className="text-sm text-gray-400 leading-relaxed mb-3">{task.build_exercise}</p>
                                {task.build_connection_to_capstone && (
                                    <p className="text-xs text-gray-600 italic border-l-2 border-white/10 pl-3">{task.build_connection_to_capstone}</p>
                                )}
                            </div>
                        )}

                        {/* Submission History / Mentor Feedback */}
                        {submissions.length > 0 && (
                            <div className="bg-card border border-border/40 p-5 space-y-4" data-testid="submission-history">
                                <h2 className="text-xs font-semibold text-gray-400 mb-1 font-body">Submission History</h2>
                                {submissions.map((sub, i) => {
                                    const Icon = STATUS_ICON[sub.status] || Clock;
                                    return (
                                        <div key={sub.id} className="border border-border/20 p-4">
                                            <div className="flex items-center justify-between mb-2">
                                                <h3 className="text-sm text-white">{sub.title}</h3>
                                                <span className={`flex items-center gap-1 text-xs capitalize ${STATUS_COLOR[sub.status] || "text-gray-400"}`}>
                                                    <Icon className="w-3 h-3" /> {sub.status?.replace("_", " ")}
                                                </span>
                                            </div>
                                            <p className="text-xs text-gray-500 mb-2">{sub.description}</p>
                                            {sub.project_url && <a href={sub.project_url} target="_blank" rel="noopener noreferrer" className="text-xs text-gray-400 hover:text-white flex items-center gap-1"><ExternalLink className="w-3 h-3" /> {sub.project_url}</a>}
                                            {sub.admin_feedback && (
                                                <div className="mt-3 p-3 bg-white/5 border border-white/10">
                                                    <div className="flex items-center gap-2 mb-1">
                                                        <span className="text-xs font-semibold text-white">{sub.reviewer_name}</span>
                                                        {sub.reviewer_credential && <span className="text-xs text-gray-600">{sub.reviewer_credential}</span>}
                                                        <span className="text-xs text-gray-700">Cycle {sub.review_cycle}</span>
                                                    </div>
                                                    <p className="text-xs text-gray-400 leading-relaxed">{sub.admin_feedback}</p>
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        )}

                        {/* Submit New */}
                        <div className="bg-card border border-border/40 p-5" data-testid="submission-section">
                            {!showForm ? (
                                <button onClick={() => setShowForm(true)}
                                    className="w-full bg-white text-black py-2.5 text-sm font-medium hover:bg-gray-300 transition-colors"
                                    data-testid="submit-work-btn">
                                    Submit Work
                                </button>
                            ) : (
                                <form onSubmit={handleSubmit} className="space-y-3">
                                    <h2 className="text-sm font-semibold text-white font-body">Submit Your Work</h2>
                                    <input type="text" placeholder="Title" value={subTitle} onChange={e => setSubTitle(e.target.value)} required
                                        className="w-full bg-background border border-border px-3 py-2 text-sm text-white focus:border-white focus:outline-none" data-testid="sub-title" />
                                    <textarea placeholder="Description" value={subDesc} onChange={e => setSubDesc(e.target.value)} required rows={3}
                                        className="w-full bg-background border border-border px-3 py-2 text-sm text-white focus:border-white focus:outline-none" data-testid="sub-desc" />
                                    <input type="url" placeholder="Project URL" value={subUrl} onChange={e => setSubUrl(e.target.value)} required
                                        className="w-full bg-background border border-border px-3 py-2 text-sm text-white focus:border-white focus:outline-none" data-testid="sub-url" />
                                    <textarea placeholder="Notes (optional)" value={subNotes} onChange={e => setSubNotes(e.target.value)} rows={2}
                                        className="w-full bg-background border border-border px-3 py-2 text-sm text-white focus:border-white focus:outline-none" data-testid="sub-notes" />
                                    <div className="flex gap-2">
                                        <button type="submit" disabled={submitting}
                                            className="bg-white text-black px-5 py-2 text-sm font-medium hover:bg-gray-300 disabled:opacity-50 transition-colors" data-testid="sub-submit">
                                            {submitting ? "Submitting..." : "Submit"}
                                        </button>
                                        <button type="button" onClick={() => setShowForm(false)}
                                            className="border border-border text-gray-400 px-5 py-2 text-sm hover:text-white transition-colors">Cancel</button>
                                    </div>
                                    <p className="text-xs text-gray-600">Submitted. Your mentor will review within 48 hours.</p>
                                </form>
                            )}
                        </div>

                        {/* Discussion */}
                        <div className="bg-card border border-border/40 p-5 space-y-4" data-testid="discussion-section">
                            <h2 className="text-xs font-semibold text-gray-400 font-body flex items-center gap-1"><MessageSquare className="w-3.5 h-3.5" /> Discussion</h2>
                            {threads.map(t => (
                                <div key={t.id} className="border border-border/20 p-4">
                                    <div className="flex items-center gap-2 mb-1">
                                        <span className="text-sm font-semibold text-white">{t.author_name}</span>
                                        <span className="text-xs text-gray-600 capitalize">{t.author_role}</span>
                                        {t.upvotes > 0 && <span className="flex items-center gap-0.5 text-xs text-gray-600"><ChevronUp className="w-3 h-3" />{t.upvotes}</span>}
                                    </div>
                                    <p className="text-sm text-gray-400 leading-relaxed">{t.content}</p>
                                    {t.replies?.map(r => (
                                        <div key={r.id} className="ml-6 mt-3 p-3 border-l-2 border-white/10">
                                            <div className="flex items-center gap-2 mb-1">
                                                <span className="text-xs font-semibold text-white">{r.author_name}</span>
                                                {r.author_credential && <span className="text-xs text-gray-600">{r.author_credential}</span>}
                                            </div>
                                            <p className="text-xs text-gray-400 leading-relaxed">{r.content}</p>
                                        </div>
                                    ))}
                                </div>
                            ))}
                            <form onSubmit={handleThread} className="flex gap-2">
                                <input type="text" placeholder="Ask a question..." value={threadContent} onChange={e => setThreadContent(e.target.value)}
                                    className="flex-1 bg-background border border-border px-3 py-2 text-sm text-white focus:border-white focus:outline-none" data-testid="thread-input" />
                                <button type="submit" className="bg-white text-black px-4 py-2 hover:bg-gray-300 transition-colors" data-testid="thread-submit">
                                    <Send className="w-4 h-4" />
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
