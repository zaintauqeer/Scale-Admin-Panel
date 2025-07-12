"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function ProtectedRoute({ children }) {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const token = typeof window !== "undefined" && localStorage.getItem("authToken");
    if (!token) {
      router.replace("/login");
    } else {
      setIsAuthenticated(true);
    }
    setIsLoading(false);
  }, []);

  // ⛔ Prevent flash
  if (isLoading) return null;

  // ✅ Only show protected content when authenticated
  return isAuthenticated ? <>{children}</> : null;
}
