"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { loginAction } from "@/lib/auth"; // Import the server action

export default function Login() {
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); // Clear previous errors

    const formData = new FormData(e.currentTarget);

    // Call the server action
    const result = await loginAction(formData);

    if (result.error) {
      setError(result.error);
    } else {
      // Redirect on successful login
      router.push("/");
    }
  };

  return (
    <div className="relative min-h-screen login-bg flex justify-center items-center">
      {/* logo top-left */}
      <img src="/logo.png" alt="Logo" className="absolute top-8 left-14" />

      {/* login card */}
      <div className="w-full max-w-md bg-white p-8 rounded shadow-md">
        <h3 className="text-2xl font-bold text-center mb-2 text-black">Welcome Back!</h3>
        <p className="text-center text-gray-600 mb-6 text-[17px]">
          Please provide your login information to proceed
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* identifier */}
          <div>
            <label className="block mb-1 text-sm font-medium text-[#8C8C8C]">
              Username
            </label>
            <input
              type="text"
              name="identifier"
              placeholder="Enter here"
              required
              autoFocus
              className="w-full px-3 py-2 border text-black border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-[#F15625] placeholder-gray-300"
            />
          </div>

          {/* password + eye */}
          <div>
            <label className="block mb-1 text-sm font-medium text-[#8C8C8C]">
              Password
            </label>

            <div className="relative">
              <input
                type="password"
                name="password"
                placeholder="Enter here"
                required
                className="w-full px-3 py-2 text-black border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-[#F15625] pr-10 placeholder-gray-300"
              />

              <button
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2 transform text-gray-500"
              >
                <img
                  src={"/eye-slash-regular.svg"}
                  alt="Toggle password visibility"
                  className="w-4 h-4 "
                />
              </button>
            </div>
          </div>

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <button
            type="submit"
            className="w-full py-2 rounded transition duration-200 bg-[#F15625] hover:bg-[#f15525] text-white"
          >
            Login
          </button>

          <div className="text-center">
            <Link
              href="/forgot"
              className="text-[#F15625] hover:underline text-sm"
            >
              Forgot Password?
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}