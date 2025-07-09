"use client";
import React, { useState, useEffect } from "react";

const OrdersTable = () => {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [search, setSearch] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchItems = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("authToken");
      if (!token) {
        throw new Error("Authentication token not found. Please login.");
      }

      const res = await fetch("https://scale-gold.vercel.app/api/items/Sold", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({}),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.message || `Failed: ${res.status}`);
      }

      const result = await res.json();
      console.log("Fetched Sold Items:", result);

      // Extracting the result array
      const items = result.result || [];
      setData(items);
      setFilteredData(items);
    } catch (err) {
      console.error("Error:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  useEffect(() => {
    setFilteredData(
      data.filter((item) =>
        item.itemId.toLowerCase().includes(search.toLowerCase())
      )
    );
  }, [search, data]);

  return (
    <div className="p-1">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-medium text-black">Manage Orders</h3>
      
      </div>
      <div className="p-4 border rounded-md bg-white">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-[16px] font-semibold text-black">Sold Items</h3>
          <div className="relative w-[436px]">
            <input
              type="search"
              placeholder="Search by item ID"
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

        {loading ? (
          <div className="text-gray-500 text-center p-4">Loading...</div>
        ) : error ? (
          <div className="text-red-500 text-center p-4">{error}</div>
        ) : filteredData.length === 0 ? (
          <div className="text-gray-500 text-center p-4">No items found.</div>
        ) : (
          <table className="w-full border border-gray-200 text-sm">
            <thead className="text-gray-700 bg-gray-50">
              <tr>
                <th className="py-2 px-4">S.No</th>
                <th className="py-2 px-6">Item ID</th>
                <th className="py-2 px-4">Sold</th>
                <th className="py-2 px-4">Remaining</th>
                <th className="py-2 px-4">Total</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.map((item, index) => (
                <tr key={item.itemId} className="border-t hover:bg-gray-50">
                  <td className="py-2 px-4 text-black text-center">{index + 1}</td>
                  <td className="py-2 px-6 text-black text-center">{item.itemId}</td>
                  <td className="py-2 px-4 text-black text-center">{item.sold}</td>
                  <td className="py-2 px-4 text-black text-center">{item.remaining}</td>
                  <td className="py-2 px-4 text-black text-center">{item.totalQuantity}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default OrdersTable;
