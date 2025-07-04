"use client";
import React, { useRef, useState, useEffect } from "react";
import CreateDealModal from "@/app/components/dealmodal";
import CloseDealModal from "@/app/components/closedeal";
import EditDealComponent from "@/app/components/editdeal";
import ProtectedRoute from "@/app/components/protectedroute";
import Link from "next/link";

const Page = () => {
  const [showModal, setShowModal] = useState(false);
  const [deals, setDeals] = useState([]);
  // const [menuOpenId, setMenuOpenId] = useState(null); // 🔁 One menu open at a time
  const [activeMenuId, setActiveMenuId] = useState(null);
  const [totalMenuId, setTotalMenuId] = useState(null);
  const [searchActive, setSearchActive] = useState("");
  const [searchTotal, setSearchTotal] = useState("");

  const [showCloseModal, setShowCloseModal] = useState(false);
  const [selectedDealId, setSelectedDealId] = useState(null);
  const [selectedDealToEdit, setSelectedDealToEdit] = useState(null);

  const activeMenuRefs = useRef({});
  const totalMenuRefs = useRef({});

  const fetchDeals = async () => {
    try {
      const res = await fetch(
        "https://scale-gold.vercel.app/api/items/Allitems",
        {
          method: "GET",
        }
      );

      const data = await res.json();
      setDeals(Array.isArray(data) ? data : data.deals || []);
      console.log("DEALS:", data);
    } catch (error) {
      console.error("Failed to fetch deals:", error);
    }
  };

  useEffect(() => {
    fetchDeals();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        activeMenuId &&
        activeMenuRefs.current[activeMenuId] &&
        !activeMenuRefs.current[activeMenuId].contains(event.target)
      ) {
        setActiveMenuId(null);
      }

      if (
        totalMenuId &&
        totalMenuRefs.current[totalMenuId] &&
        !totalMenuRefs.current[totalMenuId].contains(event.target)
      ) {
        setTotalMenuId(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [activeMenuId, totalMenuId]);

  const calculateTimeLeft = (endDateStr) => {
    const now = new Date();
    const end = new Date(endDateStr);
    const diff = end - now;
    if (diff <= 0) return "Expired";
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hrs = Math.floor((diff / (1000 * 60 * 60)) % 24);
    return `${days} days: ${hrs} hours`;
  };
  const filteredActiveDeals = deals.filter((deal) =>
    deal.title?.en?.toLowerCase().includes(searchActive.toLowerCase())
  );

  const filteredTotalDeals = deals.filter((deal) =>
    deal.title?.en?.toLowerCase().includes(searchTotal.toLowerCase())
  );

  const handleEdit = (id) => {
    const deal = deals.find((d) => d._id === id);
    setSelectedDealToEdit(deal);
    setActiveMenuId(null);
  };

  const handleClose = (id) => {
    console.log("Close", id);
    setActiveMenuId(null);
  };

  return (
    <ProtectedRoute>
    <div>
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-semibold">Manage Deals</h3>
        <button
          onClick={() => setShowModal(true)}
          className="bg-[#f15525] px-4 py-2 text-[16px] rounded-sm text-white"
        >
          + Create Deals
        </button>
      </div>

      {showModal && <CreateDealModal closeModal={() => setShowModal(false)} />}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 my-6">
        <div className="w-full">
          <img
            src="/card1.png"
            alt="card1"
            className="w-full h-auto rounded-md shadow-sm"
          />
        </div>
        <div className="w-full">
          <img
            src="/card2.png"
            alt="card2"
            className="w-full h-auto rounded-md shadow-sm"
          />
        </div>
        <div className="w-full">
          <img
            src="/card3.png"
            alt="card3"
            className="w-full h-auto rounded-md shadow-sm"
          />
        </div>
      </div>

      <div className="border-1 border-gray-300 p-3 mt-4 rounded-sm">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-[16px] font-semibold">Active Deals</h3>

          <div className="relative w-[436px]">
            <input
              type="search"
              placeholder="Search here"
              value={searchActive}
              onChange={(e) => setSearchActive(e.target.value)}
              className="border border-gray-300 placeholder-gray-400 p-2 rounded-sm w-full text-sm pr-10"
            />

            <img
              src="/Search icon.svg"
              alt="search icon"
              className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500"
            />
          </div>

          <div className="relative">
            <select className="block w-full px-4 py-2 pr-10 text-sm text-gray-700 bg-white  rounded-sm appearance-none border border-gray-300">
              <option value="">This Week</option>
              <option value="last-week">Last Week</option>
              <option value="this-month">This Month</option>
              <option value="all">All Time</option>
            </select>
            {/* Custom dropdown arrow */}
            <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-gray-500">
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </div>
          </div>
        </div>

        <table className="w-full text-left border border-gray-300 relative">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="py-2 px-3 font-semibold text-sm">Products</th>
              <th className="py-2 px-2 font-semibold text-sm">Supplier</th>
              <th className="py-2 px-3 font-semibold text-sm">Buyers Joined</th>
              <th className="py-2 px-3 font-semibold text-sm">Time Left</th>
              <th className="py-2 px-3 font-semibold text-sm">Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredActiveDeals.map((deal) => (
              <tr key={deal._id} className="border-b border-gray-200 relative">
                <td className="py-2 px-3 text-sm flex items-center gap-3">
                  {deal.featureImage && (
                    <div
                      className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden"
                      style={{ boxShadow: "inset 0px 0px 8px rgba(0,0,0,0.4)" }}
                    >
                      <img
                        src={deal.featureImage}
                        alt="feature"
                        className="w-6 h-6 object-contain"
                      />
                    </div>
                  )}
                  <Link
                    href={`/deals/${deal._id}`} // ⬅️ dynamic route
                    className="hover:underline"
                  >
                    {deal.title?.en}
                  </Link>
                </td>

                <td className="py-2 px-3 text-sm">{deal.supplier?.en}</td>
                <td className="py-2 px-3 text-sm">
                  {deal.minorder}/{deal.quantityOrder}
                  <div className="w-60 h-2 rounded-lg bg-gray-300 border border-gray-300 overflow-hidden">
                    <div
                      className="h-2 rounded-lg bg-orange-500"
                      style={{
                        width: `${Math.min(
                          (deal.minorder / deal.quantityOrder) * 100,
                          100
                        )}%`,
                      }}
                    ></div>
                  </div>
                </td>
                <td className="py-2 px-3 text-sm">
                  {calculateTimeLeft(deal.endDate)}
                </td>
                <td className="py-2 px-3 text-sm relative">
                  <div className="flex mx-4">
                    <button
                      className="text-blue-500"
                      onClick={() =>
                        setActiveMenuId(
                          activeMenuId === deal._id ? null : deal._id
                        )
                      }
                    >
                      <img
                        src="/actions.svg"
                        alt="actions"
                        className="h-5 w-5"
                      />
                    </button>
                  </div>

                  {activeMenuId === deal._id && (
                    <div
                      ref={(el) => (activeMenuRefs.current[deal._id] = el)}
                      className="absolute right-16 top-8 bg-white border border-gray-300 rounded-md shadow-md z-10 w-32"
                    >
                      <button
                        className="block w-full px-4 py-2 text-left text-sm text-gray-500 hover:bg-gray-100"
                        onClick={() => handleEdit(deal._id)}
                      >
                        Edit Deal
                      </button>
                      <button
                        className="block w-full px-4 py-2 text-left text-sm text-gray-500 hover:bg-gray-100"
                        onClick={() => {
                          setSelectedDealId(deal._id);
                          setShowCloseModal(true);
                          setTotalMenuId(null);
                        }}
                      >
                        Close Deal
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* second table - Total Deals */}
      <div className="border-1 border-gray-300 p-3 mt-4 rounded-sm">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-[16px] font-semibold">Total Deals</h3>

          <div className="relative w-[436px]">
            <input
              type="search"
              placeholder="Search here"
              value={searchTotal}
              onChange={(e) => setSearchTotal(e.target.value)}
              className="border border-gray-300 placeholder-gray-400 p-2 rounded-sm w-full text-sm pr-10"
            />

            <img
              src="/search icon.svg"
              alt="search icon"
              className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400"
            />
          </div>

          <div className="relative">
            <select className="block w-full px-4 py-2 pr-10 text-sm text-gray-700 bg-white  rounded-sm appearance-none border border-gray-300">
              <option value="">This Week</option>
              <option value="last-week">Last Week</option>
              <option value="this-month">This Month</option>
              <option value="all">All Time</option>
            </select>
            {/* Custom dropdown arrow */}
            <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-gray-500">
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </div>
          </div>
        </div>

        <table className="w-full text-left border border-gray-300">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="py-2 px-3 font-semibold text-sm">Deals</th>
              <th className="py-2 px-3 font-semibold text-sm">Supplier</th>
              <th className="py-2 px-3 font-semibold text-sm">Buyers Joined</th>
              <th className="py-2 px-3 font-semibold text-sm">Status</th>
              <th className="py-2 px-3 font-semibold text-sm">Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredTotalDeals.map((deal) => (
              <tr key={deal._id} className="border-b border-gray-200 relative">
                <td className="py-2 px-3 text-sm flex items-center gap-3">
                  {deal.featureImage && (
                    <div
                      className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden"
                      style={{ boxShadow: "inset 0px 0px 8px rgba(0,0,0,0.4)" }}
                    >
                      <img
                        src={deal.featureImage}
                        alt="feature"
                        className="w-6 h-6 object-contain"
                      />
                    </div>
                  )}
                  <Link
                    href={`/deals/${deal._id}`} // ⬅️ dynamic route
                    className="hover:underline"
                  >
                    {deal.title?.en}
                  </Link>
                </td>{" "}
                <td className="py-2 px-3 text-sm">{deal.supplier?.en}</td>
                <td className="py-2 px-3 text-sm">
                  {deal.minorder}/{deal.quantityOrder}
                  <div className="w-60 h-2 rounded-lg bg-gray-300 border border-gray-300 overflow-hidden">
                    <div
                      className="h-2 rounded-lg bg-orange-500"
                      style={{
                        width: `${Math.min(
                          (deal.minorder / deal.quantityOrder) * 100,
                          100
                        )}%`,
                      }}
                    ></div>
                  </div>
                </td>
                <td className="py-2 px-3 text-sm">
                  {calculateTimeLeft(deal.endDate)}
                </td>
                <td className="py-2 px-3 text-sm relative">
                  <div className="flex mx-4">
                    <button
                      className="text-blue-500"
                      onClick={() =>
                        setTotalMenuId(
                          totalMenuId === deal._id ? null : deal._id
                        )
                      }
                    >
                      <img
                        src="/actions.svg"
                        alt="actions"
                        className="h-5 w-5"
                      />
                    </button>
                  </div>

                  {totalMenuId === deal._id && (
                    <div
                      ref={(el) => (totalMenuRefs.current[deal._id] = el)}
                      className="absolute right-16 top-8 bg-white border border-gray-300 rounded-md shadow-md z-10 w-32"
                    >
                      <button
                        className="block w-full px-4 py-2 text-left text-sm text-gray-500 hover:bg-gray-100"
                        onClick={() => handleEdit(deal._id)}
                      >
                        Edit Deal
                      </button>
                      <button
                        className="block w-full px-4 py-2 text-left text-sm text-gray-500 hover:bg-gray-100"
                        onClick={() => {
                          setSelectedDealId(deal._id);
                          setShowCloseModal(true);
                          setMenuOpenId(null);
                        }}
                      >
                        Close Deal
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {selectedDealToEdit && (
        <EditDealComponent
          deal={selectedDealToEdit}
          onClose={() => setSelectedDealToEdit(null)}
          onUpdate={fetchDeals}
        />
      )}
      {/* Close Deal Modal */}
      {showCloseModal && selectedDealId && (
        <CloseDealModal
          onClose={() => {
            setShowCloseModal(false);
            setSelectedDealId(null);
          }}
          onConfirm={async () => {
            try {
              const token = localStorage.getItem("authToken"); // ✅
              await fetch(
                `https://scale-gold.vercel.app/api/items/Itemdelete/${selectedDealId}`, // ✅
                {
                  method: "DELETE",
                  headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`, // ✅
                  },
                }
              );

              await fetchDeals(); // refresh list
            } catch (err) {
              console.error("Failed to delete deal:", err);
            } finally {
              setShowCloseModal(false);
              setSelectedDealId(null);
            }
          }}
        />
      )}
    </div>
    </ProtectedRoute>
  );
};

export default Page;
