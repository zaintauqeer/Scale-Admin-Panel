"use client";
import React, { useState, useEffect } from "react";
import AddSupplierModal from "@/app/components/addsupplier";
import RemoveSupplierModal from "@/app/components/removesupplier";
import EditSupplierModal from "@/app/components/edirsupplier";

const TableComponent = () => {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [showRemoveModal, setShowRemoveModal] = useState(false);
  const [selectedSupplierId, setSelectedSupplierId] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedSupplier, setSelectedSupplier] = useState(null);

  useEffect(() => {
    const fetchSuppliers = async () => {
      try {
        const res = await fetch("https://scale-gold.vercel.app/api/getAllSuppliers");
        if (!res.ok) {
          throw new Error(`Failed to fetch suppliers: ${res.status}`);
        }
        const result = await res.json();
        setData(result);
        setFilteredData(result);
      } catch (err) {
        console.error("Failed to fetch suppliers:", err);
        alert("Failed to load suppliers. Please try again.");
      }
    };

    fetchSuppliers();
  }, []);

  useEffect(() => {
    setFilteredData(
      data.filter((user) =>
        user.name?.toLowerCase().includes(search.toLowerCase())
      )
    );
  }, [search, data]);

  const handleDeleteSupplier = async () => {
    try {
      console.log("Deleting supplier with ID:", selectedSupplierId);

      const res = await fetch(
        `https://scale-gold.vercel.app/api/deleteSupplier/${selectedSupplierId}`,
        {
          method: "DELETE",
        }
      );

      if (!res.ok) {
        const contentType = res.headers.get("content-type");
        if (contentType && contentType.includes("application/json")) {
          const result = await res.json();
          throw new Error(result.message || "Failed to delete supplier");
        } else {
          const text = await res.text();
          console.error("API response:", text);
          throw new Error("Unexpected response from server.");
        }
      }

      // Update UI after delete
      const updatedList = data.filter((supplier) => supplier._id !== selectedSupplierId);
      setData(updatedList);
      setFilteredData(updatedList);
      setShowRemoveModal(false);
    } catch (err) {
      console.error("❌ DELETE Error:", err);
      alert(`Failed to delete supplier: ${err.message}`);
    }
  };

  const handleUpdateSupplier = (updatedSupplier) => {
    const updatedList = data.map((supplier) =>
      supplier._id === updatedSupplier._id ? updatedSupplier : supplier
    );
    setData(updatedList);
    setFilteredData(updatedList);
    setShowEditModal(false);
  };

  return (
    <div className="p-1">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-medium text-black">Manage Suppliers</h3>
        <button
          onClick={() => setShowModal(true)}
          className="flex gap-x-2 bg-[#f15525] px-4 py-2 text-[16px] rounded-sm text-white public-sans"
        >
          <img src="/plus.svg" alt="plus" />
          Add Suppliers
        </button>
      </div>

      <div className="p-4 border rounded-md bg-white">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-[16px] font-semibold text-black">Suppliers</h3>

          <div className="relative w-[436px]">
            <input
              type="search"
              placeholder="Search by name"
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
              <th className="py-2 px-4">Name</th>
              <th className="py-2 px-4">Area</th>
              <th className="py-2 px-4">Contact</th>
              <th className="py-2 px-4">Email</th>
              <th className="py-2 px-4">Status</th>
              <th className="py-2 px-4">Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.map((supplier) => (
              <tr key={supplier._id} className="border-t hover:bg-gray-50">
                <td className="py-2 px-4 text-black text-center">{supplier.name}</td>
                <td className="py-2 px-4 text-black text-center">{supplier.address || "—"}</td>
                <td className="py-2 px-4 text-black text-center">{supplier.phone}</td>
                <td className="py-2 px-4 text-black text-center">{supplier.email}</td>
                <td className="py-2 px-4 text-black text-center">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                      supplier.status === "active"
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {supplier.status}
                  </span>
                </td>
                <td className="py-2 px-4 text-sm text-center">
                  <div className="flex gap-2 justify-center">
                    <button
                      className="bg-blue-500 text-white px-2 py-1 rounded-sm text-xs hover:bg-blue-600"
                      onClick={() => {
                        setSelectedSupplier(supplier);
                        setShowEditModal(true);
                      }}
                    >
                      <img src="/edit.svg" alt="edit" className="w-4 h-4" />
                    </button>
                    <button
                      className="bg-red-500 text-white px-2 py-1 rounded-sm text-xs hover:bg-red-600"
                      onClick={() => {
                        setSelectedSupplierId(supplier._id);
                        setShowRemoveModal(true);
                      }}
                    >
                      
                      <img src="/delete.svg" alt="delete" className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <AddSupplierModal closeModal={() => setShowModal(false)} />
      )}

      {showRemoveModal && (
        <RemoveSupplierModal
          onClose={() => setShowRemoveModal(false)}
          onConfirm={handleDeleteSupplier}
        />
      )}

      {showEditModal && (
        <EditSupplierModal
          supplier={selectedSupplier}
          closeModal={() => setShowEditModal(false)}
          refreshData={handleUpdateSupplier}
        />
      )}
    </div>
  );
};

export default TableComponent;