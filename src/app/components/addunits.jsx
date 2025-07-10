"use client";
import React, { useEffect, useRef, useState } from "react";

const AddUnitsModal = ({ closeModal }) => {
  const modalRef = useRef();
  const [name_en, setNameEn] = useState("");
  const [name_ar, setNameAr] = useState("");

  const handleSubmit = async () => {
    try {
      const token = localStorage.getItem("authToken");
      if (!token) return alert("Please log in first.");

      const payload = {
        name_en,
        name_ar,
      };

      const res = await fetch("https://scale-gold.vercel.app/api/createUnit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Something went wrong");

      //--------------Swal

      Swal.fire({
        title: "Unit added successfully!",
        icon: "success",
        confirmButtonColor: "#f15525", // your custom color (orange)
      });
      closeModal();
    } catch (err) {
      alert(err.message);
    }
  };


//------------------mouse hover UseEffect
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        closeModal();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [closeModal]);


  //-----------------------JSX STARTS HERE

  return (
    <div className="fixed inset-0 flex justify-center items-center z-50 px-4 bg-black/60">
      <div
        ref={modalRef}
        className="bg-white w-full max-w-[400px] rounded-sm p-4"
      >
        <h2 className="text-xl mb-4 font-medium border-b border-gray-300 pb-2 text-black">
          Add Unit
        </h2>

        <div className="grid gap-4 text-sm text-black">
          <div>
            <label className="text-gray-600">Unit (English)</label>
            <input
              type="text"
              value={name_en}
              onChange={(e) => setNameEn(e.target.value)}
              className="border p-2 rounded w-full placeholder:text-gray-300"
              placeholder="Enter unit in English"
            />
          </div>
          <div>
            <label className="text-gray-600">Unit (Arabic)</label>
            <input
              type="text"
              dir="rtl"
              value={name_ar}
              onChange={(e) => setNameAr(e.target.value)}
              className="border p-2 rounded w-full placeholder:text-gray-300"
              placeholder="أدخل الوحدة بالعربية"
            />
          </div>
        </div>

        <div className="flex justify-end gap-2 mt-6">
          <button
            onClick={closeModal}
            className="px-4 py-2 border border-gray-300 rounded-sm hover:bg-gray-50 text-black"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-[#f15525] text-white rounded-sm hover:bg-[#d94e20]"
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddUnitsModal;
