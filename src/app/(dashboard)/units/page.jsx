"use client";
import React, { useState, useEffect } from "react";
import AddUnitsModal from "@/app/components/addunits";
import RemoveUnitModal from "@/app/components/removeunit";
import EditUnitModal from "@/app/components/editunitmodal";

const UnitTable = () => {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [showRemoveModal, setShowRemoveModal] = useState(false);
  const [selectedUnitId, setSelectedUnitId] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedUnit, setSelectedUnit] = useState(null);

  useEffect(() => {
    const fetchUnits = async () => {
      try {
        const res = await fetch("https://scale-gold.vercel.app/api/getAllUnits");
        if (!res.ok) throw new Error(`Failed to fetch units: ${res.status}`);
        const result = await res.json();
        setData(result);
        setFilteredData(result);
      } catch (err) {
        console.error("Failed to fetch units:", err);
        alert("Failed to load units. Please try again.");
      }
    };

    fetchUnits();
  }, []);

  useEffect(() => {
    setFilteredData(
      data.filter((unit) =>
        unit.name_en?.toLowerCase().includes(search.toLowerCase()) ||
        unit.name_ar?.toLowerCase().includes(search.toLowerCase())
      )
    );
  }, [search, data]);

  const handleDeleteUnit = async () => {
    try {
      const res = await fetch(
        `https://scale-gold.vercel.app/api/deleteUnit/${selectedUnitId}`,
        { method: "DELETE" }
      );

      if (!res.ok) {
        const contentType = res.headers.get("content-type");
        if (contentType && contentType.includes("application/json")) {
          const result = await res.json();
          throw new Error(result.message || "Failed to delete unit");
        } else {
          const text = await res.text();
          throw new Error(text || "Unexpected error from server.");
        }
      }

      const updatedList = data.filter((unit) => unit._id !== selectedUnitId);
      setData(updatedList);
      setFilteredData(updatedList);
      setShowRemoveModal(false);
    } catch (err) {
      console.error("❌ DELETE Error:", err);
      alert(`Failed to delete unit: ${err.message}`);
    }
  };

  const handleUpdateUnit = (updatedUnit) => {
    const updatedList = data.map((unit) =>
      unit._id === updatedUnit._id ? updatedUnit : unit
    );
    setData(updatedList);
    setFilteredData(updatedList);
    setShowEditModal(false);
  };

  return (
    <div className="p-1">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-medium text-black">Manage Units</h3>
        <button
          onClick={() => setShowModal(true)}
          className="flex gap-x-2 bg-[#f15525] px-4 py-2 text-[16px] rounded-sm text-white public-sans"
        >
          <img src="/plus.svg" alt="plus" />
          Add Units
        </button>
      </div>

      <div className="p-4 border rounded-md bg-white">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-[16px] font-semibold text-black">Units</h3>

          <div className="relative w-[436px]">
            <input
              type="search"
              placeholder="Search by unit (English or Arabic)"
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
              <th className="py-2 px-4">S.No</th>
              <th className="py-2 px-4">Unit (English)</th>
              <th className="py-2 px-4">Unit (Arabic)</th>
              <th className="py-2 px-4">Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.map((unit, index) => (
              <tr key={unit._id} className="border-t hover:bg-gray-50">
                <td className="py-2 px-4 text-black text-center">{index + 1}</td>
                <td className="py-2 px-4 text-black text-center">{unit.name_en}</td>
                <td className="py-2 px-4 text-black text-center" dir="rtl">
                  {unit.name_ar}
                </td>
                <td className="py-2 px-4 text-sm text-center">
                  <div className="flex gap-2 justify-center items-center">
                    <button
                      className="bg-blue-500 text-white px-2 py-1 rounded-sm text-xs hover:bg-blue-600"
                      onClick={() => {
                        setSelectedUnit(unit);
                        setShowEditModal(true);
                      }}
                    >
                      <img src="/edit.svg" alt="edit" className="w-4 h-4" />
                    </button>
                    <button
                      className="bg-red-500 text-white px-2 py-1 rounded-sm text-xs hover:bg-red-600"
                      onClick={() => {
                        setSelectedUnitId(unit._id);
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

      {showModal && <AddUnitsModal closeModal={() => setShowModal(false)} />}
      {showRemoveModal && (
        <RemoveUnitModal
          onClose={() => setShowRemoveModal(false)}
          onConfirm={handleDeleteUnit}
        />
      )}
      {showEditModal && (
        <EditUnitModal
          unit={selectedUnit}
          closeModal={() => setShowEditModal(false)}
          refreshData={handleUpdateUnit}
        />
      )}
    </div>
  );
};

export default UnitTable;
