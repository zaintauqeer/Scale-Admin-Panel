"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Reset() {
  const [newPassword, setNewPassword] = useState("");

  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword,    setShowPassword]    = useState(false);
  const [loading,         setLoading]         = useState(false);
  const [error,           setError]           = useState("");
  const [success,         setSuccess]         = useState(false);
  const router = useRouter();

  const togglePasswordVisibility = () => setShowPassword((p) => !p);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess(false);

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    const email = localStorage.getItem("resetEmail"); // 👈 must be set before this page
if (!email) {
  setError("Email not found. Please Enter a valid Email.");
  return;
}

    setLoading(true);
    try {
      const res = await fetch("https://scale-gold.vercel.app/api/users/resetPassword", {
        method: "PUT",
        headers: { "Content-Type": "application/json"   },
        body: JSON.stringify({ newPassword,confirmPassword,email }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Reset failed");
      router.push("/login")

      setSuccess(true);        // show success banner
      setNewPassword("");
      setConfirmPassword("");
      // Optionally redirect to login after a delay
      // setTimeout(() => router.push("/login"), 2000);
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

      {/* reset-password card */}
      <div className="w-full max-w-md bg-white p-8 rounded shadow-md">
        <h3 className="text-2xl font-bold text-center mb-2 text-black">Reset Password</h3>
        <p className="text-center text-gray-600 mb-6 text-[17px]">
          Please set yourself a new password
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* new password */}
          <div>
            <label className="block mb-1 text-sm font-medium text-[#8C8C8C]">
              New Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Enter new password"
                required
                className="w-full px-3 py-2 border text-black border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-[#F15625] pr-10 placeholder-gray-300"
              />
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
              >
                <img
                  src={
                    showPassword
                      ? "/eye-slash-regular.svg"
                      : "/eye-regular.svg"
                  }
                  alt=""
                  className="w-4 h-4"
                />
              </button>
            </div>
          </div>

          {/* confirm password */}
          <div>
            <label className="block mb-1 text-sm font-medium text-[#8C8C8C]">
              Confirm Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Re-enter password"
                required
                className="w-full px-3 py-2 text-black border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-[#F15625] pr-10 placeholder-gray-300"
              />
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
              >
                <img
                  src={
                    showPassword
                      ? "/eye-slash-regular.svg"
                      : "/eye-regular.svg"
                  }
                  alt=""
                  className="w-4 h-4"
                />
              </button>
            </div>
          </div>

          {error   && <p className="text-red-500 text-sm">{error}</p>}
          {success && (
            <p className="text-green-600 text-sm">
              Password updated! You can now log in.
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-2 rounded transition duration-200 ${
              loading
                ? "bg-red-300 cursor-not-allowed"
                : "bg-[#F15625] hover:bg-[#f15525] text-white"
            }`}
          >
            {loading ? "Updating…" : "Verify"}
          </button>
        </form>
      </div>
    </div>
  );
}
