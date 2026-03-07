"use client";
import React, { useState, useEffect } from "react";
import { SideBar } from "@/component/sidebar";
import { Card } from "@heroui/react";
import {
    FiActivity,
    FiSmile,
    FiTrendingUp,
    FiCalendar,
    FiSun,
    FiAward,
    FiCheckCircle,
    FiCircle
} from "react-icons/fi";
import { motion } from "framer-motion";
import dynamic from "next/dynamic";
import { getRequest, patchRequest, postRequest } from "@/utils";

const ActivityCalendar = dynamic(
    () => import("react-activity-calendar").then((mod) => mod.ActivityCalendar),
    { ssr: false }
);

type DashboardTask = {
    id: string;
    text: string;
    completed: boolean;
};

const MOOD_OPTIONS = [
    { label: "Awful", score: 1, icon: "😫", color: "bg-red-100 text-red-600 hover:bg-red-200" },
    { label: "Bad", score: 2, icon: "😔", color: "bg-orange-100 text-orange-600 hover:bg-orange-200" },
    { label: "Okay", score: 3, icon: "😐", color: "bg-yellow-100 text-yellow-600 hover:bg-yellow-200" },
    { label: "Good", score: 4, icon: "🙂", color: "bg-blue-100 text-blue-600 hover:bg-blue-200" },
    { label: "Great", score: 5, icon: "😄", color: "bg-green-100 text-green-600 hover:bg-green-200" },
];

export default function DashboardPage() {
    const [mood, setMood] = useState<string | null>(null);
    const [tasks, setTasks] = useState<DashboardTask[]>([]);
    const [activityData, setActivityData] = useState<any[]>([]);
    const [streak, setStreak] = useState(0);
    const [totalCheckIns, setTotalCheckIns] = useState(0);
    const [avgMoodScore, setAvgMoodScore] = useState(0);
    const [mindfulMinutes, setMindfulMinutes] = useState(0);
    const [loading, setLoading] = useState(false);

    const safeActivityData = activityData.length > 0
        ? activityData.map((d: { date: string; count: number; level: number }) => ({
            ...d,
            level: Math.min(d.level, 4) as 0 | 1 | 2 | 3 | 4,
        }))
        : [{
            date: new Date().toISOString().split("T")[0],
            count: 0,
            level: 0 as const,
        }];

    const getAuthHeader = () => ({
        "authorization": "Bearer " + (typeof window !== "undefined" ? (localStorage.getItem("token") || "") : "")
    });

    useEffect(() => {
        getRequest("analytics/dashboard", getAuthHeader()).then((res: any) => {
            const data = res?.data || {};

            setStreak(data.streak || 0);
            setTotalCheckIns(data.totalCheckIns || 0);
            setAvgMoodScore(data.avgMoodScore || 0);
            setMindfulMinutes(data.mindfulMinutes || 0);
            setMood(data.todayCheckIn?.moodLabel || null);
            setActivityData(Array.isArray(data.activityData) ? data.activityData : []);

            const todayTasks = Array.isArray(data.todayTasks) ? data.todayTasks : [];
            setTasks(todayTasks.map((task: any) => ({
                id: task.id,
                text: task.taskText,
                completed: task.completed
            })));
        }).catch((err: any) => {
            console.error("Failed to fetch dashboard data:", err);
        });
    }, []);

    const toggleTask = async (id: string) => {
        const current = tasks.find((task) => task.id === id);
        if (!current) return;

        const nextCompleted = !current.completed;
        setTasks((prevTasks) => prevTasks.map((task) =>
            task.id === id ? { ...task, completed: nextCompleted } : task
        ));

        try {
            await patchRequest(`analytics/tasks/${id}`, { completed: nextCompleted }, getAuthHeader());
        } catch (err) {
            setTasks((prevTasks) => prevTasks.map((task) =>
                task.id === id ? { ...task, completed: current.completed } : task
            ));
            console.error("Failed to update task status:", err);
        }
    };

    const handleMoodSelect = async (selectedMood: string) => {
        setLoading(true);
        const moodOption = MOOD_OPTIONS.find((item) => item.label === selectedMood);

        try {
            await postRequest("analytics/check-in", {
                moodLabel: selectedMood,
                moodScore: moodOption?.score || 3,
            }, getAuthHeader());

            setMood(selectedMood);
            setTotalCheckIns((prev) => prev + 1);
        } catch (err) {
            console.error("Failed to save mood check-in:", err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex h-screen bg-gray-50 w-full">
            {/* Sidebar Navigation */}
            <SideBar />

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto p-8">
                <header className="mb-8 flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Welcome Back, User</h1>
                        <p className="text-gray-600 mt-1">Here's your mental wellness overview for today</p>
                    </div>
                    <div className="text-right">
                        <p className="text-sm font-semibold text-gray-900">
                            {new Date().toLocaleDateString("en-US", { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                        </p>
                    </div>
                </header>

                {/* Daily Mood Check-In Section */}
                <section className="mb-8">
                    <Card className="p-6 bg-white shadow-sm border border-gray-200">
                        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                            <div className="flex-1">
                                <h2 className="text-xl font-bold text-gray-900 mb-2 flex items-center gap-2">
                                    <FiSun className="text-orange-500" /> Daily Mood Check-in
                                </h2>
                                <p className="text-gray-600 mb-6">How are you feeling right now?</p>

                                {!mood ? (
                                    <div className="flex flex-wrap gap-3">
                                        {MOOD_OPTIONS.map((item) => (
                                            <motion.button
                                                key={item.label}
                                                whileHover={{ scale: 1.05 }}
                                                whileTap={{ scale: 0.95 }}
                                                onClick={() => handleMoodSelect(item.label)}
                                                disabled={loading}
                                                className={`flex flex-col items-center justify-center p-4 rounded-xl transition-colors ${item.color} w-24 h-24`}
                                            >
                                                <span className="text-2xl mb-1">{item.icon}</span>
                                                <span className="text-sm font-medium">{item.label}</span>
                                            </motion.button>
                                        ))}
                                    </div>
                                ) : (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-3"
                                    >
                                        <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center text-xl">
                                            ✓
                                        </div>
                                        <div>
                                            <p className="font-semibold text-green-800">Check-in Complete!</p>
                                            <p className="text-sm text-green-700">
                                                You're feeling <span className="font-bold">{mood}</span> today.
                                                {mood === "Bad" || mood === "Awful" ? " Sorry to hear that. Would you like to chat?" : " Keep it up!"}
                                            </p>
                                        </div>
                                    </motion.div>
                                )}
                            </div>

                            {/* Daily Quote or mini-graphic */}
                            <div className="hidden md:block w-1/3">
                                <div className="bg-indigo-50 p-4 rounded-xl border border-indigo-100">
                                    <p className="text-indigo-800 italic font-medium">"Every day may not be good... but there's something good in every day."</p>
                                    <p className="text-indigo-600 text-sm mt-2 text-right">- Alice Morse Earle</p>
                                </div>
                            </div>
                        </div>
                    </Card>
                </section>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <StatsCard
                        title="Current Streak"
                        value={`${streak} Days`}
                        icon={<FiActivity size={24} />}
                        color="text-orange-500"
                        bgColor="bg-orange-50"
                    />
                    <StatsCard
                        title="Total Check-ins"
                        value={String(totalCheckIns)}
                        icon={<FiCalendar size={24} />}
                        color="text-blue-500"
                        bgColor="bg-blue-50"
                    />
                    <StatsCard
                        title="Avg. Mood Score"
                        value={`${avgMoodScore}/5`}
                        icon={<FiSmile size={24} />}
                        color="text-green-500"
                        bgColor="bg-green-50"
                    />
                    <StatsCard
                        title="Mindful Minutes"
                        value={String(mindfulMinutes)}
                        icon={<FiAward size={24} />}
                        color="text-purple-500"
                        bgColor="bg-purple-50"
                    />
                </div>

                {/* Charts & Graphs Row */}
                <section className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Weekly Streak Graph */}
                    <div className="lg:col-span-2">
                        <div>
                            <Card className="bg-white p-6 shadow-sm border border-gray-200 h-full overflow-hidden">
                                <div className="flex justify-between items-center mb-6">
                                    <div>
                                        <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                                            <FiTrendingUp className="text-blue-600" /> Yearly Mood Heatmap
                                        </h3>
                                        <p className="text-sm text-gray-500 ml-7">Your emotional activity throughout the year</p>
                                    </div>
                                </div>
                                <div>
                                    <div className="flex items-center justify-center p-0 overflow-hidden">
                                        <ActivityCalendar
                                            data={safeActivityData}
                                            theme={{
                                                light: ['#e5e7eb', '#14532d', '#166534', '#16a34a', '#22c55e'],
                                                dark: ['#e5e7eb', '#14532d', '#166534', '#16a34a', '#22c55e'],
                                            }}
                                            labels={{
                                                legend: {
                                                    less: 'Less',
                                                    more: 'More',
                                                },
                                                months: [
                                                    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
                                                    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
                                                ],

                                            }}
                                            showWeekdayLabels
                                            blockSize={12}
                                            blockRadius={2}
                                            blockMargin={4}

                                        />
                                    </div>
                                </div>

                            </Card>
                        </div>
                    </div>

                    {/* Recent Activity / Daily Tasks */}
                    <div className="lg:col-span-1 space-y-6">
                        <Card className="bg-white p-6 shadow-sm border border-gray-200 h-full">
                            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                                <FiAward className="text-green-600" /> Daily Wellness Goals
                            </h3>
                            <div className="space-y-3">
                                {tasks.map((task) => (
                                    <motion.div
                                        key={task.id}
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        onClick={() => toggleTask(task.id)}
                                        className={`p-3 rounded-xl border transition-all cursor-pointer flex items-center gap-3 ${task.completed ? 'bg-green-50 border-green-200 shadow-inner' : 'bg-white border-gray-100 hover:border-blue-200 hover:shadow-sm'}`}
                                    >
                                        <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${task.completed ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400'}`}>
                                            {task.completed ? <FiCheckCircle size={18} /> : <FiCircle size={18} />}
                                        </div>
                                        <span className={`text-sm font-medium transition-all ${task.completed ? 'text-green-800 line-through opacity-70' : 'text-gray-700'}`}>
                                            {task.text}
                                        </span>
                                    </motion.div>
                                ))}
                            </div>

                            {/* Progress bar */}
                            <div className="mt-6 pt-4 border-t border-gray-100">
                                <div className="flex justify-between text-xs mb-2">
                                    <span className="text-gray-500 font-medium">Daily Progress</span>
                                    <span className="font-bold text-gray-900">{Math.round((tasks.filter(t => t.completed).length / tasks.length) * 100)}%</span>
                                </div>
                                <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: `${(tasks.filter(t => t.completed).length / tasks.length) * 100}%` }}
                                        className="h-full bg-gradient-to-r from-green-400 to-emerald-500"
                                    />
                                </div>
                                {tasks.every(t => t.completed) && (
                                    <motion.p
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        className="text-center text-xs text-green-600 font-bold mt-2"
                                    >
                                        All goals completed! Great job!
                                    </motion.p>
                                )}
                            </div>
                        </Card>
                    </div>
                </section>
            </main>
        </div>
    );
}

// Sub-component for Stats Cards
const StatsCard = ({ title, value, icon, color, bgColor }: any) => (
    <Card className="p-4 bg-white border border-gray-200 shadow-sm flex items-center gap-4 transition hover:shadow-md">
        <div className={`w-12 h-12 rounded-full ${bgColor} flex items-center justify-center ${color}`}>
            {icon}
        </div>
        <div>
            <p className="text-gray-500 text-sm font-medium">{title}</p>
            <p className="text-xl font-bold text-gray-900">{value}</p>
        </div>
    </Card>
);