// app/page.js
"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/login"); // ⬅️ redirect to login
  }, [router]);

  return null;
}
