"use client";
import React, { useState, useEffect } from "react";
import AddCategoryModal from "@/app/components/addcategory";
import RemoveCategoryModal from "@/app/components/removecategory";
import EditCategoryModal from "@/app/components/editcategory";// Make sure filename matches

const CategoryTable = () => {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [showRemoveModal, setShowRemoveModal] = useState(false);
  const [selectedUnitId, setSelectedUnitId] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedUnit, setSelectedUnit] = useState(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch("https://scale-gold.vercel.app/api/getAllCategories");
        if (!res.ok) throw new Error(`Failed to fetch categories: ${res.status}`);
        const result = await res.json();
        setData(result);
        setFilteredData(result);
      } catch (err) {
        console.error("Failed to fetch categories:", err);
        alert("Failed to load categories. Please try again.");
      }
    };

    fetchCategories();
  }, []);

  useEffect(() => {
    setFilteredData(
      data.filter((item) =>
        item.name?.toLowerCase().includes(search.toLowerCase())
      )
    );
  }, [search, data]);

  const handleDeleteCategory = async () => {
    try {
      const res = await fetch(
        `https://scale-gold.vercel.app/api/deleteCategory/${selectedUnitId}`,
        { method: "DELETE" }
      );

      if (!res.ok) {
        const contentType = res.headers.get("content-type");
        if (contentType?.includes("application/json")) {
          const result = await res.json();
          throw new Error(result.message || "Failed to delete category");
        } else {
          const text = await res.text();
          throw new Error(text || "Unexpected error");
        }
      }

      const updatedList = data.filter((item) => item._id !== selectedUnitId);
      setData(updatedList);
      setFilteredData(updatedList);
      setShowRemoveModal(false);
    } catch (err) {
      console.error("❌ DELETE Error:", err);
      alert(`Failed to delete category: ${err.message}`);
    }
  };

  const handleUpdateCategory = (updatedCategory) => {
    const updatedList = data.map((item) =>
      item._id === updatedCategory._id ? updatedCategory : item
    );
    setData(updatedList);
    setFilteredData(updatedList);
    setShowEditModal(false);
  };

  return (
    <div className="p-1">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-medium text-black">Manage Category</h3>
        <button
          onClick={() => setShowModal(true)}
          className="flex gap-x-2 bg-[#f15525] px-4 py-2 text-[16px] rounded-sm text-white public-sans"
        >
          <img src="/plus.svg" alt="plus" />
          Add Category
        </button>
      </div>

      <div className="p-4 border rounded-md bg-white">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-[16px] font-semibold text-black">Category</h3>

          <div className="relative w-[436px]">
            <input
              type="search"
              placeholder="Search by category"
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
              <th className="py-2 px-6">Category</th>
              <th className="py-2 px-4">Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.map((unit, index) => (
              <tr key={unit._id} className="border-t hover:bg-gray-50">
                <td className="py-2 px-4 text-black text-center">{index + 1}</td>
                <td className="py-2 px-6 text-black text-center">{unit.name}</td>
                <td className="py-2 px-4 text-sm">
                  <div className="flex gap-2 justify-center items-center">
                    <button
                      className="flex gap-x-2 bg-blue-500 text-white px-2 py-1 rounded-sm text-xs hover:bg-blue-600"
                      onClick={() => {
                        setSelectedUnit(unit);
                        setShowEditModal(true);
                      }}
                    >
                      <img src="/edit.svg" alt="edit" className="w-4 h-4" />
                    </button>
                    <button
                      className="flex gap-x-2 bg-red-500 text-white px-2 py-1 rounded-sm text-xs hover:bg-red-600"
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

      {showModal && <AddCategoryModal closeModal={() => setShowModal(false)} />}
      {showRemoveModal && (
        <RemoveCategoryModal
          onClose={() => setShowRemoveModal(false)}
          onConfirm={handleDeleteCategory}
        />
      )}
      {showEditModal && (
        <EditCategoryModal
          unit={selectedUnit}
          closeModal={() => setShowEditModal(false)}
          refreshData={handleUpdateCategory}
        />
      )}
    </div>
  );
};

export default CategoryTable;
