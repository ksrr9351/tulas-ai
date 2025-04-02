"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

const Login = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({ identifier: "", password: "" });
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    const data = await res.json();

    if (!res.ok) {
      setError(data.message || "Login failed");
      return;
    }

    localStorage.setItem("token", data.token);
    router.push("/"); // Redirect to Home
  };

  const handleGoogleSignIn = () => {
    // Implement Google Sign In logic here
    console.log("Google Sign In clicked");
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4">
      <div className="w-full max-w-xl bg-white rounded-lg border border-gray-100 p-8">
        <h1 className="text-3xl font-semibold text-center text-black mb-8">Sign In</h1>
        
        {/* Google Sign In Button */}
        <button
          onClick={handleGoogleSignIn}
          className="w-full py-3 bg-white border border-gray-300 rounded-lg mb-4 text-black hover:bg-gray-50 transition"
        >
          Sign In using Google
        </button>
        
        {/* Divider */}
        <div className="flex items-center mb-4">
          <div className="flex-grow h-px bg-gray-200"></div>
          <span className="px-4 text-sm text-gray-500">or sign in with your email</span>
          <div className="flex-grow h-px bg-gray-200"></div>
        </div>
        
        {error && <p className="text-red-500 mb-4">{error}</p>}
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
              Email Address
            </label>
            <input
              type="email"
              id="identifier"
              name="identifier"
              value={formData.identifier}
              onChange={handleChange}
              placeholder="Email Address"
              className="w-full px-4 py-3 rounded-lg border text-gray-700 border-gray-300 focus:outline-none focus:ring-1 focus:ring-green-500"
              required
            />
          </div>
          
          <div>
            <div className="flex justify-between">
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <Link href="/forgot-password" className="text-sm text-blue-500 hover:text-blue-700">
                Forgot Password?
              </Link>
            </div>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Password"
              className="w-full px-4 py-3 rounded-lg border text-gray-700 border-gray-300 focus:outline-none focus:ring-1 focus:ring-green-500"
              required
            />
          </div>
          
          <button
            type="submit"
            className="w-full py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition cursor-pointer"
          >
            Sign In
          </button>
        </form>
        
        <div className="mt-6 text-center">
          <p className="text-gray-600">
            New to App? <Link href="/signup" className="text-blue-500 hover:text-blue-700">Sign Up</Link>
          </p>
        </div>
      </div>
      
      <footer className="mt-16 w-full text-center text-gray-500 text-sm">
        <div className="flex justify-center space-x-4">
          <span>© 2025 tulasai.com</span>
          <Link href="/contact" className="text-blue-500 hover:text-blue-700">Contact Us</Link>
          <Link href="/terms" className="text-blue-500 hover:text-blue-700">Terms & Conditions</Link>
          <Link href="/privacy" className="text-blue-500 hover:text-blue-700">Privacy Policy</Link>
        </div>
      </footer>
    </div>
  );
};

export default Login;