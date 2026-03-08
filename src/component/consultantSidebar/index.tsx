"use client";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import {
    FiHome,
    FiCalendar,
    FiClock,
    FiSettings,
    FiUser,
    FiLogOut,
} from "react-icons/fi";

const NAV_ITEMS = [
    { label: "Dashboard", href: "/consultant/dashboard", icon: <FiHome size={20} /> },
    { label: "Schedule", href: "/consultant/schedule", icon: <FiCalendar size={20} /> },
    { label: "Upcoming", href: "/consultant/upcoming", icon: <FiClock size={20} /> },
];

export const ConsultantSideBar = () => {
    const [selectedMenu, setSelectedMenu] = useState("");
    const [userName, setUserName] = useState("Consultant");
    const router = useRouter();

    useEffect(() => {
        if (typeof window !== "undefined") {
            setSelectedMenu(window.location.pathname);
            setUserName(localStorage.getItem("userName") || "Consultant");
        }
    }, []);

    const navigate = (href: string) => {
        setSelectedMenu(href);
        router.push(href);
    };

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("role");
        localStorage.removeItem("userName");
        router.push("/login");
    };

    return (
        <aside className="w-56 border-r border-gray-300 bg-gray-100 flex flex-col">
            {/* Logo */}
            <div className="p-6 border-b border-gray-300">
                <h1 className="text-xl font-bold text-gray-800">MindChat</h1>
                <p className="text-xs text-gray-600">Consultant Portal</p>
            </div>

            {/* Navigation */}
            <nav className="flex-1 overflow-y-auto p-4 space-y-2">
                {NAV_ITEMS.map((item) => {
                    const isActive = selectedMenu === item.href;
                    return (
                        <div
                            key={item.href}
                            onClick={() => navigate(item.href)}
                        >
                            <a
                                href="#"
                                className={`flex items-center gap-3 px-4 py-2 text-gray-700 rounded-lg transition ${
                                    isActive ? "bg-gray-200 hover:bg-gray-200" : "hover:bg-gray-200"
                                }`}
                            >
                                {item.icon}
                                <span className="text-sm font-medium">{item.label}</span>
                            </a>
                        </div>
                    );
                })}
            </nav>

            {/* Bottom Section */}
            <div className="p-4 border-t border-gray-300 space-y-2">
                <button
                    onClick={() => navigate("/settings")}
                    className={`flex items-center gap-3 w-full px-4 py-2 text-gray-700 rounded-lg transition ${
                        selectedMenu === "/settings" ? "bg-gray-200" : "hover:bg-gray-200"
                    }`}
                >
                    <FiSettings size={20} />
                    <span className="text-sm font-medium">Settings</span>
                </button>
                <button
                    onClick={handleLogout}
                    className="flex items-center gap-3 w-full px-4 py-2 text-gray-700 rounded-lg hover:bg-gray-200 transition"
                >
                    <FiLogOut size={20} />
                    <span className="text-sm font-medium">Log Out</span>
                </button>
                <div className="flex items-center gap-3 px-4 py-3 bg-gray-200 rounded-lg">
                    <div className="w-8 h-8 bg-gray-400 rounded-full flex items-center justify-center">
                        <FiUser size={16} className="text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-800 truncate">{userName}</p>
                        <p className="text-xs text-gray-600">Consultant</p>
                    </div>
                </div>
            </div>
        </aside>
    );
};
