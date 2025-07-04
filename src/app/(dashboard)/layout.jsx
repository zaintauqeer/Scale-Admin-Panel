// // app/dashboard/layout.jsx

// import Sidebar from "../components/sidebar";

// export default function DashboardLayout({ children }) {
//   return (
//     <div className="flex min-h-screen">
//       {/* Sidebar = 20% */}
//       <div className="w-64">
//         <Sidebar />
//       </div>

//       {/* Main content = remaining width */}
//       <main className="flex-1 bg-gray-100 p-6">{children}</main>
//     </div>
//   );
// }




// app/dashboard/layout.jsx

"use client";

import Sidebar from "../components/sidebar";

export default function DashboardLayout({ children }) {
  return (
    <div className="flex h-screen overflow-hidden">
      {/* Fixed Sidebar */}
      <div className="fixed top-0 left-0 w-64 h-screen z-40">
        <Sidebar />
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col ml-64 w-[calc(100%-16rem)]">
        {/* Optional Fixed Top Navbar (uncomment if you have one) */}
        {/* <div className="fixed top-0 left-64 right-0 h-16 bg-white z-30 shadow-md">
          <Navbar />
        </div> */}

        {/* Scrollable Content (with optional navbar margin) */}
        <main className="h-screen overflow-y-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
}

