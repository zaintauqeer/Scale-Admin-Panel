// components/EditDealComponent.jsx
"use client";
import React, { useRef, useState, useEffect } from "react";

const EditDealComponent = ({ deal, onClose, onUpdate }) => {
  /* ---------- refs ---------- */
  const fileFeatureRef = useRef();
  const fileImagesRef = useRef();

  /* ---------- state ---------- */
  const [imagePreview, setImagePreview] = useState(null); // preview for feature image
  const [featureImage, setFeatureImage] = useState(null); // File | URL | null
  const [images, setImages] = useState([]); // array of File | URL (strings)

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
  const [endDate, setEndDate] = useState("");

  const [descriptionEn, setDescriptionEn] = useState("");
  const [descriptionAr, setDescriptionAr] = useState("");
  const [terms, setTerms] = useState("");
  const [notes, setNotes] = useState("");
  const [whatsappEn, setWhatsappEn] = useState("");
  const [whatsappAr, setWhatsappAr] = useState("");
  const [prefillEn, setPrefillEn] = useState("");
  const [prefillAr, setPrefillAr] = useState("");

  const modalRef = useRef();
  /* ---------- populate initial data ---------- */
  useEffect(() => {
    if (!deal) return;

    setImagePreview(deal.featureImage || null);
    setFeatureImage(deal.featureImage || null);
    setImages(Array.isArray(deal.images) ? deal.images : []);

    setTitle(deal.title?.en || "");
    setMarketPrice(deal.marketPrice || "");
    setPricePerUnit(deal.pricePerUnit || "");
    setMinOrderQty(deal.minorder || "");
    setQuantityOrder(deal.quantityOrder || "");
    setMinBuyers(deal.minRequiredBuyers || "");

    setSupplierEn(deal.supplier?.en || "");
    setSupplierAr(deal.supplier?.ar || "");

    setDescriptionEn(deal.description?.en || "");
    setDescriptionAr(deal.description?.ar || "");
    setTerms(deal.terms?.en || "");
    setNotes(deal.notes || "");

    setPaymentEn(deal.payment?.en || "");
    setPaymentAr(deal.payment?.ar || "");
    setWhatsappEn(deal.whatsapp?.en || "");
    setWhatsappAr(deal.whatsapp?.ar || "");
    setPrefillEn(deal.prefill?.en || "");
    setPrefillAr(deal.prefill?.ar || "");

    setDeliveryWindow(deal.deliveryWindow || "");
    setDeliveryArea(deal.deliveryArea || "");
    setStartDate(deal.startDate?.slice(0, 10) || "");
    setEndDate(deal.endDate?.slice(0, 10) || "");
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
    if (fileImagesRef.current) fileImagesRef.current.value = null; // reset input
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

      // text fields
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
      formData.append("termsEn", terms);
      formData.append("termsAr", terms);
      formData.append("startDate", startDate);
      formData.append("endDate", endDate);
      formData.append("paymentEn", paymentEn);
      formData.append("paymentAr", paymentAr);
      formData.append("whatsappEn", whatsappEn);
      formData.append("whatsappAr", whatsappAr);
      formData.append("prefillEn", prefillEn);
      formData.append("prefillAr", prefillAr);
      formData.append("deliveryWindow", deliveryWindow);
      formData.append("deliveryArea", deliveryArea);

      // feature image: only if user selected a new File
      if (featureImage instanceof File)
        formData.append("featureImage", featureImage);
      // indicate if feature image was removed
      if (!featureImage) formData.append("removeFeatureImage", "true");

      // images array: append all File instances
      images.forEach((img) => {
        if (img instanceof File) formData.append("images", img);
      });
      // send remaining (kept) existing image URLs as JSON
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
        onClose(); // ✅ call the correct prop function
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

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
        <h2 className="text-xl mb-4 font-semibold border-b border-gray-300 px-3 py-2">
          Edit Deal
        </h2>

        <div className="bg-white m-4 p-4 border border-gray-300 rounded-sm relative">
          {/* ---------- Feature Image ---------- */}
          <div className="flex items-center gap-4 mb-2 justify-center">
            {/* preview */}
            {imagePreview && (
              <div className="relative w-28 h-28 border-2 border-gray-300 rounded flex items-center justify-center overflow-hidden">
                <div
                  className="relative w-24 h-24 bg-gray-1s00 rounded flex items-center justify-center overflow-hidden"
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
            {/* upload */}
            <div
              onClick={triggerFeatureInput}
              className="w-28 h-28 border-2 border-dashed border-gray-300 rounded flex items-center justify-center cursor-pointer text-gray-400"
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
          <div className="mb-4">
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
              {/* add more */}
              <div
                onClick={triggerImagesInput}
                className="w-10 h-10 border-2 border-dashed border-gray-300 rounded flex items-center justify-center cursor-pointer text-gray-400"
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

          {/* ------------ rest of form (title, prices, etc.) ------------ */}
          {/* ... keep the remainder of the existing form unchanged ... */}

          {/* ------------ TITLE ------------ */}
          <div className="grid gap-4 mb-4">
            <div>
              <label className="text-gray-400 text-sm">Deal Title</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Deal title"
                className="border p-2 rounded text-sm w-full"
              />
            </div>

            {/* ------------ Pricing row ------------ */}
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <label className="text-gray-400 text-sm">Market Price</label>
                <input
                  type="text"
                  value={marketPrice}
                  onChange={(e) => setMarketPrice(e.target.value)}
                  placeholder="Market Price"
                  className="border p-2 rounded text-sm w-full"
                />
              </div>
              <div className="flex-1">
                <label className="text-gray-400 text-sm">Price per unit</label>
                <input
                  type="text"
                  value={pricePerUnit}
                  onChange={(e) => setPricePerUnit(e.target.value)}
                  placeholder="Price per unit"
                  className="border p-2 rounded text-sm w-full"
                />
              </div>
            </div>

            {/* ------------ Quantity / Supplier row ------------ */}
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <label className="text-gray-400 text-sm">
                  Minimum order quantity
                </label>
                <input
                  type="text"
                  value={minOrderQty}
                  onChange={(e) => setMinOrderQty(e.target.value)}
                  placeholder="Minimum order quantity"
                  className="border p-2 rounded text-sm w-full"
                />
              </div>
              <div className="flex-1">
                <label className="text-gray-400 text-sm">
                  Quantity per buyer
                </label>
                <input
                  type="text"
                  value={quantityOrder}
                  onChange={(e) => setQuantityOrder(e.target.value)}
                  placeholder="Quantity per buyer"
                  className="border p-2 rounded text-sm w-full"
                />
              </div>
              <div className="flex-1">
                <label className="text-gray-400 text-sm">
                  Minimum required buyers
                </label>
                <input
                  type="text"
                  value={minBuyers}
                  onChange={(e) => setMinBuyers(e.target.value)}
                  placeholder="Min required buyers"
                  className="border p-2 rounded text-sm w-full"
                />
              </div>
            </div>

            {/* ------------ Supplier row ------------ */}
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <label className="text-gray-400 text-sm">Supplier (EN)</label>
                <input
                  type="text"
                  value={supplierEn}
                  onChange={(e) => setSupplierEn(e.target.value)}
                  placeholder="Supplier name in English"
                  className="border p-2 rounded text-sm w-full"
                />
              </div>
              <div className="flex-1">
                <label className="text-gray-400 text-sm">Supplier (AR)</label>
                <input
                  type="text"
                  value={supplierAr}
                  onChange={(e) => setSupplierAr(e.target.value)}
                  placeholder="اسم المورد بالعربية"
                  className="border p-2 rounded text-sm w-full"
                />
              </div>
            </div>
          </div>

          {/* ------------ Delivery Window ------------ */}
          <div className="mb-4">
            <label className="text-gray-400 text-sm">
              Estimated Delivery Window
            </label>
            <input
              type="text"
              value={deliveryWindow}
              onChange={(e) => setDeliveryWindow(e.target.value)}
              placeholder="Estimated Delivery Window"
              className="border p-2 rounded text-sm w-full"
            />
          </div>

          {/* ------------ Delivery Area & Dates ------------ */}
          <div className="flex flex-col md:flex-row gap-4 mb-4">
            <div className="flex-1">
              <label className="text-gray-400 text-sm block">
                Delivery Area
              </label>
              <input
                type="text"
                value={deliveryArea}
                onChange={(e) => setDeliveryArea(e.target.value)}
                className="border p-2 rounded text-sm w-full text-gray-400"
              />
            </div>
            <div className="flex-1">
              <label className="text-gray-400 text-sm block">Start Date</label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="border p-2 rounded text-sm w-full text-gray-400"
              />
            </div>
            <div className="flex-1">
              <label className="text-gray-400 text-sm block">End Date</label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="border p-2 rounded text-sm w-full text-gray-400"
              />
            </div>
          </div>

          {/* ------------ Description ------------ */}
          <div className="mb-4">
            <label className="text-gray-400 text-sm">Description (EN)</label>
            <textarea
              value={descriptionEn}
              onChange={(e) => setDescriptionEn(e.target.value)}
              placeholder="Add Description"
              className="border p-2 w-full rounded text-sm"
              rows={2}
            />
          </div>
          <div className="mb-4">
            <label className="text-gray-400 text-sm">الوصف (AR)</label>
            <textarea
              value={descriptionAr}
              onChange={(e) => setDescriptionAr(e.target.value)}
              placeholder="أضف وصفًا"
              className="border p-2 w-full rounded text-sm"
              rows={2}
            />
          </div>

          {/* ------------ Notes ------------ */}
          <div className="mb-4">
            <label className="text-gray-400 text-sm">Add Notes</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add Notes"
              className="border p-2 w-full rounded text-sm"
              rows={2}
            />
          </div>

          {/* ------------ Terms ------------ */}
          <div className="mb-4">
            <label className="text-gray-400 text-sm">Terms & Conditions</label>
            <textarea
              value={terms}
              onChange={(e) => setTerms(e.target.value)}
              placeholder="Add Terms & Conditions"
              className="border p-2 w-full rounded text-sm"
              rows={2}
            />
          </div>

          {/* ------------ Payment instructions ------------ */}
          <div className="mb-4">
            <label className="text-gray-400 text-sm">
              Payment Instructions (EN)
            </label>
            <textarea
              value={paymentEn}
              onChange={(e) => setPaymentEn(e.target.value)}
              placeholder="Payment Instructions"
              className="border p-2 w-full rounded text-sm"
              rows={2}
            />
          </div>
          <div className="mb-4">
            <label className="text-gray-400 text-sm">تعليمات الدفع (AR)</label>
            <textarea
              value={paymentAr}
              onChange={(e) => setPaymentAr(e.target.value)}
              placeholder="تعليمات الدفع"
              className="border p-2 w-full rounded text-sm"
              rows={2}
            />
          </div>

          {/* ------------ Prefilled messages ------------ */}
          <div className="mb-4">
            <label className="text-gray-400 text-sm">
              Prefilled message (EN)
            </label>
            <textarea
              value={prefillEn}
              onChange={(e) => setPrefillEn(e.target.value)}
              placeholder="Prefilled message"
              className="border p-2 w-full rounded text-sm"
              rows={2}
            />
          </div>
          <div className="mb-4">
            <label className="text-gray-400 text-sm">
              الرسالة المعبأة مسبقًا (AR)
            </label>
            <textarea
              value={prefillAr}
              onChange={(e) => setPrefillAr(e.target.value)}
              placeholder="رسالة واتساب عربية"
              className="border p-2 w-full rounded text-sm"
              rows={2}
            />
          </div>

          {/* ------------ WhatsApp share message ------------ */}
          <div className="mb-4">
            <label className="text-gray-400 text-sm">
              WhatsApp Message (EN)
            </label>
            <textarea
              value={whatsappEn}
              onChange={(e) => setWhatsappEn(e.target.value)}
              placeholder="WhatsApp message in English"
              className="border p-2 w-full rounded text-sm"
              rows={2}
            />
          </div>

          <div className="mb-4">
            <label className="text-gray-400 text-sm">رسالة واتساب (AR)</label>
            <textarea
              value={whatsappAr}
              onChange={(e) => setWhatsappAr(e.target.value)}
              placeholder="رسالة واتساب بالعربية"
              className="border p-2 w-full rounded text-sm"
              rows={2}
            />
          </div>

          {/* ------------ action buttons ------------ */}
        </div>
        <div className="flex justify-end gap-3 px-4 py-4">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-400 rounded text-[16px]"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-[#f15525] text-white rounded text-[16px]"
          >
            Update Deal
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditDealComponent;
