"use client";
import React, { useState, useEffect } from "react";
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
    FiLock
} from "react-icons/fi";
import { useRouter } from "next/navigation";

const UPCOMING_SCHEDULE = [
    { id: "1", client: "John Doe", time: "10:00 AM", type: "Therapy Session", status: "Confirmed" },
    { id: "2", client: "Jane Smith", time: "02:00 PM", type: "Follow-up", status: "Pending" },
    { id: "3", client: "Mike Johnson", time: "04:30 PM", type: "Initial Consultation", status: "Confirmed" },
];

const DAILY_TASKS = [
    { id: "1", text: "Review John's intake form", completed: true },
    { id: "2", text: "Write session notes for Jane", completed: false },
    { id: "3", text: "Update availability for next week", completed: false },
];

export default function ConsultantDashboard() {
    const router = useRouter();
    const [tasks, setTasks] = useState(DAILY_TASKS);
    const [userRole, setUserRole] = useState<string | null>(null);
    const [userName, setUserName] = useState<string>("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem("token");
        const role = localStorage.getItem("role");
        const name = localStorage.getItem("userName") || "";

        // if (!token) {
        //     router.push("/login");
        //     return;
        // }

        setUserRole(role);
        setUserName(name);
        setLoading(false);
    }, [router]);

    if (loading) {
        return (
            <div className="flex h-screen w-full items-center justify-center bg-gray-50">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    // if (userRole !== "consultant") {
    //     return (
    //         <div className="flex h-screen w-full items-center justify-center bg-gray-50">
    //             <Card className="p-8 max-w-md text-center shadow-lg border border-gray-200">
    //                 <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
    //                     <FiLock size={32} />
    //                 </div>
    //                 <h2 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h2>
    //                 <p className="text-gray-600 mb-6">
    //                     This area is reserved for consultants only. Please contact administration if you believe this is an error.
    //                 </p>
    //                 <button 
    //                     onClick={() => router.push("/dashboard")}
    //                     className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors"
    //                 >
    //                     Go to Student Dashboard
    //                 </button>
    //             </Card>
    //         </div>
    //     );
    // }

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
                        <p className="text-gray-600 mt-1">Manage your clients and upcoming sessions</p>
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
                        value="8"
                        icon={<FiCalendar size={24} />}
                        color="text-blue-500"
                        bgColor="bg-blue-50"
                    />
                    <StatsCard
                        title="Active Clients"
                        value="24"
                        icon={<FiUsers size={24} />}
                        color="text-green-500"
                        bgColor="bg-green-50"
                    />
                    <StatsCard
                        title="Hours This Week"
                        value="32h"
                        icon={<FiClock size={24} />}
                        color="text-purple-500"
                        bgColor="bg-purple-50"
                    />
                    <StatsCard
                        title="New Messages"
                        value="5"
                        icon={<FiMessageSquare size={24} />}
                        color="text-orange-500"
                        bgColor="bg-orange-50"
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
                                            <th className="pb-3 font-medium">Time</th>
                                            <th className="pb-3 font-medium">Type</th>
                                            <th className="pb-3 font-medium">Status</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-50">
                                        {UPCOMING_SCHEDULE.map((session) => (
                                            <tr key={session.id} className="hover:bg-gray-50 transition-colors">
                                                <td className="py-4 font-medium text-gray-900">{session.client}</td>
                                                <td className="py-4 text-gray-600 text-sm">{session.time}</td>
                                                <td className="py-4 text-gray-600 text-sm">{session.type}</td>
                                                <td className="py-4">
                                                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                                                        session.status === "Confirmed" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"
                                                    }`}>
                                                        {session.status}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
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
