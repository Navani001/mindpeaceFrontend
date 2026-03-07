"use client";
import React, { useEffect, useState } from "react";
import { SideBar } from "@/component/sidebar";
import { Card } from "@heroui/react";
import {
    FiActivity,
    FiTrendingUp,
    FiPieChart,
    FiCalendar,
    FiSmile,
    FiAward,
    FiVideo
} from "react-icons/fi";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { getRequest } from "@/utils";

export default function AnalyticsPage() {
    const [moodDistribution, setMoodDistribution] = useState<any[]>([]);
    const [weeklyData, setWeeklyData] = useState<any[]>([]);
    const [streak, setStreak] = useState(0);
    const [totalCheckIns, setTotalCheckIns] = useState(0);
    const [avgMoodScore, setAvgMoodScore] = useState(0);
    const [mindfulMinutes, setMindfulMinutes] = useState(0);
    const router = useRouter();

    const moodColorMap: Record<string, string> = {
        Great: "bg-green-500",
        Good: "bg-blue-500",
        Okay: "bg-yellow-500",
        Bad: "bg-orange-500",
        Awful: "bg-red-500",
    };

    const getAuthHeader = () => ({
        "authorization": "Bearer " + (typeof window !== "undefined" ? (localStorage.getItem("token") || "") : "")
    });

    useEffect(() => {
        const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
        if (!token) {
            return;
        }

        Promise.all([
            getRequest("analytics/insights", getAuthHeader()),
            getRequest("analytics/dashboard", getAuthHeader()),
        ]).then(([insightsRes, dashboardRes]: any[]) => {
            const insightsData = insightsRes?.data || {};
            const dashboardData = dashboardRes?.data || {};

            setMoodDistribution(
                (insightsData.moodDistribution || []).map((item: any) => ({
                    ...item,
                    color: moodColorMap[item.label] || "bg-gray-400"
                }))
            );
            setWeeklyData(insightsData.weeklyData || []);
            setTotalCheckIns(insightsData.totalCheckIns || 0);
            setAvgMoodScore(insightsData.avgMoodScore || 0);
            setStreak(dashboardData.streak || 0);
            setMindfulMinutes(dashboardData.mindfulMinutes || 0);
        }).catch((err: any) => {
            console.error("Failed to fetch analytics data:", err);
        });
    }, []);

    const getMoodColor = (score: number) => {
        if (score >= 4) return "bg-green-500";
        if (score === 3) return "bg-yellow-500";
        return "bg-red-500";
    };

    return (
        <div className="flex h-screen bg-gray-50 w-full">
            {/* Sidebar Navigation - Reused from Dashboard */}
            <SideBar />

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto p-8">
                <header className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">Analytics & Insights</h1>
                    <p className="text-gray-600 mt-1">Deep dive into your mental health patterns over time</p>
                </header>

                {/* Key Performance Indicators */}
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


                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
                    {/* Weekly Mood Analysis */}
                    <Card className="lg:col-span-2 p-6 bg-white shadow-sm border border-gray-200">
                        <div className="flex justify-between items-center mb-6">
                            <div>
                                <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                                    <FiTrendingUp className="text-blue-600" /> Weekly Mood Analysis
                                </h3>
                                <p className="text-sm text-gray-500 ml-7">Your emotional trends over the last 7 days</p>
                            </div>
                        </div>

                        <div className="h-64 flex items-end justify-between gap-3 px-2">
                            {weeklyData.map((data, index) => (
                                <div key={index} className="flex flex-col items-center w-full h-full gap-2 group cursor-default">
                                    <div className="relative w-full flex-1 bg-gray-100 rounded-2xl flex items-end justify-center overflow-hidden">
                                        {/* Grid lines background effect (optional) */}
                                        <div className="absolute inset-0 flex flex-col justify-between p-2 opacity-10 pointer-events-none">
                                            <div className="border-t border-gray-400 w-full"></div>
                                            <div className="border-t border-gray-400 w-full"></div>
                                            <div className="border-t border-gray-400 w-full"></div>
                                            <div className="border-t border-gray-400 w-full"></div>
                                            <div className="border-t border-gray-400 w-full"></div>
                                        </div>

                                        {/* Tooltip */}
                                        <div className="absolute top-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-gray-900/90 backdrop-blur-sm text-white text-xs font-medium rounded-lg py-1.5 px-3 z-10 pointer-events-none shadow-lg transform translate-y-1 group-hover:translate-y-0">
                                            <span className="block text-center">{data.label}</span>
                                            <span className="opacity-80 block text-center text-[10px]">{data.score}/5</span>
                                        </div>

                                        {/* Bar */}
                                        {data.score > 0 && (
                                            <motion.div
                                                initial={{ height: 0 }}
                                                animate={{ height: `${(data.score / 5) * 100}%` }}
                                                transition={{ duration: 0.8, ease: "easeOut", delay: index * 0.1 }}
                                                className={`w-full ${getMoodColor(data.score)} opacity-90 group-hover:opacity-100 transition-all relative min-h-[10px]`}
                                            >
                                                {/* Shine effect */}
                                                <div className="absolute top-0 left-0 right-0 h-[30%] bg-gradient-to-b from-white/20 to-transparent"></div>
                                            </motion.div>
                                        )}
                                    </div>
                                    <span className={`text-xs font-semibold ${data.day === 'Sun' ? 'text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md' : 'text-gray-400'}`}>
                                        {data.day}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </Card>

                    {/* Mood Breakdown */}
                    <Card className="p-6 bg-white shadow-sm border border-gray-200">
                        <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
                            <FiPieChart className="text-purple-500" /> Sentiment Distribution
                        </h3>
                        <div className="space-y-6">
                            {moodDistribution.map((item, index) => (
                                <div key={index}>
                                    <div className="flex justify-between items-end mb-2">
                                        <span className="text-sm font-medium text-gray-700">{item.label}</span>
                                        <span className="text-sm font-bold text-gray-900">{item.percentage}%</span>
                                    </div>
                                    <div className="h-3 w-full bg-gray-100 rounded-full overflow-hidden">
                                        <motion.div
                                            initial={{ width: 0 }}
                                            animate={{ width: `${item.percentage}%` }}
                                            transition={{ duration: 1, delay: 0.5 + (index * 0.1) }}
                                            className={`h-full ${item.color}`}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="mt-8 pt-6 border-t border-gray-100">
                            <p className="text-xs text-gray-500 text-center">
                                Based on your last 100 check-ins. You are generally feeling <span className="text-green-600 font-bold">Good</span> most of the time!
                            </p>
                        </div>
                    </Card>
                </div>

                {/* Virtual Video Call with Psychiatrist */}
                <motion.div
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                >
                    <div
                        className="p-6 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl shadow-lg cursor-pointer hover:shadow-xl transition-all hover:scale-[1.01]"
                        onClick={() => router.push("/rooms/56789")}
                    >
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-5">
                                <div className="w-14 h-14 rounded-full bg-white/20 flex items-center justify-center shrink-0">
                                    <FiVideo size={28} className="text-white" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-white">Virtual Session with Psychiatrist</h3>
                                    <p className="text-indigo-200 text-sm mt-1">
                                        Connect face-to-face with a licensed psychiatrist from the comfort of your home.
                                    </p>
                                </div>
                            </div>
                            <button
                                className="shrink-0 ml-6 px-5 py-2.5 bg-white text-indigo-700 font-semibold rounded-xl hover:bg-indigo-50 transition-colors text-sm"
                                onClick={(e) => { e.stopPropagation(); router.push("/rooms/56789"); }}
                            >
                                Join Now
                            </button>
                        </div>
                    </div>
                </motion.div>


            </main>
        </div>
    );
}

// Sub-component for Analytics Stats

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