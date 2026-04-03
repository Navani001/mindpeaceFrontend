"use client";
import React, { useState } from "react";
import { Button } from "@heroui/react";
import { FcGoogle } from "react-icons/fc";
import { MdMailOutline, MdVisibility, MdVisibilityOff, MdPerson, MdPhone } from "react-icons/md";
import Link from "next/link";
import { postRequest } from "@/utils/axios/axios";
import { useRouter } from "next/navigation";

export const Signup = () => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [role, setRole] = useState<"student" | "consultant">("student");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);
    const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] = useState(false);
    const [error, setError] = useState("");

    const togglePasswordVisibility = () => {
        setIsPasswordVisible(!isPasswordVisible);
    };

    const toggleConfirmPasswordVisibility = () => {
        setIsConfirmPasswordVisible(!isConfirmPasswordVisible);
    };

    const router = useRouter();

    const handleGoogleSignup = () => {
        const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:5000/api/";
        const googleAuthUrl = process.env.NEXT_PUBLIC_GOOGLE_AUTH_URL || `${baseUrl}auth/google`;
        window.location.href = googleAuthUrl;
    };

    const validateForm = () => {
        if (!name.trim()) {
            setError("Name is required");
            return false;
        }
        if (!email.trim()) {
            setError("Email is required");
            return false;
        }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            setError("Please enter a valid email");
            return false;
        }
        if (!phoneNumber.trim()) {
            setError("Phone number is required");
            return false;
        }
        if (!password) {
            setError("Password is required");
            return false;
        }
        if (password.length < 6) {
            setError("Password must be at least 6 characters");
            return false;
        }
        if (password !== confirmPassword) {
            setError("Passwords do not match");
            return false;
        }
        return true;
    };

    const handleSignup = async () => {
        setError("");
        if (!validateForm()) {
            return;
        }

        setIsLoading(true);
        try {
            const res: any = await postRequest("auth/create", {
                name,
                email,
                password,
                phoneNumber,
                role,
            });
            localStorage.setItem("token", res.data.token);
            localStorage.setItem("role", res.data.user?.role || "student");
            localStorage.setItem("userName", res.data.user?.name || "");
            setIsLoading(false);
            router.push("/login");
        } catch (err: any) {
            setIsLoading(false);
            setError(err.response?.data?.message || "Failed to create account. Please try again.");
        }
    };

    return (
        <div className="min-h-screen w-full flex bg-gray-100">
            {/* Left Side - Image and Quote */}
            <div className="hidden lg:flex w-1/2 relative overflow-hidden items-end p-12">
                {/* Full cover background image */}
                <img
                    src="https://images.unsplash.com/photo-1544027993-37dbfe43562a?w=1200&q=80"
                    alt="Mental health wellness"
                    className="absolute inset-0 w-full h-full object-cover"
                />
                {/* Dark overlay for readability */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent"></div>

                {/* Quote Card */}
                <div className="relative z-10 bg-white/10 backdrop-blur-md rounded-3xl p-8 max-w-sm border border-white/20">
                    <p className="text-white text-lg font-semibold leading-relaxed mb-4">
                        "Taking time to invest in yourself is not selfish. It is essential."
                    </p>
                    <p className="text-white/80 text-sm font-medium">- Unknown</p>
                </div>
            </div>

            {/* Right Side - Signup Form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-white">
                <div className="w-full max-w-md">
                    {/* Header */}
                    <div className="text-center mb-8">
                        <h1 className="text-4xl font-bold text-gray-900 mb-2">
                            Join <span className="text-blue-600">MindCare</span>
                        </h1>
                        <p className="text-gray-600 text-sm">Create an account to start your wellness journey today.</p>
                    </div>

                    {/* Google Sign Up */}
                    <button
                        type="button"
                        onClick={handleGoogleSignup}
                        className="w-full flex items-center justify-center gap-3 bg-gray-100 hover:bg-gray-200 text-gray-900 font-medium py-3 rounded-lg transition-colors mb-6"
                    >
                        <FcGoogle size={20} />
                        Continue with Google
                    </button>

                    {/* Divider */}
                    <div className="flex items-center gap-4 mb-6">
                        <div className="flex-1 h-px bg-gray-300"></div>
                        <span className="text-gray-600 text-sm">or sign up with email</span>
                        <div className="flex-1 h-px bg-gray-300"></div>
                    </div>

                    {/* Error Message */}
                    {error && (
                        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                            {error}
                        </div>
                    )}

                    {/* Role Selection */}
                    <div className="mb-4">
                        {/* <p className="text-sm font-medium text-gray-700 mb-2">Create account as</p> */}
                        <div className="grid grid-cols-2 gap-2">
                            <button
                                type="button"
                                onClick={() => setRole("student")}
                                className={`px-4 py-2 rounded-lg border text-sm font-medium transition-colors ${role === "student"
                                    ? "bg-blue-600 text-white border-blue-600"
                                    : "bg-white text-gray-700 border-gray-300 hover:border-gray-400"
                                    }`}
                            >
                                Student
                            </button>
                            <button
                                type="button"
                                onClick={() => setRole("consultant")}
                                className={`px-4 py-2 rounded-lg border text-sm font-medium transition-colors ${role === "consultant"
                                    ? "bg-blue-600 text-white border-blue-600"
                                    : "bg-white text-gray-700 border-gray-300 hover:border-gray-400"
                                    }`}
                            >
                                Consultant
                            </button>
                        </div>
                    </div>

                    {/* Name Input */}
                    <div className="mb-4">
                        <div className="flex items-center gap-3 px-4 py-3 border border-gray-300 rounded-lg focus-within:border-gray-400 focus-within:ring-1 focus-within:ring-gray-400">
                            <MdPerson className="text-xl text-gray-400" />
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="Full name"
                                className="flex-1 bg-transparent outline-none text-gray-900 placeholder-gray-500"
                            />
                        </div>
                    </div>

                    {/* Email Input */}
                    <div className="mb-4">
                        <div className="flex items-center gap-3 px-4 py-3 border border-gray-300 rounded-lg focus-within:border-gray-400 focus-within:ring-1 focus-within:ring-gray-400">
                            <MdMailOutline className="text-xl text-gray-400" />
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Email id"
                                className="flex-1 bg-transparent outline-none text-gray-900 placeholder-gray-500"
                            />
                        </div>
                    </div>

                    {/* Phone Number Input */}
                    <div className="mb-4">
                        <div className="flex items-center gap-3 px-4 py-3 border border-gray-300 rounded-lg focus-within:border-gray-400 focus-within:ring-1 focus-within:ring-gray-400">
                            <MdPhone className="text-xl text-gray-400" />
                            <input
                                type="tel"
                                value={phoneNumber}
                                onChange={(e) => setPhoneNumber(e.target.value)}
                                placeholder="Phone number (e.g. +911234567890)"
                                className="flex-1 bg-transparent outline-none text-gray-900 placeholder-gray-500"
                            />
                        </div>
                    </div>

                    {/* Password Input */}
                    <div className="mb-4">
                        <div className="flex items-center gap-3 px-4 py-3 border border-gray-300 rounded-lg focus-within:border-gray-400 focus-within:ring-1 focus-within:ring-gray-400">
                            <input
                                type={isPasswordVisible ? "text" : "password"}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Password"
                                className="flex-1 bg-transparent outline-none text-gray-900 placeholder-gray-500"
                            />
                            <button
                                onClick={togglePasswordVisibility}
                                className="text-gray-400 hover:text-gray-600 focus:outline-none"
                            >
                                {isPasswordVisible ? (
                                    <MdVisibilityOff className="text-xl" />
                                ) : (
                                    <MdVisibility className="text-xl" />
                                )}
                            </button>
                        </div>
                    </div>

                    {/* Confirm Password Input */}
                    <div className="mb-6">
                        <div className="flex items-center gap-3 px-4 py-3 border border-gray-300 rounded-lg focus-within:border-gray-400 focus-within:ring-1 focus-within:ring-gray-400">
                            <input
                                type={isConfirmPasswordVisible ? "text" : "password"}
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                placeholder="Confirm password"
                                className="flex-1 bg-transparent outline-none text-gray-900 placeholder-gray-500"
                            />
                            <button
                                onClick={toggleConfirmPasswordVisibility}
                                className="text-gray-400 hover:text-gray-600 focus:outline-none"
                            >
                                {isConfirmPasswordVisible ? (
                                    <MdVisibilityOff className="text-xl" />
                                ) : (
                                    <MdVisibility className="text-xl" />
                                )}
                            </button>
                        </div>
                    </div>

                    {/* Sign Up Button */}
                    <Button
                        onClick={handleSignup}
                        isLoading={isLoading}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-full transition-colors mb-6"
                        size="lg"
                    >
                        {isLoading ? "Creating account..." : "Sign Up"}
                    </Button>

                    {/* Login Link */}
                    <div className="text-center">
                        <p className="text-gray-700 text-sm">
                            Already have an account?{" "}
                            <Link href="/login">
                                <span className="text-blue-600 hover:text-blue-700 font-semibold cursor-pointer">
                                    Log in
                                </span>
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Signup;
