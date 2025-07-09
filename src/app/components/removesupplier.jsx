// "use client";
// import { useEffect, useRef } from "react";

// const removeSupplierModal = ({ onClose, onConfirm }) => {
//   const modalRef = useRef();

//   // Close modal on outside click
//   useEffect(() => {
//     const handleClickOutside = (event) => {
//       if (modalRef.current && !modalRef.current.contains(event.target)) {
//         onClose(); // ✅ call the correct prop function
//       }
//     };
//     document.addEventListener("mousedown", handleClickOutside);
//     return () => {
//       document.removeEventListener("mousedown", handleClickOutside);
//     };
//   }, []);

//   return (
//     <div
//       className="fixed inset-0 z-50 flex justify-center items-center"
//       style={{ backgroundColor: "rgba(0, 0, 0, 0.8)" }}
//     >
//       <div
//         className="bg-white   rounded-md p-6 text-center shadow-lg"
//         ref={modalRef}
//       >
//         <div className="flex justify-center mb-4">
//           <img src="/Cross-mark.svg" alt="close" className="w-12 h-12" />
//         </div>
//         <h2 className="text-2xl font-bold mb-2 text-black">Remove Supplier</h2>
//         <p className="mb-6 text-xl text-[#444444] font-medium">
//           Are you sure to remove thsi supplier?
//         </p>

//         <div className="flex justify-center gap-4">
//           <button
//             onClick={onClose}
//             className="px-24 py-2 border text-[16px] border-gray-300 rounded-sm text-black"
//           >
//             Cancel
//           </button>
//           <button
//             onClick={onConfirm}
//             className="px-24 py-2 bg-[#f15525] text-white rounded-sm text-[16px]"
//           >
//             Yes, Close
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default removeSupplierModal;



// removesupplier.jsx
"use client";
import { useEffect, useRef } from "react";

const RemoveSupplierModal = ({ onClose, onConfirm }) => {
  const modalRef = useRef();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        onClose();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div
      className="fixed inset-0 z-50 flex justify-center items-center"
      style={{ backgroundColor: "rgba(0, 0, 0, 0.8)" }}
    >
      <div
        className="bg-white rounded-md p-6 text-center shadow-lg"
        ref={modalRef}
      >
        <div className="flex justify-center mb-4">
          <img src="/Cross-mark.svg" alt="close" className="w-12 h-12" />
        </div>
        <h2 className="text-2xl font-bold mb-2 text-black">Remove Supplier</h2>
        <p className="mb-6 text-xl text-[#444444] font-medium">
          Are you sure to remove this supplier?
        </p>

        <div className="flex justify-center gap-4">
          <button
            onClick={onClose}
            className="px-24 py-2 border text-[16px] border-gray-300 rounded-sm text-black"
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

export default RemoveSupplierModal;

