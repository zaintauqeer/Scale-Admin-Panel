import Sidebar from "../components/sidebar";
import { auth } from "@/auth"
import { redirect } from "next/navigation";
import { SessionProvider } from "next-auth/react";

export default async function DashboardLayout({ children }) {
  const session = await auth()
  if (!session) {
    redirect("/login");
  }

  const isSuperAdmin =  session?.user?.role == "superadmin"?true:false 
  console.log(session)
  return (
    <SessionProvider>
      <div className="flex md:flex-row flex-col min-h-screen">
        <Sidebar isSuperAdmin={isSuperAdmin}/>

        <div className="md:w-[calc(100%-16rem)] w-full bg-white">
          <main className="h-[calc(100dvh-3.5rem)] overflow-y-auto p-6">
            {children}
          </main>
        </div>
      </div>
    </SessionProvider>
  );
}

