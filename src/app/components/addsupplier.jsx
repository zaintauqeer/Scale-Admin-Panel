"use client";
import React, { useEffect, useRef, useState } from "react";
import Swal from "sweetalert2";
import { useSession } from "next-auth/react";


const AddSupplierModal = ({ closeModal }) => {
  const modalRef = useRef();
  const dropdownRef = useRef();

  const [nameEn, setNameEn] = useState("");
  const [nameAr, setNameAr] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [status, setStatus] = useState("active");
  const { data: session } = useSession();

  const areaOptions = [
    "North Dammam",
    "North Riyadh",
    "North Jeddah",
    "Al Riyadh Avenue",
  ];
  const [selectedAreas, setSelectedAreas] = useState([]);
  const [areaDropdownOpen, setAreaDropdownOpen] = useState(false);

  const toggleArea = (area) => {
    setSelectedAreas((prev) =>
      prev.includes(area) ? prev.filter((a) => a !== area) : [...prev, area]
    );
  };

  const handleSubmit = async () => {
    try {
      const token = session?.user?.token;
      if (!token) return alert("Please log in first.");

      const payload = {
        name_en: nameEn,
        name_ar: nameAr,
        phone,
        email,
        address,
        status,
        serviceArea: selectedAreas.join(", "),
      };

      const res = await fetch("https://scale-gold.vercel.app/api/createSupplier", {
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
        title: "Supplier added successfully!",
        icon: "success",
        confirmButtonColor: "#f15525", // your custom color (orange)
      });
      
      closeModal();
    } catch (err) {
      alert(err.message);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target) &&
        !dropdownRef.current?.contains(event.target)
      ) {
        closeModal();
      }
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target)
      ) {
        setAreaDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);


//-------------------------------------------------JSX STARTS HERE


  return (
    <div className="fixed inset-0 flex justify-center items-center z-50 px-4 bg-black/60">
      <div
        ref={modalRef}
        className="bg-white w-full max-w-[400px] max-h-[90vh] overflow-y-auto rounded-sm"
      >
        <h2 className="text-xl mb-4 font-medium border-b border-gray-300 px-4 py-3 text-black">
          Add Supplier
        </h2>

        <div className="p-4 grid gap-4 text-sm text-black">
          <div>
            <label className="text-gray-600">Name (English)</label>
            <input
              type="text"
              value={nameEn}
              onChange={(e) => setNameEn(e.target.value)}
              className="border p-2 rounded w-full placeholder:text-gray-300"
              placeholder="Enter English name"
            />
          </div>

          <div>
            <label className="text-gray-600">Name (Arabic)</label>
            <input
              type="text"
              value={nameAr}
              onChange={(e) => setNameAr(e.target.value)}
              className="border p-2 rounded w-full placeholder:text-gray-300"
              placeholder="Enter Arabic name"
              dir="rtl"
            />
          </div>

          <div>
            <label className="text-gray-600">Phone</label>
            <input
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="border p-2 rounded w-full placeholder:text-gray-300"
              placeholder="Enter phone"
            />
          </div>

          <div>
            <label className="text-gray-600">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="border p-2 rounded w-full placeholder:text-gray-300"
              placeholder="Enter email"
            />
          </div>

          <div>
            <label className="text-gray-600">Address</label>
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="border p-2 rounded w-full placeholder:text-gray-300"
              placeholder="Enter address"
            />
          </div>

          <div className="relative" ref={dropdownRef}>
            <label className="text-gray-600">Service Area</label>
            <button
              type="button"
              onClick={() => setAreaDropdownOpen(!areaDropdownOpen)}
              className="border p-2 rounded w-full text-left bg-white"
            >
              {selectedAreas.length > 0
                ? selectedAreas.join(", ")
                : "Select Service Areas"}
            </button>

            {areaDropdownOpen && (
              <div className="absolute mt-1 w-full border bg-white rounded shadow max-h-40 overflow-y-auto z-10">
                {areaOptions.map((area) => (
                  <label
                    key={area}
                    className="flex items-center px-3 py-2 hover:bg-gray-50 cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={selectedAreas.includes(area)}
                      onChange={() => toggleArea(area)}
                      className="mr-2"
                    />
                    {area}
                  </label>
                ))}
              </div>
            )}
          </div>

          <div className="flex justify-end gap-2 mt-4">
            <button
              onClick={closeModal}
              className="px-4 py-2 border border-gray-300 rounded-sm hover:bg-gray-50"
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
    </div>
  );
};

export default AddSupplierModal;
