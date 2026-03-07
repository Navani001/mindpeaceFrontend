"use client";
import React, { useState, useEffect } from "react";
import { SideBar } from "@/component/sidebar";
import { Card } from "@heroui/react";
import { motion, AnimatePresence } from "framer-motion";
import {
    FiUser,
    FiLock,
    FiPhone,
    FiMail,
    FiSave,
    FiPlus,
    FiTrash2,
    FiCheck,
    FiAlertCircle,
    FiShield,
} from "react-icons/fi";
import { getRequest, putRequest, postRequest, deleteRequest } from "@/utils";

type TrustNumber = { id: string; number: string; createdAt: string };
type Profile = { id: number; name: string; email: string; phoneNumber: string | null; createdAt: string };
type Tab = "profile" | "security" | "emergency";

const TAB_LIST: { key: Tab; label: string; icon: React.ReactNode }[] = [
    { key: "profile", label: "Profile", icon: <FiUser size={18} /> },
    { key: "security", label: "Security", icon: <FiLock size={18} /> },
    { key: "emergency", label: "Emergency Contacts", icon: <FiShield size={18} /> },
];

function Toast({ message, type, onClose }: { message: string; type: "success" | "error"; onClose: () => void }) {
    useEffect(() => { const t = setTimeout(onClose, 3500); return () => clearTimeout(t); }, [onClose]);
    return (
        <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={`fixed top-6 right-6 z-50 flex items-center gap-3 px-5 py-3 rounded-xl shadow-lg text-sm font-medium
                ${type === "success" ? "bg-green-50 text-green-700 border border-green-200" : "bg-red-50 text-red-700 border border-red-200"}`}
        >
            {type === "success" ? <FiCheck size={18} /> : <FiAlertCircle size={18} />}
            {message}
        </motion.div>
    );
}

export default function SettingsPage() {
    const [activeTab, setActiveTab] = useState<Tab>("profile");

    // Profile state
    const [profile, setProfile] = useState<Profile | null>(null);
    const [profileForm, setProfileForm] = useState({ name: "", email: "", phoneNumber: "" });
    const [profileLoading, setProfileLoading] = useState(false);

    // Password state
    const [passwordForm, setPasswordForm] = useState({ currentPassword: "", newPassword: "", confirmPassword: "" });
    const [passwordLoading, setPasswordLoading] = useState(false);

    // Trust numbers state
    const [trustNumbers, setTrustNumbers] = useState<TrustNumber[]>([]);
    const [newNumber, setNewNumber] = useState("");
    const [trustLoading, setTrustLoading] = useState(false);

    // Toast
    const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);
    const showToast = (message: string, type: "success" | "error") => setToast({ message, type });

    const getAuthHeader = () => ({
        authorization: "Bearer " + (typeof window !== "undefined" ? localStorage.getItem("token") || "" : ""),
    });

    // Load profile + trust numbers on mount
    useEffect(() => {
        const auth = getAuthHeader();
        getRequest("settings/profile", auth)
            .then((res: any) => {
                const u = res?.data?.user;
                if (u) {
                    setProfile(u);
                    setProfileForm({ name: u.name || "", email: u.email || "", phoneNumber: u.phoneNumber || "" });
                }
            })
            .catch(() => {});

        getRequest("settings/trust-numbers", auth)
            .then((res: any) => setTrustNumbers(res?.data?.numbers || []))
            .catch(() => {});
    }, []);

    // ── Profile save ──────────────────────────────────────────────────────────
    const handleProfileSave = async () => {
        setProfileLoading(true);
        try {
            const res: any = await putRequest("settings/profile", {
                name: profileForm.name,
                email: profileForm.email,
                phoneNumber: profileForm.phoneNumber || null,
            }, getAuthHeader());
            if (res?.data?.user) {
                setProfile(res.data.user);
                showToast("Profile updated successfully!", "success");
            } else {
                showToast(res?.message || "Update failed", "error");
            }
        } catch {
            showToast("Failed to update profile", "error");
        } finally {
            setProfileLoading(false);
        }
    };

    // ── Password change ───────────────────────────────────────────────────────
    const handlePasswordChange = async () => {
        if (passwordForm.newPassword !== passwordForm.confirmPassword) {
            showToast("New passwords do not match", "error");
            return;
        }
        if (passwordForm.newPassword.length < 6) {
            showToast("Password must be at least 6 characters", "error");
            return;
        }
        setPasswordLoading(true);
        try {
            const res: any = await putRequest("settings/password", {
                currentPassword: passwordForm.currentPassword,
                newPassword: passwordForm.newPassword,
            }, getAuthHeader());
            if (res?.success) {
                setPasswordForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
                showToast("Password changed successfully!", "success");
            } else {
                showToast(res?.message || "Password change failed", "error");
            }
        } catch {
            showToast("Failed to change password", "error");
        } finally {
            setPasswordLoading(false);
        }
    };

    // ── Trust numbers ─────────────────────────────────────────────────────────
    const handleAddNumber = async () => {
        const trimmed = newNumber.trim();
        if (!trimmed) return;
        setTrustLoading(true);
        try {
            const res: any = await postRequest("settings/trust-numbers", { number: trimmed }, getAuthHeader());
            if (res?.data?.entry) {
                setTrustNumbers((prev) => [...prev, res.data.entry]);
                setNewNumber("");
                showToast("Contact added!", "success");
            } else {
                showToast(res?.message || "Failed to add", "error");
            }
        } catch {
            showToast("Failed to add contact", "error");
        } finally {
            setTrustLoading(false);
        }
    };

    const handleDeleteNumber = async (id: string) => {
        try {
            await deleteRequest(`settings/trust-numbers/${id}`, {}, getAuthHeader());
            setTrustNumbers((prev) => prev.filter((n) => n.id !== id));
            showToast("Contact removed", "success");
        } catch {
            showToast("Failed to remove contact", "error");
        }
    };

    return (
        <div className="flex h-screen bg-gray-50 font-[var(--font-poppins)]">
            <SideBar />

            <AnimatePresence>
                {toast && (
                    <Toast key="toast" message={toast.message} type={toast.type} onClose={() => setToast(null)} />
                )}
            </AnimatePresence>

            <main className="flex-1 overflow-y-auto p-8">
                <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
                    <h1 className="text-2xl font-bold text-gray-900 mb-1">Settings</h1>
                    <p className="text-sm text-gray-500 mb-7">Manage your account preferences and security</p>

                    {/* Tab bar */}
                    <div className="flex gap-1 mb-7 bg-white border border-gray-200 rounded-xl p-1 w-fit shadow-sm">
                        {TAB_LIST.map((tab) => (
                            <button
                                key={tab.key}
                                onClick={() => setActiveTab(tab.key)}
                                className={`flex items-center gap-2 px-5 py-2 rounded-lg text-sm font-medium transition-all duration-200
                                    ${activeTab === tab.key
                                        ? "bg-gray-900 text-white shadow"
                                        : "text-gray-500 hover:text-gray-800 hover:bg-gray-100"}`}
                            >
                                {tab.icon}
                                {tab.label}
                            </button>
                        ))}
                    </div>

                    {/* ── Profile Tab ─────────────────────────────────────── */}
                    {activeTab === "profile" && (
                        <motion.div key="profile" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.25 }}>
                            <Card className="bg-white border border-gray-200 rounded-2xl shadow-sm p-8 max-w-xl">
                                <h2 className="text-lg font-semibold text-gray-800 mb-6">Profile Information</h2>

                                <div className="space-y-5">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-600 mb-1.5">
                                            <span className="flex items-center gap-2"><FiUser size={14} /> Full Name</span>
                                        </label>
                                        <input
                                            type="text"
                                            value={profileForm.name}
                                            onChange={(e) => setProfileForm((p) => ({ ...p, name: e.target.value }))}
                                            className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 transition"
                                            placeholder="Your full name"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-600 mb-1.5">
                                            <span className="flex items-center gap-2"><FiMail size={14} /> Email Address</span>
                                        </label>
                                        <input
                                            type="email"
                                            value={profileForm.email}
                                            onChange={(e) => setProfileForm((p) => ({ ...p, email: e.target.value }))}
                                            className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 transition"
                                            placeholder="you@example.com"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-600 mb-1.5">
                                            <span className="flex items-center gap-2"><FiPhone size={14} /> Phone Number</span>
                                        </label>
                                        <input
                                            type="tel"
                                            value={profileForm.phoneNumber}
                                            onChange={(e) => setProfileForm((p) => ({ ...p, phoneNumber: e.target.value }))}
                                            className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 transition"
                                            placeholder="+1 234 567 890"
                                        />
                                    </div>

                                    <div className="pt-2">
                                        <button
                                            onClick={handleProfileSave}
                                            disabled={profileLoading}
                                            className="flex items-center gap-2 px-6 py-2.5 bg-gray-900 text-white rounded-lg text-sm font-medium hover:bg-gray-700 disabled:opacity-50 transition"
                                        >
                                            <FiSave size={16} />
                                            {profileLoading ? "Saving..." : "Save Changes"}
                                        </button>
                                    </div>
                                </div>

                                {profile && (
                                    <div className="mt-8 pt-6 border-t border-gray-100">
                                        <p className="text-xs text-gray-400">
                                            Account created {new Date(profile.createdAt ?? "").toLocaleDateString("en-US", { month: "long", year: "numeric" })}
                                        </p>
                                    </div>
                                )}
                            </Card>
                        </motion.div>
                    )}

                    {/* ── Security Tab ────────────────────────────────────── */}
                    {activeTab === "security" && (
                        <motion.div key="security" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.25 }}>
                            <Card className="bg-white border border-gray-200 rounded-2xl shadow-sm p-8 max-w-xl">
                                <h2 className="text-lg font-semibold text-gray-800 mb-6">Change Password</h2>

                                <div className="space-y-5">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-600 mb-1.5">Current Password</label>
                                        <input
                                            type="password"
                                            value={passwordForm.currentPassword}
                                            onChange={(e) => setPasswordForm((p) => ({ ...p, currentPassword: e.target.value }))}
                                            className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 transition"
                                            placeholder="Enter current password"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-600 mb-1.5">New Password</label>
                                        <input
                                            type="password"
                                            value={passwordForm.newPassword}
                                            onChange={(e) => setPasswordForm((p) => ({ ...p, newPassword: e.target.value }))}
                                            className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 transition"
                                            placeholder="Min 6 characters"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-600 mb-1.5">Confirm New Password</label>
                                        <input
                                            type="password"
                                            value={passwordForm.confirmPassword}
                                            onChange={(e) => setPasswordForm((p) => ({ ...p, confirmPassword: e.target.value }))}
                                            className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 transition"
                                            placeholder="Repeat new password"
                                        />
                                    </div>

                                    <div className="pt-2">
                                        <button
                                            onClick={handlePasswordChange}
                                            disabled={passwordLoading}
                                            className="flex items-center gap-2 px-6 py-2.5 bg-gray-900 text-white rounded-lg text-sm font-medium hover:bg-gray-700 disabled:opacity-50 transition"
                                        >
                                            <FiLock size={16} />
                                            {passwordLoading ? "Updating..." : "Update Password"}
                                        </button>
                                    </div>
                                </div>
                            </Card>
                        </motion.div>
                    )}

                    {/* ── Emergency Contacts Tab ──────────────────────────── */}
                    {activeTab === "emergency" && (
                        <motion.div key="emergency" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.25 }}>
                            <Card className="bg-white border border-gray-200 rounded-2xl shadow-sm p-8 max-w-xl">
                                <h2 className="text-lg font-semibold text-gray-800 mb-2">Emergency Contact Numbers</h2>
                                <p className="text-sm text-gray-500 mb-6">These are trusted numbers that can be contacted in a crisis.</p>

                                {/* Add new number */}
                                <div className="flex gap-3 mb-6">
                                    <input
                                        type="tel"
                                        value={newNumber}
                                        onChange={(e) => setNewNumber(e.target.value)}
                                        onKeyDown={(e) => e.key === "Enter" && handleAddNumber()}
                                        className="flex-1 border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 transition"
                                        placeholder="+ 1 800 273 8255"
                                    />
                                    <button
                                        onClick={handleAddNumber}
                                        disabled={trustLoading || !newNumber.trim()}
                                        className="flex items-center gap-2 px-5 py-2.5 bg-gray-900 text-white rounded-lg text-sm font-medium hover:bg-gray-700 disabled:opacity-50 transition"
                                    >
                                        <FiPlus size={16} />
                                        Add
                                    </button>
                                </div>

                                {/* List */}
                                {trustNumbers.length === 0 ? (
                                    <div className="text-center py-10 text-gray-400">
                                        <FiPhone size={32} className="mx-auto mb-3 opacity-40" />
                                        <p className="text-sm">No emergency contacts added yet</p>
                                    </div>
                                ) : (
                                    <ul className="space-y-3">
                                        <AnimatePresence>
                                            {trustNumbers.map((n) => (
                                                <motion.li
                                                    key={n.id}
                                                    initial={{ opacity: 0, y: -6 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    exit={{ opacity: 0, x: -20 }}
                                                    transition={{ duration: 0.2 }}
                                                    className="flex items-center justify-between px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl"
                                                >
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                                                            <FiPhone size={14} className="text-green-600" />
                                                        </div>
                                                        <span className="text-sm font-medium text-gray-800">{n.number}</span>
                                                    </div>
                                                    <button
                                                        onClick={() => handleDeleteNumber(n.id)}
                                                        className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition"
                                                    >
                                                        <FiTrash2 size={16} />
                                                    </button>
                                                </motion.li>
                                            ))}
                                        </AnimatePresence>
                                    </ul>
                                )}
                            </Card>
                        </motion.div>
                    )}
                </motion.div>
            </main>
        </div>
    );
}
