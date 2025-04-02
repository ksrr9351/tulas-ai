'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Signup = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    surname: '',
    phoneNumber: '',
    email: '',
    password: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!agreeTerms) {
      toast.error("You must agree to the Terms & Conditions");
      return;
    }
    
    try {
      setIsLoading(true);
      
      const res = await fetch('/api/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      
      const data = await res.json();
      
      if (res.ok) {
        toast.success("Signup successful! Redirecting to login...");
        // Delay redirect slightly to allow toast to be seen
        setTimeout(() => {
          router.push('/login');
        }, 2000);
      } else {
        toast.error(data.message || "Signup failed");
      }
    } catch (error) {
      toast.error("An error occurred. Please try again.");
      console.error("Signup error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50 p-4">
      {/* Add ToastContainer at the top level of your component */}
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      
      <div className="w-full max-w-xl bg-white rounded-lg border border-gray-100 p-8">
        <h1 className="text-2xl font-semibold text-center mb-6 text-black">Sign Up</h1>
        
        <button className="flex items-center justify-center w-full py-3 px-4 border border-gray-200 rounded-md bg-gray-50 text-gray-700 mb-6">
          <span>Sign Up using Google</span>
        </button>
        
        <div className="flex items-center justify-center my-6">
          <div className="flex-grow h-px bg-gray-200"></div>
          <p className="mx-4 text-sm text-gray-500">or sign Up with your email</p>
          <div className="flex-grow h-px bg-gray-200"></div>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Name</label>
              <input
                type="text"
                id="name"
                name="name"
                placeholder="Name"
                onChange={handleChange}
                className="w-full p-3 border border-gray-200 rounded-md text-gray-700"
                required
              />
            </div>
            
            <div>
              <label htmlFor="surname" className="block text-sm font-medium text-gray-700 mb-1">Surname</label>
              <input
                type="text"
                id="surname"
                name="surname"
                placeholder="Surname"
                onChange={handleChange}
                className="w-full p-3 border border-gray-200 rounded-md text-gray-700"
                required
              />
            </div>
          </div>
          
          <div className="mb-4">
            <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
            <input
              type="tel"
              id="phoneNumber"
              name="phoneNumber"
              placeholder="Phone Number"
              onChange={handleChange}
              className="w-full p-3 border border-gray-200 rounded-md text-gray-700"
              required
            />
          </div>
          
          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="Email Address"
              onChange={handleChange}
              className="w-full p-3 border border-gray-200 rounded-md text-gray-700"
              required
            />
          </div>
          
          <div className="mb-6 relative">
            <div className="flex justify-between mb-1">
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
              <Link href="/forgot-password" className="text-sm text-blue-500 hover:underline">
                Forgot Password?
              </Link>
            </div>
            <input
              type="password"
              id="password"
              name="password"
              placeholder="Password"
              onChange={handleChange}
              className="w-full p-3 border border-gray-200 rounded-md pr-10 text-gray-700"
              required
            />
            <button 
              type="button" 
              className="absolute right-3 top-9 text-gray-500"
              onClick={() => {
                const passwordInput = document.getElementById('password') as HTMLInputElement;
                passwordInput.type = passwordInput.type === 'password' ? 'text' : 'password';
              }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                <circle cx="12" cy="12" r="3"></circle>
              </svg>
            </button>
          </div>
          
          <div className="flex items-center mb-6">
            <input
              type="checkbox"
              id="agreeTerms"
              checked={agreeTerms}
              onChange={() => setAgreeTerms(!agreeTerms)}
              className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <label htmlFor="agreeTerms" className="ml-2 block text-sm text-gray-700">
              By Signing Up I agree with <Link href="/terms" className="text-blue-500 hover:underline">Terms & Conditions</Link>
            </label>
          </div>
          
          <button
            type="submit"
            disabled={isLoading}
            className={`w-full py-3 bg-green-500 text-white rounded-md cursor-pointer hover:bg-green-600 transition-colors ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
          >
            {isLoading ? 'Signing Up...' : 'Sign Up'}
          </button>
        </form>
        
        <p className="mt-6 text-center text-gray-600 text-sm">
          Already have and Account? <Link href="/login" className="text-blue-500 hover:underline">Sign In</Link>
        </p>
        
        <div className="flex justify-between mt-8 text-xs text-gray-500">
          <p>© 2025 TulasAi.com</p>
          <div className="space-x-4">
            <Link href="/contact" className="text-blue-500 hover:underline">Contact Us</Link>
            <Link href="/terms" className="text-blue-500 hover:underline">Terms & Conditions</Link>
            <Link href="/privacy" className="text-blue-500 hover:underline">Privacy Policy</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;