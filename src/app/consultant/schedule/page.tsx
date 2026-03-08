    "use client";
import React, { useState, useEffect } from "react";
import { ConsultantSideBar } from "@/component/consultantSidebar";
import { Card } from "@heroui/react";
import { FiCalendar, FiClock, FiUser, FiLock, FiPlus, FiTrash2 } from "react-icons/fi";
import { useRouter } from "next/navigation";

type Session = {
    id: string;
    client: string;
    date: string;
    time: string;
    duration: string;
    type: string;
    notes: string;
};

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

const INITIAL_SESSIONS: Session[] = [
    { id: "1", client: "John Doe", date: "2026-03-09", time: "09:00", duration: "60 min", type: "Therapy", notes: "Follow-up on anxiety triggers" },
    { id: "2", client: "Jane Smith", date: "2026-03-09", time: "11:00", duration: "45 min", type: "Check-in", notes: "" },
    { id: "3", client: "Mike Johnson", date: "2026-03-10", time: "14:00", duration: "60 min", type: "Intake", notes: "First session" },
    { id: "4", client: "Sara Lee", date: "2026-03-11", time: "10:00", duration: "30 min", type: "Check-in", notes: "" },
    { id: "5", client: "Tom Brown", date: "2026-03-12", time: "16:00", duration: "60 min", type: "Therapy", notes: "CBT session" },
];

const TYPE_COLORS: Record<string, string> = {
    Therapy: "bg-blue-100 text-blue-700",
    "Check-in": "bg-green-100 text-green-700",
    Intake: "bg-purple-100 text-purple-700",
};

export default function SchedulePage() {
    const router = useRouter();
    const [sessions, setSessions] = useState<Session[]>(INITIAL_SESSIONS);
    const [userRole, setUserRole] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [form, setForm] = useState<Omit<Session, "id">>({
        client: "", date: "", time: "", duration: "60 min", type: "Therapy", notes: "",
    });

    useEffect(() => {
        const token = localStorage.getItem("token");
        const role = localStorage.getItem("role");
        if (!token) { router.push("/login"); return; }
        setUserRole(role);
        setLoading(false);
    }, [router]);

    if (loading) return (
        <div className="flex h-screen w-full items-center justify-center bg-gray-50">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
        </div>
    );

    if (userRole !== "consultant") return (
        <div className="flex h-screen w-full items-center justify-center bg-gray-50">
            <Card className="p-8 max-w-md text-center shadow-lg border border-gray-200">
                <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <FiLock size={32} />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h2>
                <p className="text-gray-600 mb-6">This area is reserved for consultants only.</p>
                <button onClick={() => router.push("/dashboard")} className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors">
                    Go to Student Dashboard
                </button>
            </Card>
        </div>
    );

    // Get unique week dates from sessions
    const allDates = Array.from(new Set(sessions.map(s => s.date))).sort();

    const addSession = () => {
        if (!form.client || !form.date || !form.time) return;
        setSessions(prev => [...prev, { ...form, id: Date.now().toString() }]);
        setForm({ client: "", date: "", time: "", duration: "60 min", type: "Therapy", notes: "" });
        setShowForm(false);
    };

    const deleteSession = (id: string) => setSessions(prev => prev.filter(s => s.id !== id));

    return (
        <div className="flex h-screen bg-gray-50 w-full">
            <ConsultantSideBar />

            <main className="flex-1 overflow-y-auto p-8">
                <header className="mb-8 flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Schedule</h1>
                        <p className="text-gray-500 mt-1 text-sm">Manage all your client sessions</p>
                    </div>
                    <button
                        onClick={() => setShowForm(!showForm)}
                        className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-lg transition-colors"
                    >
                        <FiPlus size={16} /> Add Session
                    </button>
                </header>

                {/* Add Session Form */}
                {showForm && (
                    <Card className="bg-white p-6 shadow-sm border border-gray-200 mb-8">
                        <h3 className="text-md font-bold text-gray-900 mb-4">New Session</h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                                <label className="text-xs font-medium text-gray-500 mb-1 block">Client Name</label>
                                <input
                                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-100"
                                    placeholder="Client name"
                                    value={form.client}
                                    onChange={e => setForm(f => ({ ...f, client: e.target.value }))}
                                />
                            </div>
                            <div>
                                <label className="text-xs font-medium text-gray-500 mb-1 block">Date</label>
                                <input type="date" className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-100" value={form.date} onChange={e => setForm(f => ({ ...f, date: e.target.value }))} />
                            </div>
                            <div>
                                <label className="text-xs font-medium text-gray-500 mb-1 block">Time</label>
                                <input type="time" className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-100" value={form.time} onChange={e => setForm(f => ({ ...f, time: e.target.value }))} />
                            </div>
                            <div>
                                <label className="text-xs font-medium text-gray-500 mb-1 block">Type</label>
                                <select className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-100" value={form.type} onChange={e => setForm(f => ({ ...f, type: e.target.value }))}>
                                    <option>Therapy</option>
                                    <option>Check-in</option>
                                    <option>Intake</option>
                                </select>
                            </div>
                            <div>
                                <label className="text-xs font-medium text-gray-500 mb-1 block">Duration</label>
                                <select className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-100" value={form.duration} onChange={e => setForm(f => ({ ...f, duration: e.target.value }))}>
                                    <option>30 min</option>
                                    <option>45 min</option>
                                    <option>60 min</option>
                                    <option>90 min</option>
                                </select>
                            </div>
                            <div>
                                <label className="text-xs font-medium text-gray-500 mb-1 block">Notes</label>
                                <input className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-100" placeholder="Optional notes" value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} />
                            </div>
                        </div>
                        <div className="flex gap-3 mt-4">
                            <button onClick={addSession} className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-lg transition-colors">Save Session</button>
                            <button onClick={() => setShowForm(false)} className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-semibold rounded-lg transition-colors">Cancel</button>
                        </div>
                    </Card>
                )}

                {/* Sessions by Date */}
                <div className="space-y-6">
                    {allDates.map(date => (
                        <div key={date}>
                            <div className="flex items-center gap-2 mb-3">
                                <FiCalendar className="text-blue-500" size={16} />
                                <h3 className="text-sm font-bold text-gray-700">
                                    {new Date(date + "T00:00:00").toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}
                                </h3>
                                <span className="ml-2 text-xs bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full font-medium">
                                    {sessions.filter(s => s.date === date).length} sessions
                                </span>
                            </div>
                            <Card className="bg-white shadow-sm border border-gray-200 overflow-hidden">
                                <table className="w-full text-left">
                                    <thead>
                                        <tr className="border-b border-gray-100 bg-gray-50 text-gray-400 text-xs uppercase">
                                            <th className="px-6 py-3 font-medium">Client</th>
                                            <th className="px-6 py-3 font-medium">Time</th>
                                            <th className="px-6 py-3 font-medium">Duration</th>
                                            <th className="px-6 py-3 font-medium">Type</th>
                                            <th className="px-6 py-3 font-medium">Notes</th>
                                            <th className="px-6 py-3 font-medium"></th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-50">
                                        {sessions.filter(s => s.date === date).map(session => (
                                            <tr key={session.id} className="hover:bg-gray-50 transition-colors">
                                                <td className="px-6 py-4 flex items-center gap-2">
                                                    <div className="w-7 h-7 rounded-full bg-blue-100 flex items-center justify-center">
                                                        <FiUser size={13} className="text-blue-600" />
                                                    </div>
                                                    <span className="text-sm font-medium text-gray-900">{session.client}</span>
                                                </td>
                                                <td className="px-6 py-4 text-sm text-gray-600">
                                                    <span className="flex items-center gap-1"><FiClock size={13} className="text-gray-400" />{session.time}</span>
                                                </td>
                                                <td className="px-6 py-4 text-sm text-gray-600">{session.duration}</td>
                                                <td className="px-6 py-4">
                                                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${TYPE_COLORS[session.type] ?? "bg-gray-100 text-gray-600"}`}>
                                                        {session.type}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-sm text-gray-400 italic">{session.notes || "—"}</td>
                                                <td className="px-6 py-4">
                                                    <button onClick={() => deleteSession(session.id)} className="text-gray-300 hover:text-red-400 transition-colors">
                                                        <FiTrash2 size={15} />
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </Card>
                        </div>
                    ))}
                    {allDates.length === 0 && (
                        <div className="text-center py-16 text-gray-400">
                            <FiCalendar size={40} className="mx-auto mb-3 opacity-30" />
                            <p className="text-sm">No sessions scheduled. Add one above.</p>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}
