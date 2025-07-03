"use client";
import React from "react";

const CloseDealModal = ({ onClose, onConfirm }) => {
  return (
    <div
  className="fixed inset-0 z-50 flex justify-center items-center"
  style={{ backgroundColor: "rgba(0, 0, 0, 0.8)" }}
>

      <div className="bg-white   rounded-md p-6 text-center shadow-lg">
        <div className="flex justify-center mb-4">
          <img src="/cross-mark.svg" alt="close" className="w-12 h-12" />
        </div>
        <h2 className="text-2xl font-bold mb-2">Close Deal</h2>
        <p className="mb-6 text-xl text-gray-700">Are you sure you want to close this deal?</p>

        <div className="flex justify-center gap-4">
          <button
            onClick={onClose}
            className="px-24 py-2 border text-[16px] border-gray-300 rounded-sm text-gray-700"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-24 py-2 bg-[#f15525] text-white rounded-sm text-[16px]"
          >
            Yes, Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default CloseDealModal;
