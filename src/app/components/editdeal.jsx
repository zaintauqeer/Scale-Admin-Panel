// // components/EditDealComponent.jsx
// "use client";
// import React, { useRef, useState, useEffect } from "react";

// const EditDealComponent = ({ deal, onClose, onUpdate }) => {
//   /* ---------- refs ---------- */
//   const fileFeatureRef = useRef();
//   const fileImagesRef = useRef();

//   /* ---------- state ---------- */
//   const [imagePreview, setImagePreview] = useState(null); // preview for feature image
//   const [featureImage, setFeatureImage] = useState(null); // File | URL | null
//   const [images, setImages] = useState([]); // array of File | URL (strings)

//   const [title, setTitle] = useState("");
//   const [marketPrice, setMarketPrice] = useState("");
//   const [pricePerUnit, setPricePerUnit] = useState("");
//   const [minOrderQty, setMinOrderQty] = useState("");
//   const [quantityOrder, setQuantityOrder] = useState("");
//   const [minBuyers, setMinBuyers] = useState("");

//   const [supplierEn, setSupplierEn] = useState("");
//   const [supplierAr, setSupplierAr] = useState("");
//   const [paymentEn, setPaymentEn] = useState("");
//   const [paymentAr, setPaymentAr] = useState("");
//   const [deliveryWindow, setDeliveryWindow] = useState("");
//   const [deliveryArea, setDeliveryArea] = useState("");
//   const [startDate, setStartDate] = useState("");
//   const [endDate, setEndDate] = useState("");

//   const [descriptionEn, setDescriptionEn] = useState("");
//   const [descriptionAr, setDescriptionAr] = useState("");
//   const [terms, setTerms] = useState("");
//   const [notes, setNotes] = useState("");
//   const [whatsappEn, setWhatsappEn] = useState("");
//   const [whatsappAr, setWhatsappAr] = useState("");
//   const [prefillEn, setPrefillEn] = useState("");
//   const [prefillAr, setPrefillAr] = useState("");

//   const modalRef = useRef();
//   /* ---------- populate initial data ---------- */
//   useEffect(() => {
//     if (!deal || Object.keys(deal).length === 0) return;

//     console.log("✅ Deal loaded:", deal);
  
//     setImagePreview(deal.featureImage || null);
//     setFeatureImage(deal.featureImage || null);
//     setImages(Array.isArray(deal.images) ? deal.images : []);
  
//     setTitle(deal.title?.en || "");
//     setMarketPrice(deal.marketPrice || "");
//     setPricePerUnit(deal.pricePerUnit || "");
//     setMinOrderQty(deal.minorder || "");
//     setQuantityOrder(deal.quantityOrder || "");
//     setMinBuyers(deal.minRequiredBuyers || "");
  
//     setSupplierEn(deal.supplier?.en || "");
//     setSupplierAr(deal.supplier?.ar || "");
  
//     setDescriptionEn(deal.description?.en || "");
//     setDescriptionAr(deal.description?.ar || "");
  
//     // ✅ Fix these mappings
//     setTerms(deal.termsAndNotes?.en || "");
//     setNotes(deal.termsAndNotes?.ar || "");
//     setPaymentEn(deal.paymentInstructions?.en || "");
//     setPaymentAr(deal.paymentInstructions?.ar || "");
//     setWhatsappEn(deal.whatsappMessages?.en || "");
//     setWhatsappAr(deal.whatsappMessages?.ar || "");
//     setPrefillEn(deal.prefilledMessages?.en || "");
//     setPrefillAr(deal.prefilledMessages?.ar || "");
  
//     setDeliveryWindow(deal.deliveryWindow || "");
//     setDeliveryArea(deal.location?.en || "");
//     setStartDate(deal.startDate?.slice(0, 10) || "");
//     setEndDate(deal.endDate?.slice(0, 10) || "");
//   }, [deal]);
  
//   /* ---------- handlers ---------- */
//   const triggerFeatureInput = () => fileFeatureRef.current?.click();
//   const triggerImagesInput = () => fileImagesRef.current?.click();

//   const handleFeatureChange = (e) => {
//     const file = e.target.files[0];
//     if (!file) return;
//     setFeatureImage(file);
//     setImagePreview(URL.createObjectURL(file));
//   };

//   const handleRemoveFeature = () => {
//     setFeatureImage(null);
//     setImagePreview(null);
//     if (fileFeatureRef.current) fileFeatureRef.current.value = null;
//   };

//   const handleImagesChange = (e) => {
//     const newFiles = Array.from(e.target.files || []);
//     setImages((prev) => [...prev, ...newFiles]);
//     if (fileImagesRef.current) fileImagesRef.current.value = null; // reset input
//   };

//   const removeImage = (idx) => {
//     setImages((prev) => prev.filter((_, i) => i !== idx));
//   };

//   /* ---------- submit ---------- */
//   const handleSubmit = async () => {
//     try {
//       const token = localStorage.getItem("authToken");
//       if (!token) return alert("Please log in first.");
  
//       const formData = new FormData();
  
//       // Text fields
//       formData.append("titleEn", title);
//       formData.append("titleAr", title);
//       formData.append("locationEn", deliveryArea || "Riyadh, Saudi Arabia");
//       formData.append("locationAr", "الرياض، السعودية");
//       formData.append("minorder", String(minOrderQty));
//       formData.append("minRequiredBuyers", String(minBuyers));
//       formData.append("quantityOrder", String(quantityOrder));
//       formData.append("pricePerUnit", pricePerUnit);
//       formData.append("supplierEn", supplierEn);
//       formData.append("supplierAr", supplierAr);
//       formData.append("descriptionEn", descriptionEn);
//       formData.append("descriptionAr", descriptionAr);
  
//       // ✅ Use correct API keys
//       formData.append("termsAndNotesEn", terms);
//       formData.append("termsAndNotesAr", notes);
//       formData.append("paymentInstructionsEn", paymentEn);
//       formData.append("paymentInstructionsAr", paymentAr);
//       formData.append("prefilledMessagesEn", prefillEn);
//       formData.append("prefilledMessagesAr", prefillAr);
//       formData.append("whatsappMessagesEn", whatsappEn);
//       formData.append("whatsappMessagesAr", whatsappAr);
  
//       formData.append("deliveryWindow", deliveryWindow);
//       formData.append("startDate", startDate);
//       formData.append("endDate", endDate);
  
//       // Feature image: only if a new one is selected
//       if (featureImage instanceof File) {
//         formData.append("featureImage", featureImage);
//       }
  
//       // If feature image was removed
//       if (!featureImage) {
//         formData.append("removeFeatureImage", "true");
//       }
  
//       // Append newly selected images
//       images.forEach((img) => {
//         if (img instanceof File) formData.append("images", img);
//       });
  
//       // Keep existing image URLs
//       const keptImageUrls = images.filter((img) => typeof img === "string");
//       formData.append("existingImages", JSON.stringify(keptImageUrls));
  
//       const res = await fetch(
//         `https://scale-gold.vercel.app/api/items/Updateitems/${deal._id}`,
//         {
//           method: "PUT",
//           headers: { Authorization: `Bearer ${token}` },
//           body: formData,
//         }
//       );
  
//       const data = await res.json().catch(() => ({}));
//       if (!res.ok) throw new Error(data.message || `Error ${res.status}`);
//       console.log("data here", data);
  
//       alert("Deal updated successfully!");
//       if (onUpdate) onUpdate();
//       onClose();
//     } catch (err) {
//       alert(err.message);
//     }
//   };
  

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

//   /* ---------- JSX ---------- */
//   return (
//     <div
//       className="fixed inset-0 flex justify-center items-center z-50 px-4"
//       style={{ backgroundColor: "rgba(0,0,0,0.8)" }}
//     >
//       <div
//         className="bg-white w-full max-w-[610px] max-h-[90vh] overflow-y-auto rounded-sm"
//         ref={modalRef}
//       >
//         <h2 className="text-xl mb-4 font-medium border-b border-gray-300 px-4 py-3 text-black">
//           Edit Deal
//         </h2>

//         <div className="bg-white m-4 p-4 border border-gray-300 rounded-sm relative">
//           {/* ---------- Feature Image ---------- */}
//           <div className="flex items-center gap-4 mb-2 justify-center">
//             {/* preview */}
//             {imagePreview && (
//               <div className="relative w-28 h-28 border-2 border-gray-300 rounded flex items-center justify-center overflow-hidden">
//                 <div
//                   className="relative w-24 h-24 bg-gray-1s00 rounded flex items-center justify-center overflow-hidden"
//                   style={{ boxShadow: "inset 0px 0px 8px rgba(0,0,0,0.4)" }}
//                 >
//                   <img
//                     src={imagePreview}
//                     alt="preview"
//                     className="object-contain w-20 h-20"
//                   />
//                   <button
//                     type="button"
//                     onClick={handleRemoveFeature}
//                     className="absolute -top-1 -right-1 bg-red-600 text-white rounded-full w-5 h-5 text-xs flex items-center justify-center"
//                   >
//                     ×
//                   </button>
//                 </div>
//               </div>
//             )}
//             {/* upload */}
//             <div
//               onClick={triggerFeatureInput}
//               className="w-28 h-28 border-2 border-dashed border-gray-300 rounded flex items-center justify-center cursor-pointer text-[#8c8c8c]"
//             >
//               <div className="text-center select-none">
//                 <div className="text-xl font-semibold">+</div>
//                 <div className="text-sm">Upload</div>
//               </div>
//               <input
//                 type="file"
//                 accept="image/*"
//                 ref={fileFeatureRef}
//                 onChange={handleFeatureChange}
//                 className="hidden"
//               />
//             </div>
//           </div>

//           {/* ---------- Extra Images Grid ---------- */}
//           <div className="mb-4">
//             <div className="flex flex-wrap gap-2 justify-center">
//               {images.map((img, idx) => (
//                 <div
//                   key={idx}
//                   className="relative w-10 h-10 border border-gray-300 rounded overflow-hidden"
//                   style={{ boxShadow: "inset 0px 0px 8px rgba(0,0,0,0.4)" }}
//                 >
//                   <img
//                     src={
//                       typeof img === "string" ? img : URL.createObjectURL(img)
//                     }
//                     alt={`img-${idx}`}
//                     className="object-contain flex items-center justify-center w-8 h-8"
//                   />
//                   <button
//                     type="button"
//                     onClick={() => removeImage(idx)}
//                     className="absolute -top-0 -right-0 bg-red-600 text-white rounded-full w-3 h-3 text-xs flex items-center justify-center"
//                   >
//                     ×
//                   </button>
//                 </div>
//               ))}
//               {/* add more */}
//               <div
//                 onClick={triggerImagesInput}
//                 className="w-10 h-10 border-2 border-dashed border-gray-300 rounded flex items-center justify-center cursor-pointer text-[#8c8c8c]"
//               >
//                 <span className="text-xl select-none">+</span>
//                 <input
//                   type="file"
//                   multiple
//                   accept="image/*"
//                   ref={fileImagesRef}
//                   onChange={handleImagesChange}
//                   className="hidden"
//                 />
//               </div>
//             </div>
//           </div>

//           {/* ------------ rest of form (title, prices, etc.) ------------ */}
//           {/* ... keep the remainder of the existing form unchanged ... */}

//           {/* ------------ TITLE ------------ */}
//           <div className="grid gap-4 mb-4">
//             <div>
//               <label className="text-[#8c8c8c] text-sm">Deal Title</label>
//               <input
//                 type="text"
//                 value={title}
//                 onChange={(e) => setTitle(e.target.value)}
//                 placeholder="Deal title"
//                 className="border p-2 rounded text-sm w-full text-black"
//               />
//             </div>

//             {/* ------------ Pricing row ------------ */}
//             <div className="flex flex-col md:flex-row gap-4">
//               <div className="flex-1">
//                 <label className="text-[#8c8c8c] text-sm">Market Price</label>
//                 <input
//                   type="text"
//                   value={marketPrice}
//                   onChange={(e) => setMarketPrice(e.target.value)}
//                   placeholder="Market Price"
//                   className="border p-2 rounded text-sm w-full text-black"
//                 />
//               </div>
//               <div className="flex-1">
//                 <label className="text-[#8c8c8c] text-sm">Price per unit</label>
//                 <input
//                   type="text"
//                   value={pricePerUnit}
//                   onChange={(e) => setPricePerUnit(e.target.value)}
//                   placeholder="Price per unit"
//                   className="border p-2 rounded text-sm w-full text-black"
//                 />
//               </div>
//             </div>

//             {/* ------------ Quantity / Supplier row ------------ */}
//             <div className="flex flex-col md:flex-row gap-4">
//               <div className="flex-1">
//                 <label className="text-[#8c8c8c] text-sm">
//                   Minimum order quantity
//                 </label>
//                 <input
//                   type="text"
//                   value={minOrderQty}
//                   onChange={(e) => setMinOrderQty(e.target.value)}
//                   placeholder="Minimum order quantity"
//                   className="border p-2 rounded text-sm w-full text-black"
//                 />
//               </div>
//               <div className="flex-1">
//                 <label className="text-[#8c8c8c] text-sm">
//                   Quantity per buyer
//                 </label>
//                 <input
//                   type="text"
//                   value={quantityOrder}
//                   onChange={(e) => setQuantityOrder(e.target.value)}
//                   placeholder="Quantity per buyer"
//                   className="border p-2 rounded text-sm w-full text-black"
//                 />
//               </div>
//               <div className="flex-1">
//                 <label className="text-[#8c8c8c] text-sm">
//                   Minimum required buyers
//                 </label>
//                 <input
//                   type="text"
//                   value={minBuyers}
//                   onChange={(e) => setMinBuyers(e.target.value)}
//                   placeholder="Min required buyers"
//                   className="border p-2 rounded text-sm w-full text-black"
//                 />
//               </div>
//             </div>

//             {/* ------------ Supplier row ------------ */}
//             <div className="flex flex-col md:flex-row gap-4">
//               <div className="flex-1">
//                 <label className="text-[#8c8c8c] text-sm">Supplier (EN)</label>
//                 <input
//                   type="text"
//                   value={supplierEn}
//                   onChange={(e) => setSupplierEn(e.target.value)}
//                   placeholder="Supplier name in English"
//                   className="border p-2 rounded text-sm w-full text-black"
//                 />
//               </div>
//               <div className="flex-1">
//                 <label className="text-[#8c8c8c] text-sm">Supplier (AR)</label>
//                 <input
//                   type="text"
//                   value={supplierAr}
//                   onChange={(e) => setSupplierAr(e.target.value)}
//                   placeholder="اسم المورد بالعربية"
//                   className="border p-2 rounded text-sm w-full text-black"
//                 />
//               </div>
//             </div>
//           </div>

//           {/* ------------ Delivery Window ------------ */}
//           <div className="mb-4">
//             <label className="text-[#8c8c8c] text-sm">
//               Estimated Delivery Window
//             </label>
//             <input
//               type="text"
//               value={deliveryWindow}
//               onChange={(e) => setDeliveryWindow(e.target.value)}
//               placeholder="Estimated Delivery Window"
//               className="border p-2 rounded text-sm w-full text-black"
//             />
//           </div>

//           {/* ------------ Delivery Area & Dates ------------ */}
//           <div className="flex flex-col md:flex-row gap-4 mb-4">
//             <div className="flex-1">
//               <label className="text-[#8c8c8c] text-sm block">
//                 Delivery Area
//               </label>
//               <input
//                 type="text"
//                 value={deliveryArea}
//                 onChange={(e) => setDeliveryArea(e.target.value)}
//                 className="border p-2 rounded text-sm w-full text-black"
//               />
//             </div>
//             <div className="flex-1">
//               <label className="text-[#8c8c8c] text-sm block">Start Date</label>
//               <input
//                 type="date"
//                 value={startDate}
//                 onChange={(e) => setStartDate(e.target.value)}
//                 className="border p-2 rounded text-sm w-full text-black"
//               />
//             </div>
//             <div className="flex-1">
//               <label className="text-[#8c8c8c] text-sm block">End Date</label>
//               <input
//                 type="date"
//                 value={endDate}
//                 onChange={(e) => setEndDate(e.target.value)}
//                 className="border p-2 rounded text-sm w-full text-black"
//               />
//             </div>
//           </div>

//           {/* ------------ Description ------------ */}
//           <div className="mb-4">
//             <label className="text-[#8c8c8c] text-sm">Description (EN)</label>
//             <textarea
//               value={descriptionEn}
//               onChange={(e) => setDescriptionEn(e.target.value)}
//               placeholder="Add Description"
//               className="border p-2 w-full rounded text-sm text-black"
//               rows={2}
//             />
//           </div>
//           <div className="mb-4">
//             <label className="text-[#8c8c8c] text-sm">الوصف (AR)</label>
//             <textarea
//               value={descriptionAr}
//               onChange={(e) => setDescriptionAr(e.target.value)}
//               placeholder="أضف وصفًا"
//               className="border p-2 w-full rounded text-sm text-black"
//               rows={2}
//             />
//           </div>

//           {/* ------------ Notes ------------ */}
//           <div className="mb-4">
//             <label className="text-[#8c8c8c] text-sm">Add Notes</label>
//             <textarea
//               value={notes}
//               onChange={(e) => setNotes(e.target.value)}
//               placeholder="Add Notes"
//               className="border p-2 w-full rounded text-sm text-black"
//               rows={2}
//             />
//           </div>

//           {/* ------------ Terms ------------ */}
//           <div className="mb-4">
//             <label className="text-[#8c8c8c] text-sm">Terms & Conditions</label>
//             <textarea
//               value={terms}
//               onChange={(e) => setTerms(e.target.value)}
//               placeholder="Add Terms & Conditions"
//               className="border p-2 w-full rounded text-sm text-black"
//               rows={2}
//             />
//           </div>

//           {/* ------------ Payment instructions ------------ */}
//           <div className="mb-4">
//             <label className="text-[#8c8c8c] text-sm">
//               Payment Instructions (EN)
//             </label>
//             <textarea
//               value={paymentEn}
//               onChange={(e) => setPaymentEn(e.target.value)}
//               placeholder="Payment Instructions"
//               className="border p-2 w-full rounded text-sm text-black"
//               rows={2}
//             />
//           </div>
//           <div className="mb-4">
//             <label className="text-[#8c8c8c] text-sm">تعليمات الدفع (AR)</label>
//             <textarea
//               value={paymentAr}
//               onChange={(e) => setPaymentAr(e.target.value)}
//               placeholder="تعليمات الدفع"
//               className="border p-2 w-full rounded text-sm text-black"
//               rows={2}
//             />
//           </div>

//           {/* ------------ Prefilled messages ------------ */}
//           <div className="mb-4">
//             <label className="text-[#8c8c8c] text-sm">
//               Prefilled message (EN)
//             </label>
//             <textarea
//               value={prefillEn}
//               onChange={(e) => setPrefillEn(e.target.value)}
//               placeholder="Prefilled message"
//               className="border p-2 w-full rounded text-sm text-black"
//               rows={2}
//             />
//           </div>
//           <div className="mb-4">
//             <label className="text-[#8c8c8c] text-sm">
//               الرسالة المعبأة مسبقًا (AR)
//             </label>
//             <textarea
//               value={prefillAr}
//               onChange={(e) => setPrefillAr(e.target.value)}
//               placeholder="رسالة واتساب عربية"
//               className="border p-2 w-full rounded text-sm text-black"
//               rows={2}
//             />
//           </div>

//           {/* ------------ WhatsApp share message ------------ */}
//           <div className="mb-4">
//             <label className="text-[#8c8c8c] text-sm">
//               WhatsApp Message (EN)
//             </label>
//             <textarea
//               value={whatsappEn}
//               onChange={(e) => setWhatsappEn(e.target.value)}
//               placeholder="WhatsApp message in English"
//               className="border p-2 w-full rounded text-sm text-black"
//               rows={2}
//             />
//           </div>

//           <div className="mb-4">
//             <label className="text-[#8c8c8c] text-sm">رسالة واتساب (AR)</label>
//             <textarea
//               value={whatsappAr}
//               onChange={(e) => setWhatsappAr(e.target.value)}
//               placeholder="رسالة واتساب بالعربية"
//               className="border p-2 w-full rounded text-sm text-black"
//               rows={2}
//             />
//           </div>

//           {/* ------------ action buttons ------------ */}
//         </div>
//         <div className="flex justify-end gap-3 px-4 py-4">
//           <button
//             onClick={onClose}
//             className="px-4 py-2 border border-gray-400 rounded text-[16px] text-black public-sans"
//           >
//             Cancel
//           </button>
//           <button
//             onClick={handleSubmit}
//             className="px-4 py-2 bg-[#f15525] text-white rounded text-[16px] public-sans"
//           >
//             Save Changes
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default EditDealComponent;




"use client";
import React, { useRef, useState, useEffect } from "react";

const EditDealComponent = ({ deal, onClose, onUpdate }) => {
  /* ---------- refs ---------- */
  const fileFeatureRef = useRef();
  const fileImagesRef = useRef();

  /* ---------- state ---------- */
  const [imagePreview, setImagePreview] = useState(null);
  const [featureImage, setFeatureImage] = useState(null);
  const [images, setImages] = useState([]);

  const [title, setTitle] = useState("");
  const [marketPrice, setMarketPrice] = useState("");
  const [pricePerUnit, setPricePerUnit] = useState("");
  const [minOrderQty, setMinOrderQty] = useState("");
  const [quantityOrder, setQuantityOrder] = useState("");
  const [minBuyers, setMinBuyers] = useState("");

  const [supplierEn, setSupplierEn] = useState("");
  const [supplierAr, setSupplierAr] = useState("");
  const [paymentEn, setPaymentEn] = useState("");
  const [paymentAr, setPaymentAr] = useState("");
  const [deliveryWindow, setDeliveryWindow] = useState("");
  const [deliveryArea, setDeliveryArea] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState(""); // Fixed: Corrected syntax

  const [descriptionEn, setDescriptionEn] = useState("");
  const [descriptionAr, setDescriptionAr] = useState("");
  const [terms, setTerms] = useState("");
  const [notes, setNotes] = useState("");
  const [whatsappEn, setWhatsappEn] = useState("");
  const [whatsappAr, setWhatsappAr] = useState("");
  const [prefillEn, setPrefillEn] = useState("");
  const [prefillAr, setPrefillAr] = useState("");

  const modalRef = useRef();

  /* ---------- component mount debug ---------- */
  useEffect(() => {
    console.log("🌟 EditDealComponent mounted at 04:35 PM PKT, July 08, 2025 with deal:", deal);
    if (!deal || typeof deal !== "object" || Array.isArray(deal)) {
      console.log("⚠️ Invalid deal prop at 04:35 PM PKT, July 08, 2025:", deal);
      return;
    }

    console.log("✅ Deal loaded at 04:35 PM PKT, July 08, 2025:", deal);

    // Debug each field
    console.log("🟢 title.en:", deal.title?.en);
    console.log("🟢 marketPrice:", deal.marketPrice);
    console.log("🟢 pricePerUnit:", deal.pricePerUnit);
    console.log("🟢 minorder:", deal.minorder);
    console.log("🟢 quantityOrder:", deal.quantityOrder);
    console.log("🟢 minRequiredBuyers:", deal.minRequiredBuyers);
    console.log("🟢 supplier.en:", deal.supplier?.en);
    console.log("🟢 supplier.ar:", deal.supplier?.ar);
    console.log("🟢 description.en:", deal.description?.en);
    console.log("🟢 description.ar:", deal.description?.ar);
    console.log("🟢 termsAndNotes.en:", deal.termsAndNotes?.en);
    console.log("🟢 termsAndNotes.ar:", deal.termsAndNotes?.ar);
    console.log("🟢 paymentInstructions.en:", deal.paymentInstructions?.en);
    console.log("🟢 paymentInstructions.ar:", deal.paymentInstructions?.ar);
    console.log("🟢 whatsappMessages.en:", deal.whatsappMessages?.en);
    console.log("🟢 whatsappMessages.ar:", deal.whatsappMessages?.ar);
    console.log("🟢 prefilledMessages.en:", deal.prefilledMessages?.en);
    console.log("🟢 prefilledMessages.ar:", deal.prefilledMessages?.ar);
    console.log("🟢 deliveryWindow:", deal.deliveryWindow);
    console.log("🟢 location.en:", deal.location?.en);
    console.log("🟢 startDate:", deal.startDate);
    console.log("🟢 endDate:", deal.endDate);
    console.log("🟢 featureImage:", deal.featureImage);
    console.log("🟢 images:", deal.images);

    // Images
    setImagePreview(deal.featureImage || null);
    setFeatureImage(deal.featureImage || null);
    setImages(Array.isArray(deal.images) ? deal.images : []);

    // Basic info
    setTitle(deal.title?.en || "");
    setMarketPrice(deal.marketPrice?.toString() || "");
    setPricePerUnit(deal.pricePerUnit?.toString() || "");
    setMinOrderQty(deal.minorder?.toString() || "");
    setQuantityOrder(deal.quantityOrder?.toString() || "");
    setMinBuyers(deal.minRequiredBuyers?.toString() || "");

    // Supplier
    setSupplierEn(deal.supplier?.en || "");
    setSupplierAr(deal.supplier?.ar || "");

    // Description
    setDescriptionEn(deal.description?.en || "");
    setDescriptionAr(deal.description?.ar || "");

    // Terms and Notes
    setTerms(deal.termsAndNotes?.en || "");
    setNotes(deal.termsAndNotes?.ar || "");

    // Payment instructions
    setPaymentEn(deal.paymentInstructions?.en || "");
    setPaymentAr(deal.paymentInstructions?.ar || "");

    // WhatsApp messages
    setWhatsappEn(deal.whatsappMessages?.en || "");
    setWhatsappAr(deal.whatsappMessages?.ar || "");

    // Prefilled messages
    setPrefillEn(deal.prefilledMessages?.en || "");
    setPrefillAr(deal.prefilledMessages?.ar || "");

    // Delivery and dates
    setDeliveryWindow(deal.deliveryWindow?.toString() || "");
    setDeliveryArea(deal.location?.en || "");

    // Date formatting
    const formatDate = (dateString) => {
      if (!dateString) return "";
      const date = new Date(dateString);
      return isNaN(date.getTime()) ? "" : date.toISOString().slice(0, 10);
    };
    setStartDate(formatDate(deal.startDate));
    setEndDate(formatDate(deal.endDate));
  }, [deal]);

  /* ---------- handlers ---------- */
  const triggerFeatureInput = () => fileFeatureRef.current?.click();
  const triggerImagesInput = () => fileImagesRef.current?.click();

  const handleFeatureChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setFeatureImage(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleRemoveFeature = () => {
    setFeatureImage(null);
    setImagePreview(null);
    if (fileFeatureRef.current) fileFeatureRef.current.value = null;
  };

  const handleImagesChange = (e) => {
    const newFiles = Array.from(e.target.files || []);
    setImages((prev) => [...prev, ...newFiles]);
    if (fileImagesRef.current) fileImagesRef.current.value = null;
  };

  const removeImage = (idx) => {
    setImages((prev) => prev.filter((_, i) => i !== idx));
  };

  /* ---------- submit ---------- */
  const handleSubmit = async () => {
    try {
      const token = localStorage.getItem("authToken");
      if (!token) return alert("Please log in first.");

      const formData = new FormData();

      // Text fields
      formData.append("titleEn", title);
      formData.append("titleAr", title);
      formData.append("locationEn", deliveryArea || "Riyadh, Saudi Arabia");
      formData.append("locationAr", "الرياض، السعودية");
      formData.append("minorder", String(minOrderQty));
      formData.append("minRequiredBuyers", String(minBuyers));
      formData.append("quantityOrder", String(quantityOrder));
      formData.append("pricePerUnit", pricePerUnit);
      formData.append("supplierEn", supplierEn);
      formData.append("supplierAr", supplierAr);
      formData.append("descriptionEn", descriptionEn);
      formData.append("descriptionAr", descriptionAr);

      // Use correct API keys
      formData.append("termsAndNotesEn", terms);
      formData.append("termsAndNotesAr", notes);
      formData.append("paymentInstructionsEn", paymentEn);
      formData.append("paymentInstructionsAr", paymentAr);
      formData.append("prefilledMessagesEn", prefillEn);
      formData.append("prefilledMessagesAr", prefillAr);
      formData.append("whatsappMessagesEn", whatsappEn);
      formData.append("whatsappMessagesAr", whatsappAr);

      formData.append("deliveryWindow", deliveryWindow);
      formData.append("startDate", startDate);
      formData.append("endDate", endDate);

      // Feature image
      if (featureImage instanceof File) {
        formData.append("featureImage", featureImage);
      }

      // If feature image was removed
      if (!featureImage) {
        formData.append("removeFeatureImage", "true");
      }

      // Append newly selected images
      images.forEach((img) => {
        if (img instanceof File) formData.append("images", img);
      });

      // Keep existing image URLs
      const keptImageUrls = images.filter((img) => typeof img === "string");
      formData.append("existingImages", JSON.stringify(keptImageUrls));

      const res = await fetch(
        `https://scale-gold.vercel.app/api/items/Updateitems/${deal._id}`,
        {
          method: "PUT",
          headers: { Authorization: `Bearer ${token}` },
          body: formData,
        }
      );

      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.message || `Error ${res.status}`);
      console.log("data here", data);

      alert("Deal updated successfully!");
      if (onUpdate) onUpdate();
      onClose();
    } catch (err) {
      alert(err.message);
    }
  };

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
  }, [onClose]);

  /* ---------- JSX ---------- */
  return (
    <div
      className="fixed inset-0 flex justify-center items-center z-50 px-4"
      style={{ backgroundColor: "rgba(0,0,0,0.8)" }}
    >
      <div
        className="bg-white w-full max-w-[610px] max-h-[90vh] overflow-y-auto rounded-sm"
        ref={modalRef}
      >
        <h2 className="text-xl mb-4 font-medium border-b border-gray-300 px-4 py-3 text-black">
          Edit Deal
        </h2>

        <div className="bg-white m-4 p-4 border border-gray-300 rounded-sm relative">
          {/* ---------- Feature Image ---------- */}
          <div className="flex items-center gap-4 mb-6 justify-center">
            {imagePreview && (
              <div className="relative w-28 h-28 border-2 border-gray-300 rounded flex items-center justify-center overflow-hidden">
                <div
                  className="relative w-24 h-24 bg-gray-100 rounded flex items-center justify-center overflow-hidden"
                  style={{ boxShadow: "inset 0px 0px 8px rgba(0,0,0,0.4)" }}
                >
                  <img
                    src={imagePreview}
                    alt="preview"
                    className="object-contain w-20 h-20"
                  />
                  <button
                    type="button"
                    onClick={handleRemoveFeature}
                    className="absolute -top-1 -right-1 bg-red-600 text-white rounded-full w-5 h-5 text-xs flex items-center justify-center"
                  >
                    ×
                  </button>
                </div>
              </div>
            )}
            <div
              onClick={triggerFeatureInput}
              className="w-28 h-28 border-2 border-dashed border-gray-300 rounded flex items-center justify-center cursor-pointer text-[#8c8c8c]"
            >
              <div className="text-center select-none">
                <div className="text-xl font-semibold">+</div>
                <div className="text-sm">Upload</div>
              </div>
              <input
                type="file"
                accept="image/*"
                ref={fileFeatureRef}
                onChange={handleFeatureChange}
                className="hidden"
              />
            </div>
          </div>

          {/* ---------- Extra Images Grid ---------- */}
          <div className="mb-6">
            <div className="flex flex-wrap gap-2 justify-center">
              {images.map((img, idx) => (
                <div
                  key={idx}
                  className="relative w-10 h-10 border border-gray-300 rounded overflow-hidden"
                  style={{ boxShadow: "inset 0px 0px 8px rgba(0,0,0,0.4)" }}
                >
                  <img
                    src={
                      typeof img === "string" ? img : URL.createObjectURL(img)
                    }
                    alt={`img-${idx}`}
                    className="object-contain flex items-center justify-center w-8 h-8"
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(idx)}
                    className="absolute -top-0 -right-0 bg-red-600 text-white rounded-full w-3 h-3 text-xs flex items-center justify-center"
                  >
                    ×
                  </button>
                </div>
              ))}
              <div
                onClick={triggerImagesInput}
                className="w-10 h-10 border-2 border-dashed border-gray-300 rounded flex items-center justify-center cursor-pointer text-[#8c8c8c]"
              >
                <span className="text-xl select-none">+</span>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  ref={fileImagesRef}
                  onChange={handleImagesChange}
                  className="hidden"
                />
              </div>
            </div>
          </div>

          {/* ------------ TITLE ------------ */}
          <div className="grid gap-6 mb-6">
            <div>
              <label className="text-[#8c8c8c] text-sm">Deal Title</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Deal title"
                className="border p-2 rounded text-sm w-full text-black"
              />
            </div>

            {/* ------------ Pricing row ------------ */}
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <label className="text-[#8c8c8c] text-sm">Market Price</label>
                <input
                  type="text"
                  value={marketPrice}
                  onChange={(e) => setMarketPrice(e.target.value)}
                  placeholder="Market Price"
                  className="border p-2 rounded text-sm w-full text-black"
                />
              </div>
              <div className="flex-1">
                <label className="text-[#8c8c8c] text-sm">Price per unit</label>
                <input
                  type="text"
                  value={pricePerUnit}
                  onChange={(e) => setPricePerUnit(e.target.value)}
                  placeholder="Price per unit"
                  className="border p-2 rounded text-sm w-full text-black"
                />
              </div>
            </div>

            {/* ------------ Quantity / Supplier row ------------ */}
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <label className="text-[#8c8c8c] text-sm">
                  Minimum order quantity
                </label>
                <input
                  type="text"
                  value={minOrderQty}
                  onChange={(e) => setMinOrderQty(e.target.value)}
                  placeholder="Minimum order quantity"
                  className="border p-2 rounded text-sm w-full text-black"
                />
              </div>
              <div className="flex-1">
                <label className="text-[#8c8c8c] text-sm">
                  Quantity per buyer
                </label>
                <input
                  type="text"
                  value={quantityOrder}
                  onChange={(e) => setQuantityOrder(e.target.value)}
                  placeholder="Quantity per buyer"
                  className="border p-2 rounded text-sm w-full text-black"
                />
              </div>
              <div className="flex-1">
                <label className="text-[#8c8c8c] text-sm">
                  Minimum required buyers
                </label>
                <input
                  type="text"
                  value={minBuyers}
                  onChange={(e) => setMinBuyers(e.target.value)}
                  placeholder="Min required buyers"
                  className="border p-2 rounded text-sm w-full text-black"
                />
              </div>
            </div>

            {/* ------------ Supplier row ------------ */}
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <label className="text-[#8c8c8c] text-sm">Supplier (EN)</label>
                <input
                  type="text"
                  value={supplierEn}
                  onChange={(e) => setSupplierEn(e.target.value)}
                  placeholder="Supplier name in English"
                  className="border p-2 rounded text-sm w-full text-black"
                />
              </div>
              <div className="flex-1">
                <label className="text-[#8c8c8c] text-sm">Supplier (AR)</label>
                <input
                  type="text"
                  value={supplierAr}
                  onChange={(e) => setSupplierAr(e.target.value)}
                  placeholder="اسم المورد بالعربية"
                  className="border p-2 rounded text-sm w-full text-black"
                />
              </div>
            </div>
          </div>

          {/* ------------ Delivery Window ------------ */}
          <div className="mb-6">
            <label className="text-[#8c8c8c] text-sm">
              Estimated Delivery Window
            </label>
            <input
              type="text"
              value={deliveryWindow}
              onChange={(e) => setDeliveryWindow(e.target.value)}
              placeholder="Estimated Delivery Window"
              className="border p-2 rounded text-sm w-full text-black"
            />
          </div>

          {/* ------------ Delivery Area & Dates ------------ */}
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1">
              <label className="text-[#8c8c8c] text-sm block">Delivery Area</label>
              <input
                type="text"
                value={deliveryArea}
                onChange={(e) => setDeliveryArea(e.target.value)}
                className="border p-2 rounded text-sm w-full text-black"
              />
            </div>
            <div className="flex-1">
              <label className="text-[#8c8c8c] text-sm block">Start Date</label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="border p-2 rounded text-sm w-full text-black"
              />
            </div>
            <div className="flex-1">
              <label className="text-[#8c8c8c] text-sm block">End Date</label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="border p-2 rounded text-sm w-full text-black"
              />
            </div>
          </div>

          {/* ------------ Description ------------ */}
          <div className="mb-6">
            <label className="text-[#8c8c8c] text-sm">Description (EN)</label>
            <textarea
              value={descriptionEn}
              onChange={(e) => setDescriptionEn(e.target.value)}
              placeholder="Add Description"
              className="border p-2 w-full rounded text-sm text-black"
              rows={2}
            />
          </div>
          <div className="mb-6">
            <label className="text-[#8c8c8c] text-sm">الوصف (AR)</label>
            <textarea
              value={descriptionAr}
              onChange={(e) => setDescriptionAr(e.target.value)}
              placeholder="أضف وصفًا"
              className="border p-2 w-full rounded text-sm text-black"
              rows={2}
            />
          </div>

          {/* ------------ Notes ------------ */}
          <div className="mb-6">
            <label className="text-[#8c8c8c] text-sm">Add Notes</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add Notes"
              className="border p-2 w-full rounded text-sm text-black"
              rows={2}
            />
          </div>

          {/* ------------ Terms ------------ */}
          <div className="mb-6">
            <label className="text-[#8c8c8c] text-sm">Terms & Conditions</label>
            <textarea
              value={terms}
              onChange={(e) => setTerms(e.target.value)}
              placeholder="Add Terms & Conditions"
              className="border p-2 w-full rounded text-sm text-black"
              rows={2}
            />
          </div>

          {/* ------------ Payment instructions ------------ */}
          <div className="mb-6">
            <label className="text-[#8c8c8c] text-sm">
              Payment Instructions (EN)
            </label>
            <textarea
              value={paymentEn}
              onChange={(e) => setPaymentEn(e.target.value)}
              placeholder="Payment Instructions"
              className="border p-2 w-full rounded text-sm text-black"
              rows={2}
            />
          </div>
          <div className="mb-6">
            <label className="text-[#8c8c8c] text-sm">تعليمات الدفع (AR)</label>
            <textarea
              value={paymentAr}
              onChange={(e) => setPaymentAr(e.target.value)}
              placeholder="تعليمات الدفع"
              className="border p-2 w-full rounded text-sm text-black"
              rows={2}
            />
          </div>

          {/* ------------ Prefilled messages ------------ */}
          <div className="mb-6">
            <label className="text-[#8c8c8c] text-sm">
              Prefilled message (EN)
            </label>
            <textarea
              value={prefillEn}
              onChange={(e) => setPrefillEn(e.target.value)}
              placeholder="Prefilled message"
              className="border p-2 w-full rounded text-sm text-black"
              rows={2}
            />
          </div>
          <div className="mb-6">
            <label className="text-[#8c8c8c] text-sm">
              الرسالة المعبأة مسبقًا (AR)
            </label>
            <textarea
              value={prefillAr}
              onChange={(e) => setPrefillAr(e.target.value)}
              placeholder="رسالة واتساب عربية"
              className="border p-2 w-full rounded text-sm text-black"
              rows={2}
            />
          </div>

          {/* ------------ WhatsApp share message ------------ */}
          <div className="mb-6">
            <label className="text-[#8c8c8c] text-sm">
              WhatsApp Message (EN)
            </label>
            <textarea
              value={whatsappEn}
              onChange={(e) => setWhatsappEn(e.target.value)}
              placeholder="WhatsApp message in English"
              className="border p-2 w-full rounded text-sm text-black"
              rows={2}
            />
          </div>

          <div className="mb-6">
            <label className="text-[#8c8c8c] text-sm">رسالة واتساب (AR)</label>
            <textarea
              value={whatsappAr}
              onChange={(e) => setWhatsappAr(e.target.value)}
              placeholder="رسالة واتساب بالعربية"
              className="border p-2 w-full rounded text-sm text-black"
              rows={2}
            />
          </div>
        </div>

        <div className="flex justify-end gap-3 px-4 py-4">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-400 rounded text-[16px] text-black"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-[#f15525] text-white rounded text-[16px]"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditDealComponent;