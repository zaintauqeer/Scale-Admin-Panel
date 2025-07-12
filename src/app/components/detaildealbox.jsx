"use client";
import React, { useState } from "react";
import CloseDealModal from "./closedeal";
import EditDealComponent from "./editdeal";
import { useSession } from "next-auth/react";


const DetailDealBox = ({ deal }) => {
  const {
    _id,
    featureImage,
    images = [],
    title,
    pricePerUnit,
    marketPrice,
    location,
    supplier,
    minorder,
    quantityOrder,
    termsAndNotes,
    description,
    notes,
    startDate,
    endDate,
    deliveryWindow,
    unitId,
    categoryId,
    status,
    paymentInstructions,
    whatsappMessages,
    prefilledMessages,
  } = deal;
  const { data: session } = useSession();

  const safeImage = featureImage || "/placeholder-image.jpg";
  const gallery = [safeImage, ...images.filter((src) => src && src !== safeImage)];

  const [mainImage, setMainImage] = useState(safeImage);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showCloseModal, setShowCloseModal] = useState(false);

  const progress = Math.min((minorder / quantityOrder) * 100, 100).toFixed(0);
  const timeLeft = getTimeLeft(endDate);

  return (
    <div className="lg:px-1 px-5 py-6">
      <div className="flex mb-6">
        <h2 className="text-xl font-medium text-black">Deal Details</h2>
      </div>

      <div className="flex flex-col lg:flex-row gap-x-10">
        {/* Images */}
        <div className="flex flex-col gap-5 w-full lg:w-6/12" dir="ltr">
          <div className="bg-[#CCCCCC] rounded-sm overflow-hidden aspect-square flex items-center justify-center">
            <img
              src={mainImage}
              alt={title?.en || "Deal image"}
              className="object-contain max-h-3/4"
              onError={(e) => (e.target.src = "/placeholder-image.jpg")}
            />
          </div>

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
                  onError={(e) => (e.target.src = "/placeholder-image.jpg")}
                />
              </button>
            ))}
          </div>
        </div>

        {/* Info */}
        <div className="gap-5 lg:w-6/12">
          <div className="flex justify-between items-center pb-5 border-b border-[#DDDDDD]">
            <h2 className="text-2xl lg:text-[32px] font-bold text-black">{title?.en || "Untitled Deal"}</h2>
            <span className="flex items-center gap-2 text-xl font-semibold text-[#F05526] whitespace-nowrap">
              <img src="/Clock.svg" alt="clock" className="w-5 h-5" />
              {timeLeft}
            </span>
          </div>

          <div className="mt-12 flex flex-col gap-5 text-[20px] font-medium text-[#666666]">
            <InfoRow label="Supplier" value={supplier?.en} />
            <InfoRow label="Delivery Area" value={location?.en} />
            <InfoRow label="Minimum Order Quantity" value={minorder} />
            <InfoRow label="Committed Value" value={minorder} highlight />
            <InfoRow label="Price per Unit" value={`${pricePerUnit} SAR`} />
            <InfoRow label="Est. Delivery Window" value={deliveryWindow || `${formatDate(startDate)} — ${formatDate(endDate)}`} />
          </div>

          <div className="flex items-center gap-4 mt-6">
            <div className="w-full h-[14px] bg-gray-200 rounded-full">
              <div className="h-full bg-[#F05526] rounded-full" style={{ width: `${progress}%` }} />
            </div>
            <span className="text-lg font-semibold text-[#444444]">{progress}%</span>
          </div>
        </div>
      </div>

      {/* Notes */}
      <div className="mt-10">
        <div className="flex flex-col text-xl font-medium text-[#666666]">
          <label className="text-black text-2xl">Notes</label>
          <span className="text-xl">{termsAndNotes?.en || "No notes available"}</span>
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

      {/* Edit Modal */}
      {showEditModal && (
        <EditDealComponent
          deal={deal}
          onClose={() => setShowEditModal(false)}
          onUpdate={() => setShowEditModal(false)}
        />
      )}

      {/* Close Modal */}
      {showCloseModal && (
        <CloseDealModal
          onClose={() => setShowCloseModal(false)}
          onConfirm={async () => {
            try {
              const token = session?.user?.token;
              if (!token) throw new Error("Authentication token missing");

              const res = await fetch(`https://scale-gold.vercel.app/api/items/Itemdelete/${_id}`, {
                method: "DELETE",
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${token}`,
                },
              });

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

/* Helpers */
const InfoRow = ({ label, value, highlight }) => (
  <div className="flex justify-between gap-x-3">
    <span className="text-[#666666]">{label}:</span>
    <span className={highlight ? "text-[#F05526]" : "text-[#222222]"}>{value || "N/A"}</span>
  </div>
);

const formatDate = (dateStr) => {
  return new Date(dateStr).toLocaleDateString("en-GB", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

const getTimeLeft = (endStr) => {
  const diff = new Date(endStr) - new Date();
  if (diff <= 0) return "Completed";
  const d = Math.floor(diff / (1000 * 60 * 60 * 24));
  const h = Math.floor((diff / (1000 * 60 * 60)) % 24);
  return `${d} days:${h} hours`;
};

export default DetailDealBox;
