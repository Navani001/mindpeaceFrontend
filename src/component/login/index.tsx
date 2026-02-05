"use client";
import React, { useState } from "react";
import { Button, Input, Checkbox } from "@heroui/react";
import { FcGoogle } from "react-icons/fc";
import { signIn } from "next-auth/react";
import { MdMailOutline, MdVisibility, MdVisibilityOff } from "react-icons/md";
import Link from "next/link";
import { postRequest } from "@/utils/axios/axios";
import { useRouter } from "next/navigation";

export const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };
  const router = useRouter();
  const handleLogin = async () => {
    setIsLoading(true);
    postRequest("auth/login", { email }).then((res:any)=>{
      localStorage.setItem("token", res.data.token);
      setIsLoading(false);
      router.push("/chatBot");

    })
  };

  return (
    <div className="min-h-screen w-full flex bg-gray-100">
      {/* Left Side - Image and Quote */}
      <div className="hidden lg:flex w-1/2 bg-gradient-to-br from-purple-600 via-pink-500 to-orange-400 relative overflow-hidden items-end p-12">
        {/* Decorative geometric background */}
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-0 left-0 w-96 h-96 bg-blue-400 rounded-full mix-blend-multiply filter blur-xl"></div>
          <div className="absolute top-0 right-0 w-96 h-96 bg-purple-400 rounded-full mix-blend-multiply filter blur-xl"></div>
          <div className="absolute bottom-0 left-1/2 w-96 h-96 bg-pink-400 rounded-full mix-blend-multiply filter blur-xl"></div>
        </div>

        {/* Quote Card */}
        <div className="relative z-10 bg-white bg-opacity-10 backdrop-blur-md rounded-3xl p-8 max-w-sm">
          <p className="text-white text-lg font-semibold leading-relaxed mb-4">
            "Mental health is not a destination, but a process. It's about how you drive, not where you're going."
          </p>
          <p className="text-white text-sm font-medium">- Noam Shpancer</p>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-white">
        <div className="w-full max-w-md">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              Welcome to <span className="text-blue-600">MindCare</span>
            </h1>
            <p className="text-gray-600 text-sm">Your personal mental health companion. Sign in to continue your wellness journey.</p>
          </div>

          {/* Google Sign In */}
          <button
            onClick={() => signIn("google", { redirectTo: "/" })}
            className="w-full flex items-center justify-center gap-3 bg-gray-100 hover:bg-gray-200 text-gray-900 font-medium py-3 rounded-lg transition-colors mb-6"
          >
            <FcGoogle size={20} />
            Continue with Google
          </button>

          {/* Divider */}
          <div className="flex items-center gap-4 mb-6">
            <div className="flex-1 h-px bg-gray-300"></div>
            <span className="text-gray-600 text-sm">or sign in with email</span>
            <div className="flex-1 h-px bg-gray-300"></div>
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

          {/* Remember Me and Forgot Password */}
          <div className="flex items-center justify-between mb-6">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-4 h-4 border border-gray-300 rounded cursor-pointer"
              />
              <span className="text-gray-700 text-sm font-medium">Remember me</span>
            </label>
            <Link href="/forgot-password">
              <span className="text-gray-600 hover:text-gray-900 text-sm font-medium cursor-pointer">
                Forgot password?
              </span>
            </Link>
          </div>

          {/* Login Button */}
          <Button
            onClick={handleLogin}
            isLoading={isLoading}
            className="w-full bg-gray-700 hover:bg-gray-800 text-white font-semibold py-3 rounded-full transition-colors mb-6"
            size="lg"
          >
            {isLoading ? "Signing in..." : "Login"}
          </Button>

          {/* Sign Up Link */}
          <div className="text-center">
            <p className="text-gray-700 text-sm">
              Don't have an account?{" "}
              <Link href="/signup">
                <span className="text-blue-600 hover:text-blue-700 font-semibold cursor-pointer">
                  Sign up
                </span>
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
