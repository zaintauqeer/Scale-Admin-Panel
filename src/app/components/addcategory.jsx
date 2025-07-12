"use client";
import React, { useEffect, useRef, useState } from "react";
import Swal from "sweetalert2";
import { useSession } from "next-auth/react";

const AddCategoryModal = ({ closeModal }) => {
  const modalRef = useRef();
  const [nameEn, setNameEn] = useState("");
  const [nameAr, setNameAr] = useState("");
  const { data: session, status } = useSession();

  const handleSubmit = async () => {
    try {
      const token = session?.user?.token;
      if (!token) return alert("Please log in first.");

      const payload = {
        name_en: nameEn,
        name_ar: nameAr,
      };

      const res = await fetch("https://scale-gold.vercel.app/api/createCategory", {
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
        title: "Category added successfully!",
        icon: "success",
        confirmButtonColor: "#f15525", // your custom color (orange)
      });
      closeModal();
    } catch (err) {
      alert(err.message);
    }
  };
//------------------Mouse hover useEffect

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        closeModal();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);

  }, [closeModal]);


//-------------------------------JSX STARTS HERE
  return (
    <div className="fixed inset-0 flex justify-center items-center z-50 px-4 bg-black/60">
      <div
        ref={modalRef}
        className="bg-white w-full max-w-[400px] rounded-sm p-4"
      >
        <h2 className="text-xl mb-4 font-medium border-b border-gray-300 pb-2 text-black ">
          Add Category
        </h2>

        <div className="grid gap-4 text-sm text-black">
          <div>
            <label className="text-gray-600">Category Name (English)</label>
            <input
              type="text"
              value={nameEn}
              onChange={(e) => setNameEn(e.target.value)}
              className="border p-2 rounded w-full placeholder:text-gray-300"
              placeholder="Enter category name in English"
            />
          </div>

          <div>
            <label className="text-gray-600">Category Name (Arabic)</label>
            <input
              type="text"
              value={nameAr}
              onChange={(e) => setNameAr(e.target.value)}
              className="border p-2 rounded w-full placeholder:text-gray-300"
              placeholder="Enter category name in Arabic"
              dir="rtl"
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

export default AddCategoryModal;
