"use client";
import React, { useState, useEffect, useCallback } from "react";
import { SideBar } from "@/component/sidebar";
import {
    FiCalendar, FiClock, FiUser, FiCheckCircle, FiAlertCircle,
    FiXCircle, FiMessageSquare, FiVideo, FiChevronRight, FiWifi, FiMapPin,
} from "react-icons/fi";
import { useRouter } from "next/navigation";
import { getRequest, postRequest } from "@/utils";

type BookingStatus = "pending" | "accepted" | "rejected";

type MeetingType = "online" | "offline";

type Booking = {
    id: string;
    date: string;
    time: string;
    topic: string;
    message?: string | null;
    meetingType: MeetingType;
    consultantNote?: string | null;
    status: BookingStatus;
    consultant: { id: number; name: string; email: string };
};

type Consultant = { id: number; name: string; email: string };

const STATUS_CONFIG: Record<BookingStatus, { label: string; color: string; icon: React.ReactNode }> = {
    pending:  { label: "Pending",  color: "bg-yellow-100 text-yellow-700", icon: <FiAlertCircle size={13} /> },
    accepted: { label: "Accepted", color: "bg-green-100 text-green-700",   icon: <FiCheckCircle size={13} /> },
    rejected: { label: "Rejected", color: "bg-red-100 text-red-500",       icon: <FiXCircle size={13} /> },
};

const TIME_SLOTS = [
    "09:00 AM", "09:30 AM", "10:00 AM", "10:30 AM",
    "11:00 AM", "11:30 AM", "12:00 PM", "01:00 PM",
    "01:30 PM", "02:00 PM", "02:30 PM", "03:00 PM",
    "03:30 PM", "04:00 PM", "04:30 PM", "05:00 PM",
];

function formatDate(dateStr: string) {
    return new Date(dateStr + "T00:00:00").toLocaleDateString("en-US", {
        weekday: "short", month: "short", day: "numeric",
    });
}

function Toast({ msg, type, onClose }: { msg: string; type: "success" | "error"; onClose: () => void }) {
    useEffect(() => { const t = setTimeout(onClose, 3500); return () => clearTimeout(t); }, [onClose]);
    return (
        <div className={`fixed top-5 right-6 z-50 flex items-center gap-3 px-5 py-3 rounded-xl shadow text-sm font-medium border
            ${type === "success" ? "bg-green-50 text-green-700 border-green-200" : "bg-red-50 text-red-700 border-red-200"}`}>
            {type === "success" ? <FiCheckCircle size={16} /> : <FiAlertCircle size={16} />}
            {msg}
        </div>
    );
}

export default function BookSessionPage() {
    const router = useRouter();

    // Booking form state
    const [consultants, setConsultants] = useState<Consultant[]>([]);
    const [form, setForm] = useState({
        consultantId: "",
        date: "",
        time: "",
        topic: "",
        message: "",
        meetingType: "online" as MeetingType,
    });
    const [submitting, setSubmitting] = useState(false);

    // My bookings state
    const [myBookings, setMyBookings] = useState<Booking[]>([]);
    const [bookingsLoading, setBookingsLoading] = useState(true);

    const [toast, setToast] = useState<{ msg: string; type: "success" | "error" } | null>(null);

    const getAuthHeader = () => ({
        authorization: "Bearer " + (typeof window !== "undefined" ? localStorage.getItem("token") || "" : ""),
    });

    const showToast = (msg: string, type: "success" | "error") => setToast({ msg, type });

    const fetchMyBookings = useCallback(async () => {
        setBookingsLoading(true);
        try {
            const res: any = await getRequest("bookings/my", getAuthHeader());
            setMyBookings(res?.data?.bookings || []);
        } catch {
            // silent fail
        } finally {
            setBookingsLoading(false);
        }
    }, []);

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) { router.push("/login"); return; }

        // Load consultants list
        getRequest("bookings/consultants", {})
            .then((res: any) => setConsultants(res?.data?.consultants || []))
            .catch(() => { });

        fetchMyBookings();
    }, [router, fetchMyBookings]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!form.consultantId || !form.date || !form.time || !form.topic.trim()) {
            showToast("Please fill in all required fields.", "error");
            return;
        }
        setSubmitting(true);
        try {
            const res: any = await postRequest(
                "bookings",
                {
                    consultantId: Number(form.consultantId),
                    date: form.date,
                    time: form.time,
                    topic: form.topic.trim(),
                    message: form.message.trim() || undefined,
                    meetingType: form.meetingType,
                },
                getAuthHeader()
            );
            if (res?.success) {
                showToast("Meeting request sent!", "success");
                setForm({ consultantId: "", date: "", time: "", topic: "", message: "", meetingType: "online" });
                fetchMyBookings();
            } else {
                showToast(res?.message || "Failed to book meeting", "error");
            }
        } catch {
            showToast("Failed to book meeting", "error");
        } finally {
            setSubmitting(false);
        }
    };

    // Min date: today
    const today = new Date().toISOString().split("T")[0];

    return (
        <div className="flex h-screen bg-gray-100 w-full">
            <SideBar />

            {toast && <Toast msg={toast.msg} type={toast.type} onClose={() => setToast(null)} />}

            <main className="flex-1 overflow-y-auto p-8">
                <header className="mb-8">
                    <h1 className="text-2xl font-bold text-gray-800">Book a Virtual Meeting</h1>
                    <p className="text-gray-500 mt-1 text-sm">Request a session with one of our consultants</p>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* ── Booking Form ── */}
                    <div className="bg-white border border-gray-300 rounded-xl shadow-sm p-6">
                        <div className="flex items-center gap-2 mb-6">
                            <div className="w-8 h-8 bg-gray-200 rounded-lg flex items-center justify-center">
                                <FiVideo size={16} className="text-gray-700" />
                            </div>
                            <h2 className="text-base font-bold text-gray-800">New Meeting Request</h2>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            {/* Consultant */}
                            <div>
                                <label className="block text-xs font-semibold text-gray-600 mb-1">
                                    <FiUser size={12} className="inline mr-1" />Consultant <span className="text-red-500">*</span>
                                </label>
                                <select
                                    value={form.consultantId}
                                    onChange={e => setForm(f => ({ ...f, consultantId: e.target.value }))}
                                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-gray-400"
                                    required
                                >
                                    <option value="">Select a consultant...</option>
                                    {consultants.map(c => (
                                        <option key={c.id} value={c.id}>{c.name}</option>
                                    ))}
                                </select>
                            </div>

                            {/* Date + Time */}
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-xs font-semibold text-gray-600 mb-1">
                                        <FiCalendar size={12} className="inline mr-1" />Date <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="date"
                                        min={today}
                                        value={form.date}
                                        onChange={e => setForm(f => ({ ...f, date: e.target.value }))}
                                        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-400"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-gray-600 mb-1">
                                        <FiClock size={12} className="inline mr-1" />Time <span className="text-red-500">*</span>
                                    </label>
                                    <select
                                        value={form.time}
                                        onChange={e => setForm(f => ({ ...f, time: e.target.value }))}
                                        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-gray-400"
                                        required
                                    >
                                        <option value="">Select time...</option>
                                        {TIME_SLOTS.map(t => (
                                            <option key={t} value={t}>{t}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            {/* Meeting Type */}
                            <div>
                                <label className="block text-xs font-semibold text-gray-600 mb-2">
                                    Meeting Type <span className="text-red-500">*</span>
                                </label>
                                <div className="grid grid-cols-2 gap-2">
                                    {(["online", "offline"] as MeetingType[]).map(type => (
                                        <button
                                            key={type}
                                            type="button"
                                            onClick={() => setForm(f => ({ ...f, meetingType: type }))}
                                            className={`flex items-center justify-center gap-2 py-2 rounded-lg border text-xs font-semibold transition ${
                                                form.meetingType === type
                                                    ? "bg-gray-800 border-gray-800 text-white"
                                                    : "bg-white border-gray-300 text-gray-600 hover:border-gray-400"
                                            }`}
                                        >
                                            {type === "online"
                                                ? <FiWifi size={13} />
                                                : <FiMapPin size={13} />}
                                            {type === "online" ? "Online" : "In-Person"}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Topic */}
                            <div>
                                <label className="block text-xs font-semibold text-gray-600 mb-1">
                                    Topic / Reason <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    placeholder="e.g. Anxiety management, Academic stress..."
                                    value={form.topic}
                                    onChange={e => setForm(f => ({ ...f, topic: e.target.value }))}
                                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-400"
                                    required
                                    maxLength={100}
                                />
                            </div>

                            {/* Message */}
                            <div>
                                <label className="block text-xs font-semibold text-gray-600 mb-1">
                                    <FiMessageSquare size={12} className="inline mr-1" />Additional message (optional)
                                </label>
                                <textarea
                                    rows={3}
                                    placeholder="Share any additional context or notes..."
                                    value={form.message}
                                    onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
                                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-700 resize-none focus:outline-none focus:ring-2 focus:ring-gray-400"
                                    maxLength={500}
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={submitting}
                                className="w-full flex items-center justify-center gap-2 py-2.5 bg-gray-800 hover:bg-gray-700 text-white text-sm font-semibold rounded-lg transition disabled:opacity-50"
                            >
                                {submitting ? "Sending..." : (<><FiVideo size={15} /> Request Meeting</>)}
                            </button>
                        </form>
                    </div>

                    {/* ── My Bookings ── */}
                    <div>
                        <h2 className="text-base font-bold text-gray-800 mb-4">My Booking Requests</h2>

                        {bookingsLoading ? (
                            <div className="flex justify-center py-12">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-600" />
                            </div>
                        ) : myBookings.length === 0 ? (
                            <div className="text-center py-16 text-gray-400 bg-white border border-gray-300 rounded-xl">
                                <FiCalendar size={36} className="mx-auto mb-3 opacity-30" />
                                <p className="text-sm">No meeting requests yet.</p>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {myBookings.map(b => {
                                    const cfg = STATUS_CONFIG[b.status];
                                    return (
                                        <div key={b.id} className="bg-white border border-gray-300 rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow">
                                            <div className="flex items-start justify-between gap-3">
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-center gap-2">
                                                        <p className="text-sm font-bold text-gray-900">{b.topic}</p>
                                                    </div>
                                                    <p className="text-xs text-gray-500 mt-0.5">
                                                        with <span className="font-medium text-gray-700">{b.consultant.name}</span>
                                                    </p>
                                                    <div className="flex items-center gap-3 mt-2 flex-wrap">
                                                        <span className="flex items-center gap-1 text-xs text-gray-500">
                                                            <FiCalendar size={11} /> {formatDate(b.date)}
                                                        </span>
                                                        <span className="flex items-center gap-1 text-xs text-gray-500">
                                                            <FiClock size={11} /> {b.time}
                                                        </span>
                                                        <span className={`flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full ${
                                                            b.meetingType === "online"
                                                                ? "bg-blue-100 text-blue-700"
                                                                : "bg-orange-100 text-orange-700"
                                                        }`}>
                                                            {b.meetingType === "online" ? <FiWifi size={10} /> : <FiMapPin size={10} />}
                                                            {b.meetingType === "online" ? "Online" : "In-Person"}
                                                        </span>
                                                    </div>
                                                </div>
                                                <span className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold flex-shrink-0 ${cfg.color}`}>
                                                    {cfg.icon} {cfg.label}
                                                </span>
                                            </div>
                                            {b.status === "accepted" && (
                                                <div className="mt-3 pt-3 border-t border-gray-100">
                                                    <div className="flex items-center justify-between mb-2">
                                                        <p className="text-xs text-green-600 font-medium flex items-center gap-1">
                                                            <FiCheckCircle size={12} /> Meeting confirmed!
                                                        </p>
                                                        <button
                                                            onClick={() => router.push(`/rooms/${b.id}`)}
                                                            className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-800 hover:bg-gray-700 text-white text-xs font-semibold rounded-lg transition"
                                                        >
                                                            <FiVideo size={12} /> Open Meeting
                                                        </button>
                                                    </div>
                                                    {b.consultantNote && (
                                                        <div className="mt-2 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                                                            <p className="text-xs font-semibold text-blue-600 mb-1 flex items-center gap-1">
                                                                <FiMessageSquare size={11} /> Note from Consultant
                                                            </p>
                                                            <p className="text-xs text-blue-800">{b.consultantNote}</p>
                                                        </div>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
}
