"use client";
import React, { useEffect, useRef, useState } from "react";
import Swal from "sweetalert2";

const AddOrderModal = ({ closeModal }) => {
  const modalRef = useRef();

  const [username, setUsername] = useState("");
  const [usernameAr, setUsernameAr] = useState("");
  const [email, setEmail] = useState("");
  const [location, setLocation] = useState("");
  const [contactNumber, setContactNumber] = useState("");
  const [quantity, setQuantity] = useState(1);

  const [products, setProducts] = useState([]);
  const [selectedProductId, setSelectedProductId] = useState("");
  const [selectedProduct, setSelectedProduct] = useState(null);

  const [price, setPrice] = useState("");
  const [titleEn, setTitleEn] = useState("");
  const [titleAr, setTitleAr] = useState("");

  // Fetch product list
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch(
          "https://scale-gold.vercel.app/api/items/Allitems"
        );
        const data = await res.json();
        console.log("🧪 Products fetched:", data); // confirm here

        setProducts(data.items || data); // works for both array or { items: [...] }
      } catch (err) {
        console.error("Failed to fetch products", err);
      }
    };
    fetchProducts();
  }, []);

  // Set selected product object based on ID
  useEffect(() => {
    const found = products.find((item) => item._id === selectedProductId);
    setSelectedProduct(found || null);
  }, [selectedProductId, products]);

  // Close modal on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        closeModal();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSubmit = async () => {
    if (
      !username ||
      !usernameAr ||
      !email ||
      !location ||
      !contactNumber ||
      !quantity ||
      !selectedProduct
    ) {
      Swal.fire("Error", "Please fill in all fields.", "error");
      return;
    }

    const payload = {
      userId: "64e26d831a5df515f33c4cb9",
      username,
      usernameAr,
      email,
      location,
      contactNumber,
      quantity,
      itemId: selectedProduct._id,
      title_en: selectedProduct.title?.en, // ✅ this is correct now
      title_ar: selectedProduct.title?.ar, // ✅ // <-- FIXED
      pricePerUnit: selectedProduct.pricePerUnit,
    };

    try {
      const res = await fetch("https://scale-gold.vercel.app/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || "Something went wrong");
      }

      Swal.fire("Success", "Order placed successfully!", "success");
      closeModal();
    } catch (err) {
      Swal.fire("Error", err.message, "error");
    }
  };

  return (
    <div className="fixed inset-0 flex justify-center items-center z-50 px-4 bg-black/60">
      <div
        ref={modalRef}
        className="bg-white w-full max-w-[400px] max-h-[90vh] overflow-y-auto rounded-sm"
      >
        <h2 className="text-xl mb-4 font-medium border-b border-gray-300 px-4 py-3 text-black">
          Add Order
        </h2>

        <div className="p-4 grid gap-4 text-sm text-black">
          <div>
            <label className="text-gray-600">Customer Name (EN)</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="border p-2 rounded w-full"
              placeholder="Enter English name"
            />
          </div>

          <div>
            <label className="text-gray-600">Customer Name (AR)</label>
            <input
              type="text"
              dir="rtl"
              value={usernameAr}
              onChange={(e) => setUsernameAr(e.target.value)}
              className="border p-2 rounded w-full"
              placeholder="Enter Arabic name"
            />
          </div>

          <div>
            <label className="text-gray-600">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="border p-2 rounded w-full"
              placeholder="Enter email"
            />
          </div>

          <div>
            <label className="text-gray-600">Location</label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="border p-2 rounded w-full"
              placeholder="Enter address"
            />
          </div>

          <div>
            <label className="text-gray-600">Contact Number</label>
            <input
              type="tel"
              value={contactNumber}
              onChange={(e) => setContactNumber(e.target.value)}
              className="border p-2 rounded w-full"
              placeholder="e.g. +966XXXXXXXXX"
            />
          </div>

          <div>
            <label className="text-gray-600">Product</label>
            <select
              value={selectedProductId}
              onChange={(e) => {
                const selectedId = e.target.value;
                setSelectedProductId(selectedId);

                const selectedProduct = products.find(
                  (p) => p._id === selectedId
                );
                if (selectedProduct) {
                  setPrice(selectedProduct.pricePerUnit);
                  setTitleEn(selectedProduct.titleEn);
                  setTitleAr(selectedProduct.titleAr);
                }
              }}
              className="border p-2 rounded w-full"
            >
              {products.map((product) => (
                <option key={product._id} value={product._id}>
                  {product.title?.en || "Untitled"}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-gray-600">Price</label>
            <input
              type="number"
              value={selectedProduct?.pricePerUnit || ""}
              disabled
              className="border p-2 rounded w-full bg-gray-100"
            />
          </div>

          <div>
            <label className="text-gray-600">Quantity</label>
            <input
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
              className="border p-2 rounded w-full"
              min={1}
            />
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
              Submit Order
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddOrderModal;
