"use client";
import React, { useState, useEffect, useCallback } from "react";
import { ConsultantSideBar } from "@/component/consultantSidebar";
import { Card } from "@heroui/react";
import {
    FiActivity,
    FiUsers,
    FiCalendar,
    FiClock,
    FiCheckCircle,
    FiCircle,
    FiMessageSquare,
    FiLock,
    FiAlertCircle
} from "react-icons/fi";
import { useRouter } from "next/navigation";
import { getRequest } from "@/utils";

type BookingStatus = "pending" | "accepted" | "rejected" | "completed";

type Booking = {
    id: string;
    date: string;
    time: string;
    topic: string;
    status: BookingStatus;
    student: { id: number; name: string; email: string };
};

const DAILY_TASKS = [
    { id: "1", text: "Review today's intake forms", completed: false },
    { id: "2", text: "Prepare for upcoming sessions", completed: false },
    { id: "3", text: "Update availability for next week", completed: false },
];

export default function ConsultantDashboard() {
    const router = useRouter();
    const [tasks, setTasks] = useState(DAILY_TASKS);
    const [userRole, setUserRole] = useState<string | null>(null);
    const [userName, setUserName] = useState<string>("");
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [loading, setLoading] = useState(true);

    const getAuthHeader = () => ({
        authorization: "Bearer " + (typeof window !== "undefined" ? localStorage.getItem("token") || "" : ""),
    });

    const fetchDashboardData = useCallback(async () => {
        try {
            const res: any = await getRequest("bookings/consultant", getAuthHeader());
            if (res?.success) {
                setBookings(res?.data?.bookings || []);
            }
        } catch (error) {
            console.error("Failed to load dashboard data", error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        const token = localStorage.getItem("token");
        const role = localStorage.getItem("role");
        const name = localStorage.getItem("userName") || "";

        if (!token) {
            router.push("/login");
            return;
        }

        setUserRole(role);
        setUserName(name);

        if (role === "consultant") {
            fetchDashboardData();
        } else {
            router.push("/dashboard");
        }
    }, [router, fetchDashboardData]);

    if (loading) {
        return (
            <div className="flex h-screen w-full items-center justify-center bg-gray-50">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    const todayStr = new Date().toISOString().split("T")[0];
    const todaysSessions = bookings.filter(b => b.date === todayStr && (b.status === "accepted" || b.status === "completed"));
    const activeClients = Array.from(new Set(bookings.map(b => b.student.id))).length;
    const pendingRequests = bookings.filter(b => b.status === "pending").length;
    
    // Sort upcoming accepted sessions
    const upcomingSchedule = bookings
        .filter(b => b.status === "accepted")
        .sort((a, b) => {
            const dateComp = a.date.localeCompare(b.date);
            return dateComp !== 0 ? dateComp : a.time.localeCompare(b.time);
        })
        .slice(0, 5);

    const toggleTask = (id: string) => {
        setTasks(prev => prev.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
    };

    return (
        <div className="flex h-screen bg-gray-50 w-full">
            <ConsultantSideBar />

            <main className="flex-1 overflow-y-auto p-8">
                <header className="mb-8 flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 text-blue-800">Consultant Portal</h1>
                        <p className="text-gray-600 mt-1">Welcome back, {userName}</p>
                    </div>
                    <div className="text-right">
                        <p className="text-sm font-semibold text-gray-900">
                            {new Date().toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
                        </p>
                        <p className="text-xs text-gray-500 italic">Logged in as {userName} (Consultant)</p>
                    </div>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <StatsCard
                        title="Today's Sessions"
                        value={todaysSessions.length.toString()}
                        icon={<FiCalendar size={24} />}
                        color="text-blue-500"
                        bgColor="bg-blue-50"
                    />
                    <StatsCard
                        title="Active Clients"
                        value={activeClients.toString()}
                        icon={<FiUsers size={24} />}
                        color="text-green-500"
                        bgColor="bg-green-50"
                    />
                    <StatsCard
                        title="Pending Requests"
                        value={pendingRequests.toString()}
                        icon={<FiAlertCircle size={24} />}
                        color="text-orange-500"
                        bgColor="bg-orange-50"
                    />
                    <StatsCard
                        title="Total Bookings"
                        value={bookings.length.toString()}
                        icon={<FiActivity size={24} />}
                        color="text-purple-500"
                        bgColor="bg-purple-50"
                    />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <section className="lg:col-span-2">
                        <Card className="bg-white p-6 shadow-sm border border-gray-200 h-full">
                            <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
                                <FiActivity className="text-blue-600" /> Upcoming Schedule
                            </h3>
                            <div className="overflow-x-auto">
                                <table className="w-full text-left">
                                    <thead>
                                        <tr className="border-b border-gray-100 text-gray-400 text-sm">
                                            <th className="pb-3 font-medium">Client</th>
                                            <th className="pb-3 font-medium">Date & Time</th>
                                            <th className="pb-3 font-medium">Topic</th>
                                            <th className="pb-3 font-medium">Status</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-50">
                                        {upcomingSchedule.length > 0 ? (
                                            upcomingSchedule.map((session) => (
                                                <tr key={session.id} className="hover:bg-gray-50 transition-colors">
                                                    <td className="py-4 font-medium text-gray-900">{session.student.name}</td>
                                                    <td className="py-4 text-gray-600 text-sm">{session.date} - {session.time}</td>
                                                    <td className="py-4 text-gray-600 text-sm truncate max-w-[150px]">{session.topic}</td>
                                                    <td className="py-4">
                                                        <span className={`px-2 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700`}>
                                                            Accepted
                                                        </span>
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan={4} className="py-10 text-center text-gray-400 italic">
                                                    No upcoming accepted sessions.
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </Card>
                    </section>

                    <section className="lg:col-span-1">
                        <Card className="bg-white p-6 shadow-sm border border-gray-200 h-full">
                            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                                <FiCheckCircle className="text-green-600" /> Daily Priorities
                            </h3>
                            <div className="space-y-3">
                                {tasks.map((task) => (
                                    <div
                                        key={task.id}
                                        onClick={() => toggleTask(task.id)}
                                        className={`p-3 rounded-xl border transition-all cursor-pointer flex items-center gap-3 ${
                                            task.completed ? "bg-green-50 border-green-200" : "bg-white border-gray-100 hover:border-blue-200"
                                        }`}
                                    >
                                        <div className={task.completed ? "text-green-600" : "text-gray-400"}>
                                            {task.completed ? <FiCheckCircle size={18} /> : <FiCircle size={18} />}
                                        </div>
                                        <span className={`text-sm font-medium ${task.completed ? "text-green-800 line-through opacity-70" : "text-gray-700"}`}>
                                            {task.text}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </Card>
                    </section>
                </div>
            </main>
        </div>
    );
}

const StatsCard = ({ title, value, icon, color, bgColor }: any) => (
    <Card className="p-4 bg-white border border-gray-200 shadow-sm flex items-center gap-4 hover:shadow-md transition-shadow">
        <div className={`w-12 h-12 rounded-full ${bgColor} flex items-center justify-center ${color}`}>
            {icon}
        </div>
        <div>
            <p className="text-gray-500 text-sm font-medium">{title}</p>
            <p className="text-xl font-bold text-gray-900">{value}</p>
        </div>
    </Card>
);


