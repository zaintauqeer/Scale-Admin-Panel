

"use client";
import { useState, useEffect } from "react";

export default function EditSupplierModal({ supplier, closeModal, refreshData }) {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    address: "",
    status: "active",
  });

  useEffect(() => {
    if (supplier) {
      setFormData({
        name: supplier.name || "",
        phone: supplier.phone || "",
        email: supplier.email || "",
        address: supplier.address || "",
        status: supplier.status || "active",
      });
    }
  }, [supplier]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    try {
      const res = await fetch(
        `https://scale-gold.vercel.app/api/updateSupplier/${supplier._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            // Authorization: `Bearer ${token}`, // Uncomment and add token if required
          },
          body: JSON.stringify(formData),
        }
      );
  
      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || "Failed to update supplier");
      }
  
      const updatedSupplier = await res.json();
      refreshData(updatedSupplier);
      closeModal();
    } catch (err) {
      console.error("❌ Update error:", err);
      alert(err.message);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-30 flex items-center justify-center">
      <div className="bg-white p-6 rounded-md w-[400px]">
        <h2 className="text-lg font-semibold mb-4 text-black">Edit Supplier</h2>

        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Name"
          className="w-full mb-3 p-2 border rounded text-black"
        />
        <input
          type="text"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          placeholder="Phone"
          className="w-full mb-3 p-2 border rounded text-black"
        />
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="Email"
          className="w-full mb-3 p-2 border rounded text-black"
        />
        <input
          type="text"
          name="address"
          value={formData.address}
          onChange={handleChange}
          placeholder="Address"
          className="w-full mb-3 p-2 border rounded text-black"
        />

        <select
          name="status"
          value={formData.status}
          onChange={handleChange}
          className="w-full mb-4 p-2 border rounded text-black"
        >
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>

        <div className="flex justify-end gap-3">
          <button
            onClick={closeModal}
            className="px-4 py-2 border border-gray-400 rounded-sm text-black"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-[#f15525] text-white rounded"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
