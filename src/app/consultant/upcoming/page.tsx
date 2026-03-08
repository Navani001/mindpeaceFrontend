"use client";
import React, { useState, useEffect, useCallback } from "react";
import { ConsultantSideBar } from "@/component/consultantSidebar";
import { FiClock, FiCalendar, FiCheckCircle, FiAlertCircle, FiXCircle, FiMessageSquare, FiVideo, FiWifi, FiMapPin, FiSend, FiPlus } from "react-icons/fi";
import { useRouter } from "next/navigation";
import { getRequest, patchRequest } from "@/utils";

type BookingStatus = "pending" | "accepted" | "rejected" | "completed";

type MeetingType = "online" | "offline";

type Booking = {
    id: string;
    date: string;
    time: string;
    topic: string;
    message?: string | null;
    meetingType: MeetingType;
    status: BookingStatus;
    student: { id: number; name: string; email: string };
};

const STATUS_CONFIG:any = {
    pending:  { label: "Pending",   color: "bg-yellow-100 text-yellow-700", icon: <FiAlertCircle size={13} /> },
    accepted: { label: "Accepted",  color: "bg-green-100 text-green-700",   icon: <FiCheckCircle size={13} /> },
    rejected: { label: "Rejected",  color: "bg-red-100 text-red-500",       icon: <FiXCircle size={13} /> },
    completed: { label: "Completed", color: "bg-blue-100 text-blue-700",    icon: <FiCheckCircle size={13} /> },
};

const AVATAR_COLORS = [
    "bg-blue-200 text-blue-700",
    "bg-purple-200 text-purple-700",
    "bg-green-200 text-green-700",
    "bg-orange-200 text-orange-700",
    "bg-pink-200 text-pink-700",
    "bg-teal-200 text-teal-700",
];

function avatarColor(id: number) {
    return AVATAR_COLORS[id % AVATAR_COLORS.length];
}

function formatDate(dateStr: string) {
    return new Date(dateStr + "T00:00:00").toLocaleDateString("en-US", {
        weekday: "short", month: "short", day: "numeric",
    });
}

export default function UpcomingPage() {
    const router = useRouter();
    const [bookings, setBookings] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState<"all" | BookingStatus>("all");
    const [actionLoading, setActionLoading] = useState<string | null>(null);
    const [toast, setToast] = useState<{ msg: string; type: "success" | "error" } | null>(null);
    const [noteInputs, setNoteInputs] = useState<Record<string, string>>({});
    const [noteLoading, setNoteLoading] = useState<string | null>(null);
    const [isStatusLoading, setIsStatusLoading] = useState<string | null>(null);
    const [showNotePopup, setShowNotePopup] = useState<string | null>(null); // bookingId of the booking being completed

    const getAuthHeader = () => ({
        authorization: "Bearer " + (typeof window !== "undefined" ? localStorage.getItem("token") || "" : ""),
    });

    const showToast = (msg: string, type: "success" | "error") => {
        setToast({ msg, type });
        setTimeout(() => setToast(null), 3500);
    };

    const fetchBookings = useCallback(async () => {
        setLoading(true);
        try {
            const res: any = await getRequest("bookings/consultant", getAuthHeader());
            setBookings(res?.data?.bookings || []);
        } catch {
            showToast("Failed to load bookings", "error");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        const token = localStorage.getItem("token");
        const role = localStorage.getItem("role");
        if (!token) { router.push("/login"); return; }
        if (role !== "consultant") { router.push("/dashboard"); return; }
        fetchBookings();
    }, [router, fetchBookings]);

    const handleAction = async (bookingId: string, status: "accepted" | "rejected") => {
        setActionLoading(bookingId + status);
        try {
            const res: any = await patchRequest(
                `bookings/${bookingId}/status`,
                { status },
                getAuthHeader()
            );
            if (res?.success) {
                setBookings(prev =>
                    prev.map(b => b.id === bookingId ? { ...b, status } : b)
                );
                showToast(
                    status === "accepted" ? "Meeting accepted!" : "Meeting rejected.",
                    status === "accepted" ? "success" : "error"
                );
            } else {
                showToast(res?.message || "Action failed", "error");
            }
        } catch {
            showToast("Failed to update booking", "error");
        } finally {
            setActionLoading(null);
        }
    };

    const handleNoteSubmit = async (bookingId: string) => {
        const note = noteInputs[bookingId]?.trim();
        if (!note) return;
        setNoteLoading(bookingId);
        try {
            const res: any = await patchRequest(
                `bookings/${bookingId}/note`,
                { consultantNote: note },
                getAuthHeader()
            );
            if (res?.success) {
                setBookings(prev =>
                    prev.map(b => b.id === bookingId ? { ...b, consultantNote: note } : b)
                );
                showToast("Note updated!", "success");
            } else {
                showToast(res?.message || "Update failed", "error");
            }
        } catch {
            showToast("Network error", "error");
        } finally {
            setNoteLoading(null);
        }
    };

    const handleCompleteSession = async (bookingId: string) => {
        const note = noteInputs[bookingId]?.trim();
        setIsStatusLoading(bookingId);
        
        console.log("Submitting completion for:", bookingId, "Note:", note);
        
        try {
            // 1. Submit note if present
            if (note) {
                await patchRequest(`bookings/${bookingId}/note`, { consultantNote: note }, getAuthHeader());
            }
            
            // 2. Update status to completed
            const res: any = await patchRequest(`bookings/${bookingId}/status`, { status: "completed" }, getAuthHeader());
            
            console.log("Completion response:", res);

            if (res?.success) {
                setBookings(prev => prev.map(b => b.id === bookingId ? { ...b, status: "completed", consultantNote: note || b.consultantNote } : b));
                showToast("Session completed successfully!", "success");
                setShowNotePopup(null);
            } else {
                showToast(res?.message || "Failed to complete session", "error");
            }
        } catch (err) {
            console.error("Completion error:", err);
            showToast("Something went wrong", "error");
        } finally {
            setIsStatusLoading(null);
        }
    };

    const filtered = filter === "all" ? bookings : bookings.filter(b => b.status === filter);

    const counts = {
        all:      bookings.length,
        pending:  bookings.filter(b => b.status === "pending").length,
        accepted: bookings.filter(b => b.status === "accepted").length,
        rejected: bookings.filter(b => b.status === "rejected").length,
        completed: bookings.filter(b => b.status === "completed").length,
    };

    if (loading) return (
        <div className="flex h-screen w-full items-center justify-center bg-gray-100">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-gray-600" />
        </div>
    );

    return (
        <div className="flex h-screen bg-gray-100 w-full">
            <ConsultantSideBar />

            {/* Toast */}
            {toast && (
                <div className={`fixed top-5 right-6 z-[60] flex items-center gap-3 px-5 py-3 rounded-xl shadow text-sm font-medium border
                    ${toast.type === "success"
                        ? "bg-green-50 text-green-700 border-green-200"
                        : "bg-red-50 text-red-700 border-red-200"
                    }`}>
                    {toast.type === "success" ? <FiCheckCircle size={16} /> : <FiAlertCircle size={16} />}
                    {toast.msg}
                </div>
            )}

            {/* Note Submission Popup */}
            {showNotePopup && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
                    <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 animate-in fade-in zoom-in duration-200">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-xl font-bold text-gray-900 leading-none">Complete Session</h3>
                            <button 
                                onClick={() => setShowNotePopup(null)}
                                className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                            >
                                <FiXCircle size={20} className="text-gray-400" />
                            </button>
                        </div>
                        
                        <p className="text-sm text-gray-500 mb-5 leading-relaxed">
                            Marking this session as completed. You can leave a concluding note or instructions for the student below.
                        </p>

                        <div className="relative group">
                            <div className="absolute top-2.5 left-3 text-gray-400 group-focus-within:text-blue-500 transition-colors">
                                <FiMessageSquare size={16} />
                            </div>
                            <textarea
                                rows={4}
                                placeholder="E.g., Great progress today! Remember to practice the breathing techniques we discussed..."
                                value={noteInputs[showNotePopup] || ""}
                                onChange={e => setNoteInputs(prev => ({ ...prev, [showNotePopup]: e.target.value }))}
                                className="w-full border border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-50/50 rounded-xl pl-10 pr-4 py-3 text-sm text-gray-700 resize-none transition-all outline-none"
                                maxLength={1000}
                            />
                        </div>

                        <div className="flex gap-3 mt-6">
                            <button
                                onClick={() => setShowNotePopup(null)}
                                className="flex-1 border-2 py-3 text-sm font-bold text-gray-600 bg-gray-50 hover:bg-gray-100 rounded-xl transition-all"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={() => handleCompleteSession(showNotePopup)}
                                disabled={!!isStatusLoading}
                                className="flex-1 py-3 text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-lg shadow-blue-200 disabled:opacity-70 transition-all flex items-center justify-center gap-2"
                            >
                                {isStatusLoading ? "Processing..." : (
                                    <>
                                        Finish & Close
                                        <FiCheckCircle size={16} />
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <main className="flex-1 overflow-y-auto p-8">
                <header className="mb-8 flex justify-between items-center">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-800">Meeting Requests</h1>
                        <p className="text-gray-500 mt-1 text-sm">Accept or reject student booking requests</p>
                    </div>
                    <p className="text-sm font-semibold text-gray-600">
                        {new Date().toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
                    </p>
                </header>

                {/* Summary Tabs */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
                    {(["all", "pending", "accepted", "rejected"] as const).map(key => (
                        <button
                            key={key}
                            onClick={() => setFilter(key)}
                            className={`p-4 rounded-xl border text-left transition-all capitalize ${
                                filter === key
                                    ? "bg-gray-800 border-gray-800 text-white shadow"
                                    : "bg-white border-gray-300 text-gray-700 hover:border-gray-400"
                            }`}
                        >
                            <p className={`text-2xl font-bold ${filter === key ? "text-white" : "text-gray-900"}`}>
                                {counts[key]}
                            </p>
                            <p className={`text-xs mt-1 font-medium capitalize ${filter === key ? "text-gray-300" : "text-gray-500"}`}>
                                {key}
                            </p>
                        </button>
                    ))}
                </div>

                {/* Booking Cards */}
                <div className="space-y-3">
                    {filtered.map(booking => {
                        const cfg = STATUS_CONFIG[booking.status];
                        const avColor = avatarColor(booking.student.id);
                        const isPending = booking.status === "pending";
                        return (
                            <div key={booking.id} className="bg-white border border-gray-300 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                                <div className="p-5 flex items-start gap-4">
                                    {/* Avatar */}
                                    <div className={`w-11 h-11 rounded-full flex items-center justify-center flex-shrink-0 font-semibold text-sm ${avColor}`}>
                                        {booking.student.name.charAt(0).toUpperCase()}
                                    </div>

                                    {/* Info */}
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 flex-wrap">
                                            <p className="text-sm font-bold text-gray-900">{booking.student.name}</p>
                                            <p className="text-xs text-gray-400">{booking.student.email}</p>
                                        </div>

                                        <p className="text-sm font-semibold text-gray-700 mt-1">{booking.topic}</p>

                                        {booking.message && (
                                            <div className="flex items-start gap-1 mt-1">
                                                <FiMessageSquare size={12} className="text-gray-400 mt-0.5 flex-shrink-0" />
                                                <p className="text-xs text-gray-500 line-clamp-2">{booking.message}</p>
                                            </div>
                                        )}

                                        <div className="flex items-center gap-3 mt-2 flex-wrap">
                                            <span className="flex items-center gap-1 text-xs text-gray-500">
                                                <FiCalendar size={11} /> {formatDate(booking.date)}
                                            </span>
                                            <span className="flex items-center gap-1 text-xs text-gray-500">
                                                <FiClock size={11} /> {booking.time}
                                            </span>
                                            <span className={`flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full ${
                                                booking.meetingType === "online"
                                                    ? "bg-blue-100 text-blue-700"
                                                    : "bg-orange-100 text-orange-700"
                                            }`}>
                                                {booking.meetingType === "online" ? <FiWifi size={10} /> : <FiMapPin size={10} />}
                                                {booking.meetingType === "online" ? "Online" : "In-Person"}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Right side: status + actions */}
                                    <div className="flex flex-col items-end gap-3 flex-shrink-0">
                                        <span className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold ${cfg.color}`}>
                                            {cfg.icon} {cfg.label}
                                        </span>

                                        {isPending && (
                                            <div className="flex items-center gap-2">
                                                <button
                                                    disabled={!!actionLoading}
                                                    onClick={() => handleAction(booking.id, "accepted")}
                                                    className="px-4 py-1.5 bg-gray-800 hover:bg-gray-700 text-white text-xs font-semibold rounded-lg transition disabled:opacity-50"
                                                >
                                                    {actionLoading === booking.id + "accepted" ? "..." : "Accept"}
                                                </button>
                                                <button
                                                    disabled={!!actionLoading}
                                                    onClick={() => handleAction(booking.id, "rejected")}
                                                    className="px-4 py-1.5 border border-gray-300 hover:bg-gray-100 text-gray-700 text-xs font-semibold rounded-lg transition disabled:opacity-50"
                                                >
                                                    {actionLoading === booking.id + "rejected" ? "..." : "Reject"}
                                                </button>
                                            </div>
                                        )}

                                        {booking.status === "accepted" && (
                                            <div className="flex items-center gap-2">
                                                <button
                                                    onClick={() => router.push(`/rooms/${booking.id}`)}
                                                    className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-800 hover:bg-gray-700 text-white text-xs font-semibold rounded-lg transition"
                                                >
                                                    <FiVideo size={12} /> Open Meeting
                                                </button>
                                                <button 
                                                    onClick={() => setShowNotePopup(booking.id)}
                                                    className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg transition shadow-md shadow-blue-100"
                                                >
                                                    <FiCheckCircle size={12} /> Submit
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Completed Note Display */}
                                {booking.status === "completed" && booking.consultantNote && (
                                    <div className="px-5 pb-5">
                                        <div className="border-t border-gray-100 pt-4">
                                            <div className="p-3 bg-blue-50/50 border border-blue-100 rounded-xl">
                                                <p className="text-[10px] font-black text-blue-500 mb-1 flex items-center gap-1 uppercase tracking-widest">
                                                    <FiMessageSquare size={11} /> Concluding Note
                                                </p>
                                                <p className="text-[11px] font-bold text-slate-700 leading-relaxed italic">"{booking.consultantNote}"</p>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        );
                    })}

                    {filtered.length === 0 && (
                        <div className="text-center py-20 text-gray-400">
                            <FiCalendar size={40} className="mx-auto mb-3 opacity-30" />
                            <p className="text-sm">No {filter !== "all" ? filter : ""} meeting requests found.</p>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}
