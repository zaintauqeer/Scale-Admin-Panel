"use client";
import React, { useState, useEffect } from "react";
import AddOrderModal from "@/app/components/addorders";

const OrdersTable = () => {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [search, setSearch] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await fetch(
        "https://scale-gold.vercel.app/api/getAllOrders",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.message || `Failed: ${res.status}`);
      }

      const result = await res.json();
      const items = result.orders || [];
      setOrders(items);
      setFilteredOrders(items);
    } catch (err) {
      console.error("Error:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  useEffect(() => {
    setFilteredOrders(
      orders.filter((order) =>
        order.title_en?.toLowerCase().includes(search.toLowerCase())
      )
    );
  }, [search, orders]);

  return (
    <div className="p-1">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-medium text-black">Manage Orders</h3>
        <button
          onClick={() => setShowModal(true)}
          className="flex gap-x-2 bg-[#f15525] px-4 py-2 text-[16px] rounded-sm text-white public-sans  cursor-pointer"
        >
          <img src="/plus.svg" alt="plus" />
          Add Orders
        </button>
      </div>
      <div className="p-4 border rounded-md bg-white">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-[16px] font-semibold text-black">All Orders</h3>
          <div className="relative w-[436px]">
            <input
              type="search"
              placeholder="Search by product name"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="border border-[#DDDDDD] placeholder-gray-400 p-2 rounded-sm w-full text-sm pr-10 text-gray-600"
            />
            <img
              src="/Search icon.svg"
              alt="search icon"
              className="absolute right-3 top-1/2 transform -translate-y-1/2 h-6 w-6 text-gray-500"
            />
          </div>
        </div>

        <table className="w-full border border-gray-200 text-sm">
          <thead className="text-gray-700 bg-gray-50">
            <tr>
              {/* <th className="py-2 px-4">S.No</th> */}
              <th className="py-2 px-4">Customer Name</th>
              <th className="py-2 px-4">Product</th>
              <th className="py-2 px-4">Quantity</th>
              <th className="py-2 px-4">Total Amount</th>
              <th className="py-2 px-4">Contact</th>
              <th className="py-2 px-4">Email</th>
              <th className="py-2 px-4">Order Date</th>
              <th className="py-2 px-4">Order Status</th>
            </tr>
          </thead>
          <tbody>
            {error ? (
              <tr>
                <td colSpan="6" className="text-red-500 text-center p-4">
                  {error}
                </td>
              </tr>
            ) : loading ? (
              <tr>
                <td colSpan="6" className="text-gray-500 text-center p-4">
                  Loading...
                </td>
              </tr>
            ) : filteredOrders.length === 0 ? (
              <tr>
                <td colSpan="6" className="text-gray-500 text-center p-4">
                  No orders found.
                </td>
              </tr>
            ) : (
              filteredOrders.map((order, index) => (
                <tr
                  key={order._id || index}
                  className="border-t hover:bg-gray-50"
                >
                  {/* <td className="py-2 px-4 text-black text-center">{index + 1}</td> */}
                  <td className="py-2 px-4 text-black text-center">
                    {order.username}
                  </td>
                  <td className="py-2 px-4 text-black text-center">
                    {order.title_en}
                  </td>
                  <td className="py-2 px-4 text-black text-center">
                    {order.quantity}
                  </td>
                  <td className="py-2 px-4 text-black text-center">
                    {order.pricePerUnit*order.quantity}
                  </td>
                  <td className="py-2 px-4 text-black text-center">
                    {order.contactNumber}
                  </td>
                  <td className="py-2 px-4 text-black text-center">
                    {order.email}
                  </td>
                  <td className="py-2 px-4 text-black text-center">
                    {new Date(order.orderDate).toLocaleDateString("en-CA")} (
                    {new Date(order.orderDate).toLocaleTimeString("en-US", {
                      hour: "numeric",
                      minute: "2-digit",
                      hour12: true,
                    })}
                    )
                  </td>

                  <td className="py-2 px-4 text-black text-center">
                    {order.orderStatus}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      {/* ✅ Show Modal Component */}
      {showModal && <AddOrderModal closeModal={() => setShowModal(false)} />}
    </div>
  );
};

export default OrdersTable;
