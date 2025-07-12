import Sidebar from "../components/sidebar";
import { auth } from "@/auth"
import { redirect } from "next/navigation";
import { SessionProvider } from "next-auth/react";

export default async function DashboardLayout({ children }) {
  const session = await auth()
  if (!session) {
    redirect("/login");
  }

  return (
    <SessionProvider>
      <div className="flex h-screen overflow-hidden">
        <div className="fixed top-0 left-0 w-64 h-screen z-40">
          <Sidebar />
        </div>

        <div className="flex-1 flex flex-col ml-64 w-[calc(100%-16rem)] bg-white">
          <main className="h-screen overflow-y-auto p-6">
            {children}
          </main>
        </div>
      </div>
    </SessionProvider>
  );
}

