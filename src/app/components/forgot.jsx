"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Forgot() {
  const [email, setEmail] = useState(""); // ✅ fixed: added missing email state
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch(
        "https://scale-gold.vercel.app/api/users/forgotPassword",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
        }
      );

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Something went wrong");

      localStorage.setItem("resetEmail", email); // ✅ store email before redirect
      router.push("/reset-password");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen login-bg flex justify-center items-center">
      {/* logo top-left */}
      <img src="/logo.png" alt="Logo" className="absolute top-8 left-14" />

      {/* forgot password card */}
      <div className="w-full max-w-md bg-white p-8 rounded shadow-md">
        <h3 className="text-2xl font-bold text-center mb-2 text-black">
          Forgot Your Password?
        </h3>
        <p className="text-center text-gray-600 mb-6 text-[17px]">
          Please enter your email address for verification
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block mb-1 text-sm font-medium text-[#8C8C8C]">
              Email address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)} // ✅ fixed setter
              placeholder="Enter here"
              required
              className="w-full px-3 py-2 border text-black border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-[#F15625] placeholder-gray-300"
            />
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
            {loading ? "Verifying…" : "Verify"}
          </button>
        </form>
      </div>
    </div>
  );
}
