"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";

export default function Sidebar({ isSuperAdmin }) {
  const [isOpen, setIsOpen] = useState(false);
  const toggleSidebar = () => setIsOpen(!isOpen);
  console.log(isSuperAdmin)
  const menuItems = [
    { label: "Dashboard", icon: "/dashboard.svg", href: "/" },
    { label: "Admins", icon: "/manage-buyers.svg", href: "/admins" },
    { label: "Manage Deals", icon: "/manage-deals.svg", href: "/deals" },
    { label: "Manage Orders", icon: "/manage-buyers.svg", href: "/orders" },
    { label: "Manage Suppliers", icon: "/manage-suppliers.svg", href: "/supplier", },
    { label: "Manage Categories", icon: "/manage-suppliers.svg", href: "/category", },
    { label: "Manage Units", icon: "/shipping-tracker.svg", href: "/units" },
    { label: "Shipping Tracker", icon: "/shipping-tracker.svg", href: "#" },
    { label: "Settings", icon: "/settings.svg", href: "/setting" },
  ];

  return (
    <>
      {/* 🔹 Mobile Top Bar */}
      <div className="md:hidden p-4 flex justify-between items-center bg-[#F15625] text-white">
        <img src="/image 104.svg" alt="Logo" className="w-24" />
        <button onClick={toggleSidebar}>
          {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* 🔹 Sidebar Container */}
      <aside
        className={`
          bg-[#F15625] w-64 min-h-[calc(100dvh-3.5rem)] flex-col  z-40
          transition-transform duration-300 ease-in-out
          fixed md:static top-14
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
          md:translate-x-0 md:flex
        `}
      >
        {/* Logo (desktop only) */}
        <div className="hidden md:flex items-center ml-7 mb-10 mt-8 ">
          <img src="/image 104.svg" alt="Logo" className="w-32" />
        </div>

        {/* Menu */}
        <ul className="space-y-1 ">
          {menuItems
            .filter(({ label }) => isSuperAdmin || label !== "Admins")
            .map(({ label, icon, href }) => (
              <Link key={label} href={href}>
                <li
                  className="flex items-center gap-4 pl-6 pr-4 py-3 text-white text-sm
                   hover:bg-[#F77C50] hover:border-r-4 hover:border-white
                   transition duration-150 ease-in-out cursor-pointer"
                >
                  <img src={icon} alt={label} className="w-5 h-5 shrink-0" />
                  <span>{label}</span>
                </li>
              </Link>
            ))}
        </ul>
      </aside>

      {/* 🔹 Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed left-0 w-full min-h-[calc(100dvh-3.5rem)] top-14 z-30 bg-black opacity-30 md:hidden"
          onClick={toggleSidebar}
        />
      )}
    </>
  );
}
