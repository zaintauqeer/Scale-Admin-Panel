"use client";
import React, { useState } from "react";
import CloseDealModal from "./closedeal";
import EditDealComponent from "./editdeal";

const DetailDealBox = ({
  _id,
  image,
  images = [],
  title,
  price,
  pricePerUnit,
  timeLeft,
  progress,
  location,
  supplierName,
  minOrder,
  deliveryTimeframe,
  termsAndNotes,
  delivery,
}) => {
  // Validate image
  const safeImage = image || "/placeholder-image.jpg"; // Fallback image
  const gallery = [
    safeImage,
    ...images.filter((src) => src && src !== safeImage),
  ];

  // Main image state
  const [mainImage, setMainImage] = useState(safeImage);

  const [showEditModal, setShowEditModal] = useState(false);
  const [showCloseModal, setShowCloseModal] = useState(false);

  return (
    <div className="lg:px-1 px-5 py-6">
      <div className="flex mb-6">
        <h2 className="text-xl font-medium text-black">Deal Details</h2>
      </div>
      {/* -- Two-column layout: Images + Info -- */}
      <div className="flex flex-col lg:flex-row gap-x-10">
        {/* -- Images section -- */}
        <div className="flex flex-col gap-5 w-full lg:w-6/12" dir="ltr">
          {/* Large preview */}
          <div className="bg-[#CCCCCC] rounded-sm overflow-hidden aspect-square flex items-center justify-center">
            <img
              src={mainImage}
              alt={title || "Deal image"}
              className="object-contain max-h-3/4"
              onError={(e) => {
                e.target.src = "/placeholder-image.jpg";
              }}
            />
          </div>

          {/* Thumbnails */}
          <div className="flex gap-2 overflow-x-auto pb-2">
            {gallery.map((src, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setMainImage(src)}
                className={`flex-shrink-0 w-20 h-20 rounded-sm overflow-hidden aspect-square border-2 ${
                  mainImage === src ? "border-[#F05526]" : "border-transparent"
                } bg-[#F2F2F2] flex items-center justify-center`}
              >
                <img
                  src={src}
                  alt="Preview"
                  className="h-3/4 object-cover"
                  onError={(e) => {
                    e.target.src = "/placeholder-image.jpg";
                  }}
                />
              </button>
            ))}
          </div>
        </div>

        {/* -- Information section -- */}
        <div className="gap-5 lg:w-6/12">
          {/* Title & price */}
          <div className="flex justify-between items-center pb-5 border-b border-[#DDDDDD]">
            <h2 className="text-2xl lg:text-[32px] font-bold text-black">
              {title || "Untitled Deal"}
            </h2>
            <span className="flex items-center gap-2 text-xl font-semibold text-[#F05526] whitespace-nowrap">
              <img src="/Clock.svg" alt="clock" className="w-5 h-5" />
              {timeLeft || "N/A"}
            </span>
          </div>

          {/* Key facts */}
          <div className="mt-12 flex flex-col gap-5 text-[20px] font-medium text-[#666666]">
            <InfoRow label="Supplier" value={supplierName || "N/A"} />
            <InfoRow label="Delivery Area" value={location || "N/A"} />
            <InfoRow label="Minimum Order Quantity" value={minOrder || "N/A"} />
            <InfoRow
              label="Committed Value"
              value={minOrder ? `${minOrder}` : "N/A"}
              highlight
            />
            <InfoRow label="Price per Unit" value={pricePerUnit || "N/A"} />
            <InfoRow
              label="Est. Delivery Window"
              value={deliveryTimeframe || "N/A"}
            />
          </div>

          {/* Progress bar */}
          <div className="flex items-center gap-4 mt-6">
            <div className="w-full h-[14px] bg-gray-200 rounded-full">
              <div
                className="h-full bg-[#F05526] rounded-full"
                style={{
                  width: `${Math.min(Math.max(progress || 0, 0), 100)}%`,
                }}
              />
            </div>
            <span className="text-lg font-semibold text-[#444444]">
              {progress || 0}%
            </span>
          </div>
        </div>
      </div>

      {/* -- Terms & Actions section below all content -- */}
      <div className="mt-10">
        <div className="flex flex-col text-xl font-medium text-[#666666]">
          <label htmlFor="" className="text-black text-2xl">
            Notes
          </label>
          <span className="text-xl">
            {termsAndNotes || "No notes available"}
          </span>
        </div>

        <div className="flex gap-4 mt-12 justify-center items-center">
          <button
            onClick={() => setShowCloseModal(true)}
            className="w-70 border-2 border-gray-200 px-6 py-3 text-[16px] rounded font-semibold text-black"
          >
            Close Deal
          </button>
          <button
            onClick={() => setShowEditModal(true)}
            className="w-70 bg-[#F05526] text-white px-6 py-3 text-[16px] rounded font-semibold"
          >
            Edit Deal
          </button>
        </div>
      </div>


      {/*---------------------------------- Edit Deal Modal------------------------------------- */}


      {showEditModal && (
        <EditDealComponent
          deal={{
            _id,
            image: safeImage,
            images: gallery.filter((_, i) => i > 0), // Exclude feature image from images array
            title: { en: title },
            marketPrice: price, // Added to align with EditDealComponent
            pricePerUnit,
            location: { en: location },
            supplier: { en: supplierName },
            minorder: minOrder,
            quantityOrder: minOrder, // Assuming same as minOrder for now
            minRequiredBuyers: "1", // Default value; adjust as needed
            deliveryWindow: deliveryTimeframe,
            startDate: "", // Replace with actual data if available
            endDate: "", // Replace with actual data if available
            description: { en: termsAndNotes }, // Using termsAndNotes as description
            termsAndNotes: { en: termsAndNotes },
            paymentInstructions: { en: "", ar: "" }, // Add defaults
            whatsappMessages: { en: "", ar: "" }, // Add defaults
            prefilledMessages: { en: "", ar: "" }, // Add defaults
          }}
          onClose={() => setShowEditModal(false)}
          onUpdate={() => {
            setShowEditModal(false);
            // Optionally refresh data from parent
          }}
        />
      )}


 {/*---------------------------------- Close Deal Modal------------------------------------- */}


 
      {showCloseModal && (
        <CloseDealModal
          onClose={() => setShowCloseModal(false)}
          onConfirm={async () => {
            try {
              const token = localStorage.getItem("authToken");
              if (!token) throw new Error("Authentication token missing");
              const res = await fetch(
                `https://scale-gold.vercel.app/api/items/Itemdelete/${_id}`,
                {
                  method: "DELETE",
                  headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                  },
                }
              );
              if (!res.ok) throw new Error("Failed to delete deal");
              console.log("Deal deleted successfully");
            } catch (err) {
              console.error("Failed to delete deal:", err);
              alert(err.message);
            } finally {
              setShowCloseModal(false);
            }
          }}
        />
      )}
    </div>
  );
};

/* ---------- Small reusable row ----------------------------------------- */
const InfoRow = ({ label, value, highlight }) => (
  <div className="flex justify-between gap-x-3">
    <span className="text-[#666666]">{label}:</span>
    <span className={highlight ? "text-[#F05526]" : "text-[#222222]"}>
      {value || "N/A"}
    </span>
  </div>
);

export default DetailDealBox;
