"use client"
import { a } from "framer-motion/dist/types.d-D0HXPxHm";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { FiBarChart2, FiBook, FiHome, FiSettings, FiUser } from "react-icons/fi"

declare global {
    interface Window {
        [key: string]: any;
    }
}
export const SideBar = () => {
    const [selectedMenu, setSelectedMenu] = useState("");
    const router = useRouter();

    useEffect(() => {
        if (typeof window !== "undefined") {
            setSelectedMenu(window.location.pathname);
        }
    }, []);
    return <aside className="w-56 border-r border-gray-300 bg-gray-100 flex flex-col">
        {/* Logo */}
        <div className="p-6 border-b border-gray-300">
            <h1 className="text-xl font-bold text-gray-800">MindChat</h1>
            <p className="text-xs text-gray-600">AI Health Support</p>
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 overflow-y-auto p-4 space-y-2">
            <div onClick={() => {
                setSelectedMenu("/dashboard")
                console.log("Dashboard clicked")
                router.push("/dashboard")
            }}  >
                <a href="#" className={`flex items-center gap-3 px-4 py-2 text-gray-700 rounded-lg transition ${selectedMenu === "/dashboard" ? "bg-gray-200 hover:bg-gray-200" : "hover:bg-gray-200"}`}>
                    <FiHome size={20} />
                    <span className="text-sm font-medium">Dashboard</span>
                </a>
            </div>
            <div onClick={() => {
                setSelectedMenu("/analytics")
                console.log("Analytics clicked")
                router.push("/analytics")
            }}  >
                <a href="#" className={`flex items-center gap-3 px-4 py-2 text-gray-700 rounded-lg transition ${selectedMenu === "/analytics" ? "bg-gray-200 hover:bg-gray-200" : "hover:bg-gray-200"}`}>
                    <FiBarChart2 size={20} />
                    <span className="text-sm font-medium">Analytics</span>
                </a>
            </div>
            <div onClick={() => {
                setSelectedMenu("/chatBot")
                router.push("/chatBot")
            }}  >
                <a href="#" className={`flex items-center gap-3 px-4 py-2 text-gray-700 rounded-lg transition ${selectedMenu === "/chatBot" ? "bg-gray-200 hover:bg-gray-200" : "hover:bg-gray-200"}`}>
                    <FiBook size={20} />
                    <span className="text-sm font-medium">chatBot</span>
                </a>
            </div>
        </nav>

        {/* Bottom Section */}
        <div className="p-4 border-t border-gray-300 space-y-2">
            <button
                onClick={() => { setSelectedMenu("/settings"); router.push("/settings"); }}
                className={`flex items-center gap-3 w-full px-4 py-2 text-gray-700 rounded-lg transition ${selectedMenu === "/settings" ? "bg-gray-200" : "hover:bg-gray-200"}`}
            >
                <FiSettings size={20} />
                <span className="text-sm font-medium">Settings</span>
            </button>
            <div className="flex items-center gap-3 px-4 py-3 bg-gray-200 rounded-lg">
                <div className="w-8 h-8 bg-gray-400 rounded-full flex items-center justify-center">
                    <FiUser size={16} className="text-white" />
                </div>
                <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-800">John Doe</p>
                    <p className="text-xs text-gray-600">Pro workspace</p>
                </div>
            </div>
        </div>
    </aside>
}