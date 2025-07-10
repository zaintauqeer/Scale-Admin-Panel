"use client";
import { useState, useEffect } from "react";

export default function EditUnitModal({ unit, closeModal, refreshData }) {
  const [formData, setFormData] = useState({
    name_en: "",
    name_ar: "",
  });

  useEffect(() => {
    if (unit) {
      setFormData({
        name_en: unit.name_en || "",
        name_ar: unit.name_ar || "",
      });
    }
  }, [unit]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    try {
      const res = await fetch(
        `https://scale-gold.vercel.app/api/updateUnit/${unit._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || "Failed to update unit");
      }

      const updatedUnit = await res.json();
      refreshData(updatedUnit);
      closeModal();
    } catch (err) {
      console.error("❌ Update error:", err);
      alert(err.message);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-30 flex items-center justify-center">
      <div className="bg-white p-6 rounded-md w-[400px]">
        <h2 className="text-lg font-semibold mb-4 text-black">Edit Unit</h2>

        <input
          type="text"
          name="name_en"
          value={formData.name_en}
          onChange={handleChange}
          placeholder="Enter unit in English"
          className="w-full mb-3 p-2 border rounded text-black placeholder:text-gray-400"
        />
        <input
          type="text"
          name="name_ar"
          value={formData.name_ar}
          onChange={handleChange}
          placeholder="أدخل الوحدة بالعربية"
          dir="rtl"
          className="w-full mb-4 p-2 border rounded text-black placeholder:text-gray-400"
        />

        <div className="flex justify-end gap-3">
          <button
            onClick={closeModal}
            className="px-4 py-2 rounded text-black border border-gray-300"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-[#f15525] text-white rounded"
          >
            Update
          </button>
        </div>
      </div>
    </div>
  );
}
