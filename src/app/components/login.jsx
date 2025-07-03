"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function Login() {
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  /* ----- login handler (unchanged) ----- */
  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("https://scale-gold.vercel.app/api/users/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ identifier, password }),
      });
      
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Login failed");
      if (data.token) localStorage.setItem("authToken", data.token);
      router.push("/deals");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const togglePasswordVisibility = () => setShowPassword((p) => !p);

  return (
    <div className="relative min-h-screen login-bg flex justify-center items-center">
      {/* logo top-left */}
      <img src="/logo.png" alt="Logo" className="absolute top-8 left-14" />

      {/* login card */}
      <div className="w-full max-w-md bg-white p-8 rounded shadow-md">
        <h3 className="text-2xl font-bold text-center mb-2">Welcome Back!</h3>
        <p className="text-center text-gray-600 mb-6 text-[17px]">
          Please provide your login information to proceed
        </p>

        <form onSubmit={handleLogin} className="space-y-4">
          {/* identifier */}
          <div>
            <label className="block mb-1 text-sm font-medium text-[#8C8C8C]">
              Username
            </label>
            <input
              type="text"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              placeholder="Enter here"
              required
              autoFocus
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-[#F15625] placeholder-gray-300"
            />
          </div>

          {/* password + eye */}
          <div>
            <label className="block mb-1 text-sm font-medium text-[#8C8C8C]">
              Password
            </label>

            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter here"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-[#F15625] pr-10 placeholder-gray-300"
              />

              <button
                type="button"
                onClick={togglePasswordVisibility}
                className="absolute right-3 top-1/2 -translate-y-1/2 transform text-gray-500"
              >
                <img
                  src={
                    showPassword ? "/eye-slash-regular.svg" : "/eye-regular.svg"
                  }
                  alt="Toggle password visibility"
                  className="w-4 h-4 "
                />
              </button>
            </div>
          </div>

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-2 rounded transition duration-200 ${
              loading
                ? "bg-red-300 cursor-not-allowed"
                : "bg-[#F15625] hover:bg-[#f15525] text-white"
            }`}
          >
            {loading ? "Logging in…" : "Login"}
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
